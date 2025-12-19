import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
});

export const fetchCoffee = () => api.get('/api/coffee');
export const fetchArt = () => api.get('/api/art');
export const fetchWorkshops = () => api.get('/api/workshops');
export const registerWorkshop = (payload) => api.post('/api/workshops/register', payload);
export const submitFranchise = (payload) => api.post('/api/franchise/enquiry', payload);
export const fetchInsights = () => api.get('/api/insights/popular');
export const aiCoffee = (payload) => api.post('/api/ai/coffee', payload);
export const aiArt = (payload) => api.post('/api/ai/art', payload);
export const aiWorkshop = (payload) => api.post('/api/ai/workshop', payload);
export const fetchMenuImages = () => api.get('/api/images');

export default api;


