import React, { useState, useEffect, useRef } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  Button,
  TextInput,
} from '@patternfly/react-core';
import api from '../../services/apiService';
import { Table, Tbody, Td, Th, Thead, Tr, TableVariant } from '@patternfly/react-table';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, CircularProgress } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const WiresharkDataTable = ({ data, loading }) => {
  const tableCellStyle = {
    height: '50px',
    verticalAlign: 'middle',
    padding: '8px',
  };

  const tableHeaderStyle = {
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1,
  };

  const tableBodyRef = useRef(null);

  useEffect(() => {
    if (tableBodyRef.current) {
      tableBodyRef.current.scrollTop = tableBodyRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', position: 'relative' }} ref={tableBodyRef}>
      <Table variant={TableVariant.compact} aria-label="Wireshark Data Table">
        <Thead>
          <Tr>
            <Th style={{ ...tableCellStyle, ...tableHeaderStyle }}>No.</Th>
            <Th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Timestamp</Th>
            <Th style={{ ...tableCellStyle, ...tableHeaderStyle }}>IP src</Th>
            <Th style={{ ...tableCellStyle, ...tableHeaderStyle }}>IP dst</Th>
            <Th style={{ ...tableCellStyle, ...tableHeaderStyle }}>Protocol Info</Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading ? (
            <Tr>
              <Td colSpan={5} style={{ textAlign: 'center', height: '200px' }}>
                <CircularProgress />
              </Td>
            </Tr>
          ) : (
            data.map((item, index) => (
              <Tr key={index}>
                <Td style={tableCellStyle}>{index + 1}</Td>
                <Td style={tableCellStyle}>{item.timestamp || 'N/A'}</Td>
                <Td style={tableCellStyle}>{item.layers?.ip?.ip_src || 'N/A'}</Td>
                <Td style={tableCellStyle}>{item.layers?.ip?.ip_dst || 'N/A'}</Td>
                <Td style={tableCellStyle}>{item.layers?.frame?.frame_protocols || 'N/A'}</Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
    </div>
  );
};

const SniffTab = () => {
  const [value, setValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [noPodsFound, setNoPodsFound] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [data, setData] = useState([]);
  const [podsName, setPodsName] = useState(null);
  const [pods, setPods] = useState([]);
  const [podState, setPodState] = useState('');
  const websocketRef = useRef(null);

  useEffect(() => {
    fetchPods(); // Fetch the pods when the component mounts
  }, []);

  const fetchPods = async () => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await api.get('kube/pods/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data && Array.isArray(response.data.pods)) {
        setPods(response.data.pods);
      } else {
        console.error('API response does not contain pods array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching pods:', error.message);
    }
  };

  const filterPods = (pods, selectedComponent) => {
    if (!selectedComponent) {
      console.error('Selected component is undefined');
      return;
    }
    const searchPattern = `${selectedComponent.toLowerCase()}-level1`;
    const selectedPods = pods.filter(pod => pod.name && pod.name.toLowerCase().includes(searchPattern));
    if (selectedPods.length > 0) {
      setPodsName(selectedPods[0].name); // Assuming name is the field in the response
      setPodState(selectedPods[0].state); // Assuming state is the field for pod state
      setNoPodsFound(false);
    } else {
      setPodsName(null);
      setNoPodsFound(true);
    }
  };

  useEffect(() => {
    if (selected !== '') {
      filterPods(pods, selected); // Filter pods based on selected component
    }
  }, [selected, pods]);

  const startWebSocketConnection = (podName, namespace) => {
    const uri = "ws://10.30.1.221:8002/ws/sniff/";
    websocketRef.current = new WebSocket(uri);

    websocketRef.current.onopen = () => {
      const message = JSON.stringify({ pod_name: podName, namespace });
      websocketRef.current.send(message);
    };

    websocketRef.current.onmessage = (event) => {
      console.log('WebSocket message received:', event.data); // Add console log here
      const response = JSON.parse(event.data);
      if (response.data) {
        const parsedData = parseWebSocketData(response.data);
        setData(prevData => [...prevData, parsedData]);
        setLoading(false); // Stop loading when data is received
      }
    };

    websocketRef.current.onclose = () => {
      setIsRunning(false);
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsRunning(false);
    };
  };

  const stopWebSocketConnection = () => {
    if (websocketRef.current) {
      websocketRef.current.send(JSON.stringify({ action: 'stop' }));
      websocketRef.current.close();
    }
    setLoading(false); // Stop loading when WebSocket is closed
  };

  const parseWebSocketData = (data) => {
    const parts = data.split(/\s+/);
    const timestamp = parts[1];
    const ip_src = parts[2];
    const ip_dst = parts[4];
    const protocols = parts.slice(5).join(' ');

    return {
      timestamp: timestamp || 'N/A',
      layers: {
        ip: {
          ip_src: ip_src || 'N/A',
          ip_dst: ip_dst || 'N/A',
        },
        frame: {
          frame_protocols: protocols || 'N/A',
        },
      },
    };
  };

  const handleStartClick = async () => {
    if (!isRunning) {
      if (!selected) {
        setAlertMessage('Please select a component.');
        setAlertOpen(true);
        return;
      }
      if (noPodsFound) {
        setDialogMessage('No pods found for the selected component. Please ensure its pod is already running.');
        setIsDialogOpen(true);
        return;
      }
      if (podsName) {
        if (podState !== 'Running') {
          setDialogMessage('The selected pod is not running. Please ensure all configuration values are correct.');
          setIsDialogOpen(true);
          return;
        }
        setIsRunning(true);
        setLoading(true);
        setData([]); // Clear previous data
        startWebSocketConnection(podsName, 'user1'); // Replace 'user1' with the actual namespace
      }
    } else {
      stopWebSocketConnection();
      setIsRunning(false);
    }
  };

  const handleFilter = () => {
    if (value.trim() === '') {
      setFilteredData([]); // Reset the filter if the input is empty
    } else {
      const filteredResult = data.filter(item => item.layers?.frame?.frame_protocols && item.layers.frame.frame_protocols.includes(value));
      setFilteredData(filteredResult.length > 0 ? filteredResult : []); // Show nothing if no matches
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event, value) => {
    setSelected(value);
    setIsOpen(false);
  };

  const toggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onToggleClick}
      isExpanded={isOpen}
      style={{
        width: '200px'
      }}
    >
      {selected || 'Select a Component'}
    </MenuToggle>
  );

  return (
    <React.Fragment>
      <div style={{ position: 'relative' }}>
        <Snackbar
          open={alertOpen}
          autoHideDuration={6000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setAlertOpen(false)}
            severity="warning"
            sx={{ backgroundColor: '#FFC107', color: '#000' }}
          >
            {alertMessage}
          </MuiAlert>
        </Snackbar>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
            <Button
              variant={isRunning ? "danger" : "primary"}
              size="sm"
              onClick={handleStartClick}
              style={{ marginRight: '10px', minWidth: '80px', borderRadius: '20px' }}
            >
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Select
              id="single-grouped-select"
              isOpen={isOpen}
              selected={selected}
              onSelect={onSelect}
              onOpenChange={(isOpen) => setIsOpen(isOpen)}
              toggle={toggle}
              shouldFocusToggleOnSelect
            >
              <SelectList>
                <SelectOption value="CU">CU</SelectOption>
                <SelectOption value="DU">DU</SelectOption>
                <SelectOption value="UE">UE</SelectOption>
              </SelectList>
            </Select>
          </div>
          <div style={{ height: '385px', border: '1px solid #ccc', padding: '16px', marginBottom: '10px', marginTop: '10px', overflow: 'hidden', position: 'relative' }}>
            <WiresharkDataTable data={filteredData.length > 0 ? filteredData : data} loading={loading} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button variant="secondary" size="sm" onClick={handleFilter}>
              Filter
            </Button>
            <TextInput
              value={value}
              type="text"
              onChange={(_event, value) => setValue(value)}
              aria-label="text input example"
              style={{ marginLeft: '8px' }}
            />
          </div>
        </div>
      </div>
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Pod State Notification</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default SniffTab;
