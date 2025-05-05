const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

// นำเข้า custom session middleware ที่สร้างเอง
const customSession = require('./middleware/customSession');

// import routes
const authorizeRoute = require('./routers/authorize');
const tokenRoute = require('./routers/token');
const loginRoute = require('./routers/login');
const sessionRoute = require('./routers/session');
const logoutRoute = require('./routers/logout');
const userinfoRoute = require('./routers/userinfo');
const { getUserById } = require('./data/mockDb');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

// อ่านค่า allowed origins จาก environment variable
const allowedOriginsString = process.env.ALLOWED_ORIGINS || '';
const allowedOrigins = allowedOriginsString
  ? allowedOriginsString.split(',').map((origin) => origin.trim())
  : [];

console.log('Allowed CORS origins:', allowedOrigins);

// Update CORS configuration to handle credentials properly
app.use(
  cors({
    origin: function (origin, callback) {
      // อนุญาตให้เรียกจาก origins ที่กำหนดใน env หรือไม่มี origin (เช่น Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`CORS blocked: ${origin} is not allowed`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  })
);

app.use(morgan('dev'));

// Add static files middleware
app.use(express.static(path.join(__dirname, '../public')));

app.use(bodyParser.urlencoded({ extended: true }));

// ใช้ customSession แทน express-session
app.use(
  customSession({
    secret: 'my-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      // ในระบบจริง ถ้าใช้ HTTPS ควรตั้งค่า secure: true
    },
  })
);

app.use('/authorize', authorizeRoute);
app.use('/token', tokenRoute);
app.use('/login', loginRoute);
app.use('/check-session', sessionRoute);
app.use('/logout', logoutRoute);
app.use('/userinfo', userinfoRoute);

app.listen(PORT, () => {
  console.log(`IdP Server running at port : ${PORT}`);
});
