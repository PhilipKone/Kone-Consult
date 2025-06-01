/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
// PayPal IPN Listener as a Firebase Cloud Function
// Listens for PayPal IPN messages, verifies them, and stores donation receipts in Firestore

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

exports.paypalIpnListener = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // Prepare the body for verification
  let body = req.rawBody.toString();
  if (!body.startsWith('cmd=_notify-validate')) {
    body = 'cmd=_notify-validate&' + body;
  }

  // Verify with PayPal
  const PAYPAL_URL = 'https://ipnpb.paypal.com/cgi-bin/webscr';
  try {
    const verifyRes = await fetch(PAYPAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const verification = await verifyRes.text();
    if (verification !== 'VERIFIED') {
      console.error('IPN NOT VERIFIED:', verification);
      return res.status(400).send('IPN Verification Failed');
    }
  } catch (err) {
    console.error('Error verifying IPN:', err);
    return res.status(500).send('Error verifying IPN');
  }

  // Extract donation details
  const donation = {
    donor_name: req.body.first_name + ' ' + req.body.last_name,
    donor_email: req.body.payer_email,
    amount: req.body.mc_gross,
    currency: req.body.mc_currency,
    transaction_id: req.body.txn_id,
    payment_status: req.body.payment_status,
    payment_date: req.body.payment_date,
    raw: req.body,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Only store completed donations
  if (donation.payment_status === 'Completed') {
    try {
      await db.collection('donation_receipts').add(donation);
      console.log('Donation receipt stored:', donation);
    } catch (err) {
      console.error('Error storing donation receipt:', err);
      return res.status(500).send('Error storing donation receipt');
    }
  }

  res.status(200).send('OK');
});
