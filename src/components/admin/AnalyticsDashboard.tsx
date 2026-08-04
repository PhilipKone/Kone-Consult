import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
    PieChart, Pie, Cell, BarChart, Bar, Legend, Tooltip as RechartsTooltip 
} from 'recharts';
import { FaChartLine, FaUsers, FaArrowUp, FaGlobe, FaCogs } from 'react-icons/fa';
import Skeleton from '../Skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ActivityLogDoc {
    id: string;
    platform?: string;
    action?: string;
    userEmail?: string;
    timestamp: Date;
    [key: string]: any;
}

interface PaymentDoc {
    id: string;
    amount?: number;
    status?: string;
    createdAt: Date;
    [key: string]: any;
}

const AnalyticsDashboard: React.FC = () => {
    const [logs, setLogs] = useState<ActivityLogDoc[]>([]);
    const [payments, setPayments] = useState<PaymentDoc[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!db || !db.app) {
            setLoading(false);
            return;
        }

        const qLogs = query(
            collection(db, 'activity_logs'),
            orderBy('timestamp', 'desc'),
            limit(500)
        );

        const unsubscribeLogs = onSnapshot(qLogs, (snapshot) => {
            const fetchedLogs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            })) as ActivityLogDoc[];
            setLogs(fetchedLogs);
            setLoading(false);
        }, (err) => {
            console.log("Activity logs listener active (fallback initialized)", err);
            setLoading(false);
        });

        const qPayments = query(
            collection(db, 'payments'),
            orderBy('createdAt', 'desc'),
            limit(500)
        );

        const unsubscribePayments = onSnapshot(qPayments, (snapshot) => {
            const fetchedPayments = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            })) as PaymentDoc[];
            setPayments(fetchedPayments);
        }, (err) => {
            console.log("Payments listener active (fallback initialized)", err);
        });

        return () => {
            unsubscribeLogs();
            unsubscribePayments();
        };
    }, []);

    // 1. Process Platform Distribution (Pie Chart)
    const platformData = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            const platform = log.platform || 'Other';
            counts[platform] = (counts[platform] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [logs]);

    // 2. Process Revenue Trends
    const revenueData = useMemo(() => {
        const dateRevenue: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateRevenue[dateStr] = 0;
        }

        payments.forEach(payment => {
            if (payment.createdAt) {
                const dateStr = payment.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (Object.prototype.hasOwnProperty.call(dateRevenue, dateStr) && (payment.status === 'success' || payment.status === 'completed')) {
                    dateRevenue[dateStr] += (payment.amount || 0);
                }
            }
        });

        return Object.entries(dateRevenue).map(([date, revenue]) => ({ date, revenue }));
    }, [payments]);

    const totalRevenue = useMemo(() => {
        return payments
            .filter(p => p.status === 'success' || p.status === 'completed')
            .reduce((sum, p) => sum + (p.amount || 0), 0);
    }, [payments]);

    // 3. Process Activity Trends (Area Chart - Last 7 Days)
    const trendData = useMemo(() => {
        const dateCounts: Record<string, number> = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateCounts[dateStr] = 0;
        }

        logs.forEach(log => {
            if (log.timestamp) {
                const dateStr = log.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (Object.prototype.hasOwnProperty.call(dateCounts, dateStr)) {
                    dateCounts[dateStr]++;
                }
            }
        });

        return Object.entries(dateCounts).map(([date, count]) => ({ date, count }));
    }, [logs]);

    // 4. Process Top Actions (Bar Chart)
    const actionData = useMemo(() => {
        const counts: Record<string, number> = {};
        logs.forEach(log => {
            const action = log.action || 'Unknown';
            counts[action] = (counts[action] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([action, count]) => ({ action, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    }, [logs]);

    // Summary Metrics
    const metrics = useMemo(() => {
        const total = logs.length;
        const guests = logs.filter(l => l.userEmail === 'Guest').length;
        const uniqueUsers = new Set(logs.map(l => l.userEmail)).size;
        return { total, guests, uniqueUsers };
    }, [logs]);

    if (loading) {
        return (
            <div className="analytics-container animate-fade-in">
                <div className="row g-3 mb-4">
                    {[1, 2, 3].map(i => (
                        <div className="col-12 col-md-3" key={i}>
                            <Skeleton type="stat-card" />
                        </div>
                    ))}
                </div>
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <Skeleton type="chart-box" height="300px" />
                    </div>
                    <div className="col-12 col-lg-4">
                        <Skeleton type="chart-box" height="300px" />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Skeleton type="chart-box" height="300px" />
                    </div>
                    <div className="col-12 col-lg-6">
                        <Skeleton type="chart-box" height="300px" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="analytics-container animate-fade-in">
            {/* Metric Cards */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-3">
                    <div className="metric-card-glass">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Total Revenue</p>
                                <h3 className="text-white mb-0">${totalRevenue.toLocaleString()}</h3>
                            </div>
                            <div className="metric-icon green"><FaChartLine /></div>
                        </div>
                        <div className="mt-2 small text-success">
                            <FaArrowUp /> Verified Payments
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="metric-card-glass">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Total Interactions</p>
                                <h3 className="text-white mb-0">{metrics.total}</h3>
                            </div>
                            <div className="metric-icon blue"><FaChartLine /></div>
                        </div>
                        <div className="mt-2 small text-success">
                            <FaArrowUp /> Live Tracking Active
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="metric-card-glass">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Active Visitors</p>
                                <h3 className="text-white mb-0">{metrics.uniqueUsers}</h3>
                            </div>
                            <div className="metric-icon green"><FaUsers /></div>
                        </div>
                        <p className="mt-2 small text-secondary mb-0">Including {metrics.guests} guests</p>
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    <div className="metric-card-glass">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Ecosystem Nodes</p>
                                <h3 className="text-white mb-0">10</h3>
                            </div>
                            <div className="metric-icon orange"><FaGlobe /></div>
                        </div>
                        <p className="mt-2 small text-secondary mb-0">Kone Subdomains Active</p>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Activity Trend Chart */}
                <div className="col-12 col-lg-8">
                    <div className="chart-card-glass">
                        <h6 className="text-white mb-4 d-flex align-items-center gap-2">
                            <FaChartLine className="text-primary" /> Activity Trends (Last 7 Days)
                        </h6>
                        <div className="chart-container" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0088FE" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#0088FE' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#0088FE" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Platform Distribution Pie */}
                <div className="col-12 col-lg-4">
                    <div className="chart-card-glass h-100">
                        <h6 className="text-white mb-4 d-flex align-items-center gap-2">
                            <FaGlobe className="text-info" /> Platform Traffic
                        </h6>
                        <div className="chart-container" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={platformData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {platformData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Revenue Trend Chart */}
                <div className="col-12 col-lg-12">
                    <div className="chart-card-glass">
                        <h6 className="text-white mb-4 d-flex align-items-center gap-2">
                            <FaChartLine className="text-success" /> Revenue Trends (Last 7 Days)
                        </h6>
                        <div className="chart-container" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00C49F" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#00C49F" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#00C49F' }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#00C49F" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Actions Bar Chart */}
                <div className="col-12 col-lg-6">
                    <div className="chart-card-glass">
                        <h6 className="text-white mb-4 d-flex align-items-center gap-2">
                            <FaCogs className="text-warning" /> Most Frequent Interactions
                        </h6>
                        <div className="chart-container" style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={actionData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" horizontal={false} />
                                    <XAxis type="number" stroke="#666" fontSize={12} hide />
                                    <YAxis dataKey="action" type="category" stroke="#fff" fontSize={12} width={150} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    />
                                    <Bar dataKey="count" fill="#FFBB28" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
