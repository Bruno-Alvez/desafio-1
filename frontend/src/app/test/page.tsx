"use client";

import { useAuth } from '@/contexts/AuthContext';

export default function TestPage() {
  const { isAuthenticated, isLoading, user, token } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page - Auth Status</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
        </div>
        
        <div>
          <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'None'}
        </div>
        
        <div>
          <strong>Token:</strong> {token ? 'Present' : 'None'}
        </div>
        
        <div>
          <strong>Token Preview:</strong> {token ? token.substring(0, 50) + '...' : 'None'}
        </div>
      </div>
    </div>
  );
}
