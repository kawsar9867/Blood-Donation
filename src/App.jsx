import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SearchDonors from './pages/SearchDonors';
import DonationRequests from './pages/DonationRequests';

// Private Pages
import DonationRequestDetails from './pages/DonationRequestDetails';
import Funding from './pages/Funding';

// Dashboard Components & Pages
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import MyDonationRequests from './pages/dashboard/MyDonationRequests';
import CreateDonationRequest from './pages/dashboard/CreateDonationRequest';
import EditDonationRequest from './pages/dashboard/EditDonationRequest';
import AllUsers from './pages/dashboard/AllUsers';
import AllBloodDonationRequests from './pages/dashboard/AllBloodDonationRequests';

// Main Layout for Public Pages (sticky header + content + footer)
function MainLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Views Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="donation-requests" element={<DonationRequests />} />
            <Route path="search" element={<SearchDonors />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            
            {/* Private Details & Funding inside Public Layout */}
            <Route 
              path="donation-request/:id" 
              element={
                <PrivateRoute>
                  <DonationRequestDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="funding" 
              element={
                <PrivateRoute>
                  <Funding />
                </PrivateRoute>
              } 
            />
          </Route>

          {/* Private Dashboard Views Layout (No navbar/footer, sidebar only) */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="profile" element={<Profile />} />
            
            {/* Donor specific routes */}
            <Route 
              path="my-donation-requests" 
              element={
                <PrivateRoute allowedRoles={['donor']}>
                  <MyDonationRequests />
                </PrivateRoute>
              } 
            />
            <Route 
              path="create-donation-request" 
              element={
                <PrivateRoute allowedRoles={['donor']}>
                  <CreateDonationRequest />
                </PrivateRoute>
              } 
            />
            <Route 
              path="edit-donation-request/:id" 
              element={
                <PrivateRoute allowedRoles={['donor', 'admin']}>
                  <EditDonationRequest />
                </PrivateRoute>
              } 
            />

            {/* Admin only routes */}
            <Route 
              path="all-users" 
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AllUsers />
                </PrivateRoute>
              } 
            />

            {/* Admin / Volunteer routes */}
            <Route 
              path="all-blood-donation-request" 
              element={
                <PrivateRoute allowedRoles={['admin', 'volunteer']}>
                  <AllBloodDonationRequests />
                </PrivateRoute>
              } 
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
