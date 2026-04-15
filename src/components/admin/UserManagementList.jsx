import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { FaUserEdit, FaTrash, FaUserShield, FaUserPlus } from 'react-icons/fa';

const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown';
    if (dateValue.toDate) return dateValue.toDate().toLocaleDateString();
    const date = new Date(dateValue);
    return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : 'Unknown';
};

const UserManagementList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching users: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const toggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) {
            try {
                const userRef = doc(db, 'users', userId);
                await updateDoc(userRef, { role: newRole });
            } catch (error) {
                console.error("Error updating role:", error);
                alert("Failed to update role. See console.");
            }
        }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user record from the database? This cannot be undone.")) {
            try {
                await deleteDoc(doc(db, 'users', userId));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user. See console.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-5"><span className="spinner-border text-primary"></span></div>;
    }

    return (
        <div className="glass-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <h3 className="text-white m-0 d-flex align-items-center gap-2">
                    <FaUserShield className="text-primary" /> User Management
                </h3>
                <div className="d-flex gap-2" style={{ maxWidth: '300px', flexGrow: 1 }}>
                    <input
                        type="text"
                        className="form-control-dark w-100"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-dark table-hover align-middle custom-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Signed Up</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-4 text-secondary">
                                    No users found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="text-white fw-bold">{user.name || 'Anonymous User'}</td>
                                    <td className="text-secondary">{user.email || 'No email provided'}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                                            {user.role ? user.role.toUpperCase() : 'USER'}
                                        </span>
                                    </td>
                                    <td className="text-secondary small">
                                        {formatDate(user.createdAt)}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <button
                                                onClick={() => toggleRole(user.id, user.role)}
                                                className="btn btn-sm btn-outline-info"
                                                title={`Change role to ${user.role === 'admin' ? 'User' : 'Admin'}`}
                                            >
                                                <FaUserEdit /> {user.role === 'admin' ? 'Demote' : 'Promote'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="btn btn-sm btn-outline-danger"
                                                title="Delete User Record"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="text-secondary small mt-3">
                Total Users: {filteredUsers.length} | <em>Note: Deleting a record here only removes DB access, it does not delete their Firebase Authentication log-in.</em>
            </div>
        </div>
    );
};

export default UserManagementList;
