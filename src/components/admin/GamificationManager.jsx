import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { 
    collection, 
    query, 
    onSnapshot, 
    doc, 
    setDoc, 
    updateDoc, 
    deleteDoc, 
    getDocs,
    serverTimestamp 
} from 'firebase/firestore';
import { 
    FaUsers, 
    FaGamepad, 
    FaSearch, 
    FaPlus, 
    FaTrash, 
    FaEdit, 
    FaCrown, 
    FaTrophy, 
    FaCoins, 
    FaGraduationCap, 
    FaSyncAlt, 
    FaCheck, 
    FaTimes, 
    FaFolderOpen 
} from 'react-icons/fa';

const MASCOT_POOL = [
  // Animals (75)
  '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵',
  '🐔','🐧','🐦','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐢','🐍','🦎','🐙',
  '🦑','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐘','🦛','🦏','🐪',
  '🦒','🦘','🦬','🐿️','🦔','🦦','🦥','🦡','🦖','🦕','🐏','🐑','🐐','🦌','🐓',
  '🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🐈','🐕','🦭','🦋','🐌','🐞','🐜','🐝',
  // Food & Treats (40)
  '🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍒','🍑','🥭','🍍','🥥','🥝',
  '🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🌽','🥕','🫑','🧅','🧄','🥔','🍠','🥐',
  '🍞','🥖','🥨','🍕','🍟','🍔','🌭','🌮','🌯','🍿','🥚','🍳','🥞','🧇','🧀',
  // Space, Vehicles & Nature (45)
  '🚀','🛸','🚁','✈️','🪂','🛰️','🚂','🚌','🚑','🚒','🚓','🚕','🚗','🏎️','🚙',
  '🛻','🚜','🚲','🛴','🛹','🛺','⛵','🚢','⚓','🌍','🌙','☀️','⭐','🪐','☄️',
  '🌈','⚡','❄️','🔥','💧','🌴','🌲','🌵','🍀','🍁','🍄','🌻','🌸','🎈','🎉',
  // Tools, Gadgets & Play (40)
  '🧠','🦾','🎮','📱','💻','🖥️','⌨️','🖱️','🎧','🎙️','🕶️','👑','💎','🔔','🎁',
  '🏆','🥇','🎖️','🧭','🔭','🔬','🧪','🧬','🦫','🪓','🔨','🛠️','🔧','🔩','⚙️',
  '🧲','🛡️','🏹','🗝️','🔑','🧸','🪁','🪀','🎨','🧩'
];

