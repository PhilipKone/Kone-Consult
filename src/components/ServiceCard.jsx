import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaFileAlt, FaLightbulb, FaSearch, FaHandsHelping, FaBook } from 'react-icons/fa';

const iconMap = {
    'chart-line': FaChartLine,
    'file-alt': FaFileAlt,
    'lightbulb': FaLightbulb,
    'search': FaSearch,
    'hands-helping': FaHandsHelping,
    'book': FaBook
};

const ServiceCard = ({ title, description, icon, link, color }) => {
    const IconComponent = iconMap[icon] || FaLightbulb;

    return (
        <div className="card glass-panel p-4 h-100 service-card">
            <div className="icon mb-3" style={{ color: `var(--accent-${color})`, fontSize: '2.5rem' }}>
                <IconComponent />
            </div>
            <div className="card-body">
                <h3 className="card-title h4 mb-3 text-primary">{title}</h3>
                <p className="card-text text-secondary mb-4">{description}</p>
                <Link to={link} className={`btn btn-sm btn-outline-${color === 'primary' ? 'primary' : 'secondary'}`}>
                    Learn More
                </Link>
            </div>
        </div>
    );
};

export default ServiceCard;
