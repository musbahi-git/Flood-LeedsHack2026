const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

// In-memory store for demo (replace with DB in production)
const subscriptions = [];

// Set VAPID keys
webpush.setVapidDetails(
  'mailto:admin@floodsafe.com',
  'BD-qJf_8r1WgExcO2gBM2TpZ3bwGikM2yQZNYsmUlCNIx9WXO23yGWl6BAr3zVcfOtb8TC4iSizXao-pdwUgPM8',
  'wObO9h6k_zsorbXg9QUEVi-lMo6z7yodahPEOtpTISM'
);

// Endpoint to receive/store push subscriptions
router.post('/subscribe', (req, res) => {
  const subscription = req.body;
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription object' });
  }
  // Prevent duplicates
  if (!subscriptions.find(s => s.endpoint === subscription.endpoint)) {
    subscriptions.push(subscription);
  }
  res.status(201).json({ message: 'Subscription stored' });
});

// Endpoint to trigger a test push notification
router.post('/notify', async (req, res) => {
  const { title = 'Flood Alert', body = 'This is a test push notification.' } = req.body || {};
  const payload = JSON.stringify({ title, body });
  let sent = 0;
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      sent++;
    } catch (err) {
      console.error('Push error:', err);
    }
  }
  res.json({ sent, total: subscriptions.length });
});

module.exports = router;
