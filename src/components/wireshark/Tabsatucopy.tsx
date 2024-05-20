import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectOption,
  SelectList,
  // SelectGroup,
  MenuToggle,
  MenuToggleElement,
  // Divider,
  Button,
  TextInput,
} from '@patternfly/react-core';
import axios from 'axios'; //Import axios for making HTTP requests
import { Table, Tbody, Td, Th, Thead, Tr, TableVariant } from '@patternfly/react-table';

//container to show wireshark data in table
const WiresharkDataTable: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <div>
      <Table variant={TableVariant.compact} aria-label="Wireshark Data Table">
        <Thead>
          <tr>
            <Th>Timestamp</Th>
            <Th>Protocol Info</Th>
          </tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.timestamp}</Td>
              <Td>{item.protocolInfo}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export const Tabsatu: React.FunctionComponent = () => {
//textinput and filter
const [value, setValue] = React.useState('');
const [filteredData, setFilteredData] = useState<any[]>([]);
//button start/stop
const [isRunning, setIsRunning] = useState(false);

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
  console.log('Start action');
};

const stopAction = () => {
  // Add your stop action logic here
  console.log('Stop action');
};

//dropdown component
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<string>('Select Component');
  const [data, setData] = useState<any[]>([]); // State to store data from the backend
  const [podsName, setPodsName] = useState<string | null>(null); 
  const [pods, setPods] = useState<any[]>([])
  
  useEffect(() => {
    fetchPods(); // Fetch the pods when the component mounts
  }, []);

  const fetchPods = async () => {
    const authToken = localStorage.getItem('authToken');
    console.log('Fetching pods with authToken:', authToken);

    try {
      const response = await axios.get('http://10.30.1.221:8000/api/v1/kube/pods/', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Pods API response status:', response.status);
      console.log('Pods API response data:', response.data);

      if (response.data && Array.isArray(response.data.pods)) {
        const podNames = response.data.pods.map((pod: any) => pod.name); // Extract pod names
        console.log('Extracted pod names:', podNames);
        setPods(podNames);
        filterPods(response.data.pods, selected);
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
    const selectedPods = pods.filter(pod => pod.name && pod.name.toLowerCase().includes(selectedComponent.toLowerCase()));
    if (selectedPods.length > 0) {
      console.log('Selected pods:', selectedPods);
      setPodsName(selectedPods[0].name); // Assuming name is the field in the response
    } else {
      console.log('No pods found for the selected component');
      setPodsName(null);
    }
  };

  useEffect(() => {
    if (selected !== '') {
      console.log('Selected component changed:', selected);
      filterPods(pods, selected); // Filter pods based on selected component
    }
  }, [selected, pods]);

  const handleStartClick = async () => {
    if (!isRunning && podsName) {
      console.log('Starting sniff packet for pod:', podsName);
      try {
        const response = await axios.get(`http://10.30.1.221:8000/api/v1/shark/testv1/${podsName}`);
        console.log('Sniff packet API response:', response.data); // Log the response
        setData(response.data); // Assuming response.data contains the Wireshark data
        setIsRunning(true);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    } else {
      console.log('Stopping sniff packet');
      setIsRunning(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-redeclare
  const handleFilter = () => {
    console.log('Filtering data with value:', value);
    // Implement your filtering logic here
    // For demonstration purposes, let's assume you have an array of data called 'data' that you want to filter
    const filteredResult = data.filter(item => item && item.protocolInfo && item.protocolInfo.includes(value));
    setFilteredData(filteredResult);
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
      {selected || 'Select Option'}
    </MenuToggle>
  );

  //table wireshark component
 

  return (
    <React.Fragment>
    <Button
        variant={isRunning ? "danger" : "primary"} // Change variant based on state
        size="sm"
        onClick={handleStartClick}
    >
    
    {isRunning ? 'Stop' : 'Start'} {/* Change button label based on state */}
    </Button>{' '}
    <div>
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
          <SelectOption value="AMF">AMF</SelectOption>
          <SelectOption value="UPF">UPF</SelectOption>
          <SelectOption value="CU">CU</SelectOption>
          <SelectOption value="DU">DU</SelectOption>
        </SelectList>
    </Select>
    <br />
    <br />
    {/* Empty container or card with dimensions */}
    <div style={{ height: '400px', border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
    {selected &&
      <WiresharkDataTable data={data} /> 
    }
    </div>
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
        style={{ marginLeft: '8px' }} // Adjust margin as needed
      />
      {/* Display filtered data here */}
      <ul>
        {filteredData.map((item, index) => (
          // eslint-disable-next-line no-sequences
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
    </React.Fragment>
  );
};

export default Tabsatu;
