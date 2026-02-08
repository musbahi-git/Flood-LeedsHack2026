// push.js
// Utility for subscribing to push notifications and sending test push

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) return null;
  const registration = await navigator.serviceWorker.ready;
  if (!('PushManager' in window)) return null;
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BD-qJf_8r1WgExcO2gBM2TpZ3bwGikM2yQZNYsmUlCNIx9WXO23yGWl6BAr3zVcfOtb8TC4iSizXao-pdwUgPM8')
    });
    // Send subscription to backend
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription)
      });
    } catch (err) {
      console.error('Failed to send push subscription to backend:', err);
    }
    return subscription;
  } catch (err) {
    console.error('Push subscription error:', err);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
