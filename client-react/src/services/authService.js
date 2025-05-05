import { AUTH_CONFIG, generateRandomState } from '../config/auth.config';

// ตรวจสอบว่ามีเซสชั่นที่ IdP หรือไม่
export const checkIdpSession = async () => {
  try {
    // console.log('Checking session with IdP:', AUTH_CONFIG.IDP_URL);

    // const response = await fetch(`${AUTH_CONFIG.IDP_URL}/check-session`, {
    //   credentials: 'include', // สำคัญมากสำหรับการส่ง cookies
    //   headers: {
    //     Accept: 'application/json',
    //   },
    // });

    // console.log('Session check response status:', response.status);

    // if (response.ok) {
    //   const data = await response.json();
    //   console.log('Session check result:', data);
    //   return data;
    // }
    // return { active: false };
    window.location.href = `${AUTH_CONFIG.IDP_URL}/authorize?client_id=${
      AUTH_CONFIG.CLIENT_ID
    }&redirect_uri=${
      AUTH_CONFIG.REDIRECT_URI
    }&response_type=code&state=${generateRandomState()}`;
  } catch (error) {
    console.error('Error checking IdP session:', error);
    return { active: false };
  }
};

// แลกเปลี่ยน authorization code เพื่อรับ token
export const exchangeCodeForToken = async (code) => {
  try {
    const response = await fetch(`${AUTH_CONFIG.IDP_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${code}&client_id=${AUTH_CONFIG.CLIENT_ID}&redirect_uri=${AUTH_CONFIG.REDIRECT_URI}`,
    });

    return await response.json();
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

// ดึงข้อมูลผู้ใช้โดยใช้ token
export const fetchUserInfo = async (token) => {
  try {
    const response = await fetch(`${AUTH_CONFIG.IDP_URL}/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user info:', error);
    return null;
  }
};

// เริ่มกระบวนการล็อกอิน
export const initiateLogin = () => {
  window.location.href = `${AUTH_CONFIG.IDP_URL}/authorize?client_id=${
    AUTH_CONFIG.CLIENT_ID
  }&redirect_uri=${
    AUTH_CONFIG.REDIRECT_URI
  }&response_type=code&state=${generateRandomState()}`;
};

// เริ่มกระบวนการล็อกเอาท์
export const logout = async () => {
  try {
    const token = localStorage.getItem('access_token');
    localStorage.removeItem('access_token');

    const redirectUri = encodeURIComponent(AUTH_CONFIG.REDIRECT_URI);
    const logoutUrl = `${AUTH_CONFIG.IDP_URL}/logout?redirect_uri=${redirectUri}`;

    if (token) {
      await fetch(logoutUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }

    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};
