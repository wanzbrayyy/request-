/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'wanzreq-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('push', event => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/favicon.svg'
  });
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

function syncMessages() {
  console.log('Syncing messages...');
  // This is where you would implement the logic to send messages
  // from IndexedDB to your server.
  // For this demo, we'll simulate it by moving messages from a
  // 'outbox' in localStorage to the main 'messages' localStorage.

  const outbox = JSON.parse(localStorage.getItem('outbox') || '[]');
  if (outbox.length === 0) {
    return Promise.resolve();
  }

  const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
  const newMessages = [...allMessages, ...outbox];
  localStorage.setItem('messages', JSON.stringify(newMessages));
  localStorage.removeItem('outbox');

  console.log('Messages synced!');

  return Promise.resolve();
}
