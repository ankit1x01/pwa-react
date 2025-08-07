import React, { useState, useEffect } from 'react';

interface PWAPromptProps {
  onInstall: () => void;
}

const PWAPrompt: React.FC<PWAPromptProps> = ({ onInstall }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
      setDeferredPrompt(null);
      setIsVisible(false);
      onInstall();
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 1000,
      maxWidth: '300px',
      textAlign: 'center'
    }}>
      <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
        Install this app for a better experience!
      </p>
      <div>
        <button
          onClick={handleInstall}
          style={{
            backgroundColor: 'white',
            color: '#007bff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            marginRight: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Later
        </button>
      </div>
    </div>
  );
};

export default PWAPrompt;
