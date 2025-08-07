import React, { useState, useEffect } from 'react';

interface ConnectionStatus {
  isOnline: boolean;
  effectiveType?: string;
}

const useNetworkStatus = (): ConnectionStatus => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: navigator.onLine,
    effectiveType: (navigator as any).connection?.effectiveType
  });

  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setStatus(prev => ({ ...prev, isOnline: false }));
    };

    const handleConnectionChange = () => {
      setStatus({
        isOnline: navigator.onLine,
        effectiveType: (navigator as any).connection?.effectiveType
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ((navigator as any).connection) {
      (navigator as any).connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ((navigator as any).connection) {
        (navigator as any).connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return status;
};

const NetworkStatus: React.FC = () => {
  const { isOnline, effectiveType } = useNetworkStatus();

  if (isOnline) {
    return (
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: '#28a745',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        Online {effectiveType && `(${effectiveType})`}
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      backgroundColor: '#dc3545',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      zIndex: 1000
    }}>
      Offline
    </div>
  );
};

export { NetworkStatus, useNetworkStatus };
