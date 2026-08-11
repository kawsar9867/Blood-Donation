import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Loader, User, Stethoscope, ShieldCheck } from 'lucide-react';
import { districts, upazilas } from '../utils/geo';
import axios from 'axios';

export default function Register() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('https://i.ibb.co/Mgs9DkB/default-avatar.png');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [district, setDistrict] = useState('');
  const [upazila, setUpazila] = useState('');
  const [role, setRole] = useState('donor'); // 'donor' (Client), 'volunteer' (Doctor), 'admin'
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectedDistrictObj = districts.find(d => d.name === district);
  const filteredUpazilas = selectedDistrictObj
    ? upazilas.filter(u => u.district_id === selectedDistrictObj.id)
    : [];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
      if (!apiKey || apiKey === 'YOUR_IMGBB_API_KEY') {
        throw new Error('ImageBB API Key is not configured in your frontend .env file.');
      }
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      if (response.data && response.data.data && response.data.data.url) {
        setAvatar(response.data.data.url);
        Swal.fire({
          icon: 'success',
          title: 'Uploaded!',
          text: 'Avatar image uploaded successfully to ImageBB.',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error('Image upload failed');
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.message || 'Failed to upload image to ImageBB.'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // পাসওয়ার্ড ম্যাচিং চেক
    if (password !== confirmPassword) {
      return Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Passwords do not match!'
      });
    }

    // পাসওয়ার্ড লেংথ চেক (ঐচ্ছিক কিন্তু স্ট্যান্ডার্ড প্র্যাকটিস)
    if (password.length < 6) {
      return Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long.'
      });
    }

    if (!district || !upazila) {
      return Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please select your District and Upazila!'
      });
    }

    setLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        avatar,
        bloodGroup,
        district,
        upazila,
        role
      });

      if (result.success) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: `Welcome! Account created as ${role === 'donor' ? 'Client (Donor)' : role === 'volunteer' ? 'Doctor (Volunteer)' : 'Admin'}.`,
          timer: 1500,
          showConfirmButton: false
        });
        setLoading(false);
        navigate('/');
      } else {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result.message || 'Something went wrong.'
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await loginWithGoogle();
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Logged In',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false
        });
        setLoading(false);
        navigate('/');
      } else {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Google Login Failed',
          text: response.message || 'Google authentication failed.'
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Could not connect to Google services.'
      });
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '0.25rem', color: 'var(--primary)' }}>Create Account</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Join us to start managing your donations.
        </p>

        {/* Account Role / Section Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="form-label" style={{ fontSize: '0.85rem', marginBottom: '0.5rem', display: 'block' }}>
            Select Account Section / Role:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className={`btn ${role === 'donor' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.6rem 0.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                borderColor: role === 'donor' ? 'var(--primary)' : 'var(--border)'
              }}
              onClick={() => setRole('donor')}
            >
              <User size={18} />
              <span>Client</span>
            </button>

            <button
              type="button"
              className={`btn ${role === 'volunteer' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.6rem 0.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                borderColor: role === 'volunteer' ? 'var(--primary)' : 'var(--border)'
              }}
              onClick={() => setRole('volunteer')}
            >
              <Stethoscope size={18} />
              <span>Doctor</span>
            </button>

            <button
              type="button"
              className={`btn ${role === 'admin' ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.6rem 0.25rem',
                fontSize: '0.8rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.25rem',
                borderColor: role === 'admin' ? 'var(--primary)' : 'var(--border)'
              }}
              onClick={() => setRole('admin')}
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="example@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avatar Image (Upload to ImageBB)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading || uploading}
            />
            {uploading && <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: '0.25rem' }}>Uploading image...</p>}
            {!uploading && avatar && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src={avatar} alt="Preview" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', wordBreak: 'break-all' }}>{avatar}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Blood Group</label>
            <select
              className="form-control"
              required
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              disabled={loading}
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

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">District</label>
              <select
                className="form-control"
                required
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setUpazila('');
                }}
                disabled={loading}
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
                className="form-control"
                required
                value={upazila}
                onChange={(e) => setUpazila(e.target.value)}
                disabled={loading || !district}
              >
                <option value="">Select Upazila</option>
                {filteredUpazilas.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="******"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="******"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: '100%',
              marginTop: '1.5rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} />
                <span>Creating Account...</span>
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
          style={{ width: '100%', display: 'flex', gap: '0.75rem', justifyContent: 'center', alignItems: 'center', borderColor: '#e2e8f0', color: 'var(--text-primary)' }}
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign up with Google
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