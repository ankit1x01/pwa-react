# React Progressive Web App (PWA)

A fully-featured Progressive Web App built with React and TypeScript, featuring offline functionality, push notifications, and app-like experience.

## 🚀 Features

- **📱 Installable**: Can be installed on mobile devices and desktop
- **🔄 Offline Support**: Works offline with service worker caching
- **🔔 Push Notifications**: Browser notification support
- **📡 Network Detection**: Real-time network status monitoring
- **⚡ Fast Loading**: Optimized with service worker caching
- **📲 App-like Experience**: Standalone display mode
- **🎯 Responsive Design**: Works on all device sizes

## 🛠️ Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd react-pwa
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`.

## 🏗️ Build and Deploy

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Testing the PWA Features

1. **Build the app**: Run `npm run build`
2. **Serve the build**: Install a static server like `serve`:
   ```bash
   npm install -g serve
   serve -s build
   ```
3. **Test PWA features**: Open the served app in Chrome/Edge
4. **Install prompt**: Look for the install prompt in the address bar
5. **Offline mode**: Use Chrome DevTools Network tab to simulate offline

## 📱 PWA Features

### Service Worker
- Caches app shell and resources
- Provides offline functionality
- Background sync capabilities
- Push notification handling

### Web App Manifest
- App installation metadata
- Icons and splash screens
- Display modes and orientation
- Theme colors and branding

### Components

#### PWAPrompt
Handles the app installation prompt with a user-friendly interface.

#### NetworkStatus
Real-time network connection monitoring and display.

#### NotificationManager
Browser notification permission handling and test functionality.

#### OfflinePage
Dedicated offline experience page.

## 🔧 Customization

### Updating the Manifest
Edit `public/manifest.json` to customize:
- App name and description
- Icons and splash screens
- Theme colors
- Display modes

### Modifying Service Worker
Edit `public/sw.js` to customize:
- Caching strategies
- Background sync
- Push notification handling
- Offline fallbacks

### Adding New Features
1. Create components in `src/components/`
2. Add hooks in `src/hooks/`
3. Update the main App component
4. Test PWA functionality after building

## 🌐 Deployment

### Netlify
1. Build the app: `npm run build`
2. Deploy the `build` folder to Netlify
3. Configure redirects for client-side routing

### Vercel
1. Connect your repository to Vercel
2. Vercel will automatically detect React and build
3. PWA features work out of the box

### GitHub Pages
1. Build the app: `npm run build`
2. Deploy using `gh-pages` package:
   ```bash
   npm install --save-dev gh-pages
   npm run deploy
   ```

### HTTPS Requirement
PWAs require HTTPS in production. Most hosting services provide this automatically.

## 🔍 Testing PWA Features

### Chrome DevTools
1. Open DevTools
2. Go to Application tab
3. Check Service Workers, Manifest, and Storage
4. Use Lighthouse to audit PWA score

### PWA Testing Checklist
- ✅ Manifest is valid
- ✅ Service worker is registered
- ✅ App is installable
- ✅ Works offline
- ✅ Fast loading (< 3s)
- ✅ HTTPS enabled
- ✅ Responsive design

## 📊 Performance

### Lighthouse Scores
This PWA is optimized for high Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

### Optimization Features
- Service worker caching
- Code splitting
- Image optimization
- Minified assets
- Gzip compression

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test PWA functionality
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Service Worker Not Updating
- Clear browser cache and storage
- Unregister old service worker in DevTools
- Hard refresh the page (Ctrl+Shift+R)

### Install Prompt Not Showing
- Ensure HTTPS is enabled
- Check manifest.json is valid
- Verify service worker is registered
- Test in Chrome/Edge (best PWA support)

### Offline Mode Not Working
- Check service worker registration
- Verify cache strategies
- Test network throttling in DevTools

## 📚 Resources

- [Progressive Web Apps](https://web.dev/progressive-web-apps/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox](https://developers.google.com/web/tools/workbox)
