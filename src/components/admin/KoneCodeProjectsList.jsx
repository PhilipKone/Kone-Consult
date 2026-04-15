import React, { useState } from 'react';
import { FaTrash, FaCode, FaTimes } from 'react-icons/fa';

const KoneCodeProjectsList = ({ projects, onDelete }) => {
    const [viewingCode, setViewingCode] = useState(null);

    if (!projects || projects.length === 0) {
        return (
            <div className="text-center py-5 border rounded border-dark bg-dark bg-opacity-25 mt-4">
                <p className="text-secondary mb-0">No public projects saved yet.</p>
                <small className="text-muted">When users save code in the IDE, it will appear here.</small>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h6 className="text-secondary mb-3">Community Saved Snippets</h6>
            <div className="table-responsive">
                <table className="table table-dark table-hover border-dark align-middle">
                    <thead>
                        <tr>
                            <th className="text-secondary small fw-normal pb-3">PROJECT TITLE</th>
                            <th className="text-secondary small fw-normal pb-3">LANGUAGE</th>
                            <th className="text-secondary small fw-normal pb-3">PREVIEW</th>
                            <th className="text-secondary small fw-normal pb-3 text-end">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project.id}>
                                <td>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded d-flex justify-content-center align-items-center bg-dark border border-info border-opacity-25`} style={{ width: '40px', height: '40px' }}>
                                            <FaCode className="text-info opacity-75" />
                                        </div>
                                        <div className="fw-bold">{project.title || "Untitled Project"}</div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50">
                                        {project.language}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        onClick={() => setViewingCode(project)}
                                        className="btn btn-sm btn-link text-info text-decoration-none p-0"
                                    >
                                        View Source Code
                                    </button>
                                </td>
                                <td className="text-end">
                                    <button
                                        onClick={() => onDelete(project.id)}
                                        className="btn btn-sm btn-outline-danger"
                                        title="Delete Project"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Code View Modal */}
            {viewingCode && (
                <div className="modal-overlay" style={{ zIndex: 1050 }}>
                    <div className="modal-content-custom" style={{ maxWidth: '800px', width: '90%' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h5 className="text-white m-0">{viewingCode.title || 'Untitled Project'}</h5>
                                <span className="badge bg-info bg-opacity-10 text-info mt-2">{viewingCode.language}</span>
                            </div>
                            <button onClick={() => setViewingCode(null)} className="btn-close btn-close-white"></button>
                        </div>
                        <div className="bg-dark rounded border border-secondary p-3 overflow-auto" style={{ maxHeight: '500px' }}>
                            <pre className="m-0 text-white font-monospace" style={{ fontSize: '0.9rem' }}>
                                <code>{viewingCode.code}</code>
                            </pre>
                        </div>
                        <div className="d-flex justify-content-end mt-4 pt-3 border-top border-dark">
                            <button type="button" onClick={() => setViewingCode(null)} className="btn btn-secondary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default KoneCodeProjectsList;
