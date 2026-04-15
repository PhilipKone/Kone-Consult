import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import './Footer.css';
import { FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaDiscord, FaFacebook, FaInstagram, FaSlack, FaYoutube, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                        <Logo size={40} className="logo-symbol" />
                        <span className="logo-text">Kone Consult</span>
                    </Link>
                    <p className="footer-tagline">Research. Data Analysis. Consulting.</p>
                    <div className="social-icons">
                        <a href="https://x.com/koneacademy" target="_blank" rel="noreferrer" aria-label="X"><FaXTwitter /></a>
                        <a href="https://www.tiktok.com/@koneacademy?_r=1&_t=ZM-931L3z5lu71" target="_blank" rel="noreferrer" aria-label="TikTok"><FaTiktok /></a>
                        <a href="https://discord.gg/Ab4SCxPgUK" target="_blank" rel="noreferrer" aria-label="Discord"><FaDiscord /></a>
                        <a href="https://www.linkedin.com/company/konecodeacdemy/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
                        <a href="https://www.facebook.com/profile.php?id=61584327765846" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook /></a>
                        <a href="https://www.instagram.com/koneacademy?igsh=bnlnaTZ5YmNsMXJ1&utm_source=qr" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram /></a>
                        <a href="https://join.slack.com/t/koneacademy/shared_invite/zt-3te5lrqpj-d3gixasFIoSerlBnoQ1UMg" target="_blank" rel="noreferrer" aria-label="Slack"><FaSlack /></a>
                        <a href="https://youtube.com/@koneacademy?si=zqEGBiiu0NRdNk6p" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Services</h4>
                        <Link to="/services">Data Analysis</Link>
                        <Link to="/services">Report Writing</Link>
                        <Link to="/services">Consulting</Link>
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
                        <a href="tel:+233551993820"><FaPhone /> +233 55 199 3820</a>
                        <span><FaMapMarkerAlt /> Accra, Ghana</span>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Kone Consult. Part of Kone Academy.</p>
            </div>
        </footer>
    );
};

export default Footer;
