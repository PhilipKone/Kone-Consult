import { useState, useEffect } from 'react';

export const useTheme = () => {
    // Determine initial theme based on localStorage or default to dark
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('kone-theme');
        return savedTheme ? savedTheme : 'dark';
    });

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);
        // Save to local storage
        localStorage.setItem('kone-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return { theme, toggleTheme };
};
