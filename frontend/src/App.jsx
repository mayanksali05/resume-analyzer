import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import UploadStudentPage from './pages/UploadStudentPage';
import JobCreationPage from './pages/JobCreationPage';
import RankingPage from './pages/RankingPage';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) return <Navigate to="/login" />;
  return children;
};

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {!isLoginPage && <Navbar />}
      <main className={`flex-1 ${!isLoginPage ? 'ml-64 p-10' : ''}`}>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/upload-student" element={<ProtectedRoute><UploadStudentPage /></ProtectedRoute>} />
          <Route path="/create-job" element={<ProtectedRoute><JobCreationPage /></ProtectedRoute>} />
          <Route path="/ranking" element={<ProtectedRoute><RankingPage /></ProtectedRoute>} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
