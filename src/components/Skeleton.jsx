import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type, height, width, borderRadius = '8px', className = '' }) => {
    const styles = {
        height: height || '20px',
        width: width || '100%',
        borderRadius: borderRadius,
    };

    if (type === 'stat-card') {
        return (
            <div className={`skeleton-card ${className}`}>
                <div className="skeleton-header">
                    <div className="skeleton-line short shimmer" />
                    <div className="skeleton-circle shimmer" />
                </div>
                <div className="skeleton-line medium shimmer mt-3" />
                <div className="skeleton-line small shimmer mt-2" />
            </div>
        );
    }

    if (type === 'chart-box') {
        return (
            <div className={`skeleton-chart-box ${className}`}>
                <div className="skeleton-line medium shimmer mb-4" />
                <div className="skeleton-rect shimmer" style={{ height: height || '250px' }} />
            </div>
        );
    }

    return (
        <div 
            className={`skeleton-base shimmer ${className}`} 
            style={styles} 
        />
    );
};

export default Skeleton;
