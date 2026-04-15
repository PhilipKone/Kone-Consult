import React, { useState, useEffect } from 'react';
import { FaSave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentationForm = ({ doc, onSave, onCancel, ideTemplates = [] }) => {
    const [formData, setFormData] = useState({
        title: '',
        id: '',
        category: 'general',
        section: 'r-intro',
        icon: 'FaCode',
        order: 0,
        content: '',
        templateId: ''
    });

    useEffect(() => {
        if (doc) {
            setFormData({ ...doc, category: doc.category || 'general' });
        }
    }, [doc]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <AnimatePresence>
            <div className="modal-overlay">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="modal-content-custom"
                    style={{ maxWidth: '800px' }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h4 className="m-0 text-white fw-bold">{doc ? 'Edit Documentation' : 'New Documentation'}</h4>
                        <button onClick={onCancel} className="btn-close btn-close-white p-2 border rounded-circle"></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-3 max-h-500 overflow-auto pe-2 custom-scrollbar">
                            <div className="col-md-6">
                                <label className="form-label text-secondary small fw-bold">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control-dark"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label text-secondary small fw-bold">Category (Division)</label>
                                <select
                                    name="category"
                                    className="form-select-dark"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="general">General (Academy Hub)</option>
                                    <option value="consult">Kone Consult</option>
                                    <option value="code">Kone Code</option>
                                    <option value="lab">Kone Lab</option>
                                </select>
                            </div>

                            <div className="col-md-4">
                                <label className="form-label text-secondary small fw-bold">ID (Slug)</label>
                                <input
                                    type="text"
                                    name="id"
                                    className="form-control-dark"
                                    value={formData.id}
                                    onChange={handleChange}
                                    placeholder="e.g., r-intro"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label text-secondary small fw-bold">Section ID</label>
                                <input
                                    type="text"
                                    name="section"
                                    className="form-control-dark"
                                    value={formData.section}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-2">
                                <label className="form-label text-secondary small fw-bold">Icon</label>
                                <input
                                    type="text"
                                    name="icon"
                                    className="form-control-dark"
                                    value={formData.icon}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-2">
                                <label className="form-label text-secondary small fw-bold">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    className="form-control-dark"
                                    value={formData.order}
                                    onChange={handleChange}
                                />
                            </div>

                            {formData.category === 'code' && (
                                <div className="col-12">
                                    <div className="p-3 bg-info bg-opacity-5 border border-info border-opacity-10 rounded-3">
                                        <label className="form-label text-info small fw-bold">Link to IDE Template (Optional)</label>
                                        <select
                                            name="templateId"
                                            className="form-select-dark border-info border-opacity-25"
                                            value={formData.templateId || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">-- No Linked Template --</option>
                                            {ideTemplates.map(t => (
                                                <option key={t.id} value={t.id}>{t.title} ({t.language})</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="col-12">
                                <label className="form-label text-secondary small fw-bold">HTML Content</label>
                                <textarea
                                    name="content"
                                    className="form-control-dark font-monospace"
                                    rows="12"
                                    value={formData.content}
                                    onChange={handleChange}
                                    style={{ fontSize: '0.85rem' }}
                                    placeholder="<div className='fade-in'>...</div>"
                                ></textarea>
                                <div className="form-text text-secondary small opacity-75 mt-2 p-2 bg-dark bg-opacity-25 rounded border border-secondary border-opacity-10">
                                    <strong>Formatting Note:</strong> Wrap code in <code>&lt;pre&gt;&lt;code className="language-python"&gt;...&lt;/code&gt;&lt;/pre&gt;</code> for highlighting.
                                </div>
                            </div>

                            <div className="col-12 mt-4 pt-4 border-top border-dark border-opacity-25">
                                <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill">
                                    <FaSave className="me-2" /> {doc ? 'Update Documentation' : 'Save Module'}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DocumentationForm;
