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
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Descrição</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data Abertura</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data Recepção</th> 
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Orçamento</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Formato</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Cores Miolo</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Cores Capa</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>N.º Páginas</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Lombada</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Observações Gerais</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Impressão</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Máquina</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Papel (Miolo)</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Gramagem (Miolo)</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Bobine (cm) Miolo</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Papel (Capa)</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Gramagem (Capa)</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Bobine (cm) Capa</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Tiragem</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>N.º Provas de Cor</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>N.º Ozalide Digital </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>N.º Provas Konica </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>N.º de Chapas </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Capa (Sim/Não) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Capa (Brilho/Mate) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Capa (Geral/Reservado) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Capa (Frente/Verso) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Observações da Capa</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Miolo (Sim/Não) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Miolo (Brilho/Mate) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Verniz Miolo (Geral/Reservado) </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Acabamento</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Observações do Miolo</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Local Entrega</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Forma Expedição</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Operador</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Tempo/Operador</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Estado</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data de Criação</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Data de Atualização</th>

            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapeia os dados reais obtidos da API */}
          {ordensServico.map(os => (
           <tr key={os.id}>
           <td style={{ border: '1px solid #ddd', padding: '8px' }}>{os.id}</td>
           
           {/* Tenta ler com sublinhado ou camelCase */}
           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.num_o_s || os.numOS || 'N/A'}
           </td>
           
           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.cliente || os.Client?.name || 'N/A'}
           </td>
           
           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.desc_trab || os.descTrab || 'Desconhecido'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.data_aber || os.dataAber || (os.createdAt ? new Date(os.createdAt).toLocaleDateString() : 'N/D')}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.data_recep || os.dataRecep || (os.createdAt ? new Date(os.createdAt).toLocaleDateString() : 'N/D')}
           </td> 

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.num_orc || os.numOrc || 'Desconhecido'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.formato || os.format || '-'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.cores_miolo || os.coresMiolo || '-'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.cores_capa || os.coresCapa || '-'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.num_pag || os.numPag || '-'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.lombada || '-'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.observacoes_gerais || os.observacoesGerais || '-'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.impressao || '-'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.maquina || '-'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.papel_miolo || os.papelMiolo || '-'}
           </td>    

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.miolo_gramas || os.mioloGramas || '-'}
           </td>       

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.bobine_miolo || os.bobineMiolo || '-'}
           </td>                          

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.papel_capa || os.papelCapa || '-'}
           </td>    

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.capa_gramas || os.capaGramas || '-'}
           </td>     

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.bobine_capa || os.bobineCapa || '-'}
           </td>      

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.tiragem || '-'}
           </td>

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.provas_cor || os.provasCor || '-'}
           </td>      

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.ozalide_digital || os.ozalideDigital || '-'}
           </td>      

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.provas_konica || os.provasKonica || '-'}
           </td>                 

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.quantidade_chapas || os.quantidadeChapas || '-'}
           </td>       

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_capa || os.vernizCapa || '-'}
           </td>       

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_capa_brilho_mate || os.vernizCapaBrilhoMate || '-'}
           </td>      

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_capa_geral_reservado || os.vernizCapaGeralReservado || '-'}
           </td>          

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_capa_f_v || os.vernizCapaFV || '-'}
           </td>                                                             

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.observacoes_capa || os.observacoesCapa || '-'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_miolo || os.vernizMiolo || '-'}
           </td>       

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_miolo_brilho_mate || os.vernizMioloBrilhoMate || '-'}
           </td>     

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.verniz_miolo_geral_reservado || os.vernizMioloGeralReservado || '-'}
           </td>        

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.tipo_acabamento_miolo || os.tipoAcabamentoMiolo || '-'}
           </td>       

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.observacoes_miolo || os.observacoesMiolo || '-'}
           </td>   

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.local_entrega || os.localEntrega || '-'}
           </td>    

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.forma_expedicao || os.formaExpedicao || '-'}
           </td>                                                                   

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.operador || '-'}
           </td>    

          <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.tempo_operador || os.tempoOperador || '-'}
           </td>                                                                   

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.estado || os.status || 'Desconhecido'}
           </td>

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.createdAt || (os.createdAt ? new Date(os.createdAt).toLocaleDateString() : 'N/D')}
           </td> 

           <td style={{ border: '1px solid #ddd', padding: '8px' }}>
               {os.updatedAt || (os.createdAt ? new Date(os.createdAt).toLocaleDateString() : 'N/D')}
           </td> 
           
       
       
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