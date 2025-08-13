# PWA Migration Guide for Existing React Projects

A step-by-step guide to convert your existing React application into a Progressive Web App without breaking current functionality.

## 🎯 Overview

This guide helps you add PWA features to an existing React project incrementally, ensuring minimal disruption to your current codebase.

## 📋 Pre-Migration Assessment

### 1. **Project Analysis**
Before starting, analyze your project:

```bash
# Check your current build size
npm run build
ls -la build/

# Identify key routes and pages
find src -name "*.tsx" -o -name "*.jsx" | grep -E "(page|route|screen)" | head -20

# Check current dependencies
npm list --depth=0

# Review current bundle structure
npm run build && npx webpack-bundle-analyzer build/static/js/*.js
```

### 2. **Compatibility Check**
- ✅ React version 16.8+ (hooks support)
- ✅ Modern build system (Create React App, Vite, or custom Webpack)
- ✅ HTTPS in production (required for PWA)
- ✅ Service Worker compatibility (no conflicting SW implementations)

## 🚀 Phase 1: Foundation Setup (Low Risk)

### Step 1: Install PWA Dependencies
```bash
npm install workbox-webpack-plugin workbox-window --save
# For Create React App projects, you might also need:
npm install --save-dev @craco/craco @craco/craco-workbox
```

### Step 2: Create Web App Manifest
Create `public/manifest.json`:
```json
{
  "short_name": "YourApp",
  "name": "Your App Name",
  "description": "Your app description",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192",
      "purpose": "maskable any"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512",
      "purpose": "maskable any"
    }
  ],
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "theme_color": "#your-theme-color",
  "background_color": "#your-bg-color",
  "categories": ["productivity"],
  "lang": "en"
}
```

### Step 3: Update HTML Meta Tags
In your `public/index.html`, add PWA meta tags:
```html
<!-- Add these in the <head> section -->
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
<meta name="theme-color" content="#your-theme-color" />
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<meta name="apple-mobile-web-app-title" content="Your App">
<meta name="msapplication-TileImage" content="%PUBLIC_URL%/logo192.png">
<meta name="msapplication-TileColor" content="#your-theme-color">
```

### Step 4: Test Foundation
```bash
npm run build
npm install -g serve
serve -s build
# Open in Chrome DevTools > Application > Manifest
```

## 🔧 Phase 2: Service Worker Integration (Medium Risk)

### Step 5: Basic Service Worker Setup

For **Create React App**:
Create `public/sw.js`:
```javascript
const CACHE_NAME = 'your-app-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
```

For **Custom Webpack** or **Vite**:
Use Workbox plugin in your build configuration.

### Step 6: Register Service Worker
In your main `src/index.tsx` or `src/index.js`:
```typescript
// Add this after your ReactDOM.render call
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

### Step 7: Test Service Worker
```bash
npm run build
serve -s build
# Check Chrome DevTools > Application > Service Workers
```

## 🎨 Phase 3: Progressive Enhancement (Low Risk)

### Step 8: Create PWA Components

#### Network Status Component
Create `src/components/NetworkStatus.tsx`:
```typescript
import React, { useState, useEffect } from 'react';

export const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '8px',
        textAlign: 'center',
        zIndex: 9999
      }}>
        You are currently offline. Some features may not be available.
      </div>
    );
  }

  return null;
};
```

#### Install Prompt Component
Create `src/components/InstallPrompt.tsx`:
```typescript
import React, { useState, useEffect } from 'react';

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  if (!showInstall) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 1000
    }}>
      <p style={{ margin: '0 0 8px 0' }}>Install this app for better experience!</p>
      <button onClick={handleInstall} style={{
        backgroundColor: 'white',
        color: '#007bff',
        border: 'none',
        padding: '4px 12px',
        borderRadius: '4px',
        marginRight: '8px',
        cursor: 'pointer'
      }}>
        Install
      </button>
      <button onClick={() => setShowInstall(false)} style={{
        backgroundColor: 'transparent',
        color: 'white',
        border: '1px solid white',
        padding: '4px 12px',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Later
      </button>
    </div>
  );
};
```

### Step 9: Integration with Existing App
In your main App component:
```typescript
// Add imports
import { NetworkStatus } from './components/NetworkStatus';
import { InstallPrompt } from './components/InstallPrompt';

