import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import './Introduction.css'

function TableDU() {
  const repositories = [{
    parameter: 'GNB ID',
    description: 'Unique identifier for the gNB (Next Generation NodeB).',
    function: 'Differentiates this specific gNB from others in the network.',
  }, {
    parameter: 'DU ID',
    description: 'Unique identifier for the Distributed Unit.',
    function: "Differentiates this specific DU from others within the gNB.",
  }, {
    parameter: 'F1 IP Address',
    description: 'Network address used for communication between the DU and the Central Unit (CU).',
    function: 'Part of the F1 interface handling control and user plane data exchange.',
  }, {
    parameter: 'USRP',
    description: 'Universal Software Radio Peripheral Simulation used for radio communication.',
    function: 'Provides flexible and configurable radio frequency simmulation communication capabilities.',
  }, {
    parameter: 'CU Host',
    description: 'Hostname or IP address of the Central Unit within the network.',
    function: 'Part of the F1 interface, crucial for establishing communication between the DU and CU.',
  }
];
  const columnNames = {
    parameter: 'Parameter',
    description: 'Description',
    function: 'Function',
  };

  return (
    <Table 
      aria-label="Simple table" 
      className="table-bordered table-header-grey">
      <Thead>
        <Tr>
          <Th>{columnNames.parameter}</Th>
          <Th>{columnNames.description}</Th>
          <Th>{columnNames.function}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {repositories.map(repo => (
          <Tr key={repo.name}>
            <Td dataLabel={columnNames.parameter}>{repo.parameter}</Td>
            <Td dataLabel={columnNames.description}>{repo.description}</Td>
            <Td dataLabel={columnNames.function}>{repo.function}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

export default TableDU;



