export default function LoginScreen({ onLogin }) {
  return (
    <div className="unauthenticated">
      <div className="login-icon">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1>กรุณาเข้าสู่ระบบ</h1>
      <button onClick={onLogin} className="login-btn">
        เข้าสู่ระบบด้วย SSO
      </button>
      <p className="info">คุณจำเป็นต้องเข้าสู่ระบบเพื่อใช้งานแอพพลิเคชัน</p>
    </div>
  );
}
