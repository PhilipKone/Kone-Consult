import React from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

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
                title="Innovation Hub" 
                description="We build world-class digital experiences, scalable infrastructure, and dynamic interfaces for startups and enterprises." 
            />
            <Hero />
        </div>
    );
};

export default Home;
