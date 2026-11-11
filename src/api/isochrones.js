import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL,
  timeout: 30000,
});

export async function generateIsochrone(request) {
  const { data } = await api.post('/isochrones', request);
  return data;
}
