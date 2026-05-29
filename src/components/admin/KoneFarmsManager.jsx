import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    updateDoc, 
    deleteDoc, 
    setDoc 
} from 'firebase/firestore';
import { 
    FaUsers, 
    FaSearch, 
    FaTrash, 
    FaCheck, 
    FaTimes, 
    FaSeedling, 
    FaSlidersH,
    FaSyncAlt
} from 'react-icons/fa';

export default function KoneFarmsManager() {
    const [distributors, setDistributors] = useState([]);
    const [loadingDistributors, setLoadingDistributors] = useState(true);
    const [distributorSearch, setDistributorSearch] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // Live telemetry states
    const [moisture, setMoisture] = useState(48);
    const [temperature, setTemperature] = useState(29.5);
    const [sunlight, setSunlight] = useState(82);
    const [valveActive, setValveActive] = useState(false);
    const [loadingTelemetry, setLoadingTelemetry] = useState(true);
    const [savingTelemetry, setSavingTelemetry] = useState(false);

    // 1. Subscribe to distributor registrations (newest first)
    useEffect(() => {
        const q = query(collection(db, 'farm_distributors'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDistributors(data);
            setLoadingDistributors(false);
        }, (error) => {
            console.error("Error subscribing to distributors:", error);
            setLoadingDistributors(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Subscribe to live IoT telemetry override settings
    useEffect(() => {
        const telemDocRef = doc(db, 'farm_telemetry', 'live');
        const unsubscribe = onSnapshot(telemDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setMoisture(data.moisture ?? 48);
                setTemperature(data.temperature ?? 29.5);
                setSunlight(data.sunlight ?? 82);
                setValveActive(data.valveActive ?? false);
            } else {
                // If doc doesn't exist, create it with default values
                const defaults = {
                    moisture: 48,
                    temperature: 29.5,
                    sunlight: 82,
                    valveActive: false,
                    updatedAt: new Date().toISOString()
                };
                setDoc(telemDocRef, defaults).catch(err => console.error(err));
            }
            setLoadingTelemetry(false);
        }, (error) => {
            console.error("Error subscribing to telemetry:", error);
            setLoadingTelemetry(false);
        });

        return () => unsubscribe();
    }, []);

    // 3. Handlers
    const handleStatusUpdate = async (id, newStatus) => {
        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'farm_distributors', id), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteDistributor = async (id, name) => {
        if (!window.confirm(`Are you sure you want to remove distributor application from "${name}"?`)) return;
        setActionLoading(true);
        try {
            await deleteDoc(doc(db, 'farm_distributors', id));
        } catch (error) {
            console.error("Error deleting distributor:", error);
            alert("Failed to remove distributor.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleSaveTelemetry = async (e) => {
        e.preventDefault();
        setSavingTelemetry(true);
        try {
            await setDoc(doc(db, 'farm_telemetry', 'live'), {
                moisture: Number(moisture),
                temperature: Number(temperature),
                sunlight: Number(sunlight),
                valveActive: valveActive,
                updatedAt: new Date().toISOString()
            });
            alert("Live agritech telemetry updated successfully!");
        } catch (error) {
            console.error("Error updating telemetry:", error);
            alert("Failed to update telemetry. See console.");
        } finally {
            setSavingTelemetry(false);
        }
    };

    // Calculate distributor stats
    const totalApplications = distributors.length;
    const pendingCount = distributors.filter(d => d.status === 'Pending' || !d.status).length;
    const approvedCount = distributors.filter(d => d.status === 'Approved').length;

    // Filters
    const filteredDistributors = distributors.filter(dist => 
        dist.name?.toLowerCase().includes(distributorSearch.toLowerCase()) ||
        dist.email?.toLowerCase().includes(distributorSearch.toLowerCase())
    );

    return (
        <div className="farms-manager-wrapper animate-fade-in">
            {/* Roster & Telemetry Stats Widgets */}
            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                            <FaUsers size={24} />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Total Signup Apps</h6>
                            <h3 className="text-white mb-0 fw-bold">{totalApplications}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                            <FaSyncAlt size={20} className="animate-spin-slow" />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Pending Review</h6>
                            <h3 className="text-warning mb-0 fw-bold">{pendingCount}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399' }}>
                            <FaCheck size={20} />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Approved Partners</h6>
                            <h3 className="text-success mb-0 fw-bold">{approvedCount}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split layout: IoT Telemetry Override Form (Left) & Distributor Table (Right) */}
            <div className="row g-4">
                {/* Left Panel: IoT Telemetry Overrides */}
                <div className="col-lg-4">
                    <div className="glass-card p-4 h-100">
                        <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                            <FaSlidersH className="text-success" /> smartFarm IoT Overrides
                        </h4>
                        <p className="text-secondary small mb-4">
                            Adjust live sensor readings below. Values will sync in real-time to the Kone Farms app and SVG charts globally.
                        </p>

                        {loadingTelemetry ? (
                            <div className="text-center py-5"><span className="spinner-border text-success"></span></div>
                        ) : (
                            <form onSubmit={handleSaveTelemetry}>
                                {/* Soil Moisture Slider */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label className="label-premium m-0">Soil Moisture 💧</label>
                                        <span className="text-success fw-bold">{moisture}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={moisture} 
                                        onChange={(e) => setMoisture(Number(e.target.value))}
                                        className="form-range custom-slider-range w-100"
                                    />
                                </div>

                                {/* Temperature Slider */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label className="label-premium m-0">Air Temperature 🌡️</label>
                                        <span className="text-warning fw-bold">{temperature}°C</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="50" 
                                        step="0.5"
                                        value={temperature} 
                                        onChange={(e) => setTemperature(Number(e.target.value))}
                                        className="form-range custom-slider-range w-100"
                                    />
                                </div>

                                {/* Sunlight Slider */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between mb-1">
                                        <label className="label-premium m-0">Solar Sunlight ☀️</label>
                                        <span className="text-info fw-bold">{sunlight}%</span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="100" 
                                        value={sunlight} 
                                        onChange={(e) => setSunlight(Number(e.target.value))}
                                        className="form-range custom-slider-range w-100"
                                    />
                                </div>

                                {/* Irrigation Valve Switch Toggle */}
                                <div className="mb-4 glass-card p-3 d-flex align-items-center justify-content-between">
                                    <div>
                                        <strong className="text-white d-block" style={{ fontSize: '0.9rem' }}>Irrigation Valve</strong>
                                        <span className="text-secondary x-small">Click to open/close drip valve</span>
                                    </div>
                                    <div className="form-check form-switch p-0 m-0">
                                        <button
                                            type="button"
                                            onClick={() => setValveActive(!valveActive)}
                                            className={`btn btn-sm rounded-pill px-3 fw-bold transition-all ${valveActive ? 'btn-success' : 'btn-outline-secondary'}`}
                                        >
                                            {valveActive ? "VALVE OPEN 🟢" : "VALVE CLOSED ⚪"}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100 rounded-pill py-2 fw-bold"
                                    disabled={savingTelemetry}
                                    style={{ border: 'none', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                                >
                                    {savingTelemetry ? "Pushing Overrides..." : "Push IoT Overrides 🚀"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Right Panel: Distributor Application Roster */}
                <div className="col-lg-8">
                    <div className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                            <h4 className="text-white m-0 d-flex align-items-center gap-2">
                                <FaSeedling className="text-success" /> Distributor Registry
                            </h4>
                        </div>

                        {/* Search Input */}
                        <div className="position-relative mb-4">
                            <input
                                type="text"
                                className="form-control-dark w-100 ps-5"
                                placeholder="Search distributors by partner name or email..."
                                value={distributorSearch}
                                onChange={(e) => setDistributorSearch(e.target.value)}
                            />
                            <FaSearch className="position-absolute text-secondary" style={{ left: '16px', top: '15px' }} />
                        </div>

                        {/* Distributor Table */}
                        <div className="custom-scrollbar overflow-auto" style={{ maxHeight: '480px' }}>
                            {loadingDistributors ? (
                                <div className="text-center py-5"><span className="spinner-border text-success"></span></div>
                            ) : filteredDistributors.length === 0 ? (
                                <div className="text-center py-5 text-secondary">No distributor applications logged yet.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark table-hover align-middle custom-table">
                                        <thead>
                                            <tr>
                                                <th>Partner / Store</th>
                                                <th>Contact Email</th>
                                                <th>Requested Boxes</th>
                                                <th>Application Date</th>
                                                <th>Status</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDistributors.map(dist => {
                                                const formattedDate = dist.createdAt 
                                                    ? new Date(dist.createdAt).toLocaleDateString()
                                                    : 'N/A';
                                                const status = dist.status || 'Pending';
                                                
                                                // Dynamic status styles
                                                let statusBadge = <span className="badge bg-warning text-dark px-2.5 py-1 text-xs fw-bold rounded-pill">Pending Review</span>;
                                                if (status === 'Approved') {
                                                    statusBadge = <span className="badge bg-success text-white px-2.5 py-1 text-xs fw-bold rounded-pill">Approved Partner</span>;
                                                } else if (status === 'Denied') {
                                                    statusBadge = <span className="badge bg-danger text-white px-2.5 py-1 text-xs fw-bold rounded-pill">Denied Application</span>;
                                                }

                                                return (
                                                    <tr key={dist.id}>
                                                        <td>
                                                            <strong className="text-white d-block">{dist.name}</strong>
                                                            <span className="x-small text-secondary font-monospace">{dist.id}</span>
                                                        </td>
                                                        <td>
                                                            <a href={`mailto:${dist.email}`} className="text-info text-decoration-none small">
                                                                {dist.email}
                                                            </a>
                                                        </td>
                                                        <td className="fw-bold text-center">
                                                            {dist.quantity} Box{dist.quantity > 1 ? 'es' : ''}
                                                            <span className="d-block text-secondary x-small">({dist.quantity * 12} Jars)</span>
                                                        </td>
                                                        <td className="small text-secondary">{formattedDate}</td>
                                                        <td>{statusBadge}</td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-1 flex-wrap">
                                                                {status !== 'Approved' && (
                                                                    <button 
                                                                        onClick={() => handleStatusUpdate(dist.id, 'Approved')}
                                                                        className="btn btn-sm btn-outline-success rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                        style={{ width: '32px', height: '32px' }}
                                                                        title="Approve Distributor"
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <FaCheck size={12} />
                                                                    </button>
                                                                )}
                                                                {status !== 'Denied' && (
                                                                    <button 
                                                                        onClick={() => handleStatusUpdate(dist.id, 'Denied')}
                                                                        className="btn btn-sm btn-outline-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                        style={{ width: '32px', height: '32px' }}
                                                                        title="Deny Application"
                                                                        disabled={actionLoading}
                                                                    >
                                                                        <FaTimes size={12} />
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => handleDeleteDistributor(dist.id, dist.name)}
                                                                    className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                    style={{ width: '32px', height: '32px' }}
                                                                    title="Remove application"
                                                                    disabled={actionLoading}
                                                                >
                                                                    <FaTrash size={12} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
