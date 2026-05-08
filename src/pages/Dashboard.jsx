import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCourses } from '../services/api';
import { FiCalendar, FiBook, FiExternalLink, FiClock, FiMapPin, FiUser, FiPlus } from 'react-icons/fi';
import './Dashboard.css';

const JS_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function fmt12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2,'0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
function toMin(t) { if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+m; }

const QUICK_LINKS = [
  { label:'Student Portal', url:'https://www.online.umt.edu.pk', icon:'🎓', color:'var(--accent)' },
  { label:'LMS Portal',     url:'https://www.lms.umt.edu.pk',   icon:'📖', color:'var(--live)'   },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    getCourses().then(({ data }) => setCourses(data.courses || [])).catch(() => {});
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const todayName = JS_DAYS[time.getDay()];
  const nowMin    = time.getHours() * 60 + time.getMinutes();

  const todayClasses = courses
    .filter(c => c.day === todayName && c.scheduleType === 'Normal')
    .sort((a, b) => toMin(a.startTime) - toMin(b.startTime));

  const liveClass = todayClasses.find(c => nowMin >= toMin(c.startTime) && nowMin < toMin(c.endTime));
  const nextClass = todayClasses.find(c => toMin(c.startTime) > nowMin);

  const totalCr   = courses.filter(c=>c.scheduleType==='Normal').reduce((s,c)=>s+c.creditHours, 0);
  const totalDays = [...new Set(courses.map(c=>c.day))].length;

  const clockStr = time.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr  = time.toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="dash page-enter">
      {/* ── HERO ── */}
      <div className="dash-hero">
        <div className="dash-hero-bg" />
        <div className="dash-hero-content">
          <div className="dash-hero-left">
            <div className="dash-greeting">
              {time.getHours() < 12 ? '🌅 Good morning' : time.getHours() < 17 ? '☀️ Good afternoon' : '🌙 Good evening'}
            </div>
            <h1 className="dash-name">{user?.name}</h1>
            <div className="dash-meta-pills">
              <span className="dpill">🎓 {user?.university || 'University of Management and Technology'}</span>
              <span className="dpill">💻 {user?.degree || 'BS Software Engineering'}</span>
              <span className="dpill">📅 {user?.semester || 'Spring 2026'}</span>
              <span className="dpill gold">🎯 {user?.semesterNumber || '8th Semester'}</span>
            </div>
          </div>
          <div className="dash-hero-clock">
            <div className="dash-clock-time">{clockStr}</div>
            <div className="dash-clock-date">{dateStr}</div>
          </div>
        </div>
      </div>

      <div className="dash-body">
        {/* ── STAT CARDS ── */}
        <div className="dash-stats">
          {[
            { icon:'📚', label:'Total Courses', value: courses.filter(c=>c.scheduleType==='Normal').length, color:'var(--accent)' },
            { icon:'⏰', label:'Credit Hours',  value: totalCr,   color:'var(--gold)' },
            { icon:'📅', label:'Active Days',   value: totalDays, color:'var(--live)' },
            { icon:'🏛', label:'On Campus',     value: courses.filter(c=>c.mode==='On-Campus').length, color:'#a855f7' },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ '--stat-color': s.color, animationDelay: `${i * 0.08}s` }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-val">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
          {/* ── TODAY'S SCHEDULE ── */}
          <div className="dash-section dash-today">
            <div className="dash-section-head">
              <FiCalendar />
              <span>Today — {todayName}</span>
              <Link to="/timetable" className="dash-see-all">View all →</Link>
            </div>

            {liveClass && (
              <div className="live-now-card">
                <div className="live-now-pulse" />
                <div className="live-now-label">🔴 LIVE NOW</div>
                <div className="live-now-name">{liveClass.subjectName}</div>
                <div className="live-now-meta">
                  <span>👩‍🏫 {liveClass.instructorName}</span>
                  <span>📍 {liveClass.roomNumber}</span>
                </div>
              </div>
            )}

            {nextClass && !liveClass && (
              <div className="next-class-banner">
                <span>⏭ Next:</span>
                <strong>{nextClass.subjectName}</strong>
                <span style={{marginLeft:'auto', color:'var(--muted)', fontSize:12}}>
                  {fmt12(nextClass.startTime)} · {nextClass.roomNumber}
                </span>
              </div>
            )}

            {todayClasses.length === 0 ? (
              <div className="dash-empty">
                <div style={{fontSize:36}}>🌙</div>
                <div>No classes today</div>
                <Link to="/courses" className="btn btn-ghost btn-sm" style={{marginTop:8}}>
                  <FiPlus /> Add courses
                </Link>
              </div>
            ) : (
              <div className="today-list">
                {todayClasses.map((cls, i) => {
                  const isLive = nowMin >= toMin(cls.startTime) && nowMin < toMin(cls.endTime);
                  const isDone = nowMin >= toMin(cls.endTime);
                  return (
                    <div key={i} className={`today-item ${isLive?'live':''} ${isDone?'done':''}`}>
                      <div className="today-time">
                        <span>{fmt12(cls.startTime)}</span>
                        <span className="t-sep">▾</span>
                        <span>{fmt12(cls.endTime)}</span>
                      </div>
                      <div className="today-info">
                        <div className="today-name">{cls.subjectName}</div>
                        <div className="today-sub">
                          <FiUser size={11}/> {cls.instructorName}
                          <FiMapPin size={11}/> {cls.roomNumber}
                        </div>
                      </div>
                      {isLive && <div className="today-live-dot" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── QUICK LINKS + UPCOMING ── */}
          <div className="dash-aside">
            <div className="dash-section">
              <div className="dash-section-head">
                <FiExternalLink /> <span>Quick Links</span>
              </div>
              <div className="ql-list">
                {QUICK_LINKS.map((ql, i) => (
                  <a key={i} href={ql.url} target="_blank" rel="noreferrer" className="ql-item">
                    <div className="ql-ico" style={{ background: `${ql.color}22` }}>{ql.icon}</div>
                    <span className="ql-lbl">{ql.label}</span>
                    <FiExternalLink className="ql-arr" />
                  </a>
                ))}
              </div>
            </div>

            <div className="dash-section">
              <div className="dash-section-head">
                <FiBook /> <span>My Courses</span>
                <Link to="/courses" className="dash-see-all">Manage →</Link>
              </div>
              {courses.length === 0 ? (
                <div className="dash-empty" style={{padding:'24px 0'}}>
                  <Link to="/courses" className="btn btn-primary btn-sm">
                    <FiPlus /> Add your first course
                  </Link>
                </div>
              ) : (
                <div className="course-chips">
                  {[...new Map(courses.map(c=>[c.subjectName, c])).values()].slice(0, 6).map((c, i) => (
                    <div key={i} className="course-chip">
                      <span className="course-chip-dot" />
                      <span className="course-chip-name">{c.subjectName}</span>
                      <span className="course-chip-cr">{c.creditHours}cr</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
