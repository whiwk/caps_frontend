import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function LabthreePage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Lab 3 Guidance</Text>
            <Text component={TextVariants.p}>
              This advanced lab setup includes a single UE, one CU, multiple DUs, 
              and multiple RUs, demonstrating a more complex network configuration.
            </Text>

            <Text component={TextVariants.h3}>Task Details:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Configure the single UE and CU as in Lab 1.</TextListItem>
              <TextListItem>Integrate multiple DUs to distribute processing loads.</TextListItem>
              <TextListItem>Connect multiple RUs to each DU for extended coverage and capacity.</TextListItem>
            </TextList>

            <Text component={TextVariants.h3}>Test & Validation:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Validate connectivity and data flow through multiple DUs and RUs.</TextListItem>
              <TextListItem>Ensure that the network maintains high performance under increased load.</TextListItem>
              <TextListItem>Analyze logs and performance metrics for each component.</TextListItem>
            </TextList>
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default LabthreePage;



