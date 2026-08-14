import React from 'react';
import { Link } from 'react-router-dom';
import { FaDatabase, FaGraduationCap, FaMicroscope, FaArrowRight, FaCalendarCheck } from 'react-icons/fa';

const GSCServicesSection: React.FC = () => {
  return (
    <div className="gsc-card">
      <div className="gsc-card-header">
        <div>
          <h2 className="gsc-card-title">Consulting Solutions & Research Protocols</h2>
          <span style={{ fontSize: '0.8rem', color: '#9aa0a6' }}>
            High-performance statistical analysis, thesis consulting, and publication readiness
          </span>
        </div>
      </div>

      <div className="gsc-solutions-grid">
        {/* Solution 1 */}
        <div className="gsc-solution-card">
          <div>
            <div className="gsc-solution-header">
              <div className="gsc-solution-icon">
                <FaDatabase />
              </div>
              <h3 className="gsc-solution-title">Data Analysis (SPSS, R, Python)</h3>
            </div>
            <p className="gsc-solution-desc">
              Advanced statistical modeling, regression analysis, ANOVA, multivariate hypothesis testing, and interactive dashboard visualizations.
            </p>
          </div>
          <Link to="/services" className="gsc-solution-btn">
            <span>Explore Data Solutions</span>
            <FaArrowRight size={11} />
          </Link>
        </div>

        {/* Solution 2 */}
        <div className="gsc-solution-card green">
          <div>
            <div className="gsc-solution-header">
              <div className="gsc-solution-icon">
                <FaGraduationCap />
              </div>
              <h3 className="gsc-solution-title">Thesis & Grant Consulting</h3>
            </div>
            <p className="gsc-solution-desc">
              Rigorous methodological framework structuring, grant proposal formulation, literature synthesis, and dissertation defense preparation.
            </p>
          </div>
          <Link to="/services" className="gsc-solution-btn">
            <span>Thesis Guidance Scope</span>
            <FaArrowRight size={11} />
          </Link>
        </div>

        {/* Solution 3 */}
        <div className="gsc-solution-card orange">
          <div>
            <div className="gsc-solution-header">
              <div className="gsc-solution-icon">
                <FaMicroscope />
              </div>
              <h3 className="gsc-solution-title">Publication & Review</h3>
            </div>
            <p className="gsc-solution-desc">
              Pre-submission peer review alignment, journal matching, reproducibility verification, and PREreview.org open scholarship workflows.
            </p>
          </div>
          <Link to="/services" className="gsc-solution-btn">
            <span>Publication Readiness</span>
            <FaArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* High-Contrast Conversion Banner */}
      <div style={{ padding: '0 1.5rem 1.5rem' }}>
        <div className="gsc-conversion-banner">
          <div className="gsc-conversion-text">
            <h3>Ready to Accelerate Your Research or Corporate Data?</h3>
            <p>Connect directly with our senior statistical consultants for customized methodology scoping.</p>
          </div>
          <Link to="/contact" className="gsc-cta-btn" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
            <FaCalendarCheck />
            <span>Book Consultation Call</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GSCServicesSection;
