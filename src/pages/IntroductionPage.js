import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Grid, GridItem, PageSection, Card, CardTitle, CardBody, TextContent, Text, TextVariants} from '@patternfly/react-core';
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
        <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>What is ORCA?</Text>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
        ORCA (Open RAN Configuration Application) is a simulation dashboard-based training platform 
        that enhancing user, master the complexities of 5G RAN configuration.
        </Text>
        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Who We Are</Text>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
          We are made of final year students who wish graduate as soon as possible, developing ORCA, 
          a simulation dashboard-based training platform for our final project capstone.
          Our work is supported by the Telecom Infra Project (TIP) lab, 
          a global community accelerating open, standards-based technology solutions for high-quality connectivity. 
          Through TIP's resources, we aim to create an innovative training platform that meets current and future telecom industry needs.
        </Text>
        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>What we're building</Text>
        <Text component={TextVariants.p} style={{marginBottom: '18px'}}>
          Our features extends beyond the basics. ORCA features topology graph visualization, 
          Wireshark for packet analysis, and monitoring, all designed to elevate your 5G RAN configuration experience.
        </Text>
      </TextContent>
        {/* <h1 style={{ fontSize: '36px', marginBottom: '24px',}}>What is ORCA?</h1> */}
        {/* <p style={{ fontSize: '16px', marginBottom: '12px'}}>Teknologi 5G memberikan kecepatan dan kapasitas layanan 
          jaringan seluler yang tinggi, namun instalasi dan integrasi 
          komponen-komponennya membutuhkan konfigurasi yang kompleks. 
          Oleh karena itu, dibutuhkan suatu platform untuk pelatihan 
          yang mendalam dan praktis tentang konfigurasi dan pemahaman 
          komponen 5G RAN melalui pendekatan berbasis simulasi</p> */}
        {/* <p style={{ fontSize: '16px', marginBottom: '48px' }}> ORCA (Open RAN Configuration Application)
          adalah platform pelatihan berbasis dashboard
          simulasi yang membantu pengguna memahami
          dan mengkonfigurasi komponen 5G RAN
          secara sistematik dengan tingkatan level yang
          meningkatkan pemahaman use case.</p> */}

        {/* <h1 style={{ fontSize: '24px',  }}>Who We Are?</h1>
        <p style={{ fontSize: '16px', marginBottom: '48px' }}> yo ndak tau kok tanya saya</p>
        <h1 style={{ fontSize: '24px',  }}>What We're Building?</h1>
        <p style={{ fontSize: '16px', marginBottom: '12px' }}> fitur fitur fitur kita pny banyak fitur</p> */}
        <Grid hasGutter style={{ marginBottom: '54px', marginRight:'200px', marginLeft:'8px'}}>
        <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '550px', borderRadius: '8px'}}>
              <CardBody>
              <CardBody>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
                  <img src="/topology.png" alt="topology" style={{ width: '350px', height: '150px' }} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Topology</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  The topology connects end users to RAN components (RU, DU, CU) and
                  links to the core (AMF and UPF). This integration ensures efficient 
                  communication flow and network management.
                </Text>
              </CardBody>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '550px', borderRadius: '8px'}}>
              <CardBody>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px', marginTop: '20px'}}>
                  <img src="/packetsniff.png" alt="packetsniff" style={{ width: '150px', }} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Wireshark</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  allows you to effortlessly sniff and analyze network packets, providing detailed 
                  insights into network traffic and performance for comprehensive troubleshooting and optimization.
                </Text>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={4}>
            <Card ouiaId="BasicCard" style={{height: '550px', borderRadius: '8px'}}>
              <CardBody>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '30px'}}>
                  <img src="/graph.png" alt="graph" style={{ width: '300px', }} />
                </div>
                <CardTitle>
                  <Text component={TextVariants.h1} style={{ fontSize: '20px', textAlign: 'center'}}>Monitoring</Text>
                </CardTitle>
                <Text component={TextVariants.p} style={{marginBottom: '30px', textAlign: 'center'}}>
                  Network Trainer offers comprehensive logging and monitoring for OAI CNFs, 
                  with centralized log aggregation, real-time analysis, and alerting. 
                  It simplifies deploying and managing OpenAirInterface CU and DU on Kubernetes.
                </Text>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      {/* <h1 style={{ fontSize: '24px',  }}>What We Learn?</h1>
      <p style={{ fontSize: '16px', marginBottom: '48px' }}> pelajaran yang dapat diambil adalah hikmahnya </p> */}
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




