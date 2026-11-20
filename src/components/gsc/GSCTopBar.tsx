import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaSearch, FaCheckCircle, FaGlobe, FaChevronDown, FaLock, FaCalendarAlt } from 'react-icons/fa';
import { Logo } from '../Logo';

interface GSCTopBarProps {
  onToggleSidebar: () => void;
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
}

const GSCTopBar: React.FC<GSCTopBarProps> = ({
  onToggleSidebar,
  selectedDomain,
  onSelectDomain
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [inspectUrl, setInspectUrl] = useState('');

  const domains = [
    { id: 'sc-domain:koneacademy.io', label: 'sc-domain:koneacademy.io (Full Ecosystem)', icon: '🌐' },
    { id: 'consult.codkon.com', label: 'consult.codkon.com (Consulting & Research)', icon: '📊' },
    { id: 'kids.codkon.com', label: 'kids.codkon.com (STEM Education)', icon: '👶' },
    { id: 'code.codkon.com', label: 'code.codkon.com (Software & IDE)', icon: '💻' },
    { id: 'farms.codkon.com', label: 'farms.codkon.com (Agritech & Bio)', icon: '🌱' },
    { id: 'academy.codkon.com', label: 'academy.codkon.com (Main Academy Hub)', icon: '🏛️' }
  ];

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectUrl) return;
    alert(`URL Inspection simulation for: ${inspectUrl}\nStatus: URL is on Google and indexed with valid Schema metadata.`);
  };

  return (
    <header className="gsc-topbar">
      <div className="gsc-topbar-left">
        <button className="gsc-menu-toggle" onClick={onToggleSidebar} title="Toggle Navigation Drawer">
          <FaBars />
        </button>

        <Link to="/" className="gsc-brand">
          <Logo size={28} />
          <span>Kone Consult</span>
          <span className="gsc-brand-badge">Console</span>
        </Link>

        {/* Property Selector */}
        <div className="gsc-property-picker">
          <button 
            className="gsc-property-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title="Switch Ecosystem Property"
          >
            <FaGlobe color="#8ab4f8" />
            <span>{selectedDomain}</span>
            <FaChevronDown size={10} color="#9aa0a6" />
          </button>

          {dropdownOpen && (
            <div className="gsc-property-dropdown">
              <div style={{ padding: '6px 16px', fontSize: '0.75rem', color: '#9aa0a6', textTransform: 'uppercase', fontWeight: 600 }}>
                Verified Domain Properties
              </div>
              {domains.map(d => (
                <div 
                  key={d.id}
                  className={`gsc-property-item ${selectedDomain === d.id ? 'active' : ''}`}
                  onClick={() => {
                    onSelectDomain(d.id);
                    setDropdownOpen(false);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{d.icon}</span>
                    <span>{d.label}</span>
                  </div>
                  {selectedDomain === d.id && <FaCheckCircle color="#81c995" size={12} />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* URL Inspection Search Bar */}
      <form className="gsc-url-inspect-box" onSubmit={handleInspectSubmit}>
        <FaSearch className="gsc-url-inspect-icon" />
        <input 
          type="text" 
          className="gsc-url-inspect-input"
          placeholder="Inspect any URL in koneacademy.io (e.g. /services)"
          value={inspectUrl}
          onChange={(e) => setInspectUrl(e.target.value)}
        />
      </form>

      {/* Action Buttons */}
      <div className="gsc-topbar-actions">
        <Link to="/contact" className="gsc-cta-btn" title="Book a Consultation Call">
          <FaCalendarAlt size={12} />
          <span>Book Call</span>
        </Link>
        <Link to="/client-portal" className="gsc-client-portal-link" style={{ color: '#8ab4f8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <FaLock size={12} />
          <span>Client Portal</span>
        </Link>
      </div>
    </header>
  );
};

export default GSCTopBar;
