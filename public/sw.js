/**
 * Rexer Micro-Tools service worker.
 *
 * Offline-first shell caching: precaches the app shell + tool registry and
 * serves a navigation fallback when the network is unavailable. Uses a
 * cache-first strategy for static assets and network-first for navigations.
 *
 * The build replaces __PUBLIC_PATH__ with the configured basePath so this
 * works both locally and under a subpath (e.g. GitHub Pages project site).
 */
const INJECTED_PUBLIC_PATH = "__PUBLIC_PATH__";
const PUBLIC_PATH = INJECTED_PUBLIC_PATH.startsWith("__") ? "" : INJECTED_PUBLIC_PATH;
const VERSION = "rexer-v3";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;
const ROUTE_CACHE = `${VERSION}-routes`;
const MAX_ROUTE_ENTRIES = 60;
const MAX_ASSET_ENTRIES = 180;

const SHELL_ASSETS = [
  `${PUBLIC_PATH}/`,
  `${PUBLIC_PATH}/manifest.webmanifest`,
  `${PUBLIC_PATH}/icons/icon-192.png`,
  `${PUBLIC_PATH}/icons/icon-512.png`,
  `${PUBLIC_PATH}/offline.html`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(SHELL_ASSETS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => !k.startsWith(VERSION))
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function trimCache(name, maxEntries) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - maxEntries)).map((key) => cache.delete(key)));
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(ROUTE_CACHE);
      await cache.put(request, response.clone());
      await trimCache(ROUTE_CACHE, MAX_ROUTE_ENTRIES);
    }
    return response;
  } catch {
    return (await caches.match(request)) || (await caches.match(`${PUBLIC_PATH}/offline.html`));
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const update = fetch(request).then(async (response) => {
    if (response.ok && (response.type === "basic" || response.type === "cors")) {
      const cache = await caches.open(ASSET_CACHE);
      await cache.put(request, response.clone());
      await trimCache(ASSET_CACHE, MAX_ASSET_ENTRIES);
    }
    return response;
  }).catch(() => cached);
  return cached || update;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin requests.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to cached shell / offline page.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets: cache-first.
  event.respondWith(staleWhileRevalidate(request));
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
  if (event.data?.type === "CLEAR_RUNTIME_CACHES") {
    event.waitUntil(Promise.all([caches.delete(ASSET_CACHE), caches.delete(ROUTE_CACHE)]));
  }
});
