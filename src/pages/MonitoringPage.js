// src/pages/MonitoringPage.js
import React from 'react';
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody } from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import MonitoringGraph from '../components/MonitoringGraph';
import MonitoringTable from '../components/MonitoringTable';

function MonitoringPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }}>
      <Helmet>
        <title>Orca | Monitoring</title>
      </Helmet>
    <PageSection>
      <Grid hasGutter>
        <GridItem span={12} rowSpan={6}>
          <Card ouiaId="BasicCard" style={{height: '880px', borderRadius: '8px'}}>
            <CardTitle style={{ backgroundColor: '#0891B2', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
              UE Simulator: L1 Graph
            </CardTitle>
            <CardBody>
              <MonitoringGraph />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={12} rowSpan={6}>
          <Card ouiaId="BasicCard" style={{height: '550px', borderRadius: '8px'}}>
          <CardTitle style={{ backgroundColor: '#0891B2', color:'#fEffff', padding:'10px', marginTop: '-24px', marginLeft: '-24px', marginRight: '-24px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px'}}>
              UE Key Performance Indicators
          </CardTitle>
            <CardBody>
              <MonitoringTable />
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </PageSection>
    </div>
  );
}

export default MonitoringPage;
