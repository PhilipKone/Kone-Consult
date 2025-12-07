import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaWhatsapp, FaLinkedin, FaTerminal } from 'react-icons/fa';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            await addDoc(collection(db, 'messages'), {
                ...formData,
                timestamp: serverTimestamp(),
                status: 'new',
                read: false,
                responded: false
            });

            setStatus({ type: 'success', message: 'Message sent successfully! We will get back to you soon.' });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="page-container container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">GET IN TOUCH</div>
                <h1 className="text-gradient mb-3 display-4">Contact Us</h1>
                <p className="lead text-secondary">We'd love to hear from you. Send us a message.</p>
            </motion.div>

            <div className="row g-5 pb-5">

                {/* Contact Form */}
                <motion.div
                    className="col-lg-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="terminal-card h-100 p-0">
                        <div className="terminal-header">
                            <FaTerminal className="text-accent-primary me-2" />
                            <span className="text-secondary small font-monospace">message_composer.exe</span>
                        </div>
                        <div className="p-4">
                            {status.message && (
                                <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
                                    {status.message}
                                    <button type="button" className="btn-close" onClick={() => setStatus({ type: '', message: '' })}></button>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="text-secondary d-block mb-2 small font-monospace">FULL_NAME</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="text-secondary d-block mb-2 small font-monospace">EMAIL_ADDRESS</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="text-secondary d-block mb-2 small font-monospace">PHONE_NUMBER</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="text-secondary d-block mb-2 small font-monospace">SUBJECT</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                        required
                                    >
                                        <option value="" className="text-secondary">Select a subject...</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Data Analysis">Data Analysis</option>
                                        <option value="Report Writing">Report Writing</option>
                                        <option value="Research Consulting">Research Consulting</option>
                                        <option value="Topic Selection">Topic Selection</option>
                                        <option value="Mentorship">Mentorship</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="text-secondary d-block mb-2 small font-monospace">MESSAGE_BODY</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>
                                <button disabled={isSubmitting} className="btn btn-primary w-100 py-2 mt-3 fw-bold">
                                    {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Info */}
                <motion.div
                    className="col-lg-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="terminal-card h-100 p-0">
                        <div className="terminal-header">
                            <div className="dot red"></div>
                            <div className="dot yellow"></div>
                            <div className="dot green"></div>
                            <span className="ms-2 text-secondary small font-monospace">contact_info.json</span>
                        </div>
                        <div className="p-4">
                            <div className="d-flex flex-column gap-4">

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-accent-primary" style={{ fontSize: '1.5rem' }}><FaEnvelope /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">EMAIL</h5>
                                        <a href="mailto:phconsultgh@gmail.com" className="text-secondary text-decoration-none">phconsultgh@gmail.com</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-accent-success" style={{ fontSize: '1.5rem' }}><FaPhone /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">PHONE</h5>
                                        <a href="tel:+0551993820" className="text-secondary text-decoration-none">+055 199 3820</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-accent-danger" style={{ fontSize: '1.5rem' }}><FaMapMarkerAlt /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">LOCATION</h5>
                                        <p className="text-secondary mb-0">Accra, Ghana</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-warning" style={{ fontSize: '1.5rem' }}><FaClock /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">WORKING_HOURS</h5>
                                        <p className="text-secondary mb-0">Mon - Fri: 9:00 AM - 5:00 PM</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-accent-success" style={{ fontSize: '1.5rem' }}><FaWhatsapp /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">WHATSAPP</h5>
                                        <a href="https://wa.me/233551993820" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none">+233 55 199 3820</a>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center p-3 rounded bg-dark border border-secondary">
                                    <div className="me-3 text-accent-primary" style={{ fontSize: '1.5rem' }}><FaLinkedin /></div>
                                    <div>
                                        <h5 className="text-primary mb-0 small font-monospace">LINKEDIN</h5>
                                        <a href="https://www.linkedin.com/company/phconsult-gh/?viewAsMember=true" target="_blank" rel="noreferrer" className="text-secondary text-decoration-none">philip-kone</a>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default Contact;
