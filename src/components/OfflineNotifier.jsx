import React, { useState, useEffect } from 'react';

const OfflineNotifier = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-600 text-white text-center p-2 z-50">
      You are currently offline. Messages will be sent when you're back online.
    </div>
  );
};

export default OfflineNotifier;
