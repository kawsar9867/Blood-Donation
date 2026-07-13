import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader,
  Heart
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function DashboardHome() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // Donor state
  const [recentRequests, setRecentRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  // Admin/Volunteer state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token) return;

    if (user.role === 'donor') {
      const fetchRecentRequests = async () => {
        try {
          const response = await axios.get(`${API_URL}/donation-requests/my`, {
            params: { recent: 'true' },
            headers: { Authorization: `Bearer ${token}` }
          });
          setRecentRequests(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setRequestsLoading(false);
        }
      };
      fetchRecentRequests();
    } else {
      const fetchStats = async () => {
        try {
          const response = await axios.get(`${API_URL}/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setStats(response.data);
        } catch (error) {
          console.error(error);
        } finally {
          setStatsLoading(false);
        }
      };
      fetchStats();
    }
  }, [user, token]);

  const handleStatusUpdate = async (id, newStatus) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to mark this donation request as ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${API_URL}/donation-requests/${id}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          Swal.fire('Updated!', `Donation request marked as ${newStatus}.`, 'success');
          
          // Refresh list
          setRecentRequests(prev => 
            prev.map(r => r._id === id ? { ...r, status: newStatus } : r)
          );
        } catch (error) {
          Swal.fire('Error', 'Failed to update status.', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete request?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger)',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/donation-requests/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          Swal.fire('Deleted!', 'Your donation request has been deleted.', 'success');
          
          setRecentRequests(prev => prev.filter(r => r._id !== id));
        } catch (error) {
          Swal.fire('Error', 'Failed to delete request.', 'error');
        }
      }
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (!user) return null;

  return (
    <div>
      {/* Welcome Header */}
      <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--secondary)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
        <div>
          <h1 style={{ color: 'white', fontSize: '1.8rem', marginBottom: '0.5rem' }}>Welcome Back, {user.name}!</h1>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>You are logged in as a <strong style={{ color: 'var(--primary-light)', textTransform: 'capitalize' }}>{user.role}</strong>.</p>
        </div>
        <Heart fill="var(--primary)" color="var(--primary)" size={48} className="beating-heart" />
      </div>

      {/* Donor Content */}
      {user.role === 'donor' && (
        <div>
          {requestsLoading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <Loader className="animate-spin" size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
              <p style={{ marginTop: '0.75rem' }}>Loading recent donation requests...</p>
            </div>
          ) : recentRequests.length > 0 ? (
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                Your 3 Recent Donation Requests
              </h3>
              
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Recipient Name</th>
                      <th>Location</th>
                      <th>Date / Time</th>
                      <th>Blood Group</th>
                      <th>Status</th>
                      <th>Assigned Donor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map(req => (
                      <tr key={req._id}>
                        <td style={{ fontWeight: '600' }}>{req.recipientName}</td>
                        <td>{req.recipientUpazila}, {req.recipientDistrict}</td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{formatDate(req.donationDate)}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.donationTime}</div>
                        </td>
                        <td style={{ fontWeight: '700', color: 'var(--primary)' }}>{req.bloodGroup}</td>
                        <td>
                          <span className={`badge badge-${req.status}`}>{req.status}</span>
                        </td>
                        <td>
                          {req.status === 'inprogress' && req.donorName ? (
                            <div style={{ fontSize: '0.8rem' }}>
                              <p style={{ fontWeight: '500' }}>{req.donorName}</p>
                              <p style={{ color: 'var(--text-muted)' }}>{req.donorEmail}</p>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Not Assigned</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <button 
                              className="btn btn-ghost" 
                              style={{ padding: '0.35rem' }} 
                              onClick={() => navigate(`/donation-request/${req._id}`)}
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {req.status === 'pending' && (
                              <>
                                <button 
                                  className="btn btn-ghost" 
                                  style={{ padding: '0.35rem' }} 
                                  onClick={() => navigate(`/dashboard/edit-donation-request/${req._id}`)}
                                  title="Edit Request"
                                >
                                  <Edit3 size={16} color="var(--info)" />
                                </button>
                                <button 
                                  className="btn btn-ghost" 
                                  style={{ padding: '0.35rem' }} 
                                  onClick={() => handleDelete(req._id)}
                                  title="Delete Request"
                                >
                                  <Trash2 size={16} color="var(--danger)" />
                                </button>
                              </>
                            )}

                            {req.status === 'inprogress' && (
                              <>
                                <button 
                                  className="btn btn-ghost" 
                                  style={{ padding: '0.35rem' }} 
                                  onClick={() => handleStatusUpdate(req._id, 'done')}
                                  title="Mark as Done"
                                >
                                  <CheckCircle size={16} color="var(--success)" />
                                </button>
                                <button 
                                  className="btn btn-ghost" 
                                  style={{ padding: '0.35rem' }} 
                                  onClick={() => handleStatusUpdate(req._id, 'canceled')}
                                  title="Cancel Donation"
                                >
                                  <XCircle size={16} color="var(--danger)" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/dashboard/my-donation-requests" className="btn btn-outline">
                  View My All Requests
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Admin / Volunteer Content */}
      {(user.role === 'admin' || user.role === 'volunteer') && (
        <div>
          {statsLoading ? (
            <div style={{ textAlign: 'center', padding: '5rem 0' }}>
              <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
              <p style={{ marginTop: '1rem' }}>Loading platform statistics...</p>
            </div>
          ) : stats ? (
            <div className="grid-3">
              <div className="card stats-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                  <Users size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Total Donors</p>
                  <h2 style={{ fontSize: '2rem' }}>{stats.totalUser}</h2>
                </div>
              </div>

              <div className="card stats-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#e0f2fe', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#0284c7' }}>
                  <DollarSign size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Total Funding</p>
                  <h2 style={{ fontSize: '2rem' }}>${stats.totalFunding.toLocaleString()}</h2>
                </div>
              </div>

              <div className="card stats-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ backgroundColor: '#dcfce7', padding: '1rem', borderRadius: 'var(--radius-md)', color: '#15803d' }}>
                  <FileText size={32} />
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Donation Requests</p>
                  <h2 style={{ fontSize: '2rem' }}>{stats.totalRequest}</h2>
                </div>
              </div>
            </div>
          ) : (
            <p>Failed to retrieve statistics.</p>
          )}
        </div>
      )}

      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          25% { transform: scale(1.15); }
          40% { transform: scale(1); }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        .beating-heart {
          animation: heartbeat 1.5s infinite ease-in-out;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .stats-card {
          padding: 2rem;
          transition: var(--transition);
        }
        .stats-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  );
}
