// src/pages/NovaOS.jsx (IMPLEMENTAÇÃO COMPLETA E REVISADA)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para obter o token

// Nota: Certifique-se de que a API_URL está correta (o seu backend é 3000/api/os)
const API_URL = 'http://localhost:3000'; 
// O endpoint completo será: http://localhost:3000/api/os

function NovaOS() {
  const { token } = useAuth();
  const navigate = useNavigate();

  // 1. ESTADO INICIAL
  const [formData, setFormData] = useState({
    // Os três campos pedidos (os nomes devem corresponder ao seu Backend)
    numeroOS: '',       // Campo numérico obrigatório
    client_name: '',    // Nome do Cliente (texto)
    description: '',    // Descrição (texto grande)
    status: 'Pendente'  // Campo default
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // FUNÇÃO HANDLE CHANGE
  const handleChange = (e) => {
    // Trata valores de número como número, se for o campo 'numeroOS'
    const value = e.target.name === 'numeroOS' ? Number(e.target.value) : e.target.value;
    
    setFormData({ 
        ...formData, 
        [e.target.name]: value 
    });
  };

  // FUNÇÃO HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!token) {
        setMessage('❌ Erro: Utilizador não autenticado. A ser redirecionado...');
        setLoading(false);
        // Redireciona para login
        setTimeout(() => navigate('/login'), 1000); 
        return;
    }
    
    try {
      // ⚠️ ATENÇÃO: Confirme que este é o seu endpoint exato: /api/os
      const response = await fetch(`${API_URL}/api/os`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // ENVIAR O TOKEN
        },
        // Envia o estado do formulário como JSON
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('✅ Ordem de Serviço criada com sucesso! Redirecionando...');
        
        // Limpa o formulário após sucesso (opcional)
        setFormData({ numeroOS: '', client_name: '', description: '', status: 'Pendente' }); 
        
        // Redirecionar para a lista de Ordens de Serviço após 1 segundo
        setTimeout(() => {
            navigate('/dashboard', { replace: true });
        }, 1500);
        
      } else {
        const errorData = await response.json();
        setMessage(`❌ Erro ao criar OS: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      setMessage('❌ Erro de conexão com o servidor. Verifique se o backend está a correr.');
    } finally {
      setLoading(false);
    }
  }; 

  return (
    <div style={{ padding: '20px' }}>
      <h2>Nova Ordem de Serviço</h2>
      
      {message && <p style={{ color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        
        {/* CAMPO 1: N.º Ordem de Serviço (Inteiro e Obrigatório) */}
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>N.º Ordem de Serviço:</label>
            <input 
                type="number" 
                name="numeroOS" 
                value={formData.numeroOS} 
                onChange={handleChange} 
                required 
                min="1" // Garante número positivo
                disabled={loading}
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        
        {/* CAMPO 2: Cliente (Texto e Obrigatório) */}
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Cliente (Nome Completo):</label>
            <input 
                type="text" 
                name="client_name"
                value={formData.client_name} 
                onChange={handleChange} 
                required 
                disabled={loading}
                style={{ width: '100%', padding: '8px' }}
            />
        </div>
        
        {/* CAMPO 3: Descrição (Área de Texto e Obrigatório) */}
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Descrição do Serviço:</label>
            <textarea 
                name="description" 
                rows="4"
                value={formData.description} 
                onChange={handleChange} 
                required 
                disabled={loading}
                style={{ width: '100%', padding: '8px' }}
            ></textarea>
        </div>
        
        {/* ... Se for necessário, pode adicionar um campo 'status' aqui ... */}
        
        <button 
            type="submit" 
            disabled={loading}
            style={{ 
                padding: '10px 15px', 
                backgroundColor: loading ? '#ccc' : '#2ecc71', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer',
                transition: 'background-color 0.3s'
            }}
        >
          {loading ? 'A Submeter...' : 'Salvar Ordem'}
        </button>
      </form>
      
      <p style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/dashboard')}>
            ← Voltar para a Lista de Ordens de Serviço
        </button>
      </p>
    </div>
  );
}

export default NovaOS;