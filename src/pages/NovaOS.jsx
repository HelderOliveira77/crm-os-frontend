import React, { useState, useEffect } from 'react';

// Variáveis dummy para simular o contexto de autenticação
const dummyUser = { username: 'OperadorDemo' }; 

// Função de navegação dummy para evitar que o código quebre.
const navigate = (path) => {
    console.warn(`Ação de Navegação: Cancelar / Voltar para ${path}`);
};

// Opções para o campo Estado
const ESTADO_OPTIONS = ['ABERTA', 'PENDENTE', 'FECHADO'];

// O número inicial da OS se o contador da base de dados não existir.
const INITIAL_OS_NUMBER = 1000; 

// URL de simulação para a API de CRIAÇÃO de OS
const API_URL = 'http://localhost:3000/api/os'; 

// URL de simulação para a API de CONTADOR PERSONALIZADA
// Em produção, esta seria a URL do seu servidor dedicado (Node/Python/etc)
const COUNTER_API_URL = 'https://sua-api-personalizada.com/api/counter/next_os';

// Variável global para simular a presença da chave da API em Produção
const isProductionApiAvailable = typeof __api_key_production !== 'undefined' && __api_key_production !== '';

// -----------------------------------------------------------
// CONFIGURAÇÃO CRÍTICA DE TESTE:
// TRUE: Força a chamada à API (vai falhar) para TESTAR o fallback de 9999.
// FALSE: Usa o fallback simples de DEV (1000).
const FORCE_API_TEST_MODE = false; 
// -----------------------------------------------------------

// -----------------------------------------------------------
// BLOCO DE ESTILOS (DECLARADO NO TOPO)
// -----------------------------------------------------------

const styles = {
    container: { 
        padding: '20px 2%', 
        width: '100%',     
        maxWidth: '100%',  
        margin: '0 auto',  
        backgroundColor: '#f4f7f6', 
        borderRadius: '8px',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        fontFamily: 'Inter, Arial, sans-serif',
    },
    form: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '25px' ,
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
    inputWrapper: { 
        gap: '5px', 
        marginBottom: '10px'
    },
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
        backgroundColor: '#fff', 
    },
    // Estilo especial para campos de leitura (readOnly)
    readOnlyInput: {
        width: '100%', 
        padding: '12px 10px', 
        boxSizing: 'border-box', 
        border: '1px solid #bdc3c7', 
        borderRadius: '4px',
        backgroundColor: '#ecf0f1', // Cor de fundo cinza para indicar leitura
        color: '#7f8c8d',
        fontWeight: 'bold',
    },
    select: { 
        width: '100%', 
        padding: '12px 10px', 
        boxSizing: 'border-box', 
        border: '1px solid #ccc', // Borda cinza suave
        borderRadius: '4px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        backgroundColor: '#ecf0f1', // Fundo cinza claro
        appearance: 'none', 
        cursor: 'pointer',
        color: '#2c3e50', 
        fontWeight: '600',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) inset', 
    },
    submitButton: { 
        padding: '12px', // Reduzido
        backgroundColor: '#2ecc71', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        fontSize: '1.1em', // Reduzido
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
        boxShadow: '0 4px #27ae60',
        width: '100%', // Para ocupar 100% da largura do container
        maxWidth: '400px', // Limite de tamanho em desktop
        '&:hover': { backgroundColor: '#27ae60' },
    },
    cancelButton: { 
        padding: '10px', // Reduzido
        backgroundColor: '#e74c3c', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        cursor: 'pointer', 
        transition: 'background-color 0.3s',
        boxShadow: '0 4px #c0392b',
        width: '100%', // Para ocupar 100% da largura do container
        maxWidth: '400px', // Limite de tamanho em desktop
        '&:hover': { backgroundColor: '#c0392b' },
    },
    errorBox: {
        padding: '10px',
        backgroundColor: '#fdd',
        color: '#c00',
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #c00',
        textAlign: 'center',
        fontWeight: '500',
    },
    successBox: {
        padding: '10px',
        backgroundColor: '#dfd',
        color: '#0c0',
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #0c0',
        textAlign: 'center',
    },
    warningBox: {
        padding: '10px',
        backgroundColor: '#fff3cd', // Amarelo suave
        color: '#856404', 
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #ffeeba',
        textAlign: 'center',
        fontWeight: '500',
    }
};

// -----------------------------------------------------------
// COMPONENTES DE AJUDA
// -----------------------------------------------------------

const getSectionContentStyle = (layoutType) => {
    const baseStyle = {
        display: 'grid', 
        columnGap: '30px', 
        rowGap: '20px',    
    };

    switch (layoutType) {
        case 'three':
            return { 
                ...baseStyle, 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' 
            };
        case 'four':
            return { 
                ...baseStyle, 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' 
            };
        case 'two-fixed':
            return { 
                ...baseStyle, 
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' 
            };
        case 'auto':
        default:
            return { ...baseStyle, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' };
    }
};

const Section = ({ title, children, layoutType = 'two-fixed' }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <div style={getSectionContentStyle(layoutType)}> 
            {children}
        </div>
    </div>
);


const FormInput = ({ label, name, value, onChange, type = 'text', required = false, isTextArea = false, readOnly = false, placeholder = '', fullWidth = false }) => {
    
    const wrapperStyle = {
        ...styles.inputWrapper,
        ...(fullWidth && { gridColumn: '1 / -1' }) 
    };

    const inputStyle = readOnly ? styles.readOnlyInput : styles.input;

    return (
        <div style={wrapperStyle}> 
            <label style={styles.label}>
                {label} {required && !readOnly && <span style={{ color: 'red' }}>*</span>}
            </label>
            {isTextArea ? (
                <textarea 
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    required={required} 
                    style={inputStyle} 
                    rows="4"
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
                    style={inputStyle} 
                    readOnly={readOnly}
                    placeholder={placeholder}
                    step={type === 'number' && (name === 'lombada' ? '0.01' : '1')} 
                />
            )}
        </div>
    );
};

const FormSelect = ({ label, name, value, onChange, options, required = false, fullWidth = false }) => {
    
    const wrapperStyle = {
        ...styles.inputWrapper,
        ...(fullWidth && { gridColumn: '1 / -1' }) 
    };

    const placeholderStyle = value === '' ? { color: '#95a5a6' } : {};

    return (
        <div style={wrapperStyle}> 
            <label style={styles.label}>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                style={{ ...styles.select, ...placeholderStyle }} 
            >
                <option value="" disabled>
                    Selecione opção...
                </option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const SubGrid = ({ layoutType = 'two-fixed', children, title }) => { 
    const style = getSectionContentStyle(layoutType); 

    return (
        <div 
            style={{ 
                gridColumn: '1 / -1', 
                padding: '5px 0', 
                borderTop: title ? '1px dashed #ccc' : 'none', 
                marginTop: title ? '15px' : '0' 
            }}
        > 
            {title && (
                <h4 style={{ color: '#34495e', marginBottom: '15px' }}>
                    {title}
                </h4>
            )} 
            <div style={style}> 
                {children} 
            </div> 
        </div> 
    ); 
};


// -----------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------

function NovaOS() {
    const [userId, setUserId] = useState(crypto.randomUUID()); // Apenas um ID aleatório para simulação
    
    // ESTADO DO FORMULÁRIO 
    const [formData, setFormData] = useState({
        cliente: '',         
        desc_trab: '',       
        data_aber: new Date().toISOString().slice(0, 10), 
        num_orc: '',         
        num_o_s: 'A carregar...', // Valor inicial enquanto espera
        estado: '',  
        operador: dummyUser?.username || '', 

        // ... (restantes campos omitidos por brevidade)
        data_recep: '',
        tempo_operador: '', 
        formato: '',         
        lombada: '',
        num_pag: '',
        tiragem: '',
        maquina: '', 
        impressao: '', 
        cores_miolo: '',
        papel_miolo: '',
        miolo_gramas: '',
        bobine_miolo: '',
        verniz_miolo: '',
        verniz_miolo_brilho_mate: '',
        verniz_miolo_geral_reservado: '',
        tipo_acabamento_miolo: '',
        observacoes_miolo: '',
        cores_capa: '',
        papel_capa: '',
        capa_gramas: '',
        bobine_capa: '',
        verniz_capa: '',
        verniz_capa_brilho_mate: '',
        verniz_capa_geral_reservado: '',
        verniz_capa_f_v: '',
        observacoes_capa: '',
        provas_cor: '',
        ozalide_digital: '',
        provas_konica: '',
        quantidade_chapas: '',
        local_entrega: '',   
        forma_expedicao: '',
        observacoes_gerais: '',
    });

    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [osLoading, setOSLoading] = useState(true);

    // Variável para rastrear se o API Personalizado está disponível (baseado na variável global)
    const isApiAvailable = isProductionApiAvailable;
    
    // Variável que determina se devemos tentar a API ou usar o Fallback de DEV
    const shouldAttemptApi = isApiAvailable || FORCE_API_TEST_MODE;


    // EFEITO 2: BUSCAR O PRÓXIMO NÚMERO DE OS USANDO A API PERSONALIZADA
    useEffect(() => {
        
        // Se a API não estiver disponível E NÃO for o modo de teste, usa o fallback simples (1000)
        if (!shouldAttemptApi) {
            console.error("Configuração de API Personalizada em falta. Atribuído número de OS manual (1000).");
            setOSLoading(false);
            setFormData(prev => ({ ...prev, num_o_s: INITIAL_OS_NUMBER.toString() }));
            setMessage({ 
                type: 'warning', 
                text: `AVISO: API de Produção em falta. N.º OS: ${INITIAL_OS_NUMBER} (Fallback de DEV) atribuído manualmente para desenvolvimento local.` 
            });
            return;
        }

        const getNextOSNumber = async () => {
            setOSLoading(true);
            setMessage(null); // Limpa mensagens anteriores

            try {
                // 1. Chamada à API Personalizada (Simulando o acesso transacional)
                // Isto vai falhar, ativando o bloco catch
                const response = await fetch(COUNTER_API_URL, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userId}`, 
                    },
                    body: JSON.stringify({ requesterId: userId })
                });

                if (!response.ok) {
                    throw new Error(`Erro API: ${response.status} - ${response.statusText}`);
                }

                const data = await response.json();
                
                if (typeof data.nextNumber !== 'number' || data.nextNumber <= INITIAL_OS_NUMBER) {
                     throw new Error('Resposta da API Inválida: O servidor não retornou um número válido.');
                }
                
                const nextNumber = data.nextNumber;

                // Atualiza o estado do formulário com o número obtido
                setFormData(prev => ({ ...prev, num_o_s: nextNumber.toString() }));
                setMessage({ type: 'success', text: `Nº OS ${nextNumber} obtido com sucesso da API Customizada.` });

            } catch (error) {
                // ESTE BLOCO É ACIONADO QUANDO A CHAMADA FALHA (Erro de rede ou timeout)
                console.error("Erro CRÍTICO ao obter o Nº OS da API Personalizada. Usando fallback 9999.", error);
                
                const errorMessage = 'ERRO DE REDE: Não foi possível ligar à API (simulação de falha). Atribuído N.º OS **9999** (Fallback de Falha de Rede) para continuar.';

                setMessage({ type: 'error', text: errorMessage });
                
                // **ESTE É O PONTO CRÍTICO: FORÇAR O VALOR 9999**
                setFormData(prev => ({ ...prev, num_o_s: '9999' })); 
            } finally {
                setOSLoading(false);
            }
        };

        getNextOSNumber();
    }, [shouldAttemptApi]); // Depende da nova flag

    // Lidar com a mudança de input (Mantém-se igual)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Lidar com o envio do formulário (Simulação)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (osLoading) {
            setMessage({ type: 'error', text: 'Aguarde a atribuição do número de Ordem de Serviço.' });
            return;
        }

        setLoading(true);
        setMessage(null);
        
        try {
            // Chamada de API simulada
            const osData = {
                ...formData,
                operador_uid: userId, 
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer simulated-auth-token`,
                },
                body: JSON.stringify(osData),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: `Simulação: OS ${formData.num_o_s} criada com sucesso!` });
                // Resetar o estado, exceto a data_aber e o operador
                setFormData(prev => ({ 
                    ...prev, 
                    cliente: '', desc_trab: '', num_orc: '', 
                    // Resetar OS para forçar o carregamento do próximo número
                    num_o_s: shouldAttemptApi ? 'A carregar...' : (parseInt(prev.num_o_s) + 1).toString(), 
                    estado: '', data_recep: '', tempo_operador: '', formato: '', 
                    lombada: '', num_pag: '', tiragem: '', maquina: '', impressao: '',
                    cores_miolo: '', papel_miolo: '', miolo_gramas: '', bobine_miolo: '',
                    verniz_miolo: '', verniz_miolo_brilho_mate: '', verniz_miolo_geral_reservado: '',
                    tipo_acabamento_miolo: '', observacoes_miolo: '', cores_capa: '', papel_capa: '',
                    capa_gramas: '', bobine_capa: '', verniz_capa: '', verniz_capa_brilho_mate: '',
                    verniz_capa_geral_reservado: '', verniz_capa_f_v: '', observacoes_capa: '',
                    provas_cor: '', ozalide_digital: '', provas_konica: '', quantidade_chapas: '',
                    local_entrega: '', forma_expedicao: '', observacoes_gerais: '',
                }));

                // Se a API estiver disponível, o Efeito 2 irá buscar o próximo número.
                if(shouldAttemptApi) setOSLoading(true);
                
            } else {
                setMessage({ type: 'error', text: data.message || 'Simulação: Erro ao criar Ordem de Serviço (verifique o servidor).' });
            }
        } catch (error) {
            console.error("Erro de rede ao criar OS (simulação):", error);
            setMessage({ type: 'error', text: 'Simulação: Erro de conexão com o servidor.' });
        } finally {
            setLoading(false);
        }
    };

    // -----------------------------------------------------------
    // RENDERIZAÇÃO
    // -----------------------------------------------------------

    const isOsNumberReady = formData.num_o_s !== '' && formData.num_o_s !== 'A carregar...';
    
    const displayMessage = message ? (
        <div style={message.type === 'error' ? styles.errorBox : message.type === 'warning' ? styles.warningBox : styles.successBox}>
            {message.text}
        </div>
    ) : null;

    return (
        <div style={styles.container}>
            {displayMessage}
            
            {/* Mensagem de carregamento */}
            {(osLoading && !isOsNumberReady && shouldAttemptApi) && 
                <div style={styles.successBox}>A carregar o próximo número de Ordem de Serviço da API Personalizada...</div>
            }

            <form onSubmit={handleSubmit} style={styles.form}>
                
                {/* 1. INFORMAÇÃO ORDEM DE SERVIÇO */}
                <Section title="NOVA ORDEM DE SERVIÇO" layoutType="two-fixed">
                    <FormInput 
                        label="Nº Ordem Serviço" 
                        name="num_o_s" 
                        value={formData.num_o_s} 
                        onChange={handleChange} 
                        type="text" 
                        readOnly={isOsNumberReady} 
                        placeholder="Gerado automaticamente"
                    />
                    <FormInput label="Nº Orçamento" name="num_orc" value={formData.num_orc} onChange={handleChange} type="number" />
                   
                    <FormInput label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} required fullWidth />
                    <FormInput label="Descrição do Trabalho" name="desc_trab" value={formData.desc_trab} onChange={handleChange} isTextArea required fullWidth />

                    <SubGrid layoutType="three">
                        <FormInput label="Data de Abertura" name="data_aber" value={formData.data_aber} onChange={handleChange} type="date" required />
                        <FormInput label="Data de Receção" name="data_recep" value={formData.data_recep} onChange={handleChange} type="date" />
                        
                        <FormSelect 
                            label="Estado" 
                            name="estado" 
                            value={formData.estado} 
                            onChange={handleChange} 
                            options={ESTADO_OPTIONS} 
                            required
                        />
                    </SubGrid>
                </Section>

                {/* 2. CARACTERÍSTICAS GERAIS */}
                <Section title="CARACTERÍSTICAS GERAIS" layoutType="two-fixed">
                    <SubGrid layoutType="three">
                        <FormInput label="Formato" name="formato" value={formData.formato} onChange={handleChange} />
                        <FormInput label="Nº Páginas" name="num_pag" value={formData.num_pag} onChange={handleChange} />
                        <FormInput label="Tiragem" name="tiragem" value={formData.tiragem} onChange={handleChange} type="number" />
                    </SubGrid>

                    <FormInput label="Impressão" name="impressao" value={formData.impressao} onChange={handleChange} />
                    <FormInput label="Máquina" name="maquina" value={formData.maquina} onChange={handleChange} /> 

                    <FormInput label="Observações Gerais" name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleChange} isTextArea fullWidth />
                </Section>

                {/* 3. CARACTERÍSTICAS MIOLO */}
                <Section title="CARACTERÍSTICAS MIOLO" layoutType="two-fixed"> 
                    <FormInput label="Tipo Acabamento" name="tipo_acabamento_miolo" value={formData.tipo_acabamento_miolo} onChange={handleChange} />
                    <FormInput label="Cores" name="cores_miolo" value={formData.cores_miolo} onChange={handleChange} type="number" />

                    <SubGrid layoutType="three"> 
                        <FormInput label="Papel" name="papel_miolo" value={formData.papel_miolo} onChange={handleChange} />
                        <FormInput label="Gramagem" name="miolo_gramas" value={formData.miolo_gramas} onChange={handleChange} type="number" />
                        <FormInput label="Bobine" name="bobine_miolo" value={formData.bobine_miolo} onChange={handleChange} />
                    </SubGrid>
                    
                    <SubGrid layoutType="three">
                        <FormInput label="Verniz" name="verniz_miolo" value={formData.verniz_miolo} onChange={handleChange} />
                        <FormInput label="Brilho/Mate" name="verniz_miolo_brilho_mate" value={formData.verniz_miolo_brilho_mate} onChange={handleChange} />
                        <FormInput label="Geral/Reservado" name="verniz_miolo_geral_reservado" value={formData.verniz_miolo_geral_reservado} onChange={handleChange} />
                    </SubGrid>

                    <FormInput label="Observações" name="observacoes_miolo" value={formData.observacoes_miolo} onChange={handleChange} isTextArea fullWidth />
                </Section>

                {/* 4. CARACTERÍSTICAS CAPA */}
                <Section title="CARACTERÍSTICAS CAPA" layoutType="two-fixed"> 
                    <FormInput label="Lombada (mm)" name="lombada" value={formData.lombada} onChange={handleChange} type="number" step="0.01" />
                    <FormInput label="Cores" name="cores_capa" value={formData.cores_capa} onChange={handleChange} type="number" />

                    <SubGrid layoutType="three"> 
                        <FormInput label="Papel" name="papel_capa" value={formData.papel_capa} onChange={handleChange} />
                        <FormInput label="Gramagem" name="capa_gramas" value={formData.capa_gramas} onChange={handleChange} type="number" />
                        <FormInput label="Bobine" name="bobine_capa" value={formData.bobine_capa} onChange={handleChange} />
                    </SubGrid>

                    <SubGrid layoutType="four"> 
                        <FormInput label="Verniz" name="verniz_capa" value={formData.verniz_capa} onChange={handleChange} />
                        <FormInput label="Brilho/Mate" name="verniz_capa_brilho_mate" value={formData.verniz_capa_brilho_mate} onChange={handleChange} />
                        <FormInput label="Geral/Reservado" name="verniz_capa_geral_reservado" value={formData.verniz_capa_geral_reservado} onChange={handleChange} />
                        <FormInput label="Frente/Verso" name="verniz_capa_f_v" value={formData.verniz_capa_f_v} onChange={handleChange} />
                    </SubGrid>

                    <FormInput label="Observações" name="observacoes_capa" value={formData.observacoes_capa} onChange={handleChange} isTextArea fullWidth />
                </Section>

                {/* 5. PROVAS E CHAPAS*/}
                <Section title="INFORMAÇÃO PROVAS E CHAPAS" layoutType="four"> 
                    <FormInput label="N.º Provas Cor" name="provas_cor" value={formData.provas_cor} onChange={handleChange} type="number" />
                    <FormInput label="Ozalide Digital" name="ozalide_digital" value={formData.ozalide_digital} onChange={handleChange} type="number" />
                    <FormInput label="Provas Konica" name="provas_konica" value={formData.provas_konica} onChange={handleChange} type="number" />
                    <FormInput label="N.º Chapas" name="quantidade_chapas" value={formData.quantidade_chapas} onChange={handleChange} type="number" />
                </Section>

                {/* 6. ENTREGA/EXPEDIÇÃO TRABALHO*/}
                <Section title="ENTREGA/EXPEDIÇÃO" layoutType="two-fixed">
                    <FormInput label="Local de Entrega" name="local_entrega" value={formData.local_entrega} onChange={handleChange} /> 
                    <FormInput label="Forma de Expedição" name="forma_expedicao" value={formData.forma_expedicao} onChange={handleChange} />
                </Section>

                 {/* 7. OPERADOR*/}
                <Section title="OPERADOR" layoutType="two-fixed">
                    <FormInput label="Operador" name="operador" value={formData.operador} onChange={handleChange} readOnly />
                    <FormInput label="Tempo (horas)" name="tempo_operador" value={formData.tempo_operador} onChange={handleChange} type="number" />
                </Section>

      {/* NOVO WRAPPER PARA CENTRALIZAR OS BOTÕES */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <button type="submit" style={styles.submitButton} disabled={loading || osLoading || !isOsNumberReady}>
                        {(loading || osLoading) ? 'A Preparar...' : 'Criar Ordem Serviço'}
                    </button>

                    <button 
                        type="button" 
                        onClick={() => navigate('/dashboard')} 
                        style={{ ...styles.cancelButton, marginTop: '10px' }}
                        disabled={loading || osLoading}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default NovaOS;