import { useAuth } from '../contexts/AuthContext';
import Header from './Header';
import UserProfile from './UserProfile';
import LoginScreen from './LoginScreen';
import Footer from './Footer';

export default function MainContent() {
  const { user, loading, initiateLogin } = useAuth();

  if (loading) {
    return <div className="loading">กำลังโหลด...</div>;
  }

  return (
    <div className="app-container">
      <Header />

      <main className="main-content">
        <div className="content-card">
          {user ? (
            <UserProfile user={user} />
          ) : (
            <LoginScreen onLogin={initiateLogin} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
