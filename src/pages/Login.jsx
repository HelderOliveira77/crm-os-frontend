import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom';

// --- ESTILOS ---
const styles = {
    wrapper: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f7f6',
        fontFamily: 'Inter, system-ui, sans-serif'
    },
    loginCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
    },
    logo: {
        fontSize: '26px',
        fontWeight: 'bold',
        color: '#2c3e50',
        marginBottom: '8px',
        display: 'block',
        letterSpacing: '-0.5px'
    },
    subtitle: {
        color: '#7f8c8d',
        marginBottom: '30px',
        fontSize: '14px'
    },
    inputGroup: {
        marginBottom: '20px',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#34495e',
        fontSize: '14px'
    },
    input: {
        width: '100%',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #dcdde1',
        fontSize: '15px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        outline: 'none'
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px rgba(52, 152, 219, 0.2)'
    },
    linkContainer: {
        marginTop: '25px',
        fontSize: '14px',
        color: '#7f8c8d',
        borderTop: '1px solid #eee',
        paddingTop: '20px'
    },
    link: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: 'bold'
    }
};

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Chamada ao contexto usando username conforme o teu registo
    const result = await login(formData.username, formData.password);

    if (result && result.success) {
      // Login bem-sucedido
      navigate('/dashboard'); 
    } else {
      // Mostra o erro retornado pela API (ex: "Utilizador não encontrado")
      alert(`Erro de Login: ${result?.message || 'Credenciais inválidas'}`);
    }
  }; 

  return (
    <div style={styles.wrapper}>
      <div style={styles.loginCard}>
        <span style={styles.logo}>GESTÃO OS</span>
        <p style={styles.subtitle}>Plataforma de Ordens de Serviço</p>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome de Utilizador</label>
            <input 
              type="text" 
              name="username" 
              style={styles.input}
              placeholder="Introduza o seu nome de utilizador" 
              value={formData.username}
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Palavra-passe</label>
            <input 
              type="password" 
              name="password" 
              style={styles.input}
              placeholder="••••••••" 
              value={formData.password}
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
          >
            Entrar no Sistema
          </button>
        </form>

        <div style={styles.linkContainer}>
          Não tem conta? <Link to="/register" style={styles.link}>Registe-se aqui</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;