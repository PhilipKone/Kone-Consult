import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-container">
                <Link to="/" className="logo">
                    <span className="logo-symbol">&gt;_</span>
                    <span className="logo-text">Kone Consult</span>
                </Link>

                <nav className="nav-menu">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/services" className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}>Services</Link>
                    <Link to="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}>Portfolio</Link>
                    <Link to="/vision-ai" className={`nav-link ${location.pathname === '/vision-ai' ? 'active' : ''}`}>Vision AI</Link>
                    <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
                    <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                </nav>

                <div className="header-actions">
                    <Link to="/login" className="btn-secondary">Login</Link>
                    <a href="https://PhilipKone.github.io/Kone-Code-Academy/" className="btn-primary">Back to Hub</a>
                </div>
            </div>
        </header>
    );
};

export default Header;