// Add to your App component's render method
function App() {
  return (
    <div className="App">
      <NetworkStatus />
      {/* Your existing app content */}
      <YourExistingRoutes />
      <YourExistingComponents />
      
      {/* PWA components at the end */}
      <InstallPrompt />
    </div>
  );
}
```

## 📊 Phase 4: Advanced PWA Features (Higher Risk)

### Step 10: Offline Data Strategy
Based on your app's data patterns:

#### For REST APIs:
```typescript
// Create src/utils/offlineStorage.ts
export class OfflineStorage {
  private dbName = 'YourAppDB';
  private version = 1;
  
  async store(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify({
      data,
      timestamp: Date.now(),
      synced: navigator.onLine
    }));
  }

  async retrieve(key: string) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  }

  async syncWhenOnline() {
    // Implement your sync logic here
    const unsyncedItems = this.getUnsyncedItems();
    for (const item of unsyncedItems) {
      try {
        await this.syncItem(item);
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }
}
```

#### For Redux/State Management:
```typescript
// Redux middleware for offline support
const offlineMiddleware = (store: any) => (next: any) => (action: any) => {
  if (!navigator.onLine && action.type.includes('API_CALL')) {
    // Queue action for later
    localStorage.setItem('pendingActions', JSON.stringify([
      ...JSON.parse(localStorage.getItem('pendingActions') || '[]'),
      action
    ]));
    return;
  }
  return next(action);
};
```

### Step 11: Background Sync
Update your service worker to handle background sync:
```javascript
// Add to your sw.js
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  // Process queued requests
  const pendingRequests = await getPendingRequests();
  for (const request of pendingRequests) {
    try {
      await fetch(request.url, request.options);
      await removePendingRequest(request.id);
    } catch (error) {
      console.error('Background sync failed:', error);
    }
  }
}
```

## 🔍 Testing Strategy

### Development Testing
```bash
# Build and serve
npm run build
serve -s build

# Test checklist:
# ✅ App loads offline after initial visit
# ✅ Install prompt appears in supported browsers
# ✅ Network status shows correctly
# ✅ Service worker registers without errors
# ✅ Manifest is valid (Chrome DevTools > Application)
```

### Production Testing
```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://your-domain.com --view

# PWA Testing tools
npx pwa-audit https://your-domain.com
```

## 🚨 Risk Mitigation

### Rollback Strategy
```javascript
// Feature flag for PWA features
const PWA_ENABLED = process.env.REACT_APP_PWA_ENABLED === 'true';

function App() {
  return (
    <div className="App">
      {PWA_ENABLED && <NetworkStatus />}
      <YourExistingContent />
      {PWA_ENABLED && <InstallPrompt />}
    </div>
  );
}
```

### Gradual Deployment
1. **Beta Environment**: Deploy with PWA features enabled
2. **A/B Testing**: Enable for subset of users
3. **Monitoring**: Track performance metrics and user feedback
4. **Full Rollout**: Enable for all users after validation

### Performance Monitoring
```typescript
// Add performance tracking
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    // Track PWA metrics
    performance.mark('pwa-ready');
    // Send to your analytics
  });
}
```

## 📈 Best Practices for Large Projects

### 1. **Incremental Implementation**
- Start with manifest and basic service worker
- Add features gradually over multiple releases
- Test thoroughly at each phase

### 2. **Team Coordination**
- Document PWA features for team members
- Create coding standards for PWA components
- Set up automated testing for PWA features

### 3. **Performance Considerations**
- Monitor bundle size impact
- Implement lazy loading for PWA components
- Cache critical resources first

### 4. **User Experience**
- Don't force install prompts immediately
- Provide clear offline indicators
- Maintain existing UX patterns

## 🛠️ Troubleshooting Common Issues

### Service Worker Not Updating
```bash
# Clear cache and hard refresh
# Or programmatically:
navigator.serviceWorker.getRegistrations().then(function(registrations) {
  for(let registration of registrations) {
    registration.unregister();
  }
});
```

### Manifest Issues
```bash
# Validate manifest
npx pwa-manifest-validator public/manifest.json
```

### Build Integration Issues
- Ensure service worker is copied to build folder
- Check that manifest is accessible at `/manifest.json`
- Verify all icons exist and are properly sized

## 📚 Migration Checklist

- [ ] Phase 1: Foundation (Manifest + Meta tags)
- [ ] Test in development and staging
- [ ] Phase 2: Basic service worker
- [ ] Test offline functionality
- [ ] Phase 3: PWA components
- [ ] User acceptance testing
- [ ] Phase 4: Advanced features (optional)
- [ ] Performance testing
- [ ] Production deployment
- [ ] Lighthouse audit score > 90
- [ ] Monitor and iterate

This migration approach ensures you can add PWA features to your existing project safely and incrementally!
