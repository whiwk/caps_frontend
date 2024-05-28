// src/pages/DashboardPage.js
import React, { useEffect } from 'react';
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody } from '@patternfly/react-core';
import TopologyCustomEdgeDemo from '../components/TopologyGraph.js';
import ConfigurationPanel from '../components/TryComponentConfig'; 
import Wireshark from '../components/wireshark/Wireshark.tsx';
import { Helmet } from 'react-helmet';
import api from '../services/apiService.js'
import './DashboardPage.css'

<Grid hasGutter>
  <GridItem span={8}>span = 8</GridItem>
  <GridItem span={4} rowSpan={2}>
    span = 4, rowSpan = 2
  </GridItem>
  <GridItem span={2} rowSpan={3}>
    span = 2, rowSpan = 3
  </GridItem>
  <GridItem span={2}>span = 2</GridItem>
  <GridItem span={4}>span = 4</GridItem>
  <GridItem span={2}>span = 2</GridItem>
  <GridItem span={2}>span = 2</GridItem>
  <GridItem span={2}>span = 2</GridItem>
  <GridItem span={4}>span = 4</GridItem>
  <GridItem span={2}>span = 2</GridItem>
  <GridItem span={4}>span = 4</GridItem>
  <GridItem span={4}>span = 4</GridItem>
</Grid>

function DashboardPage() {
  useEffect(() => {
    const setReplicaSet = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        
        const response = await api.post('http://10.30.1.221:8000/api/v1/kube/set_replicaset/', {}, { headers });

        if (response.status === 200) {
          // console.log('ReplicaSet updated successfully');
        } else {
          console.error('Failed to update ReplicaSet:', response.data);
        }
      } catch (error) {
        console.error('Failed to update ReplicaSet:', error);
      }
    };

    setReplicaSet();
  }, []);

  
  return (
    <div>
      <Helmet>
        <title>Orca | Dashboard</title>
      </Helmet>
      {/* <PageSection style={{overflowX: 'hidden'}}> */}
      <PageSection>
        <Grid hasGutter>

          <GridItem span={12} rowSpan={6}>
            <Card ouiaId="BasicCard" style={{height: '500px', borderRadius: '8px'}}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Topology Graph
              </CardTitle>
              <CardBody>
                <TopologyCustomEdgeDemo />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={5} rowSpan={6}>
            <Card ouiaId="BasicCard" style={{ height: '610px', borderRadius: '8px' }}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Configuration Panel
              </CardTitle>
              {/* <CardBody style={{ overflowX: 'hidden', // Enables vertical scrolling, 
              maxHeight: '700px', // Limits the maximum height
              }}> */}
              <CardBody>
                <ConfigurationPanel />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={7} rowSpan={6} >
            <Card ouiaId="BasicCard" style={{height: '610px', borderRadius: '8px'}}>
              <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
                Wireshark
              </CardTitle>
              <CardBody>
                <Wireshark />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
}

export default DashboardPage;
