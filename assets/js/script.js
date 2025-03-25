document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const root = document.documentElement;

  toggleButton.addEventListener('click', () => {
    const isDarkMode = root.style.getPropertyValue('--background-color') === '#121212';

    if (isDarkMode) {
      // Switch to light mode
      root.style.setProperty('--background-color', '#f4f4f4');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--header-bg-color', '#3a86ff');
      root.style.setProperty('--header-text-color', '#ffffff');
      root.style.setProperty('--section-bg-color', '#ffffff');
      root.style.setProperty('--footer-bg-color', '#3a86ff');
      root.style.setProperty('--footer-text-color', '#ffffff');
    } else {
      // Switch to dark mode
      root.style.setProperty('--background-color', '#121212');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--header-bg-color', '#1f1f1f');
      root.style.setProperty('--header-text-color', '#ffffff');
      root.style.setProperty('--section-bg-color', '#1e1e1e');
      root.style.setProperty('--footer-bg-color', '#1f1f1f');
      root.style.setProperty('--footer-text-color', '#ffffff');
    }
  });
});