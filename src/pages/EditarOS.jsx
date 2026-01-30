import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- CONSTANTES E CONFIGURAÇÕES (COPIADAS DE NovaOS.jsx) ---
const ESTADO_OPTIONS = ['ABERTA', 'PENDENTE', 'FECHADO'];
const FORMATO_SUGGESTIONS = ['A0 - 1189x841', 'A1 - 841x594', 'A2 - 594x420', 'A3 - 420x297', 'A4 - 297x210', 'A5 - 210x148', 'A6 - 148x105', 'A7 - 105x74', 'A8 - 74x52', 'A9 - 52x37', 'A10 - 37x26'];
const IMPRESSAO_OPTIONS = ['ROTATIVA', 'OFFSET', 'DIGITAL'];
const MAQUINA_MAPPING = {
    'ROTATIVA': ['KOMORI', 'ROLAND'],
    'OFFSET': ['PLANA (KOMORI)'],
    'DIGITAL': ['KONICA'],
    'N/A': [],
    'DEFAULT': []
};
const ACABAMENTO_OPTIONS = ['AGRAFADO', 'COLADO LOMBADA', 'CORTES RETOS', 'COSIDO', 'SEM ACABAMENTO', 'SERROTADO'];
const PAPEL_OPTIONS = ['AUTOCOLANTES', 'CARTE LUMINA', 'COUCHE MATE', 'COUCHE BRILHO', 'COUCHE SILK', 'CREATOR STAR', 'CARTOLINA FOLDING', 'CARTOLINA (Verso cinza)', 'ENVIPRESS', 'EAGLE CREAM', 'HOLMEN VIEW', 'IOR', 'LWC', 'NEWSPRESS', 'NEWSPRINT', 'OFFSET', 'OPALE TELADO', 'PAPEL RECICLADO', 'UNO FINESS GLOSS', 'UNO PRIME GLOSS', 'UNO BRIGHT SATIN', 'UNO PRIME SATIN', 'UNO WEB WHITE GLOSS', 'UNO WEB WHITE BULKY', 'UPM ULTRA GLOSS', 'UPM COTE ', 'UPM EXO 72 C', 'UPM ULTRA H', 'UPM ULTRA SILK', 'UPM SMART', 'UPM BRIGHT 68 C', 'R4 GLOSS', 'R4 CHORUS GLOSS', 'RESPECTA GLOSS', 'RIVES DESIGN', 'TUFFCOTE'];

