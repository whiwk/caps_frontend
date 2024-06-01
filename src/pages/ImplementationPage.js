import React from 'react';
import Sidebar from '../components/sidebar/Sidebar'; // Adjust the import path as needed
import './Introduction.css'

function ImplementationPage() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}> {/* Main content */}
        <h1 style={{ fontSize: '36px', marginBottom: '24px',}}>5G Implementation Overview Page</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="/arsitektur.png" alt="arsitektur" style={{ marginBottom: '24px', width: '650px'}}/>
        </div>
        <p style={{ fontSize: '18px', marginBottom: '48px'}}>
          5G ada lima generasi jadi simpelnya bisnis ini udah turun temurun selama 5 generasi
        </p>
        <h1 style={{ fontSize: '24px',  }}>5G components</h1>
        <p style={{ fontSize: '18px', marginBottom: '48px' }}> yo ndak tau kok tanya saya</p>

        <h1 style={{ fontSize: '24px',  }}>5G is </h1>
        <p style={{ fontSize: '18px', marginBottom: '48px' }}> yo ndak tau kok tanya saya</p>
      </main>
        </div>
  );
}

export default ImplementationPage;



