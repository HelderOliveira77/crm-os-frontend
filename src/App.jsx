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
import EditarOS from './pages/EditarOS';
import VisualizarOS from './pages/VisualizarOS';
import Header from './components/Header';
import { Outlet } from 'react-router-dom';


function DashboardLayout() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. O CABEÇALHO (Global) */}
      <Header /> 
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* 2. A BARRA LATERAL (Conforme já tinha) */}
        {/* Aqui você deve colocar o código da sua Sidebar antiga, 
            mas remova apenas o botão de 'Sair' de lá */}
        <aside style={{ width: '250px', backgroundColor: '#ecf0f1', padding: '20px' }}>
            <nav>
                <Link to="/dashboard" style={navStyle}>Ordens de Serviço</Link>
                <Link to="/dashboard/os/nova" style={navStyle}>Nova OS</Link>
                {/* Removido o botão Sair daqui */}
            </nav>
        </aside>

        {/* 3. O CONTEÚDO DAS PÁGINAS */}
        <main style={{ flex: 1, padding: '20px', backgroundColor: '#f4f7f6' }}>
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}

// Estilo simples para os links da sidebar (exemplo)
const navStyle = { display: 'block', padding: '10px', textDecoration: 'none', color: '#2c3e50', fontWeight: 'bold' };

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

            <Route path="os/visualizar/:id" element={<VisualizarOS />} />

            <Route path="os/editar/:id" element={<EditarOS />} />
          </Route>



        </Route>

        {/* Rota 404 */}
        <Route path="*" element={<h1>404 | Página não encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;