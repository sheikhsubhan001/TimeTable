import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiBook, FiCalendar, FiEdit2, FiCheck } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving ] = useState(false);
  const [form, setForm] = useState({
    name:           user?.name || '',
    degree:         user?.degree || 'BS Software Engineering',
    semester:       user?.semester || 'Spring 2026',
    semesterNumber: user?.semesterNumber || '8th Semester',
  });

  const initials = user?.name?.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() || 'U';

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated! ✅');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  const fields = [
    { icon:<FiUser/>,     label:'Full Name',       field:'name',           type:'text'  },
    { icon:<FiBook/>,     label:'Degree',           field:'degree',         type:'text'  },
    { icon:<FiCalendar/>, label:'Semester',          field:'semester',       type:'text'  },
    { icon:<FiCalendar/>, label:'Semester Number',   field:'semesterNumber', type:'text'  },
  ];

  return (
    <div className="prof page-enter">
      <div className="prof-inner">
        <div className="prof-header">
          <div className="prof-avatar">
            <div className="prof-av-circle">{initials}</div>
            <div className="prof-av-ring" />
          </div>
          <div className="prof-info">
            <h1 className="prof-name">{user?.name}</h1>
            <div className="prof-email"><FiMail size={13}/> {user?.email}</div>
            <div className="prof-pills">
              <span className="ppill">{user?.degree}</span>
              <span className="ppill">{user?.semester}</span>
              <span className="ppill gold">{user?.semesterNumber}</span>
            </div>
          </div>
          <button
            className={`btn ${editing ? 'btn-primary' : 'btn-ghost'}`}
            style={{alignSelf:'flex-start'}}
            onClick={() => editing ? handleSave() : setEditing(true)}
            disabled={saving}
          >
            {saving ? (
              <><span className="spin" style={{display:'inline-block',width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%'}} /> Saving...</>
            ) : editing ? (
              <><FiCheck /> Save Changes</>
            ) : (
              <><FiEdit2 /> Edit Profile</>
            )}
          </button>
        </div>

        <div className="prof-card card">
          <div className="prof-card-title">
            <FiUser /> Profile Information
          </div>
          <div className="prof-fields">
            {fields.map((f) => (
              <div key={f.field} className="prof-field">
                <div className="prof-field-label">
                  {f.icon} {f.label}
                </div>
                {editing ? (
                  <input
                    className="input"
                    type={f.type}
                    value={form[f.field]}
                    onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))}
                  />
                ) : (
                  <div className="prof-field-value">{user?.[f.field] || '—'}</div>
                )}
              </div>
            ))}
            <div className="prof-field">
              <div className="prof-field-label"><FiMail /> Email Address</div>
              <div className="prof-field-value">{user?.email}</div>
              <div style={{fontSize:11,color:'var(--muted)',marginTop:4}}>Email cannot be changed</div>
            </div>
          </div>
        </div>

        <div className="prof-card card" style={{marginTop:16}}>
          <div className="prof-card-title">🎓 University Details</div>
          <div style={{padding:'0 20px 20px'}}>
            <div className="prof-uni-row">
              <span className="prof-uni-label">University</span>
              <span className="prof-uni-val">{user?.university || 'University of Management and Technology'}</span>
            </div>
            <div className="prof-uni-row">
              <span className="prof-uni-label">Member since</span>
              <span className="prof-uni-val">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-PK', {year:'numeric',month:'long'}) : '—'}
              </span>
            </div>
          </div>
        </div>

        <div className="prof-danger">
          <button className="btn btn-danger btn-full" onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) logout();
          }}>
            🚪 Logout from all devices
          </button>
        </div>
      </div>
    </div>
  );
}
