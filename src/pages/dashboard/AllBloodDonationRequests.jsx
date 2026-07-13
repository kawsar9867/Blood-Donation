import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Eye, Edit3, Trash2, CheckCircle, XCircle, Loader, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AllBloodDonationRequests() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const isAdmin = user?.role === 'admin';
  const isVolunteer = user?.role === 'volunteer';

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/donation-requests/all`, {
        params: {
          status: statusFilter || undefined,
          page: currentPage,
          limit
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to fetch blood donation requests.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
    }
  }, [token, statusFilter, currentPage]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

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
          
          Swal.fire('Success', `Donation request marked as ${newStatus}.`, 'success');
          fetchRequests();
        } catch (error) {
          Swal.fire('Error', 'Failed to update request status.', 'error');
        }
      }
    });
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return; // Volunteer cannot delete

    Swal.fire({
      title: 'Delete this request?',
      text: "This action is permanent and cannot be undone!",
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
          
          Swal.fire('Deleted!', 'The donation request has been deleted.', 'success');
          
          if (requests.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
          } else {
            fetchRequests();
          }
        } catch (error) {
          Swal.fire('Error', 'Failed to delete donation request.', 'error');
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

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>All Blood Donation Requests</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isAdmin ? 'Manage and update any blood donation request in the platform.' : 'Review and update status of blood donation requests.'}
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="form-control" 
            style={{ width: '160px', padding: '0.5rem' }}
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem' }}>Fetching donation requests...</p>
        </div>
      ) : requests.length > 0 ? (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Requester</th>
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
                {requests.map(req => (
                  <tr key={req._id}>
                    <td>
                      <p style={{ fontWeight: '500' }}>{req.requesterName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{req.requesterEmail}</p>
                    </td>
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
                        
                        {/* Only Admin can Edit or Delete */}
                        {isAdmin && req.status === 'pending' && (
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

                        {/* Both Admin and Volunteer can change status */}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                &laquo;
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h4>No Requests Found</h4>
          <p style={{ color: 'var(--text-muted)' }}>No blood donation requests matched the selected filter.</p>
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
