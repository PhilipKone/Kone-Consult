/* PHconsult Main JavaScript
 * Modular approach to handle all frontend functionality
 */

// Immediately-invoked Function Expression for encapsulation
(function() {
    'use strict';
    
    // Main app object
    const PHApp = {
        // Initialize the application
        init: function() {
            this.registerServiceWorker();
            this.setupEventListeners();
            this.handleDarkMode();
            this.setupNavbar();
            this.setupForms();
            this.animateOnScroll();
            console.log('PHconsult app initialized');
        },
        
        // Register service worker for offline capabilities
        registerServiceWorker: function() {
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/service-worker.js')
                        .then(registration => {
                            console.log('ServiceWorker registered with scope:', registration.scope);
                        })
                        .catch(error => {
                            console.error('ServiceWorker registration failed:', error);
                        });
                });
            }
        },
        
        // Set up all event listeners
        setupEventListeners: function() {
            // Action button click (from original code)
            const actionBtn = document.getElementById('actionBtn');
            const message = document.getElementById('message');
            
            if (actionBtn && message) {
                actionBtn.addEventListener('click', function() {
                    message.innerHTML = "Thank you for visiting PHconsult!";
                });
            }
            
            // Back to top button
            const backToTopBtn = document.querySelector('.back-to-top');
            if (backToTopBtn) {
                window.addEventListener('scroll', function() {
                    if (window.pageYOffset > 300) {
                        backToTopBtn.classList.add('show');
                    } else {
                        backToTopBtn.classList.remove('show');
                    }
                });
                
                backToTopBtn.addEventListener('click', function() {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
            
            // Side panel toggle
            const sidePanelToggle = document.querySelector('.side-panel-toggle');
            const sidePanel = document.querySelector('.side-panel');
            
            if (sidePanelToggle && sidePanel) {
                sidePanelToggle.addEventListener('click', function() {
                    sidePanel.classList.toggle('expanded');
                });
                
                // Close side panel when clicking outside
                document.addEventListener('click', function(event) {
                    if (!sidePanel.contains(event.target) && !sidePanelToggle.contains(event.target) && sidePanel.classList.contains('expanded')) {
                        sidePanel.classList.remove('expanded');
                    }
                });
            }
        },
        
        // Handle dark mode toggle
        handleDarkMode: function() {
            const darkModeToggle = document.getElementById('darkModeToggle');
            
            if (darkModeToggle) {
                // Check for saved theme preference
                const savedTheme = localStorage.getItem('theme');
                
                // Apply saved theme or default to light
                if (savedTheme === 'dark') {
                    document.documentElement.setAttribute('data-bs-theme', 'dark');
                    document.body.classList.add('dark-mode');
                }
                
                // Toggle theme on click
                darkModeToggle.addEventListener('click', function() {
                    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
                        document.documentElement.setAttribute('data-bs-theme', 'light');
                        document.body.classList.remove('dark-mode');
                        localStorage.setItem('theme', 'light');
                    } else {
                        document.documentElement.setAttribute('data-bs-theme', 'dark');
                        document.body.classList.add('dark-mode');
                        localStorage.setItem('theme', 'dark');
                    }
                });
            }
        },
        
        // Handle navbar scroll behavior
        setupNavbar: function() {
            const navbar = document.querySelector('.navbar');
            
            if (navbar) {
                window.addEventListener('scroll', function() {
                    if (window.scrollY > 50) {
                        navbar.classList.add('navbar-scrolled');
                    } else {
                        navbar.classList.remove('navbar-scrolled');
                    }
                });
                
                // Add active class to current nav item
                const currentLocation = window.location.pathname;
                const navLinks = document.querySelectorAll('.nav-link');
                
                navLinks.forEach(link => {
                    const linkPath = link.getAttribute('href');
                    if (linkPath === currentLocation || 
                        (currentLocation === '/' && linkPath === '/index.html') ||
                        (linkPath !== '/index.html' && currentLocation.includes(linkPath))) {
                        link.classList.add('active');
                    }
                });
            }
        },
        
        // Initialize form validation
        setupForms: function() {
            const forms = document.querySelectorAll('form[data-validate]');
            
            if (forms.length > 0 && typeof FormValidator !== 'undefined') {
                forms.forEach(form => {
                    FormValidator.validateForm(form);
                });
            }
            
            // Setup contact form offline submission capability
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', function(e) {
                    if (!navigator.onLine) {
                        e.preventDefault();
                        
                        // Store form data for later submission
                        const formData = new FormData(contactForm);
                        const formDataObj = {};
                        
                        formData.forEach((value, key) => {
                            formDataObj[key] = value;
                        });
                        
                        // Store in localStorage
                        const pendingSubmissions = JSON.parse(localStorage.getItem('pendingSubmissions') || '[]');
                        pendingSubmissions.push({
                            type: 'contact',
                            data: formDataObj,
                            timestamp: new Date().toISOString()
                        });
                        
                        localStorage.setItem('pendingSubmissions', JSON.stringify(pendingSubmissions));
                        
                        // Register for background sync if available
                        if ('serviceWorker' in navigator && 'SyncManager' in window) {
                            navigator.serviceWorker.ready.then(registration => {
                                registration.sync.register('contact-form-sync');
                            });
                        }
                        
                        // Show offline submission message
                        alert('You are currently offline. Your form has been saved and will be submitted when you are back online.');
                    }
                });
            }
        },
        
        // Animate elements on scroll
        animateOnScroll: function() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            
            if (animatedElements.length > 0) {
                const checkIfInView = function() {
                    animatedElements.forEach(element => {
                        const elementTop = element.getBoundingClientRect().top;
                        const elementBottom = element.getBoundingClientRect().bottom;
                        const isVisible = (elementTop < window.innerHeight - 100) && (elementBottom > 0);
                        
                        if (isVisible) {
                            element.classList.add('animated');
                        }
                    });
                };
                
                // Check on scroll
                window.addEventListener('scroll', checkIfInView);
                
                // Check on load
                checkIfInView();
            }
        }
    };
    
    // Initialize app when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        PHApp.init();
    });
})();
