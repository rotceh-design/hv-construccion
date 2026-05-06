import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, Check, ArrowRight, Shield, Lock, Layers, Zap, 
  Droplets, Paintbrush, Box, Cpu, AlertTriangle, Trash2, BookOpen, Ruler 
} from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';
import { fmt, fmtUF, BackBtn } from './Cotizadorpage';

// ─── ESTILOS BRUTALISTAS ARQUITECTÓNICOS ──────────────────────────────
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

  .arch-stage-nav { display: flex; gap: 8px; margin-bottom: 40px; overflow-x: auto; padding-bottom: 8px; }
  .arch-stage-tab {
    flex: 1; min-width: 160px; background: #0a0a0a; border: 1px solid var(--border);
    padding: 14px; cursor: pointer; transition: all 0.3s; border-top: 4px solid transparent; opacity: 0.4;
  }
  .arch-stage-tab.completed { opacity: 1; border-top-color: var(--green); background: rgba(46,204,113,0.05); }
  .arch-stage-tab.active { opacity: 1; border-color: var(--gold); border-top-color: var(--gold); background: rgba(255,207,64,0.05); }
  .arch-stage-tab.locked { cursor: not-allowed; filter: grayscale(1); opacity: 0.2; }

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

// ─── MAPEO DINÁMICO DE FASES A IDs REALES DE TU BASE DE DATOS ──────────────
// En lugar de poner un precio fijo, listamos los 'itemIds' que componen la decisión.
const ADVANCED_STAGES_SEGUNDO_PISO = [
  {
    id: 'stage_0', title: 'FASE 0: PREPARACIÓN Y NORMATIVA', icon: <Ruler size={16}/>,
    phases: [
      {
        id: 'fase_muros_base', title: 'Sistema Constructivo de Soporte', icon: <Layers size={18}/>,
        desc: 'Diagnóstico del primer piso para determinar si requiere refuerzo estructural exterior.',
        options: [
          { id: 'opt_mb_confinada', nombre: 'Albañilería Confinada 1er Piso', itemIds: [], desc: 'Soporta directamente la estructura.', specs: ['Apto Directo'], implication: 'Permite empalmar el entrepiso a las cadenas existentes.' },
          { id: 'opt_mb_refuerzo', nombre: 'Requiere Refuerzo (Adobe / Tabique Antiguo)', itemIds: ['sp_A06', 'sp_A05'], desc: 'Se cotizan pilares y cadenas nuevas para soportar el 2do piso sin tocar los muros viejos.', specs: ['Exoesqueleto'], implication: 'Asegura estabilidad estructural independiente del estado del primer piso.' }
        ]
      },
      {
        id: 'fase_tablero', title: 'Capacidad Tablero Eléctrico', icon: <Zap size={18}/>,
        desc: 'Evaluación de la matriz actual para las nuevas cargas.',
        options: [
          { id: 'opt_tab_ok', nombre: 'Tablero Actual Apto (Solo Sub-tablero)', itemIds: ['sp_H01', 'sp_H02'], desc: 'Se instala tablero derivado y alimentador.', specs: ['Sub-Tablero DIN'], implication: 'El cableado general de la casa se mantiene.' },
          { id: 'opt_tab_new', nombre: 'Normalización y Cambio Matriz', itemIds: ['ig_A01', 'ig_A08'], desc: 'Cambio de tablero general y puesta a tierra.', specs: ['Norma SEC'], implication: 'Garantiza que no saltarán los automáticos al encender equipos en el nuevo piso.' }
        ]
      }
    ]
  },
  {
    id: 'stage_1', title: 'FASE 1: OBRA GRUESA (PISOS Y MUROS)', icon: <Box size={16}/>,
    phases: [
      {
        id: 'fase_entrepiso', title: 'Sistema de Entrepiso', icon: <Layers size={18}/>,
        desc: 'La losa o entramado que dividirá los pisos. Define rigidez acústica y carga admisible.',
        options: [
          { id: 'opt_ep_losa', nombre: 'Losa Hormigón Armado H25', itemIds: ['sp_A01', 'sp_A10'], desc: 'Máxima aislación acústica y rigidez.', specs: ['H25 + Enfierradura'], implication: 'Soporta cualquier tipo de revestimiento y muros de albañilería en el 2do piso.' },
          { id: 'opt_ep_metalcon', nombre: 'Entramado Metalcon 200mm + OSB', itemIds: ['sp_A04', 'sp_B06'], desc: 'Construcción seca, liviana y rápida.', specs: ['Metalcon + OSB 18mm'], implication: 'Estructura liviana. Recomendable para terminaciones de piso flotante o vinílico.' },
          { id: 'opt_ep_madera', nombre: 'Entramado Madera Pino Seco', itemIds: ['sp_A03', 'sp_B06'], desc: 'Opción tradicional con buena flexibilidad térmica.', specs: ['Pino Seco'], implication: 'Eficiente y cálido, requiere cadeneteado estricto para evitar crujidos.' }
        ]
      },
      {
        id: 'fase_muros_vert', title: 'Muros Perimetrales (Estructura)', icon: <Shield size={18}/>,
        desc: 'Impacta la eficiencia térmica y el tipo de aislación a utilizar.',
        options: [
          { id: 'opt_mv_metalcon', nombre: 'Tabique Estructural Metalcon', itemIds: ['sp_B03', 'sp_B07'], desc: 'Muros perfectamente rectos, inmunes a termitas.', specs: ['Metalcon 89mm'], implication: 'El puente térmico del acero exige instalación precisa de barreras de humedad.' },
          { id: 'opt_mv_madera', nombre: 'Madera Pino 2x4" + Volcanita', itemIds: ['sp_B05', 'sp_B07'], desc: 'Muros de madera estructural.', specs: ['Pino 2x4"'], implication: 'Mejor comportamiento térmico natural para zonas muy frías.' },
          { id: 'opt_mv_ladrillo', nombre: 'Albañilería Ladrillo (Solo si hay Losa)', itemIds: ['sp_B01', 'sp_B08'], desc: 'Muro sólido, requiere Losa H25 en la fase anterior.', specs: ['Ladrillo Fiscal'], implication: 'Gran inercia térmica, excelente aislación acústica exterior.' }
        ]
      }
    ]
  },
  {
    id: 'stage_2', title: 'FASE 2: TECHUMBRE Y REVESTIMIENTOS', icon: <Droplets size={16}/>,
    phases: [
      {
        id: 'fase_cubierta', title: 'Sistema de Techumbre Completo', icon: <Shield size={18}/>,
        desc: 'Define estética, sonido de la lluvia y vida útil de la casa.',
        options: [
          { id: 'opt_cub_teja', nombre: 'Teja Asfáltica (Alta Gama)', itemIds: ['sp_C01', 'sp_C06', 'sp_C10'], desc: 'Cerchas madera, OSB continuo y teja. Silencioso.', specs: ['OSB + Teja Asfáltica'], implication: 'Máxima aislación contra el ruido de lluvia y estética premium.' },
          { id: 'opt_cub_zinc', nombre: 'Zinc Alum PV4 Prepintado', itemIds: ['sp_C02', 'sp_C07', 'sp_C10'], desc: 'Cerchas metálicas, costaneras y cubierta PV4.', specs: ['PV4 Prepintado'], implication: 'Bajo peso estructural, rápida evacuación de aguas lluvias.' },
          { id: 'opt_cub_panel', nombre: 'Panel Sandwich PUR 40mm', itemIds: ['sp_C02', 'tec_D05', 'sp_C10'], desc: 'Aislación de poliuretano inyectada directamente en el techo.', specs: ['Alta Eficiencia Térmica'], implication: 'Garantiza la máxima retención de calor en invierno.' }
        ]
      },
      {
        id: 'fase_rev_exterior', title: 'Piel Exterior (Fachada)', icon: <Paintbrush size={18}/>,
        desc: 'Protección climática y acabado final de la ampliación.',
        options: [
          { id: 'opt_rev_siding', nombre: 'Siding PVC / Fibrocemento', itemIds: ['sp_B09', 'sp_B10'], desc: 'Incluye membrana hidrófuga de base.', specs: ['Siding'], implication: 'Libre de mantención (PVC) y excelente corte de humedad lateral.' },
          { id: 'opt_rev_estuco', nombre: 'Estuco Proyectado / EIFS', itemIds: ['sp_B09', 'sp_B11'], desc: 'Terminación sólida tipo hormigón.', specs: ['Estuco sobre malla'], implication: 'Apariencia sólida y continua, sin uniones visibles.' }
        ]
      }
    ]
  },
  {
    id: 'stage_3', title: 'FASE 3: TERMINACIONES Y BAÑOS', icon: <Check size={16}/>,
    phases: [
      {
        id: 'fase_pisos_int', title: 'Pavimentos Interiores', icon: <Layers size={18}/>,
        desc: 'Recubrimiento principal para dormitorios y pasillos.',
        options: [
          { id: 'opt_piso_flotante', nombre: 'Piso Flotante AC4 / AC5', itemIds: ['sp_F01', 'sp_F08'], desc: 'Instalación flotada con manta niveladora y zócalos MDF.', specs: ['Cálido al pie'], implication: 'Solución rápida y acústicamente agradable para descanso.' },
          { id: 'opt_piso_porcelanato', nombre: 'Porcelanato 60x60', itemIds: ['sp_F10', 'sp_F04', 'sp_F08'], desc: 'Requiere subbase nivelante incluída. Extrema durabilidad.', specs: ['Alto Tráfico'], implication: 'Añade peso a la estructura pero garantiza vida útil indefinida.' }
        ]
      },
      {
        id: 'fase_bano_tipo', title: 'Configuración Baño Segundo Piso', icon: <Droplets size={18}/>,
        desc: 'Nivel de terminación y artefactos para la zona húmeda.',
        options: [
          { id: 'opt_bano_std', nombre: 'Baño Completo Estándar', itemIds: ['sp_K01', 'sp_K03', 'sp_K08', 'sp_K16'], desc: 'WC tradicional, tina acrílica, lavamanos cerámico, cerámica muros.', specs: ['Cerámica + Tina'], implication: 'Solución probada, fácil mantención y repuestos económicos.' },
          { id: 'opt_bano_prem', nombre: 'Baño Premium / Shower', itemIds: ['sp_K02', 'sp_K04', 'sp_K07', 'sp_K09', 'sp_K17'], desc: 'WC suspendido, shower door, porcelanato muro, grifería empotrada.', specs: ['Porcelanato + Shower'], implication: 'Look de hotel. Requiere impermeabilización estricta incluida en el costo.' }
        ]
      }
    ]
  }
];

