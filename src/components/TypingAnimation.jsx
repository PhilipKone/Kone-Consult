import React, { useState, useEffect, useRef, useMemo } from 'react';
import './TypingAnimation.css';

const TypingAnimation = () => {
    const words = useMemo(() => ['Initializing research environment...', 'Loading data analysis modules...', 'Connecting to expert consultants...', 'Ready for input.'], []);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const pauseTimerRef = useRef(null);

    useEffect(() => {
        const current = words[currentWordIndex];

        // Clear any existing pause timer
        if (pauseTimerRef.current) {
            clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = null;
        }

        // If we just finished typing, wait before deleting
        if (!isDeleting && currentText === current) {
            pauseTimerRef.current = setTimeout(() => {
                setIsDeleting(true);
            }, 2000);
            return;
        }

        // If we just finished deleting, move to next word
        if (isDeleting && currentText === '') {
            setIsDeleting(false);
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
            return;
        }

        // Continue typing or deleting
        const speed = isDeleting ? 30 : 50;
        const timer = setTimeout(() => {
            if (isDeleting) {
                setCurrentText(currentText.substring(0, currentText.length - 1));
            } else {
                setCurrentText(current.substring(0, currentText.length + 1));
            }
        }, speed);

        return () => {
            clearTimeout(timer);
            if (pauseTimerRef.current) {
                clearTimeout(pauseTimerRef.current);
            }
        };
    }, [currentText, isDeleting, currentWordIndex, words]);

    return (
        <span className="typing-animation">
            {currentText}
            <span className="cursor">|</span>
        </span>
    );
};

export default TypingAnimation;
