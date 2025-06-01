import React from 'react';

/**
 * A reusable button component with customizable text and onClick handler
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {Function} props.onClick - Click handler function
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element} Button component
 */
const Button = ({ text, onClick, className = '' }) => {
  return (
    <button 
      className={`btn ${className}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;