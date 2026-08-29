/**
 * Production-ready Service Worker Registration for Bantay Kuryente
 * Handles registration, update lifecycles, offline status, and graceful fallbacks.
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    // Service workers not supported by this browser environment
    return;
  }

  // Only register service worker in production builds or when explicitly enabled
  if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
      const swUrl = '/sw.js';

      navigator.serviceWorker
        .register(swUrl, { scope: '/' })
        .then((registration) => {
          // Check for service worker updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (!installingWorker) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // New content is available; will be used when all tabs are closed or reloaded
                  console.info('[Bantay Kuryente PWA] New content is available; refresh to update.');
                } else {
                  // Content is cached for offline use
                  console.info('[Bantay Kuryente PWA] Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[Bantay Kuryente PWA] Service worker registration failed:', error);
        });

      // Handle controller change (when a new SW takes over)
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          // Optionally reload or smoothly swap
        }
      });
    });
  }
}

export function unregisterServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
