import React from 'react';
import { Text, TextVariants, TextList, TextListVariants, TextListItem} from '@patternfly/react-core';
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

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>CU State will be running</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict5.png" alt="pict5" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Configure the rest of parameters</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict6.png" alt="pict6" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>The logs is already fine</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict7.png" alt="pict7" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>
        <Text component={TextVariants.p} style={{ marginBottom: '24px'}}>The backend still need a time to fetch the logs and 
          protocol stack. After this the progress will reach 36%.
        </Text>

        <TextListItem style={{marginBottom: '18px'}}>Integrate the DU for real-time processing and signal management and RU for radio signal transmission.</TextListItem>
        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>After configure the port, the state will be running like this</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict8.png" alt="pict8" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Configure the rest of parameters</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict9.png" alt="pict9" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>The logs is fine, until UE connect to DU/RU</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict10.png" alt="pict10" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <TextListItem style={{marginBottom: '18px'}}>Configure the UE with the necessary parameters and connect it to the DU/RU</TextListItem>
        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>The UE state at first is stopped, you need to start to config it</Text>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px'}}>
          <img src="/pict11.png" alt="pict11" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>

        <Text component={TextVariants.p} style={{ fontWeight: 'bold'}}>Config the UE identity parameter</Text>
        <div style={{ display: 'flex', marginBottom: '24px'}}>
          <img src="/pict12.png" alt="pict12" style={{ width: '80%', height: 'auto', display: 'block', margin: '0 auto 0 0' }}/>
        </div>
    </TextList>
  );
}

export default Task;



