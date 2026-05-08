import { useState, useEffect } from 'react';
import { FiX, FiBook, FiUser, FiMail, FiClock, FiMapPin, FiHash } from 'react-icons/fi';
import './AddCourseModal.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const COURSE_TYPES = ['Core Course', 'Elective Course', 'Lab'];
const SCHEDULE_TYPES = ['Normal', 'Ramadan'];
const CREDIT_HOURS = [1, 2, 3, 4, 5, 6];

const EMPTY = {
  subjectName: '', courseCode: '', creditHours: 3,
  section: '', instructorName: '', instructorEmail: '',
  day: 'Monday', startTime: '08:00', endTime: '09:15',
  roomNumber: '', scheduleType: 'Normal', courseType: 'Core Course',
};

export default function AddCourseModal({ isOpen, onClose, onSubmit, editData, loading }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm({ ...EMPTY, ...editData });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editData, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.subjectName.trim()) e.subjectName = 'Required';
    if (!form.section.trim())     e.section = 'Required';
    if (!form.instructorName.trim()) e.instructorName = 'Required';
    if (!form.roomNumber.trim())  e.roomNumber = 'Required';
    if (!form.startTime)          e.startTime = 'Required';
    if (!form.endTime)            e.endTime = 'Required';
    if (form.instructorEmail && !/^\S+@\S+\.\S+$/.test(form.instructorEmail))
      e.instructorEmail = 'Invalid email';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const change = (f) => (e) => {
    const v = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm(p => ({ ...p, [f]: v }));
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal acm">
        <div className="modal-header">
          <div className="acm-title-row">
            <div className="acm-icon">
              <FiBook />
            </div>
            <h2 className="modal-title">{editData ? 'Edit Course' : 'Add New Course'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1: Subject + Code */}
            <div className="acm-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label className="form-label">Subject Name *</label>
                <div className="input-wrap">
                  <FiBook className="input-icon" />
                  <input className={`input input-icon-pad ${errors.subjectName ? 'input-err' : ''}`}
                    placeholder="e.g. Analysis of Algorithms" value={form.subjectName} onChange={change('subjectName')} />
                </div>
                {errors.subjectName && <span className="form-error">{errors.subjectName}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Course Code</label>
                <div className="input-wrap">
                  <FiHash className="input-icon" />
                  <input className="input input-icon-pad" placeholder="CS3044"
                    value={form.courseCode} onChange={change('courseCode')} />
                </div>
              </div>
            </div>

            {/* Row 2: Section + Credit Hours + Type */}
            <div className="acm-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Section *</label>
                <input className={`input ${errors.section ? 'input-err' : ''}`}
                  placeholder="e.g. W3" value={form.section} onChange={change('section')} />
                {errors.section && <span className="form-error">{errors.section}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Credit Hours</label>
                <select className="input" value={form.creditHours} onChange={change('creditHours')}>
                  {CREDIT_HOURS.map(h => <option key={h} value={h}>{h} Cr.Hr</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1.5 }}>
                <label className="form-label">Course Type</label>
                <select className="input" value={form.courseType} onChange={change('courseType')}>
                  {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Row 3: Instructor */}
            <div className="acm-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Instructor Name *</label>
                <div className="input-wrap">
                  <FiUser className="input-icon" />
                  <input className={`input input-icon-pad ${errors.instructorName ? 'input-err' : ''}`}
                    placeholder="Dr. Abdul Ghaffar" value={form.instructorName} onChange={change('instructorName')} />
                </div>
                {errors.instructorName && <span className="form-error">{errors.instructorName}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Instructor Email</label>
                <div className="input-wrap">
                  <FiMail className="input-icon" />
                  <input className={`input input-icon-pad ${errors.instructorEmail ? 'input-err' : ''}`}
                    type="email" placeholder="instructor@umt.edu.pk"
                    value={form.instructorEmail} onChange={change('instructorEmail')} />
                </div>
                {errors.instructorEmail && <span className="form-error">{errors.instructorEmail}</span>}
              </div>
            </div>

            {/* Row 4: Day + Times */}
            <div className="acm-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Day</label>
                <select className="input" value={form.day} onChange={change('day')}>
                  {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Start Time *</label>
                <div className="input-wrap">
                  <FiClock className="input-icon" />
                  <input type="time" className={`input input-icon-pad ${errors.startTime ? 'input-err' : ''}`}
                    value={form.startTime} onChange={change('startTime')} />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">End Time *</label>
                <div className="input-wrap">
                  <FiClock className="input-icon" />
                  <input type="time" className={`input input-icon-pad ${errors.endTime ? 'input-err' : ''}`}
                    value={form.endTime} onChange={change('endTime')} />
                </div>
              </div>
            </div>

            {/* Row 5: Room + Schedule Type */}
            <div className="acm-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Room Number *</label>
                <div className="input-wrap">
                  <FiMapPin className="input-icon" />
                  <input className={`input input-icon-pad ${errors.roomNumber ? 'input-err' : ''}`}
                    placeholder="SST1-705A" value={form.roomNumber} onChange={change('roomNumber')} />
                </div>
                {errors.roomNumber && <span className="form-error">{errors.roomNumber}</span>}
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Schedule Type</label>
                <div className="acm-toggle">
                  {SCHEDULE_TYPES.map(t => (
                    <button key={t} type="button"
                      className={`acm-toggle-btn ${form.scheduleType === t ? 'active' : ''}`}
                      onClick={() => setForm(p => ({ ...p, scheduleType: t }))}>
                      {t === 'Normal' ? '📚' : '🌙'} {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="acm-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <><span className="spin" style={{display:'inline-block',width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%'}} /> Saving...</>
                ) : (
                  <>{editData ? '💾 Update Course' : '➕ Add Course'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
