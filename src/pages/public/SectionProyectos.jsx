import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, Check, ArrowRight, Shield, Lock, Layers, Zap, 
  Droplets, Paintbrush, Box, Cpu, AlertTriangle, Trash2, Hammer, 
  Ruler, BookOpen 
} from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';
import { fmt, fmtUF, BackBtn } from './CotizadorPage';

// ─── ESTILOS BRUTALISTAS ARQUITECTÓNICOS V3 ──────────────────────────────
const ARCH_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700;800&family=JetBrains+Mono:wght@400;700;800&display=swap');

  .arch-font-head { font-family: 'Rajdhani', sans-serif; }
  .arch-font-mono { font-family: 'JetBrains Mono', monospace; }

  .arch-grid-bg {
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 24px 24px;
    background-position: center top;
  }

  /* TABS DE ETAPAS ESTRICTAS */
  .arch-stage-nav { display: flex; gap: 8px; margin-bottom: 40px; overflow-x: auto; padding-bottom: 8px; }
  .arch-stage-tab {
    flex: 1; min-width: 160px; background: #0a0a0a; border: 1px solid var(--border);
    padding: 14px; cursor: pointer; transition: all 0.3s; border-top: 4px solid transparent; opacity: 0.4;
  }
  .arch-stage-tab.completed { opacity: 1; border-top-color: var(--green); background: rgba(46,204,113,0.05); }
  .arch-stage-tab.active { opacity: 1; border-color: var(--gold); border-top-color: var(--gold); background: rgba(255,207,64,0.05); }
  .arch-stage-tab.locked { cursor: not-allowed; filter: grayscale(1); opacity: 0.2; }

  /* FASES LINEA DE ENSAMBLAJE */
  .arch-step-container {
    border-left: 2px dashed rgba(255,255,255,0.15); margin-left: 24px; padding-left: 32px; padding-bottom: 48px; position: relative;
    animation: fadeIn 0.4s ease-out forwards;
  }
  .arch-step-container:last-child { border-left-color: transparent; }

  .arch-step-marker {
    position: absolute; left: -21px; top: 0; width: 40px; height: 40px; background: #080808; border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 16px;
    color: var(--text3); transition: all 0.3s ease; transform: rotate(45deg);
  }
  .arch-step-marker > div { transform: rotate(-45deg); }
  .arch-step-container.active .arch-step-marker { border-color: var(--gold); color: var(--gold); box-shadow: 0 0 15px rgba(255, 207, 64, 0.2); }
  .arch-step-container.completed .arch-step-marker { background: var(--gold); border-color: var(--gold); color: #000; }

  /* TARJETAS DE OPCIÓN */
  .arch-card {
    background: #0a0a0a; border: 1px solid var(--border); padding: 20px; cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden;
  }
  .arch-card:hover { border-color: rgba(255, 207, 64, 0.5); transform: translateY(-2px); }
  .arch-card.selected { border-color: var(--gold); background: rgba(255, 207, 64, 0.04); box-shadow: 4px 4px 0px var(--gold); }

  .arch-spec-tag {
    display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    padding: 4px 8px; font-size: 10px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; color: var(--text2); margin-right: 6px; margin-bottom: 6px;
  }

  .conditional-badge {
    position: absolute; top: -10px; right: 20px; background: var(--gold); color: #000;
    padding: 2px 10px; font-size: 9px; font-weight: 800; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; box-shadow: 2px 2px 0 #fff;
  }

  .arch-ticket { background: #050505; border: 1px solid var(--border); border-top: 4px solid var(--gold); padding: 24px; position: sticky; top: 80px; }
  .arch-ticket-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-family: 'JetBrains Mono', monospace; font-size: 12px; }

  .diario-obra-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); padding: 16px; margin-top: 24px; border-left: 3px solid var(--gold); }
  .diario-item { font-size: 11px; color: var(--text2); line-height: 1.5; margin-bottom: 8px; font-family: 'JetBrains Mono', monospace; }
  .diario-item strong { color: var(--gold); font-weight: 700; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

// ─── MOTOR DE INGENIERÍA: SEGUNDOS PISOS (Basado en el Prompt Maestro) ───
const ADVANCED_STAGES_SEGUNDO_PISO = [
  {
    id: 'stage_0', title: 'FASE -1 Y 0: EVALUACIÓN Y DESARME', icon: <Ruler size={16}/>,
    phases: [
      {
        id: 'fase_muros_base', title: 'Capacidad Muros 1er Piso', icon: <Layers size={18}/>,
        desc: 'Diagnóstico del sistema constructivo existente para soporte directo.',
        options: [
          { id: 'opt_mb_confinada', nombre: 'Albañilería Confinada', costoTotal_uf: 0, unidad: 'global', desc: 'Muros con cadenas y pilares. Soporta estructura liviana.', specs: ['Estructura Apta'], implication: 'Permite construir directamente sobre la corona del primer piso sin fundaciones nuevas.' },
          { id: 'opt_mb_adobe', nombre: 'Adobe / Sin Cadenas', costoTotal_uf: 12.0, unidad: 'global', desc: 'Requiere evaluación de ingeniero y refuerzo estructural perimetral independiente.', specs: ['Requiere Refuerzo'], implication: 'La estructura de adobe no puede recibir carga viva. Se cotiza exoesqueleto de refuerzo.' }
        ]
      },
      {
        id: 'fase_tablero', title: 'Capacidad Tablero Eléctrico', icon: <Zap size={18}/>,
        desc: 'Un segundo piso agrega 8-14 circuitos. Evaluamos la matriz actual.',
        options: [
          { id: 'opt_tab_ok', nombre: 'Tablero Existente con Capacidad', costoTotal_uf: 0.8, unidad: 'global', desc: 'Se instala sub-tablero conectado al general.', specs: ['Sub-Tablero'], implication: 'Ahorro en recableado desde empalme municipal.' },
          { id: 'opt_tab_new', nombre: 'Reemplazo Tablero General', costoTotal_uf: 3.5, unidad: 'global', desc: 'Cambio de matriz y disyuntores para soportar nueva carga.', specs: ['Norma SEC'], implication: 'Garantiza que la casa entera no sufrirá cortes por sobrecarga de las nuevas instalaciones.' }
        ]
      },
      {
        id: 'fase_encarpado', title: 'Protección y Encarpado Estructural', icon: <Shield size={18}/>,
        desc: 'No es un toldo. Es un sistema que soporta viento/lluvia durante semanas.',
        isWarning: true,
        options: [
          { id: 'opt_encarpado', nombre: 'Encarpado de Alta Resistencia', costoTotal_uf: 0.45, unidad: 'm²', desc: 'Protección total de la huella del primer piso. Costo fijo no negociable.', specs: ['Impermeable', 'Viento'], implication: 'Asegura que el retiro del techo no causará daños por humedad en cielos y muebles del 1er piso.' }
        ]
      },
      {
        id: 'fase_desarme', title: 'Retiro de Techo Actual', icon: <Trash2 size={18}/>,
        desc: 'Operación por capas (cubierta, hojalatería, costaneras, cerchas).',
        options: [
          { id: 'opt_des_reutilizar', nombre: 'Desarme Salvando Cerchas', costoTotal_uf: 0.6, unidad: 'm²', desc: 'Retiro cuidadoso. Si las vigas están sanas, se reutilizan.', specs: ['Desarme Lento'], implication: 'Reduce costos en Fase 3, pero asume que la madera existente no tiene termitas o fatiga.' },
          { id: 'opt_des_total', nombre: 'Desarme y Retiro a Botadero', costoTotal_uf: 1.2, unidad: 'm²', desc: 'Desarme completo e instalación de tolvas certificadas.', specs: ['Tolva', 'Certificado'], implication: 'Permite diseñar una techumbre 100% nueva y optimizada para el nuevo uso.' }
        ]
      }
    ]
  },
  {
    id: 'stage_1', title: 'FASE 1 Y 2: ESTRUCTURA HORIZONTAL Y VERTICAL', icon: <Box size={16}/>,
    phases: [
      {
        id: 'fase_entrepiso', title: 'Sistema de Entrepiso (Luz Libre)', icon: <Layers size={18}/>,
        desc: 'Depende de la distancia sin apoyos. Incluye placa 20mm y adhesivo elastomérico antirruido.',
        options: [
          { id: 'opt_ep_2x8', nombre: 'Luz < 4m: Pino 2x8"', costoTotal_uf: 1.8, unidad: 'm²', desc: 'Viguetas estándar con placa OSB 18mm y conectores Simpson.', specs: ['Pino 2x8', 'Luz Corta'], implication: 'Solución eficiente, pero limita el uso de terminaciones pesadas sin reducir el espaciado.' },
          { id: 'opt_ep_ijoist', nombre: 'Luz > 4.5m: Vigas I-Joist', costoTotal_uf: 2.8, unidad: 'm²', desc: 'Madera de ingeniería o acero. Cero deformación.', specs: ['I-Joist/Metal', 'Luz Larga'], implication: 'Estructura rígida de alto nivel. Habilita instalación de cerámicas pesadas sin riesgo de deflexión.' }
        ]
      },
      {
        id: 'fase_cadeneteado', title: 'Refuerzo de Rigidez (Blocking)', icon: <AlertTriangle size={18}/>,
        desc: 'Decisión clave condicionada por el tipo de piso final que se desee.',
        options: [
          { id: 'opt_block_60', nombre: 'Cadeneteado a 60cm (Flotantes/Vinílicos)', costoTotal_uf: 0, unidad: 'm²', desc: 'Estándar para pisos flexibles.', specs: ['Apto Flotante'], implication: 'Si en el futuro deseas instalar porcelanato, este piso crujirá. Solo apto para pisos ligeros.' },
          { id: 'opt_block_40', nombre: 'Cadeneteado a 40cm + Capa Niveladora', costoTotal_uf: 0.5, unidad: 'm²', desc: 'Refuerzo extremo. Requisito estricto si habrá cerámica o porcelanato.', specs: ['Apto Porcelanato'], implication: 'Rigidez absoluta. Esta es una decisión estructural que habilita opciones premium en Fase 4.' }
        ]
      },
      {
        id: 'fase_muros_vert', title: 'Muros Perimetrales (Estructura)', icon: <Box size={18}/>,
        desc: 'Impacta directamente la capacidad térmica de la casa.',
        options: [
          { id: 'opt_mv_metalcon', nombre: 'Metalcon Estructural 89mm', costoTotal_uf: 1.55, unidad: 'm²', desc: 'Acero galvanizado. Recto, no se tuerce.', specs: ['Metalcon'], implication: 'Construcción rápida y muros perfectamente aplomados. Requiere barrera térmica estricta por puente térmico del acero.' },
          { id: 'opt_mv_madera', nombre: 'Madera Pino 2x6"', costoTotal_uf: 1.70, unidad: 'm²', desc: 'Permite hasta 140mm de aislación térmica en cavidades.', specs: ['Pino 2x6"'], implication: 'Excelente comportamiento térmico natural. Ideal para asegurar calificación de eficiencia energética.' }
        ]
      },
      {
        id: 'fase_arriostramiento', title: 'Arriostramiento Sísmico', icon: <Shield size={18}/>,
        desc: 'Obligatorio Norma Chile (Sismicidad Categoría 3).',
        isWarning: true,
        options: [
          { id: 'opt_osb_11', nombre: 'Placa OSB Estructural 11.1mm', costoTotal_uf: 0.35, unidad: 'm²', desc: 'Piel perimetral exterior fijada estructuralmente.', specs: ['Norma Sismo'], implication: 'Garantiza que el piso superior se comportará como un bloque sólido durante un terremoto sin colapsar.' }
        ]
      }
    ]
  },
  {
    id: 'stage_2', title: 'FASE 3 Y 5: CUBIERTA E INSTALACIONES', icon: <Cpu size={16}/>,
    phases: [
      {
        id: 'fase_cubierta', title: 'Tipo de Cubierta', icon: <Droplets size={18}/>,
        desc: 'Afecta la pendiente, hojalatería y estructura (costaneras).',
        options: [
          { id: 'opt_cub_zinc', nombre: 'Zinc Alum PV4 Prepintado', costoTotal_uf: 0.65, unidad: 'm²', desc: 'Económico, costaneras cada 80cm.', specs: ['Zinc 0.4mm'], implication: 'Bajo peso estructural. Mayor ruido de impacto por lluvias.' },
          { id: 'opt_cub_teja', nombre: 'Teja Asfáltica + OSB Base', costoTotal_uf: 1.30, unidad: 'm²', desc: 'Requiere base de OSB continua y mayor densidad de costaneras.', specs: ['Silencioso'], implication: 'Otorga un look premium y aísla acústicamente. La estructura del techo se calculó más robusta para soportarla.' }
        ]
      },
      {
        id: 'fase_barrera_agua', title: 'Barrera de Humedad Exterior', icon: <Layers size={18}/>,
        desc: 'El sello bajo el revestimiento exterior de los muros.',
        options: [
          { id: 'opt_barr_fieltro', nombre: 'Fieltro Asfáltico 15 Lbs', costoTotal_uf: 0.12, unidad: 'm²', desc: 'Corta agua y viento, pero no respira bien.', specs: ['Básico'], implication: 'Solución tradicional funcional, pero el muro tiene menor capacidad para secarse si entra vapor.' },
          { id: 'opt_barr_tyvek', nombre: 'Membrana Respirable (Tyvek)', costoTotal_uf: 0.25, unidad: 'm²', desc: 'Deja salir el vapor interior evitando hongos en tabiques.', specs: ['Respirable', 'Premium'], implication: 'Protege la vida útil de la estructura de madera o metal impidiendo pudrición oculta.' }
        ]
      },
      {
        id: 'fase_prueba_hidro', title: 'Prueba de Presión Hidráulica', icon: <AlertTriangle size={18}/>,
        desc: 'Hito crítico de instalaciones antes de tapar muros.',
        isWarning: true,
        options: [
          { id: 'opt_hidro_24h', nombre: 'Prueba Sellada 24 Horas', costoTotal_uf: 0.1, unidad: 'm²', desc: 'Llenado a presión de cañerías. Prohibido emplacar antes de aprobar.', specs: ['Cero Fugas'], implication: 'Garantía absoluta de que no habrá filtraciones destructivas una vez entregada la obra.' }
        ]
      }
    ]
  },
  {
    id: 'stage_3', title: 'FASE 4 Y 6: TERMINACIONES Y CIERRES', icon: <Paintbrush size={16}/>,
    phases: [
      {
        id: 'fase_piso_terminacion', title: 'Revestimiento de Piso', icon: <Layers size={18}/>,
        desc: 'Capa final estética.',
        options: [
          { id: 'opt_term_flotante', nombre: 'Piso Flotante AC4 o Vinílico SPC', costoTotal_uf: 0.55, unidad: 'm²', desc: 'Instalación rápida, cálido al pie.', specs: ['Flotante/SPC'], implication: 'Aprovecha la instalación de cadeneteado estándar de la Fase 1.' },
          { id: 'opt_term_porcelanato', nombre: 'Porcelanato (Requiere Fase 1 a 40cm)', costoTotal_uf: 1.10, unidad: 'm²', desc: 'Requiere estructura rígida.', specs: ['Porcelanato'], implication: 'Solo es viable técnica y estructuralmente si se seleccionó el refuerzo de Cadeneteado a 40cm.' }
        ]
      },
      {
        id: 'fase_aislacion_acustica', title: 'Aislación Muros Divisorios', icon: <Box size={18}/>,
        desc: 'Separación acústica entre habitaciones.',
        options: [
          { id: 'opt_aisl_term', nombre: 'Lana Mineral Simple 50mm', costoTotal_uf: 0.35, unidad: 'm²', desc: 'Aislación térmica, bajo aislamiento acústico.', specs: ['Estándar'], implication: 'Ruido de voces o TV será parcialmente audible entre habitaciones contiguas.' },
          { id: 'opt_aisl_acust', nombre: 'Acústico: Doble Placa + Fieltro', costoTotal_uf: 0.85, unidad: 'm²', desc: 'Corte de puente acústico y masa adicional.', specs: ['Hotel Grade'], implication: 'Privacidad sonora superior. Requiere desconexión estructural de montantes.' }
        ]
      },
      {
        id: 'fase_bano', title: 'Impermeabilización Baño Principal', icon: <Droplets size={18}/>,
        desc: 'Tratamiento zona húmeda antes de cerámicas.',
        options: [
          { id: 'opt_bano_rh', nombre: 'Volcanita RH + Sello Acrílico', costoTotal_uf: 0.6, unidad: 'm²', desc: 'Placa verde antihumedad estándar.', specs: ['Placa RH'], implication: 'Resiste humedad ambiente del vapor de ducha.' },
          { id: 'opt_bano_membrana', nombre: 'Membrana Líquida Poliuretánica Piso/Muro', costoTotal_uf: 1.2, unidad: 'm²', desc: 'Sello de goma total antes de instalación de receptáculo.', specs: ['Waterproof Total'], implication: 'Elimina el 100% del riesgo de que el baño del segundo piso filtre hacia el living del primero.' }
        ]
      }
    ]
  }
];

const SectionProyectos = ({ step, goStep, projCatId, setProjCatId, projSel, setProjSel, m2, setM2 }) => {
  // Aseguramos que la llave coincida exactamente con tu base de datos "segundos_pisos"
  const isSegundoPiso = projCatId === 'segundos_pisos'; 
  const projCat = projCatId ? PROYECTOS_DATA[projCatId] : null;
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  const getVisiblePhases = (stage) => stage.phases.filter(phase => phase.condition ? phase.condition(projSel) : true);
  const checkStageComplete = (stage) => getVisiblePhases(stage).every(phase => projSel[phase.id]);

  const calculateTotalUF = () => {
    if (!isSegundoPiso) return Object.values(projSel).reduce((s, it) => s + (it.costoTotal_uf ?? it.ufRef ?? 0), 0) * m2;
    let total = 0;
    ADVANCED_STAGES_SEGUNDO_PISO.forEach(stage => {
      getVisiblePhases(stage).forEach(phase => {
        const sel = projSel[phase.id];
        if (sel) {
          const multiplier = sel.unidad === 'global' ? 1 : m2;
          total += (sel.costoTotal_uf * multiplier);
        }
      });
    });
    return total;
  };

  // VISTA 1: MENÚ MACRO DE PROYECTOS
  if (step === 2) {
    return (
      <div className="fade-up">
        <style>{ARCH_CSS}</style>
        <BackBtn onClick={() => goStep(1)}/>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:12 }}>Ingeniería & Proyectos</div>
          <h1 className="arch-font-head" style={{ fontWeight:900, fontSize:'clamp(36px,5vw,68px)', textTransform:'uppercase', lineHeight:.9, marginBottom:14 }}>
            Elige tu<br/><em style={{ color:'var(--gold)', fontStyle:'normal' }}>Obra Mayor</em>
          </h1>
          <p style={{ color:'var(--text3)', fontSize:14, maxWidth:520 }}>
            No mostramos precios ficticios. Ingresa al Configurador Arquitectónico, responde en orden las decisiones estructurales y obtén un presupuesto técnico al milímetro.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {Object.entries(PROYECTOS_DATA).map(([key, cat], i) => (
            <button key={key} className="arch-card arch-grid-bg fade-up" style={{ animationDelay:`${i*.1}s`, borderRadius: 'var(--r-xl)', padding: '32px 28px', textAlign: 'left' }}
              onClick={() => { setProjCatId(key); setProjSel({}); setActiveStageIdx(0); goStep(2.5); }}>
              <div style={{ fontSize:36, marginBottom:12 }}>{cat.emoji}</div>
              <h3 className="arch-font-head" style={{ fontWeight:800, fontSize:28, textTransform:'uppercase', color:'#fff', lineHeight:1, marginBottom:8 }}>{cat.label}</h3>
              <p style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6, marginBottom:16 }}>{cat.desc}</p>
              <div className="arch-font-mono" style={{ fontSize:11, color:'var(--gold)', fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                INICIAR MOTOR CONFIGURADOR <ArrowRight size={13}/>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // VISTA 2: CONFIGURADOR AVANZADO
  if (step === 2.5 && projCat) {
    const isSpecialConfig = isSegundoPiso;
    const itemsList = isSpecialConfig ? [] : (projCat.items ?? projCat.subItems ?? []);
    const currentStageObj = isSpecialConfig ? ADVANCED_STAGES_SEGUNDO_PISO[activeStageIdx] : null;
    const visiblePhases = isSpecialConfig ? getVisiblePhases(currentStageObj) : [];
    const isCurrentStageDone = isSpecialConfig ? checkStageComplete(currentStageObj) : true;
    const totalUF = calculateTotalUF();

    return (
      <div className="fade-up arch-root">
        <style>{ARCH_CSS}</style>
        <BackBtn onClick={() => { goStep(2); setProjCatId(null); setProjSel({}); }}/>
        
        {/* HEADER & SUPERFICIE */}
        <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap', marginBottom:32 }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div className="arch-font-mono" style={{ fontSize:11, color:'var(--text3)', fontWeight:700, letterSpacing:'.1em', marginBottom:6 }}>
              {projCat.emoji} SECUENCIA ESTRUCTURAL // {projCat.label.toUpperCase()}
            </div>
            <h1 className="arch-font-head" style={{ fontWeight:800, fontSize:'clamp(32px,4vw,56px)', textTransform:'uppercase', lineHeight:.9, marginBottom:12, color:'#fff' }}>
              Configurador<br/><span style={{ color:'var(--gold)' }}>Avanzado</span>
            </h1>
          </div>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', padding:24, minWidth:260, position:'relative' }}>
            <div className="arch-grid-bg" style={{ position:'absolute', inset:0, opacity:0.5, pointerEvents:'none' }}/>
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ fontSize:10, color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.15em', marginBottom:12, display:'flex', justifyContent:'space-between' }}>
                <span>Superficie Base</span>
                <span className="arch-font-mono" style={{ color:'var(--gold)' }}>[ M² ]</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <button onClick={() => setM2(p => Math.max(20,p-5))} style={{ width:40, height:40, background:'#111', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontSize:20, fontFamily:'var(--f-mono)' }}>-</button>
                <input type="number" value={m2} min={20} max={200} onChange={e => setM2(Number(e.target.value)||20)} 
                  style={{ flex:1, height:40, background:'#000', border:'1px solid var(--gold)', color:'var(--gold)', fontSize:24, fontWeight:800, textAlign:'center', outline:'none', fontFamily:'var(--f-mono)' }}/>
                <button onClick={() => setM2(p => Math.min(200,p+5))} style={{ width:40, height:40, background:'#111', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontSize:20, fontFamily:'var(--f-mono)' }}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN ESTRICTA (TABS) */}
        {isSpecialConfig && (
          <div className="arch-stage-nav">
            {ADVANCED_STAGES_SEGUNDO_PISO.map((stage, idx) => {
              const isCurrent = idx === activeStageIdx;
              const isLocked = idx > activeStageIdx && !checkStageComplete(ADVANCED_STAGES_SEGUNDO_PISO[idx-1]);
              const isCompleted = checkStageComplete(stage);
              return (
                <div key={stage.id} className={`arch-stage-tab ${isCurrent ? 'active' : ''} ${isCompleted && !isCurrent ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                     onClick={() => { if (!isLocked) setActiveStageIdx(idx); }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                    <span className="arch-font-mono" style={{ fontSize:10, color: isCurrent ? 'var(--gold)' : 'var(--text3)' }}>FASE {idx}</span>
                    {isCompleted && !isCurrent && <Check size={14} color="var(--green)"/>}
                    {isLocked && <Lock size={12} color="var(--text3)"/>}
                  </div>
                  <div className="arch-font-head" style={{ fontSize:14, fontWeight:700, color:'#fff', textTransform:'uppercase' }}>{stage.title}</div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr minmax(320px, 360px)', gap:48, alignItems:'start' }}>
          
          {/* PANEL IZQUIERDO: DECISIONES ESTRUCTURALES Y OPCIONES */}
          <div>
            {isSpecialConfig ? (
              visiblePhases.map((phase, index) => {
                const selection = projSel[phase.id];
                return (
                  <div key={phase.id} className={`arch-step-container ${selection ? 'completed' : 'active'}`}>
                    <div className="arch-step-marker"><div>{selection ? <Check size={18} strokeWidth={4}/> : (index + 1)}</div></div>
                    
                    <div style={{ marginBottom: 20, position:'relative' }}>
                      {phase.isWarning && <div className="conditional-badge">ESTÁNDAR EXIGIDO</div>}
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                        <span style={{ color: 'var(--gold)' }}>{phase.icon}</span>
                        <h2 className="arch-font-head" style={{ fontSize:22, fontWeight:800, textTransform:'uppercase', color: '#fff', margin:0 }}>{phase.title}</h2>
                      </div>
                      <p style={{ fontSize:13, color:'var(--text3)', margin:0 }}>{phase.desc}</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
                      {phase.options.map((opt) => {
                        const isSelected = selection?.id === opt.id;
                        return (
                          <div key={opt.id} className={`arch-card ${isSelected ? 'selected' : ''}`}
                               onClick={() => setProjSel(prev => ({ ...prev, [phase.id]: { ...opt, grupo: phase.title } })) }>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                              <div className="arch-font-head" style={{ fontSize:18, fontWeight:700, color: isSelected ? 'var(--gold)' : '#fff', lineHeight:1.1, paddingRight:10 }}>{opt.nombre}</div>
                              <div style={{ width:18, height:18, border:'1px solid var(--border)', background: isSelected ? 'var(--gold)' : 'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {isSelected && <Check size={12} color="#000" strokeWidth={4}/>}
                              </div>
                            </div>
                            
                            <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5, marginBottom:16, minHeight:54 }}>{opt.desc}</p>
                            <div style={{ display:'flex', flexWrap:'wrap', marginBottom:16 }}>
                              {opt.specs.map(spec => <span key={spec} className="arch-spec-tag">{spec}</span>)}
                            </div>

                            <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                              <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)' }}>IMPACTO FASE</div>
                              <div className="arch-font-mono" style={{ fontSize:16, fontWeight:700, color: isSelected ? 'var(--gold)' : 'var(--text2)' }}>
                                {opt.costoTotal_uf === 0 ? 'INCLUIDO' : `+${fmtUF(opt.costoTotal_uf)}`} <span style={{ fontSize:10 }}>{opt.costoTotal_uf !== 0 ? (opt.unidad === 'global' ? 'UF TOTAL' : `UF/${opt.unidad}`) : ''}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              // MODO LISTA NORMAL (Para ampliaciones, quinchos, etc.)
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {itemsList.map(it => {
                  const key = `${it.nombre}_${it.id}`;
                  const sel = !!projSel[key];
                  return (
                    <div key={it.id} className={`arch-card ${sel ? 'selected' : ''}`} style={{ padding:'16px' }}
                      onClick={() => setProjSel(prev => { const n = { ...prev }; if (n[key]) delete n[key]; else n[key] = { ...it, qty:1, grupo: it.nombre }; return n; })}>
                      <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                        <div style={{ width:20, height:20, border:`1px solid ${sel ? 'var(--gold)' : 'var(--border)'}`, background:sel ? 'var(--gold)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                          {sel && <Check size={14} color="#000" strokeWidth={3}/>}
                        </div>
                        <div style={{ flex:1 }}>
                          <div className="arch-font-head" style={{ fontSize:16, fontWeight:700, color:'#fff' }}>{it.nombre}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div className="arch-font-mono" style={{ fontSize:18, fontWeight:700, color: sel ? 'var(--gold)' : 'var(--text3)' }}>{fmtUF(it.ufRef)} UF</div>
                          <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)' }}>/{it.unidad}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* BOTÓN SIGUIENTE ETAPA */}
            {isSpecialConfig && (
              <div style={{ marginTop: 20, textAlign:'right' }}>
                {activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 ? (
                  <button disabled={!isCurrentStageDone} onClick={() => setActiveStageIdx(p => p + 1)}
                    style={{ padding:'14px 28px', background: isCurrentStageDone ? '#fff' : '#222', color: isCurrentStageDone ? '#000' : '#666', border:'none', fontFamily:'var(--f-mono)', fontWeight:800, fontSize:13, cursor: isCurrentStageDone ? 'pointer' : 'not-allowed', display:'inline-flex', alignItems:'center', gap:8, transition: 'all 0.3s' }}>
                    CONFIRMAR DECISIONES ESTRUCTURALES <ArrowRight size={14}/>
                  </button>
                ) : (
                  <div className="arch-font-mono" style={{ color:'var(--green)', fontSize:13, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:8 }}><Check size={16}/> MATRIZ DE PROYECTO COMPLETADA</div>
                )}
              </div>
            )}
          </div>

          {/* PANEL DERECHO: TICKET Y DIARIO DE OBRA */}
          <div className="arch-ticket">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Zap size={18} color="var(--gold)"/>
              <div className="arch-font-head" style={{ fontSize:16, fontWeight:800, letterSpacing:'.1em', color:'#fff', textTransform:'uppercase' }}>Plano Oficial</div>
            </div>

            <div style={{ marginBottom:24 }}>
              <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)', marginBottom:8, borderBottom:'1px solid var(--border)', paddingBottom:4 }}>DESGLOSE DE ENSAMBLAJE</div>
              {isSpecialConfig ? (
                ADVANCED_STAGES_SEGUNDO_PISO.map((stage) => {
                  const validPhases = getVisiblePhases(stage).filter(p => projSel[p.id]);
                  if (validPhases.length === 0) return null;
                  return (
                    <div key={stage.id} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--f-mono)', marginBottom:4 }}>// {stage.title}</div>
                      {validPhases.map(phase => {
                        const sel = projSel[phase.id];
                        const subtotal = sel.unidad === 'global' ? sel.costoTotal_uf : sel.costoTotal_uf * m2;
                        return (
                          <div key={phase.id} className="arch-ticket-row" style={{ padding:'6px 0', border:'none' }}>
                            <div style={{ color:'var(--text2)' }}>{sel.nombre.substring(0, 22)}...</div>
                            <div style={{ color:'#fff' }}>{subtotal === 0 ? 'BASE' : fmtUF(subtotal)} UF</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              ) : (
                Object.values(projSel).map((sel) => (
                  <div key={sel.id} className="arch-ticket-row" style={{ padding:'6px 0', border:'none' }}>
                    <div style={{ color:'var(--text2)' }}>{sel.nombre.substring(0, 22)}...</div>
                    <div style={{ color:'#fff' }}>{fmtUF((sel.costoTotal_uf ?? sel.ufRef ?? 0) * m2)} UF</div>
                  </div>
                ))
              )}
            </div>

            <div style={{ borderTop:'2px solid var(--border)', paddingTop:16, marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div><div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)' }}>INVERSIÓN TOTAL ESTIMADA</div></div>
                <div style={{ textAlign:'right' }}>
                  <div className="arch-font-mono" style={{ fontSize:32, fontWeight:800, color:'var(--gold)', lineHeight:1 }}>{fmtUF(totalUF)} <span style={{ fontSize:14 }}>UF</span></div>
                  <div style={{ fontSize:11, color:'var(--text3)', fontFamily:'var(--f-mono)', marginTop:4 }}>$ {fmt(totalUF * UF_VALOR)} CLP</div>
                </div>
              </div>
            </div>

            {/* DIARIO DE OBRA (CONSECUENCIAS ESTRUCTURALES) */}
            {isSpecialConfig && Object.keys(projSel).length > 0 && (
              <div className="diario-obra-panel">
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12, color:'var(--gold)' }}>
                  <BookOpen size={14}/><span className="arch-font-head" style={{ fontSize:12, fontWeight:800, letterSpacing:'.05em' }}>DIARIO DE OBRA (CONSECUENCIAS)</span>
                </div>
                {ADVANCED_STAGES_SEGUNDO_PISO.map(stage => 
                  getVisiblePhases(stage).map(phase => {
                    const sel = projSel[phase.id];
                    if (sel && sel.implication) {
                      return (
                        <div key={`imp_${phase.id}`} className="diario-item">
                          <strong>{sel.nombre}:</strong> {sel.implication}
                        </div>
                      );
                    }
                    return null;
                  })
                )}
              </div>
            )}

            <button onClick={() => goStep(3)} disabled={isSpecialConfig && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone}
              style={{ width:'100%', padding:'16px', marginTop: 24, background: 'var(--gold)', color: '#000', border:'none', fontWeight:800, fontSize:14, cursor: (isSpecialConfig && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone) ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'var(--f-mono)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity: (isSpecialConfig && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone) ? 0.3 : 1, transition: 'all 0.3s' }}>
              VER RESUMEN FINAL <ArrowRight size={16}/>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
export default SectionProyectos;