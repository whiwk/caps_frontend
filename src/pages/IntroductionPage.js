import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody, TextContent, Text, TextVariants, TextListItem, TextList, TextListVariants} from '@patternfly/react-core';
import { Helmet } from 'react-helmet';
import './Introduction.css'

function IntroductionPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <Helmet>
        <title>Orca | Introduction</title>
      </Helmet>
      <div className="main-content-container">
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'> {/* Main content */}
      <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
        <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '36px'}}>What is ORCA?</Text>
        <img src="/logo-orca-black.png" alt="logoorca" style={{ marginBottom: '18px' }}/>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
          ORCA is a cutting-edge simulation dashboard-based training platform designed
          to enhance users' mastery of the complexities of 5G Radio Access Network (RAN) configuration.
        </Text>

        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Who We Are</Text>
        <Text component={TextVariants.p} style={{marginBottom: '18px'}}>
          We are a dedicated team of final-year students on the brink of graduation, 
          driven by a passion for innovation and excellence in telecommunications. 
          Our capstone project, ORCA, is developed with the support of the Telecom Infra Project (TIP) lab.
        </Text>
        <img src="/tip-logo.png" alt="logotip" style={{ marginBottom: '18px' }}/>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
          TIP is a global community committed to accelerating the development and deployment of open, 
          standards-based technology solutions for high-quality connectivity. Leveraging TIP's extensive
          resources and expertise, we strive to create a training platform that addresses the current 
          and future needs of the telecom industry.
        </Text>

        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>What we're building</Text>
        <Text component={TextVariants.p} style={{marginBottom: '18px'}}>
          ORCA transcends the traditional boundaries of training platforms by incorporating a 
          suite of advanced features designed to elevate the 5G RAN configuration experience:
        </Text>
        {/* <TextList component={TextListVariants.ol}>
          <TextListItem>
            Topology Graph Visualization: Provides a dynamic and interactive interface 
            for visualizing and managing network topologies, enabling users to intuitively 
            understand and configure complex network layouts.
          </TextListItem>
          <TextListItem>Cras gravida arcu at diam gravida gravida.</TextListItem>
        </TextList> */}
      </TextContent>

        <Grid hasGutter style={{ marginBottom: '54px', marginRight:'200px', marginLeft:'8px'}}>
        <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '600px', borderRadius: '8px'}}>
              <CardBody>
              <CardBody>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', marginTop: '0px'}}>
                  <img src="/network-topology.png" alt="topology" style={{ width: '164px', height: '164px'}} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Topology Graph Visualization</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  Provides a dynamic and interactive interface for visualizing and managing network topologies, 
                  enabling users to intuitively understand and configure complex network layouts.
                </Text>
              </CardBody>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '600px', borderRadius: '8px'}}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', marginTop: '20px'}}>
                  <img src="/packetsniff.png" alt="packetsniff" style={{ width: '150px', }} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Wireshark for Packet Analysis</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  Integrates the powerful capabilities of Wireshark, allowing users to perform in-depth packet 
                  analysis. This feature is essential for troubleshooting, optimizing network performance, 
                  and ensuring efficient data flow.
                </Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '600px', borderRadius: '8px'}}>
              <CardBody>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
                  <img src="/graph.png" alt="graph" style={{ width: '300px', }} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Real-Time Monitoring</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  Delivers comprehensive real-time monitoring of network performance and health. 
                  Users can track key performance indicators, detect anomalies, and respond proactively 
                  to maintain optimal network operations.
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
          <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Our Mission</Text>
          <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
            Our mission is to develop a state-of-the-art training platform that empowers 
            telecom professionals with the knowledge and tools necessary to excel in 5G RAN 
            configuration. By combining advanced visualization, analysis, and monitoring capabilities,
            ORCA aims to bridge the gap between theoretical knowledge and practical expertise, fostering 
            a new generation of skilled telecom engineers.
          </Text>

          <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Get Involved</Text>
          <Text component={TextVariants.p}>
            We invite you to join us on this exciting journey. Whether you're a telecom professional 
            looking to enhance your skills, an industry expert willing to share your insights, 
            or an organization interested in collaborating, there are numerous ways to get involved 
            with ORCA. Together, we can drive the future of 5G RAN configuration and beyond.
          </Text>
          <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
            For more information, please contact us at [your contact email].
          </Text>

          <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>What We're  Building</Text>
          <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
            We extend our sincere gratitude to the Telecom Infra Project (TIP) lab for their unwavering 
            support and resources. Their commitment to fostering innovation in telecommunications has 
            been instrumental in the development of ORCA.
          </Text>

          <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Team Members</Text>
          <TextList>
            <TextListItem>Upin: Project Lead</TextListItem>
            <TextListItem>Ipin: Lead Developer</TextListItem>
            <TextListItem>Mei-Mei: Network Specialist</TextListItem>
            <TextListItem>Mail: Data Analyst</TextListItem>
          </TextList>
          <Text component={TextVariants.p}>
            We invite you to join us on this exciting journey. Whether you're a telecom professional 
            looking to enhance your skills, an industry expert willing to share your insights, 
            or an organization interested in collaborating, there are numerous ways to get involved 
            with ORCA. Together, we can drive the future of 5G RAN configuration and beyond.
          </Text>
          <TextList isPlain>
            <TextListItem>[Your University Name]</TextListItem>
            <TextListItem>[Your University Address]</TextListItem>
            <TextListItem>[Your Contact Email]</TextListItem>
            <TextListItem style={{marginBottom: '48px'}}>[Your Project Website (if applicable)]</TextListItem>
          </TextList>
        </TextContent>
      </main>
      </div>
    </div>
  );
}

export default IntroductionPage;

// import React from 'react';
// import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
// import { Helmet } from 'react-helmet';
// import MarkdownDisplay from '../display/MarkdownDisplay'; // Adjust the import path as needed
// import './Introduction.css'


// function IntroductionPage() {
//   return (
//     <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
//       <Helmet>
//         <title>Orca | Introduction</title>
//       </Helmet>
//       <div className="main-content-container">
//       <Sidebar />
//       <main style={{ flexGrow: 1, padding: '1rem', textAlign: 'center' }} className='main-content'> {/* Main content */}
//         <h1 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 'bold' }}>About Open Netra Page</h1>
//         <MarkdownDisplay filePath="/doc/doc.md" /> {/* Adjust the file path as needed */}
//         <p style={{ fontSize: '16px', fontWeight: 'bold' }}>This is a paragraph that provides some information about the Open Netra page.</p>
//         {/* Your other components or content */}
//       </main>
//       </div>
//     </div>
//   );
// }

// export default IntroductionPage;




