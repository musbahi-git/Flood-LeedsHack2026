// notifications.js
// Utility for requesting notification permission and sending notifications

export function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  return Notification.requestPermission().then(permission => permission === 'granted');
}

export function showNotification(title, options = {}) {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
}
