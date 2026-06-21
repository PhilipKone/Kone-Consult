import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import InstallBanner from './components/InstallBanner';
import ChatWidget from './components/ChatWidget';
import InteractiveGrid from './components/InteractiveGrid';
import './index.css';

import Home from './pages/Home';
import Services from './pages/Services';
import Protocols from './pages/Protocols';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Documentation from './pages/Documentation';
import AdminDashboard from './pages/AdminDashboard';
import TrainingHub from './pages/TrainingHub';
import UserProfile from './pages/UserProfile';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import SecureMessageView from './pages/SecureMessageView';
import KonePay from './pages/KonePay';
import ClientPortal from './pages/ClientPortal';

// Minimal inline fallback — avoids a full-page flash while chunks load
const PageLoader: React.FC = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '80vh', width: '100%'
  }}>
    <div style={{
      width: '40px', height: '40px', borderRadius: '50%',
      border: '3px solid rgba(88,166,255,0.15)',
      borderTopColor: '#58a6ff',
      animation: 'spin 0.8s linear infinite'
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const App: React.FC = () => {
  const [showLoader, setShowLoader] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');

    // Only show loader for real users on their first visit of the session
    if (typeof window !== 'undefined' && window.navigator.userAgent !== 'ReactSnap') {
      const hasLoadedBefore = sessionStorage.getItem('kone_consult_loaded');
      if (!hasLoadedBefore) {
        setShowLoader(true);
        sessionStorage.setItem('kone_consult_loaded', 'true');
      }
    }
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <NotificationProvider>
        <React.Fragment>
          {showLoader && (
            <LoadingScreen onFinished={() => setShowLoader(false)} />
          )}
          <Router>
            <div className="App animate-fade-in">
              <InteractiveGrid />
              <Header />
              <main>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/"                   element={<Home />} />
                    <Route path="/services"           element={<Services />} />
                    <Route path="/protocols"          element={<Protocols />} />
                    <Route path="/about"              element={<About />} />
                    <Route path="/contact"            element={<Contact />} />
                    <Route path="/login"              element={<Login />} />
                    <Route path="/register"           element={<Register />} />
                    <Route path="/docs"               element={<Documentation />} />
                    <Route path="/training"           element={<TrainingHub />} />
                    <Route path="/admin"              element={<AdminDashboard />} />
                    <Route path="/profile"            element={<UserProfile />} />
                    <Route path="/blog"               element={<Blog />} />
                    <Route path="/blog/:slug"         element={<BlogPost />} />
                    <Route path="/secure/:messageId"  element={<SecureMessageView />} />
                    <Route path="/pay"               element={<KonePay />} />
                    <Route path="/client-portal"      element={<ClientPortal />} />
                  </Routes>
                </Suspense>
              </main>
              <FooterWrapper />
              {window.navigator.userAgent !== 'ReactSnap' && <ChatWidget />}
              <InstallBanner />
            </div>
          </Router>
        </React.Fragment>
        </NotificationProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

// Helper to conditionally render Footer
const FooterWrapper: React.FC = () => {
  const location = useLocation();
  const isDocs = location.pathname.startsWith('/docs');

  if (isDocs) return null;
  return <Footer />;
}

export default App;
