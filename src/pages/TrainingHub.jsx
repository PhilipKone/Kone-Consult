import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaYoutube, FaGraduationCap, FaCode, FaFlask, FaChartBar, FaStar, FaClock, FaCogs, FaCube, FaMicrochip, FaTerminal, FaFileExcel, FaLaptopCode, FaChartPie, FaTable } from 'react-icons/fa';
import { SiPython, SiJavascript, SiR, SiCplusplus } from 'react-icons/si';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { globalCache } from '../utils/cache';
import './TrainingHub.css';

const iconMap = {
    'FaGraduationCap': FaGraduationCap,
    'FaChartBar': FaChartBar,
    'FaCode': FaCode,
    'FaFlask': FaFlask,
    'FaYoutube': FaYoutube,
    'FaCogs': FaCogs,
    'FaCube': FaCube,
    'FaMicrochip': FaMicrochip,
    'FaTerminal': FaTerminal,
    'FaFileExcel': FaFileExcel,
    'FaLaptopCode': FaLaptopCode,
    'FaChartPie': FaChartPie,
    'FaTable': FaTable,
    'SiPython': SiPython,
    'SiJavascript': SiJavascript,
    'SiR': SiR,
    'SiCplusplus': SiCplusplus
};

const CourseCard = ({ title, division, icon, description, skills, rating, reviews, level, duration, colorClass, youtubeLink }) => {
    // Determine the icon component to render (handles both string names and direct components if any left)
    const IconComponent = iconMap[icon] || FaGraduationCap;

    return (
        <div className="glass-card hover-y transition-all h-100 training-card">
            <div className="d-flex justify-content-between align-items-start">
                <div className={`glass-icon mb-3 ${colorClass}`} style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                    <IconComponent />
                </div>
                <div className={`badge-pill bg-${colorClass.replace('text-', '')} text-white`}>
                    {division}
                </div>
            </div>

            <h3 className="h5 text-white fw-bold mb-2">{title}</h3>
            <p className="text-secondary small mb-4 flex-grow-1">{description}</p>

            <div className="tags-container justify-content-start mb-4">
                {skills.map((skill, i) => (
                    <span key={i} className="glass-tag">
                        {skill}
                    </span>
                ))}
            </div>

            <div className="d-flex flex-wrap align-items-center justify-content-between text-secondary small mt-auto pt-3 border-top border-secondary-subtle">
                <span className="d-flex align-items-center text-warning">
                    <FaStar className="me-1" /> {rating} <span className="text-secondary ms-1">({reviews})</span>
                </span>
                <span className="d-flex align-items-center">
                    <FaClock className="me-1" /> {duration}
                </span>
            </div>

            <div className="d-flex flex-column gap-2 mt-3">
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeXOBgnnnquQmQHHU1Kbyw9iYfK7gJ6Kyj5T5OctIcyy4fXSA/viewform?usp=header"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{ fontWeight: 'bold' }}
                >
                    Enroll Now
                </a>
                <a href={youtubeLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light text-white btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
                    <FaYoutube size={16} className="text-danger" /> Watch on YouTube
                </a>
            </div>
        </div>
    );
};

const TrainingHub = () => {
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState('All');
    const [coursesList, setCoursesList] = useState(globalCache.training || []);

    // Handle deep-linking from URL parameters
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const category = queryParams.get('category');
        
        if (category) {
            const categoryMap = {
                'code': 'Code',
                'lab': 'Lab',
                'consult': 'Consult'
            };
            const mappedTrack = categoryMap[category.toLowerCase()];
            if (mappedTrack) {
                setActiveFilter(mappedTrack);
            }
        }
    }, [location]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'training_courses'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                const fetchedCourses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                globalCache.training = fetchedCourses;
                setCoursesList(fetchedCourses);
            },
            (error) => {
                console.error("Training courses collection error", error);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
    };

    const filteredCourses = activeFilter === 'All'
        ? coursesList
        : coursesList.filter(course => course.division.includes(activeFilter));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06, delayChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { y: 16, opacity: 0, scale: 0.97 },
        visible: { 
            y: 0, opacity: 1, scale: 1,
            transition: { duration: 0.35, ease: [0.19, 1, 0.22, 1] }
        }
    };

    return (
        <div className="page-container position-relative">
            <div className="page-background-glow" />

            <motion.div
                className="text-center section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">LEARNING ECOSYSTEM</div>
                <h1 className="text-gradient mb-3 display-4">Training Hub</h1>
                <p className="lead text-secondary mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Your centralized platform for mastering Kone Academy. Watch comprehensive guided video courses designed for researchers, analysts, and developers.
                </p>

                {/* Pill Filters */}
                <div className="nav-tabs-premium mb-5">
                    {['All', 'Consult', 'Code', 'Lab'].map(topic => (
                        <button
                            key={topic}
                            className={`tab-btn-premium ${activeFilter === topic ? 'active' : ''}`}
                            onClick={() => handleFilterClick(topic)}
                        >
                            {topic === 'All' ? 'All Tracks' : `Kone ${topic}`}
                        </button>
                    ))}
                </div>
            </motion.div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeFilter}
                    className="horizontal-scroll-container pb-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                >
                    {filteredCourses.map((course, index) => (
                        <motion.div key={course.id} className="scroll-item" variants={itemVariants}>
                            <CourseCard {...course} />
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default TrainingHub;
