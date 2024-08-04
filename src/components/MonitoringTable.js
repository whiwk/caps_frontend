import React, { useState, useEffect, useContext, useRef } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { Alert, Snackbar } from '@mui/material';
import api from '../services/apiService';
import './MonitoringTable.css';
import DataContext from '../contexts/DataContext';
import apiConfig from '../config/apiConfig';

const initialRepositories = [
  { content: 'L1 TX processing', value: '', count: '', totalTime: '' },
  { content: 'ULSCH encoding', value: '', count: '', totalTime: '' },
  { content: 'L1 RX processing', value: '', count: '', totalTime: '' },
  { content: 'UL Indication', value: '', count: '', totalTime: '' },
  { content: 'PDSCH receiver', value: '', count: '', totalTime: '' },
  { content: 'PDSCH decoding', value: '', count: '', totalTime: '' },
  { content: '-> Deinterleive', value: '', count: '', totalTime: '' },
  { content: '-> Rate Unmatch', value: '', count: '', totalTime: '' },
  { content: '->  LDPC Decode', value: '', count: '', totalTime: '' },
  { content: 'PDSCH unscrambling', value: '', count: '', totalTime: '' },
  { content: 'PDCCH handling', value: '', count: '', totalTime: '' }
];

export const MonitoringTable = () => {
  const [repositories, setRepositories] = useState(initialRepositories);
  const { setData, setUeStopped } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const websocketRef = useRef(null);
  const websocketErrorCount = useRef(0);
  const intervalRef = useRef(null);
  const RECONNECT_INTERVAL = 5000; // Time in milliseconds

  const closeWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
  };

  const reconnectWebSocket = () => {
    const fetchData = async () => {
      try {
        const podsResponse = await api.get('kube/pods/');
        const podsData = podsResponse.data.pods;

        if (!Array.isArray(podsData) || podsData.length === 0) {
          throw new Error('No pods data found.');
        }

        const uePod = podsData.find(pod => pod.name.includes('oai-nr-ue'));

        if (!uePod) {
          throw new Error('No UE pod found for the user.');
        }

        if (uePod.state !== 'Running') {
          setAlertMessage('UE still not configured correctly');
          setAlertSeverity('warning');
          setSnackbarOpen(true);

          const zeroRepositories = initialRepositories.map(repo => ({ ...repo, value: '0', count: '0', totalTime: '0' }));
          setRepositories(zeroRepositories);

          const zeroGraphData = zeroRepositories.map(repo => ({
            name: repo.content,
            value: 0
          }));

          setData(zeroGraphData);
          setUeStopped(true);
          setLoading(false);
          return;
        } else {
          setSnackbarOpen(false);
          setUeStopped(false);
        }

        const podName = uePod.name;
        const namespace = uePod.namespace;

        closeWebSocket();

        const ws = new WebSocket(`${apiConfig.wsURL}ws/monitoring/`);
        websocketRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({ pod_name: podName, namespace: namespace }));
          websocketErrorCount.current = 0;

          intervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ pod_name: podName, namespace: namespace }));
            }
          }, 5000);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.error) {
            console.error('WebSocket error:', data.error);
            setAlertMessage(data.error);
            setAlertSeverity('error');
            setSnackbarOpen(true);
            websocketErrorCount.current++;
            return;
          }

          if (data.monitoring_output) {
            setRepositories((prevRepositories) => {
              const updatedRepositories = prevRepositories.map(repo => {
                const regex = new RegExp(`\\s*${repo.content.replace('->', '\\->')}\\s*:\\s*([\\d\\.]+)\\s*us;\\s*(\\d+);\\s*([\\d\\.]+)\\s*us;`);
                const match = data.monitoring_output.match(regex);
                const value = match ? match[1] : repo.value;
                const count = match ? match[2] : repo.count;
                const totalTime = match ? match[3] : repo.totalTime;
                return {
                  ...repo,
                  value: value,
                  count: count,
                  totalTime: totalTime
                };
              });

              const graphData = updatedRepositories.map(repo => ({
                name: repo.content,
                value: parseFloat(repo.value) || 0
              }));

              setData(graphData);
              return updatedRepositories;
            });

            setUeStopped(false);
            websocketErrorCount.current = 0;
          }
        };

        ws.onclose = () => {
          clearInterval(intervalRef.current);
          setTimeout(reconnectWebSocket, RECONNECT_INTERVAL);
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          if (websocketErrorCount.current < 3) {
            setAlertMessage('Transient WebSocket error, attempting to reconnect...');
            setAlertSeverity('warning');
          } else {
            setAlertMessage('Persistent WebSocket error');
            setAlertSeverity('error');
          }
          setSnackbarOpen(true);
          websocketErrorCount.current++;
          ws.close(); // Ensure WebSocket is closed to trigger onclose
        };

      } catch (error) {
        console.error('Error fetching UE log:', error);
        setRepositories(repositories.map(repo => ({ ...repo, value: repo.value || null, count: repo.count || null, totalTime: repo.totalTime || null })));
        setAlertMessage('Failed to fetch log data: ' + (error.response ? error.response.data.detail : 'UE currently stopped'));
        setAlertSeverity('error');
        setSnackbarOpen(true);
        setUeStopped(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  useEffect(() => {
    reconnectWebSocket();

    return () => {
      closeWebSocket();
      clearInterval(intervalRef.current);
    };
  }, [setData, setUeStopped]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      window.location.href = event.target.location.href;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      closeWebSocket();
      clearInterval(intervalRef.current);
    };
  }, []);

  const columnNames = {
    content: 'Key Performance Indicator',
    value: 'Value (us)',
    count: 'Count',
    totalTime: 'Total Time (us)',
  };

  const columnWidths = {
    content: '25%',
    value: '25%',
    count: '25%',
    totalTime: '25%',
  };

  return (
    <div>
      <Table aria-label="Misc table" className="pf-m-compact">
        <Thead noWrap>
          <Tr backgroundColor="#a9a9a9">
            <Th style={{ width: columnWidths.content }} className="title-row-class">{columnNames.content}</Th>
            <Th style={{ width: columnWidths.value }} className="title-row-class">{columnNames.value}</Th>
            <Th style={{ width: columnWidths.count }} className="title-row-class">{columnNames.count}</Th>
            <Th style={{ width: columnWidths.totalTime }} className="title-row-class">{columnNames.totalTime}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {repositories.map((repo, rowIndex) => {
            const isOddRow = (rowIndex + 1) % 2;
            const rowClass = isOddRow ? 'odd-row-class' : 'even-row-class';
            return (
              <Tr key={repo.content} className={rowClass}>
                <Td dataLabel={columnNames.content} colSpan={1}>
                  {repo.content}
                </Td>
                <Td dataLabel={columnNames.value} textLeft>
                  {loading && repo.value === '' ? null : (repo.value === null ? 'null' : repo.value)}
                </Td>
                <Td dataLabel={columnNames.count} textLeft>
                  {loading && repo.count === '' ? null : (repo.count === null ? 'null' : repo.count)}
                </Td>
                <Td dataLabel={columnNames.totalTime} textLeft>
                  {loading && repo.totalTime === '' ? null : (repo.totalTime === null ? 'null' : repo.totalTime)}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={null}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertSeverity}
          variant="filled"
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MonitoringTable;
