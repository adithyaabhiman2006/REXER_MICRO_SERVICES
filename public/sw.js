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
const PUBLIC_PATH = "__PUBLIC_PATH__";
const VERSION = "rexer-v1";
const SHELL_CACHE = `${VERSION}-shell`;
const ASSET_CACHE = `${VERSION}-assets`;

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

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin requests.
  if (url.origin !== self.location.origin) return;

  // Navigations: network-first, fall back to cached shell / offline page.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          return resp;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(`${PUBLIC_PATH}/offline.html`)),
        ),
    );
    return;
  }

  // Static assets: cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          if (resp && resp.status === 200 && resp.type === "basic") {
            const copy = resp.clone();
            caches.open(ASSET_CACHE).then((cache) => cache.put(request, copy));
          }
          return resp;
        })
        .catch(() => cached);
    }),
  );
});
