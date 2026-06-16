import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';

const ALLOWED_ADMINS = ['phconsultgh@gmail.com', 'philipkone45@gmail.com'];

export const useAdminData = (currentUser, navigate) => {
    const [messages, setMessages] = useState([]);
    const [projects, setProjects] = useState([]);
    const [services, setServices] = useState([]);
    const [trainingCourses, setTrainingCourses] = useState([]);
    const [docs, setDocs] = useState([]);
    const [aboutEntries, setAboutEntries] = useState([]);
    const [ideTemplates, setIdeTemplates] = useState([]);
    const [ideProjects, setIdeProjects] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [payments, setPayments] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [subscribers, setSubscribers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
            (error) => console.log("Projects collection might not exist yet or empty", error)
        );

        const unsubscribeServices = onSnapshot(
            query(collection(db, 'services')),
            (snapshot) => {
                setServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => console.log("Services collection might not exist yet or empty", error)
        );

        const unsubscribeDocs = onSnapshot(
            query(collection(db, 'documentation_modules'), orderBy('order', 'asc')),
            (snapshot) => {
                setDocs(snapshot.docs.map(doc => ({ ...doc.data(), docId: doc.id })));
            },
            (error) => console.log("Documentation collection might not exist yet", error)
        );

        const unsubscribeTraining = onSnapshot(
            query(collection(db, 'training_courses'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setTrainingCourses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => console.log("Training courses collection empty", error)
        );

        const unsubscribeAbout = onSnapshot(
            query(collection(db, 'about_entries'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                setAboutEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => console.log("About entries collection empty", error)
        );

        const unsubscribeTemplates = onSnapshot(
            query(collection(db, 'kone_code_templates'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setIdeTemplates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => console.log("Templates collection empty", error)
        );

        const unsubscribeProjectsIDE = onSnapshot(
            query(collection(db, 'kone_code_projects'), orderBy('createdAt', 'desc')),
            (snapshot) => {
                setIdeProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            },
            (error) => console.log("Public projects collection empty", error)
        );

        const unsubscribeBlogs = onSnapshot(
            collection(db, 'blogs'), 
            (snapshot) => {
                const fetchedBlogs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setBlogs(fetchedBlogs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
            }
        );

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
            (error) => console.log("Payments collection might not exist yet", error)
        );

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

    return {
        messages, projects, services, trainingCourses, docs, aboutEntries,
        ideTemplates, ideProjects, blogs, payments, totalRevenue,
        subscribers, users, loading
    };
};
