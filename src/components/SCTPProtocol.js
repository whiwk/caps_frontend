import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box
} from '@mui/material';
import api from '../services/apiService';

const SCTPProtocol = ({ nodeName }) => { // Receive nodeName as a prop
  const defaultKeys = useMemo(() => [
    'sctp.srcport', 'sctp.dstport', 'sctp.verification_tag', 'sctp.assoc_index',
    'sctp.port', 'sctp.checksum', 'sctp.checksum.status', 'sctp.chunk_type',
    'sctp.chunk_flags', 'sctp.chunk_length', 'sctp.parameter_type', 
    'sctp.parameter_length'
  ], []);

  const [protocolData, setProtocolData] = useState({});
  const [podName, setPodName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [componentType, setComponentType] = useState(''); // New state for component type
  const [websocketUrl, setWebsocketUrl] = useState('');
  const websocketRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    console.log(`SCTPProtocol received nodeName: ${nodeName}`); // Log the received nodeName

    // Fetch the pod name and namespace
    const fetchPodAndNamespace = async () => {
      try {
        const podResponse = await api.get('/kube/pods/');
        const userResponse = await api.get('user/information/'); // Assuming you have an endpoint to get user info

        const pod = podResponse.data.pods.find(pod => pod.name.includes(nodeName.toLowerCase()));
        const userNamespace = userResponse.data.username;

        setPodName(pod.name);
        setNamespace(userNamespace);

        // Determine component type based on pod name
        const type = pod.name.includes('du') ? 'du' : pod.name.includes('cu') ? 'cu' : 'ue';
        setComponentType(type);

        // Define the WebSocket URL based on your server address
        setWebsocketUrl('ws://10.30.1.221:8002/ws/protocolstack/');

        // Load initial data from session storage based on component type
        const initialProtocolData = {};
        defaultKeys.forEach(key => {
          const prefixedKey = `${type}.${key}`;
          initialProtocolData[key] = sessionStorage.getItem(prefixedKey) || 'Loading...';
          console.log(`Loaded ${prefixedKey} from session storage: ${initialProtocolData[key]}`);
        });

        setProtocolData(initialProtocolData);

        // Set a timer for 30 seconds
        timerRef.current = setTimeout(() => {
          setProtocolData((prevData) => {
            const updatedData = { ...prevData };
            defaultKeys.forEach(key => {
              if (updatedData[key] === 'Loading...') {
                updatedData[key] = 'No data';
              }
            });
            return updatedData;
          });
        }, 30000); // 30 seconds

        console.log(`Component Type Detected: ${type}`);
        console.log(`Pod Name: ${pod.name}`);
        console.log(`Namespace: ${userNamespace}`);

      } catch (error) {
        console.error('Error fetching pod name or namespace:', error);
      }
    };

    fetchPodAndNamespace();
  }, [defaultKeys, nodeName]);

  const parsePlainText = useCallback((plainText) => {
    const dataValues = plainText.split('\t').map(item => item.trim());
    const parsedData = {};

    defaultKeys.forEach((key, index) => {
      const prefixedKey = `${componentType}.${key}`;
      parsedData[key] = dataValues[index] || '';
      sessionStorage.setItem(prefixedKey, dataValues[index] || ''); // Store each value in sessionStorage with prefix
      console.log(`Stored ${prefixedKey} in session storage: ${dataValues[index]}`);
    });

    return parsedData;
  }, [defaultKeys, componentType]);

  useEffect(() => {
    if (websocketUrl) {
      // Initialize WebSocket connection
      websocketRef.current = new WebSocket(websocketUrl);

      websocketRef.current.onopen = () => {
        console.log('WebSocket connected');
        // Send initial data to start the tcpdump command
        websocketRef.current.send(
          JSON.stringify({
            pod_name: podName,
            namespace: namespace
          })
        );
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);

          if (data.data) {
            clearTimeout(timerRef.current); // Clear the timer when a message is received
            const parsedData = parsePlainText(data.data);
            setProtocolData((prevData) => ({
              ...prevData,
              ...parsedData
            }));
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        clearTimeout(timerRef.current); // Clear the timer if WebSocket closes
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        clearTimeout(timerRef.current); // Clear the timer if WebSocket errors
      };

      // Cleanup on component unmount
      return () => {
        if (websocketRef.current) {
          websocketRef.current.close();
        }
        clearTimeout(timerRef.current); // Clear the timer on unmount
      };
    }
  }, [websocketUrl, podName, namespace, parsePlainText]);

  const renderProtocolData = () => (
    <TableContainer component={Paper} style={{ maxHeight: '100%', overflow: 'auto' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#F2F2F2', width: '50%' }}>SCTP Protocol Information</TableCell>
            <TableCell align="center" style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#F2F2F2', width: '50%' }}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {defaultKeys.map((key) => (
            <TableRow key={key}>
              <TableCell align="center" style={{ fontFamily: 'monospace', fontSize: '12px', width: '50%' }}>{key}</TableCell>
              <TableCell align="center" style={{ fontFamily: 'monospace', fontSize: '12px', width: '50%', wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
                {protocolData[key]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box style={{ height: '350px', overflow: 'auto' }}>
      {renderProtocolData()}
    </Box>
  );
};

export default SCTPProtocol;
