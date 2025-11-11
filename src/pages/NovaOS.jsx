import React, { useState, useEffect, useRef } from 'react';
import { Outlet, Link } from 'react-router-dom'; // Necessário para o Dashboard
// Variáveis de ambiente simuladas
const dummyUser = { username: 'OperadorDemo' };
const FORCE_API_TEST_MODE = false; // Defina para true para forçar o teste da API, mesmo que __api_key_production esteja undefined
// Função de navegação (simulada, pois não temos o hook useNavigate aqui)
const navigate = (path) => {
    console.warn(`Ação de Navegação: Cancelar / Voltar para ${path}`);
    if (typeof window !== 'undefined' && path !== '/dashboard') {
        window.history.back(); // Simula o back para o caso de Cancelar
    }
};
// Constantes
const ESTADO_OPTIONS = ['ABERTA', 'PENDENTE', 'FECHADO'];
const FORMATO_SUGGESTIONS = ['A0 - 1189x841', 'A1 - 841x594', 'A2 - 594x420', 'A3 - 420x297', 'A4 - 297x210',
    'A5 - 210x148', 'A6 - 148x105', 'A7 - 105x74', 'A8 - 74x52', 'A9 - 52x37', 'A10 - 37x26'];
const IMPRESSAO_OPTIONS = ['ROTATIVA', 'OFFSET', 'DIGITAL']; // Adicionado N/A como opção
const MAQUINA_OPTIONS = ['KOMORI', 'ROLAND', 'PLANA (KOMORI)', 'KONICA']; // Lista completa (embora mapeada)
const MAQUINA_MAPPING = {
    'ROTATIVA': ['KOMORI', 'ROLAND'],
    'OFFSET': ['PLANA (KOMORI)'],
    'DIGITAL': ['KONICA'],
    'N/A': [], // N/A não tem máquina associada
    'DEFAULT': []
};
const ACABAMENTO_OPTIONS = ['COSIDO', 'SERROTADO', 'AGRAFADO', 'COLADO LOMBADA'];
const INITIAL_OS_NUMBER = 1000;
const API_URL = 'http://localhost:3000/api/os';
const COUNTER_API_URL = 'https://sua-api-personalizada.com/api/counter/next_os';
const isProductionApiAvailable = typeof __api_key_production !== 'undefined' && __api_key_production !== '';
const styles = {
    container: {
        padding: '20px 2%',
        width: '100%',
        maxWidth: 'auto',
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
        gap: '25px',
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
    submitButton: {
        padding: '12px',
        backgroundColor: '#2ecc71',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.1em',
        fontWeight: 'bold',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        boxShadow: '0 4px #27ae60',
        width: '100%',
        maxWidth: '400px',
    },
    submitButtonDisabled: {
        backgroundColor: '#a8dadc',
        boxShadow: 'none',
        cursor: 'not-allowed',
    },
    cancelButton: {
        padding: '10px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, box-shadow 0.3s',
        boxShadow: '0 4px #c0392b',
        width: '100%',
        maxWidth: '400px',
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
        backgroundColor: '#fff3cd',
        color: '#856404',
        borderRadius: '4px',
        marginBottom: '15px',
        border: '1px solid #ffeeba',
        textAlign: 'center',
        fontWeight: '500',
    },
    datalistInput: {
        width: '100%',
        padding: '12px 10px',
        boxSizing: 'border-box',
        border: '1px solid #bdc3c7',
        borderRadius: '4px',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        backgroundColor: '#fff',
        fontWeight: '600',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1) inset',
        color: '#2c3e50',
        fontSize: '1em', // Garante tamanho de fonte consistente
    },
    actionsContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        padding: '20px',
        borderTop: '1px solid #e0e0e0',
        backgroundColor: '#fff',
        borderRadius: '0 0 8px 8px',
        flexWrap: 'wrap',
    }
};

