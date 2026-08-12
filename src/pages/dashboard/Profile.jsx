import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { districts, upazilas } from '../../utils/geo';
import Swal from 'sweetalert2';
import { Edit2, Save, X, Loader, User, Mail, MapPin, Heart } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
    bloodGroup: '',
    district: '',
    upazila: ''
  });

  // Sync state with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        bloodGroup: user.bloodGroup || '',
        district: user.district || '',
        upazila: user.upazila || ''
      });
    }
  }, [user]);

  // Filter upazilas based on chosen district
  const selectedDistrictObj = districts.find(d => d.name === formData.district);
  const filteredUpazilas = selectedDistrictObj
    ? upazilas.filter(u => u.district_id === selectedDistrictObj.id)
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'district' ? { upazila: '' } : {})
    }));
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        avatar: user.avatar || '',
        bloodGroup: user.bloodGroup || '',
        district: user.district || '',
        upazila: user.upazila || ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile(formData);
    setLoading(false);

    if (result.success) {
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile details have been saved successfully!',
        timer: 1500,
        showConfirmButton: false
      });
      setIsEditing(false);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: result.message
      });
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '750px', margin: '1rem auto' }}>
      <div className="card">
        {/* Profile Card Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>My Profile</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage your personal details and location settings.</p>
          </div>
          
          {!isEditing ? (
            <button 
              className="btn btn-outline" 
              onClick={() => setIsEditing(true)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <Edit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-ghost" 
                onClick={handleCancel}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                disabled={loading}
              >
                <X size={16} />
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                disabled={loading}
              >
                {loading ? (
                  <Loader className="animate-spin" size={16} style={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <Save size={16} />
                )}
                Save
              </button>
            </div>
          )}
        </div>

        {/* Profile Overview (Disabled/Enabled Form) */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2.5rem' }}>
            <img 
              src={formData.avatar} 
              alt={user.name} 
              style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-light)' }} 
            />
            <div style={{ flex: 1 }}>
              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                <label className="form-label">Avatar Image URL</label>
                <input
                  type="text"
                  name="avatar"
                  className="form-control"
                  disabled={!isEditing}
                  value={formData.avatar}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                disabled={!isEditing}
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                className="form-control"
                disabled
                value={user.email}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                name="bloodGroup"
                className="form-control"
                disabled={!isEditing}
                required
                value={formData.bloodGroup}
                onChange={handleInputChange}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                disabled
                value={user.role}
                style={{ textTransform: 'capitalize' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">District</label>
              <select
                name="district"
                className="form-control"
                disabled={!isEditing}
                required
                value={formData.district}
                onChange={handleInputChange}
              >
                {districts.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Upazila</label>
              <select
                name="upazila"
                className="form-control"
                disabled={!isEditing || !formData.district}
                required
                value={formData.upazila}
                onChange={handleInputChange}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
