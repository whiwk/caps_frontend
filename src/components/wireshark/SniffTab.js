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
import apiConfig from '../../config/apiConfig';

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
  const [alertSeverity, setAlertSeverity] = useState('success');

  const [isComponentOpen, setIsComponentOpen] = useState(false);
  const [isInterfaceOpen, setIsInterfaceOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('');
  const [selectedInterface, setSelectedInterface] = useState('');
  const [data, setData] = useState([]);
  const [podsName, setPodsName] = useState(null);
  const [pods, setPods] = useState([]);
  const [podState, setPodState] = useState('');
  const [namespace, setNamespace] = useState('');
  const websocketRef = useRef(null);

  useEffect(() => {
    // Fetch the pod name and namespace
    const fetchPodAndNamespace = async () => {
      try {
        const podResponse = await api.get('kube/pods/');
        const userResponse = await api.get('user/information/');

        setPods(podResponse.data.pods);
        setNamespace(userResponse.data.namespace || userResponse.data.username);
      } catch (error) {
        console.error('Error fetching pod name or namespace:', error.message);
      }
    };

    fetchPodAndNamespace();
  }, []);

  const filterPods = (pods, selectedComponent) => {
    if (!selectedComponent) {
      console.error('Selected component is undefined');
      return;
    }
    const searchPattern = `${selectedComponent.toLowerCase()}-level1`;
    const selectedPods = pods.filter(pod => pod.name && pod.name.toLowerCase().includes(searchPattern));
    if (selectedPods.length > 0) {
      setPodsName(selectedPods[0].name);
      setPodState(selectedPods[0].state);
      setNoPodsFound(false);
    } else {
      setPodsName(null);
      setNoPodsFound(true);
    }
  };

  useEffect(() => {
    if (selectedComponent !== '') {
      filterPods(pods, selectedComponent);
    }
  }, [selectedComponent, pods]);

  const startWebSocketConnection = (podName, namespace, interfaceName) => {
    const uri = `${apiConfig.wsURL}ws/sniff/`;
    websocketRef.current = new WebSocket(uri);

    websocketRef.current.onopen = () => {
      const message = JSON.stringify({
        pod_name: podName,
        namespace: namespace,
        interface: interfaceName,
      });
      websocketRef.current.send(message);
    };

    websocketRef.current.onmessage = (event) => {
      // console.log('WebSocket message received:', event.data);
      const response = JSON.parse(event.data);
      if (response.data) {
        const parsedData = parseWebSocketData(response.data);
        setData(prevData => [...prevData, parsedData]);
        setLoading(false);
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

  const stopWebSocketConnection = async () => {
    if (websocketRef.current) {
      websocketRef.current.send(JSON.stringify({ action: 'stop' }));
      websocketRef.current.close();
    }
    setLoading(false);

    // Call the backend endpoint to store the pcap file in the database
    try {
      const response = await api.post(`pcap/fetch/${namespace}/${podsName}/`);
      if (response.status === 200) {
        setAlertSeverity('success'); // Set the severity to success
        setAlertMessage('PCAP file stored successfully');
      } else {
        setAlertSeverity('error'); // Set the severity to warning
        setAlertMessage('Failed to store PCAP file');
      }
    } catch (error) {
      setAlertSeverity('error'); // Set the severity to warning
      setAlertMessage('Failed to store PCAP file');
      console.error('Error storing PCAP file:', error.message);
    } finally {
      setAlertOpen(true);
    }
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
      if (!selectedComponent) {
        setAlertSeverity('warning');
        setAlertMessage('Please select a component.');
        setAlertOpen(true);
        return;
      }
      if ((selectedComponent === 'CU' || selectedComponent === 'UE') && !selectedInterface) {
        setAlertSeverity('warning');
        setAlertMessage('Please select an interface.');
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
        setData([]);
        startWebSocketConnection(podsName, namespace, selectedInterface);
      }
    } else {
      await stopWebSocketConnection();
      setIsRunning(false);
    }
  };

  const handleFilter = () => {
    if (value.trim() === '') {
      setFilteredData([]);
    } else {
      const filteredResult = data.filter(item => item.layers?.frame?.frame_protocols && item.layers.frame.frame_protocols.includes(value));
      setFilteredData(filteredResult.length > 0 ? filteredResult : []);
    }
  };

  const onComponentToggleClick = () => {
    setIsComponentOpen(!isComponentOpen);
  };

  const onInterfaceToggleClick = () => {
    setIsInterfaceOpen(!isInterfaceOpen);
  };

  const onComponentSelect = (_event, value) => {
    setSelectedComponent(value);
    setIsComponentOpen(false);
    setSelectedInterface(value === 'CU' ? '' : value === 'DU' ? 'f1' : 'oaitun');
    setIsInterfaceOpen(false);
  };

  const onInterfaceSelect = (_event, value) => {
    setSelectedInterface(value);
    setIsInterfaceOpen(false);
  };

  const componentToggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onComponentToggleClick}
      isExpanded={isComponentOpen}
      style={{
        width: '200px'
      }}
    >
      {selectedComponent || 'Select a Component'}
    </MenuToggle>
  );

  const interfaceToggle = (toggleRef) => (
    <MenuToggle
      ref={toggleRef}
      onClick={onInterfaceToggleClick}
      isExpanded={isInterfaceOpen}
      style={{
        width: '200px'
      }}
    >
      {selectedInterface || 'Select an Interface'}
    </MenuToggle>
  );

  return (
    <React.Fragment>
      <div style={{ position: 'relative' }}>
        <Snackbar
          open={alertOpen}
          autoHideDuration={3000}
          onClose={() => setAlertOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <MuiAlert
            elevation={6}
            variant="filled"
            onClose={() => setAlertOpen(false)}
            severity={alertSeverity} // Use the alertSeverity state
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
              id="single-grouped-select-component"
              isOpen={isComponentOpen}
              selected={selectedComponent}
              onSelect={onComponentSelect}
              onOpenChange={(isOpen) => setIsComponentOpen(isOpen)}
              toggle={componentToggle}
              shouldFocusToggleOnSelect
            >
              <SelectList>
                <SelectOption value="CU">CU</SelectOption>
                <SelectOption value="DU">DU</SelectOption>
                <SelectOption value="UE">UE</SelectOption>
              </SelectList>
            </Select>
            {selectedComponent === 'CU' && (
              <Select
                id="single-grouped-select-interface"
                isOpen={isInterfaceOpen}
                selected={selectedInterface}
                onSelect={onInterfaceSelect}
                onOpenChange={(isOpen) => setIsInterfaceOpen(isOpen)}
                toggle={interfaceToggle}
                shouldFocusToggleOnSelect
                style={{ marginLeft: '10px' }}
              >
                <SelectList>
                  <SelectOption value="f1">f1</SelectOption>
                  <SelectOption value="n2">n2</SelectOption>
                  <SelectOption value="n3">n3</SelectOption>
                </SelectList>
              </Select>
            )}
            {selectedComponent === 'DU' && (
              <TextInput
                value={selectedInterface}
                type="text"
                isDisabled
                aria-label="text input example"
                style={{ marginLeft: '10px', width: '200px' }}
              />
            )}
            {selectedComponent === 'UE' && (
              <TextInput
                value={selectedInterface}
                type="text"
                isDisabled
                aria-label="text input example"
                style={{ marginLeft: '10px', width: '200px' }}
              />
            )}
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
