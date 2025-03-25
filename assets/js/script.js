document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  // Load the saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    applyDarkMode();
  } else {
    applyLightMode();
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
    root.style.setProperty('--background-color', '#f4f4f4');
    root.style.setProperty('--text-color', '#000000');
    root.style.setProperty('--header-bg-color', '#3a86ff');
    root.style.setProperty('--header-text-color', '#ffffff');
    root.style.setProperty('--section-bg-color', '#ffffff');
    root.style.setProperty('--footer-bg-color', '#3a86ff');
    root.style.setProperty('--footer-text-color', '#ffffff');
    localStorage.setItem('theme', 'light'); // Save theme preference
  };

  const applyDarkMode = () => {
    root.style.setProperty('--background-color', '#121212');
    root.style.setProperty('--text-color', '#ffffff');
    root.style.setProperty('--header-bg-color', '#1f1f1f');
    root.style.setProperty('--header-text-color', '#ffffff');
    root.style.setProperty('--section-bg-color', '#1e1e1e');
    root.style.setProperty('--footer-bg-color', '#1f1f1f');
    root.style.setProperty('--footer-text-color', '#ffffff');
    localStorage.setItem('theme', 'dark'); // Save theme preference
  };

  document.getElementById('light-mode').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    applyLightMode();
    closeDropdown(); // Close the dropdown
  });

  document.getElementById('dark-mode').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior
    applyDarkMode();
    closeDropdown(); // Close the dropdown
  });
});