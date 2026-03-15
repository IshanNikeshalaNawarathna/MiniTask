// context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials } from '@/types';
import { loginApi, registerApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('mini-tasks-token');
    const storedUser = localStorage.getItem('mini-tasks-user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await loginApi(credentials);
    // Build a User object from the flat AuthResponse
    const user: User = { id: '', username: res.username, role: res.role };
    localStorage.setItem('mini-tasks-token', res.token);
    localStorage.setItem('mini-tasks-user', JSON.stringify(user));
    setToken(res.token);
    setUser(user);
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    if (credentials.password !== credentials.confirmPassword) {
      throw { response: { data: { message: 'Passwords do not match' }, status: 400 } };
    }
    const res = await registerApi(credentials);
    const user: User = { id: '', username: res.username, role: res.role };
    localStorage.setItem('mini-tasks-token', res.token);
    localStorage.setItem('mini-tasks-user', JSON.stringify(user));
    setToken(res.token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('mini-tasks-token');
    localStorage.removeItem('mini-tasks-user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}