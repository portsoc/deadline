/* Retrieve a file from the cache, and if it's
 * not in the cache, fetch it and add it to the
 * cache so it's there next time.
 */
async function fetchFromCache(request) {
  const cache = await caches.open('deadliner');
  const data = await cache.match(request);
  if (data) {
    return data;
  } else {
    await cache.add(request);
    return cache.match(request);
  }
}

/* Default event response behaviour (i.e. to do the fetch)
 * is overridden by the use of `respondWith`
 */
function interceptFetch(e) {
  e.respondWith(fetchFromCache(e.request));
}

/* Installing the service worker */
function installMyServiceWorker() {
  console.log('service worker installer code running');
}

self.addEventListener('install', installMyServiceWorker);
self.addEventListener('fetch', interceptFetch);
