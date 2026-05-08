import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar/Navbar';
import Splash from './pages/Splash';
import { LoginPage, RegisterPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Timetable from './pages/Timetable';
import Courses from './pages/Courses';
import Profile from './pages/Profile';
import './styles/globals.css';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0d1a2e',
              color: '#dde4ee',
              border: '1px solid rgba(255,255,255,0.09)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0d1a2e' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0d1a2e' } },
          }}
        />
        <Routes>
          <Route path="/"         element={<Splash />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/timetable" element={
            <ProtectedRoute>
              <Layout><Timetable /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <Layout><Courses /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><Profile /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
