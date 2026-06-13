import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import type { User } from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CreateFormPage from './pages/CreateFormPage';
import FormBuilder from './pages/FormBuilder';
import PublicFormPage from './pages/PublicFormPage';
import FormResponses from './pages/FormResponses';
import ApplicantSuccess from './pages/ApplicantSuccess';
import Navbar from './components/Navbar';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} logout={logout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage setUser={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage setUser={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/create" element={user ? <CreateFormPage /> : <Navigate to="/login" />} />
        <Route path="/form/:id/edit" element={user ? <FormBuilder /> : <Navigate to="/login" />} />
        <Route path="/form/:id/responses" element={user ? <FormResponses /> : <Navigate to="/login" />} />
        <Route path="/apply/:slug" element={<PublicFormPage />} />
        <Route path="/apply/:slug/success" element={<ApplicantSuccess />} />
      </Routes>
    </div>
  );
}

export default App;
