// src/pages/ListaOS.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// URL do endpoint de listagem, deve ser a mesma do NovaOS, mas sem o '/os' se a sua API for RESTful
const API_URL = 'http://localhost:3000/api/os'; 

function ListaOS() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    
    // Determina o nome a mostrar
    // Se o 'user' for um objeto, pode ser 'user.username' ou 'user.name'. Ajuste conforme o seu contexto!
    const userName = user?.username || user?.name || 'Utilizador';   


    // ESTADOS:
    const [orders, setOrders] = useState([]); // Array para guardar as OS
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // FUNÇÃO PARA BUSCAR AS ORDENS DE SERVIÇO (GET)
    // Usamos useCallback para otimizar a função
    const fetchOrders = useCallback(async () => {
        if (!token) {
            setError("Erro de autenticação. Redirecionando para o login...");
            setLoading(false);
            // Redireciona após 1.5s se não houver token
            setTimeout(() => navigate('/'), 1500); 
            return;
        }

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
                // Assumimos que o Backend retorna um array de objetos (e.g., data.orders)
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
    }, [token, navigate]);

    // EFECTO: Executa a função de busca quando o componente é montado
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Dependência: A função de busca (usamos useCallback)

    // FUNÇÃO PARA LIDAR COM O CLIQUE NA LINHA (para edição futura)
    const handleRowClick = (orderId) => {
        // Navega para o componente de edição, passando o ID da OS
        navigate(`/os/editar/${orderId}`);
    };

    // ------------------------------------------------------------------
    // RENDERIZAÇÃO CONDICIONAL
    // ------------------------------------------------------------------

    if (loading) {
        return <div style={{ padding: '20px' }}>A Carregar Ordens de Serviço...</div>;
    }

    if (error) {
        return <div style={{ padding: '20px', color: 'red' }}>Erro: {error}</div>;
    }

    if (orders.length === 0) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Nenhuma Ordem de Serviço encontrada.</p>
                <button onClick={() => navigate('/os/nova')}>Criar Nova OS</button>
            </div>
        );
 
    }

    // ------------------------------------------------------------------
    // RENDERIZAÇÃO DA TABELA
    // ------------------------------------------------------------------






    return (
        <div style={{ padding: '20px' }}>


            {/* NOVO: Identificação do Utilizador */}
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
                        <th style={thStyles}>Nº OS (Título)</th>
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
                            {/* Usamos 'title' porque o Backend armazena o N.º da OS aqui */}
                            <td style={tdStyles}>{order.title}</td> 
                            {/* Usamos 'client' conforme a estrutura da sua tabela */}
                            <td style={tdStyles}>{order.client}</td> 
                            <td style={tdStyles}>{order.status}</td>
                            <td style={tdStyles}>{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td style={tdStyles}>
                                <button onClick={(e) => { e.stopPropagation(); handleRowClick(order.id); }}>
                                    Ver/Editar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Estilos básicos para a tabela (Pode usar um ficheiro CSS ou um framework UI real)
const tableStyles = { width: '100%', borderCollapse: 'collapse' };
const thStyles = { border: '1px solid #ddd', padding: '12px', textAlign: 'left', backgroundColor: '#f2f2f2' };
const tdStyles = { border: '1px solid #ddd', padding: '12px' };
const trStyles = { cursor: 'pointer', transition: 'background-color 0.2s' }; // Estilo para indicar que a linha é clicável


export default ListaOS;
