import React, { useState, useEffect } from 'react';
import './TryComponentConfig.css'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  TextInput,
  Grid,
  GridItem, Title
} from '@patternfly/react-core';
import api from '../services/apiService';

const componentData = {
    CU: { 'CU ID': '', 'Cell ID': '', 'f1 IPadd': '', 'f1 CU Port': '', 'f1 DU Port': '', 'n2 IPadd': '', 'n3 IPadd': '', 'mcc': '', 'mnc': '', 'tac': '', 'sst': '', 'AMF Host': '' },
    DU: { 'gNB ID': '', 'DU ID': '', 'Cell ID': '', 'f1 IPadd': '', 'f1 CU Port': '', 'f1 DU Port': '', 'mcc': '', 'mnc': '', 'tac': '', 'sst': '', 'usrp': '', 'CU Host': '' },
    DU1: { 'gNB ID': '', 'DU ID': '', 'Cell ID': '', 'Physical Cell ID': '', 'f1 IPadd': '', 'f1 CU Port': '', 'f1 DU Port': '', 'mcc': '', 'mnc': '', 'tac': '', 'sst': '', 'usrp': '', 'CU Host': '' },
    DU2: { 'gNB ID': '', 'DU ID': '', 'Cell ID': '', 'Physical Cell ID': '', 'f1 IPadd': '', 'f1 CU Port': '', 'f1 DU Port': '', 'mcc': '', 'mnc': '', 'tac': '', 'sst': '', 'usrp': '', 'CU Host': '' },
    UE: { 'IPadd': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'opc': '', 'dnn': '', 'sst': '', 'sd': '', 'usrp': '' },
    UE1: { 'IPadd': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'opc': '', 'dnn': '', 'sst': '', 'sd': '', 'usrp': '' },
    UE2: { 'IPadd': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'opc': '', 'dnn': '', 'sst': '', 'sd': '', 'usrp': '' },
};

const levelComponents = {
  1: ['UE', 'DU', 'CU'],
  2: ['UE1', 'UE2', 'DU1', 'DU2', 'CU'],
  3: ['UE1', 'UE2', 'DU', 'CU']
};

const fetchUserLevel = async () => {
    try {
      const response = await api.get('user/information/');
      return response.data.level; // Ensure this matches the response structure from your API
    } catch (error) {
      console.error('Failed to fetch user level:', error);
      return 1; // Default level in case of error
    }
};

const ConfigurationPanel = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState('CU');
  const [values, setValues] = useState({});

  useEffect(() => {
    fetchUserLevel().then(level => {
      setUserLevel(level);
      handleComponentSelection(levelComponents[level][0]);
    });
  }, []);

  const handleComponentSelection = (componentKey) => {
    setSelectedComponent(componentKey);
    setValues(componentData[componentKey]);
  };

  const shouldScroll = selectedComponent === 'DU' || selectedComponent === 'CU' || selectedComponent === 'DU1' || selectedComponent === 'DU2' ;

  return (
    <Card ouiaId="BasicCard" style={{borderRadius: '6px', height: '540px'}}>
      <CardHeader title="Configuration Panel" style={{marginTop: '-20px', marginLeft: '-17px', marginRight: '-17px'}}>
        <Grid hasGutter>
          <GridItem span={12} style={{ display: 'flex', justifyContent: 'space-between', height: '30px' }}>
            {levelComponents[userLevel].map(component => (
              <Button key={component} variant="primary" isInline onClick={() => handleComponentSelection(component)} style={{margin: '1px', width: '180px', fontSize: '10px'}}>
                {component}
              </Button>
            ))}
          </GridItem>
        </Grid>
      </CardHeader>
      <CardBody>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #ccc', marginLeft: '-15px', marginRight: '-15px' }}>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-40px' }}>Key</Title>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-30px' }}>Current Value</Title>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>Set Value</Title>
        </div>
        <div style={shouldScroll ? { position: 'relative', overflowY: 'auto', maxHeight: '360px', width: '420px', paddingLeft: '15px', paddingRight: '20px', marginLeft: '-15px', overflowX: 'hidden', } : {}}>
          {Object.entries(values).map(([key, value]) => (
            <div key={key} style={{ display: 'flex', paddingTop: '10px', marginLeft: '-15px', marginRight: '-15px' }}>
              <span style={{ width: '240px', textAlign: 'left', fontSize: '0.75rem', marginTop: '6px' }}>{key}</span>
              <TextInput
                id={`${key}-current`}
                value={value}
                type="text"
                isReadOnly
                style={{ flex: 1, margin: '0 0px', fontSize: '0.75rem', boxSizing: 'border-box' }}
              />
              <TextInput
                id={`${key}-new`}
                value={value}
                type="text"
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                style={{ flex: 1, fontSize: '0.75rem', boxSizing: 'border-box'}}
              />
            </div>
          ))}
        </div>

      </CardBody>
      <CardFooter style={{borderRadius: '6px'}}>
      <Button variant="primary" onClick={() => console.log('Submitting data:', values)} style={{width: '107.5%', marginLeft: '-15px', marginBottom: '-10px'}}>
            Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigurationPanel;
