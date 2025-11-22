/**
 * Kone Consult Authentication Module
 * Handles user authentication securely with token management
 */
/**
 * Kone Consult Authentication Module
 * Handles user authentication UI and logic
 */

// IIFE for encapsulation
(function () {
  'use strict';

  // Auth module
  const Auth = {
    // Initialize authentication features
    init: function () {
      this.setupUI();
      this.setupEventListeners();
      this.checkAuthStatus();
    },

    // Set up authentication UI
    setupUI: function () {
      // Check if authentication message container exists
      const authMessage = document.querySelector('.auth-message');
      if (!authMessage && (this.isLoginPage() || this.isRegisterPage())) {
        // Create auth message element if it doesn't exist
        const messageContainer = document.createElement('div');
        messageContainer.className = 'auth-message alert mt-3';
        messageContainer.style.display = 'none';

        // Find the form to insert before
        const form = document.querySelector('form');
        if (form) {
          form.parentNode.insertBefore(messageContainer, form);
        }
      }
    },

    // Set up event listeners for auth forms
    setupEventListeners: function () {
      // Login form
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
          e.preventDefault();
          Auth.handleLogin(loginForm);
        });
      }

      // Register form
      const registerForm = document.getElementById('registerForm');
      if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
          e.preventDefault();
          Auth.handleRegister(registerForm);
        });
      }

      // Logout button
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
          e.preventDefault();
          Auth.handleLogout();
        });
      }
    },

    // Check if user is authenticated and update UI
    checkAuthStatus: function () {
      const token = localStorage.getItem('auth_token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');

      // Update UI based on auth status
      const authNavItems = document.querySelectorAll('.auth-nav-item');
      const nonAuthNavItems = document.querySelectorAll('.non-auth-nav-item');

      if (token && user) {
        // User is logged in
        authNavItems.forEach(item => item.style.display = 'block');
        nonAuthNavItems.forEach(item => item.style.display = 'none');

        // Update username if element exists
        const usernameElement = document.getElementById('username');
        if (usernameElement && user.name) {
          usernameElement.textContent = user.name;
        }
      } else {
        // User is not logged in
        authNavItems.forEach(item => item.style.display = 'none');
        nonAuthNavItems.forEach(item => item.style.display = 'block');
      }

      // Redirect if accessing protected pages
      if (this.isProtectedPage() && !token) {
        window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      }
    },

    // Handle login form submission
    handleLogin: function (form) {
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;

      // Validate input
      if (!email || !password) {
        this.showAuthMessage('Please enter both email and password', 'danger');
        return;
      }

      // Show loading state
      this.showAuthMessage('Logging in...', 'info');

      // In a real app, this would be an API call
      // For now, simulate API call with timeout
      setTimeout(() => {
        // Mock successful login
        const user = {
          id: '123',
          name: 'Test User',
          email: email
        };

        // Store auth data in localStorage
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user', JSON.stringify(user));

        this.showAuthMessage('Login successful! Redirecting...', 'success');

        // Redirect after successful login
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectUrl = urlParams.get('redirect') || '/index.html';
          window.location.href = redirectUrl;
        }, 1000);
      }, 1500);
    },

    // Handle register form submission
    handleRegister: function (form) {
      const name = form.querySelector('#name').value;
      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      const confirmPassword = form.querySelector('#confirmPassword').value;

      // Validate input
      if (!name || !email || !password) {
        this.showAuthMessage('Please fill out all fields', 'danger');
        return;
      }

      if (password !== confirmPassword) {
        this.showAuthMessage('Passwords do not match', 'danger');
        return;
      }

      // Show loading state
      this.showAuthMessage('Creating account...', 'info');

      // In a real app, this would be an API call
      // For now, simulate API call with timeout
      setTimeout(() => {
        // Mock successful registration
        const user = {
          id: '123',
          name: name,
          email: email
        };

        // Store auth data in localStorage
        localStorage.setItem('auth_token', 'mock_token_123');
        localStorage.setItem('user', JSON.stringify(user));

        this.showAuthMessage('Registration successful! Redirecting...', 'success');

        // Redirect after successful registration
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      }, 1500);
    },

    // Handle logout
    handleLogout: function () {
      // Clear auth data from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');

      // Redirect to home page
      window.location.href = '/index.html';
    },

    // Show authentication message
    showAuthMessage: function (message, type) {
      const messageElement = document.querySelector('.auth-message');
      if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = `auth-message alert alert-${type} mt-3`;
        messageElement.style.display = 'block';
      }
    },

    // Check if current page is login page
    isLoginPage: function () {
      return window.location.pathname.includes('login.html');
    },

    // Check if current page is register page
    isRegisterPage: function () {
      return window.location.pathname.includes('register.html');
    },

    // Check if current page is a protected page
    isProtectedPage: function () {
      const protectedPages = [
        '/profile.html',
        '/dashboard.html',
        '/admin.html'
      ];

      return protectedPages.some(page => window.location.pathname.includes(page));
    }
  };

  // Initialize auth module when DOM is loaded
  document.addEventListener('DOMContentLoaded', function () {
    Auth.init();
  });
})();
const AuthManager = (function () {
  'use strict';

  // Storage keys
  const TOKEN_KEY = 'phc_auth_token';
  const USER_KEY = 'phc_user';
  const EXPIRY_KEY = 'phc_token_expiry';

  // API endpoints
  const API_URL = '/api';
  const ENDPOINTS = {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    me: `${API_URL}/auth/me`,
    refreshToken: `${API_URL}/auth/refresh`
  };

  /**
   * Initialize authentication state
   */
  function init() {
    updateAuthUI();
    setupAuthForms();

    // Auto-refresh token when close to expiry
    checkTokenExpiry();
  }

  /**
   * Set up authentication forms
   */
  function setupAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
      registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', logout);
    }
  }

  /**
   * Handle login form submission
   * @param {Event} e - Form submission event
   */
  async function handleLogin(e) {
    e.preventDefault();

    // Validate form using the FormValidator if available
    if (window.FormValidator && !window.FormValidator.validateForm('loginForm')) {
      return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked || false;

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

    try {
      const data = await login(email, password, rememberMe);

      // Show success message
      showAuthMessage('success', 'Login successful! Redirecting...');

      // Redirect after login
      setTimeout(() => {
        window.location.href = data.redirectUrl || '/index.html';
      }, 1500);
    } catch (error) {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show error message
      showAuthMessage('danger', error.message || 'Login failed. Please check your credentials.');
    }
  }

  /**
   * Handle register form submission
   * @param {Event} e - Form submission event
   */
  async function handleRegister(e) {
    e.preventDefault();

    // Validate form using the FormValidator if available
    if (window.FormValidator && !window.FormValidator.validateForm('registerForm')) {
      return;
    }

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
      showAuthMessage('danger', 'Passwords do not match');
      return;
    }

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

    try {
      await register(name, email, password);

      // Show success message
      showAuthMessage('success', 'Registration successful! Redirecting to login...');

      // Redirect to login page
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } catch (error) {
      // Reset button
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      // Show error message
      showAuthMessage('danger', error.message || 'Registration failed. Please try again.');
    }
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember the login
   * @returns {Promise<Object>} Login response data
   */
  async function login(email, password, rememberMe) {
    try {
      const response = await fetch(ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();

      // Save auth data
      saveAuthData(data.token, data.user, rememberMe);

      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Registration response data
   */
  async function register(name, email, password) {
    try {
      const response = await fetch(ENDPOINTS.register, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Get current user data
   * @returns {Promise<Object>} User data
   */
  async function getCurrentUser() {
    // Check if user data is cached
    const cachedUser = getUserFromStorage();
    if (cachedUser) return cachedUser;

    // Get fresh user data from API
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(ENDPOINTS.me, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token invalid or expired
          logout();
          return null;
        }

        throw new Error('Failed to get user data');
      }

      const userData = await response.json();

      // Update cached user data
      updateUserInStorage(userData);

      return userData;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  /**
   * Log out the current user
   */
  function logout() {
    clearAuthData();
    updateAuthUI();

    // Redirect to homepage or login page
    if (window.location.pathname.includes('/admin') ||
      window.location.pathname.includes('/profile')) {
      window.location.href = '/index.html';
    } else {
      // Reload current page to reflect logged-out state
      window.location.reload();
    }
  }

  /**
   * Update the UI based on authentication state
   */
  function updateAuthUI() {
    const isLoggedIn = isAuthenticated();

    // Update navigation menu
    document.querySelectorAll('.auth-nav-item').forEach(item => {
      item.style.display = isLoggedIn ? 'block' : 'none';
    });

    document.querySelectorAll('.non-auth-nav-item').forEach(item => {
      item.style.display = isLoggedIn ? 'none' : 'block';
    });

    // Update user info if logged in
    if (isLoggedIn) {
      const user = getUserFromStorage();

      // Update user name display
      document.querySelectorAll('.user-name').forEach(element => {
        element.textContent = user?.name || 'User';
      });

      // Update user role display
      document.querySelectorAll('.user-role').forEach(element => {
        element.textContent = user?.role || 'User';
      });

      // Show/hide admin-only elements
      const isAdmin = user?.role === 'admin';
      document.querySelectorAll('.admin-only').forEach(element => {
        element.style.display = isAdmin ? 'block' : 'none';
      });
    }
  }

  /**
   * Save authentication data to storage
   * @param {string} token - JWT token
   * @param {Object} user - User data
   * @param {boolean} persistent - Whether to use localStorage (true) or sessionStorage (false)
   */
  function saveAuthData(token, user, persistent = false) {
    const storage = persistent ? localStorage : sessionStorage;

    // Parse token to get expiry
    try {
      const tokenParts = token.split('.');
      const payload = JSON.parse(atob(tokenParts[1]));
      const expiryDate = new Date(payload.exp * 1000).toISOString();

      storage.setItem(EXPIRY_KEY, expiryDate);
    } catch (e) {
      console.error('Failed to parse token expiry', e);
    }

    storage.setItem(TOKEN_KEY, token);
    storage.setItem(USER_KEY, JSON.stringify(user));

    updateAuthUI();
  }

  /**
   * Update cached user data
   * @param {Object} user - Updated user data
   */
  function updateUserInStorage(user) {
    // Check if using localStorage or sessionStorage
    const storage = localStorage.getItem(TOKEN_KEY)
      ? localStorage
      : sessionStorage;

    storage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Clear authentication data from storage
   */
  function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(EXPIRY_KEY);
  }

  /**
   * Get authentication token from storage
   * @returns {string|null} JWT token
   */
  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get user data from storage
   * @returns {Object|null} User data
   */
  function getUserFromStorage() {
    const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    // Check if token is expired
    const expiry = localStorage.getItem(EXPIRY_KEY) || sessionStorage.getItem(EXPIRY_KEY);
    if (expiry) {
      const expiryDate = new Date(expiry);
      if (expiryDate <= new Date()) {
        clearAuthData();
        return false;
      }
    }

    return true;
  }

  /**
   * Check token expiry and refresh if needed
   */
  function checkTokenExpiry() {
    if (!isAuthenticated()) return;

    const expiry = localStorage.getItem(EXPIRY_KEY) || sessionStorage.getItem(EXPIRY_KEY);
    if (!expiry) return;

    const expiryDate = new Date(expiry);
    const now = new Date();

    // If token expires in less than 15 minutes, refresh it
    const fifteenMinutes = 15 * 60 * 1000;
    if (expiryDate - now < fifteenMinutes) {
      refreshToken();
    }

    // Schedule next check
    setTimeout(checkTokenExpiry, 60000); // Check every minute
  }

  /**
   * Refresh the authentication token
   */
  async function refreshToken() {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(ENDPOINTS.refreshToken, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // If refresh fails, log out
        if (response.status === 401) {
          logout();
        }
        return;
      }

      const data = await response.json();

      // Update token in storage
      const isPersistent = localStorage.getItem(TOKEN_KEY) !== null;
      saveAuthData(data.token, data.user || getUserFromStorage(), isPersistent);
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  }

  /**
   * Show authentication form messages
   * @param {string} type - Message type ('success', 'danger', etc.)
   * @param {string} message - Message content
   */
  function showAuthMessage(type, message) {
    const alertContainer = document.querySelector('.auth-message');

    if (!alertContainer) {
      console.error('Auth message container not found');
      return;
    }

    alertContainer.className = `auth-message alert alert-${type}`;
    alertContainer.textContent = message;
    alertContainer.style.display = 'block';

    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        alertContainer.style.display = 'none';
      }, 3000);
    }
  }

  // Public API
  return {
    init,
    login,
    register,
    logout,
    getCurrentUser,
    isAuthenticated,
    getToken,
    showAuthMessage
  };
})();

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', AuthManager.init);
