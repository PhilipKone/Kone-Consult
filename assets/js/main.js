document.addEventListener('DOMContentLoaded', function() {
    // Handle action button click
    const actionBtn = document.getElementById('actionBtn');
    const message = document.getElementById('message');

    if (actionBtn && message) {
        actionBtn.addEventListener('click', function() {
            message.innerHTML = "Thank you for visiting PHconsult!";
        });
    }

    // Removed flyer image hover effect logic
});
