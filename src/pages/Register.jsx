import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- ESTILOS (Sincronizados com o Login.jsx) ---
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
    registerCard: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '450px',
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
        marginBottom: '15px',
        textAlign: 'left'
    },
    label: {
        display: 'block',
        marginBottom: '6px',
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
        backgroundColor: '#2ecc71', // Verde para indicar criação/sucesso
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '15px',
        transition: 'background-color 0.2s',
        boxShadow: '0 4px 6px rgba(46, 204, 113, 0.2)'
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

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        alert('Registo feito com sucesso! Pode fazer Login.');
        navigate('/'); 
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      alert('Erro de conexão ao servidor (verifique se o backend está na porta 3000).');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.registerCard}>
        <span style={styles.logo}>CRIAR CONTA</span>
        <p style={styles.subtitle}>Preencha os dados para se registar no sistema</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome de Utilizador</label>
            <input 
              type="text" 
              name="username" 
              style={styles.input}
              placeholder="Ex: joao_silva"
              onChange={handleChange} 
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              name="email" 
              style={styles.input}
              placeholder="nome@empresa.com"
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
              placeholder="Crie uma password segura"
              onChange={handleChange} 
              required 
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#27ae60'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2ecc71'}
          >
            Finalizar Registo
          </button>
        </form>

        <div style={styles.linkContainer}>
          Já tem uma conta? <Link to="/" style={styles.link}>Voltar ao Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;