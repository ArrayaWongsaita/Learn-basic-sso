// ไฟล์นี้ใช้เก็บ token ที่ถูก revoke และทำให้สามารถเข้าถึงได้จากทุกที่ในแอป

// ใช้ Set เพื่อเก็บ token ที่ถูกเพิกถอนแล้ว
const revokedTokens = new Set();

// เวลาหมดอายุของ token ใน blacklist (30 นาที)
const EXPIRATION_TIME = 30 * 60 * 1000;

// Map เพื่อเก็บเวลาที่ token จะหมดอายุ
const tokenExpirations = new Map();

// เพิ่ม token เข้า blacklist
const revokeToken = (token) => {
  console.log(`Token added to blacklist: ${token.substring(0, 20)}...`);
  revokedTokens.add(token);

  // ตั้งเวลาลบ token จาก blacklist
  tokenExpirations.set(token, Date.now() + EXPIRATION_TIME);

  // ตั้งเวลาเพื่อล้าง token ที่หมดอายุ
  setTimeout(() => {
    if (revokedTokens.has(token)) {
      console.log(
        `Removing expired token from blacklist: ${token.substring(0, 20)}...`
      );
      revokedTokens.delete(token);
      tokenExpirations.delete(token);
    }
  }, EXPIRATION_TIME);
};

// ตรวจสอบว่า token อยู่ใน blacklist หรือไม่
const isTokenRevoked = (token) => {
  return revokedTokens.has(token);
};

// เริ่มการทำงานของ timer เพื่อล้าง token ที่หมดอายุ
setInterval(() => {
  const now = Date.now();
  for (const [token, expiry] of tokenExpirations.entries()) {
    if (now >= expiry) {
      console.log(`Cleaning up expired token: ${token.substring(0, 20)}...`);
      revokedTokens.delete(token);
      tokenExpirations.delete(token);
    }
  }
}, 5 * 60 * 1000); // ตรวจสอบทุก 5 นาที

module.exports = {
  revokeToken,
  isTokenRevoked,
};
