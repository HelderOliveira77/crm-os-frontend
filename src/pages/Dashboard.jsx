// src/pages/Dashboard.jsx (LAYOUT)

import React from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../components/SideBar';
import Header from '../components/Header'; // Importamos o novo Header

const layoutStyles = {
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '#f4f7f6', // Cor de fundo suave para a área de conteúdo
};

const contentStyles = {
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column', // Empilha o Header e o Conteúdo verticalmente
};

const outletWrapperStyles = {
  padding: '20px', // Espaçamento interno para as páginas (Home, Nova OS, etc.)
  flexGrow: 1,
};

function Dashboard() {
  return (
    <div style={layoutStyles}>
      
      {/* A sua Sidebar original com o logotipo mantém-se intacta */}
      <SideBar />
      
      <main style={contentStyles}>
        {/* Adicionamos o Header aqui no topo da área de conteúdo */}
        <Header /> 
        
        <div style={outletWrapperStyles}>
             {/* O conteúdo das páginas aparecerá logo abaixo do Header */}
             <Outlet /> 
        </div>
      </main>
    </div>
  );
}

export default Dashboard;