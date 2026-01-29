// src/components/Header.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redireciona para o login
  };

  // src/components/Header.jsx (Resumo do estilo ideal)
const headerStyle = {
    height: '60px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: '0 30px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0'
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      height: '60px',
      backgroundColor: '#f4f7f6',
      color: 'white'
    }}>
      <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: 'black' }}>
      {user && (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: '1.2' }}>
      <span style={{ fontSize: '0.95em', fontWeight: 'bold' }}>Olá, {user.username}</span>
      <span style={{ fontSize: '0.8em', color: '#7f8c8d' }}>{user.email}</span>
    </div>
  )}
        
        <button 
          onClick={handleLogout} 
          style={{ 
            backgroundColor: '#2c3e50', 
            color: 'white', 
            border: 'none', 
            padding: '8px 15px', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            marginLeft: '20px',
          }}
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;