import React, { useState, useEffect } from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import api from '../services/apiService';
import { CircularProgress, Alert, Snackbar } from '@mui/material';
import './Table.css';

export const TableMisc = () => {
  const [repositories, setRepositories] = useState([
    { content: 'L1 TX processing', value: '' }, 
    { content: 'ULSCH encoding', value: '' }, 
    { content: 'L1 RX processing', value: '' }, 
    { content: '-> Rate Unmatch', value: '' }, 
    { content: '->  LDPC Decode', value: '' }, 
    { content: 'PDSCH unscrambling', value: '' }, 
    { content: 'PDCCH handling', value: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('info');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchData = async () => {
      while (isMounted) {
        setLoading(true);
        try {
          // console.log('Fetching list of pods...');
          // Step 1: Fetch the list of pods
          const podsResponse = await api.get('kube/pods/');
          // console.log('Pods response:', podsResponse.data); // Log the response to inspect its structure

          const podsData = podsResponse.data.pods; // Extract the array of pods from the response
          // console.log('Extracted pods data:', podsData);

          // Check if podsData is an array
          if (!Array.isArray(podsData) || podsData.length === 0) {
            throw new Error('No pods data found.');
          }

          // Step 2: Find the pod with 'oai-nr-ue' in its name
          const uePod = podsData.find(pod => pod.name.includes('oai-nr-ue'));
          // console.log('Found UE pod:', uePod);

          if (!uePod) {
            throw new Error('No UE pod found for the user.');
          }

          const podName = uePod.name;
          const namespace = uePod.namespace;
          // console.log('Pod name:', podName);
          // console.log('Namespace:', namespace);

          // Step 3: Fetch the log data for the identified UE pod
          // console.log(`Fetching log data for pod: ${podName} in namespace: ${namespace}...`);
          const logResponse = await api.get(`kube/get_ue_log/${namespace}/${podName}/`);
          // console.log('Log response:', logResponse.data);

          const logData = logResponse.data.log;
          // console.log('Extracted log data:', logData);

          // Map the log data to the repository entries and prepare data for the graph
          const updatedRepositories = repositories.map(repo => {
            const regex = new RegExp(`\\s*${repo.content.replace('->', '\\->')}\\s*:\\s*([\\d\\.]+)\\s*us;`);
            const logEntry = logData.find(log => regex.test(log.log));
            const match = logEntry ? logEntry.log.match(regex) : null;
            const value = match ? match[1] : repo.value || 'No data';
            return {
              ...repo,
              value: value
            };
          });

          // console.log('Updated repositories:', updatedRepositories);
          setRepositories(updatedRepositories);
        } catch (error) {
          console.error('Error fetching UE log:', error);
          setRepositories(repositories.map(repo => ({ ...repo, value: repo.value || null })));
          setAlertMessage('Failed to fetch log data: ' + (error.response ? error.response.data.detail : 'No details'));
          setAlertSeverity('error');
          setSnackbarOpen(true);
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
  }, [repositories]);

  const columnNames = {
    content: 'Content',
    value: 'Value',
  };

  const columnWidths = {
    content: '50%',
    value: '50%',
  };

  return (
    <div>
      <Table aria-label="Misc table" className="pf-m-compact">
        <Thead noWrap>
          <Tr backgroundColor="#a9a9a9">
            <Th style={{ width: columnWidths.content }} className="title-row-class">{columnNames.content}</Th>
            <Th style={{ width: columnWidths.value }} className="title-row-class">{columnNames.value}</Th>
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
                  {loading && repo.value === '' ? <CircularProgress size={16} /> : (repo.value === null ? 'null' : repo.value)}
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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

export default TableMisc;
