import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FaBookMedical, FaBuilding, FaLaptopCode, FaExternalLinkAlt, 
    FaSearch, FaTimes, FaFlask, FaShieldAlt, FaCalendarAlt, FaFileContract,
    FaGithub
} from 'react-icons/fa';
import TagModal from '../components/TagModal';
import SEO from '../components/SEO';
import { globalCache } from '../utils/cache';
import { resolveAssetPath } from '../utils/assets';

const defaultProtocols = [
    {
        id: "proto-1",
        title: "Accra Maternal Health Telemetry Protocol",
        description: "A localized clinical survey and telemetry instrumentation protocol designed to monitor maternal vitals across rural health clinics in Ghana.",
        tools: "Epidemiology, SurveyJS, SPSS, R-Markdown",
        category: "Academic",
        institution: "University of Health & Allied Sciences (UHAS)",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80",
        liveUrl: "",
        status: "published",
        details: {
            methodology: "Randomized clustering of 12 community health clinics in the Volta and Greater Accra regions. Instrumentation includes custom GSM-enabled digital telemetry nodes transmitting blood pressure and heart rate vitals daily.",
            dataProcessing: "Telemetry feeds are sanitized and logged to a private PostgreSQL instance. Statistical regression modeling is compiled in SPSS and R-Markdown to identify prenatal risk factors and predict regional anomalies.",
            compliance: "Fully compliant with the Ghana Health Service (GHS) Ethical Review Board directives and national Data Protection Commission (DPC) guidelines.",
            timeline: "12-Month Longitudinal Cohort Study"
        }
    },
    {
        id: "proto-2",
        title: "SaaS Quantitative Risk Assessment Protocol",
        description: "A comprehensive mathematical framework using Monte Carlo simulations to assess operational downtime risks and optimize cloud budgets for enterprise SaaS platforms.",
        tools: "Python, NumPy, Pandas, Monte Carlo, AWS Cost Explorer",
        category: "Business",
        institution: "Kone Consult Corporate",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        liveUrl: "",
        status: "published",
        details: {
            methodology: "Establish continuous telemetry logs from AWS CloudWatch. Run 10,000 Monte Carlo simulation runs daily to predict infrastructural constraints, resource starvation, and database locks under sudden traffic spikes.",
            dataProcessing: "Data aggregation using Python (Pandas/NumPy). Statistical distribution fitting via SciPy, outputting predictive cost-minimization curves for autoscaling rules.",
            compliance: "SOC2 Type II data governance compliant. Built to align with ISO/IEC 27001:2022 security controls.",
            timeline: "Continuous Optimization Model"
        }
    },
    {
        id: "proto-3",
        title: "Distributed Multi-Sig API Handshake Protocol",
        description: "A cryptographically secure API handshake design utilizing threshold multi-signatures for distributed financial telemetry hubs.",
        tools: "TypeScript, WebCrypto API, Node.js, RSA, WebSockets",
        category: "Software",
        institution: "Kone Academy Labs",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
        liveUrl: "",
        status: "published",
        details: {
            methodology: "Implementation of threshold multi-signature cryptography. Auth requests generate client-side challenges signed by private keys, compiled at gateway nodes, and verified against threshold configurations.",
            dataProcessing: "Real-time state verification using high-performance Node.js workers and in-memory Redis cluster. Handshake state data is kept stateless via encrypted JWT tokens.",
            compliance: "NIST-SP-800-56A compliant key-establishment scheme. Evaluated under OWASP Top 10 API Security controls.",
            timeline: "System Architecture Blueprint"
        }
    },
    {
        id: "proto-4",
        title: "Kone Academy Qualitative Interview Protocol",
        description: "A detailed semi-structured qualitative research protocol designed to evaluate teacher professional development experiences, pedagogical adaptations, and classroom management outcomes.",
        tools: "Qualitative Methods, Semi-structured Interviews, NVivo, Thematic Analysis",
        category: "Academic",
        institution: "Kone Academy Research",
        imageUrl: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
        liveUrl: "",
        status: "published",
        details: {
            methodology: "Establish semi-structured face-to-face or remote teacher interviews (45-60 minutes) post-implementation. Questions target ZPD scaffolding, device sharing strategies, and gender-based student interactions.",
            dataProcessing: "Audio recordings are transcribed using automated speech-to-text models, manually verified, and imported into NVivo for open, axial, and selective thematic coding.",
            compliance: "Adheres to institutional IRB guidelines. Consent forms must be signed before recording; transcripts are fully anonymized with alphanumeric identifiers.",
            timeline: "Post-Implementation Qualitative Evaluation"
        }
    }
];

const getNormalizedCategory = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('academic') || cat.includes('analysis') || cat.includes('clinical') || cat.includes('research')) return 'academic';
    if (cat.includes('business') || cat.includes('operation') || cat.includes('corporate') || cat.includes('finance')) return 'business';
    if (cat.includes('software') || cat.includes('development') || cat.includes('app') || cat.includes('web') || cat.includes('system') || cat.includes('cryptographic')) return 'software';
    return cat;
};

const Protocols = () => {
    const [protocols, setProtocols] = useState(globalCache.protocols || []);
    const [loading, setLoading] = useState(!globalCache.protocols);
    const [selectedTag, setSelectedTag] = useState(null);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const catParam = searchParams.get('cat') || searchParams.get('category');

    const getInitialTab = () => {
        if (!catParam) return 'All';
        const normalized = catParam.toLowerCase();
        if (normalized === 'academic') return 'Academic';
        if (normalized === 'business') return 'Business';
        if (normalized === 'software') return 'Software';
        return 'All';
    };

    const [activeTab, setActiveTab] = useState(getInitialTab);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (catParam) {
            const normalized = catParam.toLowerCase();
            if (normalized === 'academic') setActiveTab('Academic');
            else if (normalized === 'business') setActiveTab('Business');
            else if (normalized === 'software') setActiveTab('Software');
            else setActiveTab('All');
        } else {
            setActiveTab('All');
        }
    }, [catParam]);

    useEffect(() => {
        const fetchProtocols = async () => {
            if (
                navigator.userAgent.includes('ReactSnap') || 
                !import.meta.env.VITE_FIREBASE_API_KEY || 
                import.meta.env.VITE_FIREBASE_API_KEY === 'dummy_key'
            ) {
                setProtocols(defaultProtocols);
                setLoading(false);
                return;
            }
            try {
                // Fetch from projects collection, which is the actual collection in the database
                const q = query(collection(db, "projects"), where("status", "==", "published"));
                const querySnapshot = await getDocs(q);
                const protocolsData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    .filter(p => !p.division || p.division === 'Kone Consult');
                
                // Sort by createdAt desc if available
                protocolsData.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                
                // Merge with fallback default protocols
                const merged = [...protocolsData];
                defaultProtocols.forEach(def => {
                    if (!merged.some(p => p.id === def.id || p.title === def.title)) {
                        merged.push(def);
                    }
                });

                globalCache.protocols = merged;
                setProtocols(merged);
            } catch (error) {
                console.error("Error fetching protocols: ", error);
                setProtocols(defaultProtocols);
            } finally {
                setLoading(false);
            }
        };

        fetchProtocols();
    }, []);

    const filteredProtocols = protocols.filter(proto => {
        const matchesSearch = proto.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             proto.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             (proto.tools || proto.tags || '').toString().toLowerCase().includes(searchQuery.toLowerCase());
        
        const protoCat = getNormalizedCategory(proto.category);
        const matchesTab = activeTab === 'All' || 
                           (activeTab === 'Academic' && protoCat === 'academic') ||
                           (activeTab === 'Business' && protoCat === 'business') ||
                           (activeTab === 'Software' && protoCat === 'software');

        return matchesSearch && matchesTab;
    });

    const getCategoryIcon = (category) => {
        switch (getNormalizedCategory(category)) {
            case 'academic':
                return <FaBookMedical className="text-success" />;
            case 'business':
                return <FaBuilding className="text-warning" />;
            case 'software':
                return <FaLaptopCode className="text-primary" />;
            default:
                return <FaLaptopCode />;
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="page-container position-relative">
            <SEO 
                title="Research Protocols" 
                description="Browse our library of clinical, business, and software engineering research protocols, demonstrating our methodology and compliance design standards." 
            />
            <div className="page-background-glow" />

            <AnimatePresence>
                {selectedTag && (
                    <TagModal tag={selectedTag} onClose={() => setSelectedTag(null)} />
                )}
            </AnimatePresence>

            {/* Protocol Detail Modal */}
            <AnimatePresence>
                {selectedProtocol && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100vw',
                            height: '100dvh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 999999,
                            background: 'rgba(10, 12, 16, 0.9)',
                            backdropFilter: 'blur(15px)',
                            WebkitBackdropFilter: 'blur(15px)'
                        }}
                        onClick={() => setSelectedProtocol(null)}
                    >
                        <motion.div
                            className="glass-panel p-5 position-relative text-start"
                            initial={{ scale: 0.9, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 30 }}
                            style={{ 
                                maxWidth: '650px', 
                                width: '92%', 
                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
                                overflowY: 'auto',
                                maxHeight: '85dvh',
                                borderRadius: '20px'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className="btn btn-link text-secondary position-absolute top-0 end-0 p-3 border-0 bg-transparent cursor-pointer"
                                onClick={() => setSelectedProtocol(null)}
                                style={{ zIndex: 10 }}
                            >
                                <FaTimes size={20} />
                            </button>

                            <div className="d-flex align-items-center gap-3 mb-4">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                    {getCategoryIcon(selectedProtocol.category)}
                                </div>
                                <div>
                                    <span className="text-secondary small fw-bold opacity-75">{selectedProtocol.institution}</span>
                                    <h2 className="h4 fw-bold text-white mb-0">{selectedProtocol.title}</h2>
                                </div>
                            </div>

                            <p className="text-secondary small mb-4 lead" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                {selectedProtocol.description}
                            </p>

                            <div className="d-flex flex-column gap-4 border-top border-white border-opacity-10 pt-4">
                                <div>
                                    <h4 className="small text-white fw-bold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
                                        <FaFlask className="text-accent-primary" /> 1. Methodology & Structure
                                    </h4>
                                    <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                                        {selectedProtocol.details?.methodology || "Protocol testing framework in execution."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="small text-white fw-bold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
                                        <FaLaptopCode className="text-accent-primary" /> 2. Data Processing & Analysis
                                    </h4>
                                    <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                                        {selectedProtocol.details?.dataProcessing || "Statistical datasets compile procedures configured."}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="small text-white fw-bold text-uppercase tracking-wider mb-2 d-flex align-items-center gap-2">
                                        <FaShieldAlt className="text-accent-primary" /> 3. Ethical & Regulatory Compliance
                                    </h4>
                                    <p className="text-secondary small mb-0" style={{ lineHeight: '1.6' }}>
                                        {selectedProtocol.details?.compliance || "Governance standards validation ongoing."}
                                    </p>
                                </div>
                            </div>

                            {(() => {
                                const github = selectedProtocol.githubUrl || selectedProtocol.github;
                                const liveLink = selectedProtocol.liveUrl || selectedProtocol.link;
                                if (!github && !liveLink) return null;
                                return (
                                    <div className="mt-4 pt-3 border-top border-white border-opacity-10">
                                        <h4 className="small text-white fw-bold text-uppercase tracking-wider mb-2">
                                            Resources & Links
                                        </h4>
                                        <div className="d-flex gap-3">
                                            {github && (
                                                <a 
                                                    href={github} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 text-white border-secondary"
                                                    style={{ borderRadius: '8px', padding: '6px 16px', textDecoration: 'none' }}
                                                >
                                                    <FaGithub /> View Code
                                                </a>
                                            )}
                                            {liveLink && (
                                                <a 
                                                    href={liveLink} 
                                                    target="_blank" 
                                                    rel="noreferrer" 
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2"
                                                    style={{ borderRadius: '8px', padding: '6px 16px', textDecoration: 'none', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)' }}
                                                >
                                                    <FaExternalLinkAlt /> Live Demo
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                            <div className="mt-5 pt-3 border-top border-white border-opacity-10 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                                <div className="d-flex align-items-center gap-2 text-secondary small">
                                    <FaCalendarAlt />
                                    <span>{selectedProtocol.details?.timeline || "Standard Protocol Timeline"}</span>
                                </div>
                                <button
                                    className="btn btn-primary px-4 py-2"
                                    onClick={() => setSelectedProtocol(null)}
                                    style={{ borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="text-center section-title"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="badge mb-3">METHODOLOGY BLUEPRINTS</div>
                <h1 className="text-gradient mb-3 display-4">Research & Technical Protocols</h1>
                <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                    A repository of clinical study designs, quantitative business risk frameworks, and cryptographic network standards.
                </p>
            </motion.div>

            {/* HUD / Filter Navigation */}
            <div className="max-w-800 mx-auto mb-5">
                <div className="d-flex align-items-center mb-4" style={{ position: 'relative' }}>
                    <FaSearch className="text-secondary opacity-50 ms-3 position-absolute" style={{ left: '15px' }} />
                    <input 
                        type="search" 
                        className="form-control-dark border border-white border-opacity-10 bg-dark bg-opacity-40 ps-5 pe-3 py-3 w-100" 
                        placeholder="Search protocols by title, technology, or keywords..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ borderRadius: '12px', outline: 'none' }}
                    />
                </div>

                <div className="d-flex justify-content-center">
                    <div className="nav-tabs-premium" style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        {[
                            { key: 'All', label: 'All Protocols' },
                            { key: 'Academic', label: 'Academic & Clinical' },
                            { key: 'Business', label: 'Business & Operations' },
                            { key: 'Software', label: 'Software & Systems' }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    if (tab.key === 'All') {
                                        setSearchParams({});
                                    } else {
                                        setSearchParams({ cat: tab.key.toLowerCase() });
                                    }
                                }}
                                className="border-0 px-3 py-2 text-white small fw-bold"
                                style={{
                                    borderRadius: '8px',
                                    background: activeTab === tab.key ? 'rgba(88, 166, 255, 0.12)' : 'transparent',
                                    color: activeTab === tab.key ? 'var(--accent-primary, #58a6ff)' : '#d1d5db',
                                    border: activeTab === tab.key ? '1px solid rgba(88, 166, 255, 0.2)' : '1px solid transparent',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    flexShrink: 0
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-accent-primary" role="status">
                        <span className="visually-hidden">Loading protocols...</span>
                    </div>
                </div>
            ) : (
                <motion.div
                    className="horizontal-scroll-container pb-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredProtocols.map((proto) => {
                            const imgUrl = proto.imageUrl || proto.image;
                            const toolsText = proto.tools || proto.tags;
                            const tagsArray = Array.isArray(toolsText) 
                                ? toolsText 
                                : typeof toolsText === 'string' 
                                    ? toolsText.split(',').map(t => t.trim()) 
                                    : [];

                            return (
                                <motion.div 
                                    className="scroll-item" 
                                    key={proto.id} 
                                    variants={itemVariants}
                                    layout
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                >
                                    <div className="glass-card p-0 h-100 d-flex flex-column hover-y transition-all" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                                        {imgUrl && (
                                            <div className="project-image w-100 position-relative" style={{ height: '180px', flexShrink: 0, overflow: 'hidden', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                                <img 
                                                    src={resolveAssetPath(imgUrl)} 
                                                    alt={proto.title} 
                                                    className="w-100 h-100 object-fit-cover" 
                                                    onError={(e) => {
                                                        if (!e.currentTarget.dataset.fallbackTriggered) {
                                                            e.currentTarget.dataset.fallbackTriggered = 'true';
                                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600&h=180';
                                                        }
                                                    }}
                                                />
                                                <div className="position-absolute top-3 right-3 bg-dark bg-opacity-70 p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', top: '12px', right: '12px' }} title={`${proto.category} Protocol`}>
                                                    {getCategoryIcon(proto.category)}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-4 d-flex flex-column flex-grow-1">
                                            <div className="d-flex flex-column mb-2">
                                                <span className="text-secondary small fw-bold opacity-75">{proto.institution || "Kone Consult"}</span>
                                                <h3 className="h5 text-white fw-bold mt-1 mb-2">{proto.title}</h3>
                                            </div>
                                            <p className="text-secondary small mb-4 flex-grow-1">{proto.description}</p>

                                            <div className="mb-4">
                                                <div className="tags-container justify-content-start">
                                                    {tagsArray.map((tool, i) => (
                                                        <motion.button
                                                            key={i}
                                                            className="glass-tag cursor-pointer border-0"
                                                            onClick={() => setSelectedTag(tool)}
                                                            whileHover={{ scale: 1.05, backgroundColor: "rgba(88, 166, 255, 0.15)" }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            {tool}
                                                        </motion.button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="d-flex gap-3 mt-auto">
                                                <button 
                                                    onClick={() => setSelectedProtocol(proto)}
                                                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-2 w-100 justify-content-center py-2 border-primary bg-transparent text-primary cursor-pointer hover-bg-primary transition-all"
                                                    style={{ borderRadius: '8px', border: '1px solid var(--accent-primary)' }}
                                                >
                                                    <FaFileContract /> View Protocol Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            )}

            {filteredProtocols.length === 0 && !loading && (
                <motion.div
                    className="glass-panel text-center p-4 p-md-5 mx-auto max-w-600 mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ borderRadius: '16px' }}
                >
                    <h3 className="text-secondary mb-2">Protocols Pending Publication</h3>
                    <p className="text-secondary small mb-0">Our latest research protocols are currently undergoing peer review and validation. Check back shortly to view our updated library.</p>
                </motion.div>
            )}
        </div>
    );
};

export default Protocols;
