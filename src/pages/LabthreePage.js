import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function LabtwoPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Lab 2 Guidance</Text>
            <Text component={TextVariants.p}>
              This lab extends the previous setup to include multiple UEs.
            </Text>

            <Text component={TextVariants.h3}>Task Details:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Configure additional UEs with distinct parameters.</TextListItem>
              <TextListItem>Ensure the CU can manage multiple connections efficiently.</TextListItem>
              <TextListItem>Validate that the DU handles increased data traffic without performance degradation.</TextListItem>
              <TextListItem>Verify that the RU can transmit multiple signals simultaneously.</TextListItem>
            </TextList>

            <Text component={TextVariants.h3}>Test & Validation:</Text>
            <TextList component={TextListVariants.ol}>
              <TextListItem>Test connectivity for each UE.</TextListItem>
              <TextListItem>Monitor data flow and signal strength for multiple UEs.</TextListItem>
              <TextListItem>Analyze performance metrics and logs for potential bottlenecks.</TextListItem>
            </TextList>
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default LabtwoPage;



