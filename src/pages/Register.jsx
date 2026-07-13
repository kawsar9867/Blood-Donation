import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { districts, upazilas } from '../utils/geo';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Loader } from 'lucide-react';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export default function Register() {
  const { register } = useAuth();
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
