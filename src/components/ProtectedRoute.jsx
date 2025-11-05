// src/components/ProtectedRoute.jsx (CORRIGIDO)

import React, { useEffect } from 'react'; 
import { Outlet, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext';

function ProtectedRoute() { 
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate(); 
  
  // [CORREÇÃO: HOOK DEVE ESTAR AQUI]
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/', { replace: true }); // [A LINHA CRÍTICA]
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Condição de Loading (Pode vir a seguir)
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>A Carregar...</h1>
      </div>
    );
  }

  // O redirecionamento acontece no useEffect. O Outlet renderiza se for isAuthenticated.
  // O 'null' é para quando não está autenticado e o useEffect está a processar o redirecionamento.
  return isAuthenticated ? <Outlet /> : null; 
}

export default ProtectedRoute;