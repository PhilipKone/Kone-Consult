/**
 * PHconsult Form Validation Module
 * Handles client-side form validation with real-time feedback
 */

const FormValidator = (function() {
  'use strict';
  
  // Form validation patterns
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
    name: /^[a-zA-Z\s'-]{2,50}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };
  
  // Custom validation messages
  const messages = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    name: 'Please enter a valid name (2-50 characters)',
    password: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
    passwordMatch: 'Passwords do not match',
    minLength: (min) => `Must be at least ${min} characters`,
    maxLength: (max) => `Must be no more than ${max} characters`
  };
  
  /**
   * Initialize form validation for all forms with data-validate attribute
   */
  function init() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      // Prevent HTML5 validation to use our custom validation
      form.setAttribute('novalidate', 'true');
      
      // Add form submission handler
      form.addEventListener('submit', handleSubmit);
      
      // Add input validation handlers
      const inputs = form.querySelectorAll('input, textarea, select');
      
      inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', () => {
          validateField(input);
        });
        
        // Clear errors on input
        input.addEventListener('input', () => {
          if (input.classList.contains('is-invalid')) {
            validateField(input, true);
          }
        });
      });
      
      // Password confirmation check
      const password = form.querySelector('input[name="password"]');
      const confirmPassword = form.querySelector('input[name="confirmPassword"]');
      
      if (password && confirmPassword) {
        confirmPassword.addEventListener('blur', () => {
          if (password.value !== confirmPassword.value) {
            showError(confirmPassword, messages.passwordMatch);
          }
        });
        
        password.addEventListener('input', () => {
          if (confirmPassword.value && password.value !== confirmPassword.value) {
            showError(confirmPassword, messages.passwordMatch);
          } else if (confirmPassword.value) {
            clearError(confirmPassword);
          }
        });
      }
    });
  }
  
  /**
   * Handle form submission
   * @param {Event} event - The submit event
   */
  function handleSubmit(event) {
    const form = event.target;
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    // Validate all inputs
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    // Prevent submission if form is invalid
    if (!isValid) {
      event.preventDefault();
      event.stopPropagation();
      
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      
      // Show form-level error message
      showFormError(form, 'Please fix the errors before submitting the form');
    } else {
      // Clear any form-level errors
      clearFormError(form);
    }
  }
  
  /**
   * Validate a single form field
   * @param {HTMLElement} field - The field to validate
   * @param {boolean} inputOnly - If true, don't show errors (used during typing)
   * @returns {boolean} Whether the field is valid
   */
  function validateField(field, inputOnly = false) {
    // Skip disabled or readonly fields
    if (field.disabled || field.readOnly) {
      return true;
    }
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.required && !field.value.trim()) {
      isValid = false;
      errorMessage = messages.required;
    }
    // Email validation
    else if (field.type === 'email' && field.value && !patterns.email.test(field.value)) {
      isValid = false;
      errorMessage = messages.email;
    }
    // Tel validation
    else if (field.type === 'tel' && field.value && !patterns.phone.test(field.value)) {
      isValid = false;
      errorMessage = messages.phone;
    }
    // Password validation
    else if (field.type === 'password' && field.name === 'password' && field.value) {
      // Skip for confirmPassword fields
      if (!patterns.password.test(field.value)) {
        isValid = false;
        errorMessage = messages.password;
      }
    }
    // Min length validation
    else if (field.minLength && field.value.length < field.minLength && field.value.length > 0) {
      isValid = false;
      errorMessage = messages.minLength(field.minLength);
    }
    // Max length validation
    else if (field.maxLength && field.value.length > field.maxLength) {
      isValid = false;
      errorMessage = messages.maxLength(field.maxLength);
    }
    // Pattern validation
    else if (field.pattern && field.value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(field.value)) {
        isValid = false;
        errorMessage = field.title || 'Please match the requested format';
      }
    }
    // Custom data-validate-type attribute
    else if (field.dataset.validateType && field.value) {
      const type = field.dataset.validateType;
      
      if (patterns[type] && !patterns[type].test(field.value)) {
        isValid = false;
        errorMessage = messages[type] || `Invalid ${type}`;
      }
    }
    
    // Update field UI
    if (!isValid && !inputOnly) {
      showError(field, errorMessage);
    } else if (isValid) {
      clearError(field);
      
      // Add valid styling if field has a value
      if (field.value.trim()) {
        field.classList.add('is-valid');
      } else {
        field.classList.remove('is-valid');
      }
    }
    
    return isValid;
  }
  
  /**
   * Show error message for a field
   * @param {HTMLElement} field - The field with error
   * @param {string} message - Error message to display
   */
  function showError(field, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    // Find or create feedback element
    let feedback = field.nextElementSibling;
    
    if (!feedback || !feedback.classList.contains('invalid-feedback')) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      
      // Insert after the field
      if (field.parentNode) {
        field.parentNode.insertBefore(feedback, field.nextSibling);
      }
    }
    
    feedback.textContent = message;
  }
  
  /**
   * Clear error styling and message from a field
   * @param {HTMLElement} field - The field to clear errors from
   */
  function clearError(field) {
    field.classList.remove('is-invalid');
    
    // Remove error message
    const feedback = field.nextElementSibling;
    
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  }
  
  /**
   * Show form-level error message
   * @param {HTMLElement} form - The form element
   * @param {string} message - Error message to display
   */
  function showFormError(form, message) {
    // Check if error alert already exists
    let errorAlert = form.querySelector('.form-error-alert');
    
    if (!errorAlert) {
      errorAlert = document.createElement('div');
      errorAlert.className = 'alert alert-danger form-error-alert mt-3';
      errorAlert.setAttribute('role', 'alert');
      
      // Add at the top of the form
      form.prepend(errorAlert);
    }
    
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
    
    // Scroll to error message
    errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  /**
   * Clear form-level error message
   * @param {HTMLElement} form - The form element
   */
  function clearFormError(form) {
    const errorAlert = form.querySelector('.form-error-alert');
    
    if (errorAlert) {
      errorAlert.style.display = 'none';
    }
  }
  
  /**
   * Validate a specific form by id
   * @param {string} formId - The ID of the form to validate
   * @returns {boolean} Whether the form is valid
   */
  function validateForm(formId) {
    const form = document.getElementById(formId);
    
    if (!form) {
      console.error(`Form with ID "${formId}" not found`);
      return false;
    }
    
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      // Focus the first invalid field
      const firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      
      // Show form-level error message
      showFormError(form, 'Please fix the errors before submitting the form');
    } else {
      // Clear any form-level errors
      clearFormError(form);
    }
    
    return isValid;
  }
  
  // Public API
  return {
    init,
    validateField,
    validateForm,
    showError,
    clearError
  };
})();
/**
 * PHconsult Form Validation Module
 * Handles client-side form validation for all forms
 */

// IIFE for encapsulation
(function() {
    'use strict';
    
    // Form validation object
    window.FormValidator = {
        // Initialize validation for a form
        validateForm: function(form) {
            if (!form) return;
            
            // Add submit event listener
            form.addEventListener('submit', function(event) {
                if (!FormValidator.validateAllFields(form)) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                
                form.classList.add('was-validated');
            });
            
            // Add input event listeners for real-time validation
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    FormValidator.validateField(input);
                });
                
                input.addEventListener('blur', function() {
                    FormValidator.validateField(input);
                });
            });
        },
        
        // Validate all fields in a form
        validateAllFields: function(form) {
            let isValid = true;
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (!FormValidator.validateField(input)) {
                    isValid = false;
                }
            });
            
            return isValid;
        },
        
        // Validate a single field
        validateField: function(field) {
            let isValid = true;
            const value = field.value.trim();
            const type = field.type;
            const required = field.hasAttribute('required');
            
            // Reset validation state
            field.setCustomValidity('');
            
            // Required field validation
            if (required && value === '') {
                field.setCustomValidity('This field is required');
                isValid = false;
            }
            
            // Email validation
            if (type === 'email' && value !== '') {
                const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
                if (!emailRegex.test(value)) {
                    field.setCustomValidity('Please enter a valid email address');
                    isValid = false;
                }
            }
            
            // Phone validation
            if (field.classList.contains('phone-input') && value !== '') {
                const phoneRegex = /^\+?[0-9\s\-\(\)]{8,20}$/;
                if (!phoneRegex.test(value)) {
                    field.setCustomValidity('Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            // Password validation
            if (type === 'password' && field.classList.contains('password-input') && value !== '') {
                // At least 8 characters, one uppercase, one lowercase, one number
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
                if (!passwordRegex.test(value)) {
                    field.setCustomValidity('Password must be at least 8 characters with uppercase, lowercase, and number');
                    isValid = false;
                }
            }
            
            // Password confirmation validation
            if (field.classList.contains('password-confirm')) {
                const passwordField = document.querySelector('.password-input');
                if (passwordField && value !== passwordField.value) {
                    field.setCustomValidity('Passwords do not match');
                    isValid = false;
                }
            }
            
            // Custom min/max length validation
            if (field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
                field.setCustomValidity(`Please enter at least ${field.getAttribute('minlength')} characters`);
                isValid = false;
            }
            
            if (field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
                field.setCustomValidity(`Please enter no more than ${field.getAttribute('maxlength')} characters`);
                isValid = false;
            }
            
            // Update validation UI
            this.updateValidationUI(field);
            
            return isValid;
        },
        
        // Update validation UI feedback
        updateValidationUI: function(field) {
            const feedbackElement = field.nextElementSibling;
            
            if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
                feedbackElement.textContent = field.validationMessage;
            } else if (field.validationMessage) {
                // Create feedback element if it doesn't exist
                const newFeedback = document.createElement('div');
                newFeedback.className = 'invalid-feedback';
                newFeedback.textContent = field.validationMessage;
                field.parentNode.insertBefore(newFeedback, field.nextSibling);
            }
        }
    };
})();
// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', FormValidator.init);