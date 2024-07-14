import React, { useState } from 'react';
import { Tabs, Tab } from '@patternfly/react-core';
import SniffTab from './SniffTab.js';
import FilesTab from './FilesTab.js';

const Wireshark = () => {
  const [activeTabKey, setActiveTabKey] = useState(0);

  const handleTabClick = (event, tabIndex) => {
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
