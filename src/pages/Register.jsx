import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FaUserPlus, FaGoogle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        subscribeNewsletter: true
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ 
            ...formData, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);
            await signup(formData.email, formData.password, formData.name);
            
            // Add to subscribers if checked
            if (formData.subscribeNewsletter) {
                try {
                    await addDoc(collection(db, 'subscribers'), {
                        email: formData.email,
                        source: 'registration-form',
                        createdAt: serverTimestamp()
                    });
                } catch (subErr) {
                    console.error("Newsletter subscription silent failure:", subErr);
                }
            }

            navigate('/');
        } catch (err) {
            setError('Failed to create an account: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            await googleSignIn();
            navigate('/');
        } catch (err) {
            setError('Failed to sign up with Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
    };

    return (
        <div className="page-container">
            <div className="page-background-glow" />

            <div className="horizontal-scroll-container align-items-center justify-content-center h-100 pb-0">
                <motion.div
                    className="scroll-item"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ minWidth: '300px', maxWidth: '500px', width: '90vw' }}
                >
                    <div className="glass-card p-5">
                        <div className="text-center mb-5">
                            <div className="mb-4 d-inline-block rounded-circle p-3 bg-black bg-opacity-50">
                                <FaUserPlus className="text-secondary" size={24} />
                            </div>
                            <h2 className="display-6 fw-bold text-white mb-2">Create Account</h2>
                            <p className="text-secondary small">Join Kone Consult today</p>
                        </div>

                        {error && <div className="alert alert-danger small mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                            <div className="form-group d-flex flex-column">
                                <label className="text-secondary small fw-bold mb-3 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                            <div className="form-group d-flex flex-column">
                                <label className="text-secondary small fw-bold mb-3 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group d-flex flex-column">
                                <label className="text-secondary small fw-bold mb-3 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                            <div className="form-group d-flex flex-column">
                                <label className="text-secondary small fw-bold mb-3 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <div className="form-group d-flex align-items-center gap-3 py-2">
                                <div className="custom-checkbox-premium" onClick={() => handleChange({ target: { name: 'subscribeNewsletter', type: 'checkbox', checked: !formData.subscribeNewsletter } })}>
                                    <div className={`checkbox-box ${formData.subscribeNewsletter ? 'active' : ''}`}>
                                        {formData.subscribeNewsletter && <div className="checkbox-tick" />}
                                    </div>
                                </div>
                                <label className="text-secondary small user-select-none cursor-pointer" onClick={() => handleChange({ target: { name: 'subscribeNewsletter', type: 'checkbox', checked: !formData.subscribeNewsletter } })}>
                                    I want to receive the latest research and engineering insights from KA
                                </label>
                            </div>

                            <button
                                disabled={loading}
                                className="btn btn-primary w-100 py-3 mt-2 fw-bold text-uppercase letter-spacing-1 hover-up"
                            >
                                {loading ? 'Creating...' : 'Register'}
                            </button>
                        </form>

                        <div className="position-relative my-5 text-center">
                            <hr className="border-secondary opacity-25" />
                            <span className="position-absolute top-50 start-50 translate-middle px-3 bg-dark text-secondary small" style={{ zIndex: 1 }}>OR</span>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                className="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2 hover-scale-sm"
                            >
                                <FaGoogle className="text-danger" /> Sign up with Google
                            </button>
                        </div>

                        <div className="text-center mt-5">
                            <p className="text-secondary small mb-0">
                                Already have an account? <Link to="/login" className="text-white fw-bold text-decoration-none border-bottom border-primary pb-1">Login here</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
