import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Heart, Loader } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export default function DonationRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/donation-requests`);
        setRequests(response.data);
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch pending donation requests.'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleViewDetails = (id) => {
    if (!user) {
      Swal.fire({
        icon: 'warning',
        title: 'Authentication Required',
        text: 'Please log in to view the blood donation request details.',
        showCancelButton: true,
        confirmButtonText: 'Login Now',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else {
      navigate(`/donation-request/${id}`);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div className="section-header">
        <h2>Active Donation Requests</h2>
        <p>Review the active blood donation requests below. Your support can save a life.</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading pending donation requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {requests.map(req => (
            <div key={req._id} className="card request-card" style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', right: '1.5rem', top: '1.5rem', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', boxShadow: 'var(--shadow-sm)' }}>
                {req.bloodGroup}
              </div>
              
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', width: '80%' }}>Recipient: {req.recipientName}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <MapPin size={16} color="var(--primary)" />
                  <span>{req.recipientUpazila}, {req.recipientDistrict}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span>{formatDate(req.donationDate)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Clock size={16} color="var(--primary)" />
                  <span>{req.donationTime}</span>
                </div>
              </div>

              <button 
                className="btn btn-outline" 
                style={{ width: '100%' }}
                onClick={() => handleViewDetails(req._id)}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <Heart size={64} color="var(--text-muted)" style={{ margin: '0 auto 1.5rem auto' }} />
          <h3>No Pending Requests</h3>
          <p>There are currently no active pending blood donation requests. Check back later!</p>
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
