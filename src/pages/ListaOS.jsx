// src/pages/ListaOS.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// URL do endpoint de listagem
const API_URL = 'http://localhost:3000/api/os'; 

// Estilos básicos para a tabela (Pode ser movido para um arquivo CSS)
const tableStyles = { width: '100%', borderCollapse: 'collapse' };
const thStyles = { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' };
const tdStyles = { border: '1px solid #ddd', padding: '12px' };
const trStyles = { cursor: 'pointer', transition: 'background-color 0.2s' }; // Estilo para indicar que a linha é clicável


function ListaOS() {
    // Usamos 'authLoading' para não conflitar com o 'loading' das ordens de serviço
    const { token, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // Determina o nome a mostrar
    // Este código TEM de estar no início, antes de qualquer 'return'.
    const userName = user?.username || 'Utilizador';   

    // ESTADOS:
    const [orders, setOrders] = useState([]); // Array para guardar as OS
    const [loading, setLoading] = useState(true); // Loading da lista de OS
    const [error, setError] = useState(null);

    // FUNÇÃO PARA BUSCAR AS ORDENS DE SERVIÇO (GET)
    const fetchOrders = useCallback(async () => {
        // Não precisamos de verificar o token aqui, o useEffect faz isso
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data); 
            } else {
                const errorData = await response.json();
                setError(`Erro ao carregar OS: ${errorData.message || response.statusText}`);
            }
        } catch (err) {
            console.error("Erro de rede ao buscar OS:", err);
            setError('Erro de conexão com o servidor. Verifique o Backend.');
        } finally {
            setLoading(false);
        }
    }, [token]); // Dependência: token

    // EFECTO: Executa a função de busca
    useEffect(() => {
        // Só tenta buscar as ordens se o AuthContext tiver terminado e houver token
        if (!authLoading && token) {
            fetchOrders();
        } 
        // Se não houver token depois de carregar, redireciona.
        if (!authLoading && !token) {
            navigate('/');
        }
    }, [authLoading, token, fetchOrders, navigate]); 

    // FUNÇÃO PARA LIDAR COM O CLIQUE NA LINHA (para edição futura)
    const handleRowClick = (orderId) => {
        navigate(`/os/editar/${orderId}`);
    };

    // ------------------------------------------------------------------
    // RENDERIZAÇÃO CONDICIONAL
    // ------------------------------------------------------------------

    // 1. Espera pelo loading da autenticação
    if (authLoading) {
        return <div style={{ padding: '20px' }}>A Carregar Autenticação...</div>;
    }

    // 2. Espera pelo loading da lista de OS
    if (loading) {
        return <div style={{ padding: '20px' }}>A Carregar Ordens de Serviço...</div>;
    }

    // 3. Exibe erros de carregamento de dados
    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Erro: {error}</div>;
    }

    // 4. Exibe lista vazia
    if (orders.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                {/* SAUDAÇÃO é repetida aqui para aparecer mesmo com lista vazia */}
                <Saudacao userName={userName} /> 
                <p>Nenhuma Ordem de Serviço encontrada.</p>
                <button 
                    onClick={() => navigate('/os/nova')}
                    style={{ padding: '10px' }}
                >
                    Criar Nova OS
                </button>
            </div>
        );
    }

    // ------------------------------------------------------------------
    // RENDERIZAÇÃO DA TABELA
    // ------------------------------------------------------------------

    return (
        <div style={{ padding: '20px' }}>

            <Saudacao userName={userName} />
            
            <h2>Lista de Ordens de Serviço ({orders.length})</h2>
            <button 
                onClick={() => navigate('/os/nova')} 
                style={{ marginBottom: '15px', padding: '10px' }}
            >
                + Nova Ordem de Serviço
            </button>

            <table style={tableStyles}>
                <thead>
                    <tr>
                        <th style={thStyles}>ID</th>
                        <th style={thStyles}>Nº OS (Ordem Serviço)</th>
                        <th style={thStyles}>Cliente</th>
                        <th style={thStyles}>Status</th>
                        <th style={thStyles}>Criado Em</th>
                        <th style={thStyles}>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr 
                            key={order.id} 
                            onClick={() => handleRowClick(order.id)}
                            style={trStyles}
                        >
                            <td style={tdStyles}>{order.id}</td>
                            <td style={tdStyles}>{order.num_o_s}</td> 
                            <td style={tdStyles}>{order.cliente}</td> 
                            <td style={tdStyles}>{order.estado}</td>
                            <td style={tdStyles}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={tdStyles}>
                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(order.id); }}>
                                    Ver/Editar
                                </button>
                            </td>
                            <td style={tdStyles}>{order.formato}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Componente separado para a Saudação (para organização)
const Saudacao = ({ userName }) => (
    <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#ecf0f1', 
        borderLeft: '4px solid #3498db'
    }}>
        <p style={{ margin: 0, fontSize: '1.1em' }}>
            Bem-vindo(a), **{userName}**!
        </p>
    </div>
);


export default ListaOS;