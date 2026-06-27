import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TypingAnimation from './TypingAnimation';
import './Hero.css';
import prereviewSnapshot from '../assets/images/prereview-snapshot.png';

const HERO_DATA = {
    academic: {
        badge: "ACADEMIC RESEARCH & SCHOLARSHIP",
        title: {
            normal: "Research. Analysis.",
            gradient: "Innovation."
        },
        subtitle: "Your expert partner in academic research. We deliver specialized insights, statistical analysis, and compliance protocols across the scholarly landscape.",
        command: "init research-project --type=academic",
        typingWords: [
            'Initializing research environment...',
            'Loading data analysis modules...',
            'Connecting to expert consultants...',
            'Ready for input.'
        ],
        trustTitle: "Trusted by Scholars & Researchers From",
        logos: [
            {
                type: 'image',
                src: '/logos/ug_logo.jpg',
                alt: 'University of Ghana Logo',
                name: 'University of Ghana',
                sub: 'Accra, Ghana'
            },
            {
                type: 'image',
                src: '/logos/uhas_logo.png',
                alt: 'University of Health & Allied Sciences Logo',
                name: 'University of Health & Allied Sciences',
                sub: 'Ho, Ghana'
            }
        ],
        featured: {
            title: "Featured on",
            subtitle: "PREreview.org",
            desc: "We are proud to be recognized by PREreview.org. Explore our journal club and our ongoing commitment to open peer review and scholarly publishing.",
            img: prereviewSnapshot,
            link: "https://prereview.org/clubs/kone-consult",
            linkText: "View our PREreview Club",
            isExternal: true
        }
    },
    business: {
        badge: "BUSINESS INTELLIGENCE & OPERATIONS",
        title: {
            normal: "Strategy. Operations.",
            gradient: "Growth."
        },
        subtitle: "Empowering corporate excellence and business growth. We design quantitative risk models, market entry strategies, and operational efficiency protocols.",
        command: "init business-model --type=quantitative",
        typingWords: [
            'Analyzing supply chain telemetry...',
            'Computing SaaS market entry risk...',
            'Generating executive dashboard...',
            'Ready for business growth.'
        ],
        trustTitle: "Empowering Growth Across Enterprises & Hubs",
        logos: [
            {
                type: 'svg',
                svg: (
                    <svg className="trust-logo-svg" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="100,20 170,60 170,140 100,180 30,140 30,60" stroke="currentColor" strokeWidth="8" fill="none" />
                        <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="6" fill="none"/>
                        <line x1="100" y1="20" x2="100" y2="70" stroke="currentColor" strokeWidth="6"/>
                        <line x1="100" y1="130" x2="100" y2="180" stroke="currentColor" strokeWidth="6"/>
                    </svg>
                ),
                alt: 'Kone Digital Logo',
                name: 'Kone Digital',
                sub: 'Enterprise Solutions'
            },
            {
                type: 'svg',
                svg: (
                    <svg className="trust-logo-svg" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 70 H150 L140 160 H60 L50 70 Z" stroke="currentColor" strokeWidth="8" fill="none"/>
                        <path d="M75 70 C75 40, 125 40, 125 70" stroke="currentColor" strokeWidth="8" fill="none"/>
                        <circle cx="100" cy="115" r="16" fill="currentColor" opacity="0.8"/>
                    </svg>
                ),
                alt: 'Kone Shop Logo',
                name: 'Kone Shop',
                sub: 'E-Commerce & Retail'
            }
        ],
        featured: {
            title: "Driven by",
            subtitle: "Quantitative Insights",
            desc: "We help businesses organize data, build structural sheets, and design analytical dashboards to make informed operational decisions.",
            img: null,
            customCard: (
                <div className="framework-mockup-container glass-panel">
                    <div className="framework-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                        <span className="window-title">operations_analysis_framework.m</span>
                    </div>
                    <div className="framework-body">
                        <div className="framework-stats-grid">
                            <div className="framework-stat">
                                <span className="stat-value text-gradient">Excel/R</span>
                                <span className="stat-label">Data Modeling</span>
                            </div>
                            <div className="framework-stat">
                                <span className="stat-value text-gradient">SPSS</span>
                                <span className="stat-label">Statistical Insights</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            link: "/services?cat=business",
            linkText: "Explore Business Services",
            isExternal: false
        }
    },
    software: {
        badge: "SOFTWARE ARCHITECTURE & LABS",
        title: {
            normal: "Architecture. Security.",
            gradient: "Scale."
        },
        subtitle: "Architecting secure, scalable digital infrastructure. We develop API handshakes, data validation engines, and distributed telemetry protocols.",
        command: "init system-architecture --type=distributed",
        typingWords: [
            'Starting secure multi-sig API handshake...',
            'Initializing IoT telemetry parser...',
            'Establishing distributed data flow...',
            'Ready for cloud deployment.'
        ],
        trustTitle: "Collaborating on Systems & IoT Engineering",
        logos: [
            {
                type: 'svg',
                svg: (
                    <svg className="trust-logo-svg" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="25" y="35" width="150" height="130" rx="16" stroke="currentColor" strokeWidth="8" fill="none"/>
                        <path d="M70 80 L45 100 L70 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <path d="M130 80 L155 100 L130 120" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <line x1="110" y1="75" x2="90" y2="125" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                    </svg>
                ),
                alt: 'Kone Code Logo',
                name: 'Kone Code',
                sub: 'Coding & AI Academy'
            },
            {
                type: 'svg',
                svg: (
                    <svg className="trust-logo-svg" width="48" height="48" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M75 40 H125" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
                        <path d="M90 40 V90 L55 155 A20 20 0 0 0 72.5 180 H127.5 A20 20 0 0 0 145 155 L110 90 V40" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" fill="none"/>
                        <circle cx="100" cy="140" r="12" fill="currentColor"/>
                        <circle cx="75" cy="120" r="8" fill="currentColor" opacity="0.6"/>
                        <circle cx="120" cy="110" r="8" fill="currentColor" opacity="0.6"/>
                    </svg>
                ),
                alt: 'Kone Lab Logo',
                name: 'Kone Lab',
                sub: 'Robotics & Advanced Labs'
            }
        ],
        featured: {
            title: "Built with",
            subtitle: "Modern Technologies",
            desc: "We design and develop clean, performant, and maintainable systems using industry standard tools and safe integration patterns.",
            img: null,
            customCard: (
                <div className="framework-mockup-container glass-panel">
                    <div className="framework-header">
                        <span className="dot red"></span>
                        <span className="dot yellow"></span>
                        <span className="dot green"></span>
                        <span className="window-title">tech_stack_capabilities.json</span>
                    </div>
                    <div className="framework-body">
                        <div className="framework-stats-grid">
                            <div className="framework-stat">
                                <span className="stat-value text-gradient">React</span>
                                <span className="stat-label">Frontend UI</span>
                            </div>
                            <div className="framework-stat">
                                <span className="stat-value text-gradient">Node.js</span>
                                <span className="stat-label">Backend Logic</span>
                            </div>
                        </div>
                    </div>
                </div>
            ),
            link: "/protocols?cat=software",
            linkText: "Explore Technical Protocols",
            isExternal: false
        }
    }
};

const Hero: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tabParam = searchParams.get('tab') || 'academic';
    const activeTab = (['academic', 'business', 'software'].includes(tabParam) ? tabParam : 'academic') as keyof typeof HERO_DATA;
    const currentData = HERO_DATA[activeTab];

    const setActiveTab = (newTab: string) => {
        setSearchParams({ tab: newTab });
    };

    return (
        <React.Fragment>
            <section className="hero" id="home">
                {/* Segment Tabs Selector */}
                <div className="hero-tabs-container">
                    <div className="hero-tabs-wrapper glass-panel">
                        {['academic', 'business', 'software'].map((tab) => (
                            <button
                                key={tab}
                                className={`hero-tab ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                                role="tab"
                                aria-selected={activeTab === tab}
                                aria-label={`Switch hero view to ${tab} pillar`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="hero-container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="hero-content"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <div className="badge">{currentData.badge}</div>
                            <h1 className="hero-title">
                                {currentData.title.normal}<br />
                                <span className="text-gradient">{currentData.title.gradient}</span>
                            </h1>
                            <p className="hero-subtitle">
                                {currentData.subtitle}
                            </p>
                            <div className="hero-actions">
                                <Link to={`/services?cat=${activeTab}`} className="btn-primary big">Explore Services</Link>
                                <Link to="/contact" className="btn-secondary big">Contact Us</Link>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <div className="terminal-window glass-panel">
                                <div className="terminal-header">
                                    <div className="dot red"></div>
                                    <div className="dot yellow"></div>
                                    <div className="dot green"></div>
                                    <div className="terminal-title">bash — kone-consult-cli</div>
                                </div>
                                <div className="terminal-body">
                                    <div className="command-line">
                                        <span className="prompt">user@kone-consult:~$</span>
                                        <span className="command">{currentData.command}</span>
                                    </div>
                                    <div className="output">
                                        <TypingAnimation words={currentData.typingWords} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="hero-background-glow"></div>
            </section>

            {/* Dynamic Trust Section */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="hero-trust-section glass-panel"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="trust-title">{currentData.trustTitle}</div>
                    <div className="trust-logos-grid">
                        {currentData.logos.map((logo, index) => (
                            <div className="trust-logo-card" key={index}>
                                <div className="logo-img-wrapper">
                                    {logo.type === 'image' ? (
                                        <img src={logo.src} alt={logo.alt} className="trust-logo-img" width="120" height="80" />
                                    ) : (
                                        logo.svg
                                    )}
                                </div>
                                <div className="trust-logo-text">
                                    <span className="inst-name">{logo.name}</span>
                                    <span className="inst-sub">{logo.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </AnimatePresence>
 
            {/* Dynamic Featured Section */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="hero-featured-section glass-panel"
                    id="journal-club"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                >
                    <div className="featured-header">
                        <h2>{currentData.featured.title}</h2>
                        <h2 className="text-gradient">{currentData.featured.subtitle}</h2>
                    </div>
                    <div className="featured-content">
                        <p>{currentData.featured.desc}</p>
                        
                        {currentData.featured.img ? (
                            <div className="snapshot-container">
                                <img
                                     src={currentData.featured.img}
                                     alt={currentData.featured.subtitle}
                                     className="prereview-image"
                                     width="600"
                                     height="350"
                                />
                            </div>
                        ) : (
                            currentData.featured.customCard
                        )}

                        {currentData.featured.isExternal ? (
                            <a href={currentData.featured.link} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                                {currentData.featured.linkText}
                            </a>
                        ) : (
                            <Link to={currentData.featured.link} className="btn-secondary">
                                {currentData.featured.linkText}
                            </Link>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </React.Fragment>
    );
};

export default Hero;
