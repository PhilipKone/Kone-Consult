# PHconsult

<img src="assets/images/Logo.png" alt="PHconsult Logo" width="200" align="center">

PHconsult is a modern web application that provides comprehensive research assistance to students, professionals, and organizations. The platform offers a suite of services including research topic selection, data analysis, report writing, mentorship, and assignment support—all accessible via an intuitive, responsive interface.

---

## Table of Contents
- [Features](#features)
- [Live Demo](#live-demo)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [Contact](#contact)
- [License](#license)

---

## Features
- **User Authentication:** Secure registration and login (Node.js, Express, MongoDB, JWT)
- **Service Listings:** Data analysis, report writing, research consulting, topic selection, mentorship, assignment support
- **Responsive UI:** Modern, mobile-friendly design (Bootstrap 5, custom CSS)
- **Dark/Light Mode:** Theme toggle for accessibility
- **Collapsible Side Panel:** Space-efficient navigation
- **Online Service Requests:** Contact and order forms (with Firebase integration)
- **Testimonials:** Real client feedback
- **Admin Panel:** (WIP) For managing users and service requests

---

## Live Demo

Check out the deployed app here: [https://philipkone.github.io/PHconsult/](https://philipkone.github.io/PHconsult/)

---

## Getting Started

### Prerequisites
- Node.js & npm (for backend/server features)
- MongoDB Atlas account (for backend database)
- (Optional) Firebase project (for contact form and messaging)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/PhilipKone/PHconsult.git
   cd PHconsult
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory with your MongoDB URI and JWT secret:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     ```
   - (If using Firebase for contact form, configure your Firebase project in `contact.html`)
4. Start the backend server:
   ```bash
   node app.js
   ```
5. Open `index.html` in your browser for the frontend.

---

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5
- Font Awesome

### Backend
- Node.js, Express.js
- MongoDB (Mongoose ODM)
- JWT for authentication
- bcryptjs for password hashing
- body-parser for request parsing

### Messaging/Contact
- Firebase Firestore (for contact form/message storage)

---

## Project Structure
```
PHconsult-1/
├── app.js                 # Express backend entrypoint
├── backend/               # Backend logic (auth, models)
│   ├── authRoutes.js      # Auth API routes
│   ├── login_process.js   # (Legacy/optional)
│   ├── register_process.js# (Legacy/optional)
│   └── models/
│       └── User.js        # Mongoose User model
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── index.html             # Main landing page
├── about.html             # About the platform
├── services.html          # Service details
├── contact.html           # Contact form (uses Firebase)
├── login.html             # Login page
├── register.html          # Registration page
├── admin.html             # Admin dashboard (WIP)
├── package.json           # Node dependencies
└── README.md
```

---

## Usage
- Visit `index.html` for the main site.
- Register/Login for personalized features.
- Use the contact form for service requests or questions (messages stored in Firebase).
- Admin features are under development.

---

## Contributing
We welcome contributions to improve PHconsult!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

---

## Contact
- **Email:** phconsultgh@gmail.com
- **Phone:** +055 199 3820
- **Location:** Accra, Ghana
- [LinkedIn](https://www.linkedin.com/in/philip-kone)

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
