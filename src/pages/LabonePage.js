import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function LabonePage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Lab 1 Guidance</Text>
            <Text component={TextVariants.p}>
              The 5G Core Network is the backbone of the modern mobile communications system. 
              It supports various services and ensures seamless connectivity and data transmission.
            </Text>

            <Text component={TextVariants.h3}>Task Details:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Configure the UE with the necessary parameters.</TextListItem>
              <TextListItem>Set up the CU to manage the network and signal processing.</TextListItem>
              <TextListItem>Integrate the DU for real-time processing and signal management.</TextListItem>
              <TextListItem>Connect the RU to the DU for radio signal transmission.</TextListItem>
            </TextList>

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



