import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  // 1. Inicializamos tentando ler 'authToken' (mantenha o nome consistente)
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(
    localStorage.getItem('authUsername') 
      ? { 
          username: localStorage.getItem('authUsername'),
          email: localStorage.getItem('authEmail') 
        } 
      : null
  );
  const [loading, setLoading] = useState(true);

  
  // 2. Sincronização robusta
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('authUsername');
    const storedEmail = localStorage.getItem('authEmail');
    
    if (storedToken) {
        setToken(storedToken);
        setIsAuthenticated(true);
        if (storedUsername) {
            setUser({ username: storedUsername, email: storedEmail });
        }
    } else {
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);
    }
    setLoading(false);
  }, []); // Corre apenas uma vez ao montar o app

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const loggedInUsername = data.user?.username || data.username || username;
        const loggedInEmail = data.user?.email || '';
        
        // GUARDAR NO STORAGE (Essencial para o Refresh)
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUsername', loggedInUsername); 
        localStorage.setItem('authEmail', loggedInEmail); // Guardar no Storage

        // ATUALIZAR ESTADO
        setToken(data.token);
        setUser({ username: loggedInUsername, email: loggedInEmail });
        setIsAuthenticated(true);

        return { success: true };
      } else {
        return { success: false, message: data.message || 'Credenciais inválidas' };
      }
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: 'Erro de conexão ao servidor.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUsername'); 
    localStorage.removeItem('authEmail'); // Remover no logout
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = { token, isAuthenticated, user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;