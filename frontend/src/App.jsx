import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Generator from './pages/Generator';
import Dashboard from './pages/Dashboard';
import PasswordEntry from './pages/PasswordEntry';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/generate" element={
            <ProtectedRoute><Generator /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/qr/:shortId/password" element={<PasswordEntry />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
