import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate(user ? '/dashboard' : '/login', { replace: true });
    }, 2800);
    return () => clearTimeout(t);
  }, [navigate, user]);

  return (
    <div className="splash">
      <div className="splash-bg">
        <div className="splash-orb splash-orb1" />
        <div className="splash-orb splash-orb2" />
        <div className="splash-orb splash-orb3" />
        <div className="splash-grid" />
      </div>

      <div className="splash-content">
        <div className="splash-logo">
          <div className="splash-crest">
            <div className="crest-ring crest-ring1" />
            <div className="crest-ring crest-ring2" />
            <div className="crest-ring crest-ring3" />
            <span className="crest-icon">🎓</span>
          </div>
        </div>

        <div className="splash-text">
          <h1 className="splash-uni">
            University of Management<br />and Technology
          </h1>
          <div className="splash-divider">
            <span className="splash-divider-line" />
            <span className="splash-divider-diamond">◆</span>
            <span className="splash-divider-line" />
          </div>
          <p className="splash-subtitle">Timetable Management System</p>
        </div>

        <div className="splash-loader">
          <div className="loader-track">
            <div className="loader-fill" />
          </div>
          <p className="loader-text">Initializing...</p>
        </div>
      </div>

      <div className="splash-footer">
        <span>Spring 2026</span>
        <span className="sep">·</span>
        <span>BS Software Engineering</span>
      </div>
    </div>
  );
}
