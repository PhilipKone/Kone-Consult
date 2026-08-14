import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartLine, 
  FaTachometerAlt, 
  FaDatabase, 
  FaGraduationCap, 
  FaFileAlt, 
  FaBook, 
  FaUserShield, 
  FaPhoneAlt, 
  FaMicroscope, 
  FaShieldAlt 
} from 'react-icons/fa';

interface GSCSidebarProps {
  collapsed: boolean;
  onClose?: () => void;
}

const GSCSidebar: React.FC<GSCSidebarProps> = ({ collapsed, onClose }) => {
  const location = useLocation();

  const handleNavClick = () => {
    if (onClose && window.innerWidth < 768) {
      onClose();
    }
  };

  const isLinkActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`gsc-sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* 1. Overview Section */}
      <div className="gsc-sidebar-section">
        <div className="gsc-sidebar-heading">Analytics Engine</div>
        
        <Link 
          to="/" 
          className={`gsc-nav-item ${isLinkActive('/') ? 'active' : ''}`}
          onClick={handleNavClick}
          title="Overview & Live Telemetry"
        >
          <FaTachometerAlt className="gsc-nav-icon" color="#8ab4f8" />
          <span className="gsc-nav-text">Overview</span>
        </Link>

        <a 
          href="#performance-section" 
          className="gsc-nav-item"
          onClick={handleNavClick}
          title="Search Performance & Traffic"
        >
          <FaChartLine className="gsc-nav-icon" color="#c58af9" />
          <span className="gsc-nav-text">Performance</span>
        </a>
      </div>

      {/* 2. Research & Consulting Services */}
      <div className="gsc-sidebar-section">
        <div className="gsc-sidebar-heading">Consulting Services</div>

        <Link 
          to="/services" 
          className={`gsc-nav-item ${isLinkActive('/services') ? 'active' : ''}`}
          onClick={handleNavClick}
          title="Statistical Data Analysis (SPSS, R, Python)"
        >
          <FaDatabase className="gsc-nav-icon" color="#81c995" />
          <span className="gsc-nav-text">Data Analysis (SPSS/R)</span>
        </Link>

        <Link 
          to="/services" 
          className="gsc-nav-item"
          onClick={handleNavClick}
          title="Thesis Consulting & Research"
        >
          <FaGraduationCap className="gsc-nav-icon" color="#fdd663" />
          <span className="gsc-nav-text">Thesis Consulting</span>
        </Link>

        <Link 
          to="/services" 
          className="gsc-nav-item"
          onClick={handleNavClick}
          title="Scientific Publications & Review"
        >
          <FaMicroscope className="gsc-nav-icon" color="#8ab4f8" />
          <span className="gsc-nav-text">Journal Publications</span>
        </Link>
      </div>

      {/* 3. Protocols & Documentation */}
      <div className="gsc-sidebar-section">
        <div className="gsc-sidebar-heading">Documentation</div>

        <a 
          href="https://www.koneacademy.io/docs" 
          target="_blank" 
          rel="noopener noreferrer"
          className="gsc-nav-item"
          onClick={handleNavClick}
          title="Technical Protocols & Documentation"
        >
          <FaBook className="gsc-nav-icon" color="#9aa0a6" />
          <span className="gsc-nav-text">Protocols & Docs</span>
        </a>

        <Link 
          to="/blog" 
          className={`gsc-nav-item ${isLinkActive('/blog') ? 'active' : ''}`}
          onClick={handleNavClick}
          title="Research Insights & Case Studies"
        >
          <FaFileAlt className="gsc-nav-icon" color="#9aa0a6" />
          <span className="gsc-nav-text">Insights & Blog</span>
        </Link>
      </div>

      {/* 4. Client Workspace & Security */}
      <div className="gsc-sidebar-section">
        <div className="gsc-sidebar-heading">Client Portal</div>

        <Link 
          to="/client-portal" 
          className={`gsc-nav-item ${isLinkActive('/client-portal') ? 'active' : ''}`}
          onClick={handleNavClick}
          title="Secure Client Research Workspace"
        >
          <FaUserShield className="gsc-nav-icon" color="#81c995" />
          <span className="gsc-nav-text">Client Workspace</span>
        </Link>

        <Link 
          to="/contact" 
          className={`gsc-nav-item ${isLinkActive('/contact') ? 'active' : ''}`}
          onClick={handleNavClick}
          title="Contact Consulting Team"
        >
          <FaPhoneAlt className="gsc-nav-icon" color="#fdd663" />
          <span className="gsc-nav-text">Contact & Proposals</span>
        </Link>
      </div>
    </aside>
  );
};

export default GSCSidebar;
