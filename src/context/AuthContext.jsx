import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { authClient } from "../lib/auth-client";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AuthContext = createContext();

// Configure axios
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_URL;

export const AuthProvider = ({ children }) => {
  const session = authClient.useSession();
  const loading = session.isPending;

  // Map Better Auth user to match existing application schema
  const user = session.data?.user
    ? {
        id: session.data.user.id,
        _id: session.data.user.id,
        name: session.data.user.name,
        email: session.data.user.email,
        avatar:
          session.data.user.avatar ||
          session.data.user.image ||
          "https://i.ibb.co/Mgs9DkB/default-avatar.png",
        bloodGroup: session.data.user.bloodGroup,
        district: session.data.user.district,
        upazila: session.data.user.upazila,
        role: session.data.user.role || "donor",
        status: session.data.user.status || "active",
      }
    : null;

  const token =
    session.data?.session?.token || session.data?.session?.id || null;

  const login = async (email, password) => {
    try {
      const res = await authClient.signIn.email({ email, password });
      if (res.error) {
        return { success: false, message: res.error.message || "Login failed" };
      }
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      return { 
        success: false, 
        message: "Cannot connect to server. Please check if backend is running." 
      };
    }
  };

  const register = async (data) => {
    try {
      console.log("Registering with:", API_URL);
      
      const { data: result, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.avatar,
        avatar: data.avatar,
        bloodGroup: data.bloodGroup,
        district: data.district,
        upazila: data.upazila,
        role: data.role,
      });

      if (error) {
        console.error("Registration error:", error);
        return {
          success: false,
          message: error.message || "Registration failed",
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error("Registration exception:", error);
      return {
        success: false,
        message: "Cannot connect to server. Please check if backend is running.",
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
      if (res.error) {
        return {
          success: false,
          message: res.error.message || "Google Login failed",
        };
      }
      return { success: true };
    } catch (err) {
      console.error("Google login error:", err);
      return { 
        success: false, 
        message: "Cannot connect to server. Please check if backend is running." 
      };
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authClient.updateUser({
        name: profileData.name,
        image: profileData.avatar,
        avatar: profileData.avatar,
        bloodGroup: profileData.bloodGroup,
        district: profileData.district,
        upazila: profileData.upazila,
      });
      if (res.error) {
        return {
          success: false,
          message: res.error.message || "Failed to update profile.",
        };
      }
      return { success: true };
    } catch (err) {
      console.error("Update profile error:", err);
      return {
        success: false,
        message: "Failed to update profile.",
      };
    }
  };

  const getAuthHeaders = () => {
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        token,
        loading,
        login,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useSession = () => authClient.useSession();