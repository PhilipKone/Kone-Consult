import React from 'react';
import { FaEdit, FaTrash, FaChartBar, FaFileAlt, FaChalkboardTeacher, FaLightbulb, FaUserTie, FaEllipsisH } from 'react-icons/fa';

const iconMap = {
    'FaChartBar': FaChartBar,
    'FaFileAlt': FaFileAlt,
    'FaChalkboardTeacher': FaChalkboardTeacher,
    'FaLightbulb': FaLightbulb,
    'FaUserTie': FaUserTie,
    'FaEllipsisH': FaEllipsisH
};

const ServiceList = ({ services, onEdit, onDelete }) => {
    if (services.length === 0) {
        return (
            <div className="text-center p-5 border border-dark rounded bg-dark">
                <p className="text-secondary mb-0">No services found. Click "New Service" to add one.</p>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
                <thead>
                    <tr>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Icon & Title</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Category</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Description</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Tags</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3 text-end">Actions</th>
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {services.map((service) => {
                        const IconComponent = iconMap[service.icon] || FaEllipsisH;
                        return (
                            <tr key={service.id} className="border-bottom border-dark">
                                <td className="py-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded p-2 bg-dark d-flex align-items-center justify-content-center ${service.color}`} style={{ width: '40px', height: '40px' }}>
                                            <IconComponent size={20} />
                                        </div>
                                        <div>
                                            <h6 className="mb-0 text-white fw-bold">{service.title}</h6>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <span className="badge bg-dark border border-secondary text-secondary small px-2 py-1">
                                        {service.category || 'General'}
                                    </span>
                                </td>
                                <td className="py-3 text-secondary small" style={{ maxWidth: '300px' }}>
                                    {service.description}
                                </td>
                                <td className="py-3">
                                    <div className="d-flex flex-wrap gap-1">
                                        {Array.isArray(service.tags) ? service.tags.map((tag, index) => (
                                            <span key={index} className="badge bg-secondary text-light rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                                {tag}
                                            </span>
                                        )) : <span className="text-secondary small">{service.tags}</span>}
                                    </div>
                                </td>
                                <td className="py-3 text-end">
                                    <div className="d-flex gap-2 justify-content-end">
                                        <button
                                            onClick={() => onEdit(service)}
                                            className="btn btn-action-premium text-info"
                                            title="Edit Service"
                                        >
                                            <FaEdit size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(service.id)}
                                            className="btn btn-action-premium text-danger"
                                            title="Delete Service"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ServiceList;
