import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = async (data) => {
  const response = await api.post('/register', data);

  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post('/login', data);

  return response.data;
};

export default api;
