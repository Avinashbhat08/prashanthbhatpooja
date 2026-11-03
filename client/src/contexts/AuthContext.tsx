import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (details: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('pooja_token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const { user } = await api.getMe();
          setUser(user);
        } catch (error) {
          console.warn('Session expired or invalid:', error);
          localStorage.removeItem('pooja_token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (credentials: { email: string; password: string }) => {
    const response = await api.login(credentials);
    localStorage.setItem('pooja_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (details: { name: string; email: string; password: string }) => {
    const response = await api.register(details);
    localStorage.setItem('pooja_token', response.token);
    setToken(response.token);
    setUser(response.user);
  };

  const logout = () => {
    api.logout().catch(() => {});
    localStorage.removeItem('pooja_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'ADMIN',
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

