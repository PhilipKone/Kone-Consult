document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

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
    closeDropdown(); // Close the dropdown
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
    closeDropdown(); // Close the dropdown
  });
});