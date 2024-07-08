import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants } from '@patternfly/react-core';
import './Introduction.css'
import TableCU from './TableCU';
import TableDU from './TableDU';
import TableUE from './TableUE';
import Task from './Task';
import Validation from './Validation';

function LabGuidancePage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Lab Guidance</Text>
            <Text component={TextVariants.p}>
              This lab focuses on setting up a basic 5G RAN configuration with a single User Equipment (UE), 
              Central Unit (CU), Distributed Unit (DU), and Radio Unit (RU).
            </Text>

            <Text component={TextVariants.h3}>Parameters to Config in CU</Text>
            <TableCU />

            <Text component={TextVariants.h3}>Parameters to Config in DU</Text>
            <TableDU />

            <Text component={TextVariants.h3}>Parameters to Config in UE</Text>
            <TableUE />

            <Text component={TextVariants.h3}>Task Details</Text>
            <Task />

            <Text component={TextVariants.h3}>Test & Validation:</Text>
            <Validation />
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default LabGuidancePage;



