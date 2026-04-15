import React, { useState, useEffect, useMemo, useRef, ReactNode } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import TagModal from '../components/TagModal';
import { Logo } from '../components/Logo';
import { 
    FaBook, FaCode, FaChartBar, FaBars, FaTimes, FaPython, 
    FaDatabase, FaJs, FaGraduationCap, FaRocket, FaPalette, 
    FaSearch, FaChevronRight 
} from 'react-icons/fa';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { globalCache } from '../utils/cache';
import '../index.css';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';

interface DocModule {
    id: string;
    title: string;
    content: string;
    category?: string;
    order?: number;
    icon?: string;
    templateId?: string;
    [key: string]: any;
}

interface Template {
    id: string;
    title?: string;
    [key: string]: any;
}

interface Category {
    id: string;
    title: string;
}

const iconMap: Record<string, JSX.Element> = {
    'FaCode': <FaCode />,
    'FaChartBar': <FaChartBar />,
    'FaBook': <FaBook />,
    'FaPython': <FaPython />,
    'FaDatabase': <FaDatabase />,
    'FaJs': <FaJs />,
    'FaFlask': <FaCode />,
    'FaGraduationCap': <FaGraduationCap />,
    'FaThLarge': <FaCode />,
    'FaRocket': <FaRocket />,
    'FaPalette': <FaPalette />
};

const Documentation: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('');
    const [selectedTag, setSelectedTag] = useState<any>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'general';
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(window.innerWidth >= 992);
    const [docs, setDocs] = useState<DocModule[]>(globalCache.docs || []);
    const [templates, setTemplates] = useState<Template[]>(globalCache.templates || []);
    const [loading, setLoading] = useState<boolean>(!globalCache.docs);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const isManualScrolling = useRef<boolean>(false);

    // Fetch Data
    useEffect(() => {
        const unsubscribeDocs = onSnapshot(
            query(collection(db, 'documentation_modules'), orderBy('order', 'asc')),
            (snapshot) => {
                const fetchedDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DocModule));
                globalCache.docs = fetchedDocs;
                setDocs(fetchedDocs);
                setLoading(false);
            }
        );

        const unsubscribeTemplates = onSnapshot(
            collection(db, 'kone_code_templates'),
            (snapshot) => {
                const fetchedTemplates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Template));
                globalCache.templates = fetchedTemplates;
                setTemplates(fetchedTemplates);
            }
        );

        return () => {
            unsubscribeDocs();
            unsubscribeTemplates();
        };
    }, []);

    // URL Sync via SearchParams
    const urlDocId = searchParams.get('doc');

    const handleCategoryChange = (catId: string) => {
        setSearchParams({ category: catId });
        // Content area scroll reset
        const contentArea = document.querySelector('.doc-content-area');
        if (contentArea) contentArea.scrollTop = 0;
        if (window.innerWidth < 992) setIsSidebarOpen(false);
    };

    useEffect(() => {
        if (docs.length > 0) {
            // Priority 1: URL Parameter
            if (urlDocId) {
                const targetDoc = docs.find(d => d.id === urlDocId);
                if (targetDoc) {
                    setActiveTab(urlDocId);
                    if (targetDoc.category && targetDoc.category !== selectedCategory) {
                        setSearchParams({ category: targetDoc.category, doc: urlDocId });
                    }
                    return;
                }
            }

            // Priority 2: Maintain selection if still valid for current category
            const currentDoc = docs.find(d => d.id === activeTab);
            const isCurrentDocValid = currentDoc && (currentDoc.category || 'general') === selectedCategory;

            if (!isCurrentDocValid) {
                const targetDocsForCategory = docs.filter(d => (d.category || 'general') === selectedCategory);
                if (targetDocsForCategory.length > 0) {
                    const newId = targetDocsForCategory[0].id;
                    setActiveTab(newId);
                    setSearchParams({ category: selectedCategory, doc: newId });
                    
                    // Content area scroll reset on category change
                    const contentArea = document.querySelector('.doc-content-area');
                    if (contentArea) contentArea.scrollTo({ top: 0, behavior: 'auto' });
                } else {
                    // Critical Fix: Category is intentionally empty
                    setActiveTab('');
                    setSearchParams({ category: selectedCategory });
                }
            }
        }
    }, [selectedCategory, urlDocId, docs, activeTab, setSearchParams]);

    // Robust Scroll Reset on tab change with slight delay for DOM update
    useEffect(() => {
        const resetScroll = () => {
            const contentArea = document.querySelector('.doc-content-area');
            if (contentArea) {
                // Ensure immediate vertical reset without interrupting existing DOM animations
                contentArea.scrollTo({ top: 0, behavior: 'auto' });
            }
        };
        
        requestAnimationFrame(() => {
            resetScroll();
        });
    }, [activeTab]);

    // Derived State - Enhanced Global Search
    const filteredDocs = useMemo(() => {
        if (!searchQuery) {
            return docs.filter(doc => (doc.category || 'general') === selectedCategory);
        }
        
        // Search exclusively within the active category
        return docs.filter(doc => {
            if ((doc.category || 'general') !== selectedCategory) return false;
            const matchesSearch = 
                doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (doc.content && doc.content.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesSearch;
        });
    }, [docs, selectedCategory, searchQuery]);

    const categoryDocs = useMemo(() => docs.filter(d => (d.category || 'general') === selectedCategory), [docs, selectedCategory]);
    const currentIndex = categoryDocs.findIndex(d => d.id === activeTab);
    const prevDoc = currentIndex > 0 ? categoryDocs[currentIndex - 1] : null;
    const nextDoc = currentIndex < categoryDocs.length - 1 ? categoryDocs[currentIndex + 1] : null;

    const categoryTitles: Record<string, string> = {
        'general': 'Overview',
        'consult': 'Consult',
        'code': 'Code',
        'lab': 'Lab'
    };

    // Anchor Injection for Headings
    useEffect(() => {
        if (!loading && activeTab) {
            const timer = setTimeout(() => {
                const contentElement = document.querySelector('.doc-rich-content');
                if (contentElement) {
                    const hElements = contentElement.querySelectorAll('h2, h3');
                    Array.from(hElements).forEach(h => {
                        const htmlH = h as HTMLElement;
                        const id = htmlH.innerText.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                        htmlH.id = id;
                        
                        // Inject Anchor Link Icon if not already present
                        if (!htmlH.querySelector('.anchor-link')) {
                            const anchor = document.createElement('a');
                            anchor.href = `#${id}`;
                            anchor.className = 'anchor-link';
                            anchor.innerHTML = '#';
                            anchor.title = 'Copy link to section';
                            anchor.onclick = (e) => {
                                e.preventDefault();
                                const url = `${window.location.origin}${window.location.pathname}${window.location.hash.split('#')[0]}#${id}`;
                                navigator.clipboard.writeText(url);
                                anchor.innerHTML = '✓';
                                setTimeout(() => anchor.innerHTML = '#', 2000);
                                htmlH.scrollIntoView({ behavior: 'smooth' });
                            };
                            htmlH.prepend(anchor);
                        }
                    });
                }
                Prism.highlightAll(); 
            }, 200);
            return () => clearTimeout(timer);
        }
    }, [activeTab, loading, docs]);

    // Code Block Utilities (Copy Buttons)
    useEffect(() => {
        if (!loading && activeTab) {
            const timer = setTimeout(() => {
                const preElements = document.querySelectorAll('.doc-content-area pre');
                preElements.forEach((pre) => {
                    const htmlPre = pre as HTMLElement;
                    if (htmlPre.closest('.code-wrapper')) return;

                    const wrapper = document.createElement('div');
                    wrapper.className = 'code-wrapper';
                    htmlPre.parentNode?.insertBefore(wrapper, htmlPre);
                    wrapper.appendChild(htmlPre);

                    const copyBtn = document.createElement('button');
                    copyBtn.className = 'copy-button';
                    copyBtn.innerHTML = 'Copy';
                    wrapper.appendChild(copyBtn);

                    copyBtn.onclick = () => {
                        const codeText = htmlPre.innerText;
                        navigator.clipboard.writeText(codeText).then(() => {
                            copyBtn.innerHTML = 'Copied!';
                            copyBtn.classList.add('copied');
                            setTimeout(() => {
                                copyBtn.innerHTML = 'Copy';
                                copyBtn.classList.remove('copied');
                            }, 2000);
                        });
                    };
                });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [activeTab, loading, docs]);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const activeDoc = useMemo(() => docs.find(d => d.id === activeTab), [docs, activeTab]);

    return (
        <div className="docs-page-wrapper" style={{ 
            backgroundColor: 'var(--bg-primary)', height: '100vh', 
            overflow: 'hidden', paddingTop: '64px', display: 'flex', flexDirection: 'column' 
        }}>
            <div className="page-container glass-panel animate-fade-in mx-auto" style={{ 
                position: 'relative', display: 'flex', flexDirection: 'column', 
                height: 'calc(100vh - 84px)', maxWidth: '1600px', 
                width: '98%', overflow: 'hidden', marginTop: '10px', padding: 0,
                zIndex: 1 
            }}>
                <div className="docs-cat-nav-wrapper d-flex align-items-center" style={{ 
                    flexShrink: 0, 
                    backgroundColor: 'rgba(13, 17, 23, 0.98)', 
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '0.6rem 1rem',
                    zIndex: 10
                }}>
                    <button
                        className="d-lg-none sidebar-mobile-toggle flex-shrink-0 me-3"
                        style={{ 
                            width: '36px', height: '36px', borderRadius: '8px',
                            backgroundColor: 'rgba(88, 166, 255, 0.15)', backdropFilter: 'blur(10px)',
                            color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(88, 166, 255, 0.3)'
                        }}
                        onClick={toggleSidebar}
                    >
                        <FaBars />
                    </button>
                    <div className="hide-scrollbar flex-grow-1" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <nav className="docs-cat-nav-content d-flex align-items-center gap-3" style={{ width: 'max-content', paddingRight: '1rem' }}>
                        {[
                            { id: 'general', title: 'Overview' },
                            { id: 'consult', title: 'Consult' },
                            { id: 'code', title: 'Code' },
                            { id: 'lab', title: 'Lab' }
                        ].map((cat) => (
                            <button
                                key={cat.id}
                                className={`docs-cat-item-top ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.id)}
                            >
                                {cat.title}
                            </button>
                        ))}
                    </nav>
                    </div>
                </div>

                <div className="d-flex flex-row flex-grow-1" style={{ minHeight: 0, overflow: 'hidden' }}>
                    {isSidebarOpen && (
                        <div 
                            className="d-lg-none position-fixed w-100 h-100 animate-fade-in" 
                            style={{ top: 0, left: 0, zIndex: 1100, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)', cursor: 'pointer' }} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSidebarOpen(false);
                            }}
                        />
                    )}

                    <div className={`doc-sidebar glass-panel ${isSidebarOpen ? 'open' : 'closed'}`} style={{
                        width: '280px', minWidth: '280px',
                        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                        backgroundColor: 'rgba(13, 17, 23, 0.95)', display: 'flex', flexDirection: 'column'
                    }}>
                        <div className="sidebar-content pb-4 h-100 overflow-auto px-1 d-flex flex-column">
                            <div className="d-lg-none d-flex justify-content-between align-items-center px-4 pt-3 pb-3 border-bottom border-secondary border-opacity-10 mb-3">
                                <span className="text-white fw-bold mb-0">Menu</span>
                                <button 
                                    className="sidebar-close-btn"
                                    onClick={() => setIsSidebarOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="px-4 mb-4 mt-1 mt-lg-4">
                                <div className="position-relative d-flex align-items-center">
                                    <FaSearch className="position-absolute text-secondary" style={{ left: '16px', fontSize: '0.9rem', pointerEvents: 'none', zIndex: 1 }} />
                                    <input 
                                        type="text" placeholder="Search documentation..." 
                                        className="w-100 glass-input rounded-3 py-2 ps-5 pe-3 text-white"
                                        style={{ 
                                            fontSize: '0.85rem', 
                                            outline: 'none',
                                            transition: 'all 0.3s ease',
                                            paddingLeft: '45px'
                                        }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>
                            <h5 className="px-4 mb-3 text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px' }}>Contents</h5>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {filteredDocs.length > 0 ? filteredDocs.map(item => (
                                    <li key={item.id} className="mb-1 px-2">
                                        <button
                                            className={`w-100 text-start px-3 py-2 border-0 transition-all d-flex align-items-center gap-2 ${activeTab === item.id ? 'active-doc-link' : 'inactive-doc-link'}`}
                                            onClick={() => {
                                                setActiveTab(item.id);
                                                setSearchParams({ 
                                                    category: item.category || selectedCategory,
                                                    doc: item.id 
                                                });
                                                if (window.innerWidth < 992) {
                                                    setTimeout(() => setIsSidebarOpen(false), 150);
                                                }
                                                if (searchQuery) setSearchQuery(''); 
                                            }}
                                            style={{
                                                fontSize: '0.8rem',
                                                minHeight: '40px'
                                            }}
                                        >
                                            <span style={{ fontSize: '0.85rem', opacity: activeTab === item.id ? 1 : 0.6 }}>
                                                {iconMap[item.icon || 'FaBook'] || <FaBook />}
                                            </span>
                                            <div className="d-flex flex-column overflow-hidden">
                                                <span className="text-truncate" style={{ fontWeight: activeTab === item.id ? '600' : '400' }}>{item.title}</span>
                                                {searchQuery && (
                                                    <span className="text-secondary opacity-50" style={{ fontSize: '0.65rem', textTransform: 'capitalize' }}>
                                                        {item.category || 'General'}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    </li>
                                )) : loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <li key={i} className="mb-2 px-3">
                                            <div className="shimmer-p" style={{ height: '38px', borderRadius: '20px', opacity: 0.2 }} />
                                        </li>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-center text-secondary opacity-50" style={{ fontSize: '0.8rem' }}>
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="doc-content-area flex-grow-1 overflow-auto bg-transparent px-3 px-md-5">
                        {loading ? (
                            <div className="py-4 max-w-content mx-auto">
                                <div className="shimmer-h1 mb-5"></div>
                                <div className="shimmer-p mb-3"></div>
                                <div className="shimmer-p mb-3"></div>
                                <div className="shimmer-p mb-3" style={{ width: '80%' }}></div>
                            </div>
                        ) : activeDoc ? (
                            <div key={activeDoc.id} className="fade-in py-4 max-w-content mx-auto">
                                        <div className="d-flex align-items-center gap-2 mb-4 text-secondary" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                                            <Link to="/" className="text-decoration-none text-secondary hover-text-primary">Home</Link>
                                            <FaChevronRight style={{ fontSize: '0.6rem', opacity: 0.5 }} />
                                            <span 
                                                className="cursor-pointer hover-text-primary"
                                                onClick={() => {
                                                    setSearchParams({ category: 'general' });
                                                    setActiveTab('');
                                                }}
                                            >Docs</span>
                                            <FaChevronRight style={{ fontSize: '0.6rem', opacity: 0.5 }} />
                                            <span className="text-accent-primary">{categoryTitles[selectedCategory] || 'Overview'}</span>
                                        </div>

                                        {(!activeDoc.content || !activeDoc.content.includes('<h1')) && (
                                            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary border-opacity-10 pb-4">
                                                <h1 className="text-white fw-bold h2 mb-0" style={{ letterSpacing: '-0.5px' }}>{activeDoc.title}</h1>
                                                {activeDoc.templateId && templates.find(t => t.id === activeDoc.templateId) && (
                                                    <button
                                                        className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 fw-bold"
                                                        style={{ borderRadius: '12px', boxShadow: '0 0 15px rgba(88, 166, 255, 0.3)', fontSize: '0.85rem' }}
                                                        onClick={() => {
                                                            const template = templates.find(t => t.id === activeDoc!.templateId);
                                                            if (template) {
                                                                const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                                                                const ideUrl = isLocal 
                                                                    ? `http://localhost:5174/?templateId=${template.id}`
                                                                    : `https://code.koneacademy.io/?templateId=${template.id}`;
                                                                window.open(ideUrl, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <FaRocket className="text-warning" /> Try IDE
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div className="doc-rich-content" dangerouslySetInnerHTML={{ __html: activeDoc.content }} />

                                        <div className="doc-footer-nav">
                                            {prevDoc ? (
                                                <button className="nav-card text-start border-0" onClick={() => {
                                                    setActiveTab(prevDoc.id);
                                                    setSearchParams({ category: prevDoc.category || selectedCategory, doc: prevDoc.id });
                                                }}>
                                                    <span className="nav-card-label">Previous</span>
                                                    <span className="nav-card-title">{prevDoc.title}</span>
                                                </button>
                                            ) : <div style={{ flex: 1 }}></div>}
                                            {nextDoc && (
                                                <button className="nav-card text-end border-0" onClick={() => {
                                                    setActiveTab(nextDoc.id);
                                                    setSearchParams({ category: nextDoc.category || selectedCategory, doc: nextDoc.id });
                                                }}>
                                                    <span className="nav-card-label">Next</span>
                                                    <span className="nav-card-title">{nextDoc.title}</span>
                                                </button>
                                            )}
                                        </div>

                                        <DocFooter />
                                    </div>
                        ) : (
                            <div className="py-5 text-center text-secondary opacity-50">
                                <FaBook size={48} className="mb-3 opacity-25" />
                                <h3>No Modules Yet</h3>
                                <p>Documentation for this section is currently being written.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedTag && <TagModal tag={selectedTag} onClose={() => setSelectedTag(null)} />}
        </div>
    );
};

const DocFooter: React.FC = () => (
    <footer className="mt-5 pt-5 border-top border-secondary border-opacity-10">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 pb-4">
            <div className="d-flex align-items-center gap-2">
                <Logo size={24} />
                <span className="fw-bold text-white small">Kone Consult</span>
            </div>
            <div className="d-flex gap-4">
                <Link to="/" className="text-secondary text-decoration-none small hover-text-primary">Home</Link>
                <Link to="/services" className="text-secondary text-decoration-none small hover-text-primary">Services</Link>
                <Link to="/contact" className="text-secondary text-decoration-none small hover-text-primary">Contact</Link>
                <Link to="/portfolio" className="text-secondary text-decoration-none small hover-text-primary">Portfolio</Link>
            </div>
            <p className="text-secondary small mb-0">&copy; 2025 Kone Academy</p>
        </div>
    </footer>
);

export default Documentation;
