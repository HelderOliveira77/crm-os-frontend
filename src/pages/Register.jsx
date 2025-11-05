// src/pages/Register.jsx
import React, { useState } from 'react';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // **Este é o ponto crucial de ligação à API do seu backend em 3000**
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        alert('Registo feito com sucesso! Pode fazer Login.');
        // Navegar para a página de Login, se existir
        // navigate('/'); 
      } else {
        const errorData = await response.json();
        alert(`Erro: ${errorData.message}`);
      }
    } catch (error) {
      alert('Erro de conexão ao servidor (verifique se o backend está a correr na porta 3000).');
    }
  };

  return (
    <div>
      <h2>Registo de Novo Utilizador</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Nome de Utilizador" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Registar</button>
      </form>
    </div>
  );
}
export default Register;