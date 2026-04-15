import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaEnvelope, FaWhatsapp, FaMapMarkerAlt, FaPaperPlane, FaClock, FaUser, FaTag, FaCommentAlt } from 'react-icons/fa';

const ContactItem = ({ icon: Icon, title, content, link, colorClass }) => (
    <div className="d-flex align-items-center gap-3 p-3 rounded glass-panel border-0 mb-3 hover-scale-sm transition-all">
        <div className={`rounded-circle p-3 bg-black bg-opacity-50 ${colorClass}`}>
            <Icon size={20} />
        </div>
        <div>
            <h6 className="text-secondary small fw-bold mb-1 text-uppercase ls-1">{title}</h6>
            {link ? (
                <a href={link} className="text-white text-decoration-none fw-semibold stretched-link">{content}</a>
            ) : (
                <p className="text-white fw-semibold mb-0">{content}</p>
            )}
        </div>
    </div>
);

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
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
                read: false
            });
            setStatus({ type: 'success', message: 'Message sent! We\'ll be in touch soon.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error:', error);
            setStatus({ type: 'error', message: 'Failed to send. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { x: 50, opacity: 0 },
        visible: { x: 0, opacity: 1 }
    };

    return (
        <div className="page-container">
            <div className="page-background-glow" />

            <motion.div
                className="text-center section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">GET IN TOUCH</div>
                <h1 className="text-gradient mb-3 display-4">Contact Us</h1>
                <p className="lead text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Swipe through our contact options or drop us a message directly.
                </p>
            </motion.div>

            <motion.div
                className="horizontal-scroll-container pb-5 align-items-stretch justify-content-lg-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* SLIDE 1: Contact Information */}
                {/* Reduced minWidth to 300px for mobile safety */}
                <motion.div className="scroll-item" variants={itemVariants} style={{ minWidth: '300px', maxWidth: '500px' }}>
                    <div className="glass-card h-100 p-4 p-md-5">
                        <div className="mb-5">
                            <h3 className="h4 text-primary fw-bold mb-2">Direct Channels</h3>
                            <p className="text-secondary small">Reach out via your preferred method.</p>
                        </div>

                        <div className="d-flex flex-column gap-2 flex-grow-1 justify-content-center">
                            <ContactItem
                                icon={FaEnvelope}
                                title="Email"
                                content="phconsultgh@gmail.com"
                                link="mailto:phconsultgh@gmail.com"
                                colorClass="text-accent-primary"
                            />
                            <ContactItem
                                icon={FaWhatsapp}
                                title="WhatsApp / Call"
                                content="+233 55 199 3820"
                                link="https://wa.me/233551993820"
                                colorClass="text-accent-success"
                            />
                            <ContactItem
                                icon={FaMapMarkerAlt}
                                title="Location"
                                content="Accra, Ghana"
                                colorClass="text-accent-danger"
                            />
                            <ContactItem
                                icon={FaClock}
                                title="Working Hours"
                                content="Mon - Fri: 9:00 AM - 5:00 PM"
                                colorClass="text-warning"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* SLIDE 2: Message Form */}
                <motion.div className="scroll-item" variants={itemVariants} style={{ minWidth: '350px', maxWidth: '600px', width: '100%' }}>
                    <div className="glass-card h-100 p-4 p-md-5 position-relative overflow-hidden hover-y transition-all">


                        <div className="mb-5 position-relative z-1">
                            <h3 className="h4 text-primary fw-bold mb-2">Send a Message</h3>
                            <p className="text-secondary small">We'll get back to you within 24 hours.</p>
                        </div>

                        {status.message && (
                            <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'} mb-4 border-0 rounded-0 border-start border-4 border-${status.type === 'success' ? 'success' : 'danger'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 position-relative z-1">
                            <div className="d-flex flex-column flex-md-row gap-3">
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-3 p-3 rounded glass-panel border-0 h-100">
                                        <div className="rounded-circle p-3 bg-black bg-opacity-50 text-accent-primary flex-shrink-0">
                                            <FaUser size={20} />
                                        </div>
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="text-secondary small fw-bold mb-2 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control border-0 rounded-0 px-0 py-1 text-white shadow-none"
                                                style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex align-items-center gap-3 p-3 rounded glass-panel border-0 h-100">
                                        <div className="rounded-circle p-3 bg-black bg-opacity-50 text-accent-primary flex-shrink-0">
                                            <FaEnvelope size={20} />
                                        </div>
                                        <div className="flex-grow-1 d-flex flex-column">
                                            <label className="text-secondary small fw-bold mb-2 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control border-0 rounded-0 px-0 py-1 text-white shadow-none"
                                                style={{ boxShadow: 'none', backgroundColor: 'transparent' }}
                                                placeholder="john@example.com"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-3 p-3 rounded glass-panel border-0">
                                <div className="rounded-circle p-3 bg-black bg-opacity-50 text-accent-primary flex-shrink-0">
                                    <FaTag size={20} />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column">
                                    <label className="text-secondary small fw-bold mb-2 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="form-control border-0 rounded-0 px-0 py-1 text-white shadow-none"
                                        style={{ boxShadow: 'none', cursor: 'pointer', backgroundColor: 'transparent' }}
                                        required
                                    >
                                        <option value="" className="text-secondary bg-dark">Select a topic...</option>
                                        <option value="Data Analysis" className="bg-dark">Data Analysis</option>
                                        <option value="Research Consulting" className="bg-dark">Research Consulting</option>
                                        <option value="Collaboration" className="bg-dark">Collaboration</option>
                                        <option value="Other" className="bg-dark">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="d-flex align-items-start gap-3 p-3 rounded glass-panel border-0">
                                <div className="rounded-circle p-3 bg-black bg-opacity-50 text-accent-primary flex-shrink-0 mt-1">
                                    <FaCommentAlt size={20} />
                                </div>
                                <div className="flex-grow-1 d-flex flex-column">
                                    <label className="text-secondary small fw-bold mb-2 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="form-control border-0 rounded-0 px-0 py-1 text-white shadow-none"
                                        style={{ boxShadow: 'none', resize: 'none', backgroundColor: 'transparent' }}
                                        rows="3"
                                        placeholder="Tell us about it..."
                                        required
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                disabled={isSubmitting}
                                className="btn btn-primary py-3 fw-bold text-uppercase d-flex align-items-center justify-content-center gap-2 mt-2 hover-up"
                                style={{ borderRadius: '12px' }}
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Send Message <FaPaperPlane className="small" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Contact;
