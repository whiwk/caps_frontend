import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody, TextContent, Text, TextVariants} from '@patternfly/react-core';
import './Introduction.css'

function ImplementationPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0'}} className='page-container'>
      <div className="main-content-container">
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'> {/* Main content */}
      <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
        <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>5G Implementation Overview</Text>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/arsitektur.png" alt="arsitektur" style={{ marginBottom: '24px', width: '650px'}}/>
        </div>

        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
        ORCA (Open RAN Configuration Application) is a simulation dashboard-based training platform 
        that enhancing user, master the complexities of 5G RAN configuration.
        </Text>

        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}> 5G Components </Text>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
          yo ndak tau kok tanya saya
        </Text>
      </TextContent>
      </main>
      </div>
    </div>
  );
}

export default ImplementationPage;



