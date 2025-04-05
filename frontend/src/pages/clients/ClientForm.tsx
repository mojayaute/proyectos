import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { clientsService } from '../../services/api';
import { ClientFormData } from '../../interfaces/models';
import './ClientsPage.css';

interface ClientFormProps {
  isEditing?: boolean;
}

export const ClientForm: React.FC<ClientFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<ClientFormData>({
    nombre: '',
    correo: '',
    telefono: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing && id) {
      fetchClient(parseInt(id));
    }
  }, [isEditing, id]);

  const fetchClient = async (clientId: number) => {
    try {
      setLoading(true);
      const client = await clientsService.getById(clientId);
      setFormData({
        nombre: client.nombre,
        correo: client.correo,
        telefono: client.telefono,
      });
    } catch (err) {
      setError('Error al cargar los datos del cliente');
      console.error('Error fetching client:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        await clientsService.update(parseInt(id), formData);
      } else {
        await clientsService.create(formData);
      }

      navigate('/clients');
    } catch (err) {
      setError(`Error al ${isEditing ? 'actualizar' : 'crear'} el cliente`);
      console.error(`Error ${isEditing ? 'updating' : 'creating'} client:`, err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="loading">Cargando datos del cliente...</div>;
  }

  return (
    <div className="client-form-container">
      <h2>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit} className="client-form">
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
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
          <label htmlFor="correo">Email</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/clients')} className="button-cancel">
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="button-primary">
            {loading
              ? isEditing
                ? 'Actualizando...'
                : 'Creando...'
              : isEditing
              ? 'Actualizar Cliente'
              : 'Crear Cliente'}
          </button>
        </div>
      </form>
    </div>
  );
}; 