self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('sunsar-cache-v1').then(cache => {
      return cache.addAll(['./', './index.html']);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        return caches.open('sunsar-cache-v1').then(cache => {
          cache.put(event.request, fetchRes.clone());
          return fetchRes;
        });
      }).catch(() => caches.match('./index.html'));
    })
  );
});
