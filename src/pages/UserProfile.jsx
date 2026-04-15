import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { FaUserCircle, FaCode, FaRegCalendarAlt, FaEnvelope, FaExclamationCircle, FaFlask } from 'react-icons/fa';
import { motion } from 'framer-motion';

const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown';
    // Handle Firestore Timestamp
    if (dateValue.toDate) {
        return dateValue.toDate().toLocaleDateString();
    }
    // Handle ISO string or date object
    const date = new Date(dateValue);
    return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : 'Unknown';
};

const UserProfile = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                // Fetch User Details document from 'users' collection
                const userDocRef = doc(db, 'users', currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                } else {
                    // Fallback to auth object if not found in db
                    setUserData({
                        name: currentUser.displayName || 'Developer',
                        email: currentUser.email,
                        role: 'user',
                        createdAt: currentUser.metadata.creationTime
                    });
                }

                // Fetch Saved Projects from 'kone_code_projects'
                const q = query(
                    collection(db, 'kone_code_projects'),
                    where('authorId', '==', currentUser.uid)
                );
                const querySnapshot = await getDocs(q);

                const projects = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort by date locally since Firebase requires complex indexing for multiple fields
                projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setSavedProjects(projects);

            } catch (error) {
                console.error("Error fetching profile data: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [currentUser, navigate]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    if (loading) {
        return (
            <div className="page-container d-flex justify-content-center align-items-center">
                <span className="spinner-border text-primary"></span>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-background-glow" />

            <div className="container py-5" style={{ marginTop: '80px', position: 'relative', zIndex: 10 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row justify-content-center">

                    {/* Profile Header Card */}
                    <div className="col-12 col-lg-4 mb-4">
                        <div className="glass-card p-4 text-center h-100 d-flex flex-column align-items-center justify-content-center">
                            <FaUserCircle size={100} className="text-secondary mb-3 opacity-75" />
                            <h2 className="text-white fw-bold mb-1">{userData?.name || 'Developer'}</h2>
                            <p className="text-primary mb-3">
                                <FaEnvelope className="me-2" />
                                {userData?.email}
                            </p>

                            <div className="d-flex align-items-center gap-2 mb-4 text-secondary small">
                                <FaRegCalendarAlt />
                                Member Since: {formatDate(userData?.createdAt)}
                            </div>

                            <div className="d-flex justify-content-center gap-2 w-100">
                                {userData?.role === 'admin' && (
                                    <button onClick={() => navigate('/admin')} className="btn btn-outline-info flex-grow-1">
                                        Admin Panel
                                    </button>
                                )}
                                <button onClick={handleLogout} className="btn btn-outline-danger flex-grow-1">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Saved code snippets */}
                    <div className="col-12 col-lg-8 mb-4">
                        <div className="glass-card p-4 h-100">
                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary pb-3">
                                <h3 className="text-white m-0 d-flex align-items-center gap-2">
                                    <FaCode className="text-primary" /> My Saved Code
                                </h3>
                                <div className="d-flex gap-2">
                                    <a href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5175' : 'https://lab.koneacademy.io'} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2" title="Open Kone Lab Workshop">
                                        <FaFlask /> Launch Lab
                                    </a>
                                    <a href={window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5174/#/ide' : 'https://code.koneacademy.io/#/ide'} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold d-flex align-items-center gap-2" title="Open Kone Code API Workspace">
                                        <FaCode /> Launch IDE
                                    </a>
                                </div>
                            </div>

                            {savedProjects.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaExclamationCircle className="text-secondary mb-3 opacity-50" size={40} />
                                    <h5 className="text-white">No Projects Saved</h5>
                                    <p className="text-secondary">Explore the Kone Code IDE and save your work to see it here.</p>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {savedProjects.map(project => (
                                        <div key={project.id} className="col-12 col-md-6">
                                            <div className="card bg-dark border-secondary h-100 hover-scale-sm" style={{ cursor: 'pointer' }} onClick={() => window.open((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? `http://localhost:5174/#/ide?project=${project.id}` : `https://code.koneacademy.io/#/ide?project=${project.id}`), '_blank')}>
                                                <div className="card-body">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <h5 className="card-title text-white flex-grow-1 me-2 text-truncate">{project.title || 'Untitled Snippet'}</h5>
                                                        <span className="badge bg-primary px-2 py-1" style={{ fontSize: '0.7em' }}>{project.language}</span>
                                                    </div>
                                                    <p className="card-text text-secondary small mb-3">
                                                        Last updated: {formatDate(project.updatedAt)}
                                                    </p>
                                                    <pre className="bg-black bg-opacity-50 p-2 rounded text-secondary" style={{ fontSize: '0.7rem', maxHeight: '60px', overflow: 'hidden' }}>
                                                        {project.code.substring(0, 100)}...
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
