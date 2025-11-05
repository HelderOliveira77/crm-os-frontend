// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Importar Componentes
import Register from './pages/Register';
import Login from './pages/Login'; // Assumindo que você criou o Login.jsx
import ProtectedRoute from './components/ProtectedRoute'; // [NOVO]
import Dashboard from './pages/Dashboard'; // Layout Mestre
import DashboardHome from './pages/DashboardHome'; // Conteúdo do Dashboard
import NovaOS from './pages/NovaOS'; // [NOVA IMPORTAÇÃO]

function App() {
  return (
    <div className="App">
      <Routes>
        
        {/* ROTAS PÚBLICAS */}
        <Route path="/" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        
        {/* ROTAS PROTEGIDAS */}
        <Route element={<ProtectedRoute />}> 
          
          {/* Dashboard como Layout Pai */}
          <Route path="/dashboard" element={<Dashboard />}>
            
           {/* 1. Rota Index: /dashboard (Lista de Ordens de Serviço) */}
           <Route index element={<DashboardHome />} />
            
            {/* 2. Sub-rota: /dashboard/os/nova (Formulário Nova OS) */}
            <Route path="os/nova" element={<NovaOS />} />

          </Route>
        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<h1>404 | Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;