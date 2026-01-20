require('dotenv').config();
const admin = require('firebase-admin');
const express = require('express');

const app = express();
app.use(express.json());

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/webhook', (req, res) => {
  res.status(200).json({ received: true });
});

module.exports = app;
