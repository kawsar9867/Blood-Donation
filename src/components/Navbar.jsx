import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
          <div className="logo-icon-wrapper">
            <Heart className="logo-heart" fill="var(--primary)" color="var(--primary)" size={16} />
          </div>
          <span className="logo-text-blood">Blood</span>
          <span className="logo-text-bridge">Bridge</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-links-desktop">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>Home</NavLink>
          <NavLink to="/donation-requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Donation Requests</NavLink>
          <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Search Donor</NavLink>
          {user && <NavLink to="/funding" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Funding</NavLink>}
          {user && <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>}
          
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
            <Link to="/login" className="btn-login">
              <UserIcon size={16} />
              <span>Login</span>
            </Link>
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
          <NavLink to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/donation-requests" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Donation Requests
          </NavLink>
          <NavLink to="/search" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Search Donor
          </NavLink>
          {user && (
            <NavLink to="/funding" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
              Funding
            </NavLink>
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
          background-color: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          position: sticky;
          top: 0;
          z-index: 500;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          transition: var(--transition);
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
          gap: 0.4rem;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--secondary);
          letter-spacing: -0.75px;
          transition: var(--transition);
        }
        .logo-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          background-color: #ffffff;
        }
        .logo-text-blood {
          color: var(--primary);
        }
        .logo-text-bridge {
          color: var(--secondary);
        }
        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        .logo-heart {
          animation: heartPulse 1.6s infinite ease-in-out;
        }
        .nav-links-desktop {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none;
          }
        }
        .nav-link {
          font-weight: 600;
          color: #334155;
          transition: var(--transition);
          position: relative;
          padding: 0.25rem 0;
          font-size: 0.95rem;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: var(--transition);
          border-radius: var(--radius-full);
        }
        .nav-link:hover, .nav-link.active {
          color: var(--primary);
        }
        .nav-link:hover::after, .nav-link.active::after {
          width: 100%;
        }
        .nav-user-menu {
          position: relative;
        }
        .nav-avatar-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 3px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          transition: var(--transition);
          border: 2px solid transparent;
        }
        .nav-avatar-btn:hover {
          border-color: var(--primary);
          box-shadow: 0 0 10px rgba(195, 7, 18, 0.2);
        }
        .nav-avatar-img {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 1px solid var(--border);
        }
        .nav-dropdown {
          position: absolute;
          right: 0;
          top: 130%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: var(--radius-md);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          min-width: 220px;
          padding: 0.75rem 0;
          transform-origin: top right;
          animation: dropdownScale 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes dropdownScale {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-5px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .dropdown-user-info {
          padding: 0.5rem 1.25rem;
        }
        .dropdown-name {
          font-weight: 700;
          color: var(--text-primary);
          font-size: 0.95rem;
        }
        .dropdown-role {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 2px;
        }
        .dropdown-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 1.25rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
          font-weight: 500;
          transition: var(--transition);
          width: 100%;
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
        }
        .dropdown-link:hover {
          background-color: var(--primary-light);
          color: var(--primary);
          transform: translateX(4px);
        }
        .logout-btn {
          color: var(--danger);
        }
        .logout-btn:hover {
          background-color: #fef2f2;
          color: var(--danger);
        }
        .btn-login {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: var(--primary);
          color: #ffffff;
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.9rem;
          transition: var(--transition);
          box-shadow: 0 4px 10px rgba(225, 29, 72, 0.2);
          border: none;
          cursor: pointer;
        }
        .btn-login:hover {
          background-color: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(225, 29, 72, 0.3);
        }
        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
          transition: var(--transition);
        }
        .mobile-menu-toggle:hover {
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .mobile-menu-toggle {
            display: block;
          }
        }
        .nav-links-mobile {
          display: flex;
          flex-direction: column;
          background-color: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 1.25rem 1.5rem;
          gap: 1.25rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }
        .mobile-link {
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition);
        }
        .mobile-link:hover {
          color: var(--primary);
          padding-left: 4px;
        }
        .logout-btn-mobile {
          text-align: left;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--danger);
          padding: 0;
          font-weight: 600;
          transition: var(--transition);
        }
        .logout-btn-mobile:hover {
          padding-left: 4px;
        }
        .mobile-link-btn {
          display: inline-block;
          text-align: center;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          color: #ffffff;
          padding: 0.75rem;
          border-radius: var(--radius-md);
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(195, 7, 18, 0.2);
          transition: var(--transition);
        }
        .mobile-link-btn:hover {
          box-shadow: 0 6px 15px rgba(195, 7, 18, 0.3);
          transform: translateY(-1px);
        }
      `}</style>
    </nav>
  );
}
