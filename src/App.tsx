import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import PWAPrompt from './components/PWAPrompt';
import { NetworkStatus } from './components/NetworkStatus';
import NotificationManager from './components/NotificationManager';
import PWADemo from './components/PWADemo';

function App() {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      console.log('PWA was installed');
    });
  }, []);

  const handleInstall = () => {
    console.log('App installation initiated');
  };

  return (
    <div className="App">
      <NetworkStatus />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React PWA</h1>
        <p>
          Welcome to your Progressive Web App built with React!
        </p>
        
        <div style={{ margin: '20px 0' }}>
          <h2>PWA Features</h2>
          <ul style={{ textAlign: 'left', maxWidth: '400px' }}>
            <li>📱 Installable on mobile and desktop</li>
            <li>🔄 Works offline with caching</li>
            <li>🔔 Push notifications support</li>
            <li>📡 Network status detection</li>
            <li>⚡ Fast loading with service worker</li>
            <li>📲 App-like experience</li>
          </ul>
        </div>

        {isInstalled && (
          <div style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            margin: '10px'
          }}>
            ✅ App is installed!
          </div>
        )}

        <NotificationManager />

        <PWADemo />

        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Test Offline Mode
          </button>
          <p style={{ fontSize: '12px', color: '#666' }}>
            (Disconnect internet and reload to test offline functionality)
          </p>
        </div>

        <a
          className="App-link"
          href="https://web.dev/progressive-web-apps/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn about PWAs
        </a>
      </header>
      
      <PWAPrompt onInstall={handleInstall} />
    </div>
  );
}

export default App;
