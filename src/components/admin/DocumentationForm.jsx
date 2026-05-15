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
            <div className="modal-overlay" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.8)' }}>
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="modal-content-custom border border-white border-opacity-10 shadow-2xl"
                    style={{ maxWidth: '1000px', background: '#0a0a0a', padding: '2rem' }}
                >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="m-0 text-white fw-bold">{doc ? 'Edit Documentation' : 'New Documentation'}</h4>
                            <p className="text-secondary small mb-0">Customize your module with standard HTML and styling hooks.</p>
                        </div>
                        <button onClick={onCancel} className="btn-close btn-close-white p-2 border rounded-circle opacity-50 hover-opacity-100"></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="row g-4 max-h-500 overflow-auto pe-3 custom-scrollbar">
                            {/* Meta Grid */}
                            <div className="col-md-4">
                                <label className="label-premium mb-2">Primary Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control-dark py-2"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Anim Studio Setup"
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="label-premium mb-2">Division Category</label>
                                <select
                                    name="category"
                                    className="form-select-dark py-2"
                                    value={formData.category}
                                    onChange={handleChange}
                                >
                                    <option value="general">Academy Hub</option>
                                    <option value="consult">Kone Consult</option>
                                    <option value="code">Kone Code</option>
                                    <option value="lab">Kone Lab</option>
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="label-premium mb-2">Unique Slug (ID)</label>
                                <input
                                    type="text"
                                    name="id"
                                    className="form-control-dark py-2"
                                    value={formData.id}
                                    onChange={handleChange}
                                    placeholder="e.g. anim-studio"
                                    required
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="label-premium mb-2">Section Anchor</label>
                                <input
                                    type="text"
                                    name="section"
                                    className="form-control-dark py-2"
                                    value={formData.section}
                                    onChange={handleChange}
                                    placeholder="e.g. r-intro"
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="label-premium mb-2">Icon Identifier</label>
                                <input
                                    type="text"
                                    name="icon"
                                    className="form-control-dark py-2"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="e.g. FaRocket"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="label-premium mb-2">Display Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    className="form-control-dark py-2"
                                    value={formData.order}
                                    onChange={handleChange}
                                />
                            </div>

                            {formData.category === 'code' && (
                                <div className="col-12">
                                    <div className="p-3 bg-primary bg-opacity-5 border border-primary border-opacity-10 rounded-3">
                                        <label className="label-premium text-primary mb-2">Linked IDE Template</label>
                                        <select
                                            name="templateId"
                                            className="form-select-dark border-primary border-opacity-25 py-2"
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

                            {/* Enhanced Content Area */}
                            <div className="col-12">
                                <div className="d-flex justify-content-between align-items-end mb-2">
                                    <label className="label-premium m-0">HTML Content Engine</label>
                                    <span className="text-secondary smaller fw-normal opacity-50">Standard HTML + Global Utilities Supported</span>
                                </div>
                                <div className="position-relative">
                                    <textarea
                                        name="content"
                                        className="form-control-dark font-monospace w-100"
                                        rows="18"
                                        value={formData.content}
                                        onChange={handleChange}
                                        style={{ 
                                            fontSize: '0.9rem', 
                                            lineHeight: '1.6',
                                            background: '#050505',
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            color: '#e0e0e0',
                                            padding: '1.5rem',
                                            borderRadius: '12px'
                                        }}
                                        placeholder="<div class='fade-in'>...</div>"
                                    ></textarea>
                                    <div className="position-absolute bottom-0 end-0 p-2 me-3 mb-2">
                                        <span className="badge bg-dark border border-white border-opacity-10 text-secondary smaller">UTF-8</span>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 bg-white bg-opacity-5 rounded-3 border border-white border-opacity-5">
                                    <div className="d-flex gap-3 align-items-start">
                                        <div className="p-2 bg-primary bg-opacity-10 rounded text-primary smaller fw-bold">PRO TIP</div>
                                        <p className="text-secondary smaller mb-0 lh-base">
                                            Use <code>class</code> instead of <code>className</code>. For code blocks, wrap in 
                                            <code>&lt;pre&gt;&lt;code class="language-python"&gt;...&lt;/code&gt;&lt;/pre&gt;</code> to enable 
                                            high-fidelity syntax highlighting in the viewer.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 mt-4 pt-4 border-top border-white border-opacity-10">
                                <div className="row g-3">
                                    <div className="col-md-8">
                                        <button type="submit" className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-lg transition-all hover-scale">
                                            <FaSave className="me-2" /> {doc ? 'Sync Documentation' : 'Deploy Module'}
                                        </button>
                                    </div>
                                    <div className="col-md-4">
                                        <button type="button" onClick={onCancel} className="btn btn-outline-secondary w-100 py-3 fw-bold rounded-pill">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DocumentationForm;
