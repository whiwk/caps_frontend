import React, { useState } from 'react';
import { Tabs, Tab } from '@patternfly/react-core';
import SniffTab from './SniffTab.tsx';
import FilesTab from './FilesTab.tsx';

export const Wireshark: React.FunctionComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (event: React.MouseEvent<HTMLElement>, tabIndex: number) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
      <Tab eventKey={0} title="Sniff">
        <SniffTab />
      </Tab>
      <Tab eventKey={1} title="Files">
        <FilesTab isActive={activeTabKey === 1} />
      </Tab>
    </Tabs>
  );
};

export default Wireshark;
