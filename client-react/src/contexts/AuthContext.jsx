/* eslint-disable react-refresh/only-export-components */
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
    // ตรวจสอบว่ามี code จาก IdP หรือไม่
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (code) {
      // แลกเปลี่ยน code เพื่อรับ token
      const data = await exchangeCodeForToken(code);
      // ลบ code จาก URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (data?.access_token) {
        localStorage.setItem('access_token', data.access_token);
        const userData = await fetchUserInfo(data.access_token);
        setUser(userData);
      }
    } else {
      // ตรวจสอบว่ามี token ใน localStorage หรือไม่
      const token = localStorage.getItem('access_token');
      if (token) {
        const userData = await fetchUserInfo(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('access_token');
          // ตรวจสอบว่ามีเซสชั่นที่ IdP หรือไม่
          const sessionData = await checkIdpSession();
          if (sessionData?.active) {
            // มีเซสชั่นที่ IdP แต่ไม่มี token ที่ client
            login();
            return;
          }
        }
      } else {
        if (error) {
          // ถ้ามี error จาก IdP ให้แสดงข้อความ
          console.error('Error from IdP:', error);
        } else {
          // ไม่มี token และไม่มี code ให้ตรวจสอบเซสชั่นที่ IdP
          checkIdpSession();
          // if (sessionData?.active) {
          //   // มีเซสชั่นที่ IdP แต่ไม่มี token ที่ client
          //   login();
          //   return;
          // }
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
    window.location.href = window.location.origin;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        setUser,
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
