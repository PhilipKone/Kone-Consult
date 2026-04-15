import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { decryptMessage } from '../utils/crypto';
import { FaLock, FaShieldAlt, FaKey, FaArrowLeft, FaCheckCircle, FaExclamationCircle, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SecureMessageView = () => {
    const { messageId } = useParams();
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [messageData, setMessageData] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [decryptedContent, setDecryptedContent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessage = async () => {
            try {
                const docRef = doc(db, 'secure_messages', messageId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setMessageData(docSnap.data());
                } else {
                    setError("Message not found or has expired.");
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Unable to connect to the secure vault.");
            } finally {
                setLoading(false);
            }
        };

        fetchMessage();
    }, [messageId]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setError(null);

        try {
            const decrypted = await decryptMessage(messageData.content, accessCode);
            setDecryptedContent(decrypted);
        } catch (err) {
            setError("Incorrect access code. Please check your email.");
        } finally {
            setVerifying(false);
        }
    };

    if (loading) {
        return (
            <div className="min-vh-100 bg-darker d-flex align-items-center justify-content-center">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status"></div>
                    <p className="text-secondary small ls-2">OPENING SECURE VAULT...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-vh-100 bg-darker py-5 px-3">
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="mb-5 text-center">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="d-inline-block p-4 rounded-circle bg-primary bg-opacity-10 mb-4 border border-primary border-opacity-20"
                    >
                        <FaShieldAlt className="text-primary" size={40} />
                    </motion.div>
                    <h2 className="text-white fw-bold mb-2 ls-1">Secure Messaging Portal</h2>
                    <p className="text-secondary small">End-to-End Encrypted by Kone Academy Suite</p>
                </div>

                <AnimatePresence mode="wait">
                    {!decryptedContent ? (
                        <motion.div 
                            key="verify"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            className="glass-panel p-5 rounded-4 border-white border-opacity-5 shadow-2xl"
                        >
                            <div className="text-center mb-5">
                                <FaLock className="text-secondary mb-3 opacity-50" size={24} />
                                <h4 className="text-white mb-2">Access Code Required</h4>
                                <p className="text-secondary small px-lg-4">
                                    This message is encrypted. Please enter the 6-digit access code sent to your email address to unlock it.
                                </p>
                            </div>

                            <form onSubmit={handleVerify}>
                                <div className="mb-4">
                                    <input 
                                        type="text"
                                        maxLength="6"
                                        placeholder="000000"
                                        className="form-control-dark py-4 text-center h2 mb-0 rounded-4 ls-3 fw-bold shadow-none"
                                        value={accessCode}
                                        onChange={(e) => setAccessCode(e.target.value.replace(/\D/g, ''))}
                                        disabled={verifying}
                                        autoFocus
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger small text-center mb-4 rounded-3 d-flex align-items-center justify-content-center gap-2">
                                        <FaExclamationCircle /> {error}
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    disabled={verifying || accessCode.length < 6}
                                    className="btn btn-primary w-100 py-3 rounded-pill fw-bold ls-1 d-flex align-items-center justify-content-center gap-3 shadow-lg"
                                >
                                    {verifying ? (
                                        <div className="spinner-border spinner-border-sm" role="status"></div>
                                    ) : (
                                        <FaKey />
                                    )}
                                    {verifying ? 'DECRYPTING...' : 'UNLOCK MESSAGE'}
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="message"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="glass-panel p-0 overflow-hidden rounded-4 border-primary border-opacity-20 shadow-2xl"
                        >
                            <div className="p-4 border-bottom border-white border-opacity-5 bg-primary bg-opacity-5 d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="p-2 rounded-circle bg-success bg-opacity-10">
                                        <FaCheckCircle className="text-success" />
                                    </div>
                                    <div>
                                        <h6 className="text-white mb-0">{messageData.subject}</h6>
                                        <small className="text-secondary" style={{ fontSize: '0.7rem' }}>DECRYPTED SECURELY</small>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <small className="text-secondary d-block" style={{ fontSize: '0.7rem' }}>SENT BY</small>
                                    <small className="text-white fw-bold">KA Technical Team</small>
                                </div>
                            </div>
                            
                            <div className="p-5 bg-black bg-opacity-20">
                                <div className="message-body-text text-light opacity-90 lh-lg whitespace-pre-wrap">
                                    {decryptedContent}
                                </div>
                            </div>

                            <div className="p-4 border-top border-white border-opacity-5 bg-dark d-flex align-items-center gap-3">
                                <FaUserShield className="text-secondary opacity-50" />
                                <small className="text-secondary flex-grow-1" style={{ fontSize: '0.7rem' }}>
                                    This message was encrypted on the KA Dashboard and decrypted locally in your browser. No plaintext data was transmitted over the network.
                                </small>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-5 text-center">
                    <Link to="/" className="btn btn-link text-secondary text-decoration-none small d-inline-flex align-items-center gap-2 hover-text-white transition-all">
                        <FaArrowLeft size={12} /> Back to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SecureMessageView;
