import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  FormGroup,
  TextInput,
  Grid,
  GridItem
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
  1: ['CU', 'DU', 'UE'],
  2: ['CU', 'DU1', 'DU2', 'UE1', 'UE2'],
  3: ['CU', 'DU', 'UE1', 'UE2']
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

  return (
    <Card ouiaId="BasicCard" style={{borderRadius: '6px', height: '522px'}}>
      <CardHeader title="Configuration Panel" style={{marginTop: '-20px'}}>
        <Grid hasGutter>
          <GridItem span={12} style={{ display: 'flex', justifyContent: 'center' }}>
            {levelComponents[userLevel].map(component => (
              <Button key={component} variant="primary" isInline onClick={() => handleComponentSelection(component)} style={{margin: '5px'}}>
                {component}
              </Button>
            ))}
          </GridItem>
        </Grid>
      </CardHeader>
      <CardBody style={{borderRadius: '6px'}}>
        <Form style={{ maxHeight: '370px', overflowY: 'auto', width: '105%' }}>
          {Object.entries(values).map(([key, value]) => (
            <FormGroup key={key} label={key} fieldId={key}>
              <TextInput
                id={key}
                value={value}
                type="text"
                onChange={e => setValues({...values, [key]: e})}
              />
            </FormGroup>
          ))}
        </Form>
      </CardBody>
      <CardFooter style={{borderRadius: '6px'}}>
      <Button variant="primary" onClick={() => console.log('Submitting data:', values)} style={{width: '100%'}}>
            Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigurationPanel;
