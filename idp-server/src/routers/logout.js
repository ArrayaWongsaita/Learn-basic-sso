const { Router } = require('express');
const { revokeToken } = require('../utils/tokenBlacklist');
const router = Router();

router.get('/', (req, res) => {
  console.log('Logout request received');
  const { redirect_uri } = req.query;

  // ตรวจสอบหา token ที่ส่งมาใน Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    console.log('Revoking token:', token.substring(0, 20) + '...');

    // เพิ่ม token เข้าไปใน blacklist
    revokeToken(token);
  }

  // ตรวจสอบและลบ session แบบ synchronous
  if (req.session) {
    const hadSession = !!req.session.user;

    if (hadSession) {
      console.log('Found user session, destroying...');

      // บันทึกข้อมูลก่อนลบ session
      const wasUser = req.session.user;

      // ล้างข้อมูลก่อน
      req.session.user = null;
      req.session.returnTo = null;
    }

    // ลบ session โดยใช้ Promise
    new Promise((resolve) => {
      if (typeof req.session.destroy === 'function') {
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err);
          } else {
            console.log('Session destroyed successfully');
          }
          resolve();
        });
      } else {
        console.log('No destroy method, manually cleaning session');
        req.session = null;
        resolve();
      }
    }).then(() => {
      // ลบ cookie
      res.clearCookie('sessionId', {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
      });

      // ส่ง CORS headers
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Credentials', 'true');

      // ทำ redirect
      if (redirect_uri) {
        console.log('Redirecting to:', redirect_uri);
        return res.redirect(redirect_uri);
      } else {
        return res.json({ success: true, message: 'Logged out successfully' });
      }
    });
  } else {
    // ถ้าไม่มี session
    console.log('No session found');

    // ลบ cookie เพื่อความแน่ใจ
    res.clearCookie('sessionId', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });

    if (redirect_uri) {
      console.log('No session, redirecting to:', redirect_uri);
      return res.redirect(redirect_uri);
    } else {
      return res.json({ success: true, message: 'No active session' });
    }
  }
});

module.exports = router;
