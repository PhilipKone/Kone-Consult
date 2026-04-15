import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaUser, FaClock, FaDesktop, FaInfoCircle } from 'react-icons/fa';

const UserActivityList = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, 'activity_logs'),
            orderBy('timestamp', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setActivities(snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })));
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate();
        return date.toLocaleString();
    };

    const getPlatformBadge = (platform) => {
        const colors = {
            'Kone Consult': 'bg-primary',
            'Kone Code': 'bg-success',
            'Kone Lab': 'bg-info',
            'Kone Academy': 'bg-secondary'
        };
        return `badge ${colors[platform] || 'bg-secondary'} text-white border-0`;
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading activities...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="m-0 text-white">Live Activity Feed</h4>
                <div className="text-secondary small">Showing last 100 events</div>
            </div>

            <div className="activity-list">
                {activities.length === 0 ? (
                    <div className="glass-card p-5 text-center text-secondary">
                        No activity logs found.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-dark table-hover align-middle custom-admin-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Platform</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.map((activity) => (
                                    <motion.tr 
                                        key={activity.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        <td className="text-secondary small">
                                            <FaClock className="me-2" />
                                            {formatTimestamp(activity.timestamp)}
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className={`p-2 rounded-circle ${activity.userEmail === 'Guest' ? 'bg-secondary' : 'bg-primary'} bg-opacity-25`}>
                                                    <FaUser size={12} className={activity.userEmail === 'Guest' ? 'text-secondary' : 'text-primary'} />
                                                </div>
                                                <span className={activity.userEmail === 'Guest' ? 'text-secondary font-italic' : 'text-white'}>
                                                    {activity.userEmail}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-accent-primary fw-bold">
                                                {activity.activityType}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={getPlatformBadge(activity.platform)}>
                                                {activity.platform}
                                            </span>
                                        </td>
                                        <td className="text-secondary small">
                                            {activity.details && Object.keys(activity.details).length > 0 ? (
                                                <div className="d-flex gap-2 flex-wrap">
                                                    {Object.entries(activity.details).map(([key, value]) => (
                                                        <span key={key} className="badge bg-dark border-secondary border text-secondary font-monospace">
                                                            {key}: {String(value)}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="opacity-25">-</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserActivityList;
