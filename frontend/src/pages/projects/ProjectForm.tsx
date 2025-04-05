import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { projectsService, clientsService } from '../../services/api';
import { ProjectFormData, ProjectStatus, Client } from '../../interfaces/models';
import './ProjectsPage.css';

interface ProjectFormProps {
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ isEditing = false }) => {
  const { clientId, id } = useParams<{ clientId: string; id: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: '',
    descripcion: '',
    estado: ProjectStatus.PENDIENTE,
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_entrega: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (clientId) {
      fetchClient(parseInt(clientId));
    }

    if (isEditing && id && clientId) {
      fetchProject(parseInt(clientId), parseInt(id));
    }
  }, [isEditing, id, clientId]);

  const fetchClient = async (clientId: number) => {
    try {
      const client = await clientsService.getById(clientId);
      setClient(client);
    } catch (err) {
      setError('Error al cargar la información del cliente');
      console.error('Error fetching client:', err);
    }
  };

  const fetchProject = async (clientId: number, projectId: number) => {
    try {
      setLoading(true);
      const project = await projectsService.getById(clientId, projectId);
      setFormData({
        nombre: project.nombre,
        descripcion: project.descripcion,
        estado: project.estado,
        fecha_inicio: new Date(project.fecha_inicio).toISOString().split('T')[0],
        fecha_entrega: new Date(project.fecha_entrega).toISOString().split('T')[0],
      });
    } catch (err) {
      setError('Error al cargar los datos del proyecto');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        await projectsService.update(parseInt(clientId), parseInt(id), formData);
      } else {
        await projectsService.create(parseInt(clientId), formData);
      }

      navigate(`/clients/${clientId}/projects`);
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el proyecto`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} project:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del proyecto...</div>;
  }

  return (
    <div className="project-form-container">
      <h2>
        {isEditing 
          ? `Editar Proyecto para ${client?.nombre || 'Cliente'}`
          : `Nuevo Proyecto para ${client?.nombre || 'Cliente'}`
        }
      </h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre del Proyecto</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows={4}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value={ProjectStatus.PENDIENTE}>Pendiente</option>
            <option value={ProjectStatus.EN_PROGRESO}>En Progreso</option>
            <option value={ProjectStatus.COMPLETADO}>Completado</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha_inicio">Fecha de Inicio</label>
            <input
              type="date"
              id="fecha_inicio"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fecha_entrega">Fecha de Entrega</label>
            <input
              type="date"
              id="fecha_entrega"
              name="fecha_entrega"
              value={formData.fecha_entrega}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate(`/clients/${clientId}/projects`)}
            className="button-cancel"
          >
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="button-primary">
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Creando...'
              : isEditing
              ? 'Actualizar Proyecto'
              : 'Crear Proyecto'}
          </button>
        </div>
      </form>
    </div>
  );
}; 