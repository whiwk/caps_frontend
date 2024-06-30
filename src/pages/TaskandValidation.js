import React from 'react';
import { TextContent, Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
import './Introduction.css'

function Task() {
  

  return (
    <TextList component={TextListVariants.ol}>
      <TextListItem style={{marginBottom: '18px'}}>Login to orca.tiplab.id with the right creds from admin</TextListItem>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict1.png" alt="pict1" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

      <TextListItem style={{marginBottom: '18px'}}>Set up the CU to manage the network and signal processing.</TextListItem>
      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Dashboard state awal</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict2.png" alt="pict2" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Make sure to configure CU/DU port first</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict3.png" alt="pict3" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

      <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Configure CU/DU F1 port to 2152</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict4.png" alt="pict4" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

    </TextList>
  );
}

export default Task;



