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
  const { setData, setUeStopped } = useContext(DataContext); // Get setUeStopped from context
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const websocketRef = useRef(null);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      while (isMounted) {
        setLoading(true);
        try {
          // Fetch the list of pods
          const podsResponse = await api.get('kube/pods/');
          const podsData = podsResponse.data.pods;

          // Check if podsData is an array
          if (!Array.isArray(podsData) || podsData.length === 0) {
            throw new Error('No pods data found.');
          }

          // Find the pod with 'oai-nr-ue' in its name
          const uePod = podsData.find(pod => pod.name.includes('oai-nr-ue'));

          if (!uePod) {
            throw new Error('No UE pod found for the user.');
          }

          // Check if the pod is running
          if (uePod.state !== 'Running') {
            setAlertMessage(`UE still not configured correctly`);
            setAlertSeverity('warning');
            setSnackbarOpen(true);

            // Set repository values to zero
            const zeroRepositories = initialRepositories.map(repo => ({ ...repo, value: '0', count: '0', totalTime: '0' }));
            setRepositories(zeroRepositories);

            // Prepare zero data for the graph
            const zeroGraphData = zeroRepositories.map(repo => ({
              name: repo.content,
              value: 0
            }));

            setData(zeroGraphData); // Update the context with zero data
            setUeStopped(true); // Update the context to indicate UE is stopped
            setLoading(false);
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds before checking again
            continue;
          } else {
            setSnackbarOpen(false); // Close Snackbar if pod is running
            setUeStopped(false); // Update the context to indicate UE is running
          }

          const podName = uePod.name;
          const namespace = uePod.namespace;

          // Establish WebSocket connection and send initial data
          const ws = new WebSocket(`${apiConfig.wsURL}ws/monitoring/`);
          websocketRef.current = ws;

          ws.onopen = () => {
            console.log('WebSocket connected');
            ws.send(JSON.stringify({ pod_name: podName, namespace: namespace }));
          };

          ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            if (data.error) {
              console.error('WebSocket error:', data.error);
              setAlertMessage(data.error);
              setAlertSeverity('error');
              setSnackbarOpen(true);
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

                // Prepare data for the graph
                const graphData = updatedRepositories.map(repo => ({
                  name: repo.content,
                  value: parseFloat(repo.value) || 0
                }));

                setData(graphData); // Update the context with the new data
                return updatedRepositories;
              });

              setUeStopped(false); // Update the context to indicate UE is running
            }
          };

          ws.onclose = () => {
            console.log('WebSocket disconnected');
          };

          ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setAlertMessage('WebSocket error');
            setAlertSeverity('error');
            setSnackbarOpen(true);
          };

          // Cleanup on component unmount
          return () => {
            if (ws) {
              ws.close();
            }
          };
        } catch (error) {
          console.error('Error fetching UE log:', error);
          setRepositories(repositories.map(repo => ({ ...repo, value: repo.value || null, count: repo.count || null, totalTime: repo.totalTime || null })));
          setAlertMessage('Failed to fetch log data: ' + (error.response ? error.response.data.detail : 'UE currently stopped'));
          setAlertSeverity('error');
          setSnackbarOpen(true);
          setUeStopped(true); // Update the context to indicate UE is stopped on error
        } finally {
          setLoading(false);
        }

        // Wait for 2 seconds before fetching data again
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    };

    fetchData();

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, [repositories, setData, setUeStopped]);

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
