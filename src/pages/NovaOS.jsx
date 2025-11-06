// src/pages/NovaOS.jsx (Evolução para 40+ Campos)

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3000/api/os'; 

function NovaOS() {
    const { token, user } = useAuth();
    const navigate = useNavigate();

    // ESTADO INICIAL COMPLETO (Sincronizado com os seus 40+ campos)
    const [formData, setFormData] = useState({
        // 1. DADOS BASE/ADMINISTRATIVOS
        cliente: '',         
        desc_trab: '',       
        data_aber: new Date().toISOString().slice(0, 10), // Data de hoje por defeito
        num_orc: '',         
        num_o_s: '',         
        estado: 'Pendente',  
        operador: user?.username || '', // Preenchido pelo utilizador logado

        // 2. DATAS E TEMPOS
        data_recep: '',
        tempo_operador: '', 
        
        // 3. CARACTERÍSTICAS GERAIS
        formato: '',         
        lombada: '',
        num_pag: '',
        tiragem: '',
        
        // 4. MIOLO (Miolo = Interior do Livro/Produto)
        cores_miolo: '',
        impressao: '',
        papel_miolo: '',
        miolo_gramas: '',
        bobine_miolo: '',
        verniz_miolo: '',
        verniz_miolo_brilho_mate: '',
        verniz_miolo_geral_reservado: '',
        tipo_acabamento_miolo: '',
        observacoes_miolo: '',
        
        // 5. CAPA (Capa = Exterior do Livro/Produto)
        cores_capa: '',
        papel_capa: '',
        capa_gramas: '',
        bobine_capa: '',
        verniz_capa: '',
        verniz_capa_brilho_mate: '',
        verniz_capa_geral_reservado: '',
        verniz_capa_f_v: '',
        observacoes_capa: '',

        // 6. OUTROS DADOS TÉCNICOS/PRODUÇÃO
        provas_cor: '',
        ozalide_digital: '',
        provas_konica: '',
        quantidade_chapas: '',
        
        // 7. EXPEDIÇÃO
        local_entrega: '',   
        forma_expedicao: '',

        // 8. OBSERVAÇÕES
        observacoes_gerais: '',
        
        // [Os campos createdAt/updatedAt são geridos pelo Sequelize]
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Lidar com a mudança de input (Mantém-se igual)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lidar com o envio do formulário (Mantém-se igual)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // ... (Verificação de token) ...
        if (!token) {
            setMessage({ type: 'error', text: 'Erro de autenticação. Redirecionando...' });
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `OS ${data.num_o_s || data.id} criada com sucesso!` });
                setTimeout(() => navigate('/dashboard'), 1500); 
            } else {
                setMessage({ type: 'error', text: data.message || 'Erro ao criar Ordem de Serviço. Verifique os tipos de dados.' });
            }
        } catch (error) {
            console.error("Erro de rede ao criar OS:", error);
            setMessage({ type: 'error', text: 'Erro de conexão com o servidor.' });
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------
    // RENDERIZAÇÃO
    // -----------------------------------------------------------

    return (
        <div style={styles.container}>
            <h2>Nova Ordem de Serviço (Completa)</h2>
            {message && (<div style={message.type === 'error' ? styles.errorBox : styles.successBox}>{message.text}</div>)}

            <form onSubmit={handleSubmit} style={styles.form}>
                
                {/* 1. DADOS BASE E ADMIN */}
                <Section title="Dados Administrativos e Cliente">
                    <FormInput label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} required />
                    <FormInput label="Nº Orçamento (num_orc)" name="num_orc" value={formData.num_orc} onChange={handleChange} type="number" />
                    <FormInput label="Data de Abertura (data_aber)" name="data_aber" value={formData.data_aber} onChange={handleChange} type="date" required />
                    <FormInput label="Estado" name="estado" value={formData.estado} onChange={handleChange} />
                    <FormInput label="Operador" name="operador" value={formData.operador} onChange={handleChange} readOnly />
                </Section>

                {/* 2. DESCRIÇÃO E ESPECIFICAÇÕES GERAIS */}
                <Section title="Descrição e Características Gerais">
                    <FormInput label="Descrição do Trabalho (desc_trab)" name="desc_trab" value={formData.desc_trab} onChange={handleChange} isTextArea required />
                    <FormInput label="Formato" name="formato" value={formData.formato} onChange={handleChange} />
                    <FormInput label="Nº Páginas (num_pag)" name="num_pag" value={formData.num_pag} onChange={handleChange} />
                    <FormInput label="Tiragem" name="tiragem" value={formData.tiragem} onChange={handleChange} type="number" />
                    <FormInput label="Lombada" name="lombada" value={formData.lombada} onChange={handleChange} type="number" step="0.01" />
                    <FormInput label="Impressão" name="impressao" value={formData.impressao} onChange={handleChange} />
                </Section>
                
                {/* 3. MIOLO (Interior) */}
                <Section title="Miolo (Interior)">
                    <FormInput label="Papel Miolo" name="papel_miolo" value={formData.papel_miolo} onChange={handleChange} />
                    <FormInput label="Gramagem Miolo" name="miolo_gramas" value={formData.miolo_gramas} onChange={handleChange} type="number" />
                    <FormInput label="Cores Miolo" name="cores_miolo" value={formData.cores_miolo} onChange={handleChange} type="number" />
                    <FormInput label="Tipo Acabamento Miolo" name="tipo_acabamento_miolo" value={formData.tipo_acabamento_miolo} onChange={handleChange} />
                    {/* Campos de Verniz Miolo */}
                    <FormInput label="Verniz Miolo" name="verniz_miolo" value={formData.verniz_miolo} onChange={handleChange} />
                    <FormInput label="V. Miolo Brilho/Mate" name="verniz_miolo_brilho_mate" value={formData.verniz_miolo_brilho_mate} onChange={handleChange} />
                    <FormInput label="V. Miolo Geral/Reservado" name="verniz_miolo_geral_reservado" value={formData.verniz_miolo_geral_reservado} onChange={handleChange} />
                    <FormInput label="Observações Miolo" name="observacoes_miolo" value={formData.observacoes_miolo} onChange={handleChange} isTextArea />
                </Section>

                {/* 4. CAPA (Exterior) */}
                <Section title="Capa (Exterior)">
                    <FormInput label="Papel Capa" name="papel_capa" value={formData.papel_capa} onChange={handleChange} />
                    <FormInput label="Gramagem Capa" name="capa_gramas" value={formData.capa_gramas} onChange={handleChange} type="number" />
                    <FormInput label="Cores Capa" name="cores_capa" value={formData.cores_capa} onChange={handleChange} type="number" />
                    {/* Campos de Verniz Capa */}
                    <FormInput label="Verniz Capa" name="verniz_capa" value={formData.verniz_capa} onChange={handleChange} />
                    <FormInput label="V. Capa Brilho/Mate" name="verniz_capa_brilho_mate" value={formData.verniz_capa_brilho_mate} onChange={handleChange} />
                    <FormInput label="V. Capa Geral/Reservado" name="verniz_capa_geral_reservado" value={formData.verniz_capa_geral_reservado} onChange={handleChange} />
                    <FormInput label="V. Capa F/V" name="verniz_capa_f_v" value={formData.verniz_capa_f_v} onChange={handleChange} />
                    <FormInput label="Observações Capa" name="observacoes_capa" value={formData.observacoes_capa} onChange={handleChange} isTextArea />
                </Section>

                {/* 5. PROVAS E EXPEDIÇÃO */}
                <Section title="Provas, Expedição e Observações">
                    <FormInput label="Provas Cor" name="provas_cor" value={formData.provas_cor} onChange={handleChange} type="number" />
                    <FormInput label="Ozalide Digital" name="ozalide_digital" value={formData.ozalide_digital} onChange={handleChange} type="number" />
                    <FormInput label="Provas Konica" name="provas_konica" value={formData.provas_konica} onChange={handleChange} type="number" />
                    <FormInput label="Local de Entrega" name="local_entrega" value={formData.local_entrega} onChange={handleChange} />
                    <FormInput label="Forma de Expedição" name="forma_expedicao" value={formData.forma_expedicao} onChange={handleChange} />
                    <FormInput label="Quantidade de Chapas" name="quantidade_chapas" value={formData.quantidade_chapas} onChange={handleChange} type="number" />
                    <FormInput label="Observações Gerais" name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleChange} isTextArea />
                </Section>
                
                {/* 6. CAMPOS DE CONTROLO (Opcionais para o formulário de criação) */}
                 <Section title="Controlo Interno (Opcional)">
                    <FormInput label="Nº OS (num_o_s)" name="num_o_s" value={formData.num_o_s} onChange={handleChange} type="number" placeholder="Pode ser gerado automaticamente" />
                    <FormInput label="Data de Receção" name="data_recep" value={formData.data_recep} onChange={handleChange} type="date" />
                    <FormInput label="Tempo de Operador" name="tempo_operador" value={formData.tempo_operador} onChange={handleChange} />
                 </Section>


                <button type="submit" style={styles.submitButton} disabled={loading}>
                    {loading ? 'A Enviar...' : 'Criar Ordem de Serviço'}
                </button>

                <button 
                    type="button" 
                    onClick={() => navigate('/dashboard')} 
                    style={styles.cancelButton}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}

// -----------------------------------------------------------
// Componentes de Ajuda e Estilos (Reutilizáveis)
// -----------------------------------------------------------

const Section = ({ title, children }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {children}
    </div>
);

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, isTextArea = false, readOnly = false, placeholder = '' }) => (
    <div style={styles.formGroup}>
        <label style={styles.label}>
            {label} {required && <span style={{ color: 'red' }}>*</span>}
        </label>
        {isTextArea ? (
            <textarea 
                name={name} 
                value={value} 
                onChange={onChange} 
                required={required} 
                style={styles.input} 
                rows="3"
                readOnly={readOnly}
                placeholder={placeholder}
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                style={styles.input}
                readOnly={readOnly}
                placeholder={placeholder}
                step={type === 'number' && (name === 'lombada' ? '0.01' : '1')} // Para lidar com números decimais na lombada
            />
        )}
    </div>
);

// FormSelect e estilos (omiti para brevidade, use os estilos da resposta anterior)
// ...

const styles = {
    container: { padding: '20px', maxWidth: '1000px', margin: '0 auto' },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    section: { padding: '15px', border: '1px solid #ddd', borderRadius: '5px', marginBottom: '20px' },
    sectionTitle: { borderBottom: '2px solid #3498db', paddingBottom: '5px', marginBottom: '15px' },
    formGroup: { marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', gridColumn: 'span 2' },
    input: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', gridColumn: 'span 2' },
    submitButton: { padding: '15px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s', fontSize: '1.1em' },
    cancelButton: { padding: '10px', backgroundColor: '#95a5a6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' },
    errorBox: { padding: '10px', backgroundColor: '#fdd', color: 'red', border: '1px solid red', borderRadius: '4px', marginBottom: '15px' },
    successBox: { padding: '10px', backgroundColor: '#dfd', color: 'green', border: '1px solid green', borderRadius: '4px', marginBottom: '15px' },
};

export default NovaOS;