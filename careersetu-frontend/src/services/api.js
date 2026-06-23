/**
 * CareerSetu — Central API service
 * Base URL: /api  (proxied to http://localhost:8080/api in dev)
 * All authenticated requests automatically attach JWT from localStorage.
 * On 401/403, token is refreshed (or cleared) and user is redirected to /login.
 */
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor: unwrap `data` field, handle 401/403 ──────────────
api.interceptors.response.use(
  (response) => response.data,   // backend wraps everything in ApiResponse<T>; return whole object
  async (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      // Try refresh token once
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !error.config._retry) {
        error.config._retry = true;
        try {
          const res = await axios.post(`${BASE_URL}/auth/refresh`, null, {
            headers: { 'X-Refresh-Token': refreshToken },
          });
          const { accessToken } = res.data.data;
          localStorage.setItem('accessToken', accessToken);
          error.config.headers.Authorization = `Bearer ${accessToken}`;
          return api(error.config);
        } catch {
          // refresh failed — clear session
        }
      }
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Return a readable error message
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;