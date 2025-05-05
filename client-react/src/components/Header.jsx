import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-content">
        <h2 className="app-title">ระบบ SSO - Client One</h2>
        {user && (
          <div className="user-info">
            {user.firstName ? (
              <span>
                {user.firstName} {user.lastName}
              </span>
            ) : (
              <span>{user.email}</span>
            )}
            <button onClick={logout} className="logout-btn">
              ออกจากระบบ
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
