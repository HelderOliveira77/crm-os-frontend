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
                
{/* 1. INFORMAÇÃO ORDEM DE SERVIÇO */}
<Section title="INFORMAÇÃO ORDEM DE SERVIÇO">
<FormInput label="Nº Ordem Serviço" name="num_o_s" value={formData.num_o_s} onChange={handleChange} type="number" placeholder="Pode ser gerado automaticamente" required />

<FormInput label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} required />
<FormInput label="Descrição do Trabalho" name="desc_trab" value={formData.desc_trab} onChange={handleChange} isTextArea required fullWidth />
<FormInput label="Data de Receção" name="data_recep" value={formData.data_recep} onChange={handleChange} type="date" />
<FormInput label="Data de Abertura" name="data_aber" value={formData.data_aber} onChange={handleChange} type="date" required />
<FormInput label="Nº Orçamento" name="num_orc" value={formData.num_orc} onChange={handleChange} type="number" />
<FormInput label="Estado" name="estado" value={formData.estado} onChange={handleChange} />
</Section>

{/* 2. CARACTERÍSTICAS GERAIS */}
<Section title=" CARACTERÍSTICAS GERAIS ">
<FormInput label="Formato" name="formato" value={formData.formato} onChange={handleChange} />
<FormInput label="Nº Páginas" name="num_pag" value={formData.num_pag} onChange={handleChange} />
<FormInput label="Tiragem" name="tiragem" value={formData.tiragem} onChange={handleChange} type="number" />
<FormInput label="Impressão" name="impressao" value={formData.impressao} onChange={handleChange} />
<FormInput label="Observações Gerais" name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleChange} isTextArea fullWidth />
</Section>

{/* 3. CARACTERÍSTICAS MIOLO) */}
<Section title="CARACTERÍSTICAS MIOLO">
<FormInput label="Papel" name="papel_miolo" value={formData.papel_miolo} onChange={handleChange} />
<FormInput label="Gramagem" name="miolo_gramas" value={formData.miolo_gramas} onChange={handleChange} type="number" />
<FormInput label="Cores" name="cores_miolo" value={formData.cores_miolo} onChange={handleChange} type="number" />

<FormInput label="Tipo Acabamento" name="tipo_acabamento_miolo" value={formData.tipo_acabamento_miolo} onChange={handleChange} />
                    {/* Campos de Verniz Miolo */}
<FormInput label="Verniz" name="verniz_miolo" value={formData.verniz_miolo} onChange={handleChange} />
<FormInput label="Brilho/Mate" name="verniz_miolo_brilho_mate" value={formData.verniz_miolo_brilho_mate} onChange={handleChange} />
<FormInput label="Geral/Reservado" name="verniz_miolo_geral_reservado" value={formData.verniz_miolo_geral_reservado} onChange={handleChange} />
<FormInput label="Observações" name="observacoes_miolo" value={formData.observacoes_miolo} onChange={handleChange} isTextArea fullWidth />
</Section>

{/* 4. CARACTERÍSTICAS CAPA */}
<Section title="CARACTERÍSTICAS CAPA">
<FormInput label="Papel" name="papel_capa" value={formData.papel_capa} onChange={handleChange} />
<FormInput label="Gramagem" name="capa_gramas" value={formData.capa_gramas} onChange={handleChange} type="number" />
<FormInput label="Cores" name="cores_capa" value={formData.cores_capa} onChange={handleChange} type="number" />
<FormInput label="Lombada" name="lombada" value={formData.lombada} onChange={handleChange} type="number" step="0.01" />
                    {/* Campos de Verniz Capa */}
<FormInput label="Verniz" name="verniz_capa" value={formData.verniz_capa} onChange={handleChange} />
<FormInput label="Brilho/Mate" name="verniz_capa_brilho_mate" value={formData.verniz_capa_brilho_mate} onChange={handleChange} />
<FormInput label="Geral/Reservado" name="verniz_capa_geral_reservado" value={formData.verniz_capa_geral_reservado} onChange={handleChange} />
<FormInput label="Frente/Verso" name="verniz_capa_f_v" value={formData.verniz_capa_f_v} onChange={handleChange} />
<FormInput label="Observações" name="observacoes_capa" value={formData.observacoes_capa} onChange={handleChange} isTextArea fullWidth />
</Section>

{/* 5. INFORMAÇÃO PROVAS E CHAPAS*/}
<Section title="INFORMAÇÃO PROVAS E CHAPAS">
<FormInput label="N.º Provas Cor" name="provas_cor" value={formData.provas_cor} onChange={handleChange} type="number" />
<FormInput label="Ozalide Digital" name="ozalide_digital" value={formData.ozalide_digital} onChange={handleChange} type="number" />
<FormInput label="Provas Konica" name="provas_konica" value={formData.provas_konica} onChange={handleChange} type="number" />
<FormInput label="N.º Chapas" name="quantidade_chapas" value={formData.quantidade_chapas} onChange={handleChange} type="number" />
</Section>

{/* 6. ENTREGA/EXPEDIÇÃO TRABALHO */}
<Section title="ENTREGA/EXPEDIÇÃO TRABALHO">
<FormInput label="Local de Entrega" name="local_entrega" value={formData.local_entrega} onChange={handleChange} fullWidth />
<FormInput label="Forma de Expedição" name="forma_expedicao" value={formData.forma_expedicao} onChange={handleChange} fullWidth />
</Section>

{/* 7. OPERADOR */}
<Section title="OPERADOR">
<FormInput label="Operador" name="operador" value={formData.operador} onChange={handleChange} readOnly />
<FormInput label="Tempo" name="tempo_operador" value={formData.tempo_operador} onChange={handleChange} />
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

// 1. O componente Section é agora o contentor do Grid
const Section = ({ title, children }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        {/* Envolvemos os filhos no novo contentor de grid */}
        <div style={styles.sectionContent}> 
            {children}
        </div>
    </div>
);


// 2. O componente FormInput deve ser ajustado para aceitar 'fullWidth'
const FormInput = ({ label, name, value, onChange, type = 'text', required = false, isTextArea = false, readOnly = false, placeholder = '', fullWidth = false }) => {
    
    // O estilo de largura total agora é aplicado diretamente ao elemento que está dentro do Grid
    const wrapperStyle = {
        ...styles.inputWrapper,
        // Se fullWidth for true, faz o elemento ocupar todas as colunas do Grid
        ...(fullWidth && { gridColumn: '1 / -1' }) 
    };

    return (
        // Usamos o wrapperStyle que inclui o ajuste de largura total
        <div style={wrapperStyle}> 
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
                    step={type === 'number' && (name === 'lombada' ? '0.01' : '1')} 
                />
            )}
        </div>
    );
};



const styles = {
    container: { 
        padding: '20px', 
        width: '100%',     // Ocupa 100% da largura do contentor pai (a área branca)
        maxWidth: '100%',  // Garante que não é limitado por um max-width antigo
        margin: '0 auto',  // Mantém centrado (embora com 100% de largura, não é estritamente necessário)
        backgroundColor: '#f4f7f6', 
        borderRadius: '8px',
        boxSizing: 'border-box', // Importante para que o padding não aumente o tamanho total para além dos 100%
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px' 
    },
    section: { 
        padding: '25px', 
        border: '1px solid #e0e0e0', 
        borderRadius: '6px', 
        backgroundColor: '#fff', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    sectionTitle: { 
        borderBottom: '3px solid #3498db', 
        paddingBottom: '10px', 
        marginBottom: '20px', 
        color: '#2c3e50',
        fontSize: '1.4em',
        fontWeight: '600',
    },
    
    // >>> NOVOS ESTILOS PARA O LAYOUT GRID <<<
    sectionContent: { // Onde o Grid é definido (Contentor dos inputs)
        display: 'grid', 
        //gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gridTemplateColumns: '1fr 1fr', // 2 colunas exatas
        gap: '20px', 
    },
    inputWrapper: { 
        // display: 'flex', 
        // flexDirection: 'column', 
        gap: '5px', // Isso é para o espaçamento entre label e input
        // Adicionamos margem inferior para separar visualmente se necessário
        marginBottom: '15px'
    },
    // >>> FIM NOVOS ESTILOS <<<

    label: { 
        display: 'block', 
        marginBottom: '5px', 
        fontWeight: '600',
        color: '#34495e',
        fontSize: '0.95em',
    },
    input: { 
        width: '100%', 
        padding: '12px 10px', 
        boxSizing: 'border-box', 
        border: '1px solid #bdc3c7', 
        borderRadius: '4px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    // Estilos de botões mais apelativos
    submitButton: { 
        padding: '15px', 
        backgroundColor: '#2ecc71', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontSize: '1.2em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        marginTop: '20px',
    },
    cancelButton: { 
        padding: '12px', 
        backgroundColor: '#e74c3c', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        marginTop: '10px',
        transition: 'background-color 0.3s',
    },



};

export default NovaOS;