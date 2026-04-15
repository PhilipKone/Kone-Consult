import React from 'react';
import { FaShieldAlt, FaReply } from 'react-icons/fa';

const MessageList = ({ messages, selectedMessage, onSelect, markAsRead }) => {
    return (
        <div className="col-12 col-lg-4 message-list-col h-100 d-flex flex-column border-end border-dark">
            <div className="p-4 border-bottom border-dark bg-dark">
                <h6 className="text-white mb-0 small fw-bold text-uppercase ls-1">Inbox</h6>
            </div>
            <div className="flex-grow-1 overflow-auto bg-black bg-opacity-20">
                {messages.length === 0 && <div className="p-4 text-center text-secondary small">No messages.</div>}
                {messages.map(msg => (
                    <div
                        key={msg.id}
                        onClick={() => { onSelect(msg); markAsRead(msg.id, msg.status); }}
                        className={`message-item p-3 border-bottom border-dark transition-all pointer ${selectedMessage?.id === msg.id ? 'bg-primary bg-opacity-10 border-start border-start-4 border-primary' : 'hover-bg-white-5'}`}
                    >
                        <div className="d-flex justify-content-between mb-1">
                            <span className={`small fw-bold text-truncate ${msg.read ? 'text-secondary font-normal' : 'text-white'}`}>{msg.name}</span>
                            <small className="timestamp text-secondary" style={{ fontSize: '0.7rem' }}>
                                {msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleDateString() : 'Now'}
                            </small>
                        </div>
                        <div className={`text-truncate small mb-2 ${msg.read ? 'text-secondary' : 'text-white'}`}>{msg.subject}</div>
                        
                        <div className="d-flex gap-2">
                            {msg.status === 'replied' && (
                                <span className="badge rounded-pill bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-10 px-2 py-1" style={{ fontSize: '0.6rem' }}>
                                    <FaReply className="me-1" /> Replied
                                </span>
                            )}
                            {msg.status === 'replied_secure' && (
                                <span className="badge rounded-pill bg-primary bg-opacity-20 text-primary border border-primary border-opacity-10 px-2 py-1" style={{ fontSize: '0.6rem' }}>
                                    <FaShieldAlt className="me-1" /> Secure Replied
                                </span>
                            )}
                            {!msg.read && (
                                <span className="badge rounded-pill bg-primary px-2 py-1" style={{ fontSize: '0.6rem' }}>New</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageList;
