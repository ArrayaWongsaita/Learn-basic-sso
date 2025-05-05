'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import {
  checkIdpSession,
  exchangeCodeForToken,
  fetchUserInfo,
  initiateLogin as login,
  logout as logoutService,
} from '../services/authService';

// สร้าง Context สำหรับ Authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    if (typeof window === 'undefined') return;

    // Check if we're returning from IdP with a code
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for token
      const data = await exchangeCodeForToken(code);
      // Remove code from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
        const userData = await fetchUserInfo(data.access_token);
        setUser(userData);
      }
    } else {
      // Check if we have a token in localStorage
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await fetchUserInfo(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('access_token');
          // Check if user has an active session with IdP
          const sessionData = await checkIdpSession();
          if (sessionData?.active) {
            // User has an active session with IdP but no valid token
            login();
            return;
          }
        }
      } else {
        // No token, check if user has an active session with IdP
        const sessionData = await checkIdpSession();
        if (sessionData?.active) {
          // User has an active session with IdP
          login();
          return;
        }
      }
    }

    setLoading(false);
  };

  const initiateLogin = () => {
    login();
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        initiateLogin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// สร้าง Custom Hook สำหรับใช้ AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
