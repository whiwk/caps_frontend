import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function LoggingPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>Monitoring and Logging</Text>

            <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Wireshark</Text>
            <Text component={TextVariants.p}>
                Wireshark is a powerful tool for analyzing network protocols and troubleshooting network issues.
            </Text>
            
            <Text component={TextVariants.h3}>Protocol Info:</Text>
            <TextList>
              <TextListItem>nas-5gs: Handles Non-Access Stratum signaling in 5G.</TextListItem>
              <TextListItem>f1ap: Manages signaling between CU and DU.</TextListItem>
              <TextListItem>ngap: Handles signaling between AMF and gNB.</TextListItem>
              <TextListItem>sctp: Ensures reliable, ordered delivery of data.</TextListItem>
              <TextListItem>pfcp: Manages packet forwarding control.</TextListItem>
              <TextListItem>gtp: Handles GPRS Tunneling Protocol for user data transport.</TextListItem>
            </TextList>

            <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Monitoring</Text>
            <Text component={TextVariants.p}>
                Effective monitoring ensures optimal network performance and quick identification of issues.
            </Text>
            <TextList>
              <TextListItem>
                KPI Explanation: Detailed descriptions of key performance indicators, 
                their significance, and how they are measured.
              </TextListItem>
              <TextListItem style={{ marginBottom: '48px'}}>
                Monitoring Graph: Visual representations of network performance metrics, 
                enabling easy tracking and analysis.
              </TextListItem>
            </TextList>

          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default LoggingPage;