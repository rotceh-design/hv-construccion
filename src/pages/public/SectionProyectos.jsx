import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, Check, ArrowRight, Shield, Lock, Layers, Zap, 
  Droplets, Paintbrush, Box, Cpu, AlertTriangle, Trash2, BookOpen, Ruler 
} from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';
import { fmt, fmtUF, BackBtn } from './Cotizadorpage';

// ─── ESTILOS BRUTALISTAS ARQUITECTÓNICOS MEJORADOS ──────────────────────────────
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

  /* Contenedor de Fases con scroll mejorado */
  .arch-stage-nav { 
    display: flex; 
    gap: 8px; 
    margin-bottom: 32px; 
    overflow-x: auto; 
    padding-bottom: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--gold) transparent;
  }
  
  .arch-stage-tab {
    flex: 0 0 160px; 
    background: #0a0a0a; 
    border: 1px solid rgba(255,255,255,0.1);
    padding: 14px; 
    cursor: pointer; 
    transition: all 0.3s; 
    border-top: 4px solid transparent; 
    opacity: 0.4;
  }
  .arch-stage-tab.completed { opacity: 1; border-top-color: #2ecc71; background: rgba(46,204,113,0.05); }
  .arch-stage-tab.active { opacity: 1; border-color: var(--gold); border-top-color: var(--gold); background: rgba(255,207,64,0.05); }
  .arch-stage-tab.locked { cursor: not-allowed; filter: grayscale(1); opacity: 0.2; }

  .arch-step-container {
    border-left: 2px dashed rgba(255,207,64,0.2); 
    margin-left: 20px; 
    padding-left: 30px; 
    padding-bottom: 40px; 
    position: relative;
    animation: fadeIn 0.4s ease-out forwards;
  }
  .arch-step-container:last-child { border-left-color: transparent; }

  .arch-step-marker {
    position: absolute; left: -21px; top: 0; width: 40px; height: 40px; background: #080808; border: 2px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; font-weight: 800; font-size: 16px;
    color: var(--text3); transition: all 0.3s ease; transform: rotate(45deg);
  }
  .arch-step-marker > div { transform: rotate(-45deg); }
  .arch-step-container.active .arch-step-marker { border-color: var(--gold); color: var(--gold); box-shadow: 0 0 15px rgba(255, 207, 64, 0.2); }
  .arch-step-container.completed .arch-step-marker { background: var(--gold); border-color: var(--gold); color: #000; }

  .arch-card {
    background: #0d0d0d; border: 1px solid rgba(255,255,255,0.1); padding: 20px; cursor: pointer;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden;
    height: 100%; display: flex; flexDirection: column;
  }
  .arch-card:hover { border-color: var(--gold); transform: translateY(-2px); }
  .arch-card.selected { border-color: var(--gold); background: rgba(255,207,64,0.03); box-shadow: inset 0 0 20px rgba(255,207,64,0.05); }

  .arch-spec-tag {
    display: inline-flex; align-items: center; gap: 4px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    padding: 4px 8px; font-size: 10px; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; color: var(--text2); margin-right: 6px; margin-bottom: 6px;
  }

  /* Ticket Sticky Corregido */
  .arch-ticket { 
    background: #050505; 
    border: 1px solid var(--gold); 
    padding: 24px; 
    position: sticky; 
    top: 100px;
    z-index: 10;
  }
  
  .arch-ticket-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed rgba(255,255,255,0.1); font-family: 'JetBrains Mono', monospace; font-size: 11px; }

  @media (max-width: 1024px) {
    .arch-main-layout { grid-template-columns: 1fr !important; }
    .arch-ticket { position: relative; top: 0; margin-top: 32px; }
  }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

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

  const catItemsMap = useMemo(() => {
    if (!projCat) return {};
    const map = {};
    if (projCat.grupos) {
      projCat.grupos.forEach(g => g.items.forEach(it => map[it.id] = { ...it, grupo: g.nombre }));
    } else if (projCat.items) {
      projCat.items.forEach(it => map[it.id] = it);
    }
    if (PROYECTOS_DATA.instalaciones_generales) {
      PROYECTOS_DATA.instalaciones_generales.grupos.forEach(g => g.items.forEach(it => map[it.id] = { ...it, grupo: g.nombre }));
    }
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
    return { get: (id) => map[id] || globalSearch(id) };
  }, [projCat]);

  const checkStageComplete = (stage) => stage.phases.every(phase => projSel[phase.id]);

  const getOptionCostoTotal = (itemIds) => {
    return itemIds.reduce((sum, id) => {
      const item = catItemsMap.get(id);
      return sum + (item ? item.ufRef : 0);
    }, 0);
  };

  const calculateTotalUF = () => {
    let total = 0;
    if (isSegundoPiso) {
      ADVANCED_STAGES_SEGUNDO_PISO.forEach(stage => {
        stage.phases.forEach(phase => {
          const sel = projSel[phase.id];
          if (sel) total += (getOptionCostoTotal(sel.itemIds) * m2);
        });
      });
    } else {
      Object.values(projSel).forEach(item => total += (item.ufRef * m2));
    }
    return total;
  };

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
          {Object.entries(PROYECTOS_DATA).filter(([k]) => k !== 'instalaciones_generales').map(([key, cat], i) => (
            <button key={key} className="arch-card arch-grid-bg fade-up" style={{ animationDelay:`${i*.1}s`, borderRadius: '12px', padding: '32px 28px', textAlign: 'left' }}
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

  if (step === 2.5 && projCat) {
    const isCurrentStageDone = isSegundoPiso ? checkStageComplete(ADVANCED_STAGES_SEGUNDO_PISO[activeStageIdx]) : true;
    const totalUF = calculateTotalUF();

    return (
      <div className="fade-up arch-root" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <style>{ARCH_CSS}</style>
        <BackBtn onClick={() => { goStep(2); setProjCatId(null); setProjSel({}); }}/>
        
        {/* HEADER */}
        <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap', marginBottom:32 }}>
          <div style={{ flex:1, minWidth:280 }}>
            <div className="arch-font-mono" style={{ fontSize:11, color:'var(--text3)', fontWeight:700, letterSpacing:'.1em', marginBottom:6 }}>
              {projCat.emoji} SECUENCIA ESTRUCTURAL // {projCat.label.toUpperCase()}
            </div>
            <h1 className="arch-font-head" style={{ fontWeight:800, fontSize:'clamp(32px,4vw,56px)', textTransform:'uppercase', lineHeight:.9, marginBottom:12, color:'#fff' }}>
              Configurador <span style={{ color:'var(--gold)' }}>{isSegundoPiso ? 'Avanzado' : 'Técnico'}</span>
            </h1>
          </div>
          <div style={{ background:'#0f0f0f', border:'1px solid rgba(255,255,255,0.1)', padding:24, minWidth:260 }}>
            <div className="arch-font-mono" style={{ fontSize:10, color:'var(--gold)', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Superficie Base [ M² ]</div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <button onClick={() => setM2(p => Math.max(10,p-5))} style={{ width:40, height:40, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer' }}>-</button>
              <input type="number" value={m2} readOnly style={{ flex:1, height:40, background:'#000', border:'1px solid var(--gold)', color:'var(--gold)', fontSize:20, fontWeight:800, textAlign:'center', outline:'none' }}/>
              <button onClick={() => setM2(p => Math.min(500,p+5))} style={{ width:40, height:40, background:'#1a1a1a', border:'1px solid rgba(255,255,255,0.1)', color:'#fff', cursor:'pointer' }}>+</button>
            </div>
          </div>
        </div>

        {/* NAV FASES */}
        {isSegundoPiso && (
          <div className="arch-stage-nav">
            {ADVANCED_STAGES_SEGUNDO_PISO.map((stage, idx) => (
              <div key={stage.id} className={`arch-stage-tab ${idx === activeStageIdx ? 'active' : ''} ${checkStageComplete(stage) ? 'completed' : ''}`}
                   onClick={() => { if (idx <= activeStageIdx || checkStageComplete(ADVANCED_STAGES_SEGUNDO_PISO[idx-1])) setActiveStageIdx(idx); }}>
                <div className="arch-font-mono" style={{ fontSize:10, color: idx === activeStageIdx ? 'var(--gold)' : '#555' }}>FASE 0{idx}</div>
                <div className="arch-font-head" style={{ fontSize:13, fontWeight:700, color:'#fff', textTransform:'uppercase' }}>{stage.title.split(':')[1]}</div>
              </div>
            ))}
          </div>
        )}

        {/* GRID PRINCIPAL */}
        <div className="arch-main-layout" style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:40, alignItems:'start' }}>
          
          <div style={{ minWidth: 0 }}>
            {isSegundoPiso ? (
              ADVANCED_STAGES_SEGUNDO_PISO[activeStageIdx].phases.map((phase, idx) => (
                <div key={phase.id} className="arch-step-container">
                  <div className="arch-step-marker"><div>{idx + 1}</div></div>
                  <div style={{ marginBottom: 20 }}>
                    <h2 className="arch-font-head" style={{ fontSize:22, fontWeight:800, textTransform:'uppercase', color: '#fff', margin:0, display:'flex', gap:10, alignItems:'center' }}>
                      <span style={{color:'var(--gold)'}}>{phase.icon}</span> {phase.title}
                    </h2>
                    <p style={{ fontSize:13, color:'var(--text3)', marginTop:4 }}>{phase.desc}</p>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:16 }}>
                    {phase.options.map((opt) => {
                      const sel = projSel[phase.id]?.id === opt.id;
                      const cost = getOptionCostoTotal(opt.itemIds);
                      return (
                        <div key={opt.id} className={`arch-card ${sel ? 'selected' : ''}`} onClick={() => setProjSel(p => ({ ...p, [phase.id]: { ...opt, grupo: phase.title } })) }>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                            <div className="arch-font-head" style={{ fontSize:18, fontWeight:700, color: sel ? 'var(--gold)' : '#fff' }}>{opt.nombre}</div>
                            {sel && <Check size={18} color="var(--gold)" strokeWidth={3}/>}
                          </div>
                          <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.5, marginBottom:16, flex: 1 }}>{opt.desc}</p>
                          <div style={{ borderTop:'1px solid rgba(255,255,255,0.05)', paddingTop:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span className="arch-font-mono" style={{ fontSize:10, color:'#555' }}>INVERSIÓN REF.</span>
                            <span className="arch-font-mono" style={{ fontSize:14, fontWeight:700, color: sel ? 'var(--gold)' : '#888' }}>+{fmtUF(cost)} <small>UF/m²</small></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              projCat.grupos.map((grupo) => (
                <div key={grupo.id} style={{ marginBottom: 40 }}>
                  <h3 className="arch-font-head" style={{ color:'var(--gold)', fontSize:20, textTransform:'uppercase', fontWeight:800, marginBottom:16 }}>{grupo.nombre}</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:12 }}>
                    {grupo.items.map(it => {
                      const sel = !!projSel[it.id];
                      return (
                        <div key={it.id} className={`arch-card ${sel ? 'selected' : ''}`} style={{ padding:'16px' }}
                             onClick={() => setProjSel(p => { const n={...p}; if(n[it.id]) delete n[it.id]; else n[it.id]={...it, grupo:grupo.nombre}; return n; })}>
                          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                            <span className="arch-font-head" style={{ fontSize:15, fontWeight:700, color: sel ? '#fff' : '#888' }}>{it.nombre}</span>
                            <span className="arch-font-mono" style={{ fontSize:14, color: sel ? 'var(--gold)' : '#555' }}>{it.ufRef} UF</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
            
            {isSegundoPiso && activeStageIdx < ADVANCED_STAGES_SEGUNDO_PISO.length - 1 && (
              <div style={{ textAlign:'right', marginTop: 32 }}>
                <button disabled={!isCurrentStageDone} onClick={() => setActiveStageIdx(p => p + 1)}
                        style={{ padding:'14px 32px', background: isCurrentStageDone ? '#fff' : '#222', color:'#000', border:'none', fontWeight:900, fontSize:13, cursor: isCurrentStageDone ? 'pointer' : 'not-allowed' }}>
                  SIGUIENTE FASE <ArrowRight size={16} style={{display:'inline', marginLeft:8}}/>
                </button>
              </div>
            )}
          </div>

          {/* TICKET SIDEBAR */}
          <div className="arch-ticket">
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
              <Zap size={18} color="var(--gold)"/>
              <div className="arch-font-head" style={{ fontSize:16, fontWeight:800, color:'#fff', textTransform:'uppercase' }}>Plano de Inversión</div>
            </div>
            
            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: 8 }}>
              {Object.values(projSel).map((sel, i) => (
                <div key={i} className="arch-ticket-row">
                  <div style={{ color:'#888', maxWidth: '70%' }}>
                    <div style={{ fontSize:8, color:'var(--gold)' }}>{sel.grupo?.toUpperCase()}</div>
                    {sel.nombre}
                  </div>
                  <div style={{ color:'#fff' }}>{fmtUF((sel.ufRef || getOptionCostoTotal(sel.itemIds || [])) * m2)} UF</div>
                </div>
              ))}
            </div>

            <div style={{ borderTop:'2px solid var(--gold)', marginTop:24, paddingTop:20 }}>
              <div className="arch-font-mono" style={{ fontSize:32, fontWeight:800, color:'var(--gold)', lineHeight:1 }}>{fmtUF(totalUF)} <span style={{fontSize:16}}>UF</span></div>
              <div className="arch-font-mono" style={{ fontSize:13, color:'#555', marginTop:8 }}>$ {fmt(totalUF * UF_VALOR)} CLP</div>
            </div>

            <button onClick={() => goStep(3)} disabled={!Object.keys(projSel).length}
                    style={{ width:'100%', padding:'16px', marginTop: 24, background: 'var(--gold)', color: '#000', border:'none', fontWeight:900, fontSize:14, cursor:'pointer', textTransform:'uppercase' }}>
              Finalizar Cotización
            </button>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default SectionProyectos;