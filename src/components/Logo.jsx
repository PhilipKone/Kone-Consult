import React from 'react';

export const Logo = ({ size = 192, className = '', color = 'blue', ...props }) => {
    // Define gradient colors based on the color prop
    const gradients = {
        blue: { start: "#7B9FB8", end: "#2C4A5E" },
        purple: { start: "#B18FD8", end: "#5A3A7C" },
        green: { start: "#8FD8A8", end: "#3A7C52" },
        orange: { start: "#F5A962", end: "#C55A11" },
        black: { start: "#6B7280", end: "#111827" }
    };

    // Fallback to blue if color is invalid
    const activeColor = gradients[color] ? color : 'blue';
    const colors = gradients[activeColor];
    const gradientId = `c-gradient-${activeColor}`;
    const filterId = `shadow-${activeColor}`;

    const svgProps = {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 200 200", // User SVG viewBox
        width: size,
        height: size,
        fill: "none",
        className: className,
        ...props
    };

    return (
        <svg {...svgProps}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={colors.start} />
                    <stop offset="100%" stopColor={colors.end} />
                </linearGradient>

                <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
                    <feOffset dx="2" dy="4" result="offsetblur" />
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g filter={`url(#${filterId})`}>
                {/* Surrounding Circle Ring */}
                <circle cx="100" cy="100" r="90" stroke={`url(#${gradientId})`} strokeWidth="12" fill="none" />

                {/* C Shape */}
                <path d="M 135 45 A 65 65 0 1 0 135 155" stroke={`url(#${gradientId})`} strokeWidth="40" strokeLinecap="round" fill="none" />
            </g>

            {/* Highlight for C Shape */}
            <path d="M 130 50 A 60 60 0 0 0 50 100" stroke="rgba(255,255,255,0.25)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
    );
};

