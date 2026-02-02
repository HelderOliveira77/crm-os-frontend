import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ModeloGuia from '../assets/Ordem Servico.jpg';

// Componente com a função de imprimir
const handlePrint = () => {
    window.print();
};

// PARA FORMATAR A DATA PARA O FORMATO DD-MM-AAAA
const formatarData = (dataString) => {
    if (!dataString) return '---';
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    return `${dia}-${mes}-${ano}`;
};


// --- ESTILOS (IGUAIS AO NovaOS.jsx) ---
const styles = {
    container: { padding: '20px 10%', width: '100%', backgroundColor: '#f4f7f6', borderRadius: '8px', fontFamily: 'Inter, Arial, sans-serif', boxSizing: 'border-box' },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    section: { padding: '25px', border: '1px solid #e0e0e0', borderRadius: '6px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    sectionTitle: { borderBottom: '3px solid #3498db', paddingBottom: '10px', marginBottom: '20px', color: '#2c3e50', fontSize: '1.4em', fontWeight: '600' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#34495e', fontSize: '0.95em' },
    viewField: { width: '100%', padding: '12px 10px', border: '1px solid #bdc3c7', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#2c3e50', minHeight: '42px', display: 'flex', alignItems: 'center', boxSizing: 'border-box' },
    textAreaView: { width: '100%', padding: '12px 10px', border: '1px solid #bdc3c7', borderRadius: '4px', backgroundColor: '#f9f9f9', color: '#2c3e50', minHeight: '100px', whiteSpace: 'pre-wrap', boxSizing: 'border-box' },
    backButton: { padding: '10px', backgroundColor: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', width: '100%', maxWidth: '250px' },
    printButton: { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9em' }
};

// --- COMPONENTES DE ESTRUTURA (IGUAIS AO NovaOS.jsx) ---
const Section = ({ title, children, layoutType = 'two-fixed' }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <div style={{
            display: 'grid',
            gridTemplateColumns: layoutType === 'four' ? 'repeat(4, 1fr)' : 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
        }}>
            {children}
        </div>
    </div>
);

const SubGrid = ({ children, layoutType = 'three' }) => (
    <div style={{
        gridColumn: '1 / -1',
        display: 'grid',
        gridTemplateColumns: layoutType === 'three' ? '1fr 1fr 1fr' : '1fr 1fr',
        gap: '20px'
    }}>
        {children}
    </div>
);

const ViewField = ({ label, value, fullWidth = false, isTextArea = false }) => (
    <div style={{ marginBottom: '10px', gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
        <label style={styles.label}>{label}</label>
        <div style={isTextArea ? styles.textAreaView : styles.viewField}>
            {value || '---'}
        </div>
    </div>
);

const RadioDisplay = ({ label, value, options }) => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ ...styles.label, fontSize: '0.9rem' }}>{label}</label>
        <div style={{ display: 'flex', gap: '20px' }}>
            {options.map(opt => (
                <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: value === opt ? 1 : 0.3 }}>
                    <div style={{
                        width: '14px', height: '14px', borderRadius: '50%',
                        border: '2px solid #3498db',
                        backgroundColor: value === opt ? '#3498db' : 'transparent'
                    }} />
                    <span style={{ fontWeight: value === opt ? '700' : '400', color: '#2c3e50' }}>{opt}</span>
                </div>
            ))}
        </div>
    </div>
);

export default function VisualizarOS() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        const fetchOS = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/os/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setFormData(data);
                }
            } catch (err) { console.error(err); }
        };
        if (token) fetchOS();
    }, [id, token]);

    if (!formData) return <div style={{ padding: '50px', textAlign: 'center' }}>A carregar Ordem de Serviço...</div>;

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            {/* <div style={{ margin: 0, padding: 0 }}></div> */}
            {/* --- INTERFACE VISUAL DO BROWSER (NO-PRINT) --- */}

            <div className="no-print" style={styles.container}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '25px',
                    backgroundColor: '#fff',
                    padding: '15px 20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '1.6em' }}>
                        Consulta de Ordem de Serviço {formData.num_o_s ? `#${formData.num_o_s}` : ''}
                    </h2>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            onClick={() => navigate(-1)}
                            style={{ ...styles.backButton, width: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            ← Voltar
                        </button>

                        <button onClick={handlePrint} style={styles.printButton}>
                            Imprimir PDF
                        </button>
                    </div>
                </div>

                <div style={styles.form}>
                    {/* 1. INFORMAÇÃO BÁSICA */}
                    <Section title="INFORMAÇÃO BÁSICA">
                        <ViewField label="Nº Ordem Serviço" value={formData.num_o_s} />
                        <ViewField label="Nº Orçamento" value={formData.num_orc} />
                        <ViewField label="Depósito Legal" value={formData.deposito_legal} />
                        <ViewField label="Cliente" value={formData.cliente} fullWidth />
                        <ViewField label="Descrição do Trabalho" value={formData.desc_trab} isTextArea fullWidth />
                        <SubGrid>
                            <ViewField label="Data de Abertura" value={formData.data_aber?.slice(0, 10)} />
                            <ViewField label="Data de Receção" value={formData.data_recep?.slice(0, 10)} />
                            <ViewField label="Estado" value={formData.estado} />
                        </SubGrid>
                    </Section>

                    {/* 2. CARACTERÍSTICAS GERAIS */}
                    <Section title="CARACTERÍSTICAS GERAIS">
                        <SubGrid>
                            <ViewField label="Formato" value={formData.formato} />
                            <ViewField label="Nº Páginas" value={formData.num_pag} />
                            <ViewField label="Tiragem" value={formData.tiragem} />
                        </SubGrid>
                        <SubGrid>
                            <ViewField label="Impressão" value={formData.impressao} />
                            <ViewField label="Máquina" value={formData.maquina} />
                            <ViewField label="Lineatura" value={formData.lineatura} />
                        </SubGrid>
                        <ViewField label="Observações Gerais" value={formData.observacoes_gerais} isTextArea fullWidth />
                    </Section>

                    {/* 3. CARACTERÍSTICAS MIOLO */}
                    <Section title="CARACTERÍSTICAS MIOLO (definição papel)">
                        <ViewField label="Acabamento" value={formData.tipo_acabamento_miolo} />
                        <ViewField label="Cores" value={formData.cores_miolo} />
                        <SubGrid>
                            <ViewField label="Papel" value={formData.papel_miolo} />
                            <ViewField label="Gramagem (g)" value={formData.miolo_gramas} />
                            <ViewField label="Bobine (cm)" value={formData.bobine_miolo} />
                        </SubGrid>
                        <div style={{ gridColumn: '1 / -1', border: '1px solid #d1d5db', borderRadius: '6px', padding: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', backgroundColor: '#fff' }}>
                            <RadioDisplay label="Verniz" value={formData.verniz_miolo} options={['Sim', 'Não']} />
                            <RadioDisplay label="Brilho / Mate" value={formData.verniz_miolo_brilho_mate} options={['Brilho', 'Mate']} />
                            <RadioDisplay label="Geral / Reservado" value={formData.verniz_miolo_geral_reservado} options={['Geral', 'Reservado']} />
                        </div>
                        <ViewField label="Observações Miolo" value={formData.observacoes_miolo} isTextArea fullWidth />
                    </Section>

                    {/* 4. CARACTERÍSTICAS CAPA */}
                    <Section title="CARACTERÍSTICAS CAPA">
                        <ViewField label="Lombada (mm)" value={formData.lombada} />
                        <ViewField label="Cores" value={formData.cores_capa} />
                        <SubGrid>
                            <ViewField label="Papel" value={formData.papel_capa} />
                            <ViewField label="Gramagem (g)" value={formData.capa_gramas} />
                            <ViewField label="Bobine (cm)" value={formData.bobine_capa} />
                        </SubGrid>
                        <div style={{ gridColumn: '1 / -1', border: '1px solid #d1d5db', borderRadius: '6px', padding: '1.2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', backgroundColor: '#fff' }}>
                            <RadioDisplay label="Verniz" value={formData.verniz_capa} options={['Sim', 'Não']} />
                            <RadioDisplay label="Brilho / Mate" value={formData.verniz_capa_brilho_mate} options={['Brilho', 'Mate']} />
                            <RadioDisplay label="Geral / Reservado" value={formData.verniz_capa_geral_reservado} options={['Geral', 'Reservado']} />
                            <RadioDisplay label="Frente / Verso" value={formData.verniz_capa_f_v} options={['Frente', 'Verso']} />
                        </div>
                        <ViewField label="Observações Capa" value={formData.observacoes_capa} isTextArea fullWidth />
                    </Section>

                    {/* 5. INFORMAÇÃO PROVAS E CHAPAS */}
                    <Section title="INFORMAÇÃO PROVAS E CHAPAS" layoutType="four">
                        <ViewField label="N.º Provas Cor" value={formData.provas_cor} />
                        <ViewField label="N.º Ozalide Digital" value={formData.ozalide_digital} />
                        <ViewField label="Provas Konica" value={formData.provas_konica} />
                        <ViewField label="N.º Chapas" value={formData.quantidade_chapas} />
                    </Section>

                    {/* 6. ENTREGA/EXPEDIÇÃO */}
                    <Section title="ENTREGA/EXPEDIÇÃO">
                        <ViewField label="Local de Entrega" value={formData.local_entrega} />
                        <ViewField label="Forma de Expedição" value={formData.forma_expedicao} />
                    </Section>

                    {/* 7. OPERADOR */}
                    <Section title="OPERADOR">
                        <ViewField label="Operador" value={formData.operador} />
                        <ViewField label="Tempo (horas)" value={formData.tempo_operador} />
                    </Section>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px', gap: '10px' }}>
                        <button onClick={() => navigate('/dashboard')} style={styles.backButton}>Voltar</button>
                    </div>
                </div>
            </div>


            {/* --- ÁREA DE IMPRESSÃO (PRINT-AREA) --- */}
            <div className="print-area">
                <img src={ModeloGuia} className="guia-background" alt="Guia" />

                <span className="data-field" style={{ top: '12mm', left: '185mm' }}>{formData.num_o_s}</span>
                <span className="data-field" style={{ top: '32mm', left: '189mm', fontSize: '11px' }}>{formData.num_orc}</span>
                <span className="data-field" style={{ top: '25mm', left: '20mm' }}>{formData.cliente}</span>
                <span className="data-field" style={{ top: '32mm', left: '127mm', fontSize: '12px' }}> {formatarData(formData.data_recep)}</span>
                <span className="data-field" style={{ top: '32mm', left: '151mm', fontSize: '12px' }}> {formatarData(formData.data_aber)}</span>
                {/* DESCRIÇÃO DO TRABALHO (Múltiplas Linhas) */}
                <span className="data-field" style={{
                    top: '44mm',
                    left: '5mm',
                    width: '165mm',      // Limita a largura para não sair da folha
                    whiteSpace: 'normal', // Permite quebra de linha
                    lineHeight: '1.2',   // Ajusta o espaço entre as linhas da guia
                    display: 'block',
                    textAlign: 'justify',
                    fontSize: '12px',
                }}>
                    {formData.desc_trab}
                </span>
                <span className="data-field" style={{ top: '53mm', left: '80mm' }}>{formData.lineatura}</span>
                <span className="data-field" style={{ top: '65mm', left: '32mm' }}>{formData.cores_capa}</span>
                <span className="data-field" style={{ top: '70.5mm', left: '32mm' }}>{formData.cores_miolo}</span>
                <span className="data-field" style={{ top: '58.5mm', left: '80mm' }}>{formData.num_pag}</span>
                <span className="data-field" style={{ top: '64.75mm', left: '80mm' }}>{formData.lombada}</span>


               
                <span className="data-field" style={{ top: '45mm', left: '175mm' }}>{formData.formato}</span>
                {/* OBSERVAÇÕES GERAIS DO TRABALHO (Múltiplas Linhas) */}
                <span className="data-field" style={{
                    top: '88.5mm',
                    left: '5mm',
                    width: '165mm',      // Limita a largura para não sair da folha
                    whiteSpace: 'normal', // Permite quebra de linha
                    lineHeight: '1.1',   // Ajusta o espaço entre as linhas da guia
                    display: 'block',
                    textAlign: 'justify',
                    fontSize: '10.5px',
                }}>
                    {formData.observacoes_gerais}
                </span>




                {/* --- TEXTOS FIXOS (Criados por mim) --- */}
                <span className="data-field" style={{
                    top: '108.5mm',
                    left: '8mm',
                    // fontWeight: 'bold',
                    fontSize: '10.5pt',
                    // textDecoration: 'underline'
                }}>
                    Capa
                </span>
                <span className="data-field" style={{ top: '108.5mm', left: '27mm', fontSize: '10.5pt' }}>{formData.papel_capa}</span>
                <span className="data-field" style={{ top: '109mm', left: '77mm', fontSize: '9.5pt' }}>{formData.miolo_gramas}</span>
                <span className="data-field" style={{ top: '109mm', left: '89mm', fontSize: '9.5pt' }}>{formData.bobine_capa}</span>

                <span className="data-field" style={{
                    top: '113.5mm',
                    left: '8mm',
                    // fontWeight: 'bold',
                    fontSize: '10.5pt',
                    // textDecoration: 'underline'
                }}>
                    Miolo
                </span>
                <span className="data-field" style={{ top: '113.5mm', left: '27mm', fontSize: '10.5pt' }}>{formData.papel_miolo}</span>
                <span className="data-field" style={{ top: '114mm', left: '77mm', fontSize: '9.5pt' }}>{formData.miolo_gramas}</span>
                <span className="data-field" style={{ top: '114mm', left: '89mm', fontSize: '9.5pt' }}>{formData.bobine_miolo}</span>
                <span className="data-field" style={{ top: '113mm', left: '183mm' }}>{formData.tiragem}</span>






                <span className="data-field" style={{ top: '265mm', left: '40mm' }}>{formData.operador}</span>
            </div>

        </div>
    );
}