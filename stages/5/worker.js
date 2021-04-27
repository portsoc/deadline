const CACHE = 'deadliner';
const FILES = [
  './',
  './index.css',
  './index.js',
  './worker.js',
  './config.json',
  './index.webmanifest',
  './icons/deadliner.svg',
];

// retrieve a file from the cache, and if it's
// not in the cache, fetch it and add it to the
// cache so it's there next time
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
 * is overridden by he use of `respondWith`
 */
function interceptFetch(evt) {
  evt.respondWith(fetchFromCache(evt.request));
}

/* Installing the service worker */
async function installMyServiceWorker() {
  // pre-cache everything
  try {
    const c = await caches.open(CACHE);
    await c.addAll(FILES);
    console.log('cache is primed');
  } catch (e) {
    console.error('Failed to prime the cache!', e);
  }
}

self.addEventListener('install', installMyServiceWorker);
self.addEventListener('fetch', interceptFetch);
