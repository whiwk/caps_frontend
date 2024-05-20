import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed

function IntroductionPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}> {/* Main content */}
        <h1>About Open Netra Page</h1>
          {/* Your other components or content */}
      </main>
        </div>
  );
}

export default IntroductionPage;