// --- ESTILOS (IGUAIS AO NovaOS.jsx) ---
const styles = {
    container: { padding: '20px 10%', width: '100%', backgroundColor: '#f4f7f6', borderRadius: '8px', fontFamily: 'Inter, Arial, sans-serif', boxSizing: 'border-box' },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    section: { padding: '25px', border: '1px solid #e0e0e0', borderRadius: '6px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    sectionTitle: { borderBottom: '3px solid #3498db', paddingBottom: '10px', marginBottom: '20px', color: '#2c3e50', fontSize: '1.4em', fontWeight: '600' },
    label: { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#34495e', fontSize: '0.95em' },
    input: { width: '100%', padding: '12px 10px', boxSizing: 'border-box', border: '1px solid #bdc3c7', borderRadius: '4px', backgroundColor: '#fff' },
    readOnlyInput: { width: '100%', padding: '12px 10px', boxSizing: 'border-box', border: '1px solid #bdc3c7', borderRadius: '4px', backgroundColor: '#ecf0f1', color: '#7f8c8d', fontWeight: 'bold' },
    datalistInput: { width: '100%', padding: '12px 10px', boxSizing: 'border-box', border: '1px solid #bdc3c7', borderRadius: '4px', backgroundColor: '#fff', fontWeight: '600', color: '#2c3e50' },
    submitButton: { padding: '12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', fontWeight: 'bold', boxShadow: '0 4px #27ae60', width: '100%', maxWidth: '250px' },
    cancelButton: { padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '1em', boxShadow: '0 4px #c0392b', width: '100%', maxWidth: '250px' }
};

// --- COMPONENTES AUXILIARES (REUTILIZADOS) ---
const Section = ({ title, children, layoutType = 'two-fixed' }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: layoutType === 'four' ? 'repeat(auto-fit, minmax(200px, 1fr))' : 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {children}
        </div>
    </div>
);

const FormInput = ({ label, name, value, onChange, type = 'text', required = false, isTextArea = false, readOnly = false, fullWidth = false }) => (
    <div style={{ marginBottom: '10px', gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
        <label style={styles.label}>{label} {required && !readOnly && <span style={{ color: 'red' }}>*</span>}</label>
        {isTextArea ? (
            <textarea name={name} value={value || ''} onChange={onChange} style={{ ...styles.input, minHeight: '100px' }} rows="4" readOnly={readOnly} />
        ) : (
            <input type={type} name={name} value={value || ''} onChange={onChange} style={readOnly ? styles.readOnlyInput : styles.input} readOnly={readOnly} />
        )}
    </div>
);

const CustomSelect = ({ label, name, value, onChange, options, placeholder, canCreate = true, isDisabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value || '');
    const wrapperRef = useRef(null);
    useEffect(() => setSearchTerm(value || ''), [value]);
    const handleSelect = (option) => {
        onChange({ target: { name, value: option } });
        setSearchTerm(option);
        setIsOpen(false);
    };
    return (
        <div style={{ marginBottom: '10px', position: 'relative' }} ref={wrapperRef}>
            <label style={styles.label}>{label}</label>
            <input
                type="text"
                value={isDisabled ? '' : searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); if(canCreate) onChange(e); }}
                onClick={() => !isDisabled && setIsOpen(!isOpen)}
                style={styles.datalistInput}
                placeholder={isDisabled ? 'Selecione primeiro...' : placeholder}
                readOnly={!canCreate}
                disabled={isDisabled}
            />
            {isOpen && !isDisabled && (
                <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, border: '1px solid #ccc', backgroundColor: '#fff', maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                    {options.filter(o => o.toLowerCase().includes(searchTerm.toLowerCase())).map(o => (
                        <div key={o} onClick={() => handleSelect(o)} style={{ padding: '10px', cursor: 'pointer' }}>{o}</div>
                    ))}
                </div>
            )}
        </div>
    );
};

const FormRadioGroup_2 = ({ label, name, value, onChange, options, spacing }) => (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <label style={{ ...styles.label, fontSize: '0.9rem' }}>{label}</label>
        <div style={{ display: 'flex', gap: spacing || '20px' }}>
            {options.map(opt => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input type="radio" name={name} value={opt} checked={value === opt} onChange={onChange} />
                    <span style={{ color: '#2c3e50', fontWeight: '500' }}>{opt}</span>
                </label>
            ))}
        </div>
    </div>
);

const SubGrid_2 = ({ title, children }) => (
    <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
        {title && <h4 style={{ color: '#34495e', marginBottom: '15px', fontSize: '1.0em' }}>{title}</h4>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>{children}</div>
    </div>
);

const SubGrid = ({ children, layoutType = 'three' }) => (
    <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: `repeat(${layoutType === 'three' ? 3 : 2}, 1fr)`, gap: '20px' }}>
        {children}
    </div>
);




