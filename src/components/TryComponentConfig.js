import React, { useState, useEffect, useContext } from 'react';
import './TryComponentConfig.css';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  TextInput,
  Grid,
  GridItem, Title
} from '@patternfly/react-core';
import { CheckCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';
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
  UE: { 'IP Address': '', 'RF Sim Server': '', 'Full IMSI': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
  UE1: { 'IP Address': '', 'RF Sim Server': '', 'Full IMSI': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
  UE2: { 'IP Address': '', 'RF Sim Server': '', 'Full IMSI': '', 'Full Key': '', 'OPC': '', 'DNN': '', 'SST': '', 'SD': '', 'USRP': '' },
};

const levelComponents = {
  1: ['UE', 'DU', 'CU'],
  2: ['UE1', 'UE2', 'DU1', 'DU2', 'CU'],
  3: ['UE1', 'UE2', 'DU', 'CU']
};

const ConfigurationPanel = () => {
  const { setRefreshTopology, setRefreshNavbar } = useContext(RefreshContext);
  const [userLevel, setUserLevel] = useState(1);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [values, setValues] = useState({});
  const [setValuesState, setSetValuesState] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comparisonResults, setComparisonResults] = useState({});

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

  const fetchComponentValues = async (componentKey) => {
    const componentVariable = {
      'CU': 'single_cu',
      'DU': 'single_du',
      'UE': 'single_ue',
      'DU1': 'multi_du1',
      'DU2': 'multi_du2',
      'UE1': 'multi_ue1',
      'UE2': 'multi_ue2'
    }[componentKey];

    try {
      const response = await api.get(`oai/values_${componentVariable}/`);
      const mappedData = mapApiValuesToComponentDataKeys(response.data.values, componentKey);
      setValues(mappedData); // Set fetched values to state
      await fetchComparisonResults(componentKey); // Fetch comparison results
    } catch (error) {
      console.error('Failed to fetch component values for:', componentVariable, error);
    }
  };

  const fetchComparisonResults = async (componentKey) => {
    const compareEndpoint = componentKey.toLowerCase().startsWith('cu') ? 'user/compare/cu/' :
      componentKey.toLowerCase().startsWith('du') ? 'user/compare/du/' :
        componentKey.toLowerCase().startsWith('ue') ? 'user/compare/ue/' : '';

    if (compareEndpoint) {
      try {
        const compareResponse = await api.get(compareEndpoint);
        console.log(`Comparison results for ${componentKey}:`, compareResponse.data.matches);
        setComparisonResults(compareResponse.data.matches);
      } catch (error) {
        console.error(`Failed to fetch comparison results for ${componentKey}:`, error);
      }
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
    fullImsi: 'Full IMSI',
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
    'CU ID': 'cuId',
    'Cell ID': 'cellId',
    'GNB ID': 'gnbId',
    'DU ID': 'duId',
    'USRP': 'usrp',
    'CU Host': 'cuHost',
    'Physical Cell ID': 'phyCellId',
    'IP Address': 'multusIPadd',
    'RF Sim Server': 'rfSimServer',
    'Full IMSI': 'fullImsi',
    'Full Key': 'fullKey',
    'OPC': 'opc',
    'DNN': 'dnn',
    'SD': 'sd',
    'F1 IP Address': 'f1InterfaceIPadd',
    'F1 CU Port': 'f1cuPort',
    'F1 DU Port': 'f1duPort',
    'N2 IP Address': 'n2InterfaceIPadd',
    'N3 IP Address': 'n3InterfaceIPadd',
    'MCC': 'mcc',
    'MNC': 'mnc',
    'TAC': 'tac',
    'SST': 'sst',
    'AMF Host': 'amfhost',
  };

  const submitKeyMap = {
    'CU': {
      'CU ID': 'cu_id',
      'Cell ID': 'cell_id',
      'F1 IP Address': 'f1_int',
      'F1 CU Port': 'f1_cuport',
      'F1 DU Port': 'f1_duport',
      'N2 IP Address': 'n2_int',
      'N3 IP Address': 'n3_int',
      'MCC': 'mcc',
      'MNC': 'mnc',
      'TAC': 'tac',
      'SST': 'sst',
      'AMF Host': 'amf_host'
    },
    'DU': {
      'GNB ID': 'gnb_id',
      'DU ID': 'du_id',
      'Cell ID': 'cell_id',
      'F1 IP Address': 'f1_int',
      'F1 CU Port': 'f1_cuport',
      'F1 DU Port': 'f1_duport',
      'MCC': 'mcc',
      'MNC': 'mnc',
      'TAC': 'tac',
      'SST': 'sst',
      'USRP': 'usrp',
      'CU Host': 'cu_host'
    },
    'UE': {
      'IP Address': 'multus_ipadd',
      'RF Sim Server': 'rfsimserver',
      'Full IMSI': 'fullimsi',
      'Full Key': 'fullkey',
      'OPC': 'opc',
      'DNN': 'dnn',
      'SST': 'sst',
      'SD': 'sd',
      'USRP': 'usrp'
    }
  };

  const transformDataForAPI = (data, componentKey) => {
    const apiData = {};
    const mapping = submitKeyMap[componentKey] || {};
    Object.entries(data).forEach(([key, value]) => {
      if (value) {  // Ensure only non-empty values are included
        const apiKey = mapping[key];  // Get the corresponding API key
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
    await fetchComponentValues(componentKey);
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
    const payload = transformDataForAPI(setValuesState, selectedComponent);

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
        await handleComponentSelection(selectedComponent); // Re-fetch values and comparison results
        setSetValuesState({});
        setRefreshTopology(true);
        setRefreshNavbar(true);
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
    <Card ouiaId="BasicCard" style={{ borderRadius: '6px', height: '540px' }}>
      <CardHeader title="Configuration Panel" style={{ marginTop: '-20px', marginLeft: '-17px', marginRight: '-17px' }}>
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
                  height: '26px',
                  fontSize: '12px',
                  backgroundColor: selectedComponent === component ? '#004080' : '',
                  color: selectedComponent === component ? '#fff' : '',
                  borderRadius: '4px'
                }}>
                {component}
              </Button>
            ))}
          </GridItem>
        </Grid>
      </CardHeader>
      <CardBody>
        <br />
        {selectedComponent ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #ccc', marginLeft: '-15px', marginRight: '-15px' }}>
              <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-70px' }}>Key</Title>
              <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem', marginLeft: '-70px' }}>Set Value</Title>
              <Title headingLevel="h6" size="md" style={{ flex: 1, textAlign: 'center', fontSize: '0.75rem' }}>Current Value</Title>
            </div>
            <div style={shouldScroll ? { position: 'relative', overflowY: 'auto', maxHeight: '360px', width: '475px', paddingLeft: '15px', paddingRight: '16px', marginLeft: '-15px', overflowX: 'hidden', } : {}}>
              {Object.entries(componentData[selectedComponent]).map(([key, _]) => (
                <div key={key} style={{ display: 'flex', paddingTop: '10px', marginLeft: '-10px', marginRight: '-10px' }}>
                  <span style={{ width: '80px', textAlign: 'left', fontSize: '0.75rem', marginTop: '6px' }}>{key}</span>
                  <TextInput
                    id={`${key}-new`}
                    type="text"
                    value={setValuesState[key] || ''}
                    onChange={(e) => setSetValuesState({ ...setValuesState, [key]: e.target.value })}
                    style={{ fontSize: '0.75rem', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TextInput
                      id={`${key}-current`}
                      value={values[key] || ''}
                      type="text"
                      isReadOnly
                      style={{ margin: '0 0px', fontSize: '0.75rem', boxSizing: 'border-box' }}
                    />
                    {values[key] !== '' && comparisonResults[keyMap[key]] !== undefined ? (
                      comparisonResults[keyMap[key]] ? (
                        <CheckCircleIcon style={{ marginLeft: '8px', marginTop: '8px', color: 'green' }} />
                      ) : (
                        <TimesCircleIcon style={{ marginLeft: '8px', marginTop: '8px', color: 'red' }} />
                      )
                    ) : (
                      <span style={{ marginLeft: '8px', marginTop: '8px' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1rem', fontStyle: 'italic' }}>Select a component above</div>
        )}
      </CardBody>
      <CardFooter>
        <Button variant="contained" color="primary" onClick={handleDialogOpen} style={{ width: '106%', marginLeft: '-15px', marginBottom: '-10px', borderRadius: '20px', ...createButtonStyles }}>
          Submit
        </Button>
      </CardFooter>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
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
          <Button sx={cancelButtonStyles} onClick={handleDialogClose} style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit} autoFocus style={{ minWidth: '80px', borderRadius: '20px', ...createButtonStyles }}>
            <Box display="flex" alignItems="center" justifyContent="center">
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
            </Box>
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ConfigurationPanel;
