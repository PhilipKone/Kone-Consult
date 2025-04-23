document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;
  const body = document.body;

  // Load the saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  // Initialize Bootstrap dropdown
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  let dropdown;
  if (dropdownToggle) {
    dropdown = new bootstrap.Dropdown(dropdownToggle); // Bootstrap's Dropdown API
  }

  const closeDropdown = () => {
    if (dropdown) {
      dropdown.hide(); // Programmatically close the dropdown
    }
  };

  const applyLightMode = () => {
    body.classList.remove('dark-mode');
    localStorage.setItem('theme', 'light'); // Save theme preference
  };

  const applyDarkMode = () => {
    body.classList.add('dark-mode');
    localStorage.setItem('theme', 'dark'); // Save theme preference
  };

  const lightModeBtn = document.getElementById('light-mode');
  if (lightModeBtn) {
    lightModeBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      applyLightMode();
      closeDropdown(); // Close the dropdown
    });
  }

  const darkModeBtn = document.getElementById('dark-mode');
  if (darkModeBtn) {
    darkModeBtn.addEventListener('click', (event) => {
      event.preventDefault(); // Prevent default link behavior
      applyDarkMode();
      closeDropdown(); // Close the dropdown
    });
  }

  // Toggle side panel
  const sidePanel = document.querySelector('.side-panel');
  const toggleBtn = document.createElement('button');
  toggleBtn.classList.add('toggle-btn');
  toggleBtn.innerHTML = '&#9776;'; // Hamburger icon
  sidePanel.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    sidePanel.classList.toggle('collapsed');
  });

  // Mobile Menu Toggle
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
    });
  }
});