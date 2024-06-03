// src/pages/MonitoringPage.js
import React from 'react';
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody, Tab } from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import Graph from '../components/Graph';
import TableMisc from '../components/Table';



function MonitoringPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }}>
      <Helmet>
        <title>Orca | Monitoring</title>
      </Helmet>
    <PageSection>
      <Grid hasGutter>
        <GridItem span={12} rowSpan={6}>
          <Card ouiaId="BasicCard" style={{height: '775px', borderRadius: '8px'}}>
            <CardTitle style={{ backgroundColor: '#0A7373', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
              UE Simulator: L1 Graph
            </CardTitle>
            <CardBody>
              <Graph />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={12} rowSpan={6}>
          <Card ouiaId="BasicCard" style={{height: '500px', borderRadius: '8px'}}>
            <CardBody>
              <TableMisc />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={12} rowSpan={6}>
          <Card ouiaId="BasicCard" style={{height: '500px', borderRadius: '8px'}}>
            <CardTitle>
             
            </CardTitle>
            <CardBody>
              
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
    </div>
  );
}

export default MonitoringPage;
