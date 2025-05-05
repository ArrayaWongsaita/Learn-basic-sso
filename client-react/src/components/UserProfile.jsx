export default function UserProfile({ user }) {
  return (
    <div className="authenticated">
      <h1>ยินดีต้อนรับเข้าสู่ระบบ</h1>
      <div className="divider"></div>

      <div className="user-profile">
        {user.profilePicture && (
          <div className="profile-picture">
            <img src={user.profilePicture} alt="โปรไฟล์ผู้ใช้" />
          </div>
        )}

        <div className="user-details">
          <p className="user-name">
            {user.firstName && user.lastName ? (
              <>
                <strong>
                  {user.firstName} {user.lastName}
                </strong>
              </>
            ) : (
              <strong>{user.email}</strong>
            )}
          </p>

          <p className="user-email">อีเมล: {user.email}</p>

          {user.role && (
            <p className="user-role">
              ตำแหน่ง: <span className="role-badge">{user.role}</span>
            </p>
          )}

          {user.department && (
            <p className="user-department">แผนก: {user.department}</p>
          )}

          {user.createdAt && (
            <p className="user-created">วันที่สร้างบัญชี: {user.createdAt}</p>
          )}
        </div>
      </div>

      <div className="info-box">
        <p>คุณสามารถใช้งานระบบได้อย่างเต็มรูปแบบ</p>
      </div>
    </div>
  );
}
