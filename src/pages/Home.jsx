import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Heart, Search, Shield, Users, Award, Calendar, Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const navigate = useNavigate();
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [recentRequests, setRecentRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(`${API_URL}/donation-requests`);
        setRecentRequests(response.data.slice(0, 3));
      } catch (err) {
        console.error('Error loading donation requests:', err);
      } finally {
        setLoadingRequests(false);
      }
    };
    fetchRequests();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out to us. We will get back to you shortly.',
      confirmButtonColor: 'var(--primary)'
    });
    setContactForm({ name: '', email: '', message: '' });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="home-container">
      {/* Banner Section */}
      <section className="banner">
        <div className="container banner-content">
          <h1>Be a Hero. Donate Blood. Save Lives.</h1>
          <p>Connecting voluntary blood donors with people in emergency medical situations instantly.</p>
          <div className="banner-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              <Heart fill="white" size={18} />
              Join as a donor
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/search')}>
              <Search size={18} />
              Search Donors
            </button>
          </div>
        </div>
      </section>

      {/* Active Donation Requests Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <h2>Urgent Blood Requests</h2>
            <p>People currently in need of blood donations. Click to view details and donate.</p>
          </div>

          {!loadingRequests && recentRequests.length > 0 ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {recentRequests.map(req => (
                  <div key={req._id} className="card" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span className="badge badge-pending" style={{ fontSize: '0.75rem' }}>Pending</span>
                          <h3 style={{ fontSize: '1.15rem', marginTop: '0.35rem' }}>Recipient: {req.recipientName}</h3>
                        </div>
                        <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '1.1rem', flexShrink: 0 }}>
                          {req.bloodGroup}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <MapPin size={15} color="var(--primary)" />
                          <span>{req.recipientUpazila}, {req.recipientDistrict}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Calendar size={15} color="var(--primary)" />
                          <span>{formatDate(req.donationDate)} at {req.donationTime}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%', gap: '0.4rem' }}
                      onClick={() => navigate(`/donation-request/${req._id}`)}
                    >
                      <span>Donate / View Details</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className="btn btn-outline" onClick={() => navigate('/donation-requests')}>
                  View All Donation Requests
                </button>
              </div>
            </>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem auto' }} />
              <p>No active donation requests at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured / How It Works Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Donate Blood?</h2>
            <p>Your small act of kindness can make a big difference for someone in need.</p>
          </div>
          <div className="grid-3">
            <div className="featured-card card">
              <div className="icon-wrapper">
                <Heart fill="var(--primary)" color="var(--primary)" size={32} />
              </div>
              <h3>Save Lives</h3>
              <p>One single donation can save up to three lives. You have the power to make an immediate impact on patient health.</p>
            </div>
            
            <div className="featured-card card">
              <div className="icon-wrapper">
                <Shield size={32} color="var(--primary)" />
              </div>
              <h3>Safe Process</h3>
              <p>Every step of the blood donation process is conducted by medical professionals with sterilized, single-use equipment.</p>
            </div>

            <div className="featured-card card">
              <div className="icon-wrapper">
                <Award size={32} color="var(--primary)" />
              </div>
              <h3>Health Benefits</h3>
              <p>Regular donation helps reduce excess iron levels in blood, lowers the risk of cardiovascular events, and refreshes the body.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats summary section */}
      <section className="info-blocks">
        <div className="container info-grid">
          <div className="info-text">
            <h2>Who We Are</h2>
            <p>
              We are a network of blood donors, volunteers, and medical centers dedicated to creating an efficient and fast-responding blood supply system in Bangladesh. Our platform streamlines communication so that critical requests are fulfilled in record time.
            </p>
            <ul className="info-list">
              <li>
                <Users size={18} color="var(--primary)" />
                <strong>Verified Donors:</strong> Access to a network of active, reliable donors.
              </li>
              <li>
                <Calendar size={18} color="var(--primary)" />
                <strong>Real-time Requests:</strong> Create and respond to requests in seconds.
              </li>
            </ul>
          </div>
          <div className="info-visual">
            <div className="glow-circle">
              <Heart size={80} fill="var(--primary)" color="var(--primary)" className="beating-heart" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section">
        <div className="container contact-grid">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            <p>Have questions, suggestions, or need urgent assistance? Feel free to contact our support team anytime.</p>
            
            <div className="contact-details">
              <div className="contact-item">
                <Phone size={20} color="var(--primary)" />
                <div>
                  <h4>Call Us</h4>
                  <p>+880 1234 567890</p>
                </div>
              </div>
              <div className="contact-item">
                <Mail size={20} color="var(--primary)" />
                <div>
                  <h4>Email Us</h4>
                  <p>support@lifeblood.org</p>
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={20} color="var(--primary)" />
                <div>
                  <h4>Visit Us</h4>
                  <p>Dhaka 1212, Bangladesh</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-card card">
            <h3>Send a Message</h3>
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
      
      <style>{`
        .banner {
          background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85)), url('https://images.unsplash.com/photo-1615461066841-60a6378f970e?q=80&w=1200') no-repeat center center/cover;
          color: #ffffff;
          padding: 8rem 0;
          text-align: center;
        }
        .banner-content h1 {
          color: #ffffff;
          font-size: 3rem;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .banner-content p {
          color: #cbd5e1;
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
        }
        .banner-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .banner-buttons .btn-outline {
          border-color: #ffffff;
          color: #ffffff;
        }
        .banner-buttons .btn-outline:hover {
          background-color: #ffffff;
          color: var(--secondary);
        }
        .featured-section {
          padding: 5rem 0;
          background-color: var(--surface);
        }
        .section-header {
          text-align: center;
          margin-bottom: 3.5rem;
        }
        .section-header h2 {
          font-size: 2.25rem;
          margin-bottom: 0.75rem;
        }
        .icon-wrapper {
          width: 64px;
          height: 64px;
          background-color: var(--primary-light);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .featured-card h3 {
          margin-bottom: 0.75rem;
        }
        .info-blocks {
          padding: 6rem 0;
          background-color: var(--background);
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        @media (max-width: 768px) {
          .info-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        .info-text h2 {
          font-size: 2.25rem;
          margin-bottom: 1.5rem;
        }
        .info-text p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
        }
        .info-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .info-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .info-visual {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .glow-circle {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, var(--primary-light) 0%, transparent 70%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
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
        .contact-section {
          padding: 6rem 0;
          background-color: var(--surface);
          border-top: 1px solid var(--border);
        }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
        }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
        .contact-info h2 {
          font-size: 2.25rem;
          margin-bottom: 1.5rem;
        }
        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }
        .contact-item h4 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
        }
      `}</style>
    </div>
  );
}
