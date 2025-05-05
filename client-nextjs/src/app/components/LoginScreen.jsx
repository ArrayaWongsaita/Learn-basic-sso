export default function LoginScreen({ onLogin }) {
  return (
    <div className="p-8 sm:p-12">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto bg-indigo-100 rounded-full p-6 mb-6">
          <svg
            className="w-full h-full text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h1 className="mt-5 text-3xl font-bold text-gray-900 mb-4">
          กรุณาเข้าสู่ระบบ
        </h1>
        <p className="mt-2 text-gray-600 max-w-md mx-auto mb-8">
          คุณจำเป็นต้องเข้าสู่ระบบเพื่อใช้งานแอพพลิเคชัน
          เพียงกดปุ่มด้านล่างเพื่อลงชื่อเข้าใช้ผ่านระบบ SSO
        </p>
        <div className="mt-8">
          <button
            onClick={onLogin}
            className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 transform hover:-translate-y-1 active:translate-y-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .293.293A6.001 6.001 0 0118 8zm-6-6a6 6 0 103.1 11.146l.907-.907a7.999 7.999 0 01-9.185-9.186l-.907.907A6 6 0 0112 2z"
                clipRule="evenodd"
              />
            </svg>
            เข้าสู่ระบบด้วย SSO
          </button>
        </div>
      </div>
    </div>
  );
}
