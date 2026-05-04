import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaChartLine, FaProjectDiagram, FaBriefcase, FaGraduationCap, FaPlus, FaThLarge, FaList, FaBook, FaHistory, FaInfoCircle, FaRegEnvelope, FaCode, FaWallet, FaMoneyBillWave, FaDownload } from 'react-icons/fa';
import { FiBookOpen } from 'react-icons/fi';
import './AdminDashboard.css';
import KonePayFinancials from '../components/admin/KonePayFinancials';
// import Sidebar from '../components/admin/Sidebar';
import MessageList from '../components/admin/MessageList';
import MessageView from '../components/admin/MessageView';
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
import { pillarBlogs } from '../data/pillar_blogs';
// Initial Data Seed
const initialServices = [
    { icon: 'FaChartBar', title: "Data Analysis", description: "Transform raw data into actionable insights using advanced statistical methods and visualization tools.", tags: ["SPSS", "Python", "R", "Excel"], color: "text-primary" },
    { icon: 'FaFileAlt', title: "Report Writing", description: "Professional, academic, and technical report writing services tailored to your specific requirements.", tags: ["Academic", "Technical", "Business"], color: "text-success" },
    { icon: 'FaChalkboardTeacher', title: "Research Consulting", description: "End-to-end research support from methodology design to data collection and final analysis.", tags: ["Methodology", "Survey Design", "Analysis"], color: "text-warning" },
    { icon: 'FaLightbulb', title: "Topic Selection", description: "Guidance on selecting viable, impactful, and researchable topics for your thesis or project.", tags: ["Ideation", "Feasibility", "Scope"], color: "text-info" },
    { icon: 'FaUserTie', title: "Mentorship", description: "One-on-one mentorship sessions to guide you through your academic or professional research journey.", tags: ["Coaching", "Guidance", "Support"], color: "text-danger" },
    { icon: 'FaEllipsisH', title: "Other Services", description: "Custom solutions for unique research challenges. Contact us to discuss your specific needs.", tags: ["Custom", "Flexible", "Tailored"], color: "text-secondary" }
];

const initialTrainingCourses = [
    {
        title: 'Fundamentals of Kone Academy',
        division: 'Kone Academy',
        icon: 'FaGraduationCap',
        description: "Your complete onboarding journey to mastering the interconnected Kone Academy ecosystem: Consult, Code, and Lab.",
        skills: ['Ecosystem Onboarding', 'Architecture', 'Navigation'],
        rating: 4.9,
        reviews: 128,
        level: 'Beginner',
        duration: '1 - 2 Hours',
        colorClass: 'text-primary',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Fundamentals of Kone Consult',
        division: 'Kone Consult',
        icon: 'FaChartBar',
        description: "Master open peer review methodologies, scientific literature analysis, and our rigorous documentation standards.",
        skills: ['Peer Review', 'Methodologies', 'Documentation'],
        rating: 4.8,
        reviews: 342,
        level: 'Beginner',
        duration: '2 - 3 Weeks',
        colorClass: 'text-purple',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Fundamentals of Kone Code',
        division: 'Kone Code',
        icon: 'FaCode',
        description: "Build a strong foundation in Python scripting, web development architectures, and intelligent Git version control.",
        skills: ['Python', 'Web Dev', 'Git Control'],
        rating: 4.7,
        reviews: 89,
        level: 'Intermediate',
        duration: '4 - 6 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Python for Data & AI',
        division: 'Kone Code',
        icon: 'SiPython',
        description: 'Master Python for data science, machine learning, and automation.',
        skills: ['Python', 'Data Science', 'ML'],
        rating: 4.9,
        reviews: 156,
        level: 'All Levels',
        duration: '6 - 10 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Modern JavaScript',
        division: 'Kone Code',
        icon: 'SiJavascript',
        description: 'Build dynamic web applications with modern ES6+ standards.',
        skills: ['ES6+', 'React', 'Async'],
        rating: 4.8,
        reviews: 94,
        level: 'Beginner to Advanced',
        duration: '5 - 8 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'C / C++ Programming',
        division: 'Kone Code',
        icon: 'SiCplusplus',
        description: 'System-level programming, game development, and high-performance apps.',
        skills: ['C++', 'Memory Mgmt', 'OOP'],
        rating: 4.7,
        reviews: 42,
        level: 'Intermediate',
        duration: '8 - 12 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'R for Statistics',
        division: 'Kone Code',
        icon: 'SiR',
        description: 'Statistical analysis, data visualization, and academic research.',
        skills: ['R', 'Statistics', 'ggplot2'],
        rating: 4.8,
        reviews: 31,
        level: 'Intermediate',
        duration: '4 - 6 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'MATLAB & Simulink',
        division: 'Kone Code',
        icon: 'FaLaptopCode',
        description: 'Numerical computing for engineering and scientific applications.',
        skills: ['MATLAB', 'Simulink', 'Matrices'],
        rating: 4.9,
        reviews: 28,
        level: 'Advanced',
        duration: '6 - 8 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Excel VBA',
        division: 'Kone Code',
        icon: 'FaFileExcel',
        description: 'Automate spreadsheets and business processes with Visual Basic.',
        skills: ['Excel', 'VBA', 'Automation'],
        rating: 4.7,
        reviews: 65,
        level: 'Beginner',
        duration: '3 - 5 Weeks',
        colorClass: 'text-success',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Fundamentals of Kone Lab',
        division: 'Kone Lab',
        icon: 'FaFlask',
        description: "Dive deep into hardware integrations, experimental AI model deployment, and high-frequency sensor calibration workflows.",
        skills: ['Hardware Integration', 'AI Models', 'Sensors'],
        rating: 4.9,
        reviews: 45,
        level: 'Advanced',
        duration: '1 - 2 Months',
        colorClass: 'text-info',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Robotics & Automation',
        division: 'Kone Lab',
        icon: 'FaCogs',
        description: 'Arduino, precision motor control, and sensor integration.',
        skills: ['Arduino', 'Motor Control', 'Sensors'],
        rating: 4.8,
        reviews: 67,
        level: 'Physical Engineering',
        duration: '4 - 8 Weeks',
        colorClass: 'text-info',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: '3D Prototyping',
        division: 'Kone Lab',
        icon: 'FaCube',
        description: 'Fusion 360 mastery and advanced additive manufacturing.',
        skills: ['CAD', 'Fusion 360', '3D Printing'],
        rating: 4.9,
        reviews: 52,
        level: 'Fabrication',
        duration: '3 - 5 Weeks',
        colorClass: 'text-info',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    },
    {
        title: 'Embedded Systems',
        division: 'Kone Lab',
        icon: 'FaMicrochip',
        description: 'PCB design, soldering, and low-level firmware coding.',
        skills: ['PCB Design', 'Soldering', 'Firmware'],
        rating: 4.7,
        reviews: 38,
        level: 'Circuit Design',
        duration: '6 - 9 Weeks',
        colorClass: 'text-info',
        youtubeLink: 'https://www.youtube.com/@KoneAcademy'
    }
];
const ALLOWED_ADMINS = ['phconsultgh@gmail.com', 'philipkone45@gmail.com'];

