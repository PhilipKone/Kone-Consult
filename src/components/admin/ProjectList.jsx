import React from 'react';
import { FaExternalLinkAlt, FaGithub, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectList = ({ projects, onDelete, onAdd, onEdit }) => {
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
                <h5 className="text-white mb-0 fw-bold">Project Repository</h5>
                <button onClick={onAdd} className="btn btn-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 shadow-sm">
                    <FaPlus size={12} /> New Project
                </button>
            </div>

            <motion.div 
                className="d-flex flex-column gap-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <AnimatePresence>
                    {projects.map(project => (
                        <motion.div 
                            key={project.id} 
                            variants={itemVariants}
                            layout
                            className="drive-list-item glass-card p-3 d-flex align-items-center gap-3 group"
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {/* Preview Thumbnail */}
                            <div className="flex-shrink-0" style={{ width: '60px', height: '60px' }}>
                                {project.image ? (
                                    <img src={project.image} alt={project.title} className="w-100 h-100 rounded object-fit-cover border border-dark border-opacity-25" />
                                ) : (
                                    <div className="w-100 h-100 rounded bg-dark bg-opacity-25 d-flex align-items-center justify-content-center border border-dark border-opacity-25 text-secondary">
                                        <FaPlus size={20} className="opacity-25" />
                                    </div>
                                )}
                            </div>

                            {/* Main Info */}
                            <div className="flex-grow-1 min-w-0">
                                <div className="d-flex align-items-center gap-2 mb-1">
                                    <h6 className="text-white mb-0 fw-bold text-truncate">{project.title}</h6>
                                    <span className="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-10" style={{ fontSize: '0.65rem' }}>
                                        {project.category}
                                    </span>
                                </div>
                                <p className="text-secondary small mb-0 text-truncate opacity-75">{project.description}</p>
                            </div>

                            {/* Center Status */}
                            <div className="d-none d-md-block px-3">
                                <span className={`badge ${project.status === 'Done' ? 'bg-success' : project.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'} bg-opacity-10 border border-current rounded-pill`} style={{ fontSize: '0.65rem' }}>
                                    {project.status || 'Todo'}
                                </span>
                            </div>

                            {/* Action Buttons (Proportional) */}
                            <div className="d-flex align-items-center gap-2 ps-3 border-start border-dark border-opacity-10">
                                {project.link && (
                                    <a href={project.link} target="_blank" rel="noreferrer" className="btn btn-action-premium" title="Live Demo">
                                        <FaExternalLinkAlt size={12} />
                                    </a>
                                )}
                                {project.github && (
                                    <a href={project.github} target="_blank" rel="noreferrer" className="btn btn-action-premium" title="GitHub">
                                        <FaGithub size={14} />
                                    </a>
                                )}
                                <div className="vr bg-secondary opacity-15 mx-1" style={{ height: '20px' }}></div>
                                <button onClick={() => onEdit(project)} className="btn btn-action-premium text-info" title="Edit">
                                    <FaEdit size={16} />
                                </button>
                                <button onClick={() => onDelete(project.id)} className="btn btn-action-premium text-danger" title="Delete">
                                    <FaTrash size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {projects.length === 0 && (
                <div className="text-center py-5 opacity-40">
                    <p className="small">No projects found in this repository.</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;
