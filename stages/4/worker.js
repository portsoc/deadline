const CACHE = 'deadliner';
const FILES = [
  './',
  './index.css',
  './index.js',
  './worker.js',
  './index.webmanifest',
  './icons/deadliner.svg',
];

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
async function installMyServiceWorker() {
  // pre-cache everything
  try {
    const c = await caches.open(CACHE);
    await c.addAll(FILES);
    console.log('Cache is primed.');
  } catch (e) {
    console.warn("Priming cache failed.  Falling back to 'online only'.", e);
  }
}

self.addEventListener('install', installMyServiceWorker);
self.addEventListener('fetch', interceptFetch);
