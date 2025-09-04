"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [] 
}) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      console.log('ProtectedRoute - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to login');
        // Use replace instead of push to avoid back button issues
        router.replace('/login');
        return;
      }

      if (requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => hasRole(role));
        if (!hasRequiredRole) {
          console.log('No required role, redirecting to unauthorized');
          router.replace('/unauthorized');
          return;
        }
      }
      
      console.log('Access granted');
    }
  }, [isAuthenticated, isLoading, requiredRoles, hasRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
};
