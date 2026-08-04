import React from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaChartBar, FaBookOpen, FaChevronRight } from 'react-icons/fa';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import './Home.css';

const Home: React.FC = () => {
    React.useEffect(() => {
        if (localStorage.getItem('scrollToJournalClub') === 'true') {
            localStorage.removeItem('scrollToJournalClub');
            // 400ms gives the lazy-loaded Hero component time to fully render
            setTimeout(() => {
                const element = document.getElementById('journal-club');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 400);
        }
    }, []);

    return (
        <div className="home-page">
            <SEO 
                title="Research & Data Analysis Excellence" 
                description="Kone Consult: High-performance research assistance, specialized statistical data analysis (SPSS, R, Python), thesis consulting, and grant proposals." 
            />
            
            {/* Main Hero Section with Live Telemetry Analytics Visual Card */}
            <Hero />

            {/* Featured Research Services Section */}
            <section className="featured-services-section">
                <div className="featured-services-header">
                    <div className="badge">OUR EXPERTISE</div>
                    <h2 className="text-gradient">Featured Services</h2>
                    <p>High-fidelity statistical analysis, thesis consulting, and journal publishing support tailored for scholars, researchers, and organizations.</p>
                </div>

                <div className="featured-services-grid">
                    <div className="featured-service-card">
                        <div className="featured-service-icon">
                            <FaGraduationCap />
                        </div>
                        <h3>Thesis Guidance</h3>
                        <p>End-to-end consulting support for academic research papers, thesis structures, and proposal development.</p>
                    </div>

                    <div className="featured-service-card green">
                        <div className="featured-service-icon">
                            <FaChartBar />
                        </div>
                        <h3>Data Analysis</h3>
                        <p>Advanced statistical processing, regression models, and visualizations using Python, R, SPSS, and STATA environments.</p>
                    </div>

                    <div className="featured-service-card warning">
                        <div className="featured-service-icon">
                            <FaBookOpen />
                        </div>
                        <h3>Publication Support</h3>
                        <p>Guidance on academic journal submissions, paper formatting, open peer review alignment with PREreview.org, and copyediting.</p>
                    </div>
                </div>

                <div className="featured-services-footer text-center">
                    <Link to="/services" className="btn-primary">
                        View All Services <FaChevronRight />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
