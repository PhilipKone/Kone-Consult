import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaGoogle, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { logActivity } from '../firebase/utils';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            const userCredential = await login(email, password);
            await logActivity(userCredential.user, 'Login Successful', { method: 'email' });
            if (email === 'phconsultgh@gmail.com') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError('Failed to log in: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await googleSignIn();
            await logActivity(result.user, 'Login Successful', { method: 'google' });
            navigate('/');
        } catch (err) {
            setError('Failed to log in with Google: ' + err.message);
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

            {/* Centered Single Output */}
            <div className="horizontal-scroll-container align-items-center justify-content-center h-100 pb-0">
                <motion.div
                    className="scroll-item"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ minWidth: '300px', maxWidth: '450px', width: '90vw' }}
                >
                    <div className="glass-card p-5">
                        <div className="text-center mb-5">
                            <div className="mb-4 d-inline-block rounded-circle p-3 bg-black bg-opacity-50">
                                <FaSignInAlt className="text-secondary" size={24} />
                            </div>
                            <h2 className="display-6 fw-bold text-white mb-2">Welcome Back</h2>
                            <p className="text-secondary small">Sign in to access your dashboard</p>
                        </div>

                        {error && <div className="alert alert-danger small mb-4">{error}</div>}

                        <form onSubmit={handleSubmit} className="d-flex flex-column gap-4">
                            <div className="form-group d-flex flex-column">
                                <label className="text-secondary small fw-bold mb-3 text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Email</label>
                                <input
                                    type="email"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                            <div className="form-group d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <label className="text-secondary small fw-bold text-uppercase ls-1" style={{ fontSize: '0.7rem' }}>Password</label>
                                    <Link to="/forgot-password" className="text-accent-primary text-decoration-none small" style={{ fontSize: '0.8rem' }}>Forgot?</Link>
                                </div>
                                <input
                                    type="password"
                                    className="form-control glass-input border-0 border-bottom border-secondary rounded-0 px-0 py-2 text-white"
                                    style={{ backgroundColor: 'transparent' }}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                disabled={loading}
                                className="btn btn-primary w-100 py-3 mt-2 fw-bold text-uppercase letter-spacing-1 hover-up"
                            >
                                {loading ? 'Authenticating...' : 'Login'}
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
                                <FaGoogle className="text-danger" /> Continue with Google
                            </button>
                        </div>

                        <div className="text-center mt-5">
                            <p className="text-secondary small mb-0">
                                Don't have an account? <Link to="/register" className="text-white fw-bold text-decoration-none border-bottom border-primary pb-1">Register here</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
