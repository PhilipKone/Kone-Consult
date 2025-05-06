// flyer.js
// Add any interactive effects here (optional)
document.querySelector('.flyer-btn').addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.05)';
});
document.querySelector('.flyer-btn').addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
});
