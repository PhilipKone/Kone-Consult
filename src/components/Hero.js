import React from 'react';
import { Link } from 'react-router-dom';
import TypingAnimation from './TypingAnimation';
import './Hero.css';

const Hero = () => {
    return (
        <section className="hero" id="home">
            <div className="hero-container">
                <div className="hero-content">
                    <div className="badge">Research Division</div>
                    <h1 className="hero-title">
                        Research. Analysis.<br />
                        <span className="text-gradient">Consulting.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your expert partner in research assistance, data analysis, and academic success. Powered by Kone Code Academy.
                    </p>
                    <div className="hero-actions">
                        <Link to="/services" className="btn-primary big">Explore Services</Link>
                        <Link to="/contact" className="btn-secondary big">Get in Touch</Link>
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
    );
};

export default Hero;
