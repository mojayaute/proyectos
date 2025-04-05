import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-welcome">
        <h1>Bienvenido al Sistema de Gestión de Proyectos</h1>
        <p>Gestiona tus clientes y proyectos de manera eficiente.</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>Clientes</h2>
          <p>Administra tus clientes, agrega nuevos y edita la información existente.</p>
          <Link to="/clients" className="dashboard-button">
            Ver Clientes
          </Link>
        </div>

        <div className="dashboard-card">
          <h2>Mi Perfil</h2>
          <p>Gestiona tu información personal y de acceso.</p>
          <p className="email">{user?.email}</p>
          <Link to="/profile" className="dashboard-button">
            Ir a Mi Perfil
          </Link>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>© {new Date().getFullYear()} Sistema de Gestión de Proyectos. Todos los derechos reservados.</p>
      </div>
    </div>
  );
}; 