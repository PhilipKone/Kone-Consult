// Admin Receipt System for PHconsult
// Requires Firebase SDK to be loaded in admin.html

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const receiptForm = document.getElementById('receiptForm');
  const receiptPreview = document.getElementById('receiptPreview');
  const receiptContent = document.getElementById('receiptContent');
  const printBtn = document.getElementById('printReceiptBtn');
  const downloadBtn = document.getElementById('downloadReceiptBtn');

  // Helper: Generate random receipt number
  function generateReceiptNumber() {
    return 'PHC-' + Date.now().toString().slice(-7);
  }

  // Handle form submission
  if (receiptForm) {
    receiptForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      // Get form values
      const clientName = document.getElementById('clientName').value.trim();
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
          service,
          amount: parseFloat(amount),
          paymentMethod,
          date,
          receiptNo,
          adminUser,
          timestamp: new Date()
        });
        // Show preview
        document.getElementById('previewDate').textContent = date;
        document.getElementById('previewReceiptNo').textContent = receiptNo;
        document.getElementById('previewClientName').textContent = clientName;
        document.getElementById('previewService').textContent = service;
        document.getElementById('previewAmount').textContent = amount;
        document.getElementById('previewPaymentMethod').textContent = paymentMethod;
        receiptPreview.style.display = 'block';
        receiptForm.style.display = 'none';
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
      // Use browser print dialog for PDF (users can select 'Save as PDF')
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
});
