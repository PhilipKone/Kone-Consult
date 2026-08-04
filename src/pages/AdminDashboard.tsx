import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, where, getDocs, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChartLine, FaProjectDiagram, FaBriefcase, FaGraduationCap, FaUserGraduate, FaTrash, FaPlus, FaThLarge, FaList, FaBook, FaHistory, FaInfoCircle, FaRegEnvelope, FaCode, FaWallet, FaDownload, FaGamepad, FaSeedling } from 'react-icons/fa';
import { FiBookOpen } from 'react-icons/fi';
import './AdminDashboard.css';
import KonePayFinancials from '../components/admin/KonePayFinancials';
import MessageList from '../components/admin/MessageList';
import MessageView from '../components/admin/MessageView';
import LiveChatManager from '../components/admin/LiveChatManager';
import ProjectGrid from '../components/admin/ProjectGrid';
import ProjectList from '../components/admin/ProjectList';
import DocumentationList from '../components/admin/DocumentationList';
import DocumentationForm from '../components/admin/DocumentationForm';
import ServiceList from '../components/admin/ServiceList';
import TrainingList from '../components/admin/TrainingList';
import AboutList from '../components/admin/AboutList';
import KoneCodeTemplatesList from '../components/admin/KoneCodeTemplatesList';
import KoneCodeProjectsList from '../components/admin/KoneCodeProjectsList';
import UserManagementList from '../components/admin/UserManagementList';
import UserActivityList from '../components/admin/UserActivityList';
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';
import BlogManagementList from '../components/admin/BlogManagementList';
import BlogForm from '../components/admin/BlogForm';
import SubscriberList from '../components/admin/SubscriberList';
import GamificationManager from '../components/admin/GamificationManager';
import KoneFarmsManager from '../components/admin/KoneFarmsManager';
import { pillarBlogs } from '../data/pillar_blogs';

const ALLOWED_ADMINS = ['phconsultgh@gmail.com', 'philipkone45@gmail.com'];

