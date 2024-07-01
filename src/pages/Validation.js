import React from 'react';
import {Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function Validation() {
  

  return (
    <TextList component={TextListVariants.ol}>
      <TextListItem style={{marginBottom: '18px'}}>Analyze logs for any errors or performance issues.</TextListItem>
      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>CU Logs after all integration</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict13.png" alt="pict13" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>CU Protocol after 30 seconds and a few try</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict14.png" alt="pict14" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>DU Logs after connect to UE</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict15.png" alt="pict15" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>
    
      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>The UE & DU logs is still not ideal</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict16.png" alt="pict16" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>
        <Text component={TextVariants.p} style={{ marginBottom: '24px'}}>Registrasi Core berhasil, interface oaitun UE sudah ada dengan IP dinamis.
        </Text>

      <TextListItem style={{marginBottom: '18px'}}>Ensure seamless data flow from UE through CU, DU/RU, UE using Wireshark.</TextListItem>
      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Protocol to filter:</Text>
      <TextList>
        <TextListItem>nas-5gs: Handles Non-Access Stratum signaling in 5G.</TextListItem>
        <TextListItem>f1ap: Manages signaling between CU and DU.</TextListItem>
        <TextListItem>ngap: Handles signaling between AMF and gNB.</TextListItem>
        <TextListItem>sctp: Ensures reliable, ordered delivery of data.</TextListItem>
        <TextListItem>pfcp: Manages packet forwarding control.</TextListItem>
        <TextListItem>gtp: Handles GPRS Tunneling Protocol for user data transport.</TextListItem>
      </TextList>
      
      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Start to sniff CU</Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
        <img src="/pict17.png" alt="pict17" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
      </div>

      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Files pcap to download CU</Text>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
        <img src="/pict18.png" alt="pict18" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
      </div>
      <Text component={TextVariants.p} style={{ marginBottom: '24px'}}>Downloaded pcap file still corrupted.</Text>

      <TextListItem style={{marginBottom: '18px'}}>Verify connectivity and signal strength between UE and CU using monitoring feature.</TextListItem>

    </TextList>
  );
}

export default Validation;



