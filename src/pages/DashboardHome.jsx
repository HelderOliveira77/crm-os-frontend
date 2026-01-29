import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { Link, useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3000';

function DashboardHome() {
  const { token, user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [ordensServico, setOrdensServico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ESTADOS PARA OS FILTROS
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('TODOS');

// Função para lidar com o erro de sessão
const handleSessionError = () => {
  logout(); // Limpa token e user do localStorage e estado global
  navigate('/'); // Redireciona para a página de login (ou '/' se for o seu caso)
};

  useEffect(() => {
    const fetchOrdensServico = async () => {
      if (authLoading) return;

      if (!token) {
        setLoading(false);
        return; 
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/os`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          throw new Error("Sessão expirada ou sem permissão. Faça login novamente.");
          // onClick={handleLogout} 
        }

        if (!response.ok) {
          throw new Error(`Erro ${response.status}: Falha ao carregar lista.`);
        }

        const data = await response.json();
        setOrdensServico(data);
        setError(null);
        
      } catch (err) {
        console.error("Erro ao buscar OS:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdensServico();
  }, [token, authLoading]);

  // LÓGICA DE FILTRAGEM COMBINADA (Pesquisa + Status)
  const filteredOS = ordensServico.filter(os => {
    // 1. Filtro por Texto (Nº OS ou Cliente)
    const search = searchTerm.toLowerCase();
    const numOS = (os.num_o_s || os.numOS || '').toString().toLowerCase();
    const cliente = (os.cliente || '').toLowerCase();
    // 2. TRATAMENTO DA DATA PARA PESQUISA
    let dataFormatadaParaPesquisa = '';
    if (os.data_aber) {
      // Criamos uma versão da data em PT-PT (DD/MM/AAAA) para o filtro bater certo com o que se vê no ecrã
      dataFormatadaParaPesquisa = new Date(os.data_aber).toLocaleDateString('pt-PT');
    }
    const matchesSearch = numOS.includes(search) || cliente.includes(search) || dataFormatadaParaPesquisa.includes(search);

    // 2. Filtro por Estado
    const matchesStatus = statusFilter === 'TODOS' || os.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Estilos
  const tableHeaderStyle = { border: '1px solid #ddd', padding: '12px 8px', backgroundColor: '#f2f2f2', textAlign: 'left', fontSize: '1em', whiteSpace: 'nowrap' };
  const tableCellStyle = { border: '1px solid #ddd', padding: '8px', fontSize: '1em' };
  const btnActionStyle = { padding: '5px 10px', borderRadius: '4px', textDecoration: 'none', color: 'white', fontWeight: 'bold', fontSize: '0.9em', marginRight: '5px', display: 'inline-block' };
  const searchInputStyle = { padding: '10px', width: '280px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9em', marginRight: '10px' };
  const selectStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9em', marginRight: '15px', backgroundColor: 'white', cursor: 'pointer' };

  if (loading) return <div style={{ padding: '20px' }}>A carregar Ordens de Serviço...</div>;

  // CORREÇÃO NO BLOCO DE ERRO
  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center', color: '#e74c3c' }}>
      <h3>Atenção</h3>
      <p>{error}</p>
      <button 
        onClick={handleSessionError} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#3498db', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Ir para Login
      </button>
    </div>
  );
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ margin: 0 }}>Ordens de Serviço</h2>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* PESQUISA POR TEXTO */}
          <input 
            type="text" 
            placeholder="Pesquisar por Nº OS, Cliente ou Data..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />

          {/* FILTRO POR STATUS */}
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="TODOS">Todas</option>
            <option value="ABERTA">Abertas</option>
            <option value="PENDENTE">Pendentes</option>
            <option value="FECHADO">Fechadas</option>
          </select>

         {/* ALTERAÇÃO: Botão Nova OS visível apenas para Admin e Technician */}
         {(user?.role === 'Admin' || user?.role === 'Technician') && (
            <Link to="/dashboard/os/nova" style={{ ...btnActionStyle, backgroundColor: '#2ecc71', padding: '10px 20px', marginRight: 0 }}>
              + Nova OS
            </Link>
          )}
        </div>
      </div>
      
      <p style={{ color: '#666', fontSize: '1em' }}>
        A mostrar: <strong>{filteredOS.length}</strong> de {ordensServico.length} registos
      </p>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>Nº Ordem</th>
              <th style={tableHeaderStyle}>Cliente</th>
              <th style={tableHeaderStyle}>Descrição</th>
              <th style={tableHeaderStyle}>Data Abertura</th>
              {/* CAMPOS MANTIDOS COMENTADOS PARA USO FUTURO */}
              {/*  <th style={tableHeaderStyle}>Data Recepção</th>
              <th style={tableHeaderStyle}>Orçamento</th>
              <th style={tableHeaderStyle}>Formato</th>
              <th style={tableHeaderStyle}>Cores Miolo</th>
              <th style={tableHeaderStyle}>Cores Capa</th>
              <th style={tableHeaderStyle}>N.º Páginas</th>
              <th style={tableHeaderStyle}>Lombada</th>
              <th style={tableHeaderStyle}>Observações Gerais</th> */}
              {/* <th style={tableHeaderStyle}>Impressão</th>
              <th style={tableHeaderStyle}>Tiragem</th> */}
              <th style={tableHeaderStyle}>Operador</th>
              <th style={tableHeaderStyle}>Estado</th>
              <th style={tableHeaderStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredOS.map(os => (
              <tr key={os.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={tableCellStyle}>{os.num_o_s || os.numOS || 'N/A'}</td>
                <td style={tableCellStyle}>{os.cliente || 'N/A'}</td>
                <td style={tableCellStyle}>{os.desc_trab?.substring(0, 40)}...</td>
                <td style={tableCellStyle}>
                    {os.data_aber ? new Date(os.data_aber).toLocaleDateString('pt-PT') : 'N/A'}
                    </td>

                {/* MAPEAMENTO DOS CAMPOS COMENTADOS */}
                {/* <td style={tableCellStyle}>{os.data_aber}</td>
                <td style={tableCellStyle}>{os.data_recep}</td>
                <td style={tableCellStyle}>{os.num_orc}</td>
                <td style={tableCellStyle}>{os.formato}</td>
                <td style={tableCellStyle}>{os.cores_miolo}</td>
                <td style={tableCellStyle}>{os.cores_capa}</td>
                <td style={tableCellStyle}>{os.num_pag}</td>
                <td style={tableCellStyle}>{os.lombada}</td>
                <td style={tableCellStyle}>{os.observacoes_gerais}</td> */}

                {/* <td style={tableCellStyle}>{os.impressao || '-'}</td>
                <td style={tableCellStyle}>{os.tiragem || '-'}</td> */}
                <td style={tableCellStyle}>{os.operador || '-'}</td>
                <td style={tableCellStyle}>
                  <span style={{ 
                    padding: '3px 8px', borderRadius: '10px', fontSize: '0.75em', fontWeight: 'bold',
                    backgroundColor: os.estado === 'FECHADO' ? '#e74c3c' : os.estado === 'PENDENTE' ? '#f39c12' : '#2ecc71',
                    color: 'white'
                  }}>
                    {os.estado || 'ABERTA'}
                  </span>
                </td>
                <td style={{ ...tableCellStyle, whiteSpace: 'nowrap' }}>
                  <Link to={`/dashboard/os/visualizar/${os.id}`} style={{ ...btnActionStyle, backgroundColor: '#3498db' }}>Ver</Link>
                 {/* ALTERAÇÃO: Botão Editar visível apenas para Admin e Technician */}
                 {(user?.role === 'Admin' || user?.role === 'Technician') && (
                    <Link to={`/dashboard/os/editar/${os.id}`} style={{ ...btnActionStyle, backgroundColor: '#f39c12' }}>Editar</Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardHome;