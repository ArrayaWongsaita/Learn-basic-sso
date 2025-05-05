const { Router } = require('express');
const { v4: uuid } = require('uuid');

const router = Router();
const codes = new Map(); // code → user

router.get('/', (req, res) => {
  const { client_id, redirect_uri, state, prompt } = req.query;

  if (!req.session.user) {
    // If prompt=none, don't redirect to login page but return an error
    if (prompt === 'none') {
      return res.redirect(
        `${redirect_uri}?error=login_required&state=${state}`
      );
    }

    // บันทึก URL ก่อนทำ redirect
    req.session.returnTo = req.originalUrl;
    console.log('Setting returnTo:', req.originalUrl);

    // ทำ redirect
    return res.redirect('/login');
  }

  console.log('User session:', req.session.user);

  // สร้าง code และบันทึกข้อมูลผู้ใช้
  const code = uuid();
  codes.set(code, req.session.user);
  console.log('Generated code:', code);

  // สร้าง URL สำหรับ redirect กลับไปยังไคลเอนต์
  const redirectUrl = `${redirect_uri}?code=${code}&state=${state}`;
  console.log('Redirecting to:', redirectUrl);

  // ทำ redirect กลับไปยังไคลเอนต์
  return res.redirect(redirectUrl);
});

module.exports = router;
module.exports.codes = codes;
