import React from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaFileAlt, FaChalkboardTeacher, FaLightbulb, FaUserTie, FaEllipsisH } from 'react-icons/fa';

const services = [
    {
        icon: <FaChartBar />,
        title: "Data Analysis",
        description: "Transform raw data into actionable insights using advanced statistical methods and visualization tools.",
        tags: ["SPSS", "Python", "R", "Excel"]
    },
    {
        icon: <FaFileAlt />,
        title: "Report Writing",
        description: "Professional, academic, and technical report writing services tailored to your specific requirements.",
        tags: ["Academic", "Technical", "Business"]
    },
    {
        icon: <FaChalkboardTeacher />,
        title: "Research Consulting",
        description: "End-to-end research support from methodology design to data collection and final analysis.",
        tags: ["Methodology", "Survey Design", "Analysis"]
    },
    {
        icon: <FaLightbulb />,
        title: "Topic Selection",
        description: "Guidance on selecting viable, impactful, and researchable topics for your thesis or project.",
        tags: ["Ideation", "Feasibility", "Scope"]
    },
    {
        icon: <FaUserTie />,
        title: "Mentorship",
        description: "One-on-one mentorship sessions to guide you through your academic or professional research journey.",
        tags: ["Coaching", "Guidance", "Support"]
    },
    {
        icon: <FaEllipsisH />,
        title: "Other Services",
        description: "Custom solutions for unique research challenges. Contact us to discuss your specific needs.",
        tags: ["Custom", "Flexible", "Tailored"]
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

const Services = () => {
    return (
        <div className="page-container container" style={{ paddingTop: '100px', minHeight: '100vh' }}>
            <div className="page-background-glow" />

            <motion.div
                className="text-center mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">SYSTEM SERVICES</div>
                <h1 className="text-gradient mb-3 display-4">Our Capabilities</h1>
                <p className="lead text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    Comprehensive research and data solutions designed to accelerate your academic and professional success.
                </p>
            </motion.div>

            <motion.div
                className="row g-4 pb-5"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {services.map((service, index) => (
                    <motion.div className="col-lg-4 col-md-6" key={index} variants={itemVariants}>
                        <div className="terminal-card h-100 p-0">
                            <div className="terminal-header">
                                <div className="dot red"></div>
                                <div className="dot yellow"></div>
                                <div className="dot green"></div>
                                <span className="ms-2 text-secondary small font-monospace">service_module_{index + 1}.exe</span>
                            </div>
                            <div className="p-4">
                                <div className="text-accent-primary mb-3" style={{ fontSize: '2rem' }}>
                                    {service.icon}
                                </div>
                                <h3 className="h4 text-primary mb-3">{service.title}</h3>
                                <p className="text-secondary mb-4">{service.description}</p>
                                <div className="d-flex flex-wrap gap-2">
                                    {service.tags.map((tag, i) => (
                                        <span key={i} className="badge bg-dark text-secondary border border-secondary rounded-pill fw-normal">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Services;
