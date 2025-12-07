import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaFolder } from 'react-icons/fa';

const Portfolio = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, "projects"), where("status", "==", "published"));
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="page-container container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">PROJECT LOGS</div>
                <h1 className="text-gradient mb-3 display-4">Portfolio</h1>
                <p className="lead text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    A collection of our deployed solutions and research projects.
                </p>
            </motion.div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-accent-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <motion.div
                    className="row g-4 pb-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.map((project) => (
                        <motion.div className="col-lg-4 col-md-6" key={project.id} variants={itemVariants}>
                            <div className="terminal-card h-100 p-0 d-flex flex-column">
                                <div className="terminal-header">
                                    <div className="dot red"></div>
                                    <div className="dot yellow"></div>
                                    <div className="dot green"></div>
                                    <span className="ms-2 text-secondary small font-monospace">project_{project.id.substring(0, 6)}.js</span>
                                </div>

                                {project.imageUrl && (
                                    <div className="project-image" style={{ height: '200px', overflow: 'hidden' }}>
                                        <img src={project.imageUrl} alt={project.title} className="w-100 h-100 object-fit-cover" />
                                    </div>
                                )}

                                <div className="p-4 flex-grow-1 d-flex flex-column">
                                    <div className="d-flex align-items-center gap-2 mb-3 text-accent-primary">
                                        <FaFolder />
                                        <span className="font-monospace small">{project.category || 'Development'}</span>
                                    </div>

                                    <h3 className="h5 text-primary mb-3">{project.title}</h3>
                                    <p className="text-secondary mb-4 small flex-grow-1">{project.description}</p>

                                    <div className="mb-4">
                                        <div className="d-flex flex-wrap gap-2">
                                            {project.tools && project.tools.split(',').map((tool, i) => (
                                                <span key={i} className="badge bg-dark text-secondary border border-secondary rounded-pill fw-normal" style={{ fontSize: '0.7rem' }}>
                                                    {tool.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3 mt-auto">
                                        {project.githubUrl && (
                                            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                                                <FaGithub /> Code
                                            </a>
                                        )}
                                        {project.liveUrl && (
                                            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
                                                <FaExternalLinkAlt /> Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {projects.length === 0 && !loading && (
                <motion.div
                    className="glass-panel text-center p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <h3 className="text-secondary">No projects initialized.</h3>
                    <p className="text-secondary small">Check back soon for updates!</p>
                </motion.div>
            )}
        </div>
    );
};

export default Portfolio;
