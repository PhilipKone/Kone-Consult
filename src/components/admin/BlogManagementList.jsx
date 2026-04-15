import React from 'react';
import { FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const BlogManagementList = ({ blogs, onDelete, onAdd, onEdit, onToggleStatus, onSeed }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    };

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-3">
                    <h5 className="text-white mb-0 fw-bold">Editorial Hub</h5>
                    <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 rounded-pill px-3" style={{ fontSize: '0.7rem' }}>
                        {blogs.length} Articles
                    </span>
                </div>
                <div className="d-flex gap-2">
                    <button 
                        onClick={onSeed} 
                        className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm"
                        title="Seed Default Articles"
                    >
                        Seed Default
                    </button>
                    <button onClick={onAdd} className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm">
                        <FaPlus size={12} /> New Article
                    </button>
                </div>
            </div>

            <motion.div 
                className="d-flex flex-column gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {blogs.map(blog => (
                        <motion.div 
                            key={blog.id} 
                            variants={itemVariants}
                            layout
                            className="drive-list-item glass-card p-3 d-flex align-items-center gap-3 group"
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Preview Thumbnail */}
                            <div className="flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                                {blog.imageUrl ? (
                                    <img src={blog.imageUrl} alt={blog.title} className="w-100 h-100 rounded object-fit-cover border border-dark border-opacity-25 shadow-sm" />
                                ) : (
                                    <div className="w-100 h-100 rounded bg-dark bg-opacity-25 d-flex align-items-center justify-content-center border border-dark border-opacity-25 text-secondary">
                                        <span className="small opacity-25">KA</span>
                                    </div>
                                )}
                            </div>

                            {/* Main Info */}
                            <div className="flex-grow-1 min-w-0">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="text-white mb-0 fw-bold text-truncate">{blog.title}</h6>
                                    <span className={`badge ${blog.category === 'Code' ? 'bg-success' : blog.category === 'Consult' ? 'bg-primary' : 'bg-warning text-dark'} bg-opacity-10 border border-current opacity-75`} style={{ fontSize: '0.6rem' }}>
                                        {blog.category}
                                    </span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                    <p className="text-secondary small mb-0 text-truncate opacity-50" style={{ maxWidth: '300px' }}>{blog.excerpt || 'No summary provided...'}</p>
                                    <span className="text-secondary small opacity-25 d-none d-md-inline" style={{ fontSize: '0.7rem' }}>• {blog.readTime || 5} min read</span>
                                </div>
                            </div>

                            {/* Status Toggle */}
                            <div className="d-none d-md-block px-3 border-start border-dark border-opacity-10">
                                <button 
                                    onClick={() => onToggleStatus(blog)}
                                    className={`badge ${blog.status === 'published' ? 'bg-success text-white' : 'bg-secondary text-secondary'} bg-opacity-10 border border-current rounded-pill px-3 py-2 border-0 transition-all`}
                                    style={{ fontSize: '0.65rem' }}
                                    title={blog.status === 'published' ? "Click to Unpublish" : "Click to Publish"}
                                >
                                    {blog.status === 'published' ? (
                                        <><FaEye className="me-1" /> Published</>
                                    ) : (
                                        <><FaEyeSlash className="me-1" /> Draft</>
                                    )}
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div className="d-flex align-items-center gap-2 ps-3 border-start border-dark border-opacity-10">
                                <button onClick={() => onEdit(blog)} className="btn btn-action-premium text-info" title="Edit">
                                    <FaEdit size={16} />
                                </button>
                                <button onClick={() => onDelete(blog.id)} className="btn btn-action-premium text-danger" title="Delete">
                                    <FaTrash size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {blogs.length === 0 && (
                <div className="text-center py-5 opacity-40">
                    <p className="small">The archive is empty. Start by creating a new article.</p>
                </div>
            )}
        </div>
    );
};

export default BlogManagementList;
