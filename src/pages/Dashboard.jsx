// src/pages/Dashboard.jsx (AGORA É UM LAYOUT)

import React from 'react';
import { Outlet } from 'react-router-dom'; // Para renderizar as sub-rotas
import SideBar from '../components/SideBar'; // A nova SideBar

const layoutStyles = {
  display: 'flex',
  minHeight: '100vh',
};

const contentStyles = {
  flexGrow: 1,
  padding: '20px',
};

function Dashboard() {
  // Nota: O logout e navigate foram movidos para a SideBar
  
  return (
    <div style={layoutStyles}>
      
      {/* 1. Barra Lateral */}
      <SideBar />
      
      {/* 2. Conteúdo Principal */}
      <main style={contentStyles}>
        
        {/* O Outlet renderiza o componente da sub-rota ativa (ex: Clientes, OS) */}
        <Outlet /> 
        
      </main>
    </div>
  );
}

export default Dashboard;