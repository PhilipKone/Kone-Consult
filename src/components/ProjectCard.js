import React from 'react';
import { FaGithub } from 'react-icons/fa';

const ProjectCard = ({ title, description, tools, githubUrl, imageUrl }) => {
    return (
        <div className="card glass-panel h-100 project-card overflow-hidden">
            {imageUrl && (
                <div className="card-img-top" style={{ height: '200px', overflow: 'hidden' }}>
                    <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
            )}
            <div className="card-body p-4">
                <h3 className="card-title h5 mb-2 text-primary">{title}</h3>
                <p className="card-text text-secondary mb-3 small">{description}</p>
                <div className="tools mb-3">
                    <small className="text-accent">{tools}</small>
                </div>
                {githubUrl && (
                    <a href={githubUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2">
                        <FaGithub /> View on GitHub
                    </a>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
