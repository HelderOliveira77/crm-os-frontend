// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // <--- OK
import './index.css' // <--- OK
import { BrowserRouter } from 'react-router-dom';
import  AuthProvider  from './context/AuthContext.jsx'; // <--- OK


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* [NOVO] Aplicar o Provedor de Autenticação */}
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)