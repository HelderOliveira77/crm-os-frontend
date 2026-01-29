// src/components/SideBar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Logo from '../assets/logos multiponto Branco.png'; // <-- AJUSTAR ESTE CAMINHO SE NECESSÁRIO


// [Estilos básicos para demonstração - manter para visualização]
const sideBarStyles = {
  width: '350px',
  height: 'auto',
  backgroundColor: '#2c3e50',
  padding: '20px 30px',
  color: 'white',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  textAlign: 'center'
};

const navLinkStyle = ({ isActive }) => ({
  color: isActive ? '#f39c12' : 'white',
  textDecoration: 'none',
  padding: '10px 0',
  display: 'block',
  borderLeft: isActive ? '3px solid #f39c12' : 'none',
  paddingLeft: isActive ? '17px' : '20px',
  fontSize: '1.6rem'
});

const logoStyles = {
  width: '320px', // Ajuste este valor para o tamanho desejado
  height: 'auto',
  marginBottom: '10px' // Espaçamento entre o logo e o título
};

function SideBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={sideBarStyles}>

      {/* 3. ADICIONAR A TAG <img> */}
      <img
        src={Logo}
        alt="Logótipo da Empresa"
        style={logoStyles}
      />


      <h2> GESTÃO <br></br> ORDENS SERVIÇO </h2>
      <hr style={{
        border: 'none',             // Remove a borda padrão para não haver conflito
        borderTop: '1.5px dashed white', // Define a linha superior como tracejada (1.5px de espessura)
        marginBottom: '20px',
        opacity: 0.5                // Opcional: para não ficar um branco tão "agressivo"
      }} />

      <nav>
        {/* O link para o index será a lista de TODAS as OS */}
        <NavLink to="/dashboard" end style={navLinkStyle}>
          Ordens Serviço
        </NavLink>

        {/* [NOVO] Este link levará ao formulário de criação de nova OS */}
        {/* ALTERAÇÃO: Este link só aparece se NÃO for Viewer (ou seja, Admin ou Technician) */}
        {(user?.role === 'Admin' || user?.role === 'Technician') && (
          <NavLink to="os/nova" style={navLinkStyle}>
            Nova Ordem Serviço
          </NavLink>
        )}

        {/* NOVO: Link visível APENAS para Admin */}
        {user?.role === 'Admin' && (
          <NavLink to="users" style={navLinkStyle}>
            Gestão Utilizadores
          </NavLink>
        )}

      </nav>

      {/* <button 
        onClick={handleLogout} 
        style={{ 
          marginTop: '50px', 
          padding: '10px', 
          width: '100%', 
          backgroundColor: '#e74c3c', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer'
        }}
      >
        Sair
      </button> */}
    </div>
  );
}

export default SideBar;