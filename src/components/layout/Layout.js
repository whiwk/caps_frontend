import React from 'react';
import Navbar from '../navbar/Navbar';

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div>
      {children}
    </div>
  </>
);

export default Layout;
