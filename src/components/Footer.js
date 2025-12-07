import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="logo">
                        <span className="logo-symbol">&gt;_</span>
                        <span className="logo-text">Kone Consult</span>
                    </div>
                    <p className="footer-tagline">Research. Data Analysis. Consulting.</p>
                    <div className="social-icons">
                        <a href="https://github.com/PhilipKone" target="_blank" rel="noreferrer"><FaGithub /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer"><FaLinkedin /></a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Services</h4>
                        <Link to="/services">Data Analysis</Link>
                        <Link to="/services">Report Writing</Link>
                        <Link to="/services">Consulting</Link>
                        <Link to="/vision-ai">Vision AI</Link>
                    </div>
                    <div className="link-group">
                        <h4>Company</h4>
                        <Link to="/about">About Us</Link>
                        <Link to="/portfolio">Portfolio</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="link-group">
                        <h4>Contact</h4>
                        <a href="mailto:phconsultgh@gmail.com"><FaEnvelope /> phconsultgh@gmail.com</a>
                        <a href="tel:+0551993820"><FaPhone /> +055 199 3820</a>
                        <span><FaMapMarkerAlt /> Accra, Ghana</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Kone Consult. Part of Kone-Code-Academy.</p>
            </div>
        </footer>
    );
};

export default Footer;
