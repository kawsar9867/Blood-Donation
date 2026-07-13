import React, { useState } from 'react';
import { X, User, Mail, Link as LinkIcon, ChevronRight } from 'lucide-react';

export default function GoogleLoginModal({ isOpen, onClose, onSelect }) {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customUser, setCustomUser] = useState({ name: '', email: '', avatar: '' });

  if (!isOpen) return null;

  const mockAccounts = [
    {
      name: 'Kawsar Bosuniya',
      email: 'kawsar.bosuniya@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150'
    },
    {
      name: 'Jane Doe',
      email: 'jane.doe@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150'
    }
  ];

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customUser.name || !customUser.email) return;
    
    onSelect(
      customUser.email, 
      customUser.name, 
      customUser.avatar || 'https://i.ibb.co/Mgs9DkB/default-avatar.png'
    );
  };

  return (
    <div className="google-modal-overlay">
      <div className="google-modal-card">
        {/* Google Branding Header */}
        <div className="google-header">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: '1.25rem', fontWeight: '500', color: '#202124' }}>Sign in with Google</span>
          <button className="google-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="google-body">
          <p className="google-subtitle">to continue to <strong>LifeBlood</strong></p>

          {!showCustomForm ? (
            <div className="google-accounts-list">
              {mockAccounts.map((acc, idx) => (
                <button 
                  key={idx} 
                  className="google-account-row"
                  onClick={() => onSelect(acc.email, acc.name, acc.avatar)}
                >
                  <img src={acc.avatar} alt={acc.name} className="google-account-img" />
                  <div className="google-account-info">
                    <p className="google-account-name">{acc.name}</p>
                    <p className="google-account-email">{acc.email}</p>
                  </div>
                  <ChevronRight size={16} color="#5f6368" style={{ marginLeft: 'auto' }} />
                </button>
              ))}

              <button 
                className="google-account-row google-use-other"
                onClick={() => setShowCustomForm(true)}
              >
                <div className="google-other-icon">
                  <User size={18} color="#5f6368" />
                </div>
                <div className="google-account-info">
                  <p className="google-account-name" style={{ color: '#1a73e8', fontWeight: '500' }}>Use another account</p>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="google-custom-form">
              <div className="google-form-group">
                <label className="google-label">Google Account Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={16} className="google-input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="google-input"
                    value={customUser.name}
                    onChange={(e) => setCustomUser({ ...customUser, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="google-form-group">
                <label className="google-label">Gmail Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} className="google-input-icon" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@gmail.com"
                    className="google-input"
                    value={customUser.email}
                    onChange={(e) => setCustomUser({ ...customUser, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="google-form-group">
                <label className="google-label">Profile Photo URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <LinkIcon size={16} className="google-input-icon" />
                  <input
                    type="url"
                    placeholder="e.g. https://images.com/avatar.jpg"
                    className="google-input"
                    value={customUser.avatar}
                    onChange={(e) => setCustomUser({ ...customUser, avatar: e.target.value })}
                  />
                </div>
              </div>

              <div className="google-form-actions">
                <button 
                  type="button" 
                  className="google-btn-secondary" 
                  onClick={() => setShowCustomForm(false)}
                >
                  Back
                </button>
                <button type="submit" className="google-btn-primary">
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="google-footer">
          <span style={{ fontSize: '0.75rem', color: '#5f6368' }}>
            To continue, Google will share your name, email address, and profile picture with LifeBlood.
          </span>
        </div>
      </div>

      <style>{`
        .google-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          font-family: Roboto, Arial, sans-serif;
        }
        .google-modal-card {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
          width: 400px;
          max-width: 90%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid #dadce0;
        }
        .google-header {
          display: flex;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid #e8eaed;
        }
        .google-close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #5f6368;
          margin-left: auto;
          padding: 4px;
          border-radius: 50%;
          display: flex;
        }
        .google-close-btn:hover {
          background-color: #f1f3f4;
        }
        .google-body {
          padding: 24px;
          flex: 1;
        }
        .google-subtitle {
          font-size: 1rem;
          color: #5f6368;
          text-align: center;
          margin-bottom: 24px;
        }
        .google-subtitle strong {
          color: #202124;
        }
        .google-accounts-list {
          display: flex;
          flex-direction: column;
          border: 1px solid #dadce0;
          border-radius: 8px;
          overflow: hidden;
        }
        .google-account-row {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          background: none;
          border: none;
          border-bottom: 1px solid #dadce0;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background-color 0.2s;
        }
        .google-account-row:hover {
          background-color: #f8f9fa;
        }
        .google-account-row:last-child {
          border-bottom: none;
        }
        .google-account-img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
          margin-right: 12px;
        }
        .google-account-info {
          display: flex;
          flex-direction: column;
        }
        .google-account-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #3c4043;
        }
        .google-account-email {
          font-size: 0.75rem;
          color: #5f6368;
        }
        .google-other-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #dadce0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        .google-custom-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .google-form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .google-label {
          font-size: 0.75rem;
          font-weight: 500;
          color: #5f6368;
        }
        .google-input {
          width: 100%;
          padding: 10px 10px 10px 36px;
          border: 1px solid #dadce0;
          border-radius: 4px;
          font-size: 0.875rem;
          outline: none;
          color: #202124;
        }
        .google-input:focus {
          border-color: #1a73e8;
          box-shadow: 0 0 0 1px #1a73e8;
        }
        .google-input-icon {
          position: absolute;
          left: 12px;
          top: 12px;
          color: #5f6368;
        }
        .google-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 16px;
        }
        .google-btn-primary {
          background-color: #1a73e8;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        .google-btn-primary:hover {
          background-color: #1557b0;
        }
        .google-btn-secondary {
          background: none;
          border: 1px solid #dadce0;
          color: #1a73e8;
          padding: 8px 16px;
          border-radius: 4px;
          font-weight: 500;
          cursor: pointer;
        }
        .google-btn-secondary:hover {
          background-color: #f8f9fa;
        }
        .google-footer {
          background-color: #f8f9fa;
          padding: 16px 24px;
          border-top: 1px solid #e8eaed;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
