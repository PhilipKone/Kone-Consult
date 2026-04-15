import React, { useState } from 'react';
import { sendEmail, sendSecureNotification } from '../../utils/emailService';
import { encryptMessage } from '../../utils/crypto';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaTrash, FaReply, FaEnvelope, FaPaperPlane, FaCheckCircle, FaExclamationCircle, FaLock, FaShieldAlt } from 'react-icons/fa';

const MessageView = ({ message, onDelete, onStatusUpdate }) => {
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);
    const [isSecure, setIsSecure] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [generatedCode, setGeneratedCode] = useState(null);

    if (!message) {
        return (
            <div className="col-12 col-lg-8 h-100 d-flex flex-column align-items-center justify-content-center text-secondary opacity-50">
                <FaEnvelope size={32} className="mb-2" />
                <p className="small">Select a message</p>
            </div>
        );
    }

    const handleSendReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setSending(true);
        setStatus(null);
        setGeneratedCode(null);

        try {
            if (isSecure) {
                // 1. Generate 6-digit access code (OTP style)
                const accessCode = Math.floor(100000 + Math.random() * 900000).toString();
                
                // 2. Encrypt message body in the dashboard (E2EE)
                const encryptedBody = await encryptMessage(replyText, accessCode);
                
                // 3. Save to secure_messages collection
                const secureMsgRef = await addDoc(collection(db, 'secure_messages'), {
                    recipientEmail: message.email,
                    recipientName: message.name,
                    subject: `Re: ${message.subject}`,
                    content: encryptedBody,
                    createdAt: serverTimestamp(),
                    originalMessageId: message.id
                });

                // 4. Send notification with Link + Access Code via EmailJS bridge
                await sendSecureNotification(
                    message.email,
                    message.name,
                    secureMsgRef.id,
                    accessCode
                );

                setGeneratedCode(accessCode);
            } else {
                // Standard unencrypted email via EmailJS
                await sendEmail(
                    message.email,
                    message.name,
                    `Re: ${message.subject}`,
                    replyText
                );
            }

            // Update status in messages collection
            const messageRef = doc(db, 'messages', message.id);
            await updateDoc(messageRef, { 
                status: isSecure ? 'replied_secure' : 'replied', 
                read: true 
            });
            
            if (onStatusUpdate) onStatusUpdate(message.id, isSecure ? 'replied_secure' : 'replied');

            setStatus('success');
            setReplyText('');
            if (!isSecure) setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error("Reply error:", error);
            setStatus('error');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="col-12 col-lg-8 bg-darker position-relative">
            <div className="d-flex flex-column h-100">
                <div className="p-4 border-bottom border-dark">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <h4 className="text-white mb-0">{message.subject}</h4>
                            {message.status === 'replied' && (
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-20 py-1 px-2 small">
                                    <FaCheckCircle className="me-1" /> Replied
                                </span>
                            )}
                        </div>
                        <button onClick={() => onDelete(message.id)} className="btn btn-link text-danger p-0 hover-opacity-75 transition-all">
                            <FaTrash />
                        </button>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-secondary small">
                        <span className="fw-bold text-white">{message.name}</span>
                        <span>&lt;{message.email}&gt;</span>
                    </div>
                </div>

                <div className="p-4 flex-grow-1 overflow-auto">
                    <div className="message-content-glass p-4 rounded-4 border border-white border-opacity-5">
                        <p className="message-body-text whitespace-pre-wrap text-light opacity-90 lh-lg">
                            {message.message}
                        </p>
                    </div>
                </div>

                <div className="p-4 border-top border-dark bg-black bg-opacity-20">
                    {status === 'success' && (
                        <div className="alert alert-success bg-success bg-opacity-10 border-success border-opacity-20 text-success small py-3 rounded-4 mb-3">
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <FaCheckCircle /> {isSecure ? 'Secure Message Encrypted & Sent!' : 'Reply sent successfully!'}
                            </div>
                            {isSecure && generatedCode && (
                                <div className="p-3 bg-black bg-opacity-20 rounded-3 border border-success border-opacity-10">
                                    <small className="d-block text-secondary mb-1">RECIPIENT ACCESS CODE</small>
                                    <div className="h4 mb-0 ls-2 fw-bold text-white mono">{generatedCode}</div>
                                    <small className="d-block mt-2 opacity-50 italic">The client has received this code via email notification.</small>
                                </div>
                            )}
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-20 text-danger small py-2 d-flex align-items-center gap-2 mb-3">
                            <FaExclamationCircle /> Failed to send reply. Please try again.
                        </div>
                    )}

                    <form onSubmit={handleSendReply}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setIsSecure(!isSecure)}
                                    className={`btn btn-sm rounded-pill px-3 d-flex align-items-center gap-2 transition-all ${isSecure ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {isSecure ? <FaLock /> : <FaShieldAlt />}
                                    {isSecure ? 'Secure Mode ON' : 'Standard Mode'}
                                </button>
                                {isSecure && (
                                    <small className="text-primary italic animate-pulse">
                                        AES-GCM 256bit Active
                                    </small>
                                )}
                            </div>
                        </div>

                        <div className={`reply-container glass-panel p-2 rounded-4 border transition-all ${isSecure ? 'border-primary border-opacity-50 shadow-blue' : 'border-dark'} mb-3`}>
                            <textarea
                                className="form-control form-control-dark border-0 text-white shadow-none"
                                rows="4"
                                placeholder={isSecure ? "Type your encrypted response..." : `Type your reply to ${message.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                style={{ resize: 'none', fontSize: '0.9rem' }}
                                disabled={sending}
                            ></textarea>
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="text-secondary small opacity-50">
                                This will send an official KA email to the user.
                            </div>
                            <div className="d-flex gap-2">
                                <a 
                                    href={`mailto:${message.email}?subject=Re: ${message.subject}`} 
                                    className="btn btn-outline-secondary btn-sm rounded-pill px-3 border-dark d-flex align-items-center gap-2"
                                >
                                    <FaReply /> Open in Mail App
                                </a>
                                <button 
                                    type="submit" 
                                    disabled={sending || !replyText.trim()} 
                                    className="btn btn-primary btn-sm rounded-pill px-4 d-flex align-items-center gap-2 shadow-lg"
                                >
                                    {sending ? (
                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    ) : (
                                        <FaPaperPlane />
                                    )}
                                    {sending ? 'Sending...' : 'Send Reply'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessageView;
