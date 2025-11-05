// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// 1. Criar o Contexto
const AuthContext = createContext(null);

// URL base da sua API (Sem o /auth no final, para ser a base)
const API_URL = 'http://localhost:3000';

// 2. Criar o Provedor do Contexto
const AuthProvider = ({ children }) => {
  // ATENÇÃO: Apenas inicializamos com o token e deixamos o useEffect tratar do resto.
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  // user E isAuthenticated começas como null/false. O useEffect é quem manda.
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); // Mantém-se true até o useEffect correr

  // Função de LOGOUT
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername'); 
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  // Efeito: LIDA COM A PERSISTÊNCIA NA RECARGA (Corre apenas uma vez na montagem)
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('authUsername');
    
    if (storedToken) {
        setIsAuthenticated(true);
        // O token já está no estado, garantimos que o nome também está.
        if (storedUsername) {
            setUser({ username: storedUsername });
        }
    } else {
        setIsAuthenticated(false);
        setUser(null);
    }

    setLoading(false); // SÓ DESLIGAMOS O LOADING DEPOIS DE TODA A VERIFICAÇÃO.

  }, [token]); // Só re-corre se o token mudar


  // Função de LOGIN (Corrigida e limpa)
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
        const loggedInUsername = data.user ? data.user.username : username;
        const loggedInRole = data.user ? data.user.role : 'Utilizador';
        
        // Ações CRÍTICAS: Guardar no localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUsername', loggedInUsername); 

        // Atualizar o estado (isto despoleta o useEffect)
        setToken(data.token);
        setUser({ username: loggedInUsername, role: loggedInRole });
        setIsAuthenticated(true); // Pode ser definido aqui para ser mais rápido

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