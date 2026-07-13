import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { districts, upazilas } from '../../utils/geo';
import axios from 'axios';
import Swal from 'sweetalert2';
import { PlusCircle, Loader, ShieldAlert } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function CreateDonationRequest() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: ''
  });

  const [loading, setLoading] = useState(false);

  // Block status check
  const isBlocked = user?.status === 'blocked';

  // Filter upazilas based on chosen district
  const selectedDistrictObj = districts.find(d => d.name === formData.recipientDistrict);
  const filteredUpazilas = selectedDistrictObj
    ? upazilas.filter(u => u.district_id === selectedDistrictObj.id)
    : [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'recipientDistrict' ? { recipientUpazila: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isBlocked) {
      return Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: 'Blocked accounts are not allowed to create donation requests.'
      });
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/donation-requests`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'Request Created',
        text: 'Your blood donation request has been submitted successfully!',
        confirmButtonColor: 'var(--primary)'
      });
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to create donation request.'
      });
    }
  };

  return (
    <div style={{ maxWidth: '750px', margin: '1rem auto' }}>
      {isBlocked ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderColor: 'var(--danger)' }}>
          <ShieldAlert size={64} color="var(--danger)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ color: 'var(--danger)', marginBottom: '1rem' }}>Account Suspended</h2>
          <p>
            Your account status is currently <strong>Blocked</strong>. You are restricted from creating new blood donation requests. Please contact support if you believe this is an error.
          </p>
        </div>
      ) : (
        <div className="card">
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Create Donation Request</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter the details of the patient in need of blood.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Requester Info (Read-only) */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Requester Name</label>
                <input
                  type="text"
                  className="form-control"
                  disabled
                  value={user?.name || ''}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Requester Email</label>
                <input
                  type="email"
                  className="form-control"
                  disabled
                  value={user?.email || ''}
                />
              </div>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '1rem 0 1.5rem 0' }} />

            {/* Recipient Details */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Recipient Name</label>
                <input
                  type="text"
                  name="recipientName"
                  className="form-control"
                  placeholder="Patient name"
                  required
                  value={formData.recipientName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Blood Group Needed</label>
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Hospital Name</label>
                <input
                  type="text"
                  name="hospitalName"
                  className="form-control"
                  placeholder="e.g. Dhaka Medical College Hospital"
                  required
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Address Line</label>
                <input
                  type="text"
                  name="fullAddress"
                  className="form-control"
                  placeholder="e.g. Zahir Raihan Rd, Dhaka"
                  required
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Recipient District</label>
                <select
                  name="recipientDistrict"
                  className="form-control"
                  required
                  value={formData.recipientDistrict}
                  onChange={handleInputChange}
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Recipient Upazila</label>
                <select
                  name="recipientUpazila"
                  className="form-control"
                  required
                  disabled={!formData.recipientDistrict}
                  value={formData.recipientUpazila}
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
                <label className="form-label">Donation Date</label>
                <input
                  type="date"
                  name="donationDate"
                  className="form-control"
                  required
                  value={formData.donationDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Donation Time</label>
                <input
                  type="time"
                  name="donationTime"
                  className="form-control"
                  required
                  value={formData.donationTime}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Request Message / Reason</label>
              <textarea
                name="requestMessage"
                className="form-control"
                rows="4"
                placeholder="Describe why you need blood in detail..."
                required
                value={formData.requestMessage}
                onChange={handleInputChange}
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Creating Request...
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  Submit Blood Request
                </>
              )}
            </button>
          </form>
        </div>
      )}

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
