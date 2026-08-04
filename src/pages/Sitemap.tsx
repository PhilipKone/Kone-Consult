import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaExternalLinkAlt, FaBriefcase, FaUserShield, FaGlobe } from 'react-icons/fa';
import './Sitemap.css';

const Sitemap: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const SCHEMA_ID = 'sitemap-breadcrumb-jsonld';
    let script = document.getElementById(SCHEMA_ID);
    if (script) script.remove();

    script = document.createElement('script');
    script.id = SCHEMA_ID;
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Kone Consult",
          "item": "https://consult.koneacademy.io/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Sitemap",
          "item": "https://consult.koneacademy.io/sitemap"
        }
      ]
    });
    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(SCHEMA_ID);
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="consult-sitemap-page">
      {/* Header action bar */}
      <div className="consult-sitemap-header">
        <button onClick={handleBack} className="consult-sitemap-back-btn">
          <FaChevronLeft /> Back
        </button>
        <span className="consult-sitemap-brand">Kone Consult Index</span>
      </div>

      <div className="consult-sitemap-container">
        <div className="consult-sitemap-card">
          <h1 className="consult-sitemap-title">Kone Consult Sitemap</h1>
          <p className="consult-sitemap-subtitle">
            Local platform index for enterprise software consulting, digital architecture blueprints, and smart system integrations.
          </p>

          <div className="consult-sitemap-grid">
            {/* Column 1: Core Consulting Routes */}
            <div className="consult-sitemap-column">
              <div className="consult-sitemap-col-header">
                <FaBriefcase className="consult-sitemap-icon" />
                <h2>Platform Routes</h2>
              </div>
              <div className="consult-sitemap-list">
                <div className="consult-sitemap-item">
                  <a href="/" className="consult-sitemap-link">
                    Consulting Homepage
                  </a>
                  <p className="consult-sitemap-desc">Kone Consult landing page for tech services, smart systems, and corporate case studies.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="/services" className="consult-sitemap-link">
                    Services & Solutions
                  </a>
                  <p className="consult-sitemap-desc">Comprehensive directory of engineering capabilities, embedded hardware, and AI development.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="/about" className="consult-sitemap-link">
                    About Our Mission
                  </a>
                  <p className="consult-sitemap-desc">Our history, methodologies, and engineering core values.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="/contact" className="consult-sitemap-link">
                    Contact & Booking
                  </a>
                  <p className="consult-sitemap-desc">Schedule architecture reviews, project scoping, and enterprise consults.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="/blog" className="consult-sitemap-link">
                    Engineering Blog
                  </a>
                  <p className="consult-sitemap-desc">Technical deep dives, local SEO updates, and system architecture guides.</p>
                </div>
              </div>
            </div>

            {/* Column 2: Client Portal & Ecosystem */}
            <div className="consult-sitemap-column">
              <div className="consult-sitemap-col-header">
                <FaUserShield className="consult-sitemap-icon" />
                <h2>Client Portals & Ecosystem</h2>
              </div>
              <div className="consult-sitemap-list">
                <div className="consult-sitemap-item">
                  <a href="/client-portal" className="consult-sitemap-link">
                    Secure Client Portal
                  </a>
                  <p className="consult-sitemap-desc">Dashboard for active clients to track deliverables, invoices, and message feeds.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="/pay" className="consult-sitemap-link">
                    Kone Pay Invoice System
                  </a>
                  <p className="consult-sitemap-desc">Programmatic client payment interface for secure retainer settlements.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="https://www.koneacademy.io" className="consult-sitemap-link" target="_blank" rel="noopener noreferrer">
                    Kone Academy Main Hub <FaExternalLinkAlt className="consult-external-icon" />
                  </a>
                  <p className="consult-sitemap-desc">Parent company landing page containing central index protocols and specs.</p>
                </div>
                <div className="consult-sitemap-item">
                  <a href="https://www.koneacademy.io/sitemap" className="consult-sitemap-link" target="_blank" rel="noopener noreferrer">
                    Central Sitemap Hub <FaExternalLinkAlt className="consult-external-icon" />
                  </a>
                  <p className="consult-sitemap-desc">Central link directory connecting all 11 subdomains.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
