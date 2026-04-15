import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTimes, FaInfoCircle, FaBook, FaGraduationCap } from 'react-icons/fa';
import { tagDescriptions } from '../data/tagData';

const TagModal = ({ tag, onClose }) => {
    if (!tag) return null;

    const modalContent = (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100dvh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999, 
                background: 'rgba(0,0,0,0.85)', 
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                touchAction: 'none'
            }}
            onClick={onClose}
        >
            <motion.div
                className="glass-panel p-4 position-relative"
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                style={{ maxWidth: '440px', width: '90%', border: '1px solid var(--accent-primary)', boxShadow: '0 0 30px rgba(88, 166, 255, 0.2)' }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="btn btn-link text-secondary position-absolute top-0 end-0 p-3"
                    onClick={onClose}
                    style={{ zIndex: 10 }}
                >
                    <FaTimes size={18} />
                </button>

                <div className="d-flex align-items-center gap-3 mb-3 text-accent-primary">
                    <FaInfoCircle size={24} color="var(--accent-primary)" />
                    <h3 className="h4 fw-bold mb-0 text-white">{tag}</h3>
                </div>

                <p className="text-secondary mb-0" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                    {(() => {
                        const normalizedTag = tag.trim();
                        // Try exact match
                        if (tagDescriptions[normalizedTag]) return tagDescriptions[normalizedTag];
                        // Try case-insensitive match
                        const match = Object.keys(tagDescriptions).find(k => k.toLowerCase() === normalizedTag.toLowerCase());
                        if (match) return tagDescriptions[match];
                        return "Detailed description coming soon for this tool. Please check our documentation for comprehensive research and data guides.";
                    })()}
                </p>

                <div className="mt-4 pt-3 border-top border-white border-opacity-10 d-flex flex-column gap-3">
                    <Link
                        to="/docs"
                        className="btn btn-outline-secondary text-white btn-sm d-flex align-items-center justify-content-center gap-2 py-2"
                        onClick={onClose}
                        style={{ borderRadius: '8px' }}
                    >
                        <FaBook size={14} /> View Documentation
                    </Link>
                    <Link
                        to="/training"
                        className="btn btn-primary btn-sm d-flex align-items-center justify-content-center gap-2 py-2"
                        onClick={onClose}
                        style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(88, 166, 255, 0.3)' }}
                    >
                        <FaGraduationCap size={14} /> Explore Training
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
};

export default TagModal;