const AdminDashboard: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<string>('messages');
    const [activeSite, setActiveSite] = useState<string>('Kone Consult');
    const [messages, setMessages] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);
    const [trainingCourses, setTrainingCourses] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [syncing, setSyncing] = useState<boolean>(false);
    const [ideActiveTab, setIdeActiveTab] = useState<string>('templates');

    // Project View State
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('All');

    // Project Form State
    const [showProjectModal, setShowProjectModal] = useState<boolean>(false);
    const [editingProject, setEditingProject] = useState<string | null>(null);
    const [projectForm, setProjectForm] = useState<any>({
        title: '',
        description: '',
        category: 'Academic & Clinical',
        image: '',
        link: '',
        github: '',
        tags: '',
        status: 'Todo',
        priority: 'Medium',
        division: ''
    });

    // Services Form State
    const [showServiceModal, setShowServiceModal] = useState<boolean>(false);
    const [editingService, setEditingService] = useState<string | null>(null);
    const [serviceForm, setServiceForm] = useState<any>({
        title: '',
        description: '',
        category: 'academic-research',
        icon: 'FaEllipsisH',
        tags: '',
        color: 'text-primary'
    });

    // Training Form State
    const [showTrainingModal, setShowTrainingModal] = useState<boolean>(false);
    const [editingTraining, setEditingTraining] = useState<string | null>(null);
    const [trainingForm, setTrainingForm] = useState<any>({
        title: '',
        division: 'Kone Academy',
        icon: 'FaGraduationCap',
        description: '',
        skills: '',
        rating: 5.0,
        reviews: 0,
        level: 'Beginner',
        duration: '1 - 2 Hours',
        colorClass: 'text-primary',
        youtubeLink: ''
    });

    // Documentation State
    const [docs, setDocs] = useState<any[]>([]);
    const [showDocsModal, setShowDocsModal] = useState<boolean>(false);
    const [editingDoc, setEditingDoc] = useState<any>(null);

    // About Form State
    const [aboutEntries, setAboutEntries] = useState<any[]>([]);
    const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
    const [editingAbout, setEditingAbout] = useState<string | null>(null);
    const [aboutForm, setAboutForm] = useState<any>({
        name: '', role: '', email: '', linkedin: '', missionTitle: '', missionText: '',
        stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '', tags: ''
    });

    // Kone Code Form State
    const [ideTemplates, setIdeTemplates] = useState<any[]>([]);
    const [ideProjects, setIdeProjects] = useState<any[]>([]);
    const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
    const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
    const [templateForm, setTemplateForm] = useState<any>({
        title: '',
        language: 'javascript',
        code: ''
    });

    // Blog State
    const [blogs, setBlogs] = useState<any[]>([]);
    const [showBlogModal, setShowBlogModal] = useState<boolean>(false);
    const [editingBlog, setEditingBlog] = useState<string | null>(null);

    // Kone Pay (Financials) State
    const [payments, setPayments] = useState<any[]>([]);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        let isSubscribed = true;
        const unsubscribes: (() => void)[] = [];

        const initDashboard = async () => {
            try {
                let isAdmin = currentUser.email ? ALLOWED_ADMINS.includes(currentUser.email) : false;
                
                if (!isAdmin) {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDoc = await getDoc(userDocRef);
                    if (userDoc.exists() && userDoc.data().role === 'admin') {
                        isAdmin = true;
                    }
                }

                if (!isSubscribed) return;

                if (!isAdmin) {
                    alert("Access Denied: Admin privileges required.");
                    navigate('/');
                    return;
                }

                if (
                    !import.meta.env.VITE_FIREBASE_API_KEY ||
                    import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key'
                ) {
                    setLoading(false);
                    return;
                }

                const unsubscribeMessages = onSnapshot(
                    query(collection(db, 'messages'), orderBy('timestamp', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                            setLoading(false);
                        }
                    }
                );
                unsubscribes.push(unsubscribeMessages);

                const unsubscribeProjects = onSnapshot(
                    query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Projects collection notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeProjects);

                const unsubscribeServices = onSnapshot(
                    query(collection(db, 'services')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Services collection notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeServices);

                const unsubscribeDocs = onSnapshot(
                    query(collection(db, 'documentation_modules'), orderBy('order', 'asc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setDocs(snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id })));
                        }
                    },
                    (error) => {
                        console.log("Docs collection notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeDocs);

                const unsubscribeTraining = onSnapshot(
                    query(collection(db, 'training_courses'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setTrainingCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Training courses notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeTraining);

                const unsubscribeReservations = onSnapshot(
                    query(collection(db, 'student_reservations'), orderBy('date', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setReservations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Student reservations notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeReservations);

                const unsubscribeAbout = onSnapshot(
                    query(collection(db, 'about_entries'), orderBy('createdAt', 'asc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setAboutEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("About entries notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeAbout);

                const unsubscribeTemplates = onSnapshot(
                    query(collection(db, 'kone_code_templates'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setIdeTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Templates notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeTemplates);

                const unsubscribeProjectsIDE = onSnapshot(
                    query(collection(db, 'kone_code_projects'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setIdeProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Public projects notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeProjectsIDE);

                const unsubscribeBlogs = onSnapshot(
                    collection(db, 'blogs'), 
                    (snapshot) => {
                        if (isSubscribed) {
                            const fetchedBlogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                            setBlogs(fetchedBlogs.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
                        }
                    }
                );
                unsubscribes.push(unsubscribeBlogs);

                const unsubscribePayments = onSnapshot(
                    query(collection(db, 'payments'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            const fetchedPayments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            setPayments(fetchedPayments);
                            const total = fetchedPayments
                                .filter((p: any) => p.status === 'success')
                                .reduce((sum: number, p: any) => sum + (Number(p.amount) || 0), 0);
                            setTotalRevenue(total);
                        }
                    },
                    (error) => {
                        console.log("Payments collection notice:", error);
                    }
                );
                unsubscribes.push(unsubscribePayments);

                const unsubscribeInvoices = onSnapshot(
                    query(collection(db, 'invoices'), orderBy('createdAt', 'desc')),
                    (snapshot) => {
                        if (isSubscribed) {
                            setInvoices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                        }
                    },
                    (error) => {
                        console.log("Invoices collection notice:", error);
                    }
                );
                unsubscribes.push(unsubscribeInvoices);

            } catch (error) {
                console.error("Error checking admin status:", error);
                if (isSubscribed) {
                    alert("Verification error: Unable to confirm admin status.");
                    navigate('/');
                }
            }
        };

        initDashboard();

        const timer = setTimeout(() => {
            if (isSubscribed) {
                setLoading(false);
            }
        }, 5000);

        return () => {
            isSubscribed = false;
            clearTimeout(timer);
            unsubscribes.forEach(unsub => unsub());
        };
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!currentUser) return;

        const unsubscribeSubscribers = onSnapshot(
            query(collection(db, 'subscribers'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        const unsubscribeUsers = onSnapshot(
            collection(db, 'users'),
            (snapshot) => {
                setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        return () => {
            unsubscribeSubscribers();
            unsubscribeUsers();
        };
    }, [currentUser]);

    const handleDeleteReservation = async (resId: string) => {
        if (!window.confirm("Are you sure you want to delete this student reservation?")) return;
        try {
            await deleteDoc(doc(db, 'student_reservations', resId));
        } catch (err) {
            console.error("Failed to delete reservation:", err);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const markAsRead = async (id: string, currentStatus: string) => {
        if (currentStatus === 'read') return;
        await updateDoc(doc(db, 'messages', id), {
            status: 'read',
            read: true
        });
    };

    const deleteMessage = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteDoc(doc(db, 'messages', id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        }
    };

    const deleteProject = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteDoc(doc(db, 'projects', id));
        }
    };

    const deleteService = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteDoc(doc(db, 'services', id));
            } catch (error) {
                console.error("Error deleting service:", error);
                alert("Failed to delete service.");
            }
        }
    };

    const deleteTraining = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteDoc(doc(db, 'training_courses', id));
        }
    };

    if (loading) return (
        <div className="d-flex align-items-center justify-content-center loading-container">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );

    return (
        <div className="page-container admin-dashboard-page">
            <div className="container-fluid dashboard-container">
                {/* Header */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-4 border-bottom border-dark gap-3">
                    <div>
                        <h2 className="text-white fw-bold mb-1">Dashboard</h2>
                        <p className="text-secondary mb-0 small">Overview of your platform activities.</p>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary small fw-bold text-uppercase d-none d-md-block">Managing:</span>
                            <select
                                className="form-select-dark bg-dark text-white border-secondary rounded-pill fw-bold"
                                style={{ width: 'auto', padding: '0.35rem 2rem 0.35rem 1.25rem' }}
                                value={activeSite}
                                onChange={(e) => setActiveSite(e.target.value)}
                            >
                                <option value="Kone Academy">Kone Academy</option>
                                <option value="Kone Consult">Kone Consult</option>
                                <option value="Kone Code">Kone Code</option>
                                <option value="Kone Lab">Kone Lab</option>
                            </select>
                        </div>
                        <button onClick={handleLogout} className="btn btn-outline-danger btn-sm px-3 rounded-pill h-100">
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="nav-tabs-glass hide-scrollbar overflow-auto mb-4">
                    <button onClick={() => setActiveTab('messages')} className={`tab-btn-premium ${activeTab === 'messages' ? 'active' : ''}`}>
                        <FaRegEnvelope className="me-2" /> Messages
                    </button>
                    <button onClick={() => setActiveTab('live-chat')} className={`tab-btn-premium ${activeTab === 'live-chat' ? 'active' : ''}`}>
                        <FaRegEnvelope className="me-2" /> Live Chat
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`tab-btn-premium ${activeTab === 'users' ? 'active' : ''}`}>
                        <FaUsers className="me-2" /> Users
                    </button>
                    <button onClick={() => setActiveTab('analytics')} className={`tab-btn-premium ${activeTab === 'analytics' ? 'active' : ''}`}>
                        <FaChartLine className="me-2" /> Analytics
                    </button>
                    <button onClick={() => setActiveTab('financials')} className={`tab-btn-premium ${activeTab === 'financials' ? 'active' : ''}`} style={activeTab === 'financials' ? { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)' } : {}}>
                        <FaWallet className="me-2" /> Kone Pay
                    </button>
                </div>

                {/* Main Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'messages' && (
                            <div className="row g-0 border rounded border-dark overflow-hidden messages-layout flex-column flex-lg-row">
                                <MessageList
                                    messages={messages}
                                    selectedMessage={selectedMessage}
                                    onSelect={setSelectedMessage}
                                    markAsRead={markAsRead}
                                />
                                <MessageView
                                    message={selectedMessage}
                                    onDelete={deleteMessage}
                                />
                            </div>
                        )}

                        {activeTab === 'live-chat' && <LiveChatManager />}
                        {activeTab === 'users' && <UserManagementList />}
                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard 
                                messages={messages}
                                projects={projects}
                                blogs={blogs}
                            />
                        )}
                        {activeTab === 'financials' && (
                            <KonePayFinancials 
                                payments={payments}
                                totalRevenue={totalRevenue}
                                activeSite={activeSite}
                                invoices={invoices}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
