import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  MenuToggle,
  MenuToggleElement,
  Button,
  TextInput,
  Spinner,
} from '@patternfly/react-core';
import api from '../../services/apiService'
import { Table, Tbody, Td, Th, Thead, Tr, TableVariant } from '@patternfly/react-table';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const WiresharkDataTable: React.FC<{ data: any[] }> = ({ data }) => {
  const tableCellStyle = {
    height: '50px', // Customize the height
    verticalAlign: 'middle', // Center content vertically
    padding: '8px' // Adjust padding as needed
  };
  return (
    <div>
      <Table variant={TableVariant.compact} aria-label="Wireshark Data Table">
        <Thead>
          <Tr>
            <Th style={tableCellStyle}>No.</Th>
            <Th style={tableCellStyle}>Timestamp</Th>
            <Th style={tableCellStyle}>IP src</Th>
            <Th style={tableCellStyle}>IP dst</Th>
            <Th style={tableCellStyle}>Protocol Info</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td style={tableCellStyle}>{index + 1}</Td>
              <Td style={tableCellStyle}>{item.frame?.time || 'N/A'}</Td>
              <Td style={tableCellStyle}>{item.ip?.src || 'N/A'}</Td>
              <Td style={tableCellStyle}>{item.ip?.dst || 'N/A'}</Td>
              <Td style={tableCellStyle}>{item.frame?.protocols || 'N/A'}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export const Tabsatu: React.FunctionComponent = () => {
  const [value, setValue] = React.useState('');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [noPodsFound, setNoPodsFound] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); // State for alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message
  const [sniffingId, setSniffingId] = useState<string | null>(null);

  //dropdown component
    const [isOpen, setIsOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<string>('');
    const [data, setData] = useState<any>([]); // State to store data from the backend
    const [podsName, setPodsName] = useState<string | null>(null); 
    const [pods, setPods] = useState<any[]>([])
    const [podState, setPodState] = useState<string>('');
    
    useEffect(() => {
      fetchPods(); // Fetch the pods when the component mounts
    }, []);

    const fetchPods = async () => {
      const authToken = localStorage.getItem('authToken');
      // console.log('Fetching pods with authToken:', authToken);

      try {
        const response = await api.get('kube/pods/', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // console.log('Pods API response status:', response.status);
        // console.log('Pods API response data:', response.data);

        if (response.data && Array.isArray(response.data.pods)) {
          const podNames = response.data.pods.map((pod: any) => pod.name);
          console.log('Extracted pod names:', podNames);
          setPods(response.data.pods);
        } else {
          console.error('API response does not contain pods array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching pods:', error.message);
      }
    };

    const filterPods = (pods: any[], selectedComponent: string) => {
      if (!selectedComponent) {
        console.error('Selected component is undefined');
        return;
      }
      console.log('Filtering pods for component:', selectedComponent);
      const searchPattern = `${selectedComponent.toLowerCase()}-level1`;
      console.log('Search pattern:', searchPattern);

      const selectedPods = pods.filter(pod => pod.name && pod.name.toLowerCase().includes(searchPattern));
      if (selectedPods.length > 0) {
        console.log('Selected pods:', selectedPods);
        setPodsName(selectedPods[0].name); // Assuming name is the field in the response
        setPodState(selectedPods[0].state); // Assuming state is the field for pod state
        setNoPodsFound(false);
      } else {
        console.log('No pods found for the selected component');
        setPodsName(null);
        setNoPodsFound(true);
      }
    };

    useEffect(() => {
      if (selected !== '') {
        // console.log('Selected component changed:', selected);
        filterPods(pods, selected); // Filter pods based on selected component
      }
    }, [selected, pods]);

    const startSniffing = async (podName: string) => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await api.get(`shark/start_sniffing/${podName}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.sniffing_id) {
          console.log('Sniffing started successfully:', response.data);
          setSniffingId(response.data.sniffing_id);
          fetchSniffingData(response.data.sniffing_id);
        }
      } catch (error) {
        console.error('Error starting sniffing:', error.message);
      }
    };

    const fetchSniffingData = async (sniffingId: string) => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await api.get(`shark/check_sniffing_status/${sniffingId}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (response.data && response.data.packets && Array.isArray(response.data.packets)) {
          const parsedData = response.data.packets.map((item: any) => {
            console.log(item); // Add console log here to inspect the item
            return {
              frame: {
                time: item.layers.frame["frame_frame_time"],
                protocols: item.layers.frame["frame_frame_protocols"],
              },
              ip: {
                src: item.layers.ip["ip_ip_src"],
                dst: item.layers.ip["ip_ip_dst"],
              },
            };
          });
          
          for (let i = 0; i < parsedData.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
            setData(prevData => [...prevData, parsedData[i]]);
          }
        }
      } catch (error) {
        console.error('Error fetching sniffing data:', error.message);
      }
    };

    const stopSniffing = async (podName: string) => {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await api.post(`shark/stop_sniffing/${podName}/`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        if (response.data.message) {
          console.log('Sniffing stopped successfully:', response.data);
          setDialogMessage(response.data.message);
          setIsDialogOpen(true);
        }
      } catch (error) {
        console.error('Error stopping sniffing:', error.message);
      }
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
          await startSniffing(podsName);
          setLoading(false);
        }
      } else {
        if (podsName) {
          await stopSniffing(podsName);
          setIsRunning(false);
        }
      }
    };

    const handleFilter = () => {
      if (value.trim() === '') {
        setFilteredData([]); // Reset the filter if the input is empty
      } else {
        const filteredResult = data.filter(item => item.frame.protocols && item.frame.protocols.includes(value));
        setFilteredData(filteredResult);
      }
    };

    const onToggleClick = () => {
      setIsOpen(!isOpen);
    };

    const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
      console.log('Selected value from dropdown:', value);
      setSelected(value as string);
      setIsOpen(false);
    };

    const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
      <MenuToggle
        ref={toggleRef}
        onClick={onToggleClick}
        isExpanded={isOpen}
        style={
          {
            width: '200px'
          } as React.CSSProperties
        }
      >
        {selected || 'Select a Component'}
      </MenuToggle>
    );

    //table wireshark component
  

    return (
      <React.Fragment>
        <div style={{ position: 'relative' }}>
          {alertOpen && (
            <MuiAlert
              onClose={() => setAlertOpen(false)}
              severity="warning"
              style={{ position: 'absolute', top: 0, width: '100%' }}
            >
              {alertMessage}
            </MuiAlert>
          )}
          <div style={{ paddingTop: alertOpen ? '48px' : '0' }}>
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
            <div style={{ height: '385px', border: '1px solid #ccc', padding: '16px', marginBottom: '10px', marginTop: '10px', overflow: 'auto', position: 'relative' }}>
              {loading && <Spinner size="xl" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />}
              {selected && <WiresharkDataTable data={filteredData.length > 0 ? filteredData : data} />}
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

export default Tabsatu;
