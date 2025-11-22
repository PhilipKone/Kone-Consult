// Admin Receipt System for Kone Consult
// Requires Firebase SDK to be loaded in admin.html

document.addEventListener('DOMContentLoaded', function () {
  // Handle Generate Receipt button in Receipts tab
  $(document).on('click', '.generate-receipt', function () {
    const receiptModal = document.getElementById('receiptModal');
    const receiptForm = document.getElementById('receiptForm');
    const receiptPreview = document.getElementById('receiptPreview');
    if (!receiptModal || !receiptForm || !receiptPreview) {
      alert('Receipt modal elements missing. Please contact admin.');
      return;
    }
    receiptPreview.style.display = 'none';
    receiptForm.style.display = 'block';
    receiptForm.reset();
    var modal = new bootstrap.Modal(receiptModal);
    modal.show();
  });

  // Handle Generate Receipt button in Receipts tab (vanilla JS for reliability)
  document.querySelectorAll('.generate-receipt').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const receiptModal = document.getElementById('receiptModal');
      const receiptForm = document.getElementById('receiptForm');
      const receiptPreview = document.getElementById('receiptPreview');
      if (!receiptModal || !receiptForm || !receiptPreview) {
        alert('Receipt modal elements missing. Please contact admin.');
        return;
      }
      receiptPreview.style.display = 'none';
      receiptForm.style.display = 'block';
      receiptForm.reset();
      var modal = new bootstrap.Modal(receiptModal);
      modal.show();
    });
  });

  // Elements
  const receiptForm = document.getElementById('receiptForm');
  const receiptPreview = document.getElementById('receiptPreview');
  const receiptContent = document.getElementById('receiptContent');
  const printBtn = document.getElementById('printReceiptBtn');
  const downloadBtn = document.getElementById('downloadReceiptBtn');

  // Helper: Generate random receipt number
  function generateReceiptNumber() {
    return 'KC-' + Date.now().toString().slice(-7);
  }

  // Helper to update preview fields from form
  function updateReceiptPreviewFromForm() {
    document.getElementById('previewDate').textContent = document.getElementById('receiptDate').value;
    document.getElementById('previewReceiptNo').textContent = generateReceiptNumber();
    document.getElementById('previewClientName').textContent = document.getElementById('clientName').value.trim();
    document.getElementById('previewOrganisation').textContent = document.getElementById('organisation').value.trim();
    document.getElementById('previewService').textContent = document.getElementById('service').value.trim();
    document.getElementById('previewAmount').textContent = document.getElementById('amount').value.trim();
    document.getElementById('previewPaymentMethod').textContent = document.getElementById('paymentMethod').value;
  }

  // Handle form submission
  if (receiptForm) {
    receiptForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      // Get form values
      const clientName = document.getElementById('clientName').value.trim();
      const organisation = document.getElementById('organisation').value.trim();
      const service = document.getElementById('service').value.trim();
      const amount = document.getElementById('amount').value.trim();
      const paymentMethod = document.getElementById('paymentMethod').value;
      const date = document.getElementById('receiptDate').value;
      const receiptNo = generateReceiptNumber();
      // Auth check (admin only)
      if (!window.auth || !window.auth.currentUser) {
        alert('You must be signed in as an admin to create receipts.');
        return;
      }
      const adminUser = window.auth.currentUser.email;
      // Save to Firestore
      try {
        await window.db.collection('receipts').add({
          clientName,
          organisation,
          service,
          amount: parseFloat(amount),
          paymentMethod,
          date,
          receiptNo,
          adminUser,
          timestamp: new Date()
        });
        // Update preview fields with latest form values
        updateReceiptPreviewFromForm();
        receiptPreview.style.display = 'block';
        receiptForm.style.display = 'none';
        // Reload receipts table to show the new receipt
        loadReceipts();
      } catch (error) {
        alert('Error saving receipt: ' + error.message);
      }
    });
  }

  // Print receipt
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      const printContents = receiptContent.innerHTML;
      const win = window.open('', '', 'height=700,width=700');
      win.document.write('<html><head><title>Receipt</title>');
      win.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">');
      win.document.write('</head><body >');
      win.document.write(printContents);
      win.document.write('</body></html>');
      win.document.close();
      win.print();
    });
  }

  // Download PDF (simple HTML to PDF using browser print dialog)
  if (downloadBtn) {
    downloadBtn.addEventListener('click', function () {
      updateReceiptPreviewFromForm();
      printBtn.click();
    });
  }

  // Reset modal on close
  const receiptModal = document.getElementById('receiptModal');
  if (receiptModal) {
    receiptModal.addEventListener('hidden.bs.modal', function () {
      receiptPreview.style.display = 'none';
      receiptForm.style.display = 'block';
      receiptForm.reset();
    });
  }

  // Load and display receipts in DataTable (like donations)
  async function loadReceipts() {
    try {
      const snapshot = await db.collection('receipts').orderBy('timestamp', 'desc').get();
      const receipts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          date: data.date || 'N/A',
          clientName: data.clientName || 'N/A',
          service: data.service || 'N/A',
          amount: data.amount !== undefined ? data.amount : 'N/A',
          paymentMethod: data.paymentMethod || 'N/A',
          receiptNo: data.receiptNo || doc.id,
          doc_id: doc.id,
          actions: `<button class='btn btn-sm btn-primary generate-receipt-row' data-id='${doc.id}'>Generate Receipt</button>`
        };
      });
      console.log('Receipts loaded from Firestore:', receipts); // DEBUG LOG
      if (!$.fn.DataTable.isDataTable('#receiptsTable')) {
        $('#receiptsTable').DataTable({
          data: receipts,
          columns: [
            { data: 'date' },
            { data: 'clientName' },
            { data: 'service' },
            { data: 'amount' },
            { data: 'paymentMethod' },
            { data: 'receiptNo' },
            { data: 'actions', orderable: false, searchable: false }
          ]
        });
      } else {
        const receiptsTable = $('#receiptsTable').DataTable();
        receiptsTable.clear().rows.add(receipts).draw();
      }
    } catch (err) {
      alert('Error loading receipts: ' + err.message);
    }
  }

  // Handle Generate Receipt button click for each row
  $(document).on('click', '.generate-receipt-row', async function () {
    const docId = $(this).data('id');
    try {
      const doc = await db.collection('receipts').doc(docId).get();
      if (!doc.exists) {
        alert('Receipt not found');
        return;
      }
      const data = doc.data();
      // Populate modal fields
      document.getElementById('clientName').value = data.clientName || '';
      document.getElementById('organisation').value = data.organisation || '';
      document.getElementById('service').value = data.service || '';
      document.getElementById('amount').value = data.amount || '';
      document.getElementById('paymentMethod').value = data.paymentMethod || '';
      document.getElementById('receiptDate').value = data.date || '';
      // Show modal
      const receiptModal = new bootstrap.Modal(document.getElementById('receiptModal'));
      document.getElementById('receiptPreview').style.display = 'none';
      document.getElementById('receiptForm').style.display = 'block';
      receiptModal.show();
    } catch (err) {
      alert('Error loading receipt details: ' + err.message);
    }
  });

  // Call loadReceipts on page load
  loadReceipts();
});
