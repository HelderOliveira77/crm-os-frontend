// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// URL base da sua API
const API_URL = 'http://localhost:3000/auth';

// 2. Criar o Provedor do Contexto
const AuthProvider = ({ children }) => {
  // Estado para guardar o Token e o Utilizador (opcional)
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null); // Para guardar dados do user (role, username, etc.)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Manter o estado de autenticação sincronizado com o localStorage
    if (token) {
      setIsAuthenticated(true);
      // Opcional: Aqui pode adicionar uma função para decodificar o token JWT 
      // e extrair o username/role, ou fazer um pedido GET /auth/me
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  // Função de LOGIN
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar o token e atualizar o estado
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        // Opcional: Definir dados do user se o backend devolver mais dados
        // setUser({ username, role: data.role }); 
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: 'Erro de conexão ao servidor.' };
    }
  };

  // Função de LOGOUT
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Objeto de valor a ser fornecido
  const value = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    loading, // [NOVO] Incluir loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook Personalizado para usar o Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;