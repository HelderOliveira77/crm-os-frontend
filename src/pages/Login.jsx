// src/pages/Login.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useNavigate } from 'react-router-dom';


// [IMPORTANTE] REMOVA: const navigate = useNavigate();
// O HOOK NÃO PODE ESTAR FORA DA FUNÇÃO!


function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  
  // [CORRETO] HOOKS DEVEM ESTAR SEMPRE AQUI DENTRO DA FUNÇÃO
  const { login } = useAuth(); 
  const navigate = useNavigate(); // [CORRETO] Apenas uma vez dentro da função

  // ... (restante código)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ... (lógica de login) ...
    const result = await login(formData.username, formData.password);

    if (result.success) {
      alert('Login bem-sucedido! Redirecionando...');
      navigate('/dashboard'); 
    } else {
      alert(`Erro de Login: ${result.message}`);
    }
  }; 
  
  // ... (restante código do formulário)
  return (
    <div>
      <h2>Login de Utilizador</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Nome de Utilizador" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;