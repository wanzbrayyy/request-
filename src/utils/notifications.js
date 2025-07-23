export const requestNotificationPermission = async () => {
      if (!('Notification' in window)) {
        console.log("This browser does not support desktop notification");
        return;
      }
    
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // We can now subscribe the user to push notifications
        subscribeUserToPush();
      } else {
        console.log('Unable to get permission to notify.');
      }
    };
    
    const subscribeUserToPush = () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
          if (!registration.pushManager) {
            console.log('Push manager unavailable.');
            return;
          }
    
          registration.pushManager.getSubscription().then(function(existedSubscription) {
            if (existedSubscription === null) {
              console.log('No subscription detected, make a new one.');
              // In a real app, you would get the VAPID public key from your server
              const vapidPublicKey = 'YOUR_VAPID_PUBLIC_KEY'; // This needs to be generated on a backend
              registration.pushManager.subscribe({
                applicationServerKey: vapidPublicKey,
                userVisibleOnly: true,
              }).then(function(newSubscription) {
                console.log('New subscription added.', newSubscription);
                // Send the subscription to your server
              }).catch(function(e) {
                if (Notification.permission !== 'granted') {
                  console.log('Permission was not granted.');
                } else {
                  console.error('An error ocurred during the subscription process.', e);
                }
              });
            } else {
              console.log('Existed subscription detected.');
            }
          });
        })
        .catch(function(e) {
          console.error('An error ocurred during Service Worker registration.', e);
        });
      }
    };
    
    export const sendLocalNotification = (title, body) => {
      if (Notification.permission === 'granted') {
        const options = {
          body: body,
          icon: '/favicon.svg',
          vibrate: [200, 100, 200],
        };
        new Notification(title, options);
      }
    };