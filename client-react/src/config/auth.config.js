// Configuration สำหรับระบบ SSO
export const AUTH_CONFIG = {
  IDP_URL: import.meta.env.VITE_IDP_URL || 'https://your-idp-domain.com',
  CLIENT_ID: import.meta.env.VITE_CLIENT_ID || 'client-one',
  REDIRECT_URI: import.meta.env.VITE_REDIRECT_URI || window.location.origin,
};

// Helper function to generate random state
export const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};
