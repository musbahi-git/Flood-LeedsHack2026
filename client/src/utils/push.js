// push.js
// Utility for subscribing to push notifications and sending test push


function isIosSafari() {
  const ua = window.navigator.userAgent;
  return /iP(ad|hone|od)/.test(ua) && /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS/.test(ua);
}

function isStandalonePWA() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) {
    alert('Service workers are not supported in this browser.');
    return null;
  }
  if (!('PushManager' in window)) {
    alert('Push notifications are not supported in this browser.');
    return null;
  }
  if (isIosSafari() && !isStandalonePWA()) {
    alert('On iOS, push notifications only work after installing the app to your home screen. Tap Share > Add to Home Screen, then reopen the app.');
    return null;
  }
  const registration = await navigator.serviceWorker.ready;
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
    if (Notification.permission !== 'granted') {
      alert('Please allow notifications to enable push alerts.');
    } else {
      alert('Failed to subscribe to push notifications. This browser or device may not support them.');
    }
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
