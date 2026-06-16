import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import './ChatWidget.css';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sessionId, setSessionId] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize or get session ID for guest user
        let sid = localStorage.getItem('kone_chat_session');
        if (!sid) {
            sid = 'guest_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('kone_chat_session', sid);
        }
        setSessionId(sid);
    }, []);

    useEffect(() => {
        if (!sessionId) return;
        
        // Listen to messages for this specific session
        const q = query(
            collection(db, 'chats', sessionId, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMessages);
            scrollToBottom();
        });

        return () => unsubscribe();
    }, [sessionId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !sessionId) return;

        const msgText = newMessage.trim();
        setNewMessage('');

        try {
            // Ensure session document exists for admin to see
            await setDoc(doc(db, 'chats', sessionId), {
                lastMessage: msgText,
                lastUpdate: serverTimestamp(),
                status: 'active',
                userId: sessionId
            }, { merge: true });

            // Add message to subcollection
            await addDoc(collection(db, 'chats', sessionId, 'messages'), {
                text: msgText,
                sender: 'user',
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chat-widget-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="chat-window glass-panel"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="chat-header">
                            <div>
                                <h5 className="mb-0">Kone Consult Support</h5>
                                <small className="text-secondary">We typically reply in a few minutes.</small>
                            </div>
                            <button className="btn-close-chat" onClick={() => setIsOpen(false)} aria-label="Close support chat">
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div className="chat-messages hide-scrollbar">
                            {messages.length === 0 ? (
                                <div className="chat-empty-state">
                                    <p>Hello! How can we help you with your research or software project today?</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`chat-message ${msg.sender === 'user' ? 'sent' : 'received'}`}>
                                        <div className="message-bubble">
                                            {msg.text}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form className="chat-input-area" onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Type your message..." 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button type="submit" disabled={!newMessage.trim()} aria-label="Send message">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button 
                className="chat-fab"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle support chat window"
            >
                {isOpen ? <FaTimes /> : <FaCommentDots />}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
