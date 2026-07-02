import { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lf_token');
    const stored = localStorage.getItem('lf_user');
    if (token && stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('lf_token');
        localStorage.removeItem('lf_user');
      }
    }
    setLoading(false);
  }, []);

  const signup = async (name, email, password) => {
    const { data } = await client.post('/auth/signup', { name, email, password });
    localStorage.setItem('lf_token', data.token);
    localStorage.setItem('lf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const { data } = await client.post('/auth/login', { email, password });
    localStorage.setItem('lf_token', data.token);
    localStorage.setItem('lf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('lf_token');
    localStorage.removeItem('lf_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
