const { Router } = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { getUserById } = require('../data/mockDb');
const { isTokenRevoked } = require('../utils/tokenBlacklist');

dotenv.config();
const router = Router();

// Check if JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

router.get('/', (req, res) => {
  // ตรวจสอบ Authorization header
  const authHeader = req.headers.authorization;
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }

  // ดึง token
  const token = authHeader.split(' ')[1];

  // ตรวจสอบว่า token อยู่ใน blacklist หรือไม่
  if (isTokenRevoked(token)) {
    console.log('Token is revoked:', token.substring(0, 20) + '...');
    return res.status(401).json({ error: 'Token has been revoked' });
  }

  try {
    // ตรวจสอบ token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);

    // ดึงข้อมูลผู้ใช้
    const user = getUserById(decoded.sub);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ส่งข้อมูลกลับ
    res.json(user);
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
