import React from 'react';
import Hero from '../components/Hero';

const Home = () => {
    React.useEffect(() => {
        document.title = "Kone Consult | Research & Data Analysis Innovation";
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
            <Hero />
        </div>
    );
};

export default Home;
