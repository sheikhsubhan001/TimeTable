import { useState, useEffect, useCallback } from 'react';
import { getCourses, addCourse, updateCourse, deleteCourse } from '../services/api';
import CourseCard from '../components/CourseCard';
import AddCourseModal from '../components/modals/AddCourseModal';
import toast from 'react-hot-toast';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import './Courses.css';

const DAYS = ['All','Monday','Tuesday','Wednesday','Thursday','Friday'];
const JS_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function Courses() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving,  setSaving]      = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData,  setEditData]  = useState(null);
  const [search,    setSearch]    = useState('');
  const [dayFilter, setDayFilter] = useState('All');
  const [typeFilter,setTypeFilter]= useState('All');

  const todayName = JS_DAYS[new Date().getDay()];

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getCourses();
      setCourses(data.courses || []);
    } catch { toast.error('Failed to load courses'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = () => { setEditData(null); setModalOpen(true); };
  const handleEdit = (c) => { setEditData(c); setModalOpen(true); };

  const handleSubmit = async (form) => {
    setSaving(true);
    try {
      if (editData) {
        await updateCourse(editData._id, form);
        toast.success('Course updated! ✅');
      } else {
        await addCourse(form);
        toast.success('Course added! 🎉');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted');
      load();
    } catch { toast.error('Delete failed'); }
  };

  const displayed = courses.filter(c => {
    const matchSearch = !search ||
      c.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      c.instructorName.toLowerCase().includes(search.toLowerCase());
    const matchDay  = dayFilter === 'All' || c.day === dayFilter;
    const matchType = typeFilter === 'All' || c.scheduleType === typeFilter;
    return matchSearch && matchDay && matchType;
  });

  const totalCr = [...new Map(courses.map(c=>[c.subjectName,c])).values()]
    .reduce((s,c) => s + c.creditHours, 0);

  return (
    <div className="crs page-enter">
      <div className="crs-inner">
        {/* HEADER */}
        <div className="crs-header">
          <div>
            <h1 className="crs-title">My Courses</h1>
            <p className="crs-sub">
              {courses.length} course{courses.length !== 1 ? 's' : ''} · {totalCr} credit hours
            </p>
          </div>
          <button className="btn btn-primary" onClick={handleAdd}>
            <FiPlus /> Add Course
          </button>
        </div>

        {/* FILTERS */}
        <div className="crs-filters">
          <div className="crs-search-wrap">
            <FiSearch className="crs-search-icon" />
            <input
              className="input crs-search"
              placeholder="Search courses or instructors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="crs-filter-group">
            <FiFilter style={{color:'var(--muted)', flexShrink:0}} />
            <select className="input crs-select" value={dayFilter} onChange={e=>setDayFilter(e.target.value)}>
              {DAYS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Days' : d}</option>)}
            </select>
            <select className="input crs-select" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
              <option value="All">All Schedules</option>
              <option value="Normal">Normal</option>
              <option value="Ramadan">Ramadan</option>
            </select>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="crs-stats">
          {[
            { label:'Total', value: courses.length,       color:'var(--accent2)' },
            { label:'Normal',    value: courses.filter(c=>c.scheduleType==='Normal').length,  color:'var(--text)'    },
            { label:'Ramadan',   value: courses.filter(c=>c.scheduleType==='Ramadan').length, color:'var(--gold-lt)' },
            { label:'Cr.Hours',  value: totalCr,          color:'var(--live)'    },
          ].map((s,i) => (
            <div key={i} className="crs-stat">
              <span style={{color:s.color, fontFamily:'Syne',fontWeight:800, fontSize:22}}>{s.value}</span>
              <span style={{fontSize:11,color:'var(--muted)',fontWeight:500}}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* COURSE LIST */}
        {loading ? (
          <div className="crs-loading">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="crs-skeleton" style={{animationDelay:`${i*0.1}s`}} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="crs-empty">
            <div style={{fontSize:48}}>📚</div>
            <div className="crs-empty-title">
              {courses.length === 0 ? 'No courses yet' : 'No matching courses'}
            </div>
            <div className="crs-empty-sub">
              {courses.length === 0
                ? 'Click "Add Course" to add your first course'
                : 'Try adjusting your filters'}
            </div>
            {courses.length === 0 && (
              <button className="btn btn-primary" style={{marginTop:16}} onClick={handleAdd}>
                <FiPlus /> Add your first course
              </button>
            )}
          </div>
        ) : (
          <div className="crs-grid">
            {displayed.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isToday={course.day === todayName}
              />
            ))}
          </div>
        )}
      </div>

      <AddCourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        editData={editData}
        loading={saving}
      />
    </div>
  );
}
