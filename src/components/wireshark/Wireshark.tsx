import React, { useState } from 'react';
import { Tabs, Tab } from '@patternfly/react-core';
import Tabsatu from'./Tabsatu.tsx';

export const Wireshark: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement>, tabIndex: number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
      <Tab eventKey={0} title="Wireshark">
        <Tabsatu />
      </Tab>
      <Tab eventKey={1} title="Files">
        Content of Tab 2
      </Tab>
    </Tabs>
  );
};

export default Wireshark;