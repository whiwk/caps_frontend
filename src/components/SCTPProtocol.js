import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Box
} from '@mui/material';
import api from '../services/apiService';

const SCTPProtocol = () => {
  const defaultKeys = useMemo(() => [
    'sctp.srcport', 'sctp.dstport', 'sctp.verification_tag', 'sctp.assoc_index',
    'sctp.port', 'sctp.checksum', 'sctp.checksum.status', 'sctp.chunk_type',
    'sctp.chunk_flags', 'sctp.chunk_length', 'sctp.parameter_type', 
    'sctp.parameter_length'
  ], []);

  const initialProtocolData = useMemo(() => {
    const data = {};
    defaultKeys.forEach(key => {
      data[key] = sessionStorage.getItem(key) || 'Loading...';
    });
    return data;
  }, [defaultKeys]);

  const [protocolData, setProtocolData] = useState(initialProtocolData);
  const [podName, setPodName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [websocketUrl, setWebsocketUrl] = useState('');
  const websocketRef = useRef(null);

  useEffect(() => {
    // Fetch the pod name and namespace
    const fetchPodAndNamespace = async () => {
      try {
        const podResponse = await api.get('/kube/pods/');
        const userResponse = await api.get('user/information/'); // Assuming you have an endpoint to get user info

        const pod = podResponse.data.pods.find(pod => pod.name.includes('cu') || pod.name.includes('du') || pod.name.includes('ue'));
        const userNamespace = userResponse.data.username;

        setPodName(pod.name);
        setNamespace(userNamespace);

        // Define the WebSocket URL based on your server address
        setWebsocketUrl('ws://10.30.1.221:8002/ws/protocolstack/');
      } catch (error) {
        console.error('Error fetching pod name or namespace:', error);
      }
    };

    fetchPodAndNamespace();
  }, []);

  const parsePlainText = useCallback((plainText) => {
    const dataValues = plainText.split('\t').map(item => item.trim());
    const parsedData = {};

    defaultKeys.forEach((key, index) => {
      parsedData[key] = dataValues[index] || '';
      sessionStorage.setItem(key, dataValues[index] || ''); // Store each value in sessionStorage
    });

    return parsedData;
  }, [defaultKeys]);

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
      };

      websocketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      // Cleanup on component unmount
      return () => {
        if (websocketRef.current) {
          websocketRef.current.close();
        }
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
