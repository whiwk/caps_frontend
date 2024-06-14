import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import {TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function BehindPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className="main-content-container">
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
            <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '36px'}}>Behind the Technology</Text>
            <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Kubeview</Text>
            <img src="/kubeview.png" alt="kubeview" style={{ marginBottom: '18px' }}/>
            <Text component={TextVariants.p}>
              http://kubeview.orca.edu/ 
            </Text>
            <Text component={TextVariants.p}>
              Kubeview provides a comprehensive visualization of the Kubernetes cluster topology, 
              showing how each component communicates and operates within the cluster. This tool is 
              essential for managing and optimizing cluster performance.
            </Text>

          </TextContent>
        </main>
      </div>
    </div>

  );
}

export default BehindPage;