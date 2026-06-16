import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { FaCommentDots, FaCircle, FaPaperPlane } from 'react-icons/fa';

const LiveChatManager = () => {
    const [activeChats, setActiveChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch all active chats
    useEffect(() => {
        const q = query(
            collection(db, 'chats'),
            orderBy('lastUpdate', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const chats = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                lastUpdate: doc.data().lastUpdate?.toDate() || new Date()
            }));
            setActiveChats(chats);
        });

        return () => unsubscribe();
    }, []);

    // Fetch messages for selected chat
    useEffect(() => {
        if (!selectedChat) return;

        const q = query(
            collection(db, 'chats', selectedChat.id, 'messages'),
            orderBy('timestamp', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedMsgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(fetchedMsgs);
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        });

        return () => unsubscribe();
    }, [selectedChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const msgText = newMessage.trim();
        setNewMessage('');

        try {
            await addDoc(collection(db, 'chats', selectedChat.id, 'messages'), {
                text: msgText,
                sender: 'admin',
                timestamp: serverTimestamp()
            });

            await updateDoc(doc(db, 'chats', selectedChat.id), {
                lastMessage: msgText,
                lastUpdate: serverTimestamp()
            });
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="row g-4 h-100">
            {/* Chat List */}
            <div className="col-12 col-md-4">
                <div className="glass-panel h-100 p-0 overflow-hidden d-flex flex-column" style={{ minHeight: '500px' }}>
                    <div className="p-3 border-bottom border-dark bg-dark">
                        <h6 className="mb-0 text-white d-flex align-items-center gap-2">
                            <FaCommentDots className="text-primary" /> Active Visitors
                        </h6>
                    </div>
                    <div className="flex-grow-1 overflow-auto hide-scrollbar">
                        {activeChats.length === 0 ? (
                            <div className="p-4 text-center text-secondary small">
                                No active chats at the moment.
                            </div>
                        ) : (
                            activeChats.map(chat => (
                                <div 
                                    key={chat.id} 
                                    className={`p-3 border-bottom border-dark cursor-pointer transition-all hover-bg-dark ${selectedChat?.id === chat.id ? 'bg-dark bg-opacity-50' : ''}`}
                                    onClick={() => setSelectedChat(chat)}
                                >
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <span className="text-white small fw-bold text-truncate" style={{ maxWidth: '150px' }}>
                                            Guest {chat.id.substring(6, 12)}
                                        </span>
                                        <FaCircle className={chat.status === 'active' ? 'text-success' : 'text-secondary'} style={{ fontSize: '8px' }} />
                                    </div>
                                    <div className="text-secondary small text-truncate">
                                        {chat.lastMessage || 'Started a conversation'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Window */}
            <div className="col-12 col-md-8">
                <div className="glass-panel h-100 p-0 overflow-hidden d-flex flex-column" style={{ minHeight: '500px' }}>
                    {selectedChat ? (
                        <>
                            <div className="p-3 border-bottom border-dark bg-dark">
                                <h6 className="mb-0 text-white">Chat with Guest {selectedChat.id.substring(6, 12)}</h6>
                            </div>
                            
                            <div className="flex-grow-1 p-3 overflow-auto hide-scrollbar d-flex flex-column gap-3">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`d-flex ${msg.sender === 'admin' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div className={`p-2 px-3 rounded-3 ${msg.sender === 'admin' ? 'bg-primary text-white' : 'bg-dark text-secondary'}`} style={{ maxWidth: '75%', fontSize: '0.9rem' }}>
                                            {msg.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="p-3 bg-dark border-top border-dark d-flex gap-2" onSubmit={handleSendMessage}>
                                <input 
                                    type="text" 
                                    className="form-control border-secondary text-white shadow-none" 
                                    style={{ backgroundColor: '#161b22' }}
                                    placeholder="Type a reply..." 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary d-flex align-items-center justify-content-center px-4" disabled={!newMessage.trim()}>
                                    <FaPaperPlane />
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="h-100 d-flex flex-column align-items-center justify-content-center text-secondary">
                            <FaCommentDots className="display-4 mb-3 opacity-50" />
                            <p>Select a conversation to start replying</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LiveChatManager;
