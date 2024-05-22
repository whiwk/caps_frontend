import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import { Helmet } from 'react-helmet';

function IntroductionPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Helmet>
        <title>Orca | Introduction</title>
      </Helmet>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}> {/* Main content */}
        <h1>About Open Netra Page</h1>
          {/* Your other components or content */}
      </main>
    </div>
  );
}

export default IntroductionPage;



