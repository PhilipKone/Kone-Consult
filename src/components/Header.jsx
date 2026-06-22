import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaPalette, FaHome } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import './Header.css';

export const NEON_THEMES = {
    blue: {
        name: 'Neon Blue',
        primary: '#58a6ff',
        secondary: '#bc8cff',
        glow: 'rgba(88, 166, 255, 0.3)',
        textAccent: '#58a6ff'
    },
    green: {
        name: 'Matrix Green',
        primary: '#3fb950',
        secondary: '#00ffcc',
        glow: 'rgba(63, 185, 80, 0.3)',
        textAccent: '#3fb950'
    },
    orange: {
        name: 'Lava Orange',
        primary: '#f59e0b',
        secondary: '#ef4444',
        glow: 'rgba(245, 158, 11, 0.3)',
        textAccent: '#f59e0b'
    },
    purple: {
        name: 'Galactic Purple',
        primary: '#9333ea',
        secondary: '#c084fc',
        glow: 'rgba(147, 51, 234, 0.3)',
        textAccent: '#9333ea'
    },
    black: {
        name: 'Obsidian Black',
        primary: '#6b7280',
        secondary: '#374151',
        glow: 'rgba(107, 114, 128, 0.3)',
        textAccent: '#9ca3af'
    }
};

export const applyTheme = (themeName) => {
    const theme = NEON_THEMES[themeName];
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', theme.primary);
    root.style.setProperty('--accent-secondary', theme.secondary);
    root.style.setProperty('--shadow-glow', `0 0 15px ${theme.glow}`);
    root.style.setProperty('--text-accent', theme.textAccent);
};

