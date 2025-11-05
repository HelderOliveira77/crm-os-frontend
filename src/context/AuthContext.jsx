// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// URL base da sua API (Sem o /auth no final, para ser a base)
const API_URL = 'http://localhost:3000';

// 2. Criar o Provedor do Contexto
const AuthProvider = ({ children }) => {
  // Estado para guardar o Token e o Utilizador
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [user, setUser] = useState(null); // Guardará { username: '...' }
  const [loading, setLoading] = useState(true);

  // Função de LOGOUT (Definida no topo)
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Efeito: Sincroniza o estado de autenticação e define loading
  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      // ATENÇÃO: Se o utilizador recarregar a página, o 'user' continuará a ser 'null'
      // O ideal seria descodificar o token aqui ou ter o nome no localStorage.
      // Por enquanto, confiamos apenas no 'user' definido no LOGIN.
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  }, [token]);


  // Função de LOGIN (CORRIGIDA: Define o user e usa o endpoint correto)
  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
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

        // CORREÇÃO CRÍTICA: DEFINIR O USER AQUI!
        // Assumimos que o Backend Node.js devolve { token: "...", username: "..." }
        // Se não devolver, use o nome que o utilizador digitou:
        setUser({ username: data.username || username, role: data.role }); 
        
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: 'Erro de conexão ao servidor.' };
    }
  };

  // Objeto de valor a ser fornecido
  const value = {
    token,
    isAuthenticated,
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Hook Personalizado para usar o Contexto
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;