import React from 'react';
import { FaEnvelope, FaProjectDiagram } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab, unreadCount }) => {
    return (
        <div className="d-flex flex-column gap-2">
            <button
                onClick={() => setActiveTab('messages')}
                className={`btn text-start p-2 rounded d-flex align-items-center justify-content-between sidebar-btn ${activeTab === 'messages' ? 'active' : ''}`}
            >
                <span className="d-flex align-items-center gap-2 small fw-bold">
                    <FaEnvelope /> Messages
                </span>
                {unreadCount > 0 && (
                    <span className="badge bg-danger rounded-pill message-badge">{unreadCount}</span>
                )}
            </button>
            <button
                onClick={() => setActiveTab('projects')}
                className={`btn text-start p-2 rounded d-flex align-items-center gap-2 sidebar-btn ${activeTab === 'projects' ? 'active' : ''}`}
            >
                <FaProjectDiagram /> <span className="small fw-bold">Projects</span>
            </button>
        </div>
    );
};

export default Sidebar;