const AdminDashboard = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('messages');
    const [activeSite, setActiveSite] = useState('Kone Consult');
    const [messages, setMessages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [trainingCourses, setTrainingCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [subscribers, setSubscribers] = useState([]);
    const [users, setUsers] = useState([]);
    const [syncing, setSyncing] = useState(false);
    const [ideActiveTab, setIdeActiveTab] = useState('templates'); // 'templates', 'projects', 'docs'

    // Project View State
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Project Form State
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null); // ID of project being edited
    const [projectForm, setProjectForm] = useState({
        title: '',
        description: '',
        category: 'App Development', // Default category
        image: '', // URL
        link: '', // Live URL
        github: '',
        tags: '', // Comma separated
        status: 'Todo', // Todo, In Progress, Done
        priority: 'Medium' // Low, Medium, High
    });

    // Services Form State
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        title: '',
        description: '',
        category: 'academic-research',
        icon: 'FaEllipsisH',
        tags: '',
        color: 'text-primary'
    });

    // Training Form State
    const [showTrainingModal, setShowTrainingModal] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);
    const [trainingForm, setTrainingForm] = useState({
        title: '',
        division: 'Kone Academy',
        icon: 'FaGraduationCap',
        description: '',
        skills: '', // comma separated string
        rating: 5.0,
        reviews: 0,
        level: 'Beginner',
        duration: '1 - 2 Hours',
        colorClass: 'text-primary',
        youtubeLink: ''
    });





    // Documentation State
    const [docs, setDocs] = useState([]);
    const [showDocsModal, setShowDocsModal] = useState(false);
    const [editingDoc, setEditingDoc] = useState(null);

    // About Form State
    const [aboutEntries, setAboutEntries] = useState([]);
    const [showAboutModal, setShowAboutModal] = useState(false);
    const [editingAbout, setEditingAbout] = useState(null);
    const [aboutForm, setAboutForm] = useState({
        name: '',
        role: '',
        email: '',
        linkedin: '',
        missionTitle: '',
        missionText: '',
        stat1Value: '', stat1Label: '',
        stat2Value: '', stat2Label: '',
        stat3Value: '', stat3Label: '',
        tags: ''
    });

    // Kone Code Form State
    const [ideTemplates, setIdeTemplates] = useState([]);
    const [ideProjects, setIdeProjects] = useState([]);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [templateForm, setTemplateForm] = useState({
        title: '',
        language: 'javascript',
        code: ''
    });

    // Blog State
    const [blogs, setBlogs] = useState([]);
    const [showBlogModal, setShowBlogModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    // Kone Pay (Financials) State
    const [payments, setPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }

        if (!ALLOWED_ADMINS.includes(currentUser.email)) {
            alert("Access Denied: Admin privileges required.");
            navigate('/');
            return;
        }

        const unsubscribeMessages = onSnapshot(
            query(collection(db, 'messages'), orderBy('timestamp', 'desc')),
            (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            }
        );

        const unsubscribeProjects = onSnapshot(
            query(collection(db, 'projects'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("Projects collection might not exist yet or empty", error);
            }
        );

        // Subscribe to Services
        const unsubscribeServices = onSnapshot(
            query(collection(db, 'services')),
            (snapshot) => {
                setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("Services collection might not exist yet or empty", error);
            }
        );

        // Subscribe to Documentation
        const unsubscribeDocs = onSnapshot(
            query(collection(db, 'documentation_modules'), orderBy('order', 'asc')),
            (snapshot) => {
                setDocs(snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id })));
            },
            (error) => {
                console.log("Documentation collection might not exist yet", error);
            }
        );

        // Subscribe to Training
        const unsubscribeTraining = onSnapshot(
            query(collection(db, 'training_courses'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setTrainingCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("Training courses collection empty", error);
            }
        );

        // Subscribe to About Entries
        const unsubscribeAbout = onSnapshot(
            query(collection(db, 'about_entries'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                setAboutEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("About entries collection empty", error);
            }
        );

        // Subscribe to Kone Code Templates
        const unsubscribeTemplates = onSnapshot(
            query(collection(db, 'kone_code_templates'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setIdeTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("Templates collection empty", error);
            }
        );

        // Subscribe to Kone Code Public Projects
        const unsubscribeProjectsIDE = onSnapshot(
            query(collection(db, 'kone_code_projects'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setIdeProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => {
                console.log("Public projects collection empty", error);
            }
        );

        // Subscribe to Blogs
        const unsubscribeBlogs = onSnapshot(
            collection(db, 'blogs'), 
            (snapshot) => {
                const fetchedBlogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setBlogs(fetchedBlogs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
            }
        );

        // Subscribe to Payments (Kone Pay)
        const unsubscribePayments = onSnapshot(
            query(collection(db, 'payments'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                const fetchedPayments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPayments(fetchedPayments);
                const total = fetchedPayments
                    .filter(p => p.status === 'success')
                    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
                setTotalRevenue(total);
            },
            (error) => {
                console.log("Payments collection might not exist yet", error);
            }
        );

        // Safety timeout for loading state
        const timer = setTimeout(() => {
            setLoading(false);
        }, 5000);

        return () => {
            clearTimeout(timer);
            unsubscribeMessages();
            unsubscribeProjects();
            unsubscribeServices();
            unsubscribeDocs();
            unsubscribeTraining();
            unsubscribeAbout();
            unsubscribeTemplates();
            unsubscribeProjectsIDE();
            unsubscribeBlogs();
            unsubscribePayments();
        };
    }, [currentUser, navigate]);

    useEffect(() => {
        if (!currentUser) return;

        // Subscribe to Subscribers
        const unsubscribeSubscribers = onSnapshot(
            query(collection(db, 'subscribers'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setSubscribers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            }
        );

        // Subscribe to Users
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

    const handleSyncUsers = async () => {
        if (!window.confirm('Are you sure you want to sync all existing users to the newsletter? This will only add missing emails.')) return;
        
        setSyncing(true);
        let count = 0;
        try {
            const existingEmails = new Set(subscribers.map(s => s.email?.toLowerCase()));
            
            for (const user of users) {
                if (user.email && !existingEmails.has(user.email.toLowerCase())) {
                    await addDoc(collection(db, 'subscribers'), {
                        email: user.email,
                        name: user.name || 'User',
                        source: 'admin-sync',
                        createdAt: serverTimestamp()
                    });
                    count++;
                }
            }
            alert(`Discovery complete! Added ${count} new subscribers.`);
        } catch (error) {
            console.error("Sync error:", error);
            alert("Sync failed. Check console for details.");
        } finally {
            setSyncing(false);
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

    // --- Seeding Services ---
    const handleSeedServices = async () => {
        if (window.confirm('Are you sure you want to seed the initial services? This should only be done once.')) {
            try {
                for (const service of initialServices) {
                    await addDoc(collection(db, 'services'), {
                        ...service,
                        createdAt: serverTimestamp()
                    });
                }
                alert('Services seeded successfully!');
            } catch (error) {
                console.error("Error seeding services: ", error);
                alert("Failed to seed services.");
            }
        }
    };

    const handleSeedCourses = async () => {
        if (window.confirm('Are you sure you want to seed the initial training courses? This should only be done once.')) {
            try {
                for (const course of initialTrainingCourses) {
                    await addDoc(collection(db, 'training_courses'), {
                        ...course,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    });
                }
                alert('Training courses seeded successfully!');
            } catch (error) {
                console.error("Error seeding courses: ", error);
                alert("Failed to seed training courses.");
            }
        }
    };

    const markAsRead = async (id, currentStatus) => {
        if (currentStatus === 'read') return;
        await updateDoc(doc(db, 'messages', id), {
            status: 'read',
            read: true
        });
    };

    const deleteMessage = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            await deleteDoc(doc(db, 'messages', id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
        }
    };

    // Project Handlers
    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        try {
            const projectData = {
                ...projectForm,
                tags: typeof projectForm.tags === 'string' ? projectForm.tags.split(',').map(tag => tag.trim()) : projectForm.tags,
                updatedAt: serverTimestamp()
            };

            if (editingProject) {
                // Update existing
                await updateDoc(doc(db, 'projects', editingProject), projectData);
                alert('Project updated successfully!');
            } else {
                // Create new
                await addDoc(collection(db, 'projects'), {
                    ...projectData,
                    createdAt: serverTimestamp()
                });
                alert('Project added successfully!');
            }

            setShowProjectModal(false);
            setEditingProject(null);
            setProjectForm({
                title: '',
                description: '',
                category: 'App Development',
                image: '',
                link: '',
                github: '',
                tags: '',
                status: 'Todo',
                priority: 'Medium'
            });
        } catch (error) {
            console.error("Error saving project:", error);
            alert('Failed to save project.');
        }
    };

    const handleEditProject = (project) => {
        setEditingProject(project.id);
        setProjectForm({
            title: project.title,
            description: project.description,
            category: project.category,
            image: project.image,
            link: project.link,
            github: project.github,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
            status: project.status || 'Todo',
            priority: project.priority || 'Medium'
        });
        setShowProjectModal(true);
    };

    const deleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            await deleteDoc(doc(db, 'projects', id));
        }
    };

    // --- Services Handlers ---
    const handleServiceSubmit = async (e) => {
        e.preventDefault();
        try {
            const serviceData = {
                ...serviceForm,
                tags: typeof serviceForm.tags === 'string' ? serviceForm.tags.split(',').map(tag => tag.trim()) : serviceForm.tags,
                updatedAt: serverTimestamp()
            };

            if (editingService) {
                await updateDoc(doc(db, 'services', editingService), serviceData);
                alert('Service updated successfully!');
            } else {
                await addDoc(collection(db, 'services'), {
                    ...serviceData,
                    createdAt: serverTimestamp()
                });
                alert('Service added successfully!');
            }

            setShowServiceModal(false);
            setEditingService(null);
            setServiceForm({ title: '', description: '', icon: 'FaEllipsisH', tags: '', color: 'text-primary' });
        } catch (error) {
            console.error("Error saving service:", error);
            alert('Failed to save service.');
        }
    };

    const handleEditService = (service) => {
        setEditingService(service.id);
        setServiceForm({
            title: service.title,
            description: service.description,
            category: service.category || 'academic-research',
            icon: service.icon || 'FaEllipsisH',
            tags: Array.isArray(service.tags) ? service.tags.join(', ') : service.tags,
            color: service.color || 'text-primary'
        });
        setShowServiceModal(true);
    };

    const deleteService = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await deleteDoc(doc(db, 'services', id));
            } catch (error) {
                console.error("Error deleting service:", error);
                alert("Failed to delete service.");
            }
        }
    };

    // --- Training Handlers ---
    const handleTrainingSubmit = async (e) => {
        e.preventDefault();
        try {
            const trainingData = {
                ...trainingForm,
                skills: typeof trainingForm.skills === 'string' ? trainingForm.skills.split(',').map(s => s.trim()) : trainingForm.skills,
                rating: Number(trainingForm.rating),
                reviews: Number(trainingForm.reviews),
                updatedAt: serverTimestamp()
            };

            if (editingTraining) {
                await updateDoc(doc(db, 'training_courses', editingTraining), trainingData);
                alert('Course updated successfully!');
            } else {
                await addDoc(collection(db, 'training_courses'), {
                    ...trainingData,
                    createdAt: serverTimestamp()
                });
                alert('Course added successfully!');
            }

            setShowTrainingModal(false);
            setEditingTraining(null);
            setTrainingForm({ title: '', division: 'Kone Academy', icon: 'FaGraduationCap', description: '', skills: '', rating: 5.0, reviews: 0, level: 'Beginner', duration: '1 - 2 Hours', colorClass: 'text-primary', youtubeLink: '' });
        } catch (error) {
            console.error("Error saving training course:", error);
            alert('Failed to save course.');
        }
    };

    const handleEditTraining = (course) => {
        setEditingTraining(course.id);
        setTrainingForm({
            title: course.title,
            division: course.division || 'Kone Consult',
            icon: course.icon || 'FaGraduationCap',
            description: course.description,
            skills: Array.isArray(course.skills) ? course.skills.join(', ') : course.skills,
            rating: course.rating || 5.0,
            reviews: course.reviews || 0,
            level: course.level || 'Beginner',
            duration: course.duration || '1 - 2 Hours',
            colorClass: course.colorClass || 'text-primary',
            youtubeLink: course.youtubeLink || ''
        });
        setShowTrainingModal(true);
    };

    const deleteTraining = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            await deleteDoc(doc(db, 'training_courses', id));
        }
    };

    // --- About Handlers ---
    const handleAboutSubmit = async (e) => {
        e.preventDefault();
        try {
            const aboutData = {
                ...aboutForm,
                tags: typeof aboutForm.tags === 'string' ? aboutForm.tags.split(',').map(tag => tag.trim()) : aboutForm.tags,
                updatedAt: serverTimestamp()
            };

            if (editingAbout) {
                await updateDoc(doc(db, 'about_entries', editingAbout), aboutData);
                alert('About Entry updated successfully!');
            } else {
                await addDoc(collection(db, 'about_entries'), {
                    ...aboutData,
                    createdAt: serverTimestamp()
                });
                alert('About Entry added successfully!');
            }

            setShowAboutModal(false);
            setEditingAbout(null);
            setAboutForm({
                name: '', role: '', email: '', linkedin: '', missionTitle: '', missionText: '',
                stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '', tags: ''
            });
        } catch (error) {
            console.error("Error saving about entry:", error);
            alert('Failed to save about entry.');
        }
    };

    const handleEditAbout = (entry) => {
        setEditingAbout(entry.id);
        setAboutForm({
            name: entry.name || '',
            role: entry.role || '',
            email: entry.email || '',
            linkedin: entry.linkedin || '',
            missionTitle: entry.missionTitle || '',
            missionText: entry.missionText || '',
            stat1Value: entry.stat1Value || '', stat1Label: entry.stat1Label || '',
            stat2Value: entry.stat2Value || '', stat2Label: entry.stat2Label || '',
            stat3Value: entry.stat3Value || '', stat3Label: entry.stat3Label || '',
            tags: Array.isArray(entry.tags) ? entry.tags.join(', ') : (entry.tags || '')
        });
        setShowAboutModal(true);
    };

    const deleteAbout = async (id) => {
        if (window.confirm('Are you sure you want to delete this About entry?')) {
            await deleteDoc(doc(db, 'about_entries', id));
        }
    };

    // --- Kone Code Templates Handlers ---
    const handleTemplateSubmit = async (e) => {
        e.preventDefault();
        try {
            const templateData = {
                ...templateForm,
                updatedAt: serverTimestamp()
            };

            if (editingTemplate) {
                await updateDoc(doc(db, 'kone_code_templates', editingTemplate), templateData);
                alert('Template updated successfully!');
            } else {
                await addDoc(collection(db, 'kone_code_templates'), {
                    ...templateData,
                    createdAt: serverTimestamp()
                });
                alert('Template added successfully!');
            }

            setShowTemplateModal(false);
            setEditingTemplate(null);
            setTemplateForm({ title: '', language: 'javascript', code: '' });
        } catch (error) {
            console.error("Error saving template:", error);
            alert('Failed to save IDE template.');
        }
    };

    const handleEditTemplate = (template) => {
        setEditingTemplate(template.id);
        setTemplateForm({
            title: template.title || '',
            language: template.language || 'javascript',
            code: template.code || ''
        });
        setShowTemplateModal(true);
    };

    const deleteTemplate = async (id) => {
        if (window.confirm('Are you sure you want to delete this Template?')) {
            await deleteDoc(doc(db, 'kone_code_templates', id));
        }
    };

    const deleteIdeProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this public project?')) {
            await deleteDoc(doc(db, 'kone_code_projects', id));
        }
    };

    // --- Blog Handlers ---
    const handleSeedBlogs = async () => {
        if (window.confirm('Are you sure you want to seed the initial pillar blog articles? This will add or update them based on their slug.')) {
            try {
                for (const blog of pillarBlogs) {
                    // Destructure to remove the hardcoded ID and isPillar flag
                    const { id, isPillar, ...blogData } = blog;
                    
                    // Check if blog with same slug exists to prevent duplicates and allow updates
                    const q = query(collection(db, 'blogs'), where('slug', '==', blogData.slug));
                    const snapshot = await getDocs(q);
                    
                    if (!snapshot.empty) {
                        // Update existing document if slug matches
                        const existingDocId = snapshot.docs[0].id;
                        await updateDoc(doc(db, 'blogs', existingDocId), {
                            ...blogData,
                            updatedAt: serverTimestamp()
                        });
                    } else {
                        // Create a new document if it doesn't exist
                        await addDoc(collection(db, 'blogs'), {
                            ...blogData,
                            createdAt: serverTimestamp(),
                            updatedAt: serverTimestamp()
                        });
                    }
                }
                alert('Pillar insights synchronized successfully!');
            } catch (error) {
                console.error("Error seeding/syncing blogs: ", error);
                alert("Synchronization failed. Check console for details.");
            }
        }
    };

    const handleBlogSubmit = async (blogData) => {
        try {
            // Remove the ID from the data payload as Firestore updateDoc doesn't allow it
            const { id, ...restOfData } = blogData;
            
            const data = {
                ...restOfData,
                // Ensure tags is always an array of strings, even if empty
                tags: Array.isArray(blogData.tags) 
                    ? blogData.tags 
                    : (typeof blogData.tags === 'string' ? blogData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []),
                // Elite Author & Temporal Fidelity
                author: {
                    ...blogData.author,
                    name: blogData.author?.name || 'KA Editorial',
                    role: blogData.author?.role || 'Academy Staff'
                },
                publishedAt: blogData.publishedAt || new Date().toISOString().split('T')[0],
                // Metadata defaults
                excerpt: blogData.excerpt || '',
                imageUrl: blogData.imageUrl || '',
                diagramUrl: blogData.diagramUrl || '',
                diagramCaption: blogData.diagramCaption || '',
                seed: blogData.seed || '',
                status: blogData.status || 'draft',
                readTime: Number(blogData.readTime || 5),
                updatedAt: serverTimestamp()
            };

            if (editingBlog) {
                await updateDoc(doc(db, 'blogs', editingBlog), data);
                alert('Article updated successfully!');
            } else {
                await addDoc(collection(db, 'blogs'), {
                    ...data,
                    createdAt: serverTimestamp()
                });
                alert('Article published successfully!');
            }

            setShowBlogModal(false);
            setEditingBlog(null);
        } catch (error) {
            console.error("Error saving blog:", error);
            alert('Failed to save article.');
        }
    };

    const handleEditBlog = (blog) => {
        setEditingBlog(blog.id);
        setShowBlogModal(true);
    };

    const deleteBlog = async (id) => {
        if (window.confirm('Are you sure you want to delete this article forever?')) {
            await deleteDoc(doc(db, 'blogs', id));
        }
    };

    const handleToggleBlogStatus = async (blog) => {
        const newStatus = blog.status === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(db, 'blogs', blog.id), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error toggling blog status:", error);
        }
    };

    // Documentation Actions
    const handleSaveDoc = async (docData) => {
        try {
            if (editingDoc) {
                await updateDoc(doc(db, 'documentation_modules', editingDoc.docId), docData);
                alert('Documentation updated!');
            } else {
                await addDoc(collection(db, 'documentation_modules'), {
                    ...docData,
                    createdAt: serverTimestamp()
                });
                alert('Documentation created!');
            }
            setShowDocsModal(false);
            setEditingDoc(null);
        } catch (error) {
            console.error("Error saving documentation:", error);
            alert(`Failed to save documentation: ${error.message}`);
        }
    };

    const handleDeleteDoc = async (id) => {
        console.log("handleDeleteDoc called with ID:", id);
        // alert(`Debug: Attempting to delete doc ID: ${id}`); // Temporary debug
        if (window.confirm('Are you sure you want to delete this documentation module?')) {
            try {
                await deleteDoc(doc(db, 'documentation_modules', id));
                alert('Documentation module deleted.');
            } catch (error) {
                console.error("Error deleting documentation:", error);
                alert(`Failed to delete documentation: ${error.message}`);
            }
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

                {/* Navigation Tabs - Enabled for all sites */}
                {(activeSite === 'Kone Consult' || activeSite === 'Kone Lab' || activeSite === 'Kone Code' || activeSite === 'Kone Academy') && (
                    <div className="nav-tabs-glass hide-scrollbar overflow-auto mb-4">
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`tab-btn-premium ${activeTab === 'messages' ? 'active' : ''}`}
                            >
                                <FaRegEnvelope className="me-2" /> Messages
                                {messages.filter(m => !m.read).length > 0 && (
                                    <span className="ms-2 badge bg-white text-primary rounded-pill small py-0 px-1">{messages.filter(m => !m.read).length}</span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('users')}
                                className={`tab-btn-premium ${activeTab === 'users' ? 'active' : ''}`}
                            >
                                <FaUsers className="me-2" /> Users
                            </button>
                            <button
                                onClick={() => setActiveTab('analytics')}
                                className={`tab-btn-premium ${activeTab === 'analytics' ? 'active' : ''}`}
                            >
                                <FaChartLine className="me-2" /> Analytics
                            </button>
                            <button
                                onClick={() => setActiveTab('projects')}
                                className={`tab-btn-premium ${activeTab === 'projects' ? 'active' : ''}`}
                            >
                                <FaProjectDiagram className="me-2" /> Projects
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`tab-btn-premium ${activeTab === 'services' ? 'active' : ''}`}
                            >
                                <FaBriefcase className="me-2" /> Services
                            </button>
                            <button
                                onClick={() => setActiveTab('training')}
                                className={`tab-btn-premium ${activeTab === 'training' ? 'active' : ''}`}
                            >
                                <FaGraduationCap className="me-2" /> Training
                            </button>
                            <button
                                onClick={() => setActiveTab('docs')}
                                className={`tab-btn-premium ${activeTab === 'docs' ? 'active' : ''}`}
                            >
                                <FaBook className="me-2" /> Docs
                            </button>
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`tab-btn-premium ${activeTab === 'about' ? 'active' : ''}`}
                            >
                                <FaInfoCircle className="me-2" /> About
                            </button>
                            <button
                                onClick={() => setActiveTab('blogs')}
                                className={`tab-btn-premium premium-tab-active ${activeTab === 'blogs' ? 'active' : ''}`}
                            >
                                <FiBookOpen className="me-2" /> Blogs
                            </button>
                            <button
                                onClick={() => setActiveTab('subscribers')}
                                className={`tab-btn-premium ${activeTab === 'subscribers' ? 'active' : ''}`}
                            >
                                <FaUsers className="me-2" /> Subscribers
                            </button>
                            {activeSite === 'Kone Code' && (
                                <button
                                    onClick={() => setActiveTab('templates')}
                                    className={`tab-btn-premium ${activeTab === 'templates' ? 'active' : ''}`}
                                >
                                    <FaCode className="me-2" /> IDE Templates
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab('activity')}
                                className={`tab-btn-premium ${activeTab === 'activity' ? 'active' : ''}`}
                            >
                                <FaHistory className="me-2" /> Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('financials')}
                                className={`tab-btn-premium ${activeTab === 'financials' ? 'active' : ''}`}
                                style={activeTab === 'financials' ? { background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)', boxShadow: '0 4px 20px rgba(255, 215, 0, 0.4)' } : {}}
                            >
                                <FaWallet className="me-2" /> Kone Pay
                            </button>
                        </div>
                )}

                {/* Main Content Area - Enabled for all sites */}
                {(activeSite === 'Kone Consult' || activeSite === 'Kone Lab' || activeSite === 'Kone Code' || activeSite === 'Kone Academy') ? (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                        {activeTab === 'messages' && (
                            <div className="row g-0 border rounded border-dark overflow-hidden messages-layout">
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

                        {activeTab === 'users' && (
                            <UserManagementList />
                        )}

                        {activeTab === 'analytics' && (
                            <AnalyticsDashboard 
                                messages={messages}
                                projects={projects.filter(p => p.division === (activeSite === 'Kone Lab' ? 'Kone Lab' : activeSite === 'Kone Code' ? 'Kone Code' : activeSite === 'Kone Academy' ? 'Kone Academy' : 'Kone Consult'))}
                                blogs={blogs.filter(b => (b.category || '').toLowerCase() === (activeSite === 'Kone Lab' ? 'lab' : activeSite === 'Kone Code' ? 'code' : activeSite === 'Kone Academy' ? 'academy' : 'consult'))}
                            />
                        )}

                        {activeTab === 'financials' && (
                            <KonePayFinancials 
                                payments={payments}
                                totalRevenue={totalRevenue}
                                activeSite={activeSite}
                            />
                        )}

                        {activeTab === 'projects' && (
                            <div>
                                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                                    <h5 className="text-white mb-0">Projects</h5>

                                    <div className="d-flex flex-column flex-md-row gap-3 flex-grow-1 justify-content-end">
                                        {/* Search & Filter Bar */}
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control-dark small rounded-pill"
                                                placeholder="Search projects..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                style={{ minWidth: '220px', paddingLeft: '1rem', paddingRight: '1rem' }}
                                            />
                                        </div>
                                        <select
                                            className="form-select-dark py-1 small"
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            style={{ width: 'auto' }}
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Todo">Todo</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>

                                    <div className="vr bg-secondary opacity-25 d-none d-md-block"></div>

                                    {/* View Switcher & Add Button */}
                                    <div className="d-flex gap-2">
                                        <div className="btn-group" role="group">
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-secondary border-dark text-secondary'}`}
                                                onClick={() => setViewMode('grid')}
                                                title="Grid View"
                                            >
                                                <FaThLarge />
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-secondary border-dark text-secondary'}`}
                                                onClick={() => setViewMode('list')}
                                                title="List View"
                                            >
                                                <FaList />
                                            </button>
                                        </div>
                                        <button onClick={() => { setEditingProject(null); setProjectForm({ title: '', description: '', category: 'App Development', image: '', link: '', github: '', tags: '', status: 'Todo', priority: 'Medium' }); setShowProjectModal(true); }} className="btn btn-primary btn-sm d-flex align-items-center gap-2">
                                            <FaPlus /> New
                                        </button>
                                    </div>
                                </div>


                                {/* Filtered Projects Logic */}
                                {(() => {
                                    const filteredProjects = projects.filter(p => {
                                        const matchesSite = p.division === (activeSite === 'Kone Lab' ? 'Kone Lab' : activeSite === 'Kone Code' ? 'Kone Code' : activeSite === 'Kone Academy' ? 'Kone Academy' : 'Kone Consult');
                                        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
                                        return matchesSite && matchesSearch && matchesStatus;
                                    });

                                    if (viewMode === 'list') {
                                        return (
                                            <ProjectList
                                                projects={filteredProjects}
                                                onDelete={deleteProject}
                                                onAdd={() => setShowProjectModal(true)}
                                                onEdit={handleEditProject}
                                            />
                                        );
                                    }

                                    return (
                                        <ProjectGrid
                                            projects={filteredProjects}
                                            onDelete={deleteProject}
                                            onAdd={() => setShowProjectModal(true)}
                                            onEdit={handleEditProject}
                                        />
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === 'services' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="text-white mb-0">Services</h5>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={handleSeedServices}
                                            className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2"
                                            title="Only use this once to populate existing services"
                                        >
                                            Seed Default Services
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingService(null);
                                                setServiceForm({ title: '', description: '', icon: 'FaEllipsisH', tags: '', color: 'text-primary' });
                                                setShowServiceModal(true);
                                            }}
                                            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                        >
                                            <FaPlus /> New Service
                                        </button>
                                    </div>
                                </div>
                                <ServiceList
                                    services={services.filter(s => s.division === (activeSite === 'Kone Lab' ? 'Kone Lab' : activeSite === 'Kone Code' ? 'Kone Code' : activeSite === 'Kone Academy' ? 'Kone Academy' : 'Kone Consult'))}
                                    onDelete={deleteService}
                                    onEdit={handleEditService}
                                />
                            </div>
                        )}

                        {activeTab === 'training' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="text-white mb-0">Training Courses</h5>
                                        <small className="text-secondary">Manage dynamic courses shown in the Training Hub.</small>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={handleSeedCourses}
                                            className="btn btn-outline-warning btn-sm d-flex align-items-center gap-2"
                                            title="Only use this once to populate existing courses"
                                        >
                                            Seed Default Courses
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditingTraining(null);
                                                setTrainingForm({ title: '', division: 'Kone Academy', icon: 'FaGraduationCap', description: '', skills: '', rating: 5.0, reviews: 0, level: 'Beginner', duration: '1 - 2 Hours', colorClass: 'text-primary', youtubeLink: '' });
                                                setShowTrainingModal(true);
                                            }}
                                            className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                        >
                                            <FaPlus /> New Course
                                        </button>
                                    </div>
                                </div>
                                <TrainingList
                                    courses={trainingCourses.filter(c => c.division === (activeSite === 'Kone Lab' ? 'Kone Lab' : activeSite === 'Kone Code' ? 'Kone Code' : activeSite === 'Kone Academy' ? 'Kone Academy' : 'Kone Consult'))}
                                    onDelete={deleteTraining}
                                    onEdit={handleEditTraining}
                                    onSeed={handleSeedCourses}
                                />
                            </div>
                        )}

                        {activeTab === 'docs' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h5 className="text-white mb-0">Documentation Modules</h5>
                                    <button
                                        onClick={() => {
                                            setEditingDoc(null);
                                            setShowDocsModal(true);
                                        }}
                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                    >
                                        <FaPlus /> New Module
                                    </button>
                                </div>
                                <DocumentationList 
                                    docs={docs.filter(d => {
                                        const cat = (d.category || '').toLowerCase();
                                        const target = (activeSite === 'Kone Lab' ? 'lab' : activeSite === 'Kone Code' ? 'code' : activeSite === 'Kone Academy' ? 'academy' : 'consult');
                                        return cat === target;
                                    })}
                                    onDelete={handleDeleteDoc} 
                                    onEdit={handleEditDoc} 
                                    onView={(doc) => window.open(`/docs?section=${doc.id}&category=${activeSite === 'Kone Lab' ? 'lab' : activeSite === 'Kone Code' ? 'code' : activeSite === 'Kone Academy' ? 'academy' : 'consult'}`, '_blank')}
                                />
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="text-white mb-0">About Entries</h5>
                                        <small className="text-secondary">Manage dynamic team or department cards.</small>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingAbout(null);
                                            setAboutForm({
                                                name: '', role: '', email: '', linkedin: '', missionTitle: '', missionText: '',
                                                stat1Value: '', stat1Label: '', stat2Value: '', stat2Label: '', stat3Value: '', stat3Label: '', tags: ''
                                            });
                                            setShowAboutModal(true);
                                        }}
                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                    >
                                        <FaPlus /> New Entry
                                    </button>
                                </div>
                                <AboutList
                                    entries={aboutEntries}
                                    onDelete={deleteAbout}
                                    onEdit={handleEditAbout}
                                />
                            </div>
                        )}

                        {activeTab === 'blogs' && (
                            <div className="row g-4">
                                <div className="col-lg-8">
                                    <BlogManagementList 
                                        blogs={blogs.filter(b => b.category === (activeSite === 'Kone Lab' ? 'Lab' : activeSite === 'Kone Code' ? 'Code' : activeSite === 'Kone Academy' ? 'Academy' : 'Consult'))} 
                                        onDelete={deleteBlog} 
                                        onAdd={() => { setEditingBlog(null); setShowBlogModal(true); }} 
                                        onEdit={handleEditBlog} 
                                        onToggleStatus={handleToggleBlogStatus}
                                        onSeed={handleSeedBlogs}
                                    />
                                </div>
                                <div className="col-lg-4">
                                    <div className="sidebar-glass-panel">
                                        <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom border-white border-opacity-10">
                                            <div className={`glass-icon ${activeSite === 'Kone Code' ? 'bg-success' : activeSite === 'Kone Academy' ? 'bg-secondary' : 'bg-info'} text-white`} style={{ width: '40px', height: '40px' }}>
                                                <FaThLarge size={18} />
                                            </div>
                                            <div>
                                                <h6 className="text-white mb-0 fw-bold">
                                                    {activeSite === 'Kone Lab' ? 'Lab Insights' : activeSite === 'Kone Code' ? 'Code Insights' : activeSite === 'Kone Academy' ? 'Academy Hub' : 'Consult Analytics'}
                                                </h6>
                                                <small className="text-secondary">Editorial Performance</small>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="label-premium">Content Distribution</label>
                                            <div className="d-flex flex-column gap-2">
                                                <div className="d-flex justify-content-between small">
                                                    <span className="text-secondary">Total Articles</span>
                                                    <span className="text-white fw-bold">{blogs.filter(b => b.category === (activeSite === 'Kone Lab' ? 'Lab' : activeSite === 'Kone Code' ? 'Code' : activeSite === 'Kone Academy' ? 'Academy' : 'Consult')).length}</span>
                                                </div>
                                                <div className="d-flex justify-content-between small">
                                                    <span className="text-secondary">Published</span>
                                                    <span className="text-success fw-bold">{blogs.filter(b => b.category === (activeSite === 'Kone Lab' ? 'Lab' : activeSite === 'Kone Code' ? 'Code' : activeSite === 'Kone Academy' ? 'Academy' : 'Consult') && b.status === 'published').length}</span>
                                                </div>
                                                <div className="d-flex justify-content-between small">
                                                    <span className="text-warning">Drafts</span>
                                                    <span className="text-warning fw-bold">{blogs.filter(b => b.category === (activeSite === 'Kone Lab' ? 'Lab' : activeSite === 'Kone Code' ? 'Code' : activeSite === 'Kone Academy' ? 'Academy' : 'Consult') && b.status === 'draft').length}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded ${activeSite === 'Kone Code' ? 'bg-success' : activeSite === 'Kone Academy' ? 'bg-secondary' : 'bg-info'} bg-opacity-10 border ${activeSite === 'Kone Code' ? 'border-success' : activeSite === 'Kone Academy' ? 'border-secondary' : 'border-info'} border-opacity-20 mb-4`}>
                                            <p className={`${activeSite === 'Kone Code' ? 'text-success' : activeSite === 'Kone Academy' ? 'text-secondary' : 'text-info'} smaller mb-0 fst-italic`}>
                                                {activeSite === 'Kone Lab' 
                                                    ? "Lab content focuses on engineering precision and hardware innovations."
                                                    : activeSite === 'Kone Code'
                                                    ? "Code content explores agentic architectures and software scalability."
                                                    : activeSite === 'Kone Academy'
                                                    ? "Academy content manages the global hub and institutional vision."
                                                    : "Consult content drives research authority and strategic leadership."}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={() => { setEditingBlog(null); setShowBlogModal(true); }}
                                            className={`btn ${activeSite === 'Kone Code' ? 'btn-outline-success' : activeSite === 'Kone Academy' ? 'btn-outline-secondary' : 'btn-outline-info'} w-100 py-2 rounded-pill small fw-bold d-flex align-items-center justify-content-center gap-2`}
                                        >
                                            <FaPlus size={14} /> Quick Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'templates' && activeSite === 'Kone Code' && (
                            <KoneCodeTemplatesList
                                templates={ideTemplates}
                                onDelete={handleDeleteTemplate}
                                onEdit={(template) => {
                                    setEditingTemplate(template);
                                    setTemplateForm({
                                        title: template.title,
                                        language: template.language,
                                        code: template.code
                                    });
                                    setShowTemplateModal(true);
                                }}
                                onAdd={() => {
                                    setEditingTemplate(null);
                                    setTemplateForm({ title: '', language: 'html', code: '' });
                                    setShowTemplateModal(true);
                                }}
                            />
                        )}

                        {activeTab === 'subscribers' && (
                            <SubscriberList 
                                subscribers={subscribers} 
                                users={users} 
                                onSync={handleSyncUsers} 
                                syncing={syncing}
                            />
                        )}

                        {activeTab === 'activity' && (
                            <UserActivityList />
                        )}
                        </motion.div>
                    </AnimatePresence>
                ) : activeSite === 'Kone Code' ? (
                    <div>
                        {/* Site-Specific Sub-Tabs */}
                        <div className="d-flex gap-2 p-1 bg-dark rounded-pill d-inline-flex border border-dark overflow-auto hide-scrollbar mb-4" style={{ whiteSpace: 'nowrap', maxWidth: '100%', position: 'sticky', top: '85px', zIndex: 990, backdropFilter: 'blur(10px)' }}>
                                <button
                                    onClick={() => setIdeActiveTab('templates')}
                                    className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${ideActiveTab === 'templates' ? 'btn-primary' : 'text-secondary hover-text-white'}`}
                                >
                                    Templates
                                </button>
                                <button
                                    onClick={() => setIdeActiveTab('projects')}
                                    className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${ideActiveTab === 'projects' ? 'btn-primary' : 'text-secondary hover-text-white'}`}
                                >
                                    User Projects
                                </button>
                                <button
                                    onClick={() => setIdeActiveTab('docs')}
                                    className={`btn btn-sm rounded-pill px-4 fw-bold transition-all ${ideActiveTab === 'docs' ? 'btn-primary' : 'text-secondary hover-text-white'}`}
                                >
                                    IDE Tutorials
                                </button>
                            </div>

                        {ideActiveTab === 'templates' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                                    <div>
                                        <h5 className="text-white mb-0">IDE Templates</h5>
                                        <small className="text-secondary">Manage default boilerplate code available in the public Kone Code IDE.</small>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingTemplate(null);
                                            setTemplateForm({ title: '', language: 'javascript', code: '' });
                                            setShowTemplateModal(true);
                                        }}
                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                    >
                                        <FaPlus /> New Template
                                    </button>
                                </div>
                                <KoneCodeTemplatesList
                                    templates={ideTemplates}
                                    onDelete={deleteTemplate}
                                    onEdit={handleEditTemplate}
                                />
                            </div>
                        )}

                        {ideActiveTab === 'projects' && (
                            <KoneCodeProjectsList
                                projects={ideProjects}
                                onDelete={deleteIdeProject}
                            />
                        )}

                        {ideActiveTab === 'docs' && (
                            <div>
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h5 className="text-white mb-0">IDE Documentation</h5>
                                        <small className="text-secondary">Tutorials and guides specifically for the Kone Code IDE.</small>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setEditingDoc(null);
                                            setShowDocsModal(true);
                                        }}
                                        className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                                    >
                                        <FaPlus /> New Tutorial
                                    </button>
                                </div>
                                <DocumentationList
                                    docs={docs.filter(d => (d.category || 'general') === 'code')}
                                    onDelete={(id) => handleDeleteDoc(id)}
                                    onEdit={(doc) => {
                                        setEditingDoc(doc);
                                        setShowDocsModal(true);
                                    }}
                                    onView={(doc) => window.open(`/docs?section=${doc.id}&category=code`, '_blank')}
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center py-5 mt-4 border rounded border-dark bg-dark bg-opacity-25" style={{ minHeight: '400px' }}>
                        <div className="rounded-circle d-flex align-items-center justify-content-center bg-secondary bg-opacity-10 mb-4 border border-secondary border-opacity-25" style={{ width: '80px', height: '80px' }}>
                            <FaThLarge size={32} className="text-secondary opacity-50" />
                        </div>
                        <h4 className="text-white fw-bold mb-2">{activeSite} Modules</h4>
                        <p className="text-secondary text-center small" style={{ maxWidth: '400px' }}>
                            The dashboard modules for {activeSite} are being migrated to the unified management view. 
                            Switch back to <strong>Kone Consult</strong> or <strong>Kone Code</strong> for established workflows.
                        </p>
                    </div>
                )}
            
            {/* ADD PROJECT MODAL */}
            <AnimatePresence>
                {showProjectModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content-custom"
                        >
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-white m-0">{editingProject ? "Edit Project" : "Add Project"}</h5>
                                <button onClick={() => setShowProjectModal(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleProjectSubmit} className="d-flex flex-column gap-3">
                                <input className="form-control-dark" placeholder="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
                                <select className="form-select-dark" value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}>
                                    <option>App Development</option>
                                    <option>Web Development</option>
                                    <option>AI & Machine Learning</option>
                                    <option>Data Analysis</option>
                                </select>
                                <div className="row g-2">
                                    <div className="col">
                                        <label className="text-secondary small ms-1">Status</label>
                                        <select className="form-select-dark" value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                                            <option>Todo</option>
                                            <option>In Progress</option>
                                            <option>Done</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label className="text-secondary small ms-1">Priority</label>
                                        <select className="form-select-dark" value={projectForm.priority} onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}>
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea className="form-control-dark" placeholder="Description" rows="3" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} required />
                                <input className="form-control-dark" placeholder="Image URL" value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} />
                                <div className="row g-2">
                                    <div className="col">
                                        <input className="form-control-dark" placeholder="Demo Link" value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} />
                                    </div>
                                    <div className="col">
                                        <input className="form-control-dark" placeholder="GitHub Link" value={projectForm.github} onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })} />
                                    </div>
                                </div>
                                <input className="form-control-dark" placeholder="Tags (comma separated)" value={projectForm.tags} onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })} />
                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-dark border-opacity-10">
                                    <button type="button" onClick={() => setShowProjectModal(false)} className="btn btn-secondary px-4">Cancel</button>
                                    <button type="submit" className="btn btn-primary px-4">
                                        {editingProject ? (
                                            <>Update Project</>
                                        ) : (
                                            <>Save Project</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ADD SERVICE MODAL */}
            <AnimatePresence>
                {showServiceModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content-custom"
                        >
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-white m-0">{editingService ? "Edit Service" : "Add Service"}</h5>
                                <button onClick={() => setShowServiceModal(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleServiceSubmit} className="d-flex flex-column gap-3">
                                <div className="row g-2">
                                    <div className="col-12 col-md-8">
                                        <label className="text-secondary small ms-1">Service Title</label>
                                        <input className="form-control-dark" placeholder="Title" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} required />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="text-secondary small ms-1">Category</label>
                                        <select className="form-select-dark" value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}>
                                            <option value="academic-research">Academic Research</option>
                                            <option value="business-research">Business Research</option>
                                            <option value="software-research">Software Research</option>
                                            <option value="academic-analysis">Academic Analysis</option>
                                            <option value="business-analysis">Business Analysis</option>
                                            <option value="software-analysis">Software Analysis</option>
                                            <option value="mentorship">Mentorship</option>
                                            <option value="topic-selection">Topic Selection</option>
                                            <option value="general">General / Other</option>
                                        </select>
                                    </div>
                                </div>
                                <textarea className="form-control-dark" placeholder="Description" rows="3" value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} required />

                                <div className="row g-2">
                                    <div className="col">
                                        <label className="text-secondary small ms-1">Icon <span className="text-muted">(e.g., FaChartBar)</span></label>
                                        <input className="form-control-dark" placeholder="Icon Name" value={serviceForm.icon} onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })} />
                                    </div>
                                    <div className="col">
                                        <label className="text-secondary small ms-1">Theme Color</label>
                                        <select className="form-select-dark" value={serviceForm.color} onChange={(e) => setServiceForm({ ...serviceForm, color: e.target.value })}>
                                            <option value="text-primary">Primary (Blue)</option>
                                            <option value="text-success">Success (Green)</option>
                                            <option value="text-warning">Warning (Yellow)</option>
                                            <option value="text-info">Info (Cyan)</option>
                                            <option value="text-danger">Danger (Red)</option>
                                            <option value="text-secondary">Secondary (Grey)</option>
                                        </select>
                                    </div>
                                </div>
                                <input className="form-control-dark" placeholder="Tags (comma separated)" value={serviceForm.tags} onChange={(e) => setServiceForm({ ...serviceForm, tags: e.target.value })} />

                                <div className="d-flex justify-content-end gap-2 mt-3">
                                    <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingService ? "Update" : "Save"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ADD TRAINING MODAL */}
            <AnimatePresence>
                {showTrainingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content-custom"
                        >
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-white m-0">{editingTraining ? "Edit Course" : "Add Course"}</h5>
                                <button onClick={() => setShowTrainingModal(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleTrainingSubmit} className="d-flex flex-column gap-3 max-h-500 overflow-auto pe-2">
                                <div className="row g-2">
                                    <div className="col-12 col-md-8">
                                        <label className="text-secondary small ms-1">Course Title</label>
                                        <input className="form-control-dark" placeholder="Title" value={trainingForm.title} onChange={(e) => setTrainingForm({ ...trainingForm, title: e.target.value })} required />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <label className="text-secondary small ms-1">Division</label>
                                        <select className="form-select-dark" value={trainingForm.division} onChange={(e) => setTrainingForm({ ...trainingForm, division: e.target.value })}>
                                            <option>Kone Consult</option>
                                            <option>Kone Code</option>
                                            <option>Kone Lab</option>
                                        </select>
                                    </div>
                                </div>

                                <textarea className="form-control-dark" placeholder="Description" rows="2" value={trainingForm.description} onChange={(e) => setTrainingForm({ ...trainingForm, description: e.target.value })} required />
                                <input className="form-control-dark" placeholder="Skills Covered (comma separated)" value={trainingForm.skills} onChange={(e) => setTrainingForm({ ...trainingForm, skills: e.target.value })} required />

                                <div className="row g-2">
                                    <div className="col-6 col-md-3">
                                        <label className="text-secondary small ms-1">Level</label>
                                        <select className="form-select-dark" value={trainingForm.level} onChange={(e) => setTrainingForm({ ...trainingForm, level: e.target.value })}>
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="text-secondary small ms-1">Duration</label>
                                        <input className="form-control-dark" placeholder="e.g. 1 - 2 Hours" value={trainingForm.duration} onChange={(e) => setTrainingForm({ ...trainingForm, duration: e.target.value })} required />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="text-secondary small ms-1">Rating (e.g. 4.9)</label>
                                        <input type="number" step="0.1" max="5" min="0" className="form-control-dark" value={trainingForm.rating} onChange={(e) => setTrainingForm({ ...trainingForm, rating: e.target.value })} />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="text-secondary small ms-1">Reviews Count</label>
                                        <input type="number" className="form-control-dark" value={trainingForm.reviews} onChange={(e) => setTrainingForm({ ...trainingForm, reviews: e.target.value })} />
                                    </div>
                                </div>

                                <div className="row g-2">
                                    <div className="col-12 col-md-6">
                                        <label className="text-secondary small ms-1">Icon Name <span className="text-muted">(e.g. SiPython, FaRobot)</span></label>
                                        <input className="form-control-dark" placeholder="Icon Component Name" value={trainingForm.icon} onChange={(e) => setTrainingForm({ ...trainingForm, icon: e.target.value })} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <label className="text-secondary small ms-1">Theme Color</label>
                                        <select className="form-select-dark" value={trainingForm.colorClass} onChange={(e) => setTrainingForm({ ...trainingForm, colorClass: e.target.value })}>
                                            <option value="text-primary">Primary (Blue)</option>
                                            <option value="text-success">Success (Green)</option>
                                            <option value="text-warning">Warning (Yellow)</option>
                                            <option value="text-info">Info (Cyan)</option>
                                            <option value="text-danger">Danger (Red)</option>
                                            <option value="text-purple">Purple</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-secondary small ms-1">YouTube Link</label>
                                    <input type="url" className="form-control-dark" placeholder="https://youtube.com/..." value={trainingForm.youtubeLink} onChange={(e) => setTrainingForm({ ...trainingForm, youtubeLink: e.target.value })} required />
                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-dark">
                                    <button type="button" onClick={() => setShowTrainingModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingTraining ? "Update" : "Save"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* DOCUMENTATION MODAL */}
            {showDocsModal && (
                <DocumentationForm
                    doc={editingDoc}
                    onSave={handleSaveDoc}
                    ideTemplates={ideTemplates}
                    onCancel={() => {
                        setShowDocsModal(false);
                        setEditingDoc(null);
                    }}
                />
            )}

            {/* ADD ABOUT MODAL */}
            <AnimatePresence>
                {showAboutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content-custom"
                        >
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-white m-0">{editingAbout ? "Edit About Entry" : "Add About Entry"}</h5>
                                <button onClick={() => setShowAboutModal(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleAboutSubmit} className="d-flex flex-column gap-3 max-h-500 overflow-auto pe-2">
                                <div className="row g-2">
                                    <div className="col-12 col-md-6">
                                        <input className="form-control-dark" placeholder="Name (e.g. Jane Doe)" value={aboutForm.name} onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })} required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input className="form-control-dark" placeholder="Role (e.g. CO-FOUNDER)" value={aboutForm.role} onChange={(e) => setAboutForm({ ...aboutForm, role: e.target.value })} required />
                                    </div>
                                </div>
                                <div className="row g-2">
                                    <div className="col-12 col-md-6">
                                        <input type="email" className="form-control-dark" placeholder="Email Address" value={aboutForm.email} onChange={(e) => setAboutForm({ ...aboutForm, email: e.target.value })} required />
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <input type="url" className="form-control-dark" placeholder="LinkedIn URL" value={aboutForm.linkedin} onChange={(e) => setAboutForm({ ...aboutForm, linkedin: e.target.value })} />
                                    </div>
                                </div>

                                <hr className="border-secondary opacity-25 my-1" />

                                <input className="form-control-dark" placeholder="Mission Title (e.g. To democratize access...)" value={aboutForm.missionTitle} onChange={(e) => setAboutForm({ ...aboutForm, missionTitle: e.target.value })} required />
                                <textarea className="form-control-dark" placeholder="Mission Description" rows="3" value={aboutForm.missionText} onChange={(e) => setAboutForm({ ...aboutForm, missionText: e.target.value })} required />

                                <hr className="border-secondary opacity-25 my-1" />
                                <label className="text-secondary small ms-1 mb-0">Stats (Value & Label)</label>
                                <div className="row g-2">
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 1 Value (e.g. 5+)" value={aboutForm.stat1Value} onChange={(e) => setAboutForm({ ...aboutForm, stat1Value: e.target.value })} required /></div>
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 1 Label (e.g. Years)" value={aboutForm.stat1Label} onChange={(e) => setAboutForm({ ...aboutForm, stat1Label: e.target.value })} required /></div>
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 2 Value (e.g. 50+)" value={aboutForm.stat2Value} onChange={(e) => setAboutForm({ ...aboutForm, stat2Value: e.target.value })} required /></div>
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 2 Label (e.g. Projects)" value={aboutForm.stat2Label} onChange={(e) => setAboutForm({ ...aboutForm, stat2Label: e.target.value })} required /></div>
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 3 Value (e.g. 100%)" value={aboutForm.stat3Value} onChange={(e) => setAboutForm({ ...aboutForm, stat3Value: e.target.value })} required /></div>
                                    <div className="col-6"><input className="form-control-dark" placeholder="Stat 3 Label (e.g. Satisfaction)" value={aboutForm.stat3Label} onChange={(e) => setAboutForm({ ...aboutForm, stat3Label: e.target.value })} required /></div>
                                </div>

                                <hr className="border-secondary opacity-25 my-1" />
                                <input className="form-control-dark" placeholder="Tags / Skills (comma separated)" value={aboutForm.tags} onChange={(e) => setAboutForm({ ...aboutForm, tags: e.target.value })} required />

                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-dark">
                                    <button type="button" onClick={() => setShowAboutModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingAbout ? "Update" : "Save"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ADD TEMPLATE MODAL */}
            <AnimatePresence>
                {showTemplateModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-overlay"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="modal-content-custom"
                            style={{ maxWidth: '800px' }}
                        >
                            <div className="d-flex justify-content-between mb-4">
                                <h5 className="text-white m-0">{editingTemplate ? "Edit Template" : "Add Template"}</h5>
                                <button onClick={() => setShowTemplateModal(false)} className="btn-close btn-close-white"></button>
                            </div>
                            <form onSubmit={handleTemplateSubmit} className="d-flex flex-column gap-3 max-h-500 overflow-auto pe-2">
                                <div className="row g-2">
                                    <div className="col-12 col-md-8">
                                        <input className="form-control-dark" placeholder="Template Title (e.g. Basic HTML Outline)" value={templateForm.title} onChange={(e) => setTemplateForm({ ...templateForm, title: e.target.value })} required />
                                    </div>
                                    <div className="col-12 col-md-4">
                                        <select className="form-select-dark" value={templateForm.language} onChange={(e) => setTemplateForm({ ...templateForm, language: e.target.value })}>
                                            <option value="html">HTML / CSS</option>
                                            <option value="javascript">JavaScript (Browser)</option>
                                            <option value="javascript-node">JavaScript (Node.js)</option>
                                            <option value="python">Python</option>
                                            <option value="lua">Lua</option>
                                        </select>
                                    </div>
                                </div>

                                <textarea
                                    className="form-control-dark font-monospace"
                                    placeholder="Write the exact starting code snippet here..."
                                    rows="12"
                                    value={templateForm.code}
                                    onChange={(e) => setTemplateForm({ ...templateForm, code: e.target.value })}
                                    required
                                />

                                <div className="d-flex justify-content-end gap-2 mt-3 pt-3 border-top border-dark">
                                    <button type="button" onClick={() => setShowTemplateModal(false)} className="btn btn-secondary">Cancel</button>
                                    <button type="submit" className="btn btn-primary">{editingTemplate ? "Update" : "Save"}</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {showBlogModal && (
                <BlogForm 
                    blog={blogs.find(b => b.id === editingBlog)}
                    defaultCategory={activeSite === 'Kone Lab' ? 'Lab' : activeSite === 'Kone Code' ? 'Code' : activeSite === 'Kone Academy' ? 'Academy' : 'Consult'}
                    onSave={handleBlogSubmit}
                    onCancel={() => { setShowBlogModal(false); setEditingBlog(null); }}
                />
            )}
        </div>
    </div>
);
};

export default AdminDashboard;
