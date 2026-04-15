import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import './Header.css';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [isCollaborationsOpen, setIsCollaborationsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const ADMIN_EMAIL = 'phconsultgh@gmail.com';
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const hubUrl = isLocal ? 'http://localhost:5173/' : 'https://www.koneacademy.io/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            setScrollProgress(scrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes or screen resizes to desktop
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= 991;
            setIsMobile(mobile);
            if (!mobile) setIsMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location]);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''}`}>
            <AnimatePresence>
                {(isResourcesOpen || isProgramsOpen || isCollaborationsOpen) && (
                    <motion.div
                        className="nav-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                            setIsResourcesOpen(false);
                            setIsProgramsOpen(false);
                            setIsCollaborationsOpen(false);
                        }}
                    />
                )}
            </AnimatePresence>
            {/* Scroll Progress Bar */}
            <div
                className="scroll-progress-bar"
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    height: '2px',
                    background: 'var(--accent-primary)',
                    width: `${scrollProgress}%`,
                    transition: 'width 0.1s ease-out',
                    boxShadow: '0 0 10px var(--accent-primary)'
                }}
            />
            <div className="header-container">
                <Link to="/" className="logo">
                    <Logo size={32} className="logo-symbol" />
                    <span className="logo-text">Kone Consult</span>
                </Link>
                <div className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <FaTimes /> : <FaBars />}
                </div>


                <motion.nav 
                    className="nav-menu"
                    initial={false}
                    animate={(!isMobile || isMenuOpen) ? "open" : "closed"}
                    variants={{
                        open: { 
                            x: 0,
                            transition: { 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 30,
                                staggerChildren: 0.07,
                                delayChildren: 0.2
                            } 
                        },
                        closed: { 
                            x: "100%",
                            transition: { 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 40,
                                staggerChildren: 0.05,
                                staggerDirection: -1
                            } 
                        }
                    }}
                >
                    <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}>
                        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    </motion.div>


                    <motion.div 
                        className={`nav-dropdown mega-menu-trigger ${isProgramsOpen ? 'active' : ''}`}
                        style={{ zIndex: 1001 }}
                        variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}
                    >
                        <div
                            className={`nav-link dropdown-trigger ${location.pathname.startsWith('/programs') ? 'active' : ''}`}
                            onClick={() => {
                                setIsProgramsOpen(!isProgramsOpen);
                                setIsCollaborationsOpen(false);
                                setIsResourcesOpen(false);
                            }}
                        >
                            Programs
                        </div>

                        <AnimatePresence>
                            {isProgramsOpen && (
                                <motion.div
                                    className="dropdown-menu mega-menu"
                                    initial={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    animate={window.innerWidth > 991 ? { opacity: 1, scale: 1, y: 0, x: "-50%" } : { opacity: 1, height: "auto" }}
                                    exit={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    style={{ zIndex: 1002, overflow: 'hidden' }}
                                >
                                    <div className="mega-menu-grid">
                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Tuition Program</h4>
                                            <Link to="/training?mode=online" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Online</Link>
                                            <Link to="/training?mode=face-to-face" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Face-to-face</Link>
                                            <Link to="/training?mode=hybrid" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Hybrid</Link>
                                            <Link to="/training?mode=instructor-led" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Instructor-led</Link>
                                            <Link to="/training?mode=self-directed" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Self-directed</Link>
                                        </div>
                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Research Program</h4>
                                            <Link to="/services?cat=academic-research" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Academic Research</Link>
                                            <Link to="/services?cat=business-research" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Business Research</Link>
                                            <Link to="/services?cat=software-research" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Software Research</Link>
                                            <Link to="/services?cat=topic-selection" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Topic Selection</Link>
                                            <Link to="/services?cat=mentorship" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Research Mentorship</Link>

                                            <h4 className="mega-menu-title mt-3">Data Analysis</h4>
                                            <Link to="/services?cat=academic-analysis" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Academic Data Analysis</Link>
                                            <Link to="/services?cat=business-analysis" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Business Data Analysis</Link>
                                            <Link to="/services?cat=software-analysis" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Software Data Analysis</Link>
                                        </div>
                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Writing Program</h4>
                                            <Link to="/services?cat=academic-grants" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Academic Grants</Link>
                                            <Link to="/services?cat=academic-thesis" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Academic Thesis</Link>
                                            <Link to="/services?cat=academic-reports" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Academic Reports</Link>
                                            <Link to="/services?cat=business-grants" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Business Grants</Link>
                                            <Link to="/services?cat=business-reports" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Business Reports</Link>
                                            <Link to="/services?cat=software-docs" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Software Documentations</Link>
                                        </div>
                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Communication</h4>
                                            <Link to="/training?cat=video-tutorials" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Featured Tutorial Videos</Link>
                                            <Link to="/training?cat=podcasts" className="dropdown-item" onClick={() => setIsProgramsOpen(false)}>Podcasts</Link>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Collaborations Mega Menu */}
                    <motion.div
                        className={`nav-dropdown mega-menu-trigger ${isCollaborationsOpen ? 'active' : ''}`}
                        style={{ zIndex: 1001 }}
                        variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}
                    >
                        <div
                            className={`nav-link dropdown-trigger ${location.pathname.startsWith('/collaborations') ? 'active' : ''}`}
                            onClick={() => {
                                setIsCollaborationsOpen(!isCollaborationsOpen);
                                setIsProgramsOpen(false);
                                setIsResourcesOpen(false);
                            }}
                        >
                            Collaborations
                        </div>

                        <AnimatePresence>
                            {isCollaborationsOpen && (
                                <motion.div
                                    className="dropdown-menu mega-menu"
                                    initial={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    animate={window.innerWidth > 991 ? { opacity: 1, scale: 1, y: 0, x: "-50%" } : { opacity: 1, height: "auto" }}
                                    exit={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    style={{ zIndex: 1002, overflow: 'hidden' }}
                                >
                                    <div className="mega-menu-grid">
                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">JOURNAL CLUB</h4>
                                            <p className="mega-menu-subtitle small text-accent-primary mb-2">with PREreview</p>
                                            <a
                                                href="/"
                                                className="dropdown-item"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setIsCollaborationsOpen(false);
                                                    const element = document.getElementById('journal-club');
                                                    if (element) {
                                                        // Already on home page — scroll directly
                                                        element.scrollIntoView({ behavior: 'smooth' });
                                                    } else {
                                                        // On another page — navigate home first, then scroll
                                                        localStorage.setItem('scrollToJournalClub', 'true');
                                                        navigate('/');
                                                    }
                                                }}
                                            >
                                                Kone Consult Journal Club
                                            </a>
                                        </div>


                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Coding & AI</h4>
                                            <p className="mega-menu-subtitle small text-accent-primary mb-2">with Kone Code</p>
                                            <div className="mega-menu-sublabel text-white small fw-bold mb-1">Coding Schools</div>
                                            <Link to="/training?track=python" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Data Science</Link>
                                            <Link to="/training?track=js" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>App Dev</Link>
                                            <Link to="/training?track=r-matlab" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Game Dev</Link>
                                            <Link to="/training?track=cpp" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Coding for Kids</Link>

                                            <div className="mega-menu-sublabel text-white small fw-bold mt-3 mb-1">School of AI</div>
                                            <Link to="/training?track=ai-foundation" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>AI Foundation</Link>
                                            <Link to="/training?track=hardware" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Hardware & Compute</Link>
                                            <Link to="/training?track=prompt-eng" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Prompt Engineering & GenAI</Link>
                                            <Link to="/training?track=gen-ai" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Agents</Link>
                                            <Link to="/training?track=ai-kids" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>AI for Kids</Link>
                                        </div>

                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Advanced Labs</h4>
                                            <p className="mega-menu-subtitle small text-accent-primary mb-2">with Kone Lab</p>
                                            <Link to="/training?lab=3d-design" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>3D Design & Animation</Link>
                                            <Link to="/training?lab=simulation" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>Robotics</Link>
                                            <Link to="/training?lab=3d-printing" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>Robotics for Kids</Link>

                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div
                        className={`nav-dropdown ${isResourcesOpen ? 'active' : ''}`}
                        style={{ zIndex: 1001 }}
                        variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}
                    >
                        <div
                            className={`nav-link dropdown-trigger ${(location.pathname === '/docs' || location.pathname === '/portfolio' || location.pathname.startsWith('/resources')) ? 'active' : ''}`}
                            onClick={() => {
                                setIsResourcesOpen(!isResourcesOpen);
                                setIsProgramsOpen(false);
                                setIsCollaborationsOpen(false);
                            }}
                        >
                            Resources
                        </div>

                        <AnimatePresence>
                            {isResourcesOpen && (
                                <motion.div
                                    className="dropdown-menu"
                                    initial={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    animate={window.innerWidth > 991 ? { opacity: 1, scale: 1, y: 0, x: "-50%" } : { opacity: 1, height: "auto" }}
                                    exit={window.innerWidth > 991 ? { opacity: 0, scale: 0.9, y: 10, x: "-50%" } : { opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    style={{ zIndex: 1002, overflow: 'hidden' }}
                                >
                                    <Link
                                        to="/docs?category=consult"
                                        className={`dropdown-item ${location.pathname === '/docs' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Docs
                                    </Link>
                                    <Link
                                        to="/portfolio"
                                        className={`dropdown-item ${location.pathname === '/portfolio' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Portfolio
                                    </Link>
                                    <Link
                                        to="/blog"
                                        className={`dropdown-item ${location.pathname === '/blog' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Blog
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}>
                        <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link>
                    </motion.div>
                    <motion.div variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}>
                        <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                    </motion.div>
                    <motion.div className="mobile-actions" variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}>
                        {currentUser && (
                            <div className="d-flex flex-column gap-2 w-100 mb-2">
                                {currentUser.email === ADMIN_EMAIL && (
                                    <Link to="/admin" className="btn-primary w-100 text-center justify-content-center">Admin Dashboard</Link>
                                )}
                                <Link to="/profile" className="btn-tertiary w-100 text-center justify-content-center" style={{ border: '1px solid #58a6ff', color: '#58a6ff' }}>My Profile</Link>
                            </div>
                        )}
                        {!currentUser && (
                            <Link to="/login" className="btn-secondary w-100 text-center justify-content-center">Login</Link>
                        )}
                        <a href={hubUrl} className="btn-primary w-100 text-center justify-content-center mt-2">Back to Hub</a>
                    </motion.div>
                </motion.nav>

                <div className="header-actions desktop-only">
                    {currentUser ? (
                        <div className="d-flex align-items-center gap-2">
                            {currentUser.email === ADMIN_EMAIL && (
                                <Link to="/admin" className="btn-primary">Dashboard</Link>
                            )}
                            <Link to="/profile" className="btn-tertiary" style={{ border: '1px solid #58a6ff', color: '#58a6ff', padding: '10px 20px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>My Profile</Link>
                        </div>
                    ) : (
                        <Link to="/login" className="btn-secondary">Login</Link>
                    )}
                    <a href={hubUrl} className="btn-primary">Back to Hub</a>
                </div>
            </div>
        </header>
    );
};


export default Header;
