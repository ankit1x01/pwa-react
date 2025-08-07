import React from 'react';

const OfflinePage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      color: '#343a40',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{
        fontSize: '64px',
        marginBottom: '20px'
      }}>
        📱
      </div>
      
      <h1 style={{
        fontSize: '2.5rem',
        marginBottom: '20px',
        color: '#495057'
      }}>
        You're Offline
      </h1>
      
      <p style={{
        fontSize: '1.2rem',
        marginBottom: '30px',
        maxWidth: '500px',
        lineHeight: '1.6'
      }}>
        Don't worry! This PWA works offline. You can continue using cached content 
        and your changes will sync when you're back online.
      </p>
      
      <div style={{
        backgroundColor: '#e9ecef',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '30px',
        maxWidth: '400px'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>What you can do:</h3>
        <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li>Browse cached pages</li>
          <li>View previously loaded content</li>
          <li>Continue working with local data</li>
          <li>Get notified when back online</li>
        </ul>
      </div>
      
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#0056b3';
        }}
        onMouseOut={(e) => {
          (e.target as HTMLElement).style.backgroundColor = '#007bff';
        }}
      >
        Try Again
      </button>
      
      <div style={{
        marginTop: '40px',
        fontSize: '0.9rem',
        color: '#6c757d'
      }}>
        <p>Network status will update automatically when connection is restored.</p>
      </div>
    </div>
  );
};

export default OfflinePage;
