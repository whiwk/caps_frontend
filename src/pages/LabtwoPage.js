import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed

function LabtwoPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}> {/* Main content */}
        <h1>Lab 2 Guidance Page</h1>
          {/* Your other components or content */}
      </main>
        </div>
  );
}

export default LabtwoPage;