const SectionProyectos = ({ step, goStep, projCatId, setProjCatId, projSel, setProjSel, m2, setM2 }) => {
  const isSegundoPiso = projCatId === 'segundos_pisos'; 
  const projCat = projCatId ? PROYECTOS_DATA[projCatId] : null;
  const [activeStageIdx, setActiveStageIdx] = useState(0);

  // 1. Crear un diccionario plano de TODOS los items de la categoría activa para buscar precios rápido
  const catItemsMap = useMemo(() => {
    if (!projCat) return {};
    const map = {};
    if (projCat.grupos) {
      projCat.grupos.forEach(g => {
        g.items.forEach(it => map[it.id] = { ...it, grupo: g.nombre });
      });
    } else if (projCat.items) {
      projCat.items.forEach(it => map[it.id] = it);
    }
    // Incluir también instalaciones generales si existen
    if (PROYECTOS_DATA.instalaciones_generales) {
      PROYECTOS_DATA.instalaciones_generales.grupos.forEach(g => {
        g.items.forEach(it => map[it.id] = { ...it, grupo: g.nombre });
      });
    }
    // Para items sueltos referenciados como tec_D05 (de otro modulo) lo ideal sería unificar todo el catálogo, 
    // pero por ahora buscamos en todo PROYECTOS_DATA si no lo encontramos
    const globalSearch = (id) => {
       for (const cat in PROYECTOS_DATA) {
         if (PROYECTOS_DATA[cat].grupos) {
            for (const g of PROYECTOS_DATA[cat].grupos) {
              const f = g.items.find(i => i.id === id);
              if (f) return {...f, grupo: g.nombre};
            }
         }
       }
       return null;
    };

    return {
      get: (id) => map[id] || globalSearch(id)
    };
  }, [projCat]);

  // Funciones de navegación del configurador avanzado
  const getVisiblePhases = (stage) => stage.phases;
  const checkStageComplete = (stage) => stage.phases.every(phase => projSel[phase.id]);

  // Calcula el costo de una opción sumando los ufRef de sus itemIds
  const getOptionCostoTotal = (itemIds) => {
    return itemIds.reduce((sum, id) => {
      const item = catItemsMap.get(id);
      return sum + (item ? item.ufRef : 0);
    }, 0);
  };

  // Cálculo de UF Total
  const calculateTotalUF = () => {
    let total = 0;
    if (isSegundoPiso) {
      ADVANCED_STAGES_SEGUNDO_PISO.forEach(stage => {
        stage.phases.forEach(phase => {
          const sel = projSel[phase.id];
          if (sel) {
            total += (getOptionCostoTotal(sel.itemIds) * m2);
          }
        });
      });
    } else {
      // Modo lista genérica (Suma los ufRef de los items sueltos seleccionados)
      Object.values(projSel).forEach(item => {
        total += (item.ufRef * m2); 
      });
    }
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
            Configurador arquitectónico enlazado directamente a nuestra base de datos técnica. Selecciona partidas exactas y obtén un presupuesto al milímetro.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {/* Excluimos instalaciones_generales del menú principal porque es un módulo de apoyo */}
          {Object.entries(PROYECTOS_DATA).filter(([k]) => k !== 'instalaciones_generales').map(([key, cat], i) => (
            <button key={key} className="arch-card arch-grid-bg fade-up" style={{ animationDelay:`${i*.1}s`, borderRadius: 'var(--r-xl)', padding: '32px 28px', textAlign: 'left' }}
              onClick={() => { setProjCatId(key); setProjSel({}); setActiveStageIdx(0); goStep(2.5); }}>
              <div style={{ fontSize:36, marginBottom:12 }}>{cat.emoji}</div>
              <h3 className="arch-font-head" style={{ fontWeight:800, fontSize:28, textTransform:'uppercase', color:'#fff', lineHeight:1, marginBottom:8 }}>{cat.label}</h3>
              <p style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6, marginBottom:16 }}>{cat.desc}</p>
              <div className="arch-font-mono" style={{ fontSize:11, color:'var(--gold)', fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                INICIAR CONFIGURADOR <ArrowRight size={13}/>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // VISTA 2: CONFIGURADOR AVANZADO / LISTA
  if (step === 2.5 && projCat) {
    const isCurrentStageDone = isSegundoPiso ? checkStageComplete(ADVANCED_STAGES_SEGUNDO_PISO[activeStageIdx]) : true;
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
              Configurador<br/><span style={{ color:'var(--gold)' }}>{isSegundoPiso ? 'Avanzado' : 'Técnico'}</span>
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
                <button onClick={() => setM2(p => Math.max(10,p-5))} style={{ width:40, height:40, background:'#111', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontSize:20, fontFamily:'var(--f-mono)' }}>-</button>
                <input type="number" value={m2} min={10} max={500} onChange={e => setM2(Number(e.target.value)||20)} 
                  style={{ flex:1, height:40, background:'#000', border:'1px solid var(--gold)', color:'var(--gold)', fontSize:24, fontWeight:800, textAlign:'center', outline:'none', fontFamily:'var(--f-mono)' }}/>
                <button onClick={() => setM2(p => Math.min(500,p+5))} style={{ width:40, height:40, background:'#111', border:'1px solid var(--border)', color:'#fff', cursor:'pointer', fontSize:20, fontFamily:'var(--f-mono)' }}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN ESTRICTA (TABS) - Solo Segundos Pisos */}
        {isSegundoPiso && (
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
            {isSegundoPiso ? (
              ADVANCED_STAGES_SEGUNDO_PISO[activeStageIdx].phases.map((phase, index) => {
                const selection = projSel[phase.id];
                return (
                  <div key={phase.id} className={`arch-step-container ${selection ? 'completed' : 'active'}`}>
                    <div className="arch-step-marker"><div>{selection ? <Check size={18} strokeWidth={4}/> : (index + 1)}</div></div>
                    
                    <div style={{ marginBottom: 20, position:'relative' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                        <span style={{ color: 'var(--gold)' }}>{phase.icon}</span>
                        <h2 className="arch-font-head" style={{ fontSize:22, fontWeight:800, textTransform:'uppercase', color: '#fff', margin:0 }}>{phase.title}</h2>
                      </div>
                      <p style={{ fontSize:13, color:'var(--text3)', margin:0 }}>{phase.desc}</p>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
                      {phase.options.map((opt) => {
                        const isSelected = selection?.id === opt.id;
                        const opCostoBaseUF = getOptionCostoTotal(opt.itemIds);
                        
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
                                {opCostoBaseUF === 0 ? 'INCLUIDO' : `+${fmtUF(opCostoBaseUF)}`} <span style={{ fontSize:10 }}>{opCostoBaseUF !== 0 ? `UF/m²` : ''}</span>
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
              // MODO LISTA NORMAL AGRUPADO (Para Ampliaciones, Quinchos, Radiers, etc.)
              <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
                {projCat.grupos.map((grupo) => (
                  <div key={grupo.id}>
                    <div style={{ borderBottom:'1px solid var(--border)', paddingBottom:12, marginBottom:20 }}>
                      <h3 className="arch-font-head" style={{ color:'var(--gold)', fontSize:22, textTransform:'uppercase', fontWeight:800 }}>{grupo.nombre}</h3>
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      {grupo.items.map(it => {
                        const sel = !!projSel[it.id];
                        return (
                          <div key={it.id} className={`arch-card ${sel ? 'selected' : ''}`} style={{ padding:'14px 16px' }}
                            onClick={() => setProjSel(prev => { const n = { ...prev }; if (n[it.id]) delete n[it.id]; else n[it.id] = { ...it }; return n; })}>
                            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
                              <div style={{ width:20, height:20, border:`1px solid ${sel ? 'var(--gold)' : 'var(--border)'}`, background:sel ? 'var(--gold)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {sel && <Check size={14} color="#000" strokeWidth={3}/>}
                              </div>
                              <div style={{ flex:1 }}>
                                <div className="arch-font-head" style={{ fontSize:16, fontWeight:700, color: sel ? '#fff' : 'var(--text2)' }}>{it.nombre}</div>
                              </div>
                              <div style={{ textAlign:'right' }}>
                                <div className="arch-font-mono" style={{ fontSize:16, fontWeight:700, color: sel ? 'var(--gold)' : 'var(--text3)' }}>{fmtUF(it.ufRef)} UF</div>
                                <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)' }}>/{it.unidad}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* BOTÓN SIGUIENTE ETAPA (Solo 2do piso) */}
            {isSegundoPiso && (
              <div style={{ marginTop: 20, textAlign:'right' }}>
                {activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 ? (
                  <button disabled={!isCurrentStageDone} onClick={() => setActiveStageIdx(p => p + 1)}
                    style={{ padding:'14px 28px', background: isCurrentStageDone ? '#fff' : '#222', color: isCurrentStageDone ? '#000' : '#666', border:'none', fontFamily:'var(--f-mono)', fontWeight:800, fontSize:13, cursor: isCurrentStageDone ? 'pointer' : 'not-allowed', display:'inline-flex', alignItems:'center', gap:8, transition: 'all 0.3s' }}>
                    CONFIRMAR FASE <ArrowRight size={14}/>
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
              <div style={{ fontSize:10, color:'var(--text3)', fontFamily:'var(--f-mono)', marginBottom:8, borderBottom:'1px solid var(--border)', paddingBottom:4 }}>DESGLOSE TÉCNICO DE ENSAMBLAJE</div>
              
              {isSegundoPiso ? (
                // TICKET SEGUNDO PISO (Desglosa los items reales de la base de datos)
                ADVANCED_STAGES_SEGUNDO_PISO.map((stage) => {
                  const validPhases = stage.phases.filter(p => projSel[p.id]);
                  if (validPhases.length === 0) return null;
                  
                  return (
                    <div key={stage.id} style={{ marginBottom: 16 }}>
                      <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--f-mono)', marginBottom:4 }}>// {stage.title}</div>
                      {validPhases.map(phase => {
                        const sel = projSel[phase.id];
                        // Renderizamos CADA item técnico extraído de la BD para esta opción
                        return sel.itemIds.map(itemId => {
                          const dbItem = catItemsMap.get(itemId);
                          if (!dbItem) return null;
                          return (
                            <div key={`${phase.id}-${itemId}`} className="arch-ticket-row" style={{ padding:'4px 0', border:'none' }}>
                              <div style={{ color:'var(--text2)', paddingRight:10, display:'flex', alignItems:'center', gap:6 }}>
                                <span style={{fontSize:8, color:'var(--text3)'}}>[{dbItem.id.split('_')[1]}]</span>
                                {dbItem.nombre.length > 25 ? dbItem.nombre.substring(0, 25) + '...' : dbItem.nombre}
                              </div>
                              <div style={{ color:'#fff' }}>{fmtUF(dbItem.ufRef * m2)} UF</div>
                            </div>
                          );
                        });
                      })}
                    </div>
                  );
                })
              ) : (
                // TICKET LISTA NORMAL (Agrupada por el nombre del grupo)
                Object.values(projSel).reduce((acc, sel) => {
                  // Agrupamos por el nombre del grupo para el ticket
                  const grupoArr = acc.find(g => g.grupo === sel.grupo);
                  if (grupoArr) grupoArr.items.push(sel);
                  else acc.push({ grupo: sel.grupo, items: [sel] });
                  return acc;
                }, []).map((grp, idx) => (
                  <div key={idx} style={{ marginBottom: 16 }}>
                     <div style={{ fontSize:9, color:'var(--gold)', fontFamily:'var(--f-mono)', marginBottom:4 }}>// {grp.grupo}</div>
                     {grp.items.map(sel => (
                        <div key={sel.id} className="arch-ticket-row" style={{ padding:'4px 0', border:'none' }}>
                          <div style={{ color:'var(--text2)', paddingRight:10 }}>{sel.nombre.substring(0, 25)}...</div>
                          <div style={{ color:'#fff' }}>{fmtUF(sel.ufRef * m2)} UF</div>
                        </div>
                     ))}
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

            {/* DIARIO DE OBRA (CONSECUENCIAS ESTRUCTURALES - Solo 2do Piso) */}
            {isSegundoPiso && Object.keys(projSel).length > 0 && (
              <div className="diario-obra-panel">
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:12, color:'var(--gold)' }}>
                  <BookOpen size={14}/><span className="arch-font-head" style={{ fontSize:12, fontWeight:800, letterSpacing:'.05em' }}>DIARIO DE OBRA (CONSECUENCIAS)</span>
                </div>
                {ADVANCED_STAGES_SEGUNDO_PISO.map(stage => 
                  stage.phases.map(phase => {
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

            <button onClick={() => goStep(3)} disabled={isSegundoPiso && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone}
              style={{ width:'100%', padding:'16px', marginTop: 24, background: 'var(--gold)', color: '#000', border:'none', fontWeight:800, fontSize:14, cursor: (isSegundoPiso && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone) ? 'not-allowed' : 'pointer', textTransform:'uppercase', letterSpacing:'.1em', fontFamily:'var(--f-mono)', display:'flex', alignItems:'center', justifyContent:'center', gap:10, opacity: (isSegundoPiso && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && !isCurrentStageDone) ? 0.3 : 1, transition: 'all 0.3s' }}>
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