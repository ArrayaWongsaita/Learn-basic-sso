import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import MainContent from './components/MainContent';

// Root component that provides auth context
function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}

export default App;
