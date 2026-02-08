// notifications.js
// Utility for requesting notification permission and sending notifications


// Detects if running on iOS Safari
function isIosSafari() {
  const ua = window.navigator.userAgent;
  return /iP(ad|hone|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua);
}

// Detects if running as a PWA (standalone)
function isStandalonePWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export function requestNotificationPermission() {
  if (!('Notification' in globalThis)) {
    alert('Notifications are not supported in this browser.');
    return Promise.resolve(false);
  }
  if (isIosSafari() && !isStandalonePWA()) {
    alert('On iOS, notifications only work after installing the app to your home screen. Tap Share > Add to Home Screen, then reopen the app.');
    return Promise.resolve(false);
  }
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') return Promise.resolve(false);
  return Notification.requestPermission().then(permission => permission === 'granted');
}

export function showNotification(title, options = {}) {
  if (!('Notification' in globalThis)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, options);
    } catch (e) {
      // Some browsers (iOS) require notifications to be shown via service worker
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'show-notification', title, options });
      }
    }
  }
}
