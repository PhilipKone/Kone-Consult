document.addEventListener('DOMContentLoaded', function() {
    // Handle action button click
    const actionBtn = document.getElementById('actionBtn');
    const message = document.getElementById('message');

    if (actionBtn && message) {
        actionBtn.addEventListener('click', function() {
            message.innerHTML = "Thank you for visiting PHconsult!";
        });
    }

    // Handle flyer image hover effect
    const flyerImage = document.querySelector('img');

    if (flyerImage) {
        flyerImage.addEventListener('mouseover', function() {
            flyerImage.style.filter = 'brightness(0.8)';
        });

        flyerImage.addEventListener('mouseout', function() {
            flyerImage.style.filter = 'brightness(1)';
        });
    }
});
