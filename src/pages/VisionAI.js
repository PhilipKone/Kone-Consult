import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEye, FaCheckCircle, FaCode, FaLightbulb, FaRocket, FaTerminal } from 'react-icons/fa';

const VisionAI = () => {
    return (
        <div className="page-container container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            {/* Header Section */}
            <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">AI MODULE</div>
                <h1 className="text-gradient d-flex align-items-center justify-content-center gap-3 mb-3 display-4">
                    <FaEye className="text-accent-primary" /> Vision AI
                </h1>
                <p className="lead text-secondary">Empowering Research with Advanced Image Intelligence</p>
            </motion.div>

            {/* Features Section */}
            <motion.div
                className="row justify-content-center mb-5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <div className="col-lg-10">
                    <div className="terminal-card p-5 text-center position-relative">
                        <div className="terminal-header position-absolute top-0 start-0 w-100">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                            <span className="ms-2 text-secondary small font-monospace">convi_ai_core.sys</span>
                        </div>

                        <div className="mt-4">
                            <div className="icon mb-4 text-accent-primary mx-auto" style={{ fontSize: '3rem' }}>
                                <FaEye className="blink-animation" />
                            </div>
                            <h2 className="fw-bold text-primary mb-3">Empowering Research</h2>
                            <p className="lead text-secondary mb-4">
                                ConviAI brings advanced image and document intelligence to Kone Consult, helping you extract
                                insights, automate analysis, and accelerate your research journey.
                            </p>
                            <div className="d-flex flex-wrap justify-content-center gap-4">
                                {[
                                    "OCR & Text Extraction",
                                    "Chart & Diagram Analysis",
                                    "Visual Q&A",
                                    "Content Moderation"
                                ].map((feature, i) => (
                                    <div key={i} className="d-flex align-items-center text-secondary">
                                        <FaCheckCircle className="text-accent-success me-2" /> {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Two Column Section: How it Works & Use Cases */}
            <div className="row g-4 mb-5">
                <motion.div
                    className="col-lg-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="terminal-card h-100 p-0">
                        <div className="terminal-header">
                            <FaLightbulb className="text-warning me-2" />
                            <span className="text-secondary small font-monospace">workflow.json</span>
                        </div>
                        <div className="p-4">
                            <h3 className="h4 text-primary mb-4">How It Works</h3>
                            <ol className="text-secondary ps-3 mb-0">
                                <li className="mb-3">Upload an image (e.g., research chart, handwritten note).</li>
                                <li className="mb-3">ConviAI analyzes the image using state-of-the-art AI models.</li>
                                <li className="mb-3">Get instant results: extracted text, chart insights, or visual Q&A.</li>
                                <li className="mb-0">Integrate with our chatbot for deeper research support.</li>
                            </ol>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="col-lg-6"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="terminal-card h-100 p-0">
                        <div className="terminal-header">
                            <FaTerminal className="text-accent-primary me-2" />
                            <span className="text-secondary small font-monospace">use_cases.log</span>
                        </div>
                        <div className="p-4">
                            <h3 className="h4 text-primary mb-4">Use Cases</h3>
                            <ul className="text-secondary ps-3 mb-0">
                                <li className="mb-3">Extract text from research papers, forms, or handwritten notes</li>
                                <li className="mb-3">Analyze diagrams and charts for instant insights</li>
                                <li className="mb-3">Visual search and Q&A on uploaded images</li>
                                <li className="mb-0">Automate repetitive research tasks</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Code Example Section */}
            <motion.div
                className="row justify-content-center mb-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="col-lg-10">
                    <div className="terminal-card p-0">
                        <div className="terminal-header">
                            <FaCode className="text-accent-secondary me-2" />
                            <span className="text-secondary small font-monospace">integration_example.js</span>
                        </div>

                        <div className="p-4 bg-dark">
                            <code className="text-light font-monospace" style={{ fontSize: '0.9rem' }}>
                                <span className="text-accent-secondary">const</span> vision = require(<span className="text-warning">'@google-cloud/vision'</span>);<br />
                                <span className="text-accent-secondary">const</span> client = <span className="text-accent-secondary">new</span> vision.ImageAnnotatorClient();<br /><br />
                                <span className="text-accent-secondary">async function</span> <span className="text-accent-primary">analyzeImage</span>(imagePath) {'{'}<br />
                                &nbsp;&nbsp;<span className="text-secondary">{/* Perform text detection on the image file */}</span><br />
                                &nbsp;&nbsp;<span className="text-accent-secondary">const</span> [result] = <span className="text-accent-secondary">await</span> client.textDetection(imagePath);<br />
                                &nbsp;&nbsp;<span className="text-accent-secondary">const</span> detections = result.textAnnotations;<br />
                                &nbsp;&nbsp;<span className="text-accent-secondary">return</span> detections[0] ? detections[0].description : <span className="text-warning">''</span>;<br />
                                {'}'}
                            </code>
                        </div>
                    </div>
                </div>
            </motion.div >

            {/* CTA Section */}
            < motion.div
                className="row justify-content-center mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
            >
                <div className="col-lg-8 text-center">
                    <div className="glass-panel p-5">
                        <div className="icon mb-3 text-accent-success mx-auto" style={{ fontSize: '2.5rem' }}>
                            <FaRocket />
                        </div>
                        <h3 className="fw-bold mb-3 text-primary">Ready to Start?</h3>
                        <p className="text-secondary mb-4">
                            Supercharge your research with Vision AI today.
                        </p>
                        <div className="d-flex justify-content-center gap-3">
                            <Link to="/contact" className="btn btn-primary px-4 py-2">Contact Us</Link>
                            <Link to="/services" className="btn btn-outline-secondary px-4 py-2">View Services</Link>
                        </div>
                    </div>
                </div>
            </motion.div >

        </div >
    );
};

export default VisionAI;
