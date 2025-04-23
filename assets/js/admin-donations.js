// Admin Donations System for PHconsult
// Requires Firebase SDK to be loaded in admin.html

document.addEventListener('DOMContentLoaded', function () {
  // Handle saving a new donation (example, update as needed for your actual save logic)
  const receiptForm = document.getElementById('receiptForm');
  if (receiptForm) {
    receiptForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      // Collect form values
      const donor_name = document.getElementById('clientName').value.trim();
      const organisation = document.getElementById('organisation').value.trim();
      // ...collect other fields as needed
      // Example: save to Firestore (update collection/fields as needed)
      try {
        await db.collection('donation_receipts').add({
          donor_name,
          organisation,
          // ...add other fields
          createdAt: new Date()
        });
        alert('Donation saved successfully!');
        receiptForm.reset();
      } catch (err) {
        alert('Error saving donation: ' + err.message);
      }
    });
  }
  // Helper: Log and display donations
  async function loadDonations() {
    try {
      const snapshot = await db.collection('donation_receipts').orderBy('createdAt', 'desc').get();
      const donations = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          payment_date: data.payment_date || 'N/A',
          donor_name: data.donor_name || 'N/A',
          donor_email: data.donor_email || 'N/A',
          amount: data.amount || 'N/A',
          currency: data.currency || 'N/A',
          transaction_id: data.transaction_id || data.txn_id || doc.id || 'N/A',
          payment_status: data.payment_status || 'N/A',
          doc_id: doc.id // For debugging
        };
      });
      // Add a 'Generate Receipt' and 'Generate Thank You Letter' button for each row
      donations.forEach(donation => {
        donation.receiptBtn = `<button class='btn btn-sm btn-primary generate-donation-receipt' data-id='${donation.doc_id}'>Generate Receipt</button>`;
        donation.thankYouBtn = `<button class='btn btn-sm btn-success generate-thank-you-letter' data-id='${donation.doc_id}'>Thank You Letter</button>`;
      });
      // Initialize DataTable if not already initialized
      if (!$.fn.DataTable.isDataTable('#donationsTable')) {
        $('#donationsTable').DataTable({
          data: donations,
          columns: [
            { data: 'payment_date' },
            { data: 'donor_name' },
            { data: 'donor_email' },
            { data: 'amount' },
            { data: 'currency' },
            { data: 'transaction_id' },
            { data: 'payment_status' },
            { data: 'receiptBtn', orderable: false, searchable: false },
            { data: 'thankYouBtn', orderable: false, searchable: false }
          ]
        });
      } else {
        const donationsTable = $('#donationsTable').DataTable();
        donationsTable.clear().rows.add(donations).draw();
      }
    } catch (err) {
      console.error('Error loading donations:', err);
      alert('Error loading donations: ' + err.message);
    }
  }

  // Handle Generate Receipt button click
  $(document).on('click', '.generate-donation-receipt', async function() {
    const docId = $(this).data('id');
    try {
      const doc = await db.collection('donation_receipts').doc(docId).get();
      if (!doc.exists) {
        alert('Donation not found');
        return;
      }
      const data = doc.data();
      // Populate modal fields
      document.getElementById('donationDonorName').textContent = data.donor_name || 'N/A';
      document.getElementById('donationDonorEmail').textContent = data.donor_email || 'N/A';
      document.getElementById('donationAmount').textContent = data.amount || 'N/A';
      document.getElementById('donationCurrency').textContent = data.currency || 'N/A';
      document.getElementById('donationDate').textContent = data.payment_date || 'N/A';
      document.getElementById('donationTxnId').textContent = data.transaction_id || data.txn_id || doc.id || 'N/A';
      document.getElementById('donationStatus').textContent = data.payment_status || 'N/A';
      document.getElementById('organisation').value = data.organisation || '';
      // Show modal
      var modal = new bootstrap.Modal(document.getElementById('donationReceiptModal'));
      modal.show();
    } catch (err) {
      alert('Error loading donation details: ' + err.message);
    }
  });

  // Print receipt
  document.getElementById('printDonationReceiptBtn').addEventListener('click', function () {
    const printContents = document.getElementById('donationReceiptContent').innerHTML;
    const win = window.open('', '', 'height=700,width=700');
    win.document.write('<html><head><title>Donation Receipt</title>');
    win.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
    win.document.write('</head><body >');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  });

  // Download PDF (uses print dialog for PDF)
  document.getElementById('downloadDonationReceiptBtn').addEventListener('click', function () {
    document.getElementById('printDonationReceiptBtn').click();
  });

  // Handle Generate Thank You Letter button click
  $(document).on('click', '.generate-thank-you-letter', async function() {
    const docId = $(this).data('id');
    try {
      const doc = await db.collection('donation_receipts').doc(docId).get();
      if (!doc.exists) {
        alert('Donation not found');
        return;
      }
      const data = doc.data();
      // Populate thank you letter modal fields
      document.getElementById('tylDate').textContent = data.payment_date || '';
      document.getElementById('tylAttention').textContent = data.donor_name || 'Donor';
      document.getElementById('tylOrg').textContent = data.organisation || '';
      document.getElementById('tylDear').textContent = data.donor_name || 'Donor';
      document.getElementById('tylAmount').textContent = data.amount || '';
      document.getElementById('tylCurrency').textContent = data.currency || '';
      document.getElementById('tylDonationDate').textContent = data.payment_date || '';
      // Populate legal/tax section
      document.getElementById('tylLegalAmount').textContent = (data.amount ? (data.currency ? data.currency + ' ' : '') + data.amount : '');
      document.getElementById('tylLegalDate').textContent = data.payment_date || '';
      // Show thank you letter modal
      var tylModal = new bootstrap.Modal(document.getElementById('thankYouLetterModal'));
      tylModal.show();
    } catch (err) {
      alert('Error loading donation details: ' + err.message);
    }
  });

  // Print Thank You Letter
  document.getElementById('printThankYouLetterBtn').addEventListener('click', function () {
    const printContents = document.getElementById('thankYouLetterContent').innerHTML;
    const win = window.open('', '', 'height=700,width=700');
    win.document.write('<html><head><title>Thank You Letter</title>');
    win.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
    win.document.write('</head><body >');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  });

  // Download PDF (uses print dialog for PDF)
  document.getElementById('downloadThankYouLetterBtn').addEventListener('click', function () {
    document.getElementById('printThankYouLetterBtn').click();
  });

  loadDonations();
});
