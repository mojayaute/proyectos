import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', response.data.access_token);
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export const clientsService = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },
  create: async (client: any) => {
    const response = await api.post('/clients', client);
    return response.data;
  },
  update: async (id: number, client: any) => {
    const response = await api.patch(`/clients/${id}`, client);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  }
};

export const projectsService = {
  getAll: async (clientId: number, status?: string) => {
    const params = status ? { status } : {};
    const response = await api.get(`/clients/${clientId}/projects`, { params });
    return response.data;
  },
  getById: async (clientId: number, id: number) => {
    const response = await api.get(`/clients/${clientId}/projects/${id}`);
    return response.data;
  },
  create: async (clientId: number, project: any) => {
    const response = await api.post(`/clients/${clientId}/projects`, project);
    return response.data;
  },
  update: async (clientId: number, id: number, project: any) => {
    const response = await api.patch(`/clients/${clientId}/projects/${id}`, project);
    return response.data;
  },
  delete: async (clientId: number, id: number) => {
    const response = await api.delete(`/clients/${clientId}/projects/${id}`);
    return response.data;
  }
};
