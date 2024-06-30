import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import './Introduction.css'

function TableUE() {
  const repositories = [{
    parameter: 'IP Address',
    description: 'Network address assigned to the User Equipment (UE).',
    function: 'Used for network communication with the core network and other entities.',
  }, {
    parameter: 'RF Sim Server',
    description: 'Radio Frequency Simulation Server address.',
    function: "Used for simulating RF conditions and interactions in DU pod.",
  }, {
    parameter: 'Full Imsi',
    description: 'International Mobile Subscriber Identity.',
    function: 'Uniquely identifies a user within the mobile network.',
  }, {
    parameter: 'Full Key',
    description: 'Encryption key for securing communications.',
    function: 'Ensures data security and integrity during transmission.',
  }, {
    parameter: 'OPC',
    description: 'Operator Code used in the authentication and key agreement process.',
    function: 'Enhances security by working in conjunction with the Full Key.',
  }, {
    parameter: 'DNN',
    description: "Data Network Name.",
    function: 'Identifies the data network to which the UE should connect.',
  }, {
    parameter: 'SST',
    description: "Slice/Service Type indicating the type of network slice or service.",
    function: 'Used in network slicing to provide different services (e.g., enhanced mobile broadband, ultra-reliable low latency communications).',
  }, {
    parameter: 'SD',
    description: 'Slice Differentiator used along with SST.',
    function: 'Further differentiates the network slice for more granular service provision.',
  }, {
    parameter: 'USRP',
    description: 'Universal Software Radio Peripheral used for radio communication.',
    function: 'Provides flexible and configurable radio communication capabilities and need to be same with connected DU/RU.',
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

export default TableUE;



