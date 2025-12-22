// src/pages/DashboardHome.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 

// URL base da sua API
const API_URL = 'http://localhost:3000'; // Assumindo que a API está a correr na porta 3000

function DashboardHome() {
  const { token } = useAuth(); // Obter o token do contexto
  const [ordensServico, setOrdensServico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // A função de fetch deve ser async
    const fetchOrdensServico = async () => {
      if (!token) {
        setLoading(false);
        setError("Erro: Token de autenticação não encontrado.");
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/api/os`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Envia o token para autenticação
            'Authorization': `Bearer ${token}`, 
          },
        });

        if (!response.ok) {
          // Captura erros 401, 403, 404, etc.
          throw new Error(`Erro ${response.status}: Falha ao carregar Ordens de Serviço.`);
        }

        const data = await response.json();
        setOrdensServico(data); // Assume que a API retorna um array de OS
        
      } catch (err) {
        console.error("Erro ao buscar OS:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdensServico();
  }, [token]); // Executa quando o componente monta ou o token muda

  // --- Renderização Condicional ---
  if (loading) {
    return <div>A carregar Ordens de Serviço...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}> {error}</div>;
  }
  
  if (ordensServico.length === 0) {
    return (
        <div style={{ padding: '20px' }}>
            <h2>Ordens de Serviço</h2>
            <p>Não foram encontradas ordens de serviço.</p>
        </div>
    );
  }

  // --- Renderização da Lista ---
  return (
    <div style={{ padding: '20px' }}>
      <h2>Ordens de Serviço</h2>
      <p>Total de OS: {ordensServico.length}</p>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Nº Ordem</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Cliente</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data Abertura</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Formato</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Cores Miolo</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Observações</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeia os dados reais obtidos da API */}
          {ordensServico.map(os => (
            <tr key={os.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.num_o_s}</td>
              {/* Ajuste 'cliente' e 'status' para corresponder aos nomes exatos dos campos da sua API */}
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.cliente || os.Client?.name || 'N/A'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.status || 'Desconhecido'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.data_aber || 'Desconhecido'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.formato || 'Desconhecido'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.cores_miolo || 'Desconhecido'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.observacoes_miolo || 'Desconhecido'}</td>

              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <button>Ver Detalhes</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DashboardHome;