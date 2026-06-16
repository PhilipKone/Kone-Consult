import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaProjectDiagram, FaClock, FaCheckCircle, FaLock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import SEO from '../components/SEO';
import Skeleton from '../components/Skeleton';

const ClientPortal = () => {
    const { currentUser } = useAuth();
    const [clientProjects, setClientProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        }

        const q = query(collection(db, 'projects'), where('clientId', '==', currentUser.uid));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setClientProjects(projectsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser]);

    if (!currentUser) {
        return (
            <div className="page-container d-flex flex-column align-items-center justify-content-center text-center">
                <SEO title="Client Portal" />
                <FaLock className="display-1 text-secondary mb-4 opacity-50" />
                <h2 className="text-white">Secure Access Required</h2>
                <p className="text-secondary">Please log in to view your project dashboard.</p>
            </div>
        );
    }

    return (
        <div className="page-container position-relative">
            <SEO title="Client Dashboard" description="Track your ongoing projects and milestones." />
            <div className="page-background-glow" />

            <div className="container py-4 py-md-5 mt-5 position-relative z-index-1">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-5"
                >
                    <h1 className="display-5 text-white fw-bold mb-2">Welcome Back, {currentUser.displayName || currentUser.email?.split('@')[0] || 'Client'}</h1>
                    <p className="text-secondary lead">Track the progress of your active projects and milestones.</p>
                </motion.div>

                {loading ? (
                    <div className="row g-4">
                        {[1, 2].map(i => (
                            <div key={i} className="col-12 col-lg-6">
                                <Skeleton type="chart-box" height="300px" />
                            </div>
                        ))}
                    </div>
                ) : clientProjects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-panel text-center p-4 p-md-5"
                    >
                        <FaProjectDiagram className="display-4 text-secondary mb-3 opacity-50" />
                        <h4 className="text-white">No Active Projects</h4>
                        <p className="text-secondary mb-0">You don't have any ongoing projects attached to your account yet.</p>
                    </motion.div>
                ) : (
                    <div className="row g-4">
                        {clientProjects.map((project, index) => (
                            <motion.div 
                                key={project.id} 
                                className="col-12 col-lg-6"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="glass-card h-100 p-4 d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-start mb-4">
                                        <div>
                                            <div className="badge bg-primary bg-opacity-25 text-primary mb-2 border border-primary border-opacity-25">
                                                {project.status || 'In Progress'}
                                            </div>
                                            <h3 className="h4 text-white mb-1">{project.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-secondary mb-4">{project.description}</p>
                                    
                                    <div className="mt-auto border-top border-dark pt-4">
                                        <h6 className="text-white mb-3 d-flex align-items-center gap-2">
                                            <FaClock className="text-warning" /> Current Status
                                        </h6>
                                        <div className="progress mb-2" style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                            <div 
                                                className="progress-bar bg-primary" 
                                                role="progressbar" 
                                                style={{ width: `${project.progress || 0}%` }}
                                            />
                                        </div>
                                        <div className="d-flex justify-content-between text-secondary small">
                                            <span>Initiation</span>
                                            <span>{project.progress || 0}% Complete</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientPortal;
