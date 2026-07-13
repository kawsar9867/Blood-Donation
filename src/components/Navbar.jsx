import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, LogOut, LayoutDashboard, User as UserIcon, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
          <Heart fill="var(--primary)" color="var(--primary)" size={28} />
          <span>LifeBlood</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          <Link to="/donation-requests" className="nav-link">Donation Requests</Link>
          {user && <Link to="/funding" className="nav-link">Funding</Link>}
          
          {user ? (
            <div className="nav-user-menu">
              <button 
                className="nav-avatar-btn" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <img src={user.avatar} alt={user.name} className="nav-avatar-img" />
              </button>
              
              {dropdownOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-user-info">
                    <p className="dropdown-name">{user.name}</p>
                    <p className="dropdown-role">{user.role}</p>
                  </div>
                  <hr style={{ border: '0', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />
                  <Link to="/dashboard" className="dropdown-link" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Link>
                  <button className="dropdown-link logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Login</Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="nav-links-mobile">
          <Link to="/donation-requests" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Donation Requests
          </Link>
          {user && (
            <Link to="/funding" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Funding
            </Link>
          )}
          {user ? (
            <>
              <Link to="/dashboard" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Dashboard ({user.name})
              </Link>
              <button className="mobile-link logout-btn-mobile" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-link-btn" onClick={() => setMobileMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>
      )}

      <style>{`
        .navbar {
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 500;
          box-shadow: var(--shadow-sm);
        }
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--secondary);
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 1.75rem;
        }
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none;
          }
        }
        .nav-link {
          font-weight: 500;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .nav-link:hover {
          color: var(--primary);
        }
        .nav-user-menu {
          position: relative;
        }
        .nav-avatar-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 2px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
        }
        .nav-avatar-img {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid var(--border);
          transition: var(--transition);
        }
        .nav-avatar-btn:hover .nav-avatar-img {
          border-color: var(--primary);
        }
        .nav-dropdown {
          position: absolute;
          right: 0;
          top: 120%;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          min-width: 200px;
          padding: 0.5rem 0;
          animation: dropdownFade 0.2s ease;
        }
        .dropdown-user-info {
          padding: 0.5rem 1rem;
        }
        .dropdown-name {
          font-weight: 600;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .dropdown-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }
        .dropdown-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          transition: var(--transition);
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-link:hover {
          background-color: var(--background);
          color: var(--primary);
        }
        .logout-btn {
          color: var(--danger);
        }
        .logout-btn:hover {
          background-color: #fef2f2;
          color: var(--danger);
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
        }
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
        }
        .nav-links-mobile {
          display: flex;
          flex-direction: column;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
          padding: 1rem 1.5rem;
          gap: 1rem;
        }
        .mobile-link {
          font-weight: 500;
          color: var(--text-secondary);
        }
        .logout-btn-mobile {
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--danger);
          padding: 0;
        }
        .mobile-link-btn {
          display: inline-block;
          text-align: center;
          background-color: var(--primary);
          color: #ffffff;
          padding: 0.6rem;
          border-radius: var(--radius-md);
          font-weight: 600;
        }
      `}</style>
    </nav>
  );
}
