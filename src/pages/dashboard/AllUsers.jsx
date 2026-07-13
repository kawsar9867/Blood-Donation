import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { MoreVertical, ShieldAlert, Shield, ShieldCheck, UserCheck, Loader, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function AllUsers() {
  const { token, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState(null); // stores user ID
  const limit = 10;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users`, {
        params: {
          status: statusFilter || undefined,
          page: currentPage,
          limit
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Failed to retrieve users.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, statusFilter, currentPage]);

  const handleFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setActiveDropdown(null);

    Swal.fire({
      title: 'Update user status?',
      text: `Are you sure you want to mark this user as ${newStatus}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${API_URL}/users/${userId}/status`,
            { status: newStatus },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire('Success', `User status updated to ${newStatus}.`, 'success');
          fetchUsers();
        } catch (error) {
          Swal.fire('Error', 'Failed to update user status.', 'error');
        }
      }
    });
  };

  const handleRoleChange = async (userId, newRole) => {
    setActiveDropdown(null);

    Swal.fire({
      title: 'Change user role?',
      text: `Are you sure you want to update this user role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(
            `${API_URL}/users/${userId}/role`,
            { role: newRole },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          Swal.fire('Success', `User role updated to ${newRole}.`, 'success');
          fetchUsers();
        } catch (error) {
          Swal.fire('Error', 'Failed to change user role.', 'error');
        }
      }
    });
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveDropdown(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)' }}>User Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View and manage user roles, permissions, and access status.</p>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} color="var(--text-secondary)" />
          <select 
            className="form-control" 
            style={{ width: '160px', padding: '0.5rem' }}
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '1rem' }}>Loading users database...</p>
        </div>
      ) : users.length > 0 ? (
        <>
          <div className="table-container" style={{ overflow: 'visible' }}>
            <table style={{ overflow: 'visible' }}>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody style={{ overflow: 'visible' }}>
                {users.map(u => (
                  <tr key={u._id} style={{ overflow: 'visible' }}>
                    <td>
                      <img 
                        src={u.avatar} 
                        alt={u.name} 
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border)' }} 
                      />
                    </td>
                    <td style={{ fontWeight: '500' }}>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize', fontWeight: '500' }}>{u.role}</td>
                    <td>
                      <span className={`badge badge-${u.status}`}>{u.status}</span>
                    </td>
                    <td style={{ textAlign: 'center', overflow: 'visible' }}>
                      {/* Dropdown Menu Container */}
                      <div className="actions-dropdown">
                        <button 
                          className="dropdown-trigger" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === u._id ? null : u._id);
                          }}
                          disabled={u._id === currentUser?.id}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {activeDropdown === u._id && (
                          <div className="dropdown-menu">
                            {u.status === 'active' ? (
                              <button 
                                className="dropdown-item text-danger" 
                                onClick={() => handleStatusChange(u._id, u.status)}
                              >
                                <ShieldAlert size={16} />
                                Block User
                              </button>
                            ) : (
                              <button 
                                className="dropdown-item" 
                                style={{ color: 'var(--success)' }} 
                                onClick={() => handleStatusChange(u._id, u.status)}
                              >
                                <ShieldCheck size={16} />
                                Unblock User
                              </button>
                            )}
                            
                            {u.role === 'donor' && (
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleRoleChange(u._id, 'volunteer')}
                              >
                                <UserCheck size={16} />
                                Make Volunteer
                              </button>
                            )}

                            {u.role !== 'admin' && (
                              <button 
                                className="dropdown-item" 
                                onClick={() => handleRoleChange(u._id, 'admin')}
                              >
                                <Shield size={16} />
                                Make Admin
                              </button>
                            )}
                          </div>
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
          <h4>No Users Found</h4>
          <p style={{ color: 'var(--text-muted)' }}>No users match the filtering criteria.</p>
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
