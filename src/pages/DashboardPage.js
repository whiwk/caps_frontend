// src/pages/DashboardPage.js
import React from 'react';
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody } from '@patternfly/react-core';
import TopologyCustomEdgeDemo from '../components/Topology.tsx';
import ConfigurationPanel from '../components/TryComponentConfig'; 
import Wireshark from '../components/wireshark/Wireshark.tsx';

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
  return (
    <div>
      <PageSection style={{overflowX: 'hidden'}}>
        <Grid hasGutter>

          <GridItem span={12} rowSpan={6} style={{marginTop: '-10px', marginLeft: '-14px'}}>
            <Card ouiaId="BasicCard" style={{height: '500px', borderRadius: '6px'}}>
              <CardTitle style={{ 
                marginTop: '-20px', 
                marginLeft: '-16px',
                marginRight: '-16px', 
              }}>
                Topology Graph
              </CardTitle>
              <CardBody style={{ 
                marginTop: '-16px', 
                marginLeft: '-24px',
                marginRight: '-24px',
                marginBottom: '-24px', 
              }}>
                <TopologyCustomEdgeDemo />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={4} rowSpan={6} style={{
            marginTop: '-10px',
            marginLeft: '-10px',
            marginRight: '-10px',
          }}>
            <Card ouiaId="BasicCard" style={{ 
              height: '568px', 
              borderRadius: '6px'
              }}>
              <CardTitle style={{ 
                marginTop: '-20px', 
                marginLeft: '-16px',
                marginRight: '-16px',
              }}
              >Configuration Panel</CardTitle>
              <CardBody style={{ 
                overflowX: 'hidden', // Enables vertical scrolling
                maxHeight: '700px', // Limits the maximum height
                marginTop: '-16px', 
                marginLeft: '-24px',
                marginRight: '-24px',
                marginBottom: '-24px', 
              }}>
                <ConfigurationPanel />
              </CardBody>
            </Card>
          </GridItem>

          <GridItem span={8} rowSpan={6} >
            <Card ouiaId="BasicCard" style={{height: '300px'}}>
              <CardTitle>
                <CardBody>
                  <Wireshark />
                </CardBody>
              </CardTitle>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
}

export default DashboardPage;
