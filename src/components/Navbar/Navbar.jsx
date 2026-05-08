import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiGrid, FiCalendar, FiUser, FiLogOut,
  FiMenu, FiX, FiBook,
} from 'react-icons/fi';
import './Navbar.css';

const NAV = [
  { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
  { to: '/timetable', icon: <FiCalendar />, label: 'Timetable' },
  { to: '/courses',   icon: <FiBook />,    label: 'Courses' },
  { to: '/profile',   icon: <FiUser />,    label: 'Profile' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/dashboard" className="navbar-brand">
            <div className="navbar-logo">🎓</div>
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">UMT</span>
              <span className="navbar-brand-sub">Timetable</span>
            </div>
          </Link>

          <div className="navbar-links">
            {NAV.map(n => (
              <Link
                key={n.to}
                to={n.to}
                className={`navbar-link ${pathname === n.to ? 'active' : ''}`}
              >
                {n.icon}
                <span>{n.label}</span>
              </Link>
            ))}
          </div>

          <div className="navbar-right">
            <div className="navbar-user">
              <div className="navbar-avatar">{initials}</div>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user?.name?.split(' ')[0]}</span>
                <span className="navbar-user-deg">8th Semester</span>
              </div>
            </div>
            <button className="navbar-logout" onClick={handleLogout} title="Logout">
              <FiLogOut />
            </button>
            <button className="navbar-menu" onClick={() => setOpen(p => !p)}>
              {open ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-user">
            <div className="navbar-avatar" style={{ width:48, height:48, fontSize:18 }}>{initials}</div>
            <div>
              <div style={{ fontWeight:700, color:'#fff' }}>{user?.name}</div>
              <div style={{ fontSize:12, color:'var(--muted)' }}>{user?.email}</div>
            </div>
          </div>
          {NAV.map(n => (
            <Link
              key={n.to}
              to={n.to}
              className={`mobile-nav-link ${pathname === n.to ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              {n.icon} {n.label}
            </Link>
          ))}
          <button className="mobile-logout" onClick={handleLogout}>
            <FiLogOut /> Logout
          </button>
        </div>
      )}
    </>
  );
}
