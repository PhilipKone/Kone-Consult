import React from 'react';
import { FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';

const AboutList = ({ entries, onEdit, onDelete }) => {
    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-5 border rounded border-dark bg-dark bg-opacity-25">
                <p className="text-secondary mb-0">No custom About entries found.</p>
                <small className="text-muted">Click 'New Entry' to add one.</small>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-dark table-hover border-dark align-middle">
                <thead>
                    <tr>
                        <th className="text-secondary small fw-normal pb-3">PROFILE</th>
                        <th className="text-secondary small fw-normal pb-3">MISSION TITLE</th>
                        <th className="text-secondary small fw-normal pb-3">TAGS</th>
                        <th className="text-secondary small fw-normal pb-3 text-end">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {entries.map((entry) => (
                        <tr key={entry.id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded-circle d-flex justify-content-center align-items-center bg-dark border border-primary border-opacity-25`} style={{ width: '40px', height: '40px' }}>
                                        <FaUserTie className="text-secondary" />
                                    </div>
                                    <div>
                                        <div className="fw-bold">{entry.name}</div>
                                        <div className="small text-secondary fw-bold" style={{ fontSize: '10px' }}>{entry.role}</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="text-truncate" style={{ maxWidth: '200px' }}>
                                    {entry.missionTitle}
                                </div>
                            </td>
                            <td>
                                <div className="d-flex flex-wrap gap-1">
                                    {Array.isArray(entry.tags) ? entry.tags.map((tag, i) => (
                                        <span key={i} className="badge bg-dark border border-secondary text-secondary" style={{ fontSize: '10px' }}>
                                            {tag}
                                        </span>
                                    )) : null}
                                </div>
                            </td>
                            <td className="text-end">
                                <button
                                    onClick={() => onEdit(entry)}
                                    className="btn btn-sm btn-outline-primary me-2"
                                    title="Edit Entry"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => onDelete(entry.id)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete Entry"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AboutList;
