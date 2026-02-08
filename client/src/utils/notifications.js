// notifications.js
// Utility for requesting notification permission and sending notifications

export function requestNotificationPermission() {
  if (!('Notification' in globalThis)) return Promise.resolve(false);
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') return Promise.resolve(false);
  return Notification.requestPermission().then(permission => permission === 'granted');
}

export function showNotification(title, options = {}) {
  if (!('Notification' in globalThis)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}
