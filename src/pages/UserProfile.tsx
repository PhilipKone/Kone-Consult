import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/config';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
    FaUserCircle, FaCode, FaRegCalendarAlt, FaEnvelope, FaExclamationCircle, 
    FaFlask, FaEdit, FaKey, FaTrash, FaCheck, FaTimes, FaBriefcase, 
    FaCheckCircle, FaAward, FaShieldAlt, FaLaptopCode, FaMapMarkerAlt, FaGraduationCap
} from 'react-icons/fa';
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
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState('');
    const [resetSent, setResetSent] = useState(false);
    const ADMIN_EMAILS = ['philipkone45@gmail.com', 'phconsultgh@gmail.com'];

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (
            !import.meta.env.VITE_FIREBASE_API_KEY ||
            import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key'
        ) {
            setUserData({
                name: currentUser.displayName || 'Developer',
                email: currentUser.email,
                role: 'user',
                createdAt: currentUser.metadata.creationTime
            });
            setSavedProjects([]);
            setMyEnrollments([]);
            setLoading(false);
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
                projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setSavedProjects(projects);

                // Fetch User's Kone Academy Cohort Enrollments
                if (currentUser.email) {
                    const resQ = query(
                        collection(db, 'student_reservations'),
                        where('email', '==', currentUser.email)
                    );
                    const resSnap = await getDocs(resQ);
                    const enrollments = resSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setMyEnrollments(enrollments);
                }

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

    const [activeProfileTab, setActiveProfileTab] = useState('enrollments');

    if (loading) {
        return (
            <div className="page-container d-flex justify-content-center align-items-center">
                <span className="spinner-border text-primary"></span>
            </div>
        );
    }

    const isAdmin = currentUser?.email && ADMIN_EMAILS.includes(currentUser.email.toLowerCase().trim());
    const usernameHandle = `@${(userData?.name || 'developer').toLowerCase().replace(/\s+/g, '')}`;

    return (
        <div className="page-container" style={{ minHeight: '100vh', background: '#060913' }}>
            <div className="page-background-glow" />

            <div className="container py-4 py-md-5" style={{ marginTop: '70px', position: 'relative', zIndex: 10 }}>
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

                    {/* Social Media Cover & Profile Header */}
                    <div className="glass-card overflow-hidden mb-4 p-0" style={{ borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        
                        {/* Cover Banner */}
                        <div 
                            style={{ 
                                height: '160px', 
                                background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(189, 0, 255, 0.3) 50%, rgba(6, 9, 19, 1) 100%)',
                                position: 'relative'
                            }} 
                        >
                            <div className="position-absolute top-0 end-0 p-3 d-flex gap-2">
                                <a href="https://www.koneacademy.io/training" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-light rounded-pill px-3 fw-bold bg-dark bg-opacity-50">
                                    Explore Academy
                                </a>
                                {isAdmin && (
                                    <button onClick={() => navigate('/admin')} className="btn btn-sm btn-info rounded-pill px-3 fw-bold">
                                        Admin Panel
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Profile Info Header */}
                        <div className="px-4 pb-4 position-relative">
                            <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end justify-content-between gap-3" style={{ marginTop: '-60px' }}>
                                
                                {/* Avatar & Title */}
                                <div className="d-flex flex-column flex-md-row align-items-center align-items-md-end gap-3 text-center text-md-start">
                                    <div className="position-relative">
                                        <div className="bg-dark rounded-circle p-1" style={{ border: '4px solid #060913', width: '110px', height: '110px' }}>
                                            <FaUserCircle size={102} className="text-secondary bg-dark rounded-circle" />
                                        </div>
                                        <span className="position-absolute bottom-0 end-0 text-cyan bg-dark rounded-circle p-1" title="Verified Fellow" style={{ border: '2px solid #060913' }}>
                                            <FaCheckCircle size={20} />
                                        </span>
                                    </div>

                                    <div className="mb-1">
                                        <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-2">
                                            <h2 className="h3 text-white fw-bold mb-0">{userData?.name || 'Developer'}</h2>
                                            <span className="badge bg-primary bg-opacity-20 text-cyan border border-cyan border-opacity-30 rounded-pill small">
                                                {isAdmin ? 'Core Admin' : 'Academy Fellow'}
                                            </span>
                                        </div>
                                        <p className="text-secondary small mb-1">{usernameHandle} • Software Engineer</p>
                                        <div className="d-flex flex-wrap justify-content-center justify-content-md-start gap-3 extra-small text-secondary">
                                            <span><FaMapMarkerAlt className="text-info me-1" /> Accra, Ghana</span>
                                            <span><FaRegCalendarAlt className="text-info me-1" /> Joined {formatDate(userData?.createdAt)}</span>
                                            <span><FaShieldAlt className="text-cyan me-1" /> ID Verified</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={() => { setNewName(userData?.name || ''); setIsEditingName(true); setActiveProfileTab('settings'); }}
                                        className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                                    >
                                        <FaEdit size={12} /> Edit Profile
                                    </button>
                                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm rounded-pill px-3">
                                        Sign Out
                                    </button>
                                </div>
                            </div>

                            {/* Social Stat Counter Bar */}
                            <div className="row g-2 mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
                                <div className="col-3">
                                    <div className="h5 text-white fw-bold mb-0">{myEnrollments.length}</div>
                                    <div className="extra-small text-secondary text-uppercase">Cohort Tracks</div>
                                </div>
                                <div className="col-3">
                                    <div className="h5 text-cyan fw-bold mb-0">{savedProjects.length}</div>
                                    <div className="extra-small text-secondary text-uppercase">Saved Projects</div>
                                </div>
                                <div className="col-3">
                                    <div className="h5 text-primary fw-bold mb-0">{myEnrollments.filter(e => e.token).length}</div>
                                    <div className="extra-small text-secondary text-uppercase">Seat Tokens</div>
                                </div>
                                <div className="col-3">
                                    <div className="h5 text-warning fw-bold mb-0">1,250</div>
                                    <div className="extra-small text-secondary text-uppercase">Kone XP</div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Social Feed Navigation Tabs */}
                    <div className="d-flex gap-2 mb-4 overflow-auto pb-1">
                        <button
                            onClick={() => setActiveProfileTab('enrollments')}
                            className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeProfileTab === 'enrollments' ? 'btn-cyan text-dark shadow-cyan' : 'btn-outline-secondary text-light'}`}
                        >
                            <FaGraduationCap className="me-2" /> Cohorts & Seats ({myEnrollments.length})
                        </button>
                        <button
                            onClick={() => setActiveProfileTab('code')}
                            className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeProfileTab === 'code' ? 'btn-cyan text-dark shadow-cyan' : 'btn-outline-secondary text-light'}`}
                        >
                            <FaCode className="me-2" /> Code Snippets ({savedProjects.length})
                        </button>
                        <button
                            onClick={() => setActiveProfileTab('badges')}
                            className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeProfileTab === 'badges' ? 'btn-cyan text-dark shadow-cyan' : 'btn-outline-secondary text-light'}`}
                        >
                            <FaAward className="me-2" /> Badges & XP
                        </button>
                        <button
                            onClick={() => setActiveProfileTab('settings')}
                            className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${activeProfileTab === 'settings' ? 'btn-cyan text-dark shadow-cyan' : 'btn-outline-secondary text-light'}`}
                        >
                            <FaKey className="me-2" /> Account Settings
                        </button>
                    </div>

                    {/* TAB CONTENT 1: COHORTS & SEAT RESERVATIONS */}
                    {activeProfileTab === 'enrollments' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary pb-3">
                                <div>
                                    <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                                        <FaGraduationCap className="text-cyan" /> Reserved Cohort Seats
                                    </h4>
                                    <p className="text-secondary small mb-0">Your active 12-week intensive engineering tracks at Kone Academy.</p>
                                </div>
                                <a href="https://www.koneacademy.io/training" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                                    + Enroll in Track
                                </a>
                            </div>

                            {myEnrollments.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaGraduationCap size={48} className="text-secondary mb-3 opacity-50" />
                                    <h5 className="text-white">No Cohort Seats Reserved Yet</h5>
                                    <p className="text-secondary small mb-3">Browse our 12 engineering tracks and reserve your seat in the next cohort.</p>
                                    <a href="https://www.koneacademy.io/training" target="_blank" rel="noreferrer" className="btn btn-cyan text-dark fw-bold rounded-pill px-4">
                                        View Training Hub
                                    </a>
                                </div>
                            ) : (
                                <div className="d-flex flex-column gap-3">
                                    {myEnrollments.map(enr => (
                                        <div key={enr.id} className="p-3.5 rounded-4 bg-dark bg-opacity-60 border border-secondary border-opacity-30 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 hover-border-cyan">
                                            <div>
                                                <div className="d-flex align-items-center gap-2 mb-1">
                                                    <span className="badge bg-cyan text-dark fw-bold">{enr.division || 'Academy'}</span>
                                                    <span className="extra-small text-secondary">{enr.format}</span>
                                                </div>
                                                <h5 className="text-white fw-bold mb-1">{enr.track}</h5>
                                                <div className="text-secondary small">
                                                    <FaRegCalendarAlt className="me-1" /> Reserved: {new Date(enr.date || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column align-items-md-end gap-1">
                                                <code className="text-cyan fw-bold bg-black px-3 py-1.5 rounded-3 border border-secondary border-opacity-30 small">{enr.token}</code>
                                                <a href={`https://www.koneacademy.io/verify?id=${enr.token}`} target="_blank" rel="noreferrer" className="extra-small text-info text-decoration-none hover-underline mt-1">
                                                    Verify Seat Token &rarr;
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* TAB CONTENT 2: SAVED CODE & PROJECTS */}
                    {activeProfileTab === 'code' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                            <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary pb-3">
                                <div>
                                    <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                                        <FaCode className="text-cyan" /> My Saved Code Snippets
                                    </h4>
                                    <p className="text-secondary small mb-0">Projects saved from Kone Code IDE and Kone Lab Workstations.</p>
                                </div>
                                <div className="d-flex gap-2">
                                    <a href="https://lab.koneacademy.io" target="_blank" rel="noreferrer" className="btn btn-outline-info btn-sm rounded-pill px-3 fw-bold">
                                        <FaFlask className="me-1" /> Launch Lab
                                    </a>
                                    <a href="https://code.koneacademy.io/#/ide" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm rounded-pill px-3 fw-bold">
                                        <FaCode className="me-1" /> Open IDE
                                    </a>
                                </div>
                            </div>

                            {savedProjects.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaExclamationCircle size={48} className="text-secondary mb-3 opacity-50" />
                                    <h5 className="text-white">No Saved Projects Yet</h5>
                                    <p className="text-secondary small mb-3">Open the Kone Code IDE to write, build, and save your micro-projects.</p>
                                    <a href="https://code.koneacademy.io/#/ide" target="_blank" rel="noreferrer" className="btn btn-primary rounded-pill px-4 fw-bold">
                                        Launch Kone Code IDE
                                    </a>
                                </div>
                            ) : (
                                <div className="row g-3">
                                    {savedProjects.map(project => (
                                        <div key={project.id} className="col-12 col-md-6">
                                            <div className="card bg-dark border-secondary h-100 p-3 rounded-4 hover-scale-sm" style={{ cursor: 'pointer' }} onClick={() => window.open(`https://code.koneacademy.io/#/ide?project=${project.id}`, '_blank')}>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h5 className="card-title text-white flex-grow-1 me-2 text-truncate mb-0">{project.title || 'Untitled Snippet'}</h5>
                                                    <span className="badge bg-cyan text-dark font-monospace">{project.language}</span>
                                                </div>
                                                <p className="card-text text-secondary small mb-2">
                                                    Updated: {formatDate(project.updatedAt)}
                                                </p>
                                                <pre className="bg-black bg-opacity-70 p-2.5 rounded-3 text-secondary font-monospace" style={{ fontSize: '0.75rem', maxHeight: '70px', overflow: 'hidden' }}>
                                                    {project.code.substring(0, 120)}...
                                                </pre>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* TAB CONTENT 3: BADGES & CERTIFICATIONS */}
                    {activeProfileTab === 'badges' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                            <div className="border-bottom border-secondary pb-3 mb-4">
                                <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaAward className="text-warning" /> Verified Badges & XP Achievements
                                </h4>
                                <p className="text-secondary small mb-0">Credentials earned across Kone Academy engineering tracks.</p>
                            </div>

                            <div className="row g-3">
                                <div className="col-12 col-md-4">
                                    <div className="p-3.5 rounded-4 bg-dark bg-opacity-60 border border-info border-opacity-30 text-center">
                                        <div className="mb-2 text-info"><FaShieldAlt size={36} /></div>
                                        <h6 className="text-white fw-bold mb-1">Kone Academy Scholar</h6>
                                        <span className="badge bg-info bg-opacity-20 text-info border border-info rounded-pill extra-small mb-2">Active Member</span>
                                        <p className="text-secondary extra-small mb-0">Verified identity and registered participant in 2026 cohort ecosystem.</p>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div className="p-3.5 rounded-4 bg-dark bg-opacity-60 border border-warning border-opacity-30 text-center">
                                        <div className="mb-2 text-warning"><FaAward size={36} /></div>
                                        <h6 className="text-white fw-bold mb-1">Fintech Architecture Fellow</h6>
                                        <span className="badge bg-warning bg-opacity-20 text-warning border border-warning rounded-pill extra-small mb-2">1,000 XP</span>
                                        <p className="text-secondary extra-small mb-0">Completed ledger architecture & payment gateway security module.</p>
                                    </div>
                                </div>

                                <div className="col-12 col-md-4">
                                    <div className="p-3.5 rounded-4 bg-dark bg-opacity-60 border border-cyan border-opacity-30 text-center">
                                        <div className="mb-2 text-cyan"><FaLaptopCode size={36} /></div>
                                        <h6 className="text-white fw-bold mb-1">IDE Micro-Project Builder</h6>
                                        <span className="badge bg-cyan bg-opacity-20 text-cyan border border-cyan rounded-pill extra-small mb-2">250 XP</span>
                                        <p className="text-secondary extra-small mb-0">Built and saved real-world code snippets in Kone Code workstation.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* TAB CONTENT 4: ACCOUNT SETTINGS */}
                    {activeProfileTab === 'settings' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4">
                            <div className="border-bottom border-secondary pb-3 mb-4">
                                <h4 className="text-white fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaKey className="text-cyan" /> Account Settings & Credentials
                                </h4>
                                <p className="text-secondary small mb-0">Manage your profile name, security credentials, and quick access links.</p>
                            </div>

                            {/* Name Editing Form */}
                            {isEditingName && (
                                <div className="mb-4 bg-dark p-3.5 rounded-4 border border-cyan border-opacity-40">
                                    <label className="text-cyan small fw-bold mb-2">Update Display Name</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input 
                                            type="text" 
                                            className="form-control bg-black text-white border-secondary" 
                                            value={newName} 
                                            onChange={(e) => setNewName(e.target.value)} 
                                            placeholder="Full Display Name"
                                            autoFocus
                                        />
                                        <button onClick={handleUpdateName} className="btn btn-cyan text-dark btn-sm px-3 fw-bold"><FaCheck /></button>
                                        <button onClick={() => setIsEditingName(false)} className="btn btn-outline-secondary btn-sm px-3"><FaTimes /></button>
                                    </div>
                                </div>
                            )}

                            <div className="row g-4">
                                <div className="col-12 col-md-6">
                                    <h6 className="text-white fw-bold mb-3">Security & Auth</h6>
                                    <div className="bg-dark rounded-4 p-3 border border-secondary border-opacity-25 d-flex flex-column gap-3">
                                        <div className="d-flex justify-content-between align-items-center pb-2 border-bottom border-secondary border-opacity-20">
                                            <span className="text-secondary small"><FaEnvelope className="me-2" /> Email Address</span>
                                            <span className="text-white fw-bold small text-truncate" style={{ maxWidth: '60%' }}>{userData?.email}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <span className="text-secondary small"><FaKey className="me-2" /> Password</span>
                                            <button 
                                                onClick={handlePasswordReset} 
                                                className="btn btn-sm btn-outline-secondary rounded-pill px-3" 
                                                disabled={resetSent}
                                            >
                                                {resetSent ? 'Reset Sent!' : 'Send Reset Email'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12 col-md-6">
                                    <h6 className="text-white fw-bold mb-3">Ecosystem Access</h6>
                                    <div className="d-flex flex-column gap-2">
                                        <button onClick={() => navigate('/client-portal')} className="btn btn-outline-light d-flex justify-content-between align-items-center w-100 p-3 rounded-4">
                                            <span className="d-flex align-items-center gap-2"><FaBriefcase /> Client Dashboard</span>
                                            <span>&rarr;</span>
                                        </button>
                                        {isAdmin && (
                                            <button onClick={() => navigate('/admin')} className="btn btn-outline-info d-flex justify-content-between align-items-center w-100 p-3 rounded-4">
                                                <span className="d-flex align-items-center gap-2"><FaUserCircle /> Master Admin Panel</span>
                                                <span>&rarr;</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row gap-3 justify-content-between">
                                <button onClick={handleLogout} className="btn btn-outline-secondary btn-sm rounded-pill px-4 py-2">
                                    Sign Out
                                </button>
                                <button onClick={handleDeleteAccount} className="btn btn-outline-danger btn-sm rounded-pill px-4 py-2">
                                    <FaTrash className="me-1" /> Delete Account
                                </button>
                            </div>
                        </motion.div>
                    )}

                </motion.div>
            </div>
        </div>
    );
};

export default UserProfile;
