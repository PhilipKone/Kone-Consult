import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import TagModal from '../components/TagModal';
import { globalCache } from '../utils/cache';

const Portfolio = () => {
    const [projects, setProjects] = useState(globalCache.portfolio || []);
    const [loading, setLoading] = useState(!globalCache.portfolio);
    const [selectedTag, setSelectedTag] = useState(null);

    useEffect(() => {
        document.title = "Portfolio | Kone Consult Impact & Success Stories";
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, "projects"), where("status", "==", "published"));
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by createdAt desc if available
                // Sort by createdAt desc if available
                projectsData.sort((a, b) => b.createdAt - a.createdAt);
                globalCache.portfolio = projectsData;
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
        <div className="page-container position-relative">
            <div className="page-background-glow" />

            <AnimatePresence>
                {selectedTag && (
                    <TagModal tag={selectedTag} onClose={() => setSelectedTag(null)} />
                )}
            </AnimatePresence>

            <motion.div
                className="text-center section-title"
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
                    className="horizontal-scroll-container pb-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {projects.map((project) => (
                        <motion.div className="scroll-item" key={project.id} variants={itemVariants}>
                            <div className="glass-card p-0 h-100 d-flex flex-column hover-y transition-all">
                                {project.imageUrl && (
                                    <div className="project-image w-100" style={{ height: '200px', flexShrink: 0, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <img src={project.imageUrl} alt={project.title} className="w-100 h-100 object-fit-cover" />
                                    </div>
                                )}

                                <div className="p-4 d-flex flex-column flex-grow-1">
                                    <h3 className="h5 text-white fw-bold mb-3">{project.title}</h3>
                                    <p className="text-secondary small mb-4 flex-grow-1">{project.description}</p>

                                    <div className="mb-4">
                                        <div className="tags-container justify-content-start">
                                            {project.tools && project.tools.split(',').map((tool, i) => (
                                                <motion.button
                                                    key={i}
                                                    className="glass-tag cursor-pointer border-0"
                                                    onClick={() => setSelectedTag(tool.trim())}
                                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 166, 255, 0.15)" }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    {tool.trim()}
                                                </motion.button>
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
