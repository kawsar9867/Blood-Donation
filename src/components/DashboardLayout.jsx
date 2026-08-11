import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Home, 
  PlusCircle, 
  List, 
  Users, 
  FileText, 
  Heart, 
  Menu, 
  X, 
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { 
      path: '/dashboard/profile', 
      label: 'Profile', 
      icon: <User size={20} />, 
      roles: ['donor', 'volunteer', 'admin'] 
    },
    // Donor menus
    { 
      path: '/dashboard', 
      label: 'Dashboard Home', 
      icon: <Home size={20} />, 
      roles: ['donor'],
      end: true
    },
    { 
      path: '/dashboard/my-donation-requests', 
      label: 'My Donation Requests', 
      icon: <List size={20} />, 
      roles: ['donor'] 
    },
    { 
      path: '/dashboard/create-donation-request', 
      label: 'Create Request', 
      icon: <PlusCircle size={20} />, 
      roles: ['donor'] 
    },
    // Admin/Volunteer shared home
    {
      path: '/dashboard',
      label: 'Dashboard Home',
      icon: <Home size={20} />,
      roles: ['admin', 'volunteer'],
      end: true
    },
    // Admin menus
    { 
      path: '/dashboard/all-users', 
      label: 'All Users', 
      icon: <Users size={20} />, 
      roles: ['admin'] 
    },
    { 
      path: '/dashboard/all-blood-donation-request', 
      label: 'All Blood Requests', 
      icon: <FileText size={20} />, 
      roles: ['admin', 'volunteer'] 
    }
  ];

  const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
    <Navbar />
    <div className="dashboard-container">
      {/* Mobile Sidebar Toggle */}
      <button className="dashboard-mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-user">
          <img src={user?.avatar} alt={user?.name} className="sidebar-user-img" />
          <div className="sidebar-user-info">
            <h4>{user?.name}</h4>
            <p className="sidebar-user-role">{user?.role} Role</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          {filteredMenuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight className="chevron" size={16} />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-link logout-btn">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content Area */}
      <main className="dashboard-main">
        <div className="dashboard-main-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .dashboard-container {
          display: flex;
          min-height: calc(100vh - 70px);
          background-color: var(--background);
          position: relative;
        }
        .dashboard-mobile-toggle {
          display: none;
          position: fixed;
          bottom: 1.25rem;
          right: 1.25rem;
          z-index: 460;
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          background: var(--primary);
          color: #ffffff;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(225, 29, 72, 0.35);
          align-items: center;
          justify-content: center;
          transition: var(--transition);
        }
        .dashboard-mobile-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(225, 29, 72, 0.45);
        }
        .dashboard-sidebar {
          width: 280px;
          background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 70px;
          bottom: 0;
          left: 0;
          z-index: 450;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition);
        }
        .sidebar-user {
          padding: 1.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.01);
        }
        .sidebar-user-img {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid rgba(225, 29, 72, 0.4);
          box-shadow: 0 0 12px rgba(225, 29, 72, 0.2);
          transition: var(--transition);
        }
        .sidebar-user:hover .sidebar-user-img {
          border-color: var(--primary);
          transform: scale(1.05);
          box-shadow: 0 0 16px rgba(225, 29, 72, 0.4);
        }
        .sidebar-user-info h4 {
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .sidebar-user-role {
          font-size: 0.75rem;
          color: var(--primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sidebar-menu {
          padding: 1.75rem 0.85rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          flex: 1;
          overflow-y: auto;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.8rem 1.15rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          color: #94a3b8;
          transition: var(--transition);
          cursor: pointer;
          border: 1px solid transparent;
          background: none;
          width: 100%;
          text-align: left;
          font-size: inherit;
          font-family: inherit;
        }
        .sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.04);
          color: #ffffff;
          transform: translateX(6px);
        }
        .sidebar-link.active {
          background: linear-gradient(135deg, rgba(225, 29, 72, 0.15), rgba(239, 68, 68, 0.05));
          color: #ffffff;
          border-color: rgba(225, 29, 72, 0.3);
          box-shadow: 0 4px 15px rgba(225, 29, 72, 0.1);
        }
        .sidebar-link .chevron {
          margin-left: auto;
          opacity: 0;
          transform: translateX(-4px);
          transition: var(--transition);
        }
        .sidebar-link:hover .chevron, .sidebar-link.active .chevron {
          opacity: 1;
          transform: translateX(0);
        }
        .sidebar-footer {
          padding: 1.25rem 0.85rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .sidebar-footer .logout-btn {
          color: #ef4444;
        }
        .sidebar-footer .logout-btn:hover {
          background-color: rgba(239, 68, 68, 0.1) !important;
          color: #fca5a5 !important;
          transform: translateX(6px);
        }
        .dashboard-main {
          flex: 1;
          margin-left: 280px;
          padding: 2.5rem;
          min-height: calc(100vh - 70px);
          transition: var(--transition);
        }
        .dashboard-main-content {
          max-width: 1200px;
          margin: 0 auto;
          animation: pageFadeIn 0.35s ease;
        }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(2, 6, 17, 0.6);
          backdrop-filter: blur(4px);
          z-index: 420;
        }

        @media (max-width: 992px) {
          .dashboard-mobile-toggle {
            display: flex;
          }
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .dashboard-main {
            margin-left: 0;
            padding: 2rem 1.5rem;
          }
          .sidebar-overlay {
            display: block;
          }
        }
      `}</style>
    </div>
    </>
  );
}