const getSectionContentStyle = (layoutType) => {
    const baseStyle = {
        display: 'grid',
        columnGap: '30px',
        rowGap: '20px',
        justifyContent: 'flex-start',
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
                // Colunas adaptáveis para desktop e uma coluna para mobile
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
            };
        case 'three-fixed':
            return {
                ...baseStyle,
                // Colunas adaptáveis para desktop e uma coluna para mobile
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'
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
    const finalInputStyle = {
        ...inputStyle,
        // Pequena correção: Garante que a cor do texto não seja cinza em campos editáveis
        ...(readOnly === false && inputStyle.backgroundColor === styles.datalistInput.backgroundColor && { color: styles.datalistInput.color }),
        ...(isTextArea && { minHeight: '100px', resize: 'vertical' })
    };
    return (
        <div style={wrapperStyle}>
            <label style={styles.label} htmlFor={name}>
                {label} {required && !readOnly && <span style={{ color: 'red' }}>*</span>}
            </label>
            {isTextArea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={finalInputStyle}
                    rows="4"
                    readOnly={readOnly}
                    placeholder={placeholder} />
            ) : (
                <input
                    id={name}
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    required={required}
                    style={finalInputStyle}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    // O step deve ser aplicado apenas a inputs type="number"
                    step={type === 'number' ? (name === 'lombada' ? '0.01' : '1') : undefined} />
            )}
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
            }} >
            {title && (
                <h4 style={{ color: '#34495e', marginBottom: '15px', fontSize: '1.1em' }}>
                    {title}
                </h4>
            )}
            <div style={style}>
                {children}
            </div>
        </div>
    );
};
const CustomSelect = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false,
    fullWidth = false,
    canCreate = false,
    placeholder = 'Selecione...',
    isDisabled = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef(null);

    useEffect(() => {
        if (isDisabled) {
            setSearchTerm('');
        } else if (!canCreate) {
            setSearchTerm(value);
        } else {
            setSearchTerm(value);
        }
    }, [value, canCreate, isDisabled]);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
                if (!canCreate) {
                    setSearchTerm(value);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, canCreate, value]);

    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setSearchTerm(option);
        setIsOpen(false); // ✅ Fecha o menu após selecionar
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        setIsOpen(true);
        if (canCreate) {
            onChange({ target: { name, value: newValue } });
        }
    };

    const toggleDropdown = (e) => {
        e.stopPropagation();
        if (isDisabled) return;
        // ✅ Agora alterna corretamente entre abrir/fechar
        setIsOpen(prev => !prev);
    };

    const wrapperStyle = {
        ...styles.inputWrapper,
        ...(fullWidth && { gridColumn: '1 / -1' })
    };
    const inputStyle = {
        ...styles.datalistInput,
        paddingRight: '35px',
        cursor: isDisabled ? 'not-allowed' : (canCreate ? 'text' : 'pointer'),
        color: isDisabled ? '#7f8c8d' : styles.datalistInput.color,
        backgroundColor: isDisabled ? 'white' : 'white',
        fontWeight: isDisabled ? 'normal' : '600',
    };

    const customStyles = {
        selectContainer: { position: 'relative', width: '100%' },
        dropdown: {
            position: 'absolute',
            top: '100%',
            left: '0',
            right: '0',
            zIndex: 10,
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            maxHeight: '200px',
            overflowY: 'auto',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            marginTop: '2px',
        },
        option: {
            padding: '10px',
            cursor: 'pointer',
            fontWeight: 'normal',
            color: '#2c3e50',
            transition: 'background-color 0.2s',
        },
        optionHover: { backgroundColor: '#3498db', color: 'white' },
        arrow: {
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: isOpen ? 'translateY(-50%) rotate(180deg)' : 'translateY(-50%)',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            color: isDisabled ? '#bdc3c7' : '#7f8c8d',
            fontSize: '0.8em',
            transition: 'transform 0.2s',
        },
    };

    return (
        <div style={wrapperStyle} ref={wrapperRef}>
            <label style={styles.label} htmlFor={name}>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <div style={customStyles.selectContainer}>
                <input
                    id={name}
                    type="text"
                    name={name}
                    value={isDisabled ? '' : searchTerm}
                    onChange={handleInputChange}
                    required={required}
                    style={inputStyle}
                    placeholder={isDisabled ? 'Selecione "Impressão" primeiro' : placeholder}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) setIsOpen(prev => !prev); // ✅ Alterna corretamente
                    }}
                    readOnly={!canCreate}
                    autoComplete="off"
                    disabled={isDisabled}
                    onBlur={() => {
                        // ✅ Fecha o menu só depois de o utilizador realmente sair
                        setTimeout(() => setIsOpen(false), 150);
                    }}
                />
                <span
                    style={customStyles.arrow}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabled) setIsOpen(prev => !prev); // ✅ Seta também alterna
                    }}
                >
                    ▼
                </span>

                {isOpen && !isDisabled && (
                    <div style={customStyles.dropdown}>
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    style={customStyles.option}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = customStyles.optionHover.backgroundColor}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = customStyles.dropdown.backgroundColor}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option}
                                </div>
                            ))
                        ) : (
                            <div style={{ ...customStyles.option, cursor: 'default' }}>Sem resultados.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

};

