import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Grid, GridItem, Card, CardTitle, CardBody, TextContent, Text, TextVariants, TextListItem, TextList } from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import './Introduction.css';

function OrcaIntroductionPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <Helmet>
        <title>Orca | Introduction</title>
      </Helmet>
      <div className="main-content-container">
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'> {/* Main content */}
          <TextContent style={{ marginRight: '200px', marginLeft: '8px' }}>
            <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '36px' }}>What is ORCA?</Text>
            <img src="/logo-orca-black.png" alt="logoorca" style={{ marginBottom: '18px', width: '250px' }} />
            <Text component={TextVariants.p} style={{ marginBottom: '48px', textAlign: 'justify' }}>
              ORCA (Open RAN Configuration Application) is an advanced simulation dashboard-based
              training platform specifically designed to elevate users' understanding and expertise
              in configuring 5G Radio Access Networks (RAN). This innovative platform provides
              a comprehensive, interactive environment where users can explore, simulate, and master
              the intricate configurations and operations of 5G RAN, facilitating hands-on learning
              and skill development. ORCA integrates sophisticated tools and features, including
              topology graph visualization, real-time monitoring, and detailed packet analysis with
              Wireshark, making it an indispensable resource for anyone looking to deepen their
              knowledge and proficiency in 5G RAN configuration.
            </Text>

            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>Who We Are</Text>
            <Text component={TextVariants.p} style={{ marginBottom: '18px', textAlign: 'justify' }}>
              We are a dedicated team of final-year students on the cusp of graduation, united
              by our passion for innovation and excellence in telecommunications. Our capstone project,
              ORCA (Open RAN Configuration Application), is a testament to our commitment to advancing
              the field. Developed with the invaluable support of the Telecom Infra Project (TIP) lab,
              ORCA represents our collective vision and effort to create a transformative training platform.
            </Text>
            <img src="/tip-logo.png" alt="logotip" style={{ marginBottom: '18px' }} />
            <Text component={TextVariants.p} style={{ marginBottom: '48px', textAlign: 'justify' }}>
              TIP is a global community dedicated to accelerating the development and deployment of open,
              standards-based technology solutions for high-quality connectivity. By leveraging TIP's
              extensive resources, expertise, and collaborative spirit, we aim to address the current and
              future needs of the telecom industry. Our partnership with TIP empowers us to design and develop
              a cutting-edge platform that not only meets the industry's demands but also prepares the next
              generation of telecom professionals for the challenges ahead.
            </Text>

            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>What we're building</Text>
            <Text component={TextVariants.p} style={{ marginBottom: '18px', textAlign: 'justify' }}>
              ORCA transcends the traditional boundaries of training platforms by incorporating a
              suite of advanced features designed to elevate the 5G RAN configuration experience:
            </Text>
          </TextContent>

          <Grid hasGutter style={{ marginBottom: '54px', marginRight: '200px', marginLeft: '8px' }}>
            <GridItem span={4}>
              <Card ouiaId="BasicCard" style={{ height: '600px', borderRadius: '8px' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', marginTop: '0px' }}>
                    <img src="/network-topology.png" alt="topology" style={{ width: '164px', height: '164px' }} />
                  </div>
                  <CardTitle>
                    <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center' }}>Topology Graph Visualization</Text>
                  </CardTitle>
                  <Text component={TextVariants.p} style={{ marginBottom: '30px', textAlign: 'center' }}>
                    Provides a dynamic and interactive interface for visualizing and managing network topologies,
                    enabling users to intuitively understand and configure complex network layouts.
                  </Text>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={4}>
              <Card ouiaId="BasicCard" style={{ height: '600px', borderRadius: '8px' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', marginTop: '20px' }}>
                    <img src="/packetsniff.png" alt="packetsniff" style={{ width: '150px' }} />
                  </div>
                  <CardTitle>
                    <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center' }}>Wireshark for Packet Analysis</Text>
                  </CardTitle>
                  <Text component={TextVariants.p} style={{ marginBottom: '30px', textAlign: 'center' }}>
                    Integrates the powerful capabilities of Wireshark, allowing users to perform in-depth packet
                    analysis. This feature is essential for troubleshooting, optimizing network performance,
                    and ensuring efficient data flow.
                  </Text>
                </CardBody>
              </Card>
            </GridItem>
            <GridItem span={4}>
              <Card ouiaId="BasicCard" style={{ height: '600px', borderRadius: '8px' }}>
                <CardBody>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}>
                    <img src="/graph.png" alt="graph" style={{ width: '300px' }} />
                  </div>
                  <CardTitle>
                    <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center' }}>Real-Time Monitoring</Text>
                  </CardTitle>
                  <Text component={TextVariants.p} style={{ marginBottom: '30px', textAlign: 'center' }}>
                    Delivers comprehensive real-time monitoring of network performance and health.
                    Users can track key performance indicators, detect anomalies, and respond proactively
                    to maintain optimal network operations.
                  </Text>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <TextContent style={{ marginRight: '200px', marginLeft: '8px' }}>
            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>Our Mission</Text>
            <Text component={TextVariants.p} style={{ marginBottom: '48px', textAlign: 'justify' }}>
              Our mission is to develop a state-of-the-art training platform that empowers
              telecom professionals with the knowledge and tools necessary to excel in 5G RAN
              configuration. By combining advanced visualization, analysis, and monitoring capabilities,
              ORCA aims to bridge the gap between theoretical knowledge and practical expertise, fostering
              a new generation of skilled telecom engineers.
            </Text>

            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>Team Members</Text>
            <TextList>
              <TextListItem>Ari Erginta Ginting: Infrastructure Engineer</TextListItem>
              <TextListItem>Bagus Dwi Prasetyo: Backend Engineer</TextListItem>
              <TextListItem>Ima Dewi Arofani: Frontend Engineer</TextListItem>
              <TextListItem>Mochamad Rafli Hadiana: System Integrator Engineer</TextListItem>
            </TextList>
            <Text component={TextVariants.p}>
              Together, we are committed to pushing the boundaries of what's possible in telecom training and
              configuration. Thank you for your interest in ORCA.
            </Text>
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default OrcaIntroductionPage;
