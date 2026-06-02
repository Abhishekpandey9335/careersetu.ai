/**
 * AuthContext — real JWT-based auth
 *
 * Stores in localStorage:
 *   accessToken   — short-lived JWT
 *   refreshToken  — long-lived JWT
 *   user          — { userId, name, email, role, isPremium }
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/authService';

const AuthContext = createContext(null);

function loadUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUserFromStorage);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [authError, setAuthError] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  /** Persist tokens + user from AuthResponse payload */
  const _persist = useCallback((data) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    const userData = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
      isPremium: data.isPremium,
    };
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.accessToken);
    setUser(userData);
    setAuthError(null);
  }, []);

  /** Login with email + password */
  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiLogin({ email, password });
      _persist(res.data);          // res is ApiResponse<AuthResponse>; res.data = AuthResponse
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Login failed. Check your credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  }, [_persist]);

  /** Register new account */
  const registerUser = useCallback(async (payload) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await apiRegister(payload);
      _persist(res.data);
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please try again.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setAuthLoading(false);
    }
  }, [_persist]);

  /** Update user in state/storage after profile change or payment */
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      authError,
      authLoading,
      isLoggedIn: !!token,
      isPremium: user?.isPremium ?? false,
      login,
      registerUser,
      updateUser,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
