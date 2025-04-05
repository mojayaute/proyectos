import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { PrivateRoute } from './components/PrivateRoute';
import { Header } from './components/Header';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/Dashboard';
import { ClientsPage } from './pages/clients/ClientsPage';
import { ClientForm } from './pages/clients/ClientForm';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ProjectForm } from './pages/projects/ProjectForm';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
      <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rutas protegidas */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              
              {/* Rutas de clientes */}
              <Route path="/clients" element={
                <PrivateRoute>
                  <ClientsPage />
                </PrivateRoute>
              } />
              <Route path="/clients/new" element={
                <PrivateRoute>
                  <ClientForm />
                </PrivateRoute>
              } />
              <Route path="/clients/:id/edit" element={
                <PrivateRoute>
                  <ClientForm isEditing />
                </PrivateRoute>
              } />
              
              {/* Rutas de proyectos */}
              <Route path="/clients/:clientId/projects" element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              } />
              <Route path="/clients/:clientId/projects/new" element={
                <PrivateRoute>
                  <ProjectForm />
                </PrivateRoute>
              } />
              <Route path="/clients/:clientId/projects/:id/edit" element={
                <PrivateRoute>
                  <ProjectForm isEditing />
                </PrivateRoute>
              } />
              
              {/* Redirecciones */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
          </main>
        </div>
    </Router>
    </AuthProvider>
  );
}

export default App;
