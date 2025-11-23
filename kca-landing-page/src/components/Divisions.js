import React from 'react';
import './Divisions.css';

const Divisions = () => {
  const divisions = [
    {
      id: 'research',
      title: 'Research',
      subtitle: 'Kone Consult',
      icon: '🔬',
      description: 'Academic research, data analysis, and thesis mentorship.',
      features: ['Topic Selection', 'Data Analysis', 'Thesis Writing'],
      status: 'Active',
      link: 'https://PhilipKone.github.io/Kone-Consult'
    },
    {
      id: 'coding',
      title: 'Coding',
      subtitle: 'Kone Code',
      icon: '💻',
      description: 'Programming courses from Python to C++ and R.',
      features: ['Python Masterclass', 'Web Development', 'Data Science'],
      status: 'Enrollment Open',
      link: '#'
    },
    {
      id: 'engineering',
      title: 'Engineering',
      subtitle: 'Kone Lab',
      icon: '🛠️',
      description: 'Practical engineering, 3D modeling, and embedded systems.',
      features: ['Arduino', '3D Printing', 'Circuit Design'],
      status: 'Lab Access',
      link: '#'
    }
  ];

  return (
    <section className="divisions" id="divisions">
      <div className="section-header">
        <h2 className="section-title">Core <span className="text-gradient">Modules</span></h2>
        <p className="section-subtitle">Select a specialized division to begin your journey.</p>
      </div>

      <div className="divisions-grid">
        {divisions.map((div) => (
          <div key={div.id} className="division-card glass-panel">
            <div className="card-header">
              <div className="card-icon">{div.icon}</div>
              <div className="card-status">
                <span className="status-dot"></span>
                {div.status}
              </div>
            </div>

            <div className="card-content">
              <h3 className="card-title">{div.title}</h3>
              <p className="card-subtitle">{div.subtitle}</p>
              <p className="card-description">{div.description}</p>

              <div className="card-features">
                {div.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>

            <div className="card-footer">
              <a href={div.link} className="btn-link" target={div.link !== '#' ? "_blank" : "_self"} rel="noopener noreferrer">
                Access Module &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Divisions;
