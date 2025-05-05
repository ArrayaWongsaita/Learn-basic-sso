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

// เพิ่มโดเมนของ IdP เองถ้ามีการกำหนดไว้
if (process.env.IDP_DOMAIN) {
  allowedOrigins.push(process.env.IDP_DOMAIN);
  console.log(
    `Added self-domain to allowed origins: ${process.env.IDP_DOMAIN}`
  );
}

// ถ้าไม่มี allowed origins ใน production mode ให้แสดง warning
if (process.env.NODE_ENV === 'production' && allowedOrigins.length === 0) {
  console.warn('WARNING: Running in production with no allowed CORS origins!');
}

// Debug information
console.log('Current environment:', process.env.NODE_ENV || 'not set');
console.log('Allowed CORS origins:', allowedOrigins);

// Update CORS configuration to handle credentials properly
app.use(
  cors({
    origin: function (origin, callback) {
      console.log('Request from origin:', origin);

      // ถ้าไม่มี origin specified หรือเป็น development mode ให้อนุญาตทั้งหมด
      if (
        !origin ||
        process.env.NODE_ENV !== 'production' ||
        allowedOrigins.length === 0
      ) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(
          `CORS blocked: ${origin} is not in allowed list:`,
          allowedOrigins
        );
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true, // สำคัญมากสำหรับการส่ง cookies
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
    secret: process.env.SESSION_SECRET || 'my-session-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production', // จำเป็นต้องเป็น true เมื่อ sameSite เป็น none
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
