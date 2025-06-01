import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  test('renders with the correct text', () => {
    render(<Button text="Click me" onClick={() => {}} />);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button text="Click me" onClick={handleClick} />);
    
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies additional className when provided', () => {
    render(<Button text="Click me" onClick={() => {}} className="custom-class" />);
    
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toHaveClass('btn');
    expect(buttonElement).toHaveClass('custom-class');
  });
});