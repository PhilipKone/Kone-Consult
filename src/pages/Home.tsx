import React from 'react';
import GSCDashboard from '../components/gsc/GSCDashboard';
import SEO from '../components/SEO';
import './Home.css';

const Home: React.FC = () => {
    React.useEffect(() => {
        if (localStorage.getItem('scrollToJournalClub') === 'true') {
            localStorage.removeItem('scrollToJournalClub');
            setTimeout(() => {
                const element = document.getElementById('journal-club');
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 400);
        }
    }, []);

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": "https://consult.koneacademy.io/#website",
                "url": "https://consult.koneacademy.io/",
                "name": "Kone Consult",
                "description": "Professional research consulting, statistical data analysis, and technical strategy services.",
                "publisher": {
                    "@id": "https://consult.koneacademy.io/#organization"
                }
            },
            {
                "@type": "Organization",
                "@id": "https://consult.koneacademy.io/#organization",
                "name": "Kone Consult",
                "url": "https://consult.koneacademy.io/",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://consult.koneacademy.io/logo-circle-blue.svg",
                    "caption": "Kone Consult Logo"
                },
                "sameAs": [
                    "https://www.linkedin.com/showcase/kone-consult-journal-club/"
                ]
            },
            {
                "@type": "ItemList",
                "name": "Kone Consult Main Navigation",
                "itemListElement": [
                    {
                        "@type": "SiteNavigationElement",
                        "position": 1,
                        "name": "Home",
                        "url": "https://consult.koneacademy.io/"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 2,
                        "name": "Services",
                        "url": "https://consult.koneacademy.io/services"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 3,
                        "name": "Documentation",
                        "url": "https://consult.koneacademy.io/docs"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 4,
                        "name": "Blog",
                        "url": "https://consult.koneacademy.io/blog"
                    },
                    {
                        "@type": "SiteNavigationElement",
                        "position": 5,
                        "name": "Contact",
                        "url": "https://consult.koneacademy.io/contact"
                    }
                ]
            }
        ]
    };

    return (
        <div className="home-page-gsc">
            <SEO 
                title="Research & Data Analysis Excellence" 
                description="Kone Consult: High-performance research assistance, specialized statistical data analysis (SPSS, R, Python), thesis consulting, and grant proposals." 
            />
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
            
            {/* Google Search Console-Inspired Live Research & Ecosystem Telemetry Hub */}
            <GSCDashboard />
        </div>
    );
};

export default Home;