// --- COMPONENTE PRINCIPAL ---
export default function EditarOS() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Listas de campos para validação (IGUAL NovaOS)
    const camposEstritamenteNumericos = ['num_orc', 'num_pag', 'tiragem', 'cores_miolo', 'miolo_gramas', 'cores_capa', 'capa_gramas', 'provas_cor', 'ozalide_digital', 'provas_konica', 'quantidade_chapas'];
    const camposDecimais = ['lombada', 'tempo_operador'];


    if (user?.role === 'Viewer') {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: '#e74c3c' }}>Acesso Restrito</h2>
                <p>O seu perfil de visualizador não permite criar novas Ordens de Serviço.</p>
                <button 
                    onClick={() => navigate('/dashboard')}
                    style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px' }}
                >
                    Voltar ao Dashboard
                </button>
            </div>
        );
    }


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;
        if (camposEstritamenteNumericos.includes(name)) newValue = value.replace(/[^0-9]/g, '');
        else if (camposDecimais.includes(name)) newValue = value.replace(/[^0-9.]/g, '');
        setFormData(prev => ({ ...prev, [name]: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/os/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData),
            });
            if (response.ok) { alert('OS Atualizada!'); navigate('/dashboard'); }
        } catch (err) { alert('Erro na submissão'); }
        finally { setLoading(false); }
    };

    if (!formData) return <div style={{ padding: '50px', textAlign: 'center' }}>A carregar dados da Ordem de Serviço...</div>;

    return (
        <div style={styles.container}>



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
                Editar Ordem de Serviço {formData.num_o_s ? `#${formData.num_o_s}` : ''}
            </h2>


    <div style={{ display: 'flex', gap: '12px' }}>
        <button
            onClick={() => navigate(-1)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9em',
                transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#2c3e50'}
        >
            ← Voltar
        </button>

    </div>
</div>

            <form onSubmit={handleSubmit} style={styles.form}>
                
                <Section title="INFORMAÇÃO BÁSICA">
                    <FormInput label="Nº Ordem Serviço" name="num_o_s" value={formData.num_o_s} readOnly />
                    <FormInput label="Nº Orçamento" name="num_orc" value={formData.num_orc} onChange={handleChange} />
                    <FormInput label="Depósito Legal" name="deposito_legal" value={formData.deposito_legal} onChange={handleChange} />
                    <FormInput label="Cliente" name="cliente" value={formData.cliente} onChange={handleChange} required fullWidth />
                    <FormInput label="Descrição do Trabalho" name="desc_trab" value={formData.desc_trab} onChange={handleChange} isTextArea required fullWidth />
                    <SubGrid>
                        <FormInput label="Data de Abertura" name="data_aber" value={formData.data_aber ? formData.data_aber.slice(0,10) : ''} readOnly />
                        <FormInput label="Data de Receção" name="data_recep" value={formData.data_recep ? formData.data_recep.slice(0,10) : ''} onChange={handleChange} type="date" />
                        <CustomSelect label="Estado" name="estado" value={formData.estado} onChange={handleChange} options={ESTADO_OPTIONS} required />
                    </SubGrid>
                </Section>

                <Section title="CARACTERÍSTICAS GERAIS">
                    <SubGrid>
                        <CustomSelect label="Formato" name="formato" value={formData.formato} onChange={handleChange} options={FORMATO_SUGGESTIONS} />
                        <FormInput label="Nº Páginas" name="num_pag" value={formData.num_pag} onChange={handleChange} />
                        <FormInput label="Tiragem" name="tiragem" value={formData.tiragem} onChange={handleChange} />
                    </SubGrid>
                    <CustomSelect label="Impressão" name="impressao" value={formData.impressao} onChange={handleChange} options={IMPRESSAO_OPTIONS} />
                    <CustomSelect label="Máquina" name="maquina" value={formData.maquina} onChange={handleChange} options={MAQUINA_MAPPING[formData.impressao] || []} isDisabled={!formData.impressao} />
                    <FormInput label="Observações Gerais" name="observacoes_gerais" value={formData.observacoes_gerais} onChange={handleChange} isTextArea fullWidth />
                </Section>

                <Section title="CARACTERÍSTICAS MIOLO (definição papel)">
                    <CustomSelect label="Acabamento" name="acabamento" value={formData.acabamento} onChange={handleChange} options={ACABAMENTO_OPTIONS} />
                    <FormInput label="Cores" name="cores_miolo" value={formData.cores_miolo} onChange={handleChange} />
                    <SubGrid>
                        <CustomSelect label="Papel" name="papel_miolo" value={formData.papel_miolo} onChange={handleChange} options={PAPEL_OPTIONS} />
                        <FormInput label="Gramagem (g)" name="miolo_gramas" value={formData.miolo_gramas} onChange={handleChange} />
                        <FormInput label="Bobine (cm)" name="bobine_miolo" value={formData.bobine_miolo} onChange={handleChange} />
                    </SubGrid>
                    <SubGrid_2 title="Opções de Verniz">
                        <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', backgroundColor: '#fff', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '5rem', gridColumn: '1/-1' }}>
                            <FormRadioGroup_2 label="Verniz" name="verniz_miolo" value={formData.verniz_miolo} onChange={handleChange} options={['Sim', 'Não']} />
                            <FormRadioGroup_2 label="Brilho / Mate" name="verniz_miolo_brilho_mate" value={formData.verniz_miolo_brilho_mate} onChange={handleChange} options={['Brilho', 'Mate']} />
                            <FormRadioGroup_2 label="Geral / Reservado" name="verniz_miolo_geral_reservado" value={formData.verniz_miolo_geral_reservado} onChange={handleChange} options={['Geral', 'Reservado']} />
                        </div>
                    </SubGrid_2>
                    <FormInput label="Observações Miolo" name="observacoes_miolo" value={formData.observacoes_miolo} onChange={handleChange} isTextArea fullWidth />
                </Section>

                <Section title="CARACTERÍSTICAS CAPA">
                    <FormInput label="Lombada (mm)" name="lombada" value={formData.lombada} onChange={handleChange} />
                    <FormInput label="Cores" name="cores_capa" value={formData.cores_capa} onChange={handleChange} />
                    <SubGrid layoutType="three">
                        <CustomSelect label="Papel" name="papel_capa" value={formData.papel_capa} onChange={handleChange} options={PAPEL_OPTIONS} />
                        <FormInput label="Gramagem (g)" name="capa_gramas" value={formData.capa_gramas} onChange={handleChange} />
                        <FormInput label="Bobine (cm)" name="bobine_capa" value={formData.bobine_capa} onChange={handleChange} />
                    </SubGrid>
                    <SubGrid_2 title="Opções de Verniz">
                        <div style={{ border: '1px solid #d1d5db', borderRadius: '6px', padding: '1rem', backgroundColor: '#fff', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '5rem', gridColumn: '1/-1' }}>
                            <FormRadioGroup_2 label="Verniz" name="verniz_capa" value={formData.verniz_capa} onChange={handleChange} options={['Sim', 'Não']} />
                            <FormRadioGroup_2 label="Brilho / Mate" name="verniz_capa_brilho_mate" value={formData.verniz_capa_brilho_mate} onChange={handleChange} options={['Brilho', 'Mate']} />
                            <FormRadioGroup_2 label="Geral / Reservado" name="verniz_capa_geral_reservado" value={formData.verniz_capa_geral_reservado} onChange={handleChange} options={['Geral', 'Reservado']} />
                            <FormRadioGroup_2 label="Frente / Verso" name="verniz_capa_f_v" value={formData.verniz_capa_f_v} onChange={handleChange} options={['Frente', 'Verso']} />
                        </div>
                    </SubGrid_2>
                    <FormInput label="Observações Capa" name="observacoes_capa" value={formData.observacoes_capa} onChange={handleChange} isTextArea fullWidth />
                </Section>

                <Section title="INFORMAÇÃO PROVAS E CHAPAS" layoutType="four">
                    <FormInput label="N.º Provas Cor" name="provas_cor" value={formData.provas_cor} onChange={handleChange} />
                    <FormInput label="N.º Ozalide Digital" name="ozalide_digital" value={formData.ozalide_digital} onChange={handleChange} />
                    <FormInput label="Provas Konica" name="provas_konica" value={formData.provas_konica} onChange={handleChange} />
                    <FormInput label="N.º Chapas" name="quantidade_chapas" value={formData.quantidade_chapas} onChange={handleChange} />
                </Section>

                <Section title="ENTREGA/EXPEDIÇÃO">
                    <FormInput label="Local de Entrega" name="local_entrega" value={formData.local_entrega} onChange={handleChange} />
                    <FormInput label="Forma de Expedição" name="forma_expedicao" value={formData.forma_expedicao} onChange={handleChange} />
                </Section>

                <Section title="OPERADOR">
                    <FormInput label="Operador" name="operador" value={formData.operador} readOnly />
                    <FormInput label="Tempo (horas)" name="tempo_operador" value={formData.tempo_operador} onChange={handleChange} />
                </Section>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                    <button type="submit" style={styles.submitButton} disabled={loading}>{loading ? 'A Guardar...' : 'Guardar Alterações'}</button>
                    <button type="button" onClick={() => navigate('/dashboard')} style={{ ...styles.cancelButton, marginTop: '10px' }}>Cancelar</button>
                </div>
            </form>
        </div>
    );
}