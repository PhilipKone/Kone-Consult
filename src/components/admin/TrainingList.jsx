import { FaEdit, FaTrash, FaYoutube, FaGraduationCap, FaCode, FaFlask, FaChartBar, FaRobot, FaCube, FaMicrochip, FaLaptopCode } from 'react-icons/fa';
import { SiPython, SiJavascript, SiCplusplus, SiR } from 'react-icons/si';

// Important: Must match the icons used in the main TrainingHub
const iconMap = {
    'FaGraduationCap': FaGraduationCap,
    'FaChartBar': FaChartBar,
    'FaCode': FaCode,
    'FaFlask': FaFlask,
    'FaYoutube': FaYoutube,
    'FaRobot': FaRobot,
    'FaCube': FaCube,
    'FaMicrochip': FaMicrochip,
    'FaLaptopCode': FaLaptopCode,
    'SiPython': SiPython,
    'SiJavascript': SiJavascript,
    'SiCplusplus': SiCplusplus,
    'SiR': SiR
};

const TrainingList = ({ courses, onEdit, onDelete, onSeed }) => {
    if (courses.length === 0) {
        return (
            <div className="text-center p-5 border border-dark rounded bg-dark">
                <p className="text-secondary mb-3">No dynamic courses found. Click "New Course" to add one.</p>
                {onSeed && (
                    <button
                        onClick={onSeed}
                        className="btn btn-outline-warning btn-sm d-inline-flex align-items-center gap-2 mb-2"
                        title="Seed the initial default courses from the system"
                    >
                        Seed Default Courses
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-dark table-hover align-middle">
                <thead>
                    <tr>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Course</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Division</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3">Level / Duration</th>
                        <th scope="col" className="text-secondary small fw-normal pb-3 text-end">Actions</th>
                    </tr>
                </thead>
                <tbody className="border-top-0">
                    {courses.map((course) => {
                        const IconComponent = iconMap[course.icon] || FaGraduationCap;
                        return (
                            <tr key={course.id} className="border-bottom border-dark">
                                <td className="py-3">
                                    <div className="d-flex flex-column">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <IconComponent className={course.colorClass} />
                                            <h6 className="mb-0 text-white fw-bold">{course.title}</h6>
                                        </div>
                                        <div className="text-secondary small d-flex flex-wrap gap-1 mt-1">
                                            {Array.isArray(course.skills) ? course.skills.map((skill, index) => (
                                                <span key={index} className="badge bg-secondary text-light rounded-pill px-2 py-1" style={{ fontSize: '0.65rem' }}>
                                                    {skill}
                                                </span>
                                            )) : <span className="text-muted">{course.skills}</span>}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-secondary small">
                                    <span className={`badge bg-${course.colorClass?.replace('text-', '')} text-white`}>
                                        {course.division}
                                    </span>
                                </td>
                                <td className="py-3 text-secondary small">
                                    <div>{course.level}</div>
                                    <div className="text-muted" style={{ fontSize: '0.8em' }}>{course.duration}</div>
                                </td>
                                <td className="py-3 text-end">
                                    <div className="btn-group">
                                        <button
                                            onClick={() => onEdit(course)}
                                            className="btn btn-sm btn-outline-secondary border-dark text-secondary hover-text-white"
                                            title="Edit Course"
                                        >
                                            <FaEdit />
                                        </button>
                                        <a
                                            href={course.youtubeLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-danger border-dark"
                                            title="View Video"
                                        >
                                            <FaYoutube />
                                        </a>
                                        <button
                                            onClick={() => onDelete(course.id)}
                                            className="btn btn-sm btn-outline-danger border-dark"
                                            title="Delete Course"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default TrainingList;
