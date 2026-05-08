import { useState, useEffect } from 'react';
import { getCourses } from '../services/api';
import './Timetable.css';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
const JS_DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function toMin(t) { if(!t) return 0; const [h,m]=t.split(':').map(Number); return h*60+m; }
function fmt12(t) {
  if(!t) return '';
  const [h,m] = t.split(':').map(Number);
  return `${h%12||12}:${String(m).padStart(2,'0')} ${h>=12?'PM':'AM'}`;
}

const COLORS = ['#3d6fdd','#f59e0b','#22c55e','#ef4444','#a855f7','#0ea5e9','#f97316','#14b8a6'];
const courseColor = (name) => {
  let h = 0; for (let i=0;i<name.length;i++) h+=name.charCodeAt(i);
  return COLORS[h % COLORS.length];
};

const QUICK_LINKS = [
  { label:'Student Portal', url:'https://www.online.umt.edu.pk', icon:'🎓' },
  { label:'LMS Portal',     url:'https://www.lms.umt.edu.pk',   icon:'📖' },
];

export default function Timetable() {
  const [courses, setCourses] = useState([]);
  const [scheduleType, setScheduleType] = useState('Normal');
  const [selectedDay, setSelectedDay]   = useState('');
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCourses().then(({ data }) => setCourses(data.courses || [])).catch(() => {});
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const today = JS_DAYS[new Date().getDay()];
    setSelectedDay(DAYS.includes(today) ? today : 'Monday');
  }, []);

  const todayName  = JS_DAYS[time.getDay()];
  const nowMin     = time.getHours() * 60 + time.getMinutes();
  const isWeekday  = DAYS.includes(todayName);

  const filtered = courses.filter(c =>
    c.scheduleType === scheduleType &&
    c.day === selectedDay &&
    (!search || c.subjectName.toLowerCase().includes(search.toLowerCase()) ||
     c.instructorName.toLowerCase().includes(search.toLowerCase()))
  ).sort((a,b) => toMin(a.startTime) - toMin(b.startTime));

  const nextClass = selectedDay === todayName
    ? filtered.find(c => toMin(c.startTime) > nowMin)
    : null;

  const clockStr = time.toLocaleTimeString('en-PK', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
  const dateStr  = time.toLocaleDateString('en-PK', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  return (
    <div className="tt page-enter">
      <div className="tt-inner">
        {/* ── HEADER ── */}
        <div className="tt-header">
          <div>
            <h1 className="tt-title">Timetable</h1>
            <p className="tt-sub">Your academic schedule — {scheduleType} mode</p>
          </div>
          <div className="tt-live">
            <div className="tt-live-dot" />
            <div>
              <div className="tt-clock">{clockStr}</div>
              <div className="tt-date">{dateStr}</div>
            </div>
          </div>
        </div>

        {/* ── SCHEDULE TOGGLE ── */}
        <div className="tt-controls">
          <div className="tt-toggle">
            {['Normal','Ramadan'].map(t => (
              <button key={t}
                className={`tt-toggle-btn ${scheduleType === t ? 'active' : ''}`}
                onClick={() => setScheduleType(t)}>
                {t === 'Normal' ? '📚' : '🌙'} {t} Schedule
              </button>
            ))}
          </div>

          <input
            className="input tt-search"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── DAY TABS ── */}
        <div className="tt-days">
          {DAYS.map(d => {
            const isToday = d === todayName;
            const count   = courses.filter(c => c.day === d && c.scheduleType === scheduleType).length;
            return (
              <button key={d}
                className={`tt-day-btn ${selectedDay === d ? 'active' : ''} ${isToday ? 'is-today' : ''}`}
                onClick={() => setSelectedDay(d)}>
                <span className="tt-day-name">{d.slice(0,3)}</span>
                {count > 0 && <span className="tt-day-count">{count}</span>}
                {isToday && <span className="tt-today-pip" />}
              </button>
            );
          })}
        </div>

        {/* ── NEXT CLASS ── */}
        {nextClass && (
          <div className="tt-next">
            <span>⏭</span>
            <span style={{color:'var(--accent2)', fontWeight:600}}>Next class:</span>
            <strong style={{color:'#fff'}}>{nextClass.subjectName}</strong>
            <span style={{marginLeft:'auto', color:'var(--muted)', fontSize:12}}>
              {fmt12(nextClass.startTime)} · {nextClass.roomNumber}
            </span>
          </div>
        )}

        {/* ── CLASSES ── */}
        <div className="tt-day-label">
          <span className="tt-day-title">{selectedDay}</span>
          {selectedDay === todayName && isWeekday && (
            <span className="tt-today-tag">Today</span>
          )}
          <span className="tt-count-label">{filtered.length} {filtered.length === 1 ? 'class' : 'classes'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="tt-empty">
            <div style={{fontSize:44, marginBottom:12}}>🌙</div>
            <div className="tt-empty-title">
              {search ? 'No matching classes found' : `No ${scheduleType} schedule on ${selectedDay}`}
            </div>
            <div className="tt-empty-sub">
              {!search && 'Add courses to see them here'}
            </div>
          </div>
        ) : (
          <div className="tt-list">
            {filtered.map((cls, i) => {
              const isLive = selectedDay === todayName && nowMin >= toMin(cls.startTime) && nowMin < toMin(cls.endTime);
              const isDone = selectedDay === todayName && nowMin >= toMin(cls.endTime);
              const prog   = isLive ? Math.min(100, Math.round(((nowMin - toMin(cls.startTime)) / (toMin(cls.endTime) - toMin(cls.startTime))) * 100)) : 0;
              const rem    = toMin(cls.endTime) - nowMin;
              const color  = courseColor(cls.subjectName);
              return (
                <div key={cls._id || i}
                  className={`tt-card ${isLive?'live':''} ${isDone?'done':''}`}
                  style={{ '--cc': color, animationDelay: `${i * 0.06}s` }}>
                  <div className="tt-card-bar" />
                  <div className="tt-card-time">
                    <span className="tt-t">{fmt12(cls.startTime)}</span>
                    <span className="tt-sep">▾</span>
                    <span className="tt-t">{fmt12(cls.endTime)}</span>
                  </div>
                  <div className="tt-card-body">
                    <div className="tt-card-top">
                      <div className="tt-card-name">{cls.subjectName}</div>
                      <div className="tt-card-section" style={{ background: `${color}22`, color }}>
                        § {cls.section}
                      </div>
                    </div>
                    <div className="tt-card-meta">
                      <span>👩‍🏫 {cls.instructorName}</span>
                      {cls.instructorEmail && (
                        <a href={`mailto:${cls.instructorEmail}`} className="tt-email">
                          ✉️ {cls.instructorEmail}
                        </a>
                      )}
                      <span>📍 {cls.roomNumber}</span>
                      <span>🏛 {cls.mode || 'On-Campus'}</span>
                    </div>
                    {isLive && (
                      <>
                        <div className="tt-live-badge">
                          <div className="tt-live-dot-sm" /> LIVE NOW · {rem > 0 ? `${rem} min left` : 'Ending'}
                        </div>
                        <div className="tt-progress">
                          <div className="tt-progress-bar">
                            <div className="tt-progress-fill" style={{ width: `${prog}%` }} />
                          </div>
                          <span className="tt-progress-lbl">{prog}% complete</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── QUICK LINKS ── */}
        <div className="tt-ql">
          <div className="tt-day-label" style={{marginTop:0, marginBottom:14}}>
            <span className="tt-day-title">Quick Links</span>
          </div>
          <div className="tt-ql-grid">
            {QUICK_LINKS.map((ql, i) => (
              <a key={i} href={ql.url} target="_blank" rel="noreferrer" className="tt-ql-card">
                <span className="tt-ql-ico">{ql.icon}</span>
                <span className="tt-ql-lbl">{ql.label}</span>
                <span className="tt-ql-arr">→</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
