import React from 'react';
import { FaExternalLinkAlt, FaGithub, FaPlus, FaEllipsisV, FaFolder, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectGrid = ({ projects, onDelete, onAdd, onEdit }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Done': return 'text-success';
            case 'In Progress': return 'text-warning';
            default: return 'text-secondary';
        }
    };

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case 'High': return 'bg-danger';
            case 'Medium': return 'bg-warning text-dark';
            case 'Low': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white mb-0 fw-bold">Project Repository</h5>
                <button onClick={onAdd} className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm">
                    <FaPlus size={12} /> New Project
                </button>
            </div>

            <motion.div 
                className="drive-grid-wrapper"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence mode="popLayout">
                    {projects.map(project => (
                        <motion.div 
                            key={project.id} 
                            variants={cardVariants}
                            layout
                            className="drive-grid-item"
                            exit={{ opacity: 0, scale: 0.8 }}
                        >
                            <div className="drive-grid-card h-100 position-relative d-flex flex-column">
                                {/* Actions Area */}
                                <div className="drive-actions-overlay p-3">
                                    <div className="dropdown">
                                        <button className="btn btn-link text-white p-1 bg-dark bg-opacity-50 rounded-circle shadow-sm" data-bs-toggle="dropdown">
                                            <FaEllipsisV size={14} />
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg border-secondary border-opacity-25 glass-card">
                                            <li><button className="dropdown-item small py-2 fw-medium d-flex align-items-center gap-2" onClick={() => onEdit(project)}><FaEdit className="text-info" /> Edit Details</button></li>
                                            <li><button className="dropdown-item text-danger small py-2 fw-medium d-flex align-items-center gap-2" onClick={() => onDelete(project.id)}><FaTrash /> Delete Project</button></li>
                                        </ul>
                                    </div>
                                </div>

                                {/* Header / Preview */}
                                <div className="drive-grid-preview border-bottom border-dark border-opacity-10 pointer" onClick={() => onEdit(project)}>
                                    {project.image ? (
                                        <img src={project.image} alt={project.title} className="drive-img" />
                                    ) : (
                                        <div className="drive-icon-fallback">
                                            <FaFolder size={48} className="text-primary opacity-40" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay Category & Status */}
                                    <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-t">
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-25 px-2 py-1" style={{ fontSize: '0.65rem' }}>
                                                {project.category}
                                            </span>
                                            {project.status && (
                                                <span className={`badge ${getStatusColor(project.status)} bg-opacity-10 border border-current px-2 py-1`} style={{ fontSize: '0.65rem' }}>
                                                    {project.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Body */}
                                <div className="drive-grid-info flex-grow-1 p-3">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div className="d-flex align-items-center gap-2 min-w-0">
                                            <span className={`priority-indicator rounded-pill ${getPriorityBadge(project.priority)}`} style={{ height: '6px', width: '6px' }}></span>
                                            <h6 className="text-white mb-0 fw-bold text-truncate" title={project.title}>{project.title}</h6>
                                        </div>
                                    </div>
                                    <p className="text-secondary small mb-3 line-clamp-2" style={{ fontSize: '0.78rem', opacity: 0.7, lineHeight: '1.4' }}>
                                        {project.description}
                                    </p>
                                    
                                    {/* Action Links */}
                                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2 border-top border-white border-opacity-10">
                                        <div className="d-flex gap-2">
                                            {project.link && (
                                                <a href={project.link} target="_blank" rel="noreferrer" className="btn-action-minimal" title="Live Demo">
                                                    <FaExternalLinkAlt size={11} />
                                                </a>
                                            )}
                                            {project.github && (
                                                <a href={project.github} target="_blank" rel="noreferrer" className="btn-action-minimal" title="GitHub">
                                                    <FaGithub size={13} />
                                                </a>
                                            )}
                                        </div>
                                        <span className="text-secondary opacity-40 font-monospace" style={{ fontSize: '0.62rem' }}>{project.id.slice(-6).toUpperCase()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {projects.length === 0 && (
                <div className="text-center py-5">
                    <div className="glass-icon mx-auto mb-3" style={{ width: '80px', height: '80px' }}>
                        <FaFolder className="text-secondary opacity-25" size={32} />
                    </div>
                    <p className="text-secondary mb-0">No projects found. Add your first one above.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectGrid;
