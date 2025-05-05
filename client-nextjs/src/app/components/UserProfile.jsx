export default function UserProfile({ user }) {
  return (
    <div className="p-8 sm:p-12">
      <div className="text-center">
        <div className="w-20 h-20 bg-indigo-100 rounded-full mx-auto flex items-center justify-center mb-6">
          {user.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="โปรไฟล์ผู้ใช้"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <svg
              className="w-10 h-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : 'ยินดีต้อนรับ'}
        </h1>

        <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto my-4"></div>

        {/* User Details Card */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
          <div className="grid grid-cols-1 gap-3 text-left">
            <div>
              <span className="text-sm font-medium text-gray-500">อีเมล</span>
              <p className="text-indigo-600 font-medium">{user.email}</p>
            </div>

            {user.role && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  ตำแหน่ง
                </span>
                <p>
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                    {user.role}
                  </span>
                </p>
              </div>
            )}

            {user.department && (
              <div>
                <span className="text-sm font-medium text-gray-500">แผนก</span>
                <p className="text-gray-700">{user.department}</p>
              </div>
            )}

            {user.createdAt && (
              <div>
                <span className="text-sm font-medium text-gray-500">
                  เข้าร่วมเมื่อ
                </span>
                <p className="text-gray-700">{user.createdAt}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-indigo-50 p-5 rounded-lg inline-block border-l-4 border-indigo-500 shadow-sm">
          <p className="text-sm text-indigo-700 font-medium flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            คุณสามารถใช้งานระบบได้ทันที
          </p>
        </div>
      </div>
    </div>
  );
}
