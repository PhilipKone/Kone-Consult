import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaGoogle, FaPhone, FaTerminal } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
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
            await login(email, password);
            navigate('/');
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
            await googleSignIn();
            navigate('/');
        } catch (err) {
            setError('Failed to log in with Google: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container container d-flex align-items-center justify-content-center" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            <motion.div
                className="terminal-card p-0"
                style={{ width: '100%', maxWidth: '450px' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div className="terminal-header">
                    <FaTerminal className="text-accent-primary me-2" />
                    <span className="text-secondary small font-monospace">auth_module.exe</span>
                </div>

                <div className="p-5">
                    <div className="text-center mb-4">
                        <div className="text-accent-primary mb-3" style={{ fontSize: '3rem' }}>
                            <FaSignInAlt />
                        </div>
                        <h2 className="text-gradient fw-bold">System Login</h2>
                        <p className="text-secondary small font-monospace">AUTHENTICATION REQUIRED</p>
                    </div>

                    {error && <div className="alert alert-danger font-monospace small">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="text-secondary d-block mb-2 small font-monospace">EMAIL_ADDRESS</label>
                            <input
                                type="email"
                                className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-secondary d-block mb-2 small font-monospace">PASSWORD</label>
                            <input
                                type="password"
                                className="form-control w-100 p-2 bg-dark text-primary border-secondary"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button disabled={loading} className="btn btn-primary w-100 py-2 mb-4 fw-bold">
                            {loading ? 'AUTHENTICATING...' : 'LOGIN'}
                        </button>

                        <div className="text-center mb-4">
                            <p className="text-secondary mb-3 small font-monospace">- OR CONNECT WITH -</p>
                            <div className="d-flex justify-content-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleGoogleSignIn}
                                    disabled={loading}
                                    className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2"
                                >
                                    <FaGoogle /> Google
                                </button>
                                <button type="button" className="btn btn-outline-secondary d-flex align-items-center gap-2 px-3 py-2">
                                    <FaPhone /> Phone
                                </button>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link to="/forgot-password" className="text-accent-primary text-decoration-none d-block mb-2 small">Forgot Password?</Link>
                            <p className="text-secondary small">Don't have an account? <Link to="/register" className="text-accent-primary text-decoration-none">Register here</Link></p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
