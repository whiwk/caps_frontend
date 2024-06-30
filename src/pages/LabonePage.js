import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem, ToggleGroup, ToggleGroupItem} from '@patternfly/react-core';
import { Table, Caption, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import './Introduction.css'

function LabonePage() {
  const repositories = [{
    name: 'one',
    branches: 'two',
    prs: 'three',
    workspaces: 'four',
    lastCommit: 'five'
  }, {
    name: 'one - 2',
    branches: null,
    prs: null,
    workspaces: 'four - 2',
    lastCommit: 'five - 2'
  }, {
    name: 'one - 3',
    branches: 'two - 3',
    prs: 'three - 3',
    workspaces: 'four - 3',
    lastCommit: 'five - 3'
  }];
  const columnNames = {
    name: 'Repositories',
    branches: 'Branches',
    prs: 'Pull requests',
    workspaces: 'Workspaces',
    lastCommit: 'Last commit'
  };

  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Lab 1 Guidance</Text>
            <Text component={TextVariants.p}>
              This lab focuses on setting up a basic 5G RAN configuration with a single User Equipment (UE), 
              Central Unit (CU), Distributed Unit (DU), and Radio Unit (RU).
            </Text>

            <Text component={TextVariants.h3}>Parameters to Config in CU</Text>
            <Table 
      aria-label="Simple table" 
      className="table-bordered table-header-grey">
      <Thead>
        <Tr>
          <Th>{columnNames.name}</Th>
          <Th>{columnNames.branches}</Th>
          <Th>{columnNames.prs}</Th>
          <Th>{columnNames.workspaces}</Th>
          <Th>{columnNames.lastCommit}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {repositories.map(repo => (
          <Tr key={repo.name}>
            <Td dataLabel={columnNames.name}>{repo.name}</Td>
            <Td dataLabel={columnNames.branches}>{repo.branches}</Td>
            <Td dataLabel={columnNames.prs}>{repo.prs}</Td>
            <Td dataLabel={columnNames.workspaces}>{repo.workspaces}</Td>
            <Td dataLabel={columnNames.lastCommit}>{repo.lastCommit}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>


            <Text component={TextVariants.h3}>Test & Validation:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Verify connectivity and signal strength between UE and CU.</TextListItem>
              <TextListItem>Ensure seamless data flow from UE through CU, DU, and RU.</TextListItem>
              <TextListItem>Analyze logs for any errors or performance issues.</TextListItem>
            </TextList>
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default LabonePage;



