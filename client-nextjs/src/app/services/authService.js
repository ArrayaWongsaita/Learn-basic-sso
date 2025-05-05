import { AUTH_CONFIG, generateRandomState } from '../config/auth.config';

/**
 * ตรวจสอบว่ามีเซสชั่นที่ IdP หรือไม่
 */
export const checkIdpSession = async () => {
  try {
    // const response = await fetch(`${AUTH_CONFIG.IDP_URL}/check-session`, {
    //   credentials: 'include', // This sends cookies with the request
    // });

    // if (response.ok) {
    //   return await response.json();
    // }
    // return { active: false };
    window.location.href = `${AUTH_CONFIG.IDP_URL}/authorize?client_id=${
      AUTH_CONFIG.CLIENT_ID
    }&redirect_uri=${
      AUTH_CONFIG.REDIRECT_URI
    }&response_type=code&state=${generateRandomState()}&prompt=check_session`;
  } catch (error) {
    console.error('Error checking IdP session:', error);
    return { active: false };
  }
};

/**
 * แลกเปลี่ยน authorization code เพื่อรับ token
 */
export const exchangeCodeForToken = async (code) => {
  try {
    console.log('Exchanging code for token:', code);

    const formData = new URLSearchParams();
    formData.append('code', code);
    formData.append('client_id', AUTH_CONFIG.CLIENT_ID);
    formData.append('redirect_uri', AUTH_CONFIG.REDIRECT_URI);

    const response = await fetch(`${AUTH_CONFIG.IDP_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token request failed:', response.status, errorText);
      return null;
    }

    const data = await response.json();
    console.log('Token response:', data);
    return data;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return null;
  }
};

/**
 * ดึงข้อมูลผู้ใช้โดยใช้ token
 */
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

/**
 * เริ่มกระบวนการล็อกอิน
 */
export const initiateLogin = () => {
  window.location.href = `${AUTH_CONFIG.IDP_URL}/authorize?client_id=${
    AUTH_CONFIG.CLIENT_ID
  }&redirect_uri=${
    AUTH_CONFIG.REDIRECT_URI
  }&response_type=code&state=${generateRandomState()}`;
};

/**
 * เริ่มกระบวนการล็อกเอาท์
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('access_token');
    localStorage.removeItem('access_token');

    const redirectUri = encodeURIComponent(AUTH_CONFIG.REDIRECT_URI);
    const logoutUrl = `${AUTH_CONFIG.IDP_URL}/logout?redirect_uri=${redirectUri}`;

    console.log(`Logging out via: ${logoutUrl}`);

    if (token) {
      await fetch(logoutUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
    }

    window.location.href = AUTH_CONFIG.REDIRECT_URI;
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    window.location.href = AUTH_CONFIG.REDIRECT_URI;
    return false;
  }
};
