import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <div className="footer-logo">
            <Heart fill="var(--primary)" color="var(--primary)" size={24} />
            <span>LifeBlood</span>
          </div>
          <p className="footer-desc">
            LifeBlood is a user-friendly platform connecting voluntary blood donors with those in critical need, making blood donation seamless, fast, and efficient.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donation-requests">Donation Requests</Link></li>
            <li><Link to="/search">Search Donors</Link></li>
            <li><Link to="/register">Join as Donor</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul className="footer-contacts">
            <li>
              <Phone size={16} />
              <span>+880 1234 567890</span>
            </li>
            <li>
              <Mail size={16} />
              <span>support@lifeblood.org</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Dhaka, Bangladesh</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} LifeBlood. All rights reserved. Designed with ❤️ to save lives.</p>
      </div>

      <style>{`
        .footer {
          background-color: var(--secondary);
          color: #94a3b8;
          padding: 4rem 0 2rem 0;
          border-top: 1px solid #1e293b;
          margin-top: auto;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2.5rem;
          margin-bottom: 3rem;
        }
        .footer-col h4 {
          color: #ffffff;
          font-size: 1.1rem;
          margin-bottom: 1.25rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1rem;
        }
        .footer-desc {
          font-size: 0.9rem;
          line-height: 1.6;
        }
        .footer-links {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-links a {
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .footer-links a:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .footer-contacts {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          font-size: 0.9rem;
        }
        .footer-contacts li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .footer-bottom {
          border-top: 1px solid #1e293b;
          padding-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
        }
      `}</style>
    </footer>
  );
}
