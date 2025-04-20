// Admin Donations System for PHconsult
// Requires Firebase SDK to be loaded in admin.html

document.addEventListener('DOMContentLoaded', function () {
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
      // Add a 'Generate Receipt' button for each row
      donations.forEach(donation => {
        donation.receiptBtn = `<button class='btn btn-sm btn-primary generate-donation-receipt' data-id='${donation.doc_id}'>Generate Receipt</button>`;
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
            { data: 'receiptBtn', orderable: false, searchable: false }
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

  loadDonations();
});
