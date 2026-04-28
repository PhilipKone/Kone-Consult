import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import InteractiveGrid from './components/InteractiveGrid';
import InstallBanner from './components/InstallBanner';
import './index.css';

// Route-level code splitting — each page is only loaded when navigated to
const Home             = lazy(() => import('./pages/Home'));
const Services         = lazy(() => import('./pages/Services'));
const Portfolio        = lazy(() => import('./pages/Portfolio'));
const About            = lazy(() => import('./pages/About'));
const Contact          = lazy(() => import('./pages/Contact'));
const Login            = lazy(() => import('./pages/Login'));
const Register         = lazy(() => import('./pages/Register'));
const Documentation    = lazy(() => import('./pages/Documentation'));
const AdminDashboard   = lazy(() => import('./pages/AdminDashboard'));
const TrainingHub      = lazy(() => import('./pages/TrainingHub'));
const UserProfile      = lazy(() => import('./pages/UserProfile'));
const Blog             = lazy(() => import('./pages/Blog'));
const BlogPost         = lazy(() => import('./pages/BlogPost'));
const SecureMessageView = lazy(() => import('./pages/SecureMessageView'));

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
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <React.Fragment>
          <LoadingScreen onFinished={() => setIsInitializing(false)} />
          {!isInitializing && (
            <Router>
              <div className="App animate-fade-in">
                <InteractiveGrid />
                <Header />
                <main>
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/"                   element={<Home />} />
                      <Route path="/services"           element={<Services />} />
                      <Route path="/portfolio"          element={<Portfolio />} />
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
                    </Routes>
                  </Suspense>
                </main>
                <FooterWrapper />
                <InstallBanner />
              </div>
            </Router>
          )}
        </React.Fragment>
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