const FormRadioGroup = ({ label, name, value, onChange, options, required = false }) => {
    return (
        <div style={{ marginBottom: '15px', }}>
            <label style={{ ...styles.label, display: 'block', marginBottom: '8px' }}>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            {/* CORREÇÃO: Adicione 'width: 'fit-content'' aqui */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'flex-start', width: 'fit-content' }}>
                {options.map((option) => (
                    <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={value === option}
                            onChange={onChange}
                            style={{ cursor: 'pointer' }}
                        />
                        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{option}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};


export default function NovaOS() {
    // Definimos userId, mas como não estamos a usar Firebase/Auth, usamos um UUID aleatório
    const [userId] = useState(crypto.randomUUID());
    const initialFormData = {
        cliente: '',
        desc_trab: '',
        data_aber: new Date().toISOString().slice(0, 10),
        num_orc: '',
        num_o_s: 'A carregar...',
        estado: '',
        operador: dummyUser?.username || 'N/A',
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
        acabamento: '',
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
    };
    const [formData, setFormData] = useState(initialFormData);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [osLoading, setOSLoading] = useState(true);
    // Variável para determinar se deve tentar ligar à API externa
    const shouldAttemptApi = isProductionApiAvailable || FORCE_API_TEST_MODE;
    const getMaquinaOptions = (impressaoType) => {
        return MAQUINA_MAPPING[impressaoType] || MAQUINA_MAPPING.DEFAULT;
    };
    // Efeito para carregar o próximo número de OS
    useEffect(() => {
        const getNextOSNumber = async () => {
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
            setOSLoading(true);
            setMessage(null);
            // Simulação de chamada à API de terceiros para obter o próximo número
            try {
                // Configuração da chamada simulada à API
                const response = await fetch(COUNTER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer simulated-auth-token`,
                    },
                    body: JSON.stringify({ requesterId: userId })
                });
                if (!response.ok) {
                    throw new Error(`Erro API: ${response.status} - ${response.statusText}`);
                }
                const data = await response.json();
                const nextNumber = data.nextNumber && typeof data.nextNumber === 'number' && data.nextNumber > 0
                    ? data.nextNumber
                    : 9999; // Fallback se a resposta for inválida
                if (nextNumber === 9999) {
                    throw new Error('Resposta da API Inválida: O servidor não retornou um número válido.');
                }
                setFormData(prev => ({ ...prev, num_o_s: nextNumber.toString() }));
                setMessage({ type: 'success', text: `Nº OS ${nextNumber} obtido com sucesso da API Customizada.` });
            } catch (error) {
                console.error("Erro CRÍTICO ao obter o Nº OS da API Personalizada. Usando fallback 9999.", error);
                const errorMessage = 'ERRO: Não foi possível ligar à API. Atribuído N.º OS **9999** (Fallback de Falha de Rede).';
                setMessage({ type: 'error', text: errorMessage });
                setFormData(prev => ({ ...prev, num_o_s: '9999' }));
            } finally {
                setOSLoading(false);
            }
        };
        getNextOSNumber();
    }, [userId, shouldAttemptApi, formData.num_o_s]); // Adicionada dependência implícita de num_o_s para re-fetch após submissão
    // Handler para mudança nos campos do formulário
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Permite string vazia em campos numéricos se o utilizador apagar o conteúdo
        const newValue = type === 'number' && value === '' ? '' : value;
        setFormData(prev => {
            let newState = { ...prev, [name]: newValue };
            // Lógica para restrição de Máquina com base na Impressão
            if (name === 'impressao') {
                const newMaquinaOptions = getMaquinaOptions(newValue);
                // 1. Limpar a Máquina se o valor anterior for inválido para a nova Impressão
                if (prev.maquina && !newMaquinaOptions.includes(prev.maquina)) {
                    newState.maquina = '';
                    console.log(`Máquina '${prev.maquina}' foi resetada porque é inválida para Impressão: ${newValue}`);
                }
                // 2. Pré-selecionar a Máquina se houver apenas uma opção
                else if (newMaquinaOptions.length === 1 && newMaquinaOptions.length > 0) {
                    newState.maquina = newMaquinaOptions[0];
                }
                // 3. Limpar a Máquina se Impressão for N/A
                if (newValue === 'N/A') {
                    newState.maquina = '';
                }
            }
            return newState;
        });
    };
    // Handler para submissão do formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (osLoading) {
            setMessage({ type: 'error', text: 'Aguarde a atribuição do número de Ordem de Serviço.' });
            return;
        }
        const currentMaquinaOptions = getMaquinaOptions(formData.impressao);
        const isMaquinaRequired = currentMaquinaOptions.length > 0;
        // Validação básica
        if (!formData.cliente || !formData.desc_trab || !formData.estado || !formData.impressao || (isMaquinaRequired && !formData.maquina)) {
            setMessage({ type: 'error', text: 'Os campos obrigatórios (Cliente, Descrição, Estado, Impressão) e o campo Máquina (se aplicável) devem ser preenchidos.' });
            return;
        }
        setLoading(true);
        setMessage(null);
        // Simulação de submissão
        try {
            const osData = { ...formData, operador_uid: userId };
            // Simulação de chamada à API para guardar dados
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer simulated-auth-token`,
                },
                body: JSON.stringify(osData),
            });
            // Simulação de sucesso (o utilizador não deve ter que ligar um servidor para ver a app funcionar)
            const data = { message: 'OS criada com sucesso!', id: formData.num_o_s };
            await new Promise(resolve => setTimeout(resolve, 800)); // Simular atraso de rede
            if (response.ok || true) { // Assumindo sucesso na simulação
                setMessage({ type: 'success', text: `Simulação: OS ${formData.num_o_s} criada com sucesso! Redirecionando...` });
                // Reset e preparação para a próxima OS
                setFormData(prev => {
                    const nextNumOS = shouldAttemptApi ? 'A carregar...' : (parseInt(prev.num_o_s) + 1).toString();
                    return ({
                        ...initialFormData,
                        operador: prev.operador,
                        data_aber: prev.data_aber,
                        num_o_s: nextNumOS,
                        estado: 'ABERTA' // Estado padrão após reset
                    });
                });
                if (shouldAttemptApi) {
                    setOSLoading(true);
                    // O useEffect irá tratar de buscar o novo número
                }
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
    const isOsNumberReady = formData.num_o_s !== '' && formData.num_o_s !== 'A carregar...';
    // Componente de mensagem
    const displayMessage = message ? (
        <div style={message.type === 'error' ? styles.errorBox : message.type === 'warning' ? styles.warningBox : styles.successBox}>
            {message.text}
        </div>
    ) : null;
    const isSubmitDisabled = loading || osLoading || !isOsNumberReady;
    // Lógica para a Máquina
    const maquinaOptions = getMaquinaOptions(formData.impressao);
    const isMaquinaDisabled = !formData.impressao || formData.impressao === 'N/A';
    const maquinaPlaceholder = isMaquinaDisabled ? 'Selecione "Impressão" primeiro' : 'Selecione...';
    return (
        <div style={styles.container}>
            {displayMessage}
            {(osLoading && !isOsNumberReady && shouldAttemptApi) &&
                <div style={styles.successBox}>A carregar o próximo número de Ordem de Serviço da API Personalizada...</div>
            }
            {/* <h1 style={{ color: '#2c3e50', fontSize: '2em', marginBottom: '30px', textAlign: 'center' }}>
                Nova Ordem de Serviço
            </h1> */}
            <form onSubmit={handleSubmit} style={styles.form}>
                {/* 1. INFORMAÇÃO ORDEM DE SERVIÇO */}
                <Section title="INFORMAÇÃO BÁSICA" layoutType="two-fixed">
                    <FormInput
                        label="Nº Ordem Serviço"
                        name="num_o_s"
                        value={formData.num_o_s}
                        onChange={handleChange}
                        type="text"
                        readOnly={true}
                        placeholder="Gerado automaticamente" />
                    <FormInput label="Nº Orçamento" name="num_orc" value={formData.num_orc} onChange={handleChange} type="text" />
                    <FormInput label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} required fullWidth />
                    <FormInput label="Descrição do Trabalho" name="desc_trab" value={formData.desc_trab} onChange={handleChange} isTextArea required fullWidth />
                    <SubGrid layoutType="three">
                        <FormInput label="Data de Abertura" name="data_aber" value={formData.data_aber} onChange={handleChange} type="date" required readOnly />
                        <FormInput label="Data de Receção" name="data_recep" value={formData.data_recep} onChange={handleChange} type="date" />
                        <CustomSelect
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            onChange={handleChange}
                            options={ESTADO_OPTIONS}
                            required
                            canCreate={true}
                            placeholder="Selecione..." />
                    </SubGrid>
                </Section>
                {/* 2. CARACTERÍSTICAS GERAIS */}
                <Section title="CARACTERÍSTICAS GERAIS" layoutType="two-fixed">
                    <SubGrid layoutType="three">
                        <CustomSelect
                            label="Formato"
                            name="formato"
                            value={formData.formato}
                            onChange={handleChange}
                            options={FORMATO_SUGGESTIONS}
                            placeholder="Selecione..."
                            required={false}
                            canCreate={true} />
                        <FormInput label="Nº Páginas" name="num_pag" value={formData.num_pag} onChange={handleChange} type="number" />
                        <FormInput label="Tiragem" name="tiragem" value={formData.tiragem} onChange={handleChange} type="number" />
                    </SubGrid>
                    <CustomSelect
                        label="Impressao"
                        name="impressao"
                        value={formData.impressao}
                        onChange={handleChange}
                        options={IMPRESSAO_OPTIONS}
                        required
                        canCreate={true}
                        placeholder="Selecione..." />
                    {/* CAMPO MÁQUINA (DINÂMICO) */}
                    <CustomSelect
                        label="Maquina"
                        name="maquina"
                        value={formData.maquina}
                        onChange={handleChange}
                        options={maquinaOptions} // Opções dinâmicas e restritas!
                        required={!isMaquinaDisabled} // Obrigatório se houver opções
                        canCreate={true}
                        placeholder={maquinaPlaceholder}
                        isDisabled={isMaquinaDisabled} />
                    <FormInput label="Observações Gerais" name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleChange} isTextArea fullWidth />
                </Section>
                {/* 3. CARACTERÍSTICAS MIOLO */}
                <Section title="CARACTERÍSTICAS MIOLO" layoutType="two-fixed">
                    <CustomSelect
                        label="Acabamento"
                        name="acabamento"
                        value={formData.acabamento}
                        onChange={handleChange}
                        options={ACABAMENTO_OPTIONS}
                        required
                        canCreate={true}
                        placeholder="Selecione..." />
                    <FormInput label="Cores" name="cores_miolo" value={formData.cores_miolo} onChange={handleChange} type="number" />
                    <SubGrid layoutType="three">
                        <FormInput label="Papel" name="papel_miolo" value={formData.papel_miolo} onChange={handleChange} />
                        <FormInput label="Gramagem" name="miolo_gramas" value={formData.miolo_gramas} onChange={handleChange} type="number" />
                        <FormInput label="Bobine" name="bobine_miolo" value={formData.bobine_miolo} onChange={handleChange} />
                    </SubGrid>

                    <div style={{
                        // ESTILOS DA BORDA
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '10px',
                        marginTop: '5px',
                        marginBottom: '15px',
                    }}>
                        <div style={{
                            // ESTILOS PARA ALINHAR OS TRÊS GRUPOS LADO A LADO
                            display: 'flex',
                            justifyContent: 'space-between', // Distribui o espaço entre os 3
                        }}>
                            <FormRadioGroup
                                label="Verniz"
                                name="verniz_miolo"
                                value={formData.verniz_miolo}
                                onChange={handleChange}
                                options={['SIM', 'NÃO']}
                            // required
                            />
                            <FormRadioGroup
                                label="Brilho/Mate"
                                name="verniz_miolo_brilho_mate"
                                value={formData.verniz_miolo_brilho_mate}
                                onChange={handleChange}
                                options={['BRILHO', 'MATE']}
                            // required
                            />
                            <FormRadioGroup
                                label="Geral/Reservado"
                                name="verniz_miolo_geral_reservado"
                                value={formData.verniz_miolo_geral_reservado}
                                onChange={handleChange}
                                options={['Geral', 'Reservado']}
                            // required
                            />
                        </div>
                    </div>
                    {/* <FormInput label="Verniz" name="verniz_miolo" value={formData.verniz_miolo} onChange={handleChange} /> */}
                    {/* <FormInput label="Brilho/Mate" name="verniz_miolo_brilho_mate" value={formData.verniz_miolo_brilho_mate} onChange={handleChange} />
                        <FormInput label="Geral/Reservado" name="verniz_miolo_geral_reservado" value={formData.verniz_miolo_geral_reservado} onChange={handleChange} /> */}
                    <FormInput label="Observações Miolo" name="observacoes_miolo" value={formData.observacoes_miolo} onChange={handleChange} isTextArea fullWidth />
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
                    <SubGrid layoutType="four" title="">
                        <FormInput label="Verniz" name="verniz_capa" value={formData.verniz_capa} onChange={handleChange} />
                        <FormInput label="Brilho/Mate" name="verniz_capa_brilho_mate" value={formData.verniz_capa_brilho_mate} onChange={handleChange} />
                        <FormInput label="Geral/Reservado" name="verniz_capa_geral_reservado" value={formData.verniz_capa_geral_reservado} onChange={handleChange} />
                        <FormInput label="Frente/Verso" name="verniz_capa_f_v" value={formData.verniz_capa_f_v} onChange={handleChange} />
                    </SubGrid>
                    <FormInput label="Observações Capa" name="observacoes_capa" value={formData.observacoes_capa} onChange={handleChange} isTextArea fullWidth />
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


                {/* WRAPPER PARA CENTRALIZAR OS BOTÕES */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <button
                        type="submit"
                        style={isSubmitDisabled ? { ...styles.submitButton, ...styles.submitButtonDisabled } : styles.submitButton}
                        disabled={isSubmitDisabled}  >
                        {loading ? 'A Enviar...' : osLoading ? 'A Carregar Nº OS...' : 'Criar Ordem Serviço'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        style={{ ...styles.cancelButton, marginTop: '10px' }}
                        disabled={loading || osLoading} >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}