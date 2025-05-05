const crypto = require('crypto');
const Cookie = require('cookie');

/**
 * ข้อมูล session จะถูกเก็บไว้ที่นี่ (ในหน่วยความจำ)
 * ในระบบจริงควรใช้ Redis หรือฐานข้อมูลอื่นๆ
 */
const sessions = new Map();

/**
 * ฟังก์ชั่นสร้าง session ID แบบสุ่ม
 */
const generateSessionId = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Custom Session Middleware
 * @param {Object} options - ตัวเลือกต่างๆ สำหรับ session
 */
const customSession = (options = {}) => {
  // ค่าเริ่มต้น
  const settings = {
    name: options.name || 'sessionId',
    secret: options.secret || 'my-secret-key',
    cookie: {
      httpOnly: options.cookie?.httpOnly !== false,
      maxAge: options.cookie?.maxAge || 24 * 60 * 60 * 1000, // 1 วัน
      path: options.cookie?.path || '/',
      sameSite: options.cookie?.sameSite || 'none', // เปลี่ยนเป็น 'none' เพื่อให้ทำงานข้าม domain
      secure: true, // ตั้งค่าเป็น true เสมอเมื่อใช้ HTTPS
    },
    resave: options.resave || false,
    rolling: options.rolling || false,
    saveUninitialized: options.saveUninitialized || false,
  };

  // ทำความสะอาด session ที่หมดอายุทุกๆ 15 นาที
  setInterval(() => {
    const now = Date.now();
    for (const [sid, session] of sessions.entries()) {
      if (session.expires <= now) {
        sessions.delete(sid);
      }
    }
  }, 15 * 60 * 1000); // 15 นาที

  return (req, res, next) => {
    // สร้างออบเจ็กต์ session ที่จะแนบเข้ากับ request
    req.session = {};

    // อ่าน session ID จาก cookie
    const cookies = Cookie.parse(req.headers.cookie || '');
    let sessionId = cookies[settings.name];
    let sessionData = sessionId ? sessions.get(sessionId) : null;

    // ถ้ามี session อยู่แล้ว ให้ใช้ session นั้น
    if (sessionData) {
      // ตรวจสอบการหมดอายุ
      if (sessionData.expires > Date.now()) {
        req.session = { ...sessionData.data };

        // ต่ออายุ session ถ้า rolling=true
        if (settings.rolling) {
          sessionData.expires = Date.now() + settings.cookie.maxAge;
        }
      } else {
        // session หมดอายุ ลบทิ้ง
        sessions.delete(sessionId);
        sessionId = null;
      }
    }

    // เมธอดสำหรับบันทึก session
    req.session.save = (callback) => {
      console.log('Saving session:', sessionId); // Log เมื่อมีการบันทึก session

      // ตรวจสอบก่อนว่า headers ได้ถูกส่งไปแล้วหรือไม่
      if (res.headersSent) {
        console.warn('Cannot save session: Headers already sent');
        if (callback) callback();
        return;
      }

      // สร้าง session ID ใหม่ถ้ายังไม่มี
      if (!sessionId) {
        sessionId = generateSessionId();
      }

      // บันทึกข้อมูล session
      const sessionToSave = { ...req.session };
      delete sessionToSave.save;
      delete sessionToSave.destroy;
      delete sessionToSave.regenerate;

      // อัพเดทหรือสร้าง session ใหม่
      sessions.set(sessionId, {
        data: sessionToSave,
        expires: Date.now() + settings.cookie.maxAge,
      });

      // ส่ง cookie กลับไปที่ client
      const cookieOptions = [
        `${settings.name}=${sessionId}`,
        `Path=${settings.cookie.path}`,
        `Max-Age=${Math.floor(settings.cookie.maxAge / 1000)}`,
        settings.cookie.httpOnly ? 'HttpOnly' : '',
        settings.cookie.secure ? 'Secure' : '',
        `SameSite=${settings.cookie.sameSite}`,
      ]
        .filter(Boolean)
        .join('; ');

      res.setHeader('Set-Cookie', cookieOptions);

      if (callback) callback();
    };

    // เมธอดสำหรับลบ session
    req.session.destroy = (callback) => {
      // ตรวจสอบว่ามี sessionId หรือไม่
      if (!req.sessionID) {
        console.log('No sessionID to destroy');
        if (callback) callback();
        return;
      }

      console.log(`Destroying session: ${req.sessionID}`);

      try {
        // ลบ session จาก store
        delete sessionsStore[req.sessionID];

        // ลบ sessionID และ session data
        req.sessionID = undefined;
        Object.keys(req.session).forEach((key) => {
          if (key !== 'destroy' && key !== 'save' && key !== 'regenerate') {
            delete req.session[key];
          }
        });

        // ตั้งค่า cookie ให้หมดอายุ
        res.setHeader(
          'Set-Cookie',
          serialize(settings.name, '', {
            path: settings.cookie.path || '/',
            httpOnly: true,
            expires: new Date(0),
            maxAge: 0,
          })
        );

        if (callback) callback();
      } catch (err) {
        console.error('Error in session.destroy():', err);
        if (callback) callback(err);
      }
    };

    // เมธอดสำหรับสร้าง session ใหม่
    req.session.regenerate = (callback) => {
      req.session.destroy(() => {
        req.session = {};
        req.session.save = req.session.save;
        req.session.destroy = req.session.destroy;
        req.session.regenerate = req.session.regenerate;

        if (callback) callback();
      });
    };

    // บันทึก session อัตโนมัติก่อนส่ง response
    const originalEnd = res.end;
    res.end = function (chunk, encoding) {
      // บันทึก session ก่อนสิ้นสุด response เฉพาะเมื่อ headers ยังไม่ถูกส่ง
      try {
        if (
          !res.headersSent &&
          req.session &&
          Object.keys(req.session).length > 0
        ) {
          req.session.save();
        }
      } catch (err) {
        console.error('Error saving session before ending response:', err);
      }

      // เรียกใช้ res.end เดิม
      return originalEnd.apply(this, arguments);
    };

    console.log('Created session with ID:', sessionId); // เพิ่มการ logging ในส่วนที่เกี่ยวข้องกับ session

    next();
  };
};

module.exports = customSession;
