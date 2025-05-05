'use client';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import Header from './Header';
import UserProfile from './UserProfile';
import LoginScreen from './LoginScreen';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

// Main content component that uses Auth Context
function MainContent() {
  const { user, loading, initiateLogin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
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

// Root component that provides auth context
export default function Auth() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
