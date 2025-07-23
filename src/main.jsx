import React, { Suspense } from 'react';
    import ReactDOM from 'react-dom/client';
    import App from '@/App';
    import '@/index.css';
    import '@/i18n';
    import { Toaster } from '@/components/ui/toaster';
    
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
    
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
          <App />
          <Toaster />
        </Suspense>
      </React.StrictMode>
    );