import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getMe } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('umt_token');
    const saved  = localStorage.getItem('umt_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      // Re-validate token
      getMe()
        .then(({ data }) => { setUser(data.user); localStorage.setItem('umt_user', JSON.stringify(data.user)); })
        .catch(() => { localStorage.removeItem('umt_token'); localStorage.removeItem('umt_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const { data } = await apiLogin(credentials);
    localStorage.setItem('umt_token', data.token);
    localStorage.setItem('umt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (credentials) => {
    const { data } = await apiRegister(credentials);
    localStorage.setItem('umt_token', data.token);
    localStorage.setItem('umt_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('umt_token');
    localStorage.removeItem('umt_user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('umt_user', JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
