import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed

function LabonePage() {
  return (
    <div style={{ display: 'flex', backgroundColor: '#' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '24px',}}>ORCA: Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/Dashboard1.png" alt="dashboard1" style={{ marginBottom: '24px', width: '650px'}}/>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/Dashboard2.png" alt="dashboard2" style={{ marginBottom: '24px', width: '650px'}}/>
        </div>
      </main>
        </div>
  );
}

export default LabonePage;



