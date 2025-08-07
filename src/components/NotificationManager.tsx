import React, { useState, useEffect } from 'react';

const NotificationManager: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      return permission;
    }
    return 'denied';
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options
      });
    }
  };

  const sendTestNotification = () => {
    sendNotification('Test Notification', {
      body: 'This is a test notification from your PWA!',
      tag: 'test'
    });
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div style={{ margin: '20px 0', textAlign: 'center' }}>
      <h3>Notifications</h3>
      <p>Status: {permission}</p>
      
      {permission === 'default' && (
        <button
          onClick={requestPermission}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Enable Notifications
        </button>
      )}
      
      {permission === 'granted' && (
        <button
          onClick={sendTestNotification}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          Send Test Notification
        </button>
      )}
    </div>
  );
};

export default NotificationManager;
