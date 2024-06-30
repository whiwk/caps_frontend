import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function ImplementationPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0'}} className='page-container'>
      <div className="main-content-container">
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'> {/* Main content */}
      <TextContent style={{ marginRight:'200px', marginLeft:'8px'}}>
        <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px'}}>5G Overview</Text>
        
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/5goverview.png" alt="arsitektur" style={{ marginBottom: '24px', width: '650px'}}/>
        </div>

        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>5G Core Network</Text>
        <Text component={TextVariants.p}>
          The 5G Core Network is the backbone of modern mobile communications, enabling a new era of connectivity 
          and data transmission. It supports a wide range of services and ensures seamless communication across various 
          devices and applications. Here, we explore the essential components of the 5G Core Network and their vital functions:
        </Text>

        <Text component={TextVariants.h3}>Components and Their Functions</Text>
        <TextList component={TextListVariants.ol}>
          <TextListItem>Access and Mobility Management Function (AMF)
            <TextList>
              <TextListItem>Function: Manages user equipment (UE) access and mobility.</TextListItem>
              <TextListItem>Role: Ensures efficient handling of user registrations, authentication, and mobility management, providing continuous connectivity as users move across different network areas.</TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Session Management Function (SMF)
            <TextList>
              <TextListItem>Function: Handles session management and IP address allocation.</TextListItem>
              <TextListItem>Role: Manages the establishment, modification, and release of user sessions, ensuring optimal use of network resources and consistent IP address allocation for seamless data services.</TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>User Plane Function (UPF)
            <TextList>
              <TextListItem>Function: Manages user plane traffic and routing.</TextListItem>
              <TextListItem>Role: Directs the data traffic between user devices and external data networks, optimizing the data flow and minimizing latency for an enhanced user experience.</TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Network Repository Function (NRF)
            <TextList>
              <TextListItem>Function: Maintains a repository of network functions and their profiles.</TextListItem>
              <TextListItem>Role: Acts as a centralized registry for all network functions, facilitating efficient discovery and communication between different components within the 5G Core Network.</TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Policy Control Function (PCF)
            <TextList>
              <TextListItem>Function: Enforces network policies.</TextListItem>
              <TextListItem>Role: Implements dynamic policy rules to manage network behavior, ensuring quality of service (QoS), resource allocation, and compliance with regulatory requirements.</TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Unified Data Management (UDM)
            <TextList>
              <TextListItem>Function: Manages user data and profiles.</TextListItem>
              <TextListItem>Role: Stores and handles subscriber information, authentication credentials, and user profiles, enabling personalized services and secure access to the network.</TextListItem>
            </TextList>
          </TextListItem>
        </TextList>
        <Text component={TextVariants.p} style={{marginBottom: '48px'}}>
          By integrating these components, the 5G Core Network delivers robust and flexible connectivity solutions, 
          meeting the diverse demands of modern mobile communications.
        </Text>

        <Text component={TextVariants.h1} style={{ fontSize: '28px'}}>Open Radio Access Network</Text>
        <Text component={TextVariants.p}>
          Open RAN revolutionizes traditional RAN architecture by promoting interoperability and flexibility 
          through open interfaces and standards. This transformative approach enhances the efficiency and 
          adaptability of radio access networks, providing numerous benefits to operators and end-users alike.
        </Text>

        <Text component={TextVariants.h3}>Components and Their Functions</Text>
        <TextList component={TextListVariants.ol}>
          <TextListItem>Central Unit (CU)
            <TextList>
              <TextListItem>Function: Controls the radio network, manages signaling, and processes data.</TextListItem>
              <TextListItem>Role: The CU acts as the brain of the Open RAN architecture, handling non-real-time
                functions such as data packet processing, signaling, and mobility management. It ensures efficient 
                coordination across the network, facilitating seamless data flow and robust connectivity.
              </TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Distributed Unit (DU)
            <TextList>
              <TextListItem>Function: Handles real-time processing and radio signal management.</TextListItem>
              <TextListItem>Role: Positioned closer to the end-user, the DU is responsible for real-time operations, 
                including baseband processing and resource allocation. It manages the immediate radio environment, 
                ensuring low latency and high-performance communication for end-user devices.
              </TextListItem>
            </TextList>
          </TextListItem>
          <TextListItem>Radio Unit (RU)
          <TextList>
              <TextListItem>Function: Converts digital signals to radio waves and vice versa, interfacing with the antennas.</TextListItem>
              <TextListItem>Role: The RU operates at the network's edge, interfacing directly with the antennas to transmit 
                and receive radio signals. It converts digital signals from the DU into radio frequencies and vice versa, 
                ensuring accurate and efficient communication between the network and user devices.
              </TextListItem>
            </TextList>
          </TextListItem>
        </TextList>

        <Text component={TextVariants.h3}>Benefit of Open RAN</Text>
        <TextList component={TextListVariants.ol}>
        <TextListItem>Interoperability: By adhering to open standards, Open RAN allows equipment from different vendors 
          to work together seamlessly, reducing reliance on proprietary solutions and fostering a competitive market.
        </TextListItem>
        <TextListItem>Flexibility: Open interfaces enable operators to mix and match components from various suppliers, 
          optimizing their networks to meet specific needs and deploying new services more quickly.
        </TextListItem>
        <TextListItem>Cost Efficiency: By breaking the vendor lock-in, Open RAN can significantly lower capital and 
          operational expenditures, allowing operators to allocate resources more effectively.
        </TextListItem>
        <TextListItem>Innovation: Open RAN encourages innovation by creating a more dynamic ecosystem where new 
          technologies and solutions can be rapidly developed and integrated into the network.
        </TextListItem>
        </TextList>

        <Text component={TextVariants.p}>
          By integrating these components and leveraging the benefits of open interfaces and standards, Open RAN creates 
          a more adaptable, cost-effective, and innovative radio access network, paving the way for the future of mobile 
          communications.
        </Text>

      </TextContent>
      </main>
      </div>
    </div>
  );
}

export default ImplementationPage;



