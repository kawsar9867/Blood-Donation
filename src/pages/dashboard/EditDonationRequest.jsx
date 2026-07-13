import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { districts, upazilas } from '../../utils/geo';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Edit, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function EditDonationRequest() {
  const { id } = useParams();
  const { token } = useAuth();
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

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/donation-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = response.data;
        // Prefill form
        setFormData({
          recipientName: data.recipientName || '',
          recipientDistrict: data.recipientDistrict || '',
          recipientUpazila: data.recipientUpazila || '',
          hospitalName: data.hospitalName || '',
          fullAddress: data.fullAddress || '',
          bloodGroup: data.bloodGroup || '',
          donationDate: data.donationDate ? new Date(data.donationDate).toISOString().split('T')[0] : '',
          donationTime: data.donationTime || '',
          requestMessage: data.requestMessage || ''
        });
      } catch (error) {
        console.error(error);
        Swal.fire('Error', 'Failed to retrieve donation request details.', 'error');
        navigate('/dashboard/my-donation-requests');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) {
      fetchDetails();
    }
  }, [id, token, navigate]);

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
    setUpdating(true);

    try {
      await axios.put(`${API_URL}/donation-requests/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUpdating(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Donation request updated successfully!',
        confirmButtonColor: 'var(--primary)'
      });
      navigate('/dashboard/my-donation-requests');
    } catch (error) {
      setUpdating(false);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.response?.data?.message || 'Failed to update request.'
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem' }}>Loading request details...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '750px', margin: '1rem auto' }}>
      <div className="card">
        <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>Edit Donation Request</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Update the patient details and requirements.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Recipient Details */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Recipient Name</label>
              <input
                type="text"
                name="recipientName"
                className="form-control"
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
              required
              value={formData.requestMessage}
              onChange={handleInputChange}
            ></textarea>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ flex: 1 }}
              onClick={() => navigate('/dashboard/my-donation-requests')}
              disabled={updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={updating}
            >
              {updating ? (
                <>
                  <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Updating Request...
                </>
              ) : (
                <>
                  <Edit size={18} />
                  Update Request
                </>
              )}
            </button>
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
