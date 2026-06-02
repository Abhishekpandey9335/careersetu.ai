import api from './api';

/**
 * POST /auth/register
 * body: { name, email, password, phone? }
 * returns: ApiResponse<AuthResponse>
 */
export const register = (payload) => api.post('/auth/register', payload);

/**
 * POST /auth/login
 * body: { email, password }
 * returns: ApiResponse<AuthResponse>
 */
export const login = (payload) => api.post('/auth/login', payload);

/**
 * POST /auth/refresh
 * header: X-Refresh-Token
 * returns: ApiResponse<AuthResponse>
 */
export const refresh = (refreshToken) =>
  api.post('/auth/refresh', null, { headers: { 'X-Refresh-Token': refreshToken } });
