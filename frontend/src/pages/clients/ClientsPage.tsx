import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientsService } from '../../services/api';
import { Client } from '../../interfaces/models';
import './ClientsPage.css';

export const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los clientes');
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientsService.delete(id);
        // Actualizar la lista después de eliminar
        setClients(clients.filter(client => client.id !== id));
      } catch (err) {
        setError('Error al eliminar el cliente');
        console.error('Error deleting client:', err);
      }
    }
  };

  if (loading) {
    return <div className="loading">Cargando clientes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1>Clientes</h1>
        <Link to="/clients/new" className="button-add">
          Agregar Cliente
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <p>No hay clientes registrados.</p>
          <Link to="/clients/new" className="button-add">
            Agregar tu primer cliente
          </Link>
        </div>
      ) : (
        <div className="clients-grid">
          {clients.map((client) => (
            <div key={client.id} className="client-card">
              <h3>{client.nombre}</h3>
              <p><strong>Email:</strong> {client.correo}</p>
              <p><strong>Teléfono:</strong> {client.telefono}</p>
              <div className="client-actions">
                <Link to={`/clients/${client.id}/projects`} className="button-secondary">
                  Ver Proyectos
                </Link>
                <Link to={`/clients/${client.id}/edit`} className="button-edit">
                  Editar
                </Link>
                <button 
                  className="button-delete" 
                  onClick={() => handleDelete(client.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 