import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { projectsService, clientsService } from '../../services/api';
import { Project, ProjectStatus, Client } from '../../interfaces/models';
import './ProjectsPage.css';

export const ProjectsPage: React.FC = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [filter, setFilter] = useState<ProjectStatus | ''>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (clientId) {
      fetchClient(parseInt(clientId));
      fetchProjects(parseInt(clientId), filter as ProjectStatus);
    }
  }, [clientId, filter]);

  const fetchClient = async (id: number) => {
    try {
      const data = await clientsService.getById(id);
      setClient(data);
    } catch (err) {
      setError('Error al cargar la información del cliente');
      console.error('Error fetching client:', err);
    }
  };

  const fetchProjects = async (id: number, status: ProjectStatus) => {
    try {
      setLoading(true);
      const data = await projectsService.getAll(id, status);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proyectos');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (clientId && window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await projectsService.delete(parseInt(clientId), id);
        // Actualizar la lista después de eliminar
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        setError('Error al eliminar el proyecto');
        console.error('Error deleting project:', err);
      }
    }
  };

  const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
      case ProjectStatus.PENDIENTE:
        return 'status-pending';
      case ProjectStatus.EN_PROGRESO:
        return 'status-in-progress';
      case ProjectStatus.COMPLETADO:
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading && !projects.length) {
    return <div className="loading">Cargando proyectos...</div>;
  }

  return (
    <div className="projects-container">
      <div className="projects-header">
        <div>
          <h1>Proyectos de {client?.nombre || 'Cliente'}</h1>
          <p>Administra los proyectos asociados a este cliente.</p>
        </div>
        <Link to={`/clients/${clientId}/projects/new`} className="button-add">
          Nuevo Proyecto
        </Link>
      </div>

      <div className="filters">
        <label htmlFor="status-filter">Filtrar por estado:</label>
        <select
          id="status-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value as ProjectStatus | '')}
        >
          <option value="">Todos</option>
          <option value={ProjectStatus.PENDIENTE}>Pendiente</option>
          <option value={ProjectStatus.EN_PROGRESO}>En Progreso</option>
          <option value={ProjectStatus.COMPLETADO}>Completado</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <p>No hay proyectos para mostrar.</p>
          <Link to={`/clients/${clientId}/projects/new`} className="button-add">
            Crear tu primer proyecto
          </Link>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className={`project-status ${getStatusColor(project.estado)}`}>
                {project.estado}
              </div>
              <h3>{project.nombre}</h3>
              <p className="project-description">{project.descripcion}</p>
              <div className="project-dates">
                <p><strong>Inicio:</strong> {formatDate(project.fecha_inicio)}</p>
                <p><strong>Entrega:</strong> {formatDate(project.fecha_entrega)}</p>
              </div>
              <div className="project-actions">
                <Link to={`/clients/${clientId}/projects/${project.id}/edit`} className="button-edit">
                  Editar
                </Link>
                <button 
                  className="button-delete" 
                  onClick={() => handleDelete(project.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/clients">← Volver a Clientes</Link>
      </div>
    </div>
  );
}; 