import React from 'react';
import { FaEdit, FaTrash, FaCode } from 'react-icons/fa';

const KoneCodeTemplatesList = ({ templates, onEdit, onDelete }) => {
    if (!templates || templates.length === 0) {
        return (
            <div className="text-center py-5 border rounded border-dark bg-dark bg-opacity-25">
                <p className="text-secondary mb-0">No IDE templates found.</p>
                <small className="text-muted">Click 'New Template' to create a starter snippet for your users.</small>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-dark table-hover border-dark align-middle">
                <thead>
                    <tr>
                        <th className="text-secondary small fw-normal pb-3">TEMPLATE TITLE</th>
                        <th className="text-secondary small fw-normal pb-3">LANGUAGE</th>
                        <th className="text-secondary small fw-normal pb-3">CODE PREVIEW</th>
                        <th className="text-secondary small fw-normal pb-3 text-end">ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {templates.map((template) => (
                        <tr key={template.id}>
                            <td>
                                <div className="d-flex align-items-center gap-3">
                                    <div className={`rounded d-flex justify-content-center align-items-center bg-dark border border-primary border-opacity-25`} style={{ width: '40px', height: '40px' }}>
                                        <FaCode className="text-primary opacity-75" />
                                    </div>
                                    <div className="fw-bold">{template.title}</div>
                                </div>
                            </td>
                            <td>
                                <span className="badge bg-secondary bg-opacity-25 text-white border border-secondary border-opacity-50">
                                    {template.language}
                                </span>
                            </td>
                            <td>
                                <div className="text-muted small text-truncate font-monospace" style={{ maxWidth: '250px' }}>
                                    {template.code ? template.code.substring(0, 50) + '...' : '/* Empty */'}
                                </div>
                            </td>
                            <td className="text-end">
                                <button
                                    onClick={() => onEdit(template)}
                                    className="btn btn-sm btn-outline-primary me-2"
                                    title="Edit Template"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => onDelete(template.id)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Delete Template"
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

export default KoneCodeTemplatesList;
