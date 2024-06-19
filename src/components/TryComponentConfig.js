import React, { useState, useEffect, useContext } from 'react';
import './TryComponentConfig.css'
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  TextInput,
  Grid,
  GridItem, Title
} from '@patternfly/react-core';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from '../services/apiService';
import { RefreshContext } from '../contexts/RefreshContext';

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
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [values, setValues] = useState({});
  const [setValuesState, setSetValuesState] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setRefresh } = useContext(RefreshContext);

  useEffect(() => {
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
      // Do not automatically select a component here
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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = transformDataForAPI(setValuesState);

    console.log("Payload to be sent:", payload); // Confirm what is being sent

    if (Object.keys(payload).length === 0) {
      setAlertMessage('No changes to submit.');
      setAlertSeverity('warning');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    const apiEndpoint = componentToApiMap[selectedComponent];

    if (!apiEndpoint) {
      setAlertMessage('No API endpoint found for the selected component.');
      setAlertSeverity('error');
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`oai/config_${apiEndpoint}/`, payload);

      console.log('API Response:', response.data); // Debug the actual response

      if (response.status === 200) {
        setAlertMessage('Configuration updated successfully!');
        setAlertSeverity('success');
        const updatedValues = await fetchComponentValues(selectedComponent);
        setValues({
          ...componentData[selectedComponent],
          ...updatedValues
        });
        setSetValuesState({});
        setRefresh(true);  // Reset set values state
      } else {
        throw new Error('Failed to update due to server error');
      }
    } catch (error) {
      console.error('Failed to update configuration:', error);
      setAlertMessage('Failed to update configuration: ' + (error.response ? error.response.data.detail : 'No details'));
      setAlertSeverity('error');
    } finally {
      setSnackbarOpen(true);
      setLoading(false); 
      handleDialogClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const shouldScroll = ['DU', 'CU', 'DU1', 'DU2'].includes(selectedComponent);

  const cancelButtonStyles = {
    backgroundColor: '#E3AE14',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#E39514',
      color: '#fff'
    }
  };

  const createButtonStyles = {
    textTransform: 'none' // Prevent text from being uppercased
  };

  return (
    <Card ouiaId="BasicCard" style={{borderRadius: '6px', height: '540px'}}>
      <CardHeader title="Configuration Panel" style={{marginTop: '-20px', marginLeft: '-17px', marginRight: '-17px'}}>
        <Grid hasGutter>
          <GridItem span={12} style={{ display: 'flex', justifyContent: 'space-between', height: '30px' }}>
            {levelComponents[userLevel].map(component => (
              <Button 
                key={component} 
                variant="contained" 
                onClick={() => handleComponentSelection(component)} 
                style={{
                  margin: '7px', 
                  width: '180px', 
                  fontSize: '12px',
                  backgroundColor: selectedComponent === component ? '#004080' : '',
                  color: selectedComponent === component ? '#fff' : '',
                  borderRadius: '20px'
                  }}>
                {component}
              </Button>
            ))}
          </GridItem>
        </Grid>
      </CardHeader>
      <CardBody>
      {selectedComponent ? (
          <>
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #ccc', marginLeft: '-15px', marginRight: '-15px' }}>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-40px' }}>Key</Title>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-30px' }}>Current Value</Title>
          <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>Set Value</Title>
        </div>
        <div style={shouldScroll ? { position: 'relative', overflowY: 'auto', maxHeight: '360px', width: '475px', paddingLeft: '15px', paddingRight: '20px', marginLeft: '-15px', overflowX: 'hidden', } : {}}>
          {Object.entries(componentData[selectedComponent]).map(([key, _]) => (
            <div key={key} style={{ display: 'flex', paddingTop: '10px', marginLeft: '-15px', marginRight: '-15px' }}>
              <span style={{ width: '240px', textAlign: 'left', fontSize: '0.75rem', marginTop: '6px' }}>{key}</span>
              <TextInput
                id={`${key}-current`}
                value={values[key] || ''}
                type="text"
                isreadonly="true"
                style={{ flex: 1, margin: '0 0px', fontSize: '0.75rem', boxSizing: 'border-box' }}
              />
              <TextInput
                id={`${key}-new`}
                type="text"
                value={setValuesState[key] || ''}
                onChange={(e) => setSetValuesState({ ...setValuesState, [key]: e.target.value })}
                style={{ flex: 1, fontSize: '0.75rem', boxSizing: 'border-box'}}
              />
            </div>
          ))}
        </div>
      </>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1rem', fontStyle: 'italic' }}>Select a component above</div>
      )}  
      </CardBody>
      <CardFooter>
        <Button variant="contained" color="primary" onClick={handleDialogOpen} style={{ width: '106%', marginLeft: '-15px', marginBottom: '-10px', borderRadius: '20px', ...createButtonStyles}}>
          Submit
        </Button>
      </CardFooter>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={alertSeverity}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Confirm Configuration</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit the configuration changes?
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ justifyContent: "flex-end", marginTop: '-10px', marginRight: '16px' }}>
          <Button sx={cancelButtonStyles} onClick={handleDialogClose} style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} autoFocus style={{minWidth: '80px', borderRadius: '20px', ...createButtonStyles}}>
          <Box display="flex" alignItems="center" justifyContent="center">
              {loading ? <CircularProgress size={20} color="inherit"/> : 'Confirm'}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ConfigurationPanel;