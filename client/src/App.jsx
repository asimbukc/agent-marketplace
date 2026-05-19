import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import PropertyDetail from './pages/PropertyDetail.jsx';
import Profile from './pages/Profile.jsx';
import Chat from './pages/Chat.jsx';
import PostProperty from './pages/PostProperty.jsx';
import Agents from './pages/Agents.jsx';
import About from './pages/About.jsx';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Auth Route Component (Redirects to home if already logged in)
const AuthRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route 
          path="/auth" 
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          } 
        />
        <Route path="/search" element={<Search />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route path="/agents" element={<Agents />} />
        <Route path="/about" element={<About />} />
        <Route 
          path="/post-property" 
          element={
            <ProtectedRoute>
              <PostProperty />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