export default function GamificationManager() {
    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(true);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [students, setStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    
    // Search Filters
    const [sectionSearch, setSectionSearch] = useState('');
    const [studentSearch, setStudentSearch] = useState('');
    
    // Modal & Action states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newTeacherId, setNewTeacherId] = useState('ADMIN_SYSTEM');
    const [showRenameModal, setShowRenameModal] = useState(false);
    const [renameClassName, setRenameClassName] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    
    // Student Form states
    const [showAddStudent, setShowAddStudent] = useState(false);
    const [newStudentName, setNewStudentName] = useState('');
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editingForm, setEditingForm] = useState({
        name: '',
        xp: 0,
        coins: 100,
        secretPicture: '🤖'
    });

    // Roster Aggregates Cache
    const [rostersCache, setRostersCache] = useState({});

    // 1. Subscribe to all classroom sections
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'sections'), (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            // Sort sections locally: newest first
            data.sort((a, b) => {
                const da = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const db = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return db - da;
            });
            
            setSections(data);
            setLoadingSections(false);
        }, (error) => {
            console.error("Error subscribing to sections:", error);
            setLoadingSections(false);
        });

        return () => unsubscribe();
    }, []);

    // 2. Fetch rosters in the background for all sections to calculate aggregates
    useEffect(() => {
        if (sections.length === 0) return;

        const unsubscribes = sections.map(section => {
            return onSnapshot(collection(db, 'sections', section.id, 'students'), (snapshot) => {
                const roster = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRostersCache(prev => ({
                    ...prev,
                    [section.id]: roster
                }));
            });
        });

        return () => {
            unsubscribes.forEach(unsub => unsub());
        };
    }, [sections]);

    // 3. Subscribe to the selected classroom section's student roster
    useEffect(() => {
        if (!selectedSectionId) {
            setStudents([]);
            return;
        }

        setLoadingStudents(true);
        const unsubscribe = onSnapshot(collection(db, 'sections', selectedSectionId, 'students'), (snapshot) => {
            const roster = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStudents(roster);
            setLoadingStudents(false);
        }, (err) => {
            console.error("Error loading roster:", err);
            setLoadingStudents(false);
        });

        return () => unsubscribe();
    }, [selectedSectionId]);

    // Code generators
    const generateSectionCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789';
        let code = 'KONE-';
        for (let i = 0; i < 4; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // --- Admin Handlers ---
    
    // Create new classroom
    const handleCreateSection = async (e) => {
        e.preventDefault();
        if (!newClassName.trim()) return;
        
        setActionLoading(true);
        const code = generateSectionCode();
        try {
            await setDoc(doc(db, 'sections', code), {
                name: newClassName.trim(),
                createdAt: new Date().toISOString(),
                teacherId: newTeacherId.trim() || 'ADMIN_SYSTEM'
            });
            setShowCreateModal(false);
            setNewClassName('');
            setSelectedSectionId(code);
        } catch (error) {
            console.error("Error creating section:", error);
            alert("Failed to create section. See console.");
        } finally {
            setActionLoading(false);
        }
    };

    // Rename active classroom
    const handleRenameSection = async (e) => {
        e.preventDefault();
        if (!renameClassName.trim() || !selectedSectionId) return;

        setActionLoading(true);
        try {
            await updateDoc(doc(db, 'sections', selectedSectionId), {
                name: renameClassName.trim()
            });
            setShowRenameModal(false);
        } catch (error) {
            console.error("Error renaming class:", error);
            alert("Failed to rename class.");
        } finally {
            setActionLoading(false);
        }
    };

    // Delete classroom & nested student profiles
    const handleDeleteSection = async () => {
        if (!selectedSectionId) return;
        
        const activeSec = sections.find(s => s.id === selectedSectionId);
        const name = activeSec ? activeSec.name : selectedSectionId;
        
        if (!window.confirm(`⚠️ WARNING: Are you sure you want to delete classroom "${name}" (${selectedSectionId})?\n\nThis will instantly delete the section AND all student profiles registered within it! This action is permanent.`)) {
            return;
        }

        setActionLoading(true);
        try {
            // 1. Fetch & delete all students first (cascading cleanup)
            const studentsSnap = await getDocs(collection(db, 'sections', selectedSectionId, 'students'));
            const deletePromises = studentsSnap.docs.map(studentDoc => 
                deleteDoc(doc(db, 'sections', selectedSectionId, 'students', studentDoc.id))
            );
            await Promise.all(deletePromises);

            // 2. Delete parent section document
            await deleteDoc(doc(db, 'sections', selectedSectionId));
            setSelectedSectionId(null);
            alert("Classroom and student roster deleted successfully!");
        } catch (error) {
            console.error("Error during cascading deletion:", error);
            alert("Deletion failed. Check console logs.");
        } finally {
            setActionLoading(false);
        }
    };

    // Add Student to selected classroom
    const handleAddStudent = async (e) => {
        e.preventDefault();
        if (!newStudentName.trim() || !selectedSectionId) return;

        setActionLoading(true);
        const studentId = `student_${Math.random().toString(36).substr(2, 9)}`;
        const randomMascot = MASCOT_POOL[Math.floor(Math.random() * MASCOT_POOL.length)];
        
        const newStudent = {
            name: newStudentName.trim(),
            secretPicture: randomMascot,
            xp: 0,
            coins: 100,
            completedMissions: [],
            inventory: [],
            equippedItems: {},
            unlockedSeries: ['series_word_search']
        };

        try {
            await setDoc(doc(db, 'sections', selectedSectionId, 'students', studentId), newStudent);
            setNewStudentName('');
            setShowAddStudent(false);
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student.");
        } finally {
            setActionLoading(false);
        }
    };

    // Save edited student stats/details
    const handleSaveStudentEdit = async (studentId) => {
        if (!editingForm.name.trim() || !selectedSectionId) return;
        
        setActionLoading(true);
        try {
            const studentRef = doc(db, 'sections', selectedSectionId, 'students', studentId);
            await updateDoc(studentRef, {
                name: editingForm.name.trim(),
                xp: Number(editingForm.xp) || 0,
                coins: Number(editingForm.coins) || 0,
                secretPicture: editingForm.secretPicture
            });
            setEditingStudentId(null);
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to save changes.");
        } finally {
            setActionLoading(false);
        }
    };

    // Regenerate visual mascot password
    const handleRegenMascot = (student) => {
        const remainingPool = MASCOT_POOL.filter(m => m !== student.secretPicture);
        const randomMascot = remainingPool[Math.floor(Math.random() * remainingPool.length)];
        
        if (editingStudentId === student.id) {
            setEditingForm(prev => ({ ...prev, secretPicture: randomMascot }));
        } else {
            // Instant Firestore Save
            updateDoc(doc(db, 'sections', selectedSectionId, 'students', student.id), {
                secretPicture: randomMascot
            }).catch(err => console.error("Error updating mascot:", err));
        }
    };

    // Delete single student
    const handleDeleteStudent = async (studentId, studentName) => {
        if (!selectedSectionId) return;
        if (!window.confirm(`Are you sure you want to delete student "${studentName}"? All their gamified history and progress will be permanently lost.`)) return;

        setActionLoading(true);
        try {
            await deleteDoc(doc(db, 'sections', selectedSectionId, 'students', studentId));
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student.");
        } finally {
            setActionLoading(false);
        }
    };

    // --- Aggregate Computations ---
    const calculateAggregates = () => {
        let totalClassrooms = sections.length;
        let totalStudents = 0;
        let totalXP = 0;
        let topXP = -1;
        let topStudent = null;

        Object.keys(rostersCache).forEach(classId => {
            const roster = rostersCache[classId];
            totalStudents += roster.length;
            roster.forEach(student => {
                const xp = Number(student.xp) || 0;
                totalXP += xp;
                if (xp > topXP) {
                    topXP = xp;
                    const classroom = sections.find(s => s.id === classId);
                    topStudent = {
                        name: student.name,
                        xp: xp,
                        className: classroom ? classroom.name : classId,
                        emoji: student.secretPicture || '🎒'
                    };
                }
            });
        });

        const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;

        return {
            totalClassrooms,
            totalStudents,
            averageXP,
            topStudent
        };
    };

    const aggregates = calculateAggregates();

    // Filters
    const filteredSections = sections.filter(sec => 
        sec.name?.toLowerCase().includes(sectionSearch.toLowerCase()) ||
        sec.id?.toLowerCase().includes(sectionSearch.toLowerCase()) ||
        sec.teacherId?.toLowerCase().includes(sectionSearch.toLowerCase())
    );

    const filteredStudents = students.filter(std => 
        std.name?.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const selectedSection = sections.find(s => s.id === selectedSectionId);

    return (
        <div className="gamification-manager-wrapper">
            {/* Aggregates Dashboard */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon cyan rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(0, 255, 255, 0.1)', color: '#00FFFF' }}>
                            <FaFolderOpen size={24} />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Active Classrooms</h6>
                            <h3 className="text-white mb-0 fw-bold">{aggregates.totalClassrooms}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon cyan rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(88, 166, 255, 0.1)', color: '#58a6ff' }}>
                            <FaUsers size={24} />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Total Kids</h6>
                            <h3 className="text-white mb-0 fw-bold">{aggregates.totalStudents}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100">
                        <div className="metric-icon cyan rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(255, 187, 40, 0.1)', color: '#FFBB28' }}>
                            <FaTrophy size={24} />
                        </div>
                        <div>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Average XP</h6>
                            <h3 className="text-white mb-0 fw-bold">{aggregates.averageXP} XP</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="glass-card p-3 d-flex align-items-center gap-3 h-100" style={{ border: '1px solid rgba(255, 215, 0, 0.15)', background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.6) 0%, rgba(255, 215, 0, 0.03) 100%)' }}>
                        <div className="metric-icon gold rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px', background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700' }}>
                            <FaCrown size={24} />
                        </div>
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                            <h6 className="text-secondary mb-1 uppercase font-semibold text-xs tracking-wider">Top Student</h6>
                            {aggregates.topStudent ? (
                                <div className="text-truncate">
                                    <span className="text-white fw-bold me-1">{aggregates.topStudent.emoji} {aggregates.topStudent.name}</span>
                                    <span className="text-warning small d-block">({aggregates.topStudent.xp} XP - {aggregates.topStudent.className})</span>
                                </div>
                            ) : (
                                <span className="text-secondary small">No active scores</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Master Detail Panels */}
            <div className="row g-4">
                {/* Left Master Column: Classroom List */}
                <div className="col-lg-5">
                    <div className="glass-card p-4 h-100">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-white m-0 d-flex align-items-center gap-2">
                                <FaGamepad className="text-primary" /> Classrooms
                            </h4>
                            <button 
                                onClick={() => setShowCreateModal(true)} 
                                className="btn btn-sm btn-primary rounded-pill px-3 d-flex align-items-center gap-1"
                            >
                                <FaPlus size={12} /> Create Class
                            </button>
                        </div>

                        {/* Search Sections */}
                        <div className="position-relative mb-3">
                            <input
                                type="text"
                                className="form-control-dark w-100 ps-5"
                                placeholder="Search by name, code, or teacher ID..."
                                value={sectionSearch}
                                onChange={(e) => setSectionSearch(e.target.value)}
                            />
                            <FaSearch className="position-absolute text-secondary" style={{ left: '16px', top: '15px' }} />
                        </div>

                        {/* Sections List */}
                        <div className="custom-scrollbar overflow-auto" style={{ maxHeight: '550px' }}>
                            {loadingSections ? (
                                <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>
                            ) : filteredSections.length === 0 ? (
                                <div className="text-center py-5 text-secondary">No classrooms found.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-dark table-hover align-middle custom-table pointer-rows">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>Class Name</th>
                                                <th className="text-end">Kids</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredSections.map(sec => {
                                                const kidCount = rostersCache[sec.id]?.length || 0;
                                                const isActive = selectedSectionId === sec.id;
                                                return (
                                                    <tr 
                                                        key={sec.id} 
                                                        onClick={() => setSelectedSectionId(sec.id)}
                                                        className={`pointer ${isActive ? 'table-active-row' : ''}`}
                                                        style={isActive ? { background: 'rgba(88, 166, 255, 0.08)' } : {}}
                                                    >
                                                        <td>
                                                            <span className="badge bg-secondary font-monospace tracking-wide px-2 py-1 text-white">
                                                                {sec.id}
                                                            </span>
                                                        </td>
                                                        <td className="text-white fw-bold">{sec.name}</td>
                                                        <td className="text-end text-secondary">
                                                            <span className="badge bg-dark border border-secondary rounded-pill px-2">
                                                                {kidCount} Kids
                                                            </span>
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

                {/* Right Detail Column: Selected Roster Detail View */}
                <div className="col-lg-7">
                    {selectedSectionId ? (
                        <div className="glass-card p-4 h-100">
                            {/* Classroom Title & Actions */}
                            <div className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom border-secondary flex-wrap gap-2">
                                <div>
                                    <div className="d-flex align-items-center gap-2">
                                        <h3 className="text-white m-0 fw-bold">{selectedSection?.name}</h3>
                                        <span className="badge bg-primary font-monospace tracking-wide text-xs">
                                            {selectedSectionId}
                                        </span>
                                    </div>
                                    <span className="text-secondary small">
                                        Teacher: <code>{selectedSection?.teacherId || 'System'}</code>
                                    </span>
                                </div>

                                <div className="d-flex gap-2">
                                    <button 
                                        onClick={() => {
                                            setRenameClassName(selectedSection?.name || '');
                                            setShowRenameModal(true);
                                        }}
                                        className="btn btn-sm btn-outline-info rounded-pill px-3"
                                    >
                                        <FaEdit /> Rename
                                    </button>
                                    <button 
                                        onClick={handleDeleteSection}
                                        className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                        disabled={actionLoading}
                                    >
                                        <FaTrash /> Delete Class
                                    </button>
                                </div>
                            </div>

                            {/* Roster Section Header */}
                            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                <h4 className="text-white m-0 d-flex align-items-center gap-2">
                                    <FaGraduationCap className="text-success" /> Kids Roster
                                </h4>
                                <button 
                                    onClick={() => setShowAddStudent(!showAddStudent)}
                                    className="btn btn-sm btn-success rounded-pill px-3 d-flex align-items-center gap-1"
                                >
                                    <FaPlus size={12} /> Add Student
                                </button>
                            </div>

                            {/* Add Student Form */}
                            {showAddStudent && (
                                <form onSubmit={handleAddStudent} className="glass-card p-3 mb-4 bg-dark-dim border border-success animate-slide-in">
                                    <div className="row g-2 align-items-end">
                                        <div className="col-sm-8">
                                            <label className="label-premium">Student Name</label>
                                            <input
                                                type="text"
                                                className="form-control-dark w-100"
                                                placeholder="Enter kid's name..."
                                                value={newStudentName}
                                                onChange={(e) => setNewStudentName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-sm-4 d-flex gap-2">
                                            <button type="submit" className="btn btn-success w-100 rounded-pill" disabled={actionLoading}>
                                                Add
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={() => { setShowAddStudent(false); setNewStudentName(''); }}
                                                className="btn btn-outline-secondary rounded-pill px-3"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Search Student */}
                            <div className="position-relative mb-3">
                                <input
                                    type="text"
                                    className="form-control-dark w-100 ps-5"
                                    placeholder="Filter kids by name..."
                                    value={studentSearch}
                                    onChange={(e) => setStudentSearch(e.target.value)}
                                />
                                <FaSearch className="position-absolute text-secondary" style={{ left: '16px', top: '15px' }} />
                            </div>

                            {/* Roster list */}
                            <div className="custom-scrollbar overflow-auto" style={{ maxHeight: '420px' }}>
                                {loadingStudents ? (
                                    <div className="text-center py-5"><span className="spinner-border text-success"></span></div>
                                ) : filteredStudents.length === 0 ? (
                                    <div className="text-center py-5 text-secondary">Roster is empty. Add students to get started!</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-dark table-hover align-middle custom-table">
                                            <thead>
                                                <tr>
                                                    <th>Mascot</th>
                                                    <th>Kid's Name</th>
                                                    <th>XP</th>
                                                    <th>Coins</th>
                                                    <th className="text-end">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredStudents.map(std => {
                                                    const isEditing = editingStudentId === std.id;
                                                    return (
                                                        <tr key={std.id}>
                                                            {/* Mascot Emoji Password */}
                                                            <td>
                                                                <div className="d-flex align-items-center gap-1">
                                                                    <span 
                                                                        className="d-inline-flex align-items-center justify-content-center rounded-circle border bg-dark border-secondary cursor-pointer hover-pulse"
                                                                        style={{ width: '42px', height: '42px', fontSize: '1.4rem' }}
                                                                        title="Regenerate/shuffle visual password"
                                                                        onClick={() => handleRegenMascot(std)}
                                                                    >
                                                                        {isEditing ? editingForm.secretPicture : std.secretPicture}
                                                                    </span>
                                                                    <button 
                                                                        type="button" 
                                                                        className="btn btn-action-minimal p-0" 
                                                                        title="Shuffle visual password emoji"
                                                                        onClick={() => handleRegenMascot(std)}
                                                                    >
                                                                        <FaSyncAlt size={10} className="text-secondary" />
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            {/* Student Name */}
                                                            <td>
                                                                {isEditing ? (
                                                                    <input
                                                                        type="text"
                                                                        className="form-control-dark py-1 px-2 fw-bold text-white"
                                                                        style={{ fontSize: '0.9rem', maxWidth: '140px' }}
                                                                        value={editingForm.name}
                                                                        onChange={(e) => setEditingForm(prev => ({ ...prev, name: e.target.value }))}
                                                                    />
                                                                ) : (
                                                                    <div>
                                                                        <span className="text-white fw-bold d-block">{std.name}</span>
                                                                        <span className="x-small text-secondary font-monospace">{std.id}</span>
                                                                    </div>
                                                                )}
                                                            </td>

                                                            {/* Student XP */}
                                                            <td>
                                                                {isEditing ? (
                                                                    <input
                                                                        type="number"
                                                                        className="form-control-dark py-1 px-2 text-warning fw-bold"
                                                                        style={{ fontSize: '0.9rem', maxWidth: '75px' }}
                                                                        value={editingForm.xp}
                                                                        onChange={(e) => setEditingForm(prev => ({ ...prev, xp: Number(e.target.value) || 0 }))}
                                                                    />
                                                                ) : (
                                                                    <span className="text-warning fw-bold d-flex align-items-center gap-1">
                                                                        <FaTrophy size={12} /> {std.xp}
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Student Coins */}
                                                            <td>
                                                                {isEditing ? (
                                                                    <input
                                                                        type="number"
                                                                        className="form-control-dark py-1 px-2 text-success fw-bold"
                                                                        style={{ fontSize: '0.9rem', maxWidth: '75px' }}
                                                                        value={editingForm.coins}
                                                                        onChange={(e) => setEditingForm(prev => ({ ...prev, coins: Number(e.target.value) || 0 }))}
                                                                    />
                                                                ) : (
                                                                    <span className="text-success fw-bold d-flex align-items-center gap-1">
                                                                        <FaCoins size={12} /> {std.coins}
                                                                    </span>
                                                                )}
                                                            </td>

                                                            {/* Actions */}
                                                            <td className="text-end">
                                                                {isEditing ? (
                                                                    <div className="d-flex justify-content-end gap-1">
                                                                        <button 
                                                                            onClick={() => handleSaveStudentEdit(std.id)}
                                                                            className="btn btn-sm btn-success rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                            disabled={actionLoading}
                                                                        >
                                                                            <FaCheck size={12} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => setEditingStudentId(null)}
                                                                            className="btn btn-sm btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                        >
                                                                            <FaTimes size={12} />
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div className="d-flex justify-content-end gap-1">
                                                                        <button 
                                                                            onClick={() => {
                                                                                setEditingStudentId(std.id);
                                                                                setEditingForm({
                                                                                    name: std.name,
                                                                                    xp: std.xp,
                                                                                    coins: std.coins,
                                                                                    secretPicture: std.secretPicture
                                                                                });
                                                                            }}
                                                                            className="btn btn-sm btn-outline-info rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                            title="Edit stats/name"
                                                                        >
                                                                            <FaEdit size={12} />
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteStudent(std.id, std.name)}
                                                                            className="btn btn-sm btn-outline-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                                                                            style={{ width: '32px', height: '32px' }}
                                                                            title="Delete kid's profile"
                                                                        >
                                                                            <FaTrash size={12} />
                                                                        </button>
                                                                    </div>
                                                                )}
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
                    ) : (
                        <div className="glass-card p-5 text-center d-flex flex-column align-items-center justify-content-center h-100" style={{ minHeight: '400px' }}>
                            <FaGamepad className="text-secondary mb-3 opacity-20" size={64} />
                            <h4 className="text-white fw-bold mb-2">Classroom Inspection</h4>
                            <p className="text-secondary max-w-sm m-auto">
                                Select an active classroom section from the left-hand column to inspect and manage its student rosters, regenerate visual passwords, and adjust gamification scores.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- Premium Administration Modals --- */}

            {/* Create Section Modal */}
            {showCreateModal && (
                <div className="modal-overlay">
                    <div className="modal-content-custom animate-zoom-in" style={{ maxWidth: '500px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-white m-0 d-flex align-items-center gap-2">
                                <FaFolderOpen className="text-primary" /> Create Classroom
                            </h4>
                            <button onClick={() => setShowCreateModal(false)} className="btn-action-premium">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSection}>
                            <div className="mb-3">
                                <label className="label-premium">Classroom Name</label>
                                <input
                                    type="text"
                                    className="form-control-dark w-100"
                                    placeholder="e.g. Grade 5 Robotics"
                                    value={newClassName}
                                    onChange={(e) => setNewClassName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="label-premium">Associated Teacher UID / Email</label>
                                <input
                                    type="text"
                                    className="form-control-dark w-100"
                                    placeholder="ADMIN_SYSTEM"
                                    value={newTeacherId}
                                    onChange={(e) => setNewTeacherId(e.target.value)}
                                />
                                <span className="x-small text-secondary mt-1 d-block">
                                    Admins can assign classes to specific teacher accounts by inputting their Firebase Auth UID.
                                </span>
                            </div>

                            <div className="d-flex gap-2 justify-content-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowCreateModal(false)} 
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary rounded-pill px-4"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Creating...' : 'Generate Section'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rename Section Modal */}
            {showRenameModal && (
                <div className="modal-overlay">
                    <div className="modal-content-custom animate-zoom-in" style={{ maxWidth: '500px' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="text-white m-0">Rename Classroom</h4>
                            <button onClick={() => setShowRenameModal(false)} className="btn-action-premium">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleRenameSection}>
                            <div className="mb-4">
                                <label className="label-premium">New Classroom Name</label>
                                <input
                                    type="text"
                                    className="form-control-dark w-100"
                                    value={renameClassName}
                                    onChange={(e) => setRenameClassName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="d-flex gap-2 justify-content-end">
                                <button 
                                    type="button" 
                                    onClick={() => setShowRenameModal(false)} 
                                    className="btn btn-outline-secondary rounded-pill px-4"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary rounded-pill px-4"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? 'Saving...' : 'Rename'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
