// ChangePassword.js - Pure Logic & Architecture (100% Preserved)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, Loader2, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { changeMyPassword } from '../../services/authService';
import './ChangePassword.css';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const navigate = useNavigate();

  const submit = async () => {
    setMsg({ type: '', text: '' });

    if (!oldPassword || !newPassword) {
      return setMsg({ type: 'error', text: 'All fields are required' });
    }
    if (newPassword !== confirm) {
      return setMsg({ type: 'error', text: 'Passwords do not match' });
    }
    if (newPassword.length < 6) {
      return setMsg({ type: 'error', text: 'New password must be at least 6 characters' });
    }

    try {
      setIsSubmitting(true);
      await changeMyPassword(oldPassword, newPassword);
      setMsg({ type: 'success', text: 'Security updated! Redirecting to home...' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setMsg({ type: 'error', text: err.message || 'Verification failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({ label, placeholder, value, setter, type = "password" }) => (
    <div className="ems-input-group">
      <label className="ems-label">{label}</label>
      <div className="ems-input-wrapper">
        <div className="ems-input-icon">
          <Lock size={18} />
        </div>
        <input
          type={showPass ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => setter(e.target.value)}
          className="ems-input-field"
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="ems-toggle-btn"
        >
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="ems-password-page">
      <div className="ems-password-container">

        <div className="ems-password-card">

          {/* Header Banner */}
          <div className="ems-header-banner">
            <div className="ems-header-bg-icon">
              <ShieldCheck size={160} />
            </div>
            <div className="ems-header-content">
              <div className="ems-shield-badge">
                <ShieldCheck size={32} />
              </div>
              <h2 className="ems-header-title">Security Update</h2>
              <p className="ems-header-subtitle">Keep your account safe and secure</p>
            </div>
          </div>

          <div className="ems-form-section">

            {/* Alert Messages */}
            {msg.text && (
              <div className={`ems-alert ems-alert-${msg.type}`}>
                {msg.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                <span>{msg.text}</span>
              </div>
            )}

            <div className="ems-fields-container">
              <InputField
                label="Current Password"
                placeholder="••••••••"
                value={oldPassword}
                setter={setOldPassword}
              />

              <div className="ems-divider" />

              <InputField
                label="New Password"
                placeholder="Min. 6 characters"
                value={newPassword}
                setter={setNewPassword}
              />

              <InputField
                label="Confirm New Password"
                placeholder="Repeat new password"
                value={confirm}
                setter={setConfirm}
              />
            </div>

            <div className="ems-submit-section">
              <button
                onClick={submit}
                disabled={isSubmitting}
                className="ems-submit-btn"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : null}
                {isSubmitting ? 'Updating Security...' : 'Update Password'}
              </button>
            </div>

            <p className="ems-footer-text">
              Logged in as admin. Last change: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