const Header = () => {
    const [logoColor, setLogoColor] = useState(() => {
        return localStorage.getItem('kone-consult-logo-color') || 'blue';
    });
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const lastScrollY = useRef(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    const [isResourcesOpen, setIsResourcesOpen] = useState(false);
    const [isProgramsOpen, setIsProgramsOpen] = useState(false);
    const [isCollaborationsOpen, setIsCollaborationsOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [isThemeOpen, setIsThemeOpen] = useState(false);
    const location = useLocation();

    const updateFavicon = (themeKey) => {
        const iconPath = `/logos/c_shape_circle_${themeKey}.svg`;
        const iconLink = document.querySelector('link[rel="icon"]');
        const appleIconLink = document.querySelector('link[rel="apple-touch-icon"]');
        if (iconLink) iconLink.href = iconPath;
        if (appleIconLink) appleIconLink.href = iconPath;
    };

    const handleColorChange = (color) => {
        setLogoColor(color);
        localStorage.setItem('kone-consult-logo-color', color);
        applyTheme(color);
        updateFavicon(color);
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: color }));
    };

    // Load theme and favicon preference on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('kone-consult-logo-color') || 'blue';
        applyTheme(savedTheme);
        updateFavicon(savedTheme);
    }, []);
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const ADMIN_EMAIL = 'phconsultgh@gmail.com';
    const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !navigator.userAgent.includes('ReactSnap');
    const hubUrl = isLocal ? 'http://localhost:5173/' : 'https://www.koneacademy.io/';

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            // Set scrolled background state
            setScrolled(currentScrollY > 50);
            
            // Smart Header show/hide logic
            if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
                setHeaderVisible(false);
            } else if (currentScrollY < lastScrollY.current || currentScrollY <= 120) {
                setHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;

            // Scroll progress bar
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
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
        setIsAccountOpen(false);
        setIsThemeOpen(false);
    }, [location]);

    return (
        <header className={`header ${scrolled ? 'scrolled' : ''} ${headerVisible ? '' : 'header-hidden'}`}>
            <AnimatePresence>
                {(isResourcesOpen || isProgramsOpen || isCollaborationsOpen || isAccountOpen || isThemeOpen) && (
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
                            setIsAccountOpen(false);
                            setIsThemeOpen(false);
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
                <div className="logo-container">
                    <Link to="/" className="logo">
                        <Logo size={32} color={logoColor} className="logo-symbol" />
                        <span className="logo-text">Kone Consult</span>
                    </Link>
                </div>
                <div 
                    className="mobile-menu-toggle" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    role="button"
                    aria-label="Toggle mobile navigation menu"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setIsMenuOpen(!isMenuOpen);
                        }
                    }}
                >
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
                        <Link to="/" className={`nav-link home-nav-link ${location.pathname === '/' ? 'active' : ''}`} title="Home">
                            <FaHome className="nav-home-icon" />
                            <span className="nav-home-text">Home</span>
                        </Link>
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
                                            <a href="https://kids.koneacademy.io/coding" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Coding for Kids</a>

                                            <div className="mega-menu-sublabel text-white small fw-bold mt-3 mb-1">School of AI</div>
                                            <Link to="/training?track=ai-foundation" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>AI Foundation</Link>
                                            <Link to="/training?track=hardware" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Hardware & Compute</Link>
                                            <Link to="/training?track=prompt-eng" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Prompt Engineering & GenAI</Link>
                                            <Link to="/training?track=gen-ai" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>Agents</Link>
                                            <a href="https://kids.koneacademy.io/ai" className="dropdown-item py-1" onClick={() => setIsCollaborationsOpen(false)}>AI for Kids</a>
                                        </div>

                                        <div className="mega-menu-column">
                                            <h4 className="mega-menu-title">Advanced Labs</h4>
                                            <p className="mega-menu-subtitle small text-accent-primary mb-2">with Kone Lab</p>
                                            <Link to="/training?lab=3d-design" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>3D Design & Animation</Link>
                                            <Link to="/training?lab=simulation" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>Robotics</Link>
                                            <a href="https://kids.koneacademy.io/robotics" className="dropdown-item" onClick={() => setIsCollaborationsOpen(false)}>Robotics for Kids</a>

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
                            className={`nav-link dropdown-trigger ${(location.pathname === '/docs' || location.pathname === '/protocols' || location.pathname === '/about' || location.pathname === '/contact' || location.pathname.startsWith('/resources')) ? 'active' : ''}`}
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
                                        to="/protocols"
                                        className={`dropdown-item ${location.pathname === '/protocols' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Protocols
                                    </Link>
                                    <Link
                                        to="/blog"
                                        className={`dropdown-item ${location.pathname === '/blog' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Blog
                                    </Link>
                                    <Link
                                        to="/about"
                                        className={`dropdown-item ${location.pathname === '/about' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        About Us
                                    </Link>
                                    <Link
                                        to="/contact"
                                        className={`dropdown-item ${location.pathname === '/contact' ? 'active' : ''}`}
                                        onClick={() => setIsResourcesOpen(false)}
                                    >
                                        Contact Us
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.div className="mobile-actions" variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 20 } }}>
                        {currentUser && (
                            <div className="d-flex flex-column gap-2 w-100 mb-2">
                                {currentUser.email === ADMIN_EMAIL && (
                                    <Link to="/admin" className="btn-primary w-100 text-center justify-content-center">Admin Dashboard</Link>
                                )}
                                <Link to="/client-portal" className="btn-secondary w-100 text-center justify-content-center">Client Portal</Link>
                                <Link to="/profile" className="btn-tertiary w-100 text-center justify-content-center">My Profile</Link>
                            </div>
                        )}
                        {!currentUser && (
                            <Link to="/login" className="btn-secondary w-100 text-center justify-content-center">Login</Link>
                        )}
                        <a href={hubUrl} className="btn-primary w-100 text-center justify-content-center mt-2">Back to Hub</a>

                        {/* Mobile Theme Customizer */}
                        <div className="mobile-theme-customizer mt-4">
                            <div className="mobile-theme-label"><FaPalette size={14} /> Customize Theme</div>
                            <div className="mobile-theme-dots">
                                {['blue', 'green', 'orange', 'purple', 'black'].map((color) => (
                                    <button
                                        key={color}
                                        className={`color-dot ${color} ${logoColor === color ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleColorChange(color);
                                        }}
                                        title={`Switch logo color to ${color}`}
                                        aria-label={`Switch logo color to ${color}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.nav>

                <div className="header-actions desktop-only">
                    {/* Theme Customizer Dropdown */}
                    <div className="nav-dropdown" style={{ zIndex: 1001 }}>
                        <button 
                            className={`btn-theme-toggle ${isThemeOpen ? 'active' : ''}`}
                            onClick={() => {
                                setIsThemeOpen(!isThemeOpen);
                                setIsAccountOpen(false);
                            }}
                            title="Customize theme color"
                            aria-label="Customize theme color"
                        >
                            <FaPalette size={16} />
                        </button>
                        <AnimatePresence>
                            {isThemeOpen && (
                                <motion.div
                                    className="dropdown-menu theme-menu"
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ right: 0, left: 'auto', top: '120%', minWidth: '160px', zIndex: 1002, padding: '0.75rem' }}
                                >
                                    <div className="theme-menu-title">Select Accent</div>
                                    <div className="theme-options-grid">
                                        {['blue', 'green', 'orange', 'purple', 'black'].map((color) => (
                                            <button
                                                key={color}
                                                className={`theme-option-dot ${color} ${logoColor === color ? 'active' : ''}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleColorChange(color);
                                                }}
                                                title={`Switch theme to ${NEON_THEMES[color].name}`}
                                            >
                                                <span className="dot-label">{NEON_THEMES[color].name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {currentUser ? (
                        <div className="nav-dropdown" style={{ zIndex: 1001 }}>
                            <div 
                                className={`btn-tertiary ${isAccountOpen ? 'active' : ''}`}
                                onClick={() => {
                                    setIsAccountOpen(!isAccountOpen);
                                    setIsThemeOpen(false);
                                }}
                            >
                                <FaUserCircle size={18} /> My Account
                            </div>
                            <AnimatePresence>
                                {isAccountOpen && (
                                    <motion.div
                                        className="dropdown-menu"
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        style={{ right: 0, left: 'auto', top: '120%', minWidth: '200px', zIndex: 1002 }}
                                    >
                                        {currentUser.email === ADMIN_EMAIL && (
                                            <Link to="/admin" className="dropdown-item fw-bold text-primary" onClick={() => setIsAccountOpen(false)}>Admin Dashboard</Link>
                                        )}
                                        <Link to="/client-portal" className="dropdown-item fw-bold text-success" onClick={() => setIsAccountOpen(false)}>Client Portal</Link>
                                        <Link to="/profile" className="dropdown-item" onClick={() => setIsAccountOpen(false)}>Profile Settings</Link>
                                        <div className="dropdown-divider" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0.5rem 0' }}></div>
                                        <a href={hubUrl} className="dropdown-item fw-bold text-info" onClick={() => setIsAccountOpen(false)}>Back to Hub</a>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn-secondary">Login</Link>
                            <a href={hubUrl} className="btn-primary">Back to Hub</a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};


export default Header;
