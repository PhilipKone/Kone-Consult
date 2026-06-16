import React from 'react';
import { motion } from 'framer-motion';

const ScrollReveal = ({ children, delay = 0, yOffset = 50, duration = 0.5, className = '' }) => {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: yOffset }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: duration, delay: delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

export default ScrollReveal;
