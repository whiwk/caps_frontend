import React, { createContext, useState } from 'react';

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refreshTopology, setRefreshTopology] = useState(false);
  const [refreshNavbar, setRefreshNavbar] = useState(false);

  return (
    <RefreshContext.Provider value={{ refreshTopology, setRefreshTopology, refreshNavbar, setRefreshNavbar }}>
      {children}
    </RefreshContext.Provider>
  );
};
