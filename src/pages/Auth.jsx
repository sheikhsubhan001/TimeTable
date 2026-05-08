import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiArrowRight, FiUserPlus, FiLogIn,
} from 'react-icons/fi';
import './Auth.css';

function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd]   = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  const validate = () => {
    const e = {};
    if (!isLogin && !form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (!isLogin && form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
        toast.success('Welcome back! 👋');
      } else {
        await register(form);
        toast.success('Account created successfully! 🎉');
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const change = (f) => (e) => {
    setForm(p => ({ ...p, [f]: e.target.value }));
    if (errors[f]) setErrors(p => ({ ...p, [f]: '' }));
  };

  return (
    <div className="auth-root">
      <div className="auth-bg">
        <div className="auth-orb auth-orb1" />
        <div className="auth-orb auth-orb2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-crest">🎓</div>
          <div>
            <div className="auth-brand-name">UMT</div>
            <div className="auth-brand-sub">Timetable System</div>
          </div>
        </div>
        <div className="auth-hero-text">
          <h1 className="auth-hero-title">
            Manage Your<br />Academic Schedule<br />
            <span className="auth-hero-accent">Effortlessly.</span>
          </h1>
          <p className="auth-hero-desc">
            A smart timetable management system for University of Management and Technology students.
          </p>
        </div>
        <div className="auth-features">
          {['Live class tracking', 'Smart notifications', 'Normal & Ramadan schedules', 'Full CRUD course management'].map((f, i) => (
            <div key={i} className="auth-feature">
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-card-icon">
              {isLogin ? <FiLogIn size={22} /> : <FiUserPlus size={22} />}
            </div>
            <h2 className="auth-card-title">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="auth-card-desc">
              {isLogin ? 'Sign in to your timetable dashboard' : 'Join UMT Timetable Management System'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrap">
                  <FiUser className="input-icon" />
                  <input
                    className={`input input-icon-pad ${errors.name ? 'input-err' : ''}`}
                    placeholder="Muhammad Subhan Hussnain"
                    value={form.name}
                    onChange={change('name')}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <FiMail className="input-icon" />
                <input
                  className={`input input-icon-pad ${errors.email ? 'input-err' : ''}`}
                  type="email"
                  placeholder="student@umt.edu.pk"
                  value={form.email}
                  onChange={change('email')}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  className={`input input-icon-pad input-icon-pad-r ${errors.password ? 'input-err' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={change('password')}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button type="button" className="input-toggle" onClick={() => setShowPwd(p => !p)}>
                  {showPwd ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrap">
                  <FiLock className="input-icon" />
                  <input
                    className={`input input-icon-pad input-icon-pad-r ${errors.confirmPassword ? 'input-err' : ''}`}
                    type={showCPwd ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={form.confirmPassword}
                    onChange={change('confirmPassword')}
                    autoComplete="new-password"
                  />
                  <button type="button" className="input-toggle" onClick={() => setShowCPwd(p => !p)}>
                    {showCPwd ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <><span className="spin" style={{display:'inline-block',width:16,height:16,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%'}} /> Processing...</>
              ) : (
                <>{isLogin ? 'Sign In' : 'Create Account'} <FiArrowRight /></>
              )}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <>Don't have an account? <Link to="/register">Sign up free</Link></>
            ) : (
              <>Already have an account? <Link to="/login">Sign in</Link></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LoginPage()    { return <AuthPage mode="login" />; }
export function RegisterPage() { return <AuthPage mode="register" />; }
