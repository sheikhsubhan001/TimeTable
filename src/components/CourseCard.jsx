import { FiEdit2, FiTrash2, FiUser, FiMail, FiClock, FiMapPin } from 'react-icons/fi';
import './CourseCard.css';

const COLORS = [
  { accent: '#3d6fdd', light: 'rgba(61,111,221,0.1)' },
  { accent: '#f59e0b', light: 'rgba(245,158,11,0.1)' },
  { accent: '#22c55e', light: 'rgba(34,197,94,0.1)'  },
  { accent: '#ef4444', light: 'rgba(239,68,68,0.1)'  },
  { accent: '#a855f7', light: 'rgba(168,85,247,0.1)' },
  { accent: '#0ea5e9', light: 'rgba(14,165,233,0.1)' },
  { accent: '#f97316', light: 'rgba(249,115,22,0.1)' },
  { accent: '#14b8a6', light: 'rgba(20,184,166,0.1)' },
];

function colorFor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
  return COLORS[h % COLORS.length];
}

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

export default function CourseCard({ course, onEdit, onDelete, isToday }) {
  const c = colorFor(course.subjectName);
  return (
    <div className={`cc ${isToday ? 'cc-today' : ''}`} style={{ '--card-accent': c.accent, '--card-light': c.light }}>
      <div className="cc-bar" />
      <div className="cc-body">
        <div className="cc-top">
          <div className="cc-left">
            <div className="cc-name">{course.subjectName}</div>
            <div className="cc-tags">
              <span className="cc-tag cc-tag-section">§ {course.section}</span>
              <span className={`cc-tag cc-tag-type ${course.courseType === 'Core Course' ? 'core' : course.courseType === 'Lab' ? 'lab' : 'elec'}`}>
                {course.courseType}
              </span>
              <span className={`cc-tag cc-tag-sched ${course.scheduleType === 'Ramadan' ? 'ramadan' : ''}`}>
                {course.scheduleType === 'Ramadan' ? '🌙' : '📚'} {course.scheduleType}
              </span>
            </div>
          </div>
          <div className="cc-actions">
            <button className="cc-btn cc-btn-edit" onClick={() => onEdit(course)} title="Edit">
              <FiEdit2 />
            </button>
            <button className="cc-btn cc-btn-del" onClick={() => onDelete(course._id)} title="Delete">
              <FiTrash2 />
            </button>
          </div>
        </div>

        <div className="cc-meta">
          <div className="cc-meta-item">
            <FiUser className="cc-meta-icon" />
            <span>{course.instructorName}</span>
          </div>
          {course.instructorEmail && (
            <div className="cc-meta-item">
              <FiMail className="cc-meta-icon" />
              <a href={`mailto:${course.instructorEmail}`} className="cc-email">
                {course.instructorEmail}
              </a>
            </div>
          )}
          <div className="cc-meta-item">
            <FiClock className="cc-meta-icon" />
            <span>{course.day} · {fmt12(course.startTime)} – {fmt12(course.endTime)}</span>
          </div>
          <div className="cc-meta-item">
            <FiMapPin className="cc-meta-icon" />
            <span>{course.roomNumber}</span>
          </div>
        </div>

        <div className="cc-footer">
          {course.courseCode && <span className="cc-code">{course.courseCode}</span>}
          <span className="cc-credits">{course.creditHours} Cr.Hr</span>
          {isToday && <span className="cc-today-badge">Today</span>}
        </div>
      </div>
    </div>
  );
}
