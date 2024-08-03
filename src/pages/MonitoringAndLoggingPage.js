import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { TextContent, Text, TextVariants, TextList, TextListItem } from '@patternfly/react-core';
import './Introduction.css'

function MonitoringAndLoggingPage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0' }} className='page-container'>
      <div className='main-content-container'>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }} className='main-content'>
          <TextContent style={{ marginRight: '200px', marginLeft: '8px' }}>
            <Text component={TextVariants.h1} style={{ fontSize: '36px', marginBottom: '48px' }}>Monitoring and Logging</Text>

            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              Here's a brief explanation of each of the terms listed, and their functions within a 5G network:
            </Text>

            <Text component={TextVariants.h3}>L1 TX Processing (Layer 1 Transmit Processing)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              This refers to the physical layer (Layer 1) processing required to transmit data. It includes modulation,
              coding, and signal processing tasks that convert digital data into a format suitable for transmission over
              the air interface.
            </Text>

            <Text component={TextVariants.h3}>ULSCH Encoding (Uplink Shared Channel Encoding)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              The Uplink Shared Channel (UL-SCH) is used for transmitting user data from the user equipment (UE) to
              the base station (gNodeB). Encoding involves adding error correction codes and other processing to ensure
              reliable communication.
            </Text>

            <Text component={TextVariants.h3}>L1 RX Processing (Layer 1 Receive Processing)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              This refers to the physical layer (Layer 1) processing required to receive data. It includes tasks such as
              demodulation, decoding, and signal processing that convert the received signal into a digital format that
              can be further processed by higher layers.
            </Text>

            <Text component={TextVariants.h3}>UL Indication (Uplink Indication)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              UL Indication involves signaling from the UE to the gNodeB indicating the UE's readiness to send data,
              or signaling specific events like buffer status or power headroom.
            </Text>

            <Text component={TextVariants.h3}>PDSCH Receiver (Physical Downlink Shared Channel Receiver)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              The PDSCH is the main channel used for transmitting user data from the gNodeB to the UE. The PDSCH Receiver
              processes the downlink data received over this channel, including demodulation and decoding.
            </Text>

            <Text component={TextVariants.h3}>PDSCH Decoding</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              Decoding is part of the PDSCH Receiver's function, where the encoded data is decoded to retrieve the original
              transmitted information. This process includes error detection and correction.
            </Text>

            <Text component={TextVariants.h3}>Deinterleave</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              Deinterleaving is a process that rearranges data symbols that were interleaved to mitigate the effects of
              burst errors. It ensures that the symbols are placed in the correct order for decoding.
            </Text>

            <Text component={TextVariants.h3}>Rate Unmatch</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              Rate matching involves adjusting the number of bits in the encoded data to fit the available transmission resources.
              Rate unmatching reverses this process during reception to retrieve the original encoded data stream.
            </Text>

            <Text component={TextVariants.h3}>LDPC Decode (Low-Density Parity-Check Decode)</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              LDPC is a type of error-correcting code used in 5G. LDPC decoding involves processing received data to correct
              any errors that occurred during transmission, ensuring reliable communication.
            </Text>

            <Text component={TextVariants.h3}>PDSCH Unscrambling</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              Unscrambling is used to randomize the data in a known way to improve signal quality and reduce interference.
              During reception, unscrambling is reversed to retrieve the original data.
            </Text>

            <Text component={TextVariants.h3}>PDCCH Handling (Physical Downlink Control Channel Handling)</Text>
            <Text component={TextVariants.p} style={{ marginBottom: '48px', textAlign: 'justify' }}>
              The PDCCH carries control information necessary for the UE to decode the PDSCH. PDCCH Handling involves decoding
              this control information, which includes scheduling assignments and other control commands.
            </Text>

            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>Explanation of Each Field in the Data</Text>
            <TextList>
              <TextListItem style={{ textAlign: 'justify' }}>Value (us): Represents the time taken for a specific process or function in microseconds.</TextListItem>
              <TextListItem style={{ textAlign: 'justify' }}>Count: The number of times the process or function has occurred.</TextListItem>
              <TextListItem style={{ textAlign: 'justify' }}>Total Time (us): The cumulative time taken for the process or function, summed over all occurrences.</TextListItem>
            </TextList>

            <Text component={TextVariants.h1} style={{ fontSize: '28px' }}>Function in a 5G Network</Text>
            <Text component={TextVariants.p} style={{ textAlign: 'justify' }}>
              These processes and functions are essential for ensuring reliable and efficient communication in a 5G network.
              They handle the physical transmission and reception of data, error correction, and control signaling, which are critical
              for maintaining the high data rates and low latency required by 5G applications.
            </Text>
          </TextContent>
        </main>
      </div>
    </div>
  );
}

export default MonitoringAndLoggingPage;
