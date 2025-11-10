// src/pages/Dashboard.jsx (AGORA É UM LAYOUT)

import React from 'react';
// import { Outlet } from 'react-router-dom'; // Para renderizar as sub-rotas
import { Outlet, Link } from 'react-router-dom'; // IMPORTAR OUTLET
import SideBar from '../components/SideBar'; // A nova SideBar

const layoutStyles = {
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
};

const contentStyles = {
  flexGrow: 1,
  padding: '0',
};

const outletWrapperStyles = {
  padding: '0px', // Aplica o espaçamento de 20px em volta do conteúdo
};

function Dashboard() {
  return (
    <div style={layoutStyles}>
      
      <SideBar />
      
      <main style={contentStyles}>
        {/* ENVOLVA O OUTLET NUM DIV COM ESPAÇAMENTO */}
        <div style={outletWrapperStyles}>
             <Outlet /> 
        </div>
        
      </main>
    </div>
  );
}

export default Dashboard;