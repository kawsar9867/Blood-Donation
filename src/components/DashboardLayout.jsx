import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
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
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="dashboard-mobile-header">
        <button onClick={() => setSidebarOpen(true)} className="mobile-toggle-btn">
          <Menu size={24} />
        </button>
        <Link to="/" className="mobile-logo">
          <Heart fill="var(--primary)" color="var(--primary)" size={20} />
          <span>LifeBlood</span>
        </Link>
        <img src={user?.avatar} alt={user?.name} className="mobile-avatar" />
      </div>

      {/* Sidebar Navigation */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo">
            <Heart fill="var(--primary)" color="var(--primary)" size={24} />
            <span>LifeBlood</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="sidebar-close-btn">
            <X size={20} />
          </button>
        </div>

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
          min-height: 100vh;
          background-color: var(--background);
        }
        .dashboard-mobile-header {
          display: none;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.25rem;
          height: 60px;
          background-color: var(--surface);
          border-bottom: 1px solid var(--border);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 400;
        }
        .mobile-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-primary);
        }
        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--secondary);
        }
        .mobile-avatar {
          width: 35px;
          height: 35px;
          border-radius: var(--radius-full);
          object-fit: cover;
        }
        .dashboard-sidebar {
          width: 260px;
          background-color: var(--secondary);
          color: #94a3b8;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 450;
          transition: var(--transition);
        }
        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          height: 70px;
          border-bottom: 1px solid #1e293b;
        }
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
        }
        .sidebar-close-btn {
          display: none;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
        }
        .sidebar-user {
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid #1e293b;
        }
        .sidebar-user-img {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 2px solid #334155;
        }
        .sidebar-user-info h4 {
          color: #ffffff;
          font-size: 0.95rem;
        }
        .sidebar-user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: capitalize;
        }
        .sidebar-menu {
          padding: 1.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          overflow-y: auto;
        }
        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          transition: var(--transition);
          cursor: pointer;
        }
        .sidebar-link:hover {
          background-color: #1e293b;
          color: #ffffff;
        }
        .sidebar-link.active {
          background-color: var(--primary);
          color: #ffffff;
        }
        .sidebar-link .chevron {
          margin-left: auto;
          opacity: 0;
          transition: var(--transition);
        }
        .sidebar-link:hover .chevron, .sidebar-link.active .chevron {
          opacity: 1;
        }
        .sidebar-footer {
          padding: 1rem 0.75rem;
          border-top: 1px solid #1e293b;
        }
        .logout-btn:hover {
          background-color: #fee2e2;
          color: var(--danger);
        }
        .dashboard-main {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          min-height: 100vh;
        }
        .dashboard-main-content {
          max-width: 1100px;
          margin: 0 auto;
        }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.4);
          z-index: 420;
        }

        @media (max-width: 992px) {
          .dashboard-mobile-header {
            display: flex;
          }
          .dashboard-sidebar {
            transform: translateX(-100%);
          }
          .dashboard-sidebar.open {
            transform: translateX(0);
          }
          .sidebar-close-btn {
            display: block;
          }
          .dashboard-main {
            margin-left: 0;
            padding-top: 80px;
          }
          .sidebar-overlay {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
