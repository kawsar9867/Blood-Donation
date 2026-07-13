import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { districts, upazilas } from '../utils/geo';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Loader } from 'lucide-react';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bloodGroup: '',
    district: '',
    upazila: '',
    password: '',
    confirmPassword: ''
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [loading, setLoading] = useState(false);

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
      // Reset upazila if district changes
      ...(name === 'district' ? { upazila: '' } : {})
    }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    setAvatarUploading(true);
    const form = new FormData();
    form.append('image', avatarFile);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, form);
      setAvatarUploading(false);
      return response.data.data.display_url;
    } catch (error) {
      console.error("Avatar upload failed", error);
      setAvatarUploading(false);
      throw new Error("Failed to upload avatar image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Passwords do not match!'
      });
    }

    setLoading(true);

    try {
      let avatarUrl = '';
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const userData = {
        name: formData.name,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        district: formData.district,
        upazila: formData.upazila,
        password: formData.password,
        avatar: avatarUrl || undefined
      };

      const result = await register(userData);
      setLoading(false);

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Registration successful! Welcome to Blood Donation Platform.'
        });
        navigate('/');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result.message
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: error.message || 'Something went wrong during registration.'
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const response = await loginWithGoogle();
    setLoading(false);

    if (!response.success) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: response.message
      });
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary)' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Join our community and save lives as a donor.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="example@mail.com"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                name="bloodGroup"
                className="form-control"
                required
                value={formData.bloodGroup}
                onChange={handleInputChange}
              >
                <option value="">Select Group</option>
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
              <label className="form-label">Profile Image (Avatar)</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">District</label>
              <select
                name="district"
                className="form-control"
                required
                value={formData.district}
                onChange={handleInputChange}
              >
                <option value="">Select District</option>
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
                required
                disabled={!formData.district}
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="******"
                required
                minLength={6}
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                placeholder="******"
                required
                minLength={6}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading || avatarUploading}
          >
            {loading || avatarUploading ? (
              <>
                <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                {avatarUploading ? 'Uploading Avatar...' : 'Registering...'}
              </>
            ) : 'Sign Up'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-muted)' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
          <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
        </div>

        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '100%', display: 'flex', gap: '0.75rem', justifyContent: 'center', borderColor: '#e2e8f0', color: 'var(--text-primary)' }}
          onClick={handleGoogleLogin}
          disabled={loading || avatarUploading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login Here</Link>
        </p>
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
