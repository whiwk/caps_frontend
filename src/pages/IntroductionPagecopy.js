import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody } from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import './Introduction.css'

function IntroductionPage() {
  return (
    <div style={{ display: 'flex' }} backgroundColor= '#f0f0f0'>
      <Helmet>
        <title>Orca | Introduction</title>
      </Helmet>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}> {/* Main content */}
        <h1 style={{ fontSize: '36px', marginBottom: '24px',}}>What is ORCA?</h1>
        <p style={{ fontSize: '18px', marginBottom: '12px'}}>Teknologi 5G memberikan kecepatan dan kapasitas layanan 
          jaringan seluler yang tinggi, namun instalasi dan integrasi 
          komponen-komponennya membutuhkan konfigurasi yang kompleks. 
          Oleh karena itu, dibutuhkan suatu platform untuk pelatihan 
          yang mendalam dan praktis tentang konfigurasi dan pemahaman 
          komponen 5G RAN melalui pendekatan berbasis simulasi</p>
        <p style={{ fontSize: '18px', marginBottom: '48px' }}> ORCA (Open RAN Configuration Application)
          adalah platform pelatihan berbasis dashboard
          simulasi yang membantu pengguna memahami
          dan mengkonfigurasi komponen 5G RAN
          secara sistematik dengan tingkatan level yang
          meningkatkan pemahaman use case.</p>

        <h1 style={{ fontSize: '24px',  }}>Who We Are?</h1>
        <p style={{ fontSize: '18px', marginBottom: '48px' }}> yo ndak tau kok tanya saya</p>
        <h1 style={{ fontSize: '24px',  }}>What We're Building?</h1>
        <p style={{ fontSize: '18px', marginBottom: '12px' }}> fitur fitur fitur kita pny banyak fitur</p>
        <Grid hasGutter style={{ marginBottom: '48px'}}>
        <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '700px', borderRadius: '8px'}}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Topology
              </CardTitle>
              <CardBody>
               
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '700px', borderRadius: '8px'}}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Wireshark
              </CardTitle>
              <CardBody>
               
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '700px', borderRadius: '8px'}}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Monitor
              </CardTitle>
              <CardBody>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      <h1 style={{ fontSize: '24px',  }}>What We Learn?</h1>
      <p style={{ fontSize: '18px', marginBottom: '48px' }}> pelajaran yang dapat diambil adalah hikmahnya </p>
      </main>
    </div>
  );
}

export default IntroductionPage;



