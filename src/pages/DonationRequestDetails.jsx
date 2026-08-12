import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { Heart, MapPin, Calendar, Clock, Hospital, User, Mail, AlignLeft, Info, Loader } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DonationRequestDetails() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/donation-requests/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequest(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch donation request details.'
        });
        navigate('/donation-requests');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchDetails();
    }
  }, [id, token, navigate]);

  const handleDonateConfirm = async (e) => {
    e.preventDefault();
    setConfirming(true);

    try {
      await axios.patch(
        `${API_URL}/donation-requests/${id}/status`,
        { status: 'inprogress' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setModalOpen(false);
      setConfirming(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Thank you!',
        text: 'You have agreed to donate blood. Please reach out to the requester/hospital on time.',
        confirmButtonColor: 'var(--primary)'
      });

      // Reload details
      setRequest(prev => ({
        ...prev,
        status: 'inprogress',
        donorName: user.name,
        donorEmail: user.email
      }));
    } catch (error) {
      setConfirming(false);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to confirm donation.'
      });
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 0' }}>
        <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading details...</p>
      </div>
    );
  }

  if (!request) return null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className={`badge badge-${request.status}`} style={{ marginBottom: '0.75rem' }}>
              {request.status}
            </span>
            <h2 style={{ fontSize: '1.8rem' }}>Blood Request for {request.recipientName}</h2>
          </div>
          <div style={{ padding: '0.75rem 1.25rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius-md)', fontWeight: '800', fontSize: '1.5rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: '600', color: 'var(--text-secondary)' }}>Required</span>
            {request.bloodGroup}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>Location & Timing</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Hospital size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hospital</p>
                <p style={{ fontWeight: '500' }}>{request.hospitalName}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Address</p>
                <p style={{ fontWeight: '500' }}>{request.fullAddress}, {request.recipientUpazila}, {request.recipientDistrict}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Donation Date</p>
                <p style={{ fontWeight: '500' }}>{formatDate(request.donationDate)}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Donation Time</p>
                <p style={{ fontWeight: '500' }}>{request.donationTime}</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem' }}>Requester Information</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <User size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Name</p>
                <p style={{ fontWeight: '500' }}>{request.requesterName}</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={20} color="var(--primary)" />
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Email</p>
                <p style={{ fontWeight: '500' }}>{request.requesterEmail}</p>
              </div>
            </div>

            {request.donorName && (
              <>
                <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginTop: '0.5rem' }}>Donor Information</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Heart size={20} color="var(--success)" fill="var(--success)" />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Donor Name</p>
                    <p style={{ fontWeight: '500' }}>{request.donorName}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={20} color="var(--success)" />
                  <div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Donor Email</p>
                    <p style={{ fontWeight: '500' }}>{request.donorEmail}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>Message / Reason</h4>
          <div style={{ display: 'flex', gap: '0.75rem', backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <AlignLeft size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>"{request.requestMessage}"</p>
          </div>
        </div>

        {request.status === 'pending' && (
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={() => setModalOpen(true)}
          >
            <Heart fill="white" size={18} />
            Donate Now
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>Confirm Your Donation</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              By confirming, you agree to donate blood at the specified location and time. Your details will be visible to the requester.
            </p>

            <form onSubmit={handleDonateConfirm}>
              <div className="form-group">
                <label className="form-label">Donor Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  readOnly 
                  value={user?.name || ''} 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Donor Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  readOnly 
                  value={user?.email || ''} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button 
                  type="button" 
                  className="btn btn-ghost" 
                  style={{ flex: 1 }}
                  onClick={() => setModalOpen(false)}
                  disabled={confirming}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  disabled={confirming}
                >
                  {confirming ? 'Confirming...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
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
