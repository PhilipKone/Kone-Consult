# PHconsult Development Guidelines

This document provides essential information for developers working on the PHconsult project. It includes build/configuration instructions, testing information, and development guidelines.

## Build/Configuration Instructions

### Prerequisites
- Node.js (v14 or higher) and npm
- MongoDB Atlas account (for database)
- Firebase project (for authentication and cloud functions)

### Setting Up the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/PhilipKone/PHconsult.git
   cd PHconsult
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   cd ..
   
   # Install Firebase functions dependencies
   cd functions
   npm install
   cd ..
   ```

3. **Configure environment variables**
   - Create a `.env` file in the root directory with your MongoDB connection string:
     ```
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/phconsult?retryWrites=true&w=majority
     JWT_SECRET=your_jwt_secret_here
     ```
   - Update the Firebase configuration in `firebase/config.js` with your Firebase project details

4. **Start the development servers**
   ```bash
   # Start the backend server
   npm start
   
   # In a separate terminal, start the frontend development server
   cd frontend
   npm start
   ```

## Testing Information

### Testing Framework

The project uses different testing approaches for different parts:

1. **Frontend Testing**
   - Uses Jest and React Testing Library
   - Tests are located in `*.test.js` files next to the components they test

2. **Backend Testing**
   - Currently no automated tests for the Express backend
   - Manual testing can be done using tools like Postman

3. **Firebase Functions Testing**
   - Uses Mocha (configured in `.eslintrc.js`)
   - Firebase Functions Emulator can be used for local testing

### Running Tests

#### Frontend Tests
```bash
cd frontend
npm test
```

This will start Jest in watch mode, which will automatically run tests related to changed files.

To run all tests once:
```bash
cd frontend
npm test -- --watchAll=false
```

#### Firebase Functions Tests
```bash
cd functions
npm test
```

### Adding New Tests

#### Frontend Component Tests

1. Create a test file next to the component with the naming convention `ComponentName.test.js`
2. Import the necessary testing utilities and the component
3. Write test cases using the `describe` and `test` functions

Example:
```javascript
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
});
```

## Additional Development Information

### Code Style

The project follows different code style guidelines for different parts:

1. **Frontend (React)**
   - Uses ESLint with Create React App's default configuration
   - JSX should use single quotes for string literals
   - Components should be documented with JSDoc comments

2. **Backend (Express)**
   - No specific linting configuration
   - Use consistent spacing and indentation
   - Document API endpoints with comments

3. **Firebase Functions**
   - Follows Google JavaScript Style Guide
   - Uses ESLint with custom rules:
     - Double quotes for strings (with template literals allowed)
     - Arrow functions for callbacks
   - Tests use Mocha

### Project Structure

- `/assets` - Static assets (CSS, JS, images)
- `/backend` - Express server code and API routes
- `/components` - Reusable UI components
- `/firebase` - Firebase configuration
- `/frontend` - React frontend application
- `/functions` - Firebase Cloud Functions

### Debugging

1. **Frontend**
   - Use React Developer Tools browser extension
   - Console logs are visible in the browser's developer tools

2. **Backend**
   - Use `console.log` statements for debugging
   - Server logs are visible in the terminal where the server is running

3. **Firebase Functions**
   - Use Firebase Functions Emulator for local debugging
   - Logs can be viewed in the Firebase Console or locally when using the emulator

### Deployment

1. **Frontend**
   - Build the production version: `cd frontend && npm run build`
   - Deploy to GitHub Pages or Firebase Hosting

2. **Backend**
   - Deploy to a Node.js hosting service like Heroku or DigitalOcean

3. **Firebase Functions**
   - Deploy using Firebase CLI: `firebase deploy --only functions`