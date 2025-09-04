"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { keycloak, initKeycloak, login, logout, isAuthenticated, getUserInfo, hasRole } from '@/lib/keycloak';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        console.log('Starting auth initialization...');

        const authenticated = await initKeycloak();

        console.log('Keycloak initialized, authenticated:', authenticated);
        console.log('Keycloak token:', keycloak.token);
        console.log('Keycloak authenticated:', keycloak.authenticated);

        setIsAuthenticated(!!authenticated && !!keycloak.token && !!keycloak.authenticated);

        if (authenticated) {
          const userInfo = getUserInfo();
          console.log('User info:', userInfo);
          if (userInfo) {
            setUser(userInfo);
          }
          setToken(keycloak.token || null);

          // Set up token refresh
          keycloak.onTokenExpired = () => {
            keycloak.updateToken(30)
              .then((refreshed) => {
                if (refreshed) {
                  setToken(keycloak.token || null);
                  console.log('Token refreshed');
                } else {
                  console.log('Token not refreshed');
                }
              })
              .catch(() => {
                console.log('Failed to refresh token');
                setIsAuthenticated(false);
                setUser(null);
                setToken(null);
              });
          };
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      } finally {
        console.log('Auth initialization complete, setting loading to false');
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const checkRole = (role: string) => {
    return hasRole(role);
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login: handleLogin,
    logout: handleLogout,
    hasRole: checkRole,
    token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
