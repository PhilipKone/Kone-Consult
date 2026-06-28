import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface DocModule {
    docId: string;
    id: string;
    title: string;
    category?: string;
    section?: string;
    order?: number;
    [key: string]: any;
}

interface DocumentationListProps {
    docs: DocModule[];
    onDelete: (id: string) => void;
    onEdit: (doc: DocModule) => void;
    onView: (doc: DocModule) => void;
}

const DocumentationList: React.FC<DocumentationListProps> = ({ docs, onDelete, onEdit, onView }) => {
    if (!docs || docs.length === 0) {
        return (
            <div className="text-center py-4 py-md-5 text-secondary">
                <p>No documentation modules found.</p>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column gap-3">
            {docs.map(doc => (
                <div key={doc.docId} className="p-3 border border-dark rounded bg-dark d-flex justify-content-between align-items-center">
                    <div>
                        <h5 className="mb-1 text-white">{doc.title}</h5>
                        <div className="d-flex gap-3 text-secondary small">
                            <span>ID: {doc.id}</span>
                            <span>Category: <strong className="text-info">{doc.category ? doc.category.toUpperCase() : 'GENERAL'}</strong></span>
                            <span>Section: {doc.section || 'N/A'}</span>
                            <span>Order: {doc.order || 0}</span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-outline-info btn-sm"
                            onClick={() => onView(doc)}
                            title="Preview"
                        >
                            <FaEye />
                        </button>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => onEdit(doc)}
                            title="Edit"
                        >
                            <FaEdit />
                        </button>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                                console.log("Delete clicked for:", doc.docId);
                                if (onDelete) {
                                    onDelete(doc.docId);
                                } else {
                                    alert("onDelete prop is missing!");
                                }
                            }}
                            title="Delete"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentationList;
