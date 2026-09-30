import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://gym-be-iota.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * Menambahkan JWT secara otomatis
 * ke setiap request yang membutuhkannya.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartgym_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/*
 * Register user
 */
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data);

  return response.data;
};

/*
 * Login user
 */
export const loginUser = async (data) => {
  const response = await api.post('/auth/login', data);

  return response.data;
};

/*
 * Ambil data user yang sedang login
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');

  return response.data;
};

/*
 * Update profile user
 */
export const updateProfile = async (data) => {
  const response = await api.put('/profile', data);

  return response.data;
};

/*
 * Rekomendasi nutrisi AI
 */
export const recommendMeal = async (data) => {
  const response = await api.post('/ai/recommend-meal', data);

  return response.data;
};

/*
 * Rekomendasi latihan AI
 */
export const recommendWorkout = async (data) => {
  const response = await api.post('/ai/recommend-workout', data);

  return response.data;
};

/*
 * Ambil profile user
 */
export const getProfile = async () => {
  const response = await api.get('/profile');

  return response.data;
};

export default api;
