const { Router } = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { codes } = require('./authorize');
const { getUserById } = require('../data/mockDb');

dotenv.config();
const router = Router();

// Check if JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

router.post('/', (req, res) => {
  const { code } = req.body;
  const user = codes.get(code);
  console.log('codes', codes);

  if (!user) return res.status(400).json({ error: 'Invalid code' });

  // ดึงข้อมูลเพิ่มเติมของผู้ใช้
  const userDetails = getUserById(user.id);

  // สร้าง token โดยเพิ่มข้อมูลที่สำคัญของผู้ใช้
  // ไม่ควรใส่ข้อมูลมากเกินไปใน token เพื่อลดขนาด
  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: userDetails?.role || 'user',
    },
    JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );

  res.json({
    access_token: token,
    token_type: 'Bearer',
    expires_in: 900,
    id_token: token,
  });
});

module.exports = router;
