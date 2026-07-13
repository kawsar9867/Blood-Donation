import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { authClient } from '../lib/auth-client';

const AuthContext = createContext();

// Configure axios to always send credentials/cookies
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const session = authClient.useSession();
  const loading = session.isPending;

  // Map Better Auth user to match existing application schema
  const user = session.data?.user ? {
    id: session.data.user.id,
    _id: session.data.user.id, // compatibility with mongo references
    name: session.data.user.name,
    email: session.data.user.email,
    avatar: session.data.user.avatar || session.data.user.image || 'https://i.ibb.co/Mgs9DkB/default-avatar.png',
    bloodGroup: session.data.user.bloodGroup,
    district: session.data.user.district,
    upazila: session.data.user.upazila,
    role: session.data.user.role || 'donor',
    status: session.data.user.status || 'active'
  } : null;

  const token = session.data?.session?.token || session.data?.session?.id || null;

  const login = async (email, password) => {
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        return { success: false, message: res.error.message || 'Login failed' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authClient.signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        image: userData.avatar,
        avatar: userData.avatar,
        bloodGroup: userData.bloodGroup,
        district: userData.district,
        upazila: userData.upazila
      });
      if (res.error) {
        return { success: false, message: res.error.message || 'Registration failed' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await authClient.signIn.social({
        provider: 'google',
        callbackURL: window.location.origin
      });
      if (res.error) {
        return { success: false, message: res.error.message || 'Google Login failed' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Google Login failed' };
    }
  };

  const logout = async () => {
    await authClient.signOut();
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authClient.updateUser({
        name: profileData.name,
        image: profileData.avatar,
        avatar: profileData.avatar,
        bloodGroup: profileData.bloodGroup,
        district: profileData.district,
        upazila: profileData.upazila
      });
      if (res.error) {
        return { success: false, message: res.error.message || 'Failed to update profile.' };
      }
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Failed to update profile.' };
    }
  };

  const getAuthHeaders = () => {
    // Cookies are automatically sent because of axios.defaults.withCredentials = true.
    // Setting Bearer token authorization header as fallback.
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  return (
    <AuthContext.Provider value={{ user, session, token, loading, login, loginWithGoogle, register, logout, updateProfile, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useSession = () => authClient.useSession();
