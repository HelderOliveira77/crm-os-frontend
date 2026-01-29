import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000';

function UsersManagement() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Se não for Admin, mostre uma mensagem de erro ou redirecione
  if (user?.role !== 'Admin') {
    return <div style={{ padding: '20px' }}>Acesso Negado. Apenas administradores podem ver esta página.</div>;
  }

  // Carregar lista de utilizadores
  useEffect(() => {
    fetch(`${API_URL}/api/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Falha na resposta do servidor');
        return res.json();
      })
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar utilizadores:", err);
        setLoading(false); // Para parar o "A carregar..." mesmo com erro
      });
  }, [token]);

  // Função para mudar a Role
  const handleRoleChange = async (userId, newRole) => {
    try {
      const response = await fetch(`${API_URL}/api/users/update-role/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole }) // Certifique-se que o corpo é um JSON
      });
  
      if (response.ok) {
        // Esta linha é que faz o dropdown "mudar" visualmente após o clique
        setUsers(prevUsers => prevUsers.map(u => u.id === userId ? { ...u, role: newRole } : u));
        alert("Permissão atualizada com sucesso!");
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível ligar ao servidor.");
    }
  };

  if (loading) return <p>A carregar utilizadores...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestão de Utilizadores</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Função Atual</th>
            <th style={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.email}</td>
              <td style={styles.td}>
                <span style={styles.badge}>{u.role}</span>
              </td>
              <td style={styles.td}>
                <select 
                  value={u.role} 
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  style={styles.select}
                >
                  <option value="Admin">Admin</option>
                  <option value="Technician">Technician</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  td: { padding: '12px' },
  select: { padding: '5px', borderRadius: '4px' },
  badge: { 
    padding: '3px 8px', 
    backgroundColor: '#34495e', 
    color: 'white', 
    borderRadius: '10px', 
    fontSize: '0.8em' 
  }
};

export default UsersManagement;