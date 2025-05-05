const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  console.log('Checking session with cookies:', req.headers.cookie);

  // ตรวจสอบว่าผู้ใช้มี active session หรือไม่
  const isActive = req.session && req.session.user;

  console.log('Session check request - User session active:', !!isActive);
  console.log('Current session data:', req.session);
  console.log(
    'Session ID from cookie:',
    req.headers.cookie?.match(/sessionId=([^;]+)/)?.[1] || 'none'
  );

  // ส่ง CORS headers explicitly
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');

  // ส่งผลลัพธ์กลับไป
  res.json({ active: !!isActive });
});

// เพิ่ม OPTIONS handler เพื่อรองรับ preflight requests
router.options('/', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.sendStatus(204);
});

module.exports = router;
