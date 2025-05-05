const { Router } = require('express');
const path = require('path');
const { validateCredentials } = require('../data/mockDb');

const router = Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/login.html'));
});

router.post('/', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  // ตรวจสอบข้อมูล
  const user = validateCredentials(email, password);

  if (user) {
    console.log('Login successful for:', email);

    // บันทึกข้อมูลผู้ใช้ลงใน session
    req.session.user = user;

    // ดึง returnTo จาก session
    const redirect = req.session.returnTo || '/';
    console.log('Redirecting to:', redirect);

    // ลบ returnTo ออกจาก session
    delete req.session.returnTo;

    // ส่ง redirect response
    return res.redirect(redirect);
  }

  // กรณีเข้าสู่ระบบล้มเหลว
  console.log('Login failed for:', email);
  return res.status(401).send('Invalid credentials');
});

module.exports = router;
