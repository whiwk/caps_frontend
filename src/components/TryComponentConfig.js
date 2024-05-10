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
    CU: { 'CU ID': '', 'Cell ID': '', 'F1 IP Address': '', 'F1 CU Port': '', 'F1 DU Port': '', 'N2 IP Address': '', 'N3 IP Address': '', 'MCC': '', 'MNC': '', 'TAC': '', 'SST': '', 'AMF Host': '' },
    DU: { 'GNB ID': '', 'DU ID': '', 'Cell ID': '', 'F1 IP Address': '', 'F1 CU Port': '', 'F1 DU Port': '', 'MCC': '', 'MNC': '', 'TAC': '', 'SST': '', 'USRP': '', 'CU Host': '' },
    DU1: { 'GNB ID': '', 'DU ID': '', 'Cell ID': '', 'Physical Cell ID': '', 'F1 IP Address': '', 'F1 CU Port': '', 'F1 DU Port': '', 'MCC': '', 'MNC': '', 'TAC': '', 'SST': '', 'USRP': '', 'CU Host': '' },
    DU2: { 'GNB ID': '', 'DU ID': '', 'Cell ID': '', 'Physical Cell ID': '', 'F1 IP Address': '', 'F1 CU Port': '', 'F1 DU Port': '', 'MCC': '', 'MNC': '', 'TAC': '', 'SST': '', 'USRP': '', 'CU Host': '' },
    UE: { 'IP Address': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
    UE1: { 'IP Address': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
    UE2: { 'IP Address': '', 'RF Sim Server': '', 'Full Imsi': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
};

const levelComponents = {
  1: ['UE', 'DU', 'CU'],
  2: ['UE1', 'UE2', 'DU1', 'DU2', 'CU'],
  3: ['UE1', 'UE2', 'DU', 'CU']
};

const ConfigurationPanel = () => {
  const [userLevel, setUserLevel] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState('UE');
  const [values, setValues] = useState({});

  useEffect(() => {
    const handleComponentSelection = (componentKey) => {
      setSelectedComponent(componentKey);
      setValues(componentData[componentKey]);
    };

    const fetchUserLevel = async () => {
      try {
        const response = await api.get('user/information/');
        return response.data.level; 
      } catch (error) {
        console.error('Failed to fetch user level:', error);
        return 1; // Default level in case of error
      }
    };
  
    fetchUserLevel().then(level => {
      setUserLevel(level);
      handleComponentSelection(levelComponents[level][0]);
    });
  }, []);

  // This function simulates fetching data from the API.
  const fetchComponentValues = async (componentKey) => {
      const componentVariable = {
        'CU': 'single_cu',
        'DU': 'single_du',
        'UE': 'single_ue',
        'DU1': 'multi_du1', // Add the appropriate variables here
        'DU2': 'multi_du2',
        'UE1': 'multi_ue1',
        'UE2': 'multi_ue2'
      }[componentKey];

    try {
      const response = await api.get(`oai/values_${componentVariable}/`);
      return mapApiValuesToComponentDataKeys(response.data.values, componentKey);
    } catch (error) {
      console.error('Failed to fetch component values for:', componentVariable, error);
      return {};
    }
  };

  const apiToComponentKeyMap = {
    cuId: 'CU ID',
    cellId: 'Cell ID',
    gnbId: 'GNB ID',
    duId: 'DU ID',
    usrp: 'USRP',
    cuHost: 'CU Host',
    phyCellId: 'Physical Cell ID',
    multusIPadd: 'IP Address',
    rfSimServer: 'RF Sim Server',
    fullImsi: 'Full Imsi',
    fullKey: 'Full Key',
    opc: 'OPC',
    dnn: 'DNN',
    sd: 'SD',
    f1InterfaceIPadd: 'F1 IP Address',
    f1cuPort: 'F1 CU Port',
    f1duPort: 'F1 DU Port',
    n2InterfaceIPadd: 'N2 IP Address',
    n3InterfaceIPadd: 'N3 IP Address',
    mcc: 'MCC',
    mnc: 'MNC',
    tac: 'TAC',
    sst: 'SST',
    amfhost: 'AMF Host'
    // Add more mappings as necessary
  };

  const keyMap = {
    'CU ID': 'cu_id',
    'Cell ID': 'cell_id',
    'GNB ID': 'gnb_id',
    'DU ID': 'du_id',
    'USRP': 'usrp',
    'CU Host': 'cu_host',
    'Physical Cell ID': 'phycell_id',
    'IP Address': 'multus_ipadd',
    'RF Sim Server': 'rfsimserver',
    'Full Imsi': 'fullimsi',
    'Full Key': 'fullkey',
    'OPC': 'opc',
    'DNN': 'dnn',
    'SD': 'sd',
    'F1 IP Address': 'f1_int',
    'F1 CU Port': 'f1_cuport',
    'F1 DU Port': 'f1_duport',
    'N2 IP Address': 'n2_int',
    'N3 IP Address': 'n3_int',
    'MCC': 'mcc',
    'MNC': 'mnc',
    'TAC': 'tac',
    'SST': 'sst',
    'AMF Host': 'amf_host',
  };

  const transformDataForAPI = (data) => {
    const apiData = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value) {  // Ensure only non-empty values are included
        const apiKey = keyMap[key];  // Get the corresponding API key
        if (apiKey) {
          apiData[apiKey] = value;  // Map the value to the correct API key
        }
      }
    });
    return apiData;
  };

  const mapApiValuesToComponentDataKeys = (apiData, componentKey) => {
    let mappedData = {};
    Object.keys(componentData[componentKey]).forEach(key => {
      const apiEquivalentKey = Object.keys(apiToComponentKeyMap).find(apiKey => apiToComponentKeyMap[apiKey] === key);
      mappedData[key] = apiData[apiEquivalentKey] || '';
    });
    return mappedData;
  };

  const handleComponentSelection = async (componentKey) => {
    setSelectedComponent(componentKey);
    const fetchedData = await fetchComponentValues(componentKey); // This will be a new function to fetch and process data.
    setValues({
      ...componentData[componentKey], // This sets default values
      ...fetchedData // This overrides with fetched data
    });
  };

  const componentToApiMap = {
      'CU': 'single_cu',
      'DU': 'single_du',
      'UE': 'single_ue',
      'DU1': 'multi_du1',
      'DU2': 'multi_du2',
      'UE1': 'multi_ue1',
      'UE2': 'multi_ue2'
  };

  const handleSubmit = async () => {
    const payload = transformDataForAPI(values);
    
    console.log("Payload to be sent:", payload); // Confirm what is being sent
  
    if (Object.keys(payload).length === 0) {
      alert('No changes to submit.');
      return;
    }
  
    const componentApiVariable = componentToApiMap[selectedComponent];
    const apiUrl = `http://10.30.1.221:8000/api/v1/oai/config_${componentApiVariable}/`;
    const authToken = localStorage.getItem('authToken');
    
    console.log("Sending payload to:", apiUrl); // Debug API endpoint
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload) // Ensure the payload is stringified
      });
  
      const responseData = await response.json(); // Assuming response is also JSON
      console.log('API Response:', responseData); // Debug the actual response
  
      if (response.ok) {
        alert('Configuration updated successfully!');
        const updatedValues = await fetchComponentValues(selectedComponent);
        setValues({
          ...componentData[selectedComponent],
          ...updatedValues
        });
      } else {
        throw new Error('Failed to update due to server error');
      }
    } catch (error) {
      console.error('Failed to update configuration:', error);
      alert('Failed to update configuration: ' + (error.response ? error.response.data.detail : 'No details'));
    }
  };
  
  const shouldScroll = ['DU', 'CU', 'DU1', 'DU2'].includes(selectedComponent);

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
          {Object.entries(componentData[selectedComponent]).map(([key, _]) => (
            <div key={key} style={{ display: 'flex', paddingTop: '10px', marginLeft: '-15px', marginRight: '-15px' }}>
              <span style={{ width: '240px', textAlign: 'left', fontSize: '0.75rem', marginTop: '6px' }}>{key}</span>
              <TextInput
                id={`${key}-current`}
                value={values[key] || ''}
                type="text"
                isReadOnly
                style={{ flex: 1, margin: '0 0px', fontSize: '0.75rem', boxSizing: 'border-box' }}
              />
              <TextInput
                id={`${key}-new`}
                type="text"
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                style={{ flex: 1, fontSize: '0.75rem', boxSizing: 'border-box'}}
              />
            </div>
          ))}
        </div>
      </CardBody>
      <CardFooter style={{borderRadius: '6px'}}>
      <Button variant="primary" onClick={handleSubmit} style={{width: '107.5%', marginLeft: '-15px', marginBottom: '-10px'}}>
            Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConfigurationPanel;