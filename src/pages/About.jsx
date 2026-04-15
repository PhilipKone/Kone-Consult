import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaLinkedin, FaEnvelope, FaCheckCircle } from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { globalCache } from '../utils/cache';

const StatItem = ({ value, label }) => (
    <div className="d-flex flex-column align-items-center justify-content-center p-3">
        <h3 className="h2 fw-bold text-gradient mb-0">{value}</h3>
        <span className="text-secondary small text-uppercase tracking-wider opacity-75" style={{ fontSize: '0.7rem' }}>{label}</span>
    </div>
);

const defaultAboutEntries = [
    {
        id: 'default-founder',
        name: 'Philip Hotor',
        role: 'FOUNDER & LEAD',
        email: 'phconsultgh@gmail.com',
        linkedin: 'https://www.linkedin.com/in/philip-kone',
        missionTitle: 'To democratize access to high-level research.',
        missionText: 'We empower students, researchers, and businesses with the tools and clarity needed to excel in a data-driven world. Combining human expertise with cutting-edge AI for unparalleled accuracy.',
        stat1Value: '3+', stat1Label: 'Years',
        stat2Value: '50+', stat2Label: 'Projects',
        stat3Value: '100%', stat3Label: 'Satisfaction',
        tags: ['Data Science', 'Strategy', 'Quality Assurance']
    }
];

const About = () => {
    const [aboutData, setAboutData] = useState(globalCache.aboutEntries || defaultAboutEntries);
    const [loading, setLoading] = useState(!globalCache.aboutEntries);

    useEffect(() => {
        document.title = "About Us | The Team Behind Kone Consult Research";
        const unsubscribe = onSnapshot(
            query(collection(db, 'about_entries'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                const fetchedEntries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const newData = [...defaultAboutEntries, ...fetchedEntries];
                globalCache.aboutEntries = newData;
                setAboutData(newData);
                setLoading(false);
            },
            (error) => {
                console.log("About collection might not exist yet", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { duration: 0.5, staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
    };

    return (
        <div className="page-container">
            <div className="page-background-glow" />

            <motion.div
                className="text-center section-title d-flex flex-column align-items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">EST. 2024</div>
                <h1 className="text-gradient mb-3 display-4">About Us</h1>
                <p className="lead text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    We decode complexity. Kone Consult is the bridge between raw data and actionable intelligence.
                </p>
            </motion.div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <motion.div
                    className="horizontal-scroll-container pb-5 align-items-center justify-content-start"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {aboutData.map((entry) => (
                        <motion.div
                            key={entry.id}
                            className="scroll-item"
                            variants={itemVariants}
                            style={{ minWidth: '300px', maxWidth: '1000px', width: '90vw' }}
                        >
                            <div className="glass-card overflow-hidden p-0 h-100 hover-y transition-all">
                                <div className="row g-0 h-100">
                                    {/* LEFT COLUMN */}
                                    <div className="col-lg-5 position-relative d-flex flex-column p-4 p-md-5 text-center border-end border-white border-opacity-10" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                        <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center position-relative z-1">
                                            <div className="rounded-circle p-1 border border-primary border-opacity-50 mb-4 bg-dark bg-opacity-50 mx-auto" style={{ width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <FaUser size={50} className="text-secondary opacity-75" />
                                            </div>
                                            <h2 className="h3 text-white fw-bold mb-1">{entry.name}</h2>
                                            <p className="text-primary small letter-spacing-2 mb-0 fw-bold text-uppercase">{entry.role}</p>
                                        </div>

                                        <div className="d-flex gap-3 justify-content-center mt-auto pt-4 position-relative z-1">
                                            {entry.linkedin && (
                                                <a href={entry.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2">
                                                    <FaLinkedin /> Connect
                                                </a>
                                            )}
                                            {entry.email && (
                                                <a href={`mailto:${entry.email}`} className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2">
                                                    <FaEnvelope /> Email
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT COLUMN */}
                                    <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
                                        <div className="mb-4">
                                            <h3 className="fs-4 fs-md-2 fw-bold text-white mb-3">{entry.missionTitle}</h3>
                                            <p className="text-secondary lead fs-6 fs-md-5" style={{ lineHeight: '1.7' }}>
                                                {entry.missionText}
                                            </p>
                                        </div>

                                        {/* Stats Divider */}
                                        <div className="border-top border-white border-opacity-10 py-4 my-2">
                                            <div className="row g-0">
                                                <div className="col-4 border-end border-white border-opacity-10">
                                                    <StatItem value={entry.stat1Value} label={entry.stat1Label} />
                                                </div>
                                                <div className="col-4 border-end border-white border-opacity-10">
                                                    <StatItem value={entry.stat2Value} label={entry.stat2Label} />
                                                </div>
                                                <div className="col-4">
                                                    <StatItem value={entry.stat3Value} label={entry.stat3Label} />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills/Tags */}
                                        <div className="tags-container justify-content-start mt-auto pt-3">
                                            {entry.tags && entry.tags.map((tag, i) => (
                                                <motion.button
                                                    key={i}
                                                    className="glass-tag cursor-pointer border-0 d-flex align-items-center gap-2"
                                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 166, 255, 0.15)" }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <FaCheckCircle className="text-primary" /> {tag}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default About;
