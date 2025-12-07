import React from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaUser, FaLinkedin, FaEnvelope, FaFileAlt, FaTerminal } from 'react-icons/fa';

const About = () => {
    return (
        <div className="page-container container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">WHO WE ARE</div>
                <h1 className="text-gradient mb-3 display-4">About Us</h1>
                <p className="lead text-secondary">Your trusted partner in professional research assistance.</p>
            </motion.div>

            {/* About Section */}
            <motion.div
                className="row justify-content-center mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="col-lg-8">
                    <div className="terminal-card p-0">
                        <div className="terminal-header">
                            <FaTerminal className="text-accent-primary me-2" />
                            <span className="text-secondary small font-monospace">mission_statement.txt</span>
                        </div>
                        <div className="p-5 text-center">
                            <div className="icon mb-4 text-accent-primary mx-auto" style={{ fontSize: '3rem' }}>
                                <FaUsers />
                            </div>
                            <h2 className="fw-bold text-primary mb-3">Our Mission</h2>
                            <p className="text-secondary mb-4 lead">
                                Kone Consult was founded with the goal of supporting students and professionals by offering comprehensive
                                research assistance. We specialize in data analysis, report writing, and more.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center gap-4">
                                <div className="d-flex align-items-center text-secondary">
                                    <FaCheckCircle className="text-accent-success me-2" /> Personalized support
                                </div>
                                <div className="d-flex align-items-center text-secondary">
                                    <FaCheckCircle className="text-accent-success me-2" /> Data-driven insights
                                </div>
                                <div className="d-flex align-items-center text-secondary">
                                    <FaCheckCircle className="text-accent-success me-2" /> Professional documentation
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
                className="row justify-content-center pb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="col-12 text-center mb-4">
                    <h2 className="fw-bold text-gradient">Our Team</h2>
                    <p className="lead text-secondary">Meet the expert behind Kone Consult</p>
                </div>
                <div className="col-lg-6">
                    <div className="terminal-card h-100 p-0">
                        <div className="terminal-header">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                            <span className="ms-2 text-secondary small font-monospace">user_profile_philip.json</span>
                        </div>
                        <div className="p-5 text-center">
                            <div className="mb-4">
                                <div className="d-inline-block p-1 rounded-circle border border-accent-primary">
                                    <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                                        <FaUser className="text-accent-primary" style={{ fontSize: '3rem' }} />
                                    </div>
                                </div>
                            </div>

                            <h3 className="card-title mb-1 text-primary">Philip Hotor</h3>
                            <h5 className="text-accent-secondary mb-4">Founder & Lead Researcher</h5>


                            <div className="d-flex justify-content-center gap-3">
                                <a href="https://www.linkedin.com/company/phconsult-gh/?viewAsMember=true" target="_blank" rel="noreferrer"
                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                                    <FaLinkedin /> LinkedIn
                                </a>
                                <a href="/contact" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
                                    <FaEnvelope /> Contact
                                </a>
                                <a href="/cv.html" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                                    <FaFileAlt /> CV
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default About;
