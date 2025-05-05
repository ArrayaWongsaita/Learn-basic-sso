/**
 * ไฟล์จำลองฐานข้อมูลสำหรับระบบ SSO
 */

// ข้อมูลผู้ใช้งานพื้นฐานสำหรับการตรวจสอบสิทธิ์
const users = [
  { id: 1, email: 'test@mail.com', password: '1234' },
  { id: 2, email: 'admin@mail.com', password: '1234' },
  { id: 3, email: 'user@mail.com', password: '1234' },
];

// ข้อมูลรายละเอียดของผู้ใช้งาน
const userDetails = {
  1: {
    firstName: 'ทดสอบ',
    lastName: 'ระบบ',
    role: 'user',
    department: 'IT',
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
    createdAt: '2023-01-15',
  },
  2: {
    firstName: 'แอดมิน',
    lastName: 'ดูแลระบบ',
    role: 'admin',
    department: 'IT Management',
    profilePicture: 'https://randomuser.me/api/portraits/women/1.jpg',
    createdAt: '2022-12-01',
  },
  3: {
    firstName: 'ผู้ใช้',
    lastName: 'ทั่วไป',
    role: 'user',
    department: 'Marketing',
    profilePicture: 'https://randomuser.me/api/portraits/men/2.jpg',
    createdAt: '2023-02-20',
  },
};

// ฟังก์ชันสำหรับค้นหาและรวมข้อมูลผู้ใช้
const getUserById = (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  const details = userDetails[id] || {};
  const { password, ...userWithoutPassword } = user;

  return {
    ...userWithoutPassword,
    ...details,
  };
};

const getUserByEmail = (email) => {
  const user = users.find((u) => u.email === email);
  if (!user) return null;

  return user; // สำหรับการตรวจสอบรหัสผ่าน จำเป็นต้องมี field password
};

// ฟังก์ชันสำหรับตรวจสอบการเข้าสู่ระบบ
const validateCredentials = (email, password) => {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return null;

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = {
  users,
  userDetails,
  getUserById,
  getUserByEmail,
  validateCredentials,
};
