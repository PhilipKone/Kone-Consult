import React, { useMemo } from 'react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, 
    Tooltip as RechartsTooltip, PieChart, Pie, Cell 
} from 'recharts';
import { 
    FaWallet, FaMoneyBillWave, FaArrowUp, FaArrowDown, 
    FaHistory, FaCreditCard, FaMobileAlt, FaDownload,
    FaCheckCircle, FaExclamationCircle, FaClock, FaChartLine
} from 'react-icons/fa';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const COLORS = ['#FFD700', '#00C49F', '#0088FE', '#FF8042'];

const KonePayFinancials = ({ payments, totalRevenue, activeSite }) => {
    
    // 1. Process Trend Data (Last 7 Days)
    const trendData = useMemo(() => {
        const dateCounts = {};
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            dateCounts[dateStr] = 0;
        }

        payments.filter(p => p.status === 'success').forEach(p => {
            const date = p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000) : new Date();
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            if (dateCounts.hasOwnProperty(dateStr)) {
                dateCounts[dateStr] += (Number(p.amount) || 0);
            }
        });

        return Object.entries(dateCounts).map(([date, amount]) => ({ date, amount }));
    }, [payments]);

    // 2. Process Division Distribution
    const divisionData = useMemo(() => {
        const counts = {};
        payments.filter(p => p.status === 'success').forEach(p => {
            const div = p.division || 'Uncategorized';
            counts[div] = (counts[div] || 0) + (Number(p.amount) || 0);
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [payments]);

    const handleSeedTransactions = async () => {
        if (!window.confirm("Seed 5 test transactions into the database?")) return;
        
        const testData = [
            { amount: 1500, division: 'Kone Consult', customer: 'Global Energy Ltd', method: 'Card', status: 'success', type: 'Consultation Fee' },
            { amount: 450, division: 'Kone Code', customer: 'Philip Kone', method: 'MoMo', status: 'success', type: 'Template Purchase' },
            { amount: 200, division: 'Kone Lab', customer: 'Tech StartUp', method: 'MoMo', status: 'pending', type: 'Hardware Prototype' },
            { amount: 3000, division: 'Kone Academy', customer: 'Student Group', method: 'Card', status: 'success', type: 'Training Enrollment' },
            { amount: 120, division: 'Kone Code', customer: 'Dev User', method: 'MoMo', status: 'failed', type: 'Bug Bounty' },
        ];

        try {
            for (const t of testData) {
                await addDoc(collection(db, 'payments'), {
                    ...t,
                    createdAt: serverTimestamp(),
                    transactionId: `KNP-${Math.floor(Math.random() * 1000000)}`
                });
            }
            alert("Test transactions seeded successfully!");
        } catch (err) {
            console.error(err);
            alert("Error seeding data. Check console.");
        }
    };

    return (
        <div className="financials-container animate-fade-in">
            {/* Wallet & Stats */}
            <div className="row g-3 mb-4">
                <div className="col-12 col-md-4">
                    <div className="wallet-card-premium">
                        <div className="wallet-pattern"></div>
                        <div className="d-flex justify-content-between position-relative">
                            <div>
                                <p className="text-white text-opacity-60 small mb-1">Current Balance</p>
                                <h2 className="text-white fw-bold mb-0">₵{totalRevenue.toLocaleString()}</h2>
                                <p className="text-white text-opacity-40 small mt-2">Kone Pay Unified Wallet</p>
                            </div>
                            <div className="wallet-icon-glow"><FaWallet /></div>
                        </div>
                        <div className="mt-4 d-flex gap-2 position-relative">
                            <button className="btn btn-light btn-sm flex-grow-1 rounded-pill fw-bold py-2">Withdraw</button>
                            <button onClick={handleSeedTransactions} className="btn btn-outline-light btn-sm flex-grow-1 rounded-pill py-2">Seed Test</button>
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-4">
                    <div className="metric-card-glass h-100">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Growth (MTD)</p>
                                <h3 className="text-white mb-0">+12.5%</h3>
                                <p className="text-success small mb-0 mt-2"><FaArrowUp /> Increasing daily</p>
                            </div>
                            <div className="metric-icon gold"><FaMoneyBillWave /></div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <div className="metric-card-glass h-100">
                        <div className="d-flex justify-content-between">
                            <div>
                                <p className="text-secondary small mb-1">Active Payouts</p>
                                <h3 className="text-white mb-0">0</h3>
                                <p className="text-secondary small mb-0 mt-2">No pending withdrawals</p>
                            </div>
                            <div className="metric-icon cyan"><FaCheckCircle /></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Revenue Chart */}
                <div className="col-12 col-lg-8">
                    <div className="chart-card-glass">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h6 className="text-white mb-0 d-flex align-items-center gap-2">
                                <FaChartLine className="text-warning" /> Revenue Stream (GHS)
                            </h6>
                            <button className="btn btn-outline-secondary btn-sm border-0"><FaDownload /></button>
                        </div>
                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#FFD700" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#FFD700" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" vertical={false} />
                                    <XAxis dataKey="date" stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#666" fontSize={11} tickLine={false} axisLine={false} />
                                    <RechartsTooltip 
                                        contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                                    />
                                    <Area type="monotone" dataKey="amount" stroke="#FFD700" fillOpacity={1} fill="url(#colorGold)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Division Mix Pie */}
                <div className="col-12 col-lg-4">
                    <div className="chart-card-glass h-100">
                        <h6 className="text-white mb-4">Division Revenue Mix</h6>
                        <div style={{ width: '100%', height: 280 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={divisionData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {divisionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="col-12">
                    <div className="glass-card p-4">
                        <h5 className="text-white mb-4">Transaction History</h5>
                        <div className="table-responsive">
                            <table className="table table-dark table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th className="small text-secondary">TRANSACTION ID</th>
                                        <th className="small text-secondary">CUSTOMER</th>
                                        <th className="small text-secondary">DIVISION</th>
                                        <th className="small text-secondary">METHOD</th>
                                        <th className="small text-secondary">AMOUNT</th>
                                        <th className="small text-secondary">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-secondary">
                                                <FaHistory size={30} className="mb-3 opacity-20" /><br/>
                                                No transactions found in this division.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map(p => (
                                            <tr key={p.id}>
                                                <td className="font-monospace small">{p.transactionId}</td>
                                                <td>
                                                    <div className="text-white">{p.customer}</div>
                                                    <div className="text-secondary x-small">{p.type}</div>
                                                </td>
                                                <td>
                                                    <span className={`badge-division ${p.division?.replace(' ', '-').toLowerCase()}`}>
                                                        {p.division}
                                                    </span>
                                                </td>
                                                <td>
                                                    {p.method === 'Card' ? <FaCreditCard className="text-info" /> : <FaMobileAlt className="text-success" />}
                                                    <span className="ms-2 small">{p.method}</span>
                                                </td>
                                                <td className="text-white fw-bold">₵{p.amount}</td>
                                                <td>
                                                    {p.status === 'success' ? (
                                                        <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-20">Successful</span>
                                                    ) : p.status === 'pending' ? (
                                                        <span className="badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-20">Pending</span>
                                                    ) : (
                                                        <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-20">Failed</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KonePayFinancials;
