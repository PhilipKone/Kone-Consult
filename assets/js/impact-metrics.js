// impact-metrics.js
// Fetch and display dynamic impact metrics from Firestore

document.addEventListener('DOMContentLoaded', function () {
  // Only run on the homepage
  if (!document.getElementById('impactMetrics')) return;

  // Ensure Firebase is loaded
  if (typeof firebase === 'undefined' || !firebase.firestore) {
    console.error('Firebase not loaded');
    return;
  }
  const db = firebase.firestore();

  // Fetch published projects
  window.PHconsultAPI.getPublishedProjects().then(snapshot => {
    console.log('Projects:', snapshot.size, snapshot.docs.map(doc => doc.data()));
    document.getElementById('metricProjects').textContent = snapshot.size;
  }).catch(err => console.error('Error fetching projects:', err));

  // Fetch total messages
  window.PHconsultAPI.getMessages().then(snapshot => {
    console.log('Messages:', snapshot.size, snapshot.docs.map(doc => doc.data()));
    document.getElementById('metricMessages').textContent = snapshot.size;
  }).catch(err => console.error('Error fetching messages:', err));

  // Fetch total receipts (donations)
  window.PHconsultAPI.getReceipts().then(snapshot => {
    console.log('Receipts:', snapshot.size, snapshot.docs.map(doc => doc.data()));
    document.getElementById('metricReceipts').textContent = snapshot.size;
  }).catch(err => console.error('Error fetching receipts:', err));
});
