import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { updateProfile, sendPasswordResetEmail, deleteUser } from 'firebase/auth';
import { FaUserCircle, FaCode, FaRegCalendarAlt, FaEnvelope, FaExclamationCircle, FaFlask, FaEdit, FaKey, FaTrash, FaCheck, FaTimes, FaBriefcase } from 'react-icons/fa';
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
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [resetSent, setResetSent] = useState(false);

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

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === userData?.name) {
            setIsEditingName(false);
            return;
        }
        try {
            await updateProfile(currentUser, { displayName: newName });
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, { name: newName });
            setUserData(prev => ({ ...prev, name: newName }));
            setIsEditingName(false);
        } catch (error) {
            console.error("Failed to update name", error);
            alert("Failed to update name. Try again later.");
        }
    };

    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, currentUser.email);
            setResetSent(true);
            setTimeout(() => setResetSent(false), 5000);
        } catch (error) {
            console.error("Failed to send reset email", error);
            alert("Failed to send reset email. Make sure you signed in with Email/Password.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("CRITICAL WARNING: Are you absolutely sure you want to permanently delete your account and all associated data? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, 'users', currentUser.uid));
                await deleteUser(currentUser);
                navigate('/');
            } catch (error) {
                console.error("Failed to delete account", error);
                if (error.code === 'auth/requires-recent-login') {
                    alert("For security reasons, please log out and log back in before deleting your account.");
                } else {
                    alert("An error occurred while deleting your account.");
                }
            }
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

            <div className="container py-4 py-md-5" style={{ marginTop: '80px', position: 'relative', zIndex: 10 }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="row justify-content-center">

                    {/* Profile Header Card */}
                    <div className="col-12 col-lg-4 mb-4">
                        <div className="bg-secondary bg-opacity-10 rounded-4 border border-secondary border-opacity-25 d-flex flex-column overflow-hidden h-auto">
                            {/* Header Banner */}
                            <div 
                                style={{ 
                                    height: '100px', 
                                    background: 'linear-gradient(135deg, rgba(88,166,255,0.4) 0%, rgba(20,20,30,1) 100%)',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }} 
                            />
                            
                            {/* Avatar & Name Info */}
                            <div className="px-4 position-relative d-flex flex-column align-items-center text-center" style={{ marginTop: '-50px' }}>
                                <div className="bg-dark rounded-circle p-1 mb-3" style={{ border: '4px solid #0a0c10' }}>
                                    <FaUserCircle size={80} className="text-secondary bg-dark rounded-circle" />
                                </div>
                                
                                <div className="w-100 mb-4">
                                    <div className="d-flex flex-column align-items-center justify-content-center mb-2">
                                        <h3 className="text-white fw-bold mb-1">{userData?.name || 'Developer'}</h3>
                                        {!isEditingName && (
                                            <button 
                                                onClick={() => { setNewName(userData?.name || ''); setIsEditingName(true); }}
                                                className="btn btn-sm btn-link text-secondary p-0 text-decoration-none d-flex align-items-center gap-1 hover-primary mt-1"
                                            >
                                                <FaEdit /> Edit Profile
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-secondary small mb-0 d-flex align-items-center justify-content-center gap-2">
                                        <FaRegCalendarAlt /> Joined {formatDate(userData?.createdAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Settings List */}
                            <div className="px-4 pb-4 w-100">
                                {isEditingName && (
                                    <div className="mb-4 bg-black bg-opacity-50 p-3 rounded-3 border border-primary border-opacity-50">
                                        <label className="text-secondary small fw-bold mb-2">Display Name</label>
                                        <div className="d-flex align-items-center gap-2">
                                            <input 
                                                type="text" 
                                                className="form-control bg-dark text-white border-secondary" 
                                                value={newName} 
                                                onChange={(e) => setNewName(e.target.value)} 
                                                placeholder="Display Name"
                                                autoFocus
                                            />
                                            <button onClick={handleUpdateName} className="btn btn-success btn-sm px-3"><FaCheck /></button>
                                            <button onClick={() => setIsEditingName(false)} className="btn btn-secondary btn-sm px-3"><FaTimes /></button>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-4">
                                    <p className="text-secondary small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Account Info</p>
                                    <div className="bg-black bg-opacity-25 rounded-3 border border-secondary border-opacity-25">
                                        <div className="p-3 d-flex justify-content-between align-items-center border-bottom border-secondary border-opacity-25">
                                            <span className="text-secondary small d-flex align-items-center gap-2"><FaEnvelope /> Email</span>
                                            <span className="text-white fw-bold small text-truncate ms-2" style={{ maxWidth: '65%' }}>{userData?.email}</span>
                                        </div>
                                        <div className="p-3 d-flex justify-content-between align-items-center">
                                            <span className="text-secondary small d-flex align-items-center gap-2"><FaKey /> Password</span>
                                            <button 
                                                onClick={handlePasswordReset} 
                                                className="btn btn-sm btn-outline-secondary" 
                                                disabled={resetSent}
                                            >
                                                {resetSent ? 'Email Sent!' : 'Reset'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-secondary small fw-bold mb-2 text-uppercase" style={{ letterSpacing: '1px' }}>Quick Links</p>
                                    <div className="d-flex flex-column gap-2">
                                        <button onClick={() => navigate('/client-portal')} className="btn btn-primary d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded-3">
                                            <span className="d-flex align-items-center gap-2"><FaBriefcase /> Client Dashboard</span>
                                            <span>&rarr;</span>
                                        </button>
                                        {userData?.role === 'admin' && (
                                            <button onClick={() => navigate('/admin')} className="btn btn-outline-info d-flex justify-content-between align-items-center w-100 px-3 py-2 rounded-3">
                                                <span className="d-flex align-items-center gap-2"><FaUserCircle /> Admin Panel</span>
                                                <span>&rarr;</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-top border-secondary border-opacity-25">
                                    <div className="d-flex flex-column gap-3">
                                        <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm w-100 d-flex justify-content-center align-items-center gap-2 py-2">
                                            <FaUserCircle /> Sign Out
                                        </button>
                                        <button onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm w-100 d-flex justify-content-center align-items-center gap-2 py-2">
                                            <FaTrash /> Delete Account
                                        </button>
                                    </div>
                                </div>
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
                                <div className="text-center py-4 py-md-5">
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
