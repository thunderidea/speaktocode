import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthScreen from './components/Auth/AuthScreen';
import EditorScreen from './components/Editor/EditorScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EditorProvider } from './context/EditorContext';
import { VoiceProvider } from './context/VoiceContext';
import './App.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  return !user ? children : <Navigate to="/editor" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <EditorProvider>
          <VoiceProvider>
            <Routes>
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <AuthScreen />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/editor" 
                element={
                  <PrivateRoute>
                    <EditorScreen />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </VoiceProvider>
        </EditorProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
