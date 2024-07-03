import React, { createContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [ueStopped, setUeStopped] = useState(false); // New state for UE stopped

  return (
    <DataContext.Provider value={{ data, setData, ueStopped, setUeStopped }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;