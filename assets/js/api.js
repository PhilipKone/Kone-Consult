// assets/js/api.js
// Centralized Firestore API logic for PHconsult

// Ensure Firebase is loaded before using these functions
function getPublishedProjects() {
  return firebase.firestore().collection('projects').where('status', '==', 'published').get();
}

function getMessages() {
  return firebase.firestore().collection('messages').get();
}

function getReceipts() {
  return firebase.firestore().collection('receipts').get();
}

// Export for use in other scripts
window.PHconsultAPI = {
  getPublishedProjects,
  getMessages,
  getReceipts
};
