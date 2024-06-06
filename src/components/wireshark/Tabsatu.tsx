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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleClick = () => {
  // Toggle the state between running and not running
  setIsRunning(!isRunning);

  // Perform start or stop actions based on the current state
  if (!isRunning) {
    startAction();
  } else {
    stopAction();
  }
};

const startAction = () => {
  // Add your start action logic here
  // console.log('Start action');
};

const stopAction = () => {
  // Add your stop action logic here
  // console.log('Stop action');
};

//dropdown component
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('Select Component');
  const [data, setData] = useState<any>([]); // State to store data from the backend
  const [podsName, setPodsName] = useState<string | null>(null); 
  const [pods, setPods] = useState<any[]>([])
  
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
        // console.log('Extracted pod names:', podNames);
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
    // console.log('Filtering pods for component:', selectedComponent);
    const searchPattern = `${selectedComponent.toLowerCase()}-level1`;
    // console.log('Search pattern:', searchPattern);

    const selectedPods = pods.filter(pod => pod.name && pod.name.toLowerCase().includes(searchPattern));
    if (selectedPods.length > 0) {
      // console.log('Selected pods:', selectedPods);
      setPodsName(selectedPods[0].name); // Assuming name is the field in the response
    } else {
      // console.log('No pods found for the selected component');
      setPodsName(null);
    }
  };

  useEffect(() => {
    if (selected !== '') {
      // console.log('Selected component changed:', selected);
      filterPods(pods, selected); // Filter pods based on selected component
    }
  }, [selected, pods]);

  const fetchData = async (podsName: string) => {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await api.get(`shark/testv1/${podsName}/`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      // Check if the response data has the expected structure
      if (response.data && response.data.packets && Array.isArray(response.data.packets)) {
        const parsedData = response.data.packets.map((item: any) => ({
          frame: {
            time: item._source.layers.frame["frame.time"],
            protocols: item._source.layers.frame["frame.protocols"],
          },
          ip: {
            src: item._source.layers.ip["ip.src"],
            dst: item._source.layers.ip["ip.dst"],
          },
        }));
        // console.log('Parsed Data:', parsedData); // Console log the parsed data
  
        // Display data one by one
        for (let i = 0; i < parsedData.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second
          setData(prevData => [...prevData, parsedData[i]]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStartClick = async () => {
    if (!isRunning && podsName) {
      setIsRunning(true);
      setLoading(true);
      setData([]); // Clear previous data
      await fetchData(podsName);
      setLoading(false);
      setIsRunning(false);
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
    // console.log('Selected value from dropdown:', value);
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
      {selected || 'Select Option'}
    </MenuToggle>
  );

  //table wireshark component
 

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};

export default Tabsatu;
