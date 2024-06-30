import React from 'react';
import { Table, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import './Introduction.css'

function TableCU() {
  const repositories = [{
    parameter: 'CU ID',
    description: 'Unique identifier for the Central Unit.',
    function: 'Differentiates this specific CU from others in the network.',
  }, {
    parameter: 'Cell ID',
    description: 'Identifies a specific cell managed by the CU.',
    function: "Distinguishes different cells within the CU's coverage area.",
  }, {
    parameter: 'F1 IP Address',
    description: 'Network address used for communication between the CU and the Distributed Unit (DU).',
    function: 'Part of the F1 interface handling control and user plane data exchange.',
  }, {
    parameter: 'F1 CU Port',
    description: 'Port number used by the CU for the F1 interface to communicate with the DU.',
    function: 'Ensures correct routing of data within the network.',
  }, {
    parameter: 'F1 DU Port',
    description: 'Port number on the DU used for communication over the F1 interface with the CU.',
    function: 'Ensures correct routing of data within the network.',
  }, {
    parameter: 'N2 IP Address',
    description: "Network address used for communication between the CU and the core network's Access and Mobility Management Function (AMF).",
    function: 'Part of the N2 interface managing signaling and control.',
  }, {
    parameter: 'N3 IP Address',
    description: "Network address used for user plane communication between the CU and the core network's User Plane Function (UPF).",
    function: 'Part of the N3 interface handling data transfer.',
  }, {
    parameter: 'MCC',
    description: 'Mobile Country Code, a three-digit code uniquely identifying the country of the mobile network.',
    function: 'Part of the Public Land Mobile Network (PLMN) identifier for global and regional network identification.',
  }, {
    parameter: 'MNC',
    description: 'Mobile Network Code, a two or three-digit code uniquely identifying the mobile network within the country specified by the MCC.',
    function: 'Part of the PLMN identifier for network identification and interoperability.',
  }, {
    parameter: 'TAC',
    description: 'Tracking Area Code used to identify a tracking area within the network.',
    function: 'Groups cells into larger tracking areas for efficient mobility and paging management.',
  }, {
    parameter: 'SST',
    description: 'Slice/Service Type indicating the type of network slice or service.',
    function: 'Used in network slicing to provide different services (e.g., enhanced mobile broadband, ultra-reliable low latency communications).',
  }, {
    parameter: 'AMF Host',
    description: 'Hostname or IP address of the Access and Mobility Management Function within the core network.',
    function: 'Part of the N2 interface, crucial for signaling and control processes.',
  }, 
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

export default TableCU;



