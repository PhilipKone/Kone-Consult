document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Ensure dropdown functionality works
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  if (dropdownToggle) {
    dropdownToggle.addEventListener('click', (event) => {
      event.preventDefault();
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.classList.toggle('show');
      }
    });
  }

  document.getElementById('light-mode').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    // Switch to light mode
    root.style.setProperty('--background-color', '#f4f4f4');
    root.style.setProperty('--text-color', '#000000');
    root.style.setProperty('--header-bg-color', '#3a86ff');
    root.style.setProperty('--header-text-color', '#ffffff');
    root.style.setProperty('--section-bg-color', '#ffffff');
    root.style.setProperty('--footer-bg-color', '#3a86ff');
    root.style.setProperty('--footer-text-color', '#ffffff');
  });

  document.getElementById('dark-mode').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    // Switch to dark mode
    root.style.setProperty('--background-color', '#121212');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--header-bg-color', '#1f1f1f');
    root.style.setProperty('--header-text-color', '#ffffff');
    root.style.setProperty('--section-bg-color', '#1e1e1e');
    root.style.setProperty('--footer-bg-color', '#1f1f1f');
    root.style.setProperty('--footer-text-color', '#ffffff');
  });
});