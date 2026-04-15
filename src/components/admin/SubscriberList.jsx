import React, { useState } from 'react';
import { FaTrash, FaSearch, FaSync, FaEnvelope, FaDownload, FaCopy, FaPaperPlane, FaTimes, FaCircleNotch, FaCheckCircle, FaExclamationCircle, FaReply } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { sendBulkEmail } from '../../utils/emailService';

const SubscriberList = ({ subscribers, users, onSync, syncing }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    
    // Broadcast Modal State
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [broadcastForm, setBroadcastForm] = useState({ subject: '', message: '' });
    const [sendingBroadcast, setSendingBroadcast] = useState(false);
    const [broadcastResult, setBroadcastResult] = useState(null);

    const filteredSubscribers = subscribers.filter(s => 
        s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.source?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredSubscribers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredSubscribers.map(s => s.id));
        }
    };

    const toggleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBroadcast = async (e) => {
        e.preventDefault();
        const selectedSubscribers = subscribers.filter(s => selectedIds.includes(s.id));
        
        setSendingBroadcast(true);
        setBroadcastResult(null);

        try {
            const results = await sendBulkEmail(
                selectedSubscribers,
                broadcastForm.subject,
                broadcastForm.message
            );
            
            setBroadcastResult({
                success: results.success.length,
                failed: results.failed.length,
                total: selectedSubscribers.length
            });

            if (results.failed.length === 0) {
                setTimeout(() => {
                    setShowBroadcast(false);
                    setBroadcastForm({ subject: '', message: '' });
                    setBroadcastResult(null);
                    setSelectedIds([]);
                }, 3000);
            }
        } catch (error) {
            console.error("Broadcast failed:", error);
        } finally {
            setSendingBroadcast(false);
        }
    };

    const handleExportCSV = () => {
        const selectedSubscribers = subscribers.filter(s => selectedIds.includes(s.id));
        const headers = ['Email', 'Source', 'Joined Date'];
        const csvRows = [
            headers.join(','),
            ...selectedSubscribers.map(sub => [
                sub.email,
                sub.source || 'Direct',
                sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : 'N/A'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvRows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleCopyEmails = () => {
        const selectedEmails = subscribers
            .filter(s => selectedIds.includes(s.id))
            .map(s => s.email)
            .join(', ');
        
        navigator.clipboard.writeText(selectedEmails).then(() => {
            alert(`Copied ${selectedIds.length} emails to clipboard!`);
        });
    };

    const handleDelete = async (id, email) => {
        if (window.confirm(`Are you sure you want to remove ${email} from the mailing list?`)) {
            try {
                await deleteDoc(doc(db, 'subscribers', id));
                setSelectedIds(prev => prev.filter(i => i !== id));
            } catch (error) {
                console.error("Error deleting subscriber:", error);
                alert("Failed to delete subscriber.");
            }
        }
    };

    return (
        <div className="subscriber-management fade-in">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h5 className="text-white mb-0">Newsletter Subscribers</h5>
                    <small className="text-secondary">{subscribers.length} total subscribers identified.</small>
                </div>

                <div className="d-flex gap-2 align-items-center">
                    <div className="position-relative">
                        <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" size={12} />
                        <input
                            type="text"
                            className="form-control-dark ps-5 py-2 small rounded-pill"
                            placeholder="Search subscribers..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setSelectedIds([]); // Reset selection on search to avoid hidden selections
                            }}
                            style={{ minWidth: '200px' }}
                        />
                    </div>
                    <button 
                        onClick={onSync} 
                        disabled={syncing}
                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3"
                    >
                        <FaSync className={syncing ? 'fa-spin' : ''} /> {syncing ? 'Syncing...' : 'Sync All Users'}
                    </button>
                </div>
            </div>

            {/* Bulk Action Bar */}
            <AnimatePresence>
                {selectedIds.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bulk-action-bar glass-panel p-3 mb-3 d-flex justify-content-between align-items-center border-primary border-opacity-25"
                    >
                        <div className="d-flex align-items-center gap-3">
                            <span className="badge bg-primary rounded-pill px-3 py-2">{selectedIds.length} Selected</span>
                            <small className="text-secondary d-none d-md-block">Professional tools for your audience.</small>
                        </div>
                        <div className="d-flex gap-2">
                            <button onClick={handleCopyEmails} className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
                                <FaCopy /> Copy
                            </button>
                            <button onClick={handleExportCSV} className="btn btn-outline-light btn-sm d-flex align-items-center gap-2 rounded-pill px-3">
                                <FaDownload /> CSV
                            </button>
                            <button onClick={() => setShowBroadcast(true)} className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-4 shadow-lg">
                                <FaPaperPlane /> Broadcast
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-panel overflow-hidden border-dark border-opacity-50">
                <div className="table-responsive">
                    <table className="table table-dark table-hover mb-0 align-middle">
                        <thead className="bg-black bg-opacity-25">
                            <tr>
                                <th className="ps-4 py-3 border-0" style={{ width: '40px' }}>
                                    <input 
                                        type="checkbox" 
                                        className="form-check-input-dark" 
                                        checked={selectedIds.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="py-3 border-0 text-secondary small text-uppercase ls-1">Email Address</th>
                                <th className="py-3 border-0 text-secondary small text-uppercase ls-1">Source</th>
                                <th className="py-3 border-0 text-secondary small text-uppercase ls-1">Joined Date</th>
                                <th className="pe-4 py-3 border-0 text-end text-secondary small text-uppercase ls-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredSubscribers.length > 0 ? (
                                    filteredSubscribers.map((sub) => (
                                        <motion.tr 
                                            key={sub.id}
                                            layout
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className={`border-bottom border-dark border-opacity-10 ${selectedIds.includes(sub.id) ? 'bg-primary bg-opacity-5' : ''}`}
                                        >
                                            <td className="ps-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input-dark" 
                                                    checked={selectedIds.includes(sub.id)}
                                                    onChange={() => toggleSelectOne(sub.id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                                                        <FaEnvelope className="text-primary small" />
                                                    </div>
                                                    <span className="text-white fw-medium">{sub.email}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge rounded-pill ${
                                                    sub.source === 'admin-sync' ? 'bg-info bg-opacity-10 text-info border-info' : 
                                                    sub.source === 'blog-footer' ? 'bg-success bg-opacity-10 text-success border-success' :
                                                    'bg-primary bg-opacity-10 text-primary border-primary'
                                                } border border-opacity-25 py-1 px-3`} style={{ fontSize: '0.65rem' }}>
                                                    {sub.source || 'Direct'}
                                                </span>
                                            </td>
                                            <td className="text-secondary small">
                                                {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : 'Long ago'}
                                            </td>
                                            <td className="pe-4 text-end">
                                                <div className="d-flex justify-content-end gap-2">
                                                    <a 
                                                        href={`mailto:${sub.email}`} 
                                                        className="btn btn-outline-primary btn-sm border-0 bg-transparent p-2 hover-bg-primary"
                                                        title="Open in Mail App"
                                                    >
                                                        <FaReply size={14} />
                                                    </a>
                                                    <button 
                                                        onClick={() => handleDelete(sub.id, sub.email)}
                                                        className="btn btn-outline-danger btn-sm border-0 bg-transparent p-2 hover-bg-danger"
                                                        title="Remove Subscriber"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5 text-secondary">
                                            No subscribers found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Broadcast Modal */}
            <AnimatePresence>
                {showBroadcast && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay-custom d-flex align-items-center justify-content-center p-3"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-panel p-0 overflow-hidden border-white border-opacity-10 shadow-2xl"
                            style={{ width: '100%', maxWidth: '600px' }}
                        >
                            <div className="p-4 border-bottom border-dark d-flex justify-content-between align-items-center bg-black bg-opacity-20">
                                <div>
                                    <h5 className="text-white mb-0">Broadcast Update</h5>
                                    <small className="text-primary fw-bold">Sending to {selectedIds.length} recipients</small>
                                </div>
                                <button onClick={() => setShowBroadcast(false)} className="btn btn-link text-secondary p-0">
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleBroadcast} className="p-4">
                                {broadcastResult && (
                                    <div className={`alert ${broadcastResult.failed === 0 ? 'alert-success bg-success bg-opacity-10 border-success' : 'alert-warning bg-warning bg-opacity-10 border-warning'} text-white small mb-4`}>
                                        {broadcastResult.failed === 0 ? (
                                            <><FaCheckCircle className="me-2 text-success" /> All {broadcastResult.success} emails sent successfully!</>
                                        ) : (
                                            <><FaExclamationCircle className="me-2 text-warning" /> Sent: {broadcastResult.success} | Failed: {broadcastResult.failed}</>
                                        )}
                                    </div>
                                )}

                                <div className="mb-4">
                                    <label className="text-secondary small mb-2 text-uppercase ls-1">Subject</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g., New Blog Post: The Future of KA"
                                        className="form-control-dark py-3 px-4 rounded-4"
                                        value={broadcastForm.subject}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, subject: e.target.value })}
                                        disabled={sendingBroadcast}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="text-secondary small mb-2 text-uppercase ls-1">Message Content</label>
                                    <textarea 
                                        required
                                        rows="10"
                                        placeholder="Write your professional update here..."
                                        className="form-control-dark p-4 rounded-4"
                                        value={broadcastForm.message}
                                        onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                                        style={{ resize: 'none' }}
                                        disabled={sendingBroadcast}
                                    ></textarea>
                                </div>

                                <div className="d-flex justify-content-end gap-3 align-items-center mt-5">
                                    <div className="text-secondary small opacity-50 me-auto">
                                        Powered by KA Professional Mail Service
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowBroadcast(false)} 
                                        className="btn btn-outline-secondary border-0 px-4"
                                        disabled={sendingBroadcast}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary rounded-pill px-5 py-2 d-flex align-items-center gap-2 shadow-lg"
                                        disabled={sendingBroadcast || !broadcastForm.subject || !broadcastForm.message}
                                    >
                                        {sendingBroadcast ? (
                                            <FaCircleNotch className="fa-spin" />
                                        ) : (
                                            <FaPaperPlane />
                                        )}
                                        {sendingBroadcast ? 'Sending...' : 'Send Broadcast'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriberList;
