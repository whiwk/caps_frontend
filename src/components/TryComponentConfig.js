import React, { useState, useEffect } from 'react';
import api from '../services/apiService';

const defaultData = {
  'CU ID': '',
  'Cell ID': '',
  'F1 IP Address': '',
  'F1 CU Port': '',
  'F1 DU Port': '',
  'N2 IP Address': '',
  'N3 IP Address': '',
  'MCC': '',
  'MNC': '',
  'TAC': '',
  'SST': '',
  'AMF Host': ''
};

const ConfigurationPanel = () => {
  const [data, setData] = useState(defaultData); // Holds current values from the API
  const [editableData, setEditableData] = useState({}); // Holds modified values by the user

  useEffect(() => {
    fetchComponentValues().then(fetchedData => {
      setData(fetchedData);
      setEditableData({});
    });
  }, []);

  const fetchComponentValues = async () => {
    try {
      const response = await api.get('oai/values_single_cu/');
      const apiData = response.data.values;
      return mapApiValuesToComponentDataKeys(apiData);
    } catch (error) {
      console.error('Failed to fetch component values:', error);
      return defaultData;
    }
  };

  const mapApiValuesToComponentDataKeys = (apiData) => {
    return {
      'CU ID': apiData.cuId || '',
      'Cell ID': apiData.cellId || '',
      'F1 IP Address': apiData.f1InterfaceIPadd || '',
      'F1 CU Port': apiData.f1cuPort || '',
      'F1 DU Port': apiData.f1duPort || '',
      'N2 IP Address': apiData.n2InterfaceIPadd || '',
      'N3 IP Address': apiData.n3InterfaceIPadd || '',
      'MCC': apiData.mcc || '',
      'MNC': apiData.mnc || '',
      'TAC': apiData.tac || '',
      'SST': apiData.sst || '',
      'AMF Host': apiData.amfhost || ''
    };
  };

  const transformDataForAPI = (data) => {
    return {
      cu_id: data['CU ID'],
      cell_id: data['Cell ID'],
      f1_int: data['F1 IP Address'],
      f1_cuport: data['F1 CU Port'],
      f1_duport: data['F1 DU Port'],
      n2_int: data['N2 IP Address'],
      n3_int: data['N3 IP Address'],
      mcc: data['MCC'],
      mnc: data['MNC'],
      tac: data['TAC'],
      sst: data['SST'],
      amf_host: data['AMF Host']
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const transformedData = transformDataForAPI(editableData);
    try {
      const response = await api.post('oai/config_single_cu/', transformedData);
      console.log('Update successful:', response.data);
      alert('Configuration updated successfully!');
      fetchComponentValues().then(fetchedData => setData(fetchedData)); // Optionally refetch/reload data
    } catch (error) {
      console.error('Failed to update configuration:', error);
      alert('Failed to update configuration.');
    }
  };

  const handleInputChange = (key, value) => {
    setEditableData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Set New Value</th>
              <th>Current Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(data).map(key => (
              <tr key={key}>
                <td>{key}</td>
                <td>
                  <input
                    type="text"
                    value={editableData[key] || ''}
                    onChange={e => handleInputChange(key, e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={data[key] || ''}
                    readOnly
                    style={{ backgroundColor: '#f0f0f0' }} // Indicates the field is not editable
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" style={{ marginTop: '20px' }}>Submit Changes</button>
      </form>
    </div>
  );
};

export default ConfigurationPanel;
