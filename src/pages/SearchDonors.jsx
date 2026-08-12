import React, { useState } from 'react';
import axios from 'axios';
import { districts, upazilas } from '../utils/geo';
import { Search, MapPin, Mail, Loader, Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export default function SearchDonors() {
  const [formData, setFormData] = useState({
    bloodGroup: '',
    district: '',
    upazila: ''
  });

  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
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
      ...(name === 'district' ? { upazila: '' } : {})
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!formData.bloodGroup || !formData.district || !formData.upazila) {
      return Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please select all search criteria (blood group, district, upazila) to find donors.'
      });
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/donors/search`, {
        params: {
          bloodGroup: formData.bloodGroup,
          district: formData.district,
          upazila: formData.upazila
        }
      });
      setDonors(response.data);
      setSearched(true);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Search Error',
        text: error.response?.data?.message || 'Failed to search donors.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
      <div className="card" style={{ marginBottom: '3rem' }}>
        <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '0.5rem' }}>Search Blood Donors</h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Filter active donors by blood type and location.</p>

        <form onSubmit={handleSearch}>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Searching...
              </>
            ) : (
              <>
                <Search size={18} />
                Search Donors
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="results-container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <Loader className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1.5s linear infinite', margin: '0 auto' }} />
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Searching active donors in database...</p>
          </div>
        ) : searched ? (
          <div>
            <h3 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
              Search Results ({donors.length})
            </h3>
            
            {donors.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {donors.map(donor => (
                  <div key={donor._id} className="card donor-card">
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                      <img src={donor.avatar} alt={donor.name} className="donor-avatar" />
                      <div>
                        <h4 style={{ fontSize: '1.1rem' }}>{donor.name}</h4>
                        <span className="blood-badge">{donor.bloodGroup}</span>
                      </div>
                    </div>
                    
                    <div className="donor-details">
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{donor.upazila}, {donor.district}</span>
                      </div>
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{donor.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 0' }}>
                <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h4>No Donors Found</h4>
                <p>We couldn't find any active donors matching your query. Try a different location.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 0', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--text-muted)' }}>Fill in the criteria above and click search to discover donors.</p>
          </div>
        )}
      </div>

      <style>{`
        .donor-avatar {
          width: 55px;
          height: 55px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid var(--primary-light);
        }
        .blood-badge {
          display: inline-block;
          background-color: var(--primary-light);
          color: var(--primary);
          padding: 0.15rem 0.5rem;
          border-radius: var(--radius-sm);
          font-weight: 700;
          font-size: 0.8rem;
          margin-top: 0.25rem;
        }
        .donor-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-top: 1px solid var(--border);
          padding-top: 1rem;
        }
        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
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
