/**
 * Configuration สำหรับระบบ SSO
 */
export const AUTH_CONFIG = {
  IDP_URL: process.env.NEXT_PUBLIC_IDP_URL || 'https://your-idp-domain.com',
  CLIENT_ID: process.env.NEXT_PUBLIC_CLIENT_ID || 'client-two',
  REDIRECT_URI: typeof window !== 'undefined' ? window.location.origin : '',
};

/**
 * Helper function to generate random state
 */
export const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15);
};
