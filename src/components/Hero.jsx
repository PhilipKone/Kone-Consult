import React from 'react';
import { Link } from 'react-router-dom';
import TypingAnimation from './TypingAnimation';
import './Hero.css';
import prereviewSnapshot from '../assets/images/prereview-snapshot.png';

const Hero = () => {
    return (
        <React.Fragment>
            <section className="hero" id="home">
                <div className="hero-container">
                    <div className="hero-content">
                        <div className="badge">ACADEMIC • BUSINESS • SOFTWARE</div>
                        <h1 className="hero-title">
                            Research. Analysis.<br />
                            <span className="text-gradient">Innovation.</span>
                        </h1>
                        <p className="hero-subtitle">
                            Your expert partner in multi-disciplinary research. We deliver specialized insights, statistical analysis, and compliance protocols across the academic, corporate, and software landscapes.
                        </p>
                        <div className="hero-actions">
                            <Link to="/services" className="btn-primary big">Explore Services</Link>
                            <Link to="/contact" className="btn-secondary big">Contact Us</Link>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="terminal-window glass-panel">
                            <div className="terminal-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                                <div className="terminal-title">bash — kone-consult-cli</div>
                            </div>
                            <div className="terminal-body">
                                <div className="command-line">
                                    <span className="prompt">user@kone-consult:~$</span>
                                    <span className="command"> init research-project --type=analysis</span>
                                </div>
                                <div className="output">
                                    <TypingAnimation />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hero-background-glow"></div>
            </section>

            {/* Trust Section */}
            <div className="hero-trust-section glass-panel">
                <div className="trust-title">Trusted by Scholars & Researchers From</div>
                <div className="trust-logos-grid">
                    <div className="trust-logo-card">
                        <div className="logo-img-wrapper">
                            <img src="/logos/ug_logo.jpg" alt="University of Ghana Logo" className="trust-logo-img" width="120" height="80" />
                        </div>
                        <div className="trust-logo-text">
                            <span className="inst-name">University of Ghana</span>
                            <span className="inst-sub">Accra, Ghana</span>
                        </div>
                    </div>
                    <div className="trust-logo-card">
                        <div className="logo-img-wrapper">
                            <img src="/logos/uhas_logo.png" alt="University of Health & Allied Sciences Logo" className="trust-logo-img" width="120" height="80" />
                        </div>
                        <div className="trust-logo-text">
                            <span className="inst-name">University of Health & Allied Sciences</span>
                            <span className="inst-sub">Ho, Ghana</span>
                        </div>
                    </div>
                </div>
            </div>
 
            <div className="hero-featured-section glass-panel" id="journal-club">
                <div className="featured-header">
                    <h2>Featured on</h2>
                    <h2 className="text-gradient">PREreview.org</h2>
                </div>
                <div className="featured-content">
                    <p>
                        We are proud to be recognized by PREreview.org. Explore our journal club and our ongoing commitment to open peer review and scholarly publishing.
                    </p>
                    <div className="snapshot-container">
                        <img
                             src={prereviewSnapshot}
                             alt="Kone Consult Journal Club on PREreview"
                             className="prereview-image"
                             width="600"
                             height="350"
                        />
                    </div>
                    <a href="https://prereview.org/clubs/kone-consult" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                        View our PREreview Club
                    </a>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Hero;
