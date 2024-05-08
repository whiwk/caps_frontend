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
            <Th>No</Th>
            <Th>Timestamp</Th>
            <Th>Protocol Info</Th>
          </tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={index}>
              <Td>{item.no}</Td>
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
const [filteredData, setFilteredData] = useState<string[]>([]); // State to hold filtered data (replace string[] with your data type)

const handleFilter = () => {
  // Implement your filtering logic here
  // For demonstration purposes, let's assume you have an array of data called 'data' that you want to filter
  const filteredResult = data.filter(item => item.includes(value));
  setFilteredData(filteredResult);
};

//button start/stop
const [isRunning, setIsRunning] = useState(false);

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
  const [data, setData] = useState<any>([]); // State to store data from the backend

  useEffect(() => {
    if (selected !== ''){
    fetchData(selected); // Fetch data when component mounts or selected option changes
    }
  }, [selected]);

  const fetchData = async (selectedOption: string) => {
    try {
      const response = await axios.get(`YOUR_API_ENDPOINT/${selectedOption}`); // Replace YOUR_API_ENDPOINT with the actual endpoint
      setData(response.data); // Set the data received from the backend
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onSelect = (_event: React.MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    // eslint-disable-next-line no-console
    // console.log('selected', value);

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

  return (
    <React.Fragment>
    <Button
        variant={isRunning ? "danger" : "primary"} // Change variant based on state
        size="sm"
        onClick={handleClick}
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
    {selected && (
      <WiresharkDataTable data={data} />
    )}
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
          <li key={index}>{item, index}</li>
        ))}
      </ul>
    </div>
    </React.Fragment>
  );
};

export default Tabsatu;
