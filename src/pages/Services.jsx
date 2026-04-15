import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChartBar, FaFileAlt, FaChalkboardTeacher, FaLightbulb, FaUserTie, FaEllipsisH } from 'react-icons/fa';
import TagModal from '../components/TagModal';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { globalCache } from '../utils/cache';

const defaultServices = [
    { id: 'default-1', icon: 'FaChartBar', title: "Data Analysis", description: "Transform raw data into actionable insights using advanced statistical methods and visualization tools.", tags: ["SPSS", "Python", "R", "Excel"], color: "text-primary" },
    { id: 'default-2', icon: 'FaFileAlt', title: "Report Writing", description: "Professional, academic, and technical report writing services tailored to your specific requirements.", tags: ["Academic", "Technical", "Business"], color: "text-success" },
    { id: 'default-3', icon: 'FaChalkboardTeacher', title: "Research Consulting", description: "End-to-end research support from methodology design to data collection and final analysis.", tags: ["Methodology", "Survey Design", "Analysis"], color: "text-warning" },
    { id: 'default-4', icon: 'FaLightbulb', title: "Topic Selection", description: "Guidance on selecting viable, impactful, and researchable topics for your thesis or project.", tags: ["Ideation", "Feasibility", "Scope"], color: "text-info" },
    { id: 'default-5', icon: 'FaUserTie', title: "Mentorship", description: "One-on-one mentorship sessions to guide you through your academic or professional research journey.", tags: ["Coaching", "Guidance", "Support"], color: "text-danger" },
    { id: 'default-6', icon: 'FaEllipsisH', title: "Other Services", description: "Custom solutions for unique research challenges. Contact us to discuss your specific needs.", tags: ["Custom", "Flexible", "Tailored"], color: "text-secondary" }
];

const iconMap = {
    'FaChartBar': FaChartBar,
    'FaFileAlt': FaFileAlt,
    'FaChalkboardTeacher': FaChalkboardTeacher,
    'FaLightbulb': FaLightbulb,
    'FaUserTie': FaUserTie,
    'FaEllipsisH': FaEllipsisH
};

const ServiceCard = ({ iconName, title, description, tags, color, onTagClick }) => {
    const Icon = iconMap[iconName] || FaEllipsisH;
    return (
        <div 
            className="glass-card hover-y transition-all h-100 cursor-pointer" 
            onClick={() => onTagClick(title)}
            style={{ display: 'flex', flexDirection: 'column' }}
        >
            <div className={`glass-icon mb-4 ${color}`} style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                <Icon />
            </div>
            <h3 className="h5 text-white fw-bold mb-3">{title}</h3>
            <p className="text-secondary small mb-4 flex-grow-1">{description}</p>

            <div className="tags-container justify-content-start mt-auto mb-4">
                {Array.isArray(tags) ? tags.map((tag, i) => (
                    <motion.button
                        key={i}
                        className="glass-tag cursor-pointer border-0"
                        onClick={(e) => {
                            e.stopPropagation();
                            onTagClick(tag);
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 166, 255, 0.15)" }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {tag}
                    </motion.button>
                )) : null}
            </div>

            <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeXOBgnnnquQmQHHU1Kbyw9iYfK7gJ6Kyj5T5OctIcyy4fXSA/viewform?usp=header"
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-100 text-center text-decoration-none"
                onClick={(e) => e.stopPropagation()}
                style={{ display: 'block', padding: '0.6rem', fontSize: '0.9rem', borderRadius: '4px' }}
            >
                Request Service
            </a>
        </div>
    );
};

const Services = () => {
    const [selectedTag, setSelectedTag] = useState(null);
    const [servicesData, setServicesData] = useState(globalCache.services || defaultServices);
    const [loading, setLoading] = useState(!globalCache.services);
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryFilter = searchParams.get('cat');

    useEffect(() => {
        document.title = categoryFilter ? `${categoryFilter.replace(/-/g, ' ')} | Kone Consult Services` : "Services | Kone Consult Research Solutions";
        const unsubscribe = onSnapshot(
            query(collection(db, 'services'), orderBy('createdAt', 'asc')),
            (snapshot) => {
                const fetchedServices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const newData = [...defaultServices, ...fetchedServices];
                globalCache.services = newData;
                setServicesData(newData);
                setLoading(false);
            },
            (error) => {
                console.log("Services collection might not exist yet", error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [categoryFilter]);

    const filteredServices = categoryFilter 
        ? servicesData.filter(service => 
            service.title.toLowerCase().includes(categoryFilter.toLowerCase().replace('academic-', '').replace('business-', '').replace('software-', '').replace('-analysis', '').replace('-research', '')) ||
            (service.category && service.category.toLowerCase() === categoryFilter.toLowerCase())
          )
        : servicesData;

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
                <div className="badge mb-3">OUR EXPERTISE</div>
                <h1 className="text-gradient mb-3 display-4">Services</h1>
                <p className="lead text-secondary mb-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Comprehensive research and data solutions. Click on any tool tag to learn more.
                </p>

                {categoryFilter && (
                    <div className="d-flex justify-content-center mb-4">
                        <button 
                            className="filter-pill active d-flex align-items-center gap-2"
                            onClick={() => setSearchParams({})}
                        >
                            Filtering: {categoryFilter.replace(/-/g, ' ')} <span style={{ opacity: 0.7 }}>&times;</span>
                        </button>
                    </div>
                )}
            </motion.div>

            {loading ? (
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-5">
                    <p className="text-secondary">No services found for "{categoryFilter}".</p>
                    <button className="btn btn-outline-primary mt-2" onClick={() => setSearchParams({})}>Show All Services</button>
                </div>
            ) : (
                <motion.div
                    className="horizontal-scroll-container pb-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredServices.map((service) => (
                        <motion.div key={service.id} className="scroll-item" variants={itemVariants}>
                            <ServiceCard
                                title={service.title}
                                description={service.description}
                                iconName={service.icon}
                                tags={service.tags}
                                color={service.color}
                                onTagClick={setSelectedTag}
                            />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default Services;
