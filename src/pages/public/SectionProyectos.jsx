import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight, Check, ArrowRight, Shield, Layers, Zap,
  Droplets, Paintbrush, Box, Trash2, Eye,
  Home, Bath, ChevronLeft, Info, Triangle
} from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';
import { fmt, fmtUF, BackBtn } from './Cotizadorpage';

// ─── CONFIGURACIÓN DINÁMICA DE DIMENSIONES ────────────────────────────────
const CATEGORY_CONFIG = {
  segundos_pisos: {
    inputs: [
      { key: 'largo', label: 'LARGO TOTAL', step: 0.5, unit: 'm', def: 6 },
      { key: 'ancho', label: 'ANCHO TOTAL', step: 0.5, unit: 'm', def: 4 },
      { key: 'altoP2', label: 'ALTO PISO 2', step: 0.1, unit: 'm', def: 2.4 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: (d.largo * d.ancho * 0.15), ud: 1 })
  },
  ampliaciones: {
    inputs: [
      { key: 'largo', label: 'LARGO AMPLIACIÓN', step: 0.5, unit: 'm', def: 5 },
      { key: 'ancho', label: 'ANCHO AMPLIACIÓN', step: 0.5, unit: 'm', def: 3 },
      { key: 'alto', label: 'ALTO MUROS', step: 0.1, unit: 'm', def: 2.4 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: (d.largo * d.ancho * 0.10), ud: 1 })
  },
  cobertizos: {
    inputs: [
      { key: 'largo', label: 'LARGO COBERTIZO', step: 0.5, unit: 'm', def: 5 },
      { key: 'ancho', label: 'ANCHO COBERTIZO', step: 0.5, unit: 'm', def: 3 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: 0, ud: 1 })
  },
  techos: {
    inputs: [
      { key: 'largo', label: 'LARGO TECHO', step: 0.5, unit: 'm', def: 6 },
      { key: 'ancho', label: 'ANCHO (SALIENTE)', step: 0.5, unit: 'm', def: 4 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: 0, ud: 1 })
  },
  quinchos: {
    inputs: [
      { key: 'largoMeson', label: 'LARGO MESÓN', step: 0.5, unit: 'm', def: 3 },
      { key: 'anchoMeson', label: 'FONDO MESÓN', step: 0.1, unit: 'm', def: 0.6 },
      { key: 'largoTecho', label: 'LARGO COBERTIZO', step: 0.5, unit: 'm', def: 4 },
      { key: 'anchoTecho', label: 'ANCHO COBERTIZO', step: 0.5, unit: 'm', def: 3 }
    ],
    calc: (d) => ({ m2: d.largoTecho * d.anchoTecho, ml: d.largoMeson, m3: 0, ud: 1 })
  },
  radiers: {
    inputs: [
      { key: 'largo', label: 'LARGO RADIER', step: 0.5, unit: 'm', def: 5 },
      { key: 'ancho', label: 'ANCHO RADIER', step: 0.5, unit: 'm', def: 4 },
      { key: 'espesor', label: 'ESPESOR', step: 0.05, unit: 'm', def: 0.10 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: (d.largo * d.ancho * d.espesor), ud: 1 })
  },
  muros_perimetrales: {
    inputs: [
      { key: 'largo', label: 'LARGO DEL MURO', step: 1.0, unit: 'm', def: 10 },
      { key: 'alto', label: 'ALTO DEL MURO', step: 0.1, unit: 'm', def: 2.0 }
    ],
    calc: (d) => ({ m2: d.largo * d.alto, ml: d.largo, m3: (d.largo * d.alto * 0.15), ud: 1 })
  },
  default: {
    inputs: [
      { key: 'largo', label: 'LARGO', step: 0.5, unit: 'm', def: 5 },
      { key: 'ancho', label: 'ANCHO', step: 0.5, unit: 'm', def: 4 }
    ],
    calc: (d) => ({ m2: d.largo * d.ancho, ml: (d.largo + d.ancho) * 2, m3: 0, ud: 1 })
  }
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
const SectionProyectos = ({ step, goStep, projCatId, setProjCatId, projSel, setProjSel }) => {
  const projCat = projCatId ? PROYECTOS_DATA[projCatId] : null;

  const [stageIdx, setStageIdx] = useState(0);
  const [dims, setDims] = useState({});

  // Inicializar dimensiones
  useEffect(() => {
    if (projCatId) {
      const config = CATEGORY_CONFIG[projCatId] || CATEGORY_CONFIG.default;
      const initialDims = {};
      config.inputs.forEach(inp => initialDims[inp.key] = inp.def);
      setDims(initialDims);
    }
  }, [projCatId]);

  const catConfig = CATEGORY_CONFIG[projCatId] || CATEGORY_CONFIG.default;
  const metrics = catConfig.calc(dims); // Retorna { m2, ml, m3, ud }

  // ─── GENERADOR DINÁMICO DE FASES DESDE LA BASE DE DATOS MAESTRA ────────────
  // Transformamos los grupos reales de PROYECTOS_DATA en pestañas visuales.
  // Esto garantiza que el 100% de la biblioteca esté disponible y detallada.
  const stages = useMemo(() => {
    if (!projCat || !projCat.grupos) return [];
    return projCat.grupos.map((grupo, idx) => ({
      id: `stage_${idx}`,
      phase: `FASE ${String(idx + 1).padStart(2, '0')}`,
      title: grupo.nombre,
      desc: grupo.desc || 'Selecciona todas las partidas técnicas requeridas para esta etapa.',
      options: grupo.items
    }));
  }, [projCat]);

  // Total en UF sumando todo lo seleccionado según la métrica correspondiente
  const totalUF = useMemo(() => {
    let t = 0;
    Object.values(projSel).forEach(it => {
      let qty = 1;
      if (it.unidad === 'm²') qty = metrics.m2 || 1;
      else if (it.unidad === 'ml') qty = metrics.ml || 1;
      else if (it.unidad === 'm³') qty = metrics.m3 || (metrics.m2 * 0.1) || 1;
      else if (['ud', 'pt', 'gl', 'kg', 'mes', 'pto'].includes(it.unidad)) qty = metrics.ud || 1;
      t += it.ufRef * qty;
    });
    return t;
  }, [projSel, metrics]);

  const handlePickCat = (key) => {
    setProjCatId(key);
    setProjSel({});
    setStageIdx(0);
    goStep(2.5);
  };

  // ── PANTALLA 2: SELECCIÓN DE CATEGORÍA ─────────────────────────────────────
  if (step === 2) {
    return (
      <div className="animate-fade-in text-zinc-100 font-sans">
        <BackBtn onClick={() => goStep(1)}/>

        <div className="mb-14">
          <div className="text-[10px] text-yellow-500 tracking-widest mb-3 uppercase font-mono font-bold">
            /// INGENIERÍA Y PROYECTOS
          </div>
          <h1 className="font-black text-5xl md:text-7xl uppercase leading-none mb-5 tracking-tight text-white">
            ELIGE TU<br/><span className="text-yellow-600">OBRA</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Catálogo maestro de partidas. Selecciona la categoría para dimensionar y acceder al desglose técnico detallado de nuestra base de datos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(PROYECTOS_DATA).filter(([k]) => k !== 'instalaciones_generales').map(([key, cat], i) => (
            <button key={key} 
                    className="group bg-zinc-950 border border-zinc-800 hover:border-yellow-600 transition-all cursor-pointer relative overflow-hidden flex flex-col text-left rounded-lg shadow-md"
                    onClick={() => handlePickCat(key)}>
              <div className="h-40 bg-zinc-900 w-full relative overflow-hidden flex items-center justify-center">
                <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity group-hover:scale-110 duration-500">{cat.emoji}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <span className="font-mono text-[9px] tracking-widest uppercase px-2 py-1 border mb-3 w-fit border-yellow-500/40 text-yellow-500 bg-yellow-900/10">
                  CONFIGURADOR TÉCNICO DETALLADO
                </span>
                <h3 className="font-bold text-2xl uppercase text-white leading-tight mb-2">
                  {cat.label}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4 flex-1">
                  {cat.desc}
                </p>
                <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-auto">
                  <div className="font-bold text-sm text-white flex items-center gap-2 tracking-wide">
                    INICIAR PROYECTO <ArrowRight size={14} className="text-yellow-500 group-hover:translate-x-1 transition-transform"/>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── PANTALLA 2.5: CONFIGURADOR TÉCNICO DETALLADO ─────────────────────────────
  if (step === 2.5 && projCat) {
    const allTicket = Object.values(projSel).map(sel => {
      let qty = 1;
      if (sel.unidad === 'm²') qty = metrics.m2 || 1;
      else if (sel.unidad === 'ml') qty = metrics.ml || 1;
      else if (sel.unidad === 'm³') qty = metrics.m3 || (metrics.m2 * 0.1) || 1;
      else if (['ud', 'pt', 'gl', 'kg', 'mes', 'pto'].includes(sel.unidad)) qty = metrics.ud || 1;
      return { ...sel, cost: sel.ufRef * qty };
    });

    return (
      <div className="max-w-[1600px] mx-auto animate-fade-in font-sans text-zinc-100">
        <BackBtn onClick={() => { goStep(2); setProjCatId(null); setProjSel({}); }}/>

        {/* HEADER Y DIMENSIONES DINÁMICAS */}
        <div className="flex flex-wrap gap-8 items-end mb-10">
          <div className="flex-1 min-w-[280px]">
            <div className="font-mono text-[10px] text-yellow-500 tracking-widest mb-2">
              {projCat.emoji} CALCULADORA ARQUITECTÓNICA // {projCat.label.toUpperCase()}
            </div>
            <h1 className="font-black text-4xl md:text-6xl uppercase text-white leading-none tracking-tight">
              AJUSTA LAS<br/><span className="text-yellow-600">MEDIDAS</span>
            </h1>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg flex flex-wrap gap-6 items-center shadow-xl">
            {catConfig.inputs.map(({ key, label, step, unit }) => (
              <div key={key} className="flex flex-col">
                <label className="font-mono text-[9px] text-zinc-500 mb-1 tracking-widest">{label} ({unit})</label>
                <input type="number" min={0.1} step={step} 
                       className="bg-transparent border-b border-zinc-700 text-yellow-500 font-mono text-xl font-bold w-24 text-center outline-none focus:border-yellow-500 transition-colors pb-1"
                       value={dims[key] || ''}
                       onChange={e => setDims(d => ({ ...d, [key]: Math.max(0.1, Number(e.target.value)) }))}/>
              </div>
            ))}
            
            <div className="w-[1px] h-10 bg-zinc-800 hidden md:block"></div>
            
            <div className="flex gap-6 flex-wrap">
              <div>
                <div className="font-mono text-[9px] text-zinc-400 mb-1 tracking-widest">ÁREA (m²)</div>
                <div className="font-mono text-2xl font-bold text-white">{metrics.m2?.toFixed(1)}</div>
              </div>
              {metrics.ml > 0 && (
                <div>
                  <div className="font-mono text-[9px] text-zinc-400 mb-1 tracking-widest">PERÍMETRO (ml)</div>
                  <div className="font-mono text-2xl font-bold text-white">{metrics.ml?.toFixed(1)}</div>
                </div>
              )}
              {metrics.m3 > 0 && (
                <div>
                  <div className="font-mono text-[9px] text-zinc-400 mb-1 tracking-widest">VOLUMEN (m³)</div>
                  <div className="font-mono text-2xl font-bold text-white">{metrics.m3?.toFixed(1)}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* NAVEGADOR DINÁMICO DE FASES (Lee la base de datos) */}
        <div className="flex gap-0 mb-10 border border-zinc-800 overflow-x-auto scrollbar-hide rounded-md bg-zinc-950/50">
          {stages.map((st, idx) => {
            const active = idx === stageIdx;
            // Se marca con check si hay al menos un ítem seleccionado en esta fase
            const hasSelection = st.options.some(opt => projSel[opt.id]);
            return (
              <div key={st.id}
                   className={`flex-none min-w-[150px] border-r border-zinc-800 p-4 cursor-pointer transition-all relative
                              ${active ? 'bg-yellow-950/20 border-t-2 border-t-yellow-600 -mt-[1px] opacity-100' : 'opacity-40 hover:opacity-70'}
                              ${hasSelection && !active ? 'bg-emerald-900/10 opacity-100' : ''}`}
                   onClick={() => setStageIdx(idx)}>
                <div className={`font-mono text-[9px] mb-1 tracking-widest ${active ? 'text-yellow-500' : 'text-zinc-500'}`}>
                  {st.phase}
                </div>
                <div className={`font-bold text-xs uppercase ${active ? 'text-white' : 'text-zinc-400'}`}>
                  {st.title}
                </div>
                {hasSelection && <Check size={14} className="absolute top-3 right-3 text-emerald-500" />}
              </div>
            );
          })}
        </div>

        {/* LAYOUT A 3 COLUMNAS */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_340px] gap-8 items-start">

          {/* COLUMNA 1: DESGLOSE DE PARTIDAS (SELECCIÓN MÚLTIPLE) */}
          <div className="min-w-0">
            {stages[stageIdx] && (
              <div className="animate-fade-in">
                <div className="flex gap-4 items-start mb-6">
                  <div className="font-black text-6xl text-zinc-800/40 leading-none -mt-2 select-none">
                    {String(stageIdx + 1).padStart(2,'0')}
                  </div>
                  <div>
                    <h2 className="font-black text-2xl uppercase text-white tracking-wide m-0">{stages[stageIdx].title}</h2>
                    <p className="text-xs text-zinc-400 mt-1">{stages[stageIdx].desc}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {stages[stageIdx].options.map((opt) => {
                    const sel = !!projSel[opt.id];
                    
                    return (
                      <div key={opt.id} 
                           className={`group flex flex-col bg-zinc-950 border transition-all cursor-pointer rounded-md relative shadow-sm
                                      ${sel ? 'border-yellow-500 bg-yellow-950/10 ring-1 ring-yellow-500' : 'border-zinc-800 hover:border-zinc-500'}`}
                           onClick={() => setProjSel(p => { 
                             const n = {...p}; 
                             if (n[opt.id]) delete n[opt.id]; 
                             else n[opt.id] = { ...opt, grupo: stages[stageIdx].title }; 
                             return n; 
                           })}>
                        
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className={`font-bold text-xs uppercase pr-6 leading-tight ${sel ? 'text-yellow-500' : 'text-white'}`}>
                              {opt.nombre}
                            </h3>
                            {sel ? (
                              <Check size={16} className="text-yellow-500 absolute top-4 right-4 flex-shrink-0"/>
                            ) : (
                              <div className="w-4 h-4 rounded border border-zinc-700 absolute top-4 right-4 flex-shrink-0"></div>
                            )}
                          </div>
                          
                          {opt.desc && <p className="text-[10px] text-zinc-400 leading-relaxed mb-4">{opt.desc}</p>}
                          
                          <div className="mt-auto pt-3 border-t border-zinc-800/60 flex justify-between items-center">
                            <span className="font-mono text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-zinc-500 tracking-widest uppercase">
                              {opt.unidad}
                            </span>
                            <span className={`font-mono text-[11px] font-bold ${sel ? 'text-yellow-500' : 'text-zinc-400'}`}>
                              {opt.ufRef} UF / Base
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* BOTONERÍA DE NAVEGACIÓN */}
            <div className="flex justify-between mt-8 pt-8 border-t border-zinc-800">
              {stageIdx > 0 ? (
                <button className="flex items-center gap-2 font-bold text-xs uppercase px-6 py-3 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 rounded transition-colors"
                        onClick={() => setStageIdx(s => s-1)}>
                  <ChevronLeft size={16}/> ANTERIOR
                </button>
              ) : <div></div>}
              
              {stageIdx < stages.length - 1 ? (
                <button className="flex items-center gap-2 font-bold text-xs uppercase px-8 py-3 bg-white text-black hover:bg-yellow-500 hover:text-black rounded transition-colors" 
                        onClick={() => setStageIdx(s => s+1)}>
                  SIGUIENTE FASE <ArrowRight size={16}/>
                </button>
              ) : (
                <button className="flex items-center gap-2 font-bold text-xs uppercase px-8 py-3 bg-yellow-600 text-black hover:bg-yellow-500 rounded transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        disabled={allTicket.length === 0}
                        onClick={() => goStep(3)}>
                  RESUMEN FINAL <ArrowRight size={16}/>
                </button>
              )}
            </div>
          </div>

          {/* COLUMNA 2: INFO EXTRA Y CONTEXTO MATEMÁTICO */}
          <div className="sticky top-6 hidden lg:block">
            <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-md shadow-lg">
              <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
                <Info size={16} className="text-yellow-500"/>
                <span className="font-mono text-[10px] text-yellow-500 tracking-widest font-bold">INFO MOTOR HV</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">
                Has habilitado el modo de selección detallada. Extraemos el desglose técnico directamente desde la base de datos maestra. Puedes seleccionar <strong>múltiples partidas</strong> dentro de cada fase. El motor multiplicará automáticamente el costo base por las cotas ingresadas en la parte superior.
              </p>
              
              <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-[10px] text-zinc-300 font-mono mb-4 leading-relaxed">
                Área Analizada: {metrics.m2.toFixed(1)} m²<br/>
                Perímetro Activo: {metrics.ml?.toFixed(1)} ml<br/>
                {metrics.m3 > 0 && <>Volumen en Obra: {metrics.m3.toFixed(1)} m³</>}
              </div>

              {/* Rango Referencial */}
              {projCat.ufMin && (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded mt-4">
                  <div className="font-mono text-[9px] text-zinc-500 tracking-widest mb-2 text-center">RANGO DE MERCADO (UF/m²)</div>
                  <div className="flex justify-between items-center text-white font-bold text-lg">
                    <span>{projCat.ufMin}</span>
                    <div className="flex-1 h-px bg-zinc-800 mx-3 relative">
                      <div className="absolute h-1 bg-yellow-600 w-1/3 top-[-1.5px] left-1/3 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    </div>
                    <span>{projCat.ufMax}</span>
                  </div>
                  <div className="text-[8px] text-center text-zinc-600 mt-2 uppercase">Referencia Construcción Chile</div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA 3: TICKET FIJO DE INVERSIÓN (CARRITO) */}
          <div className="sticky top-6 bg-zinc-950 border-t-2 border-t-yellow-600 border-x border-b border-zinc-800 rounded-md shadow-2xl flex flex-col">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/20">
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-yellow-500"/>
                <span className="font-bold text-sm text-white uppercase tracking-wider">
                  CARRITO DE OBRA
                </span>
              </div>
              <div className="font-mono text-[9px] text-zinc-400 tracking-widest">
                {metrics.m2.toFixed(1)} m² SUPERFICIE · {allTicket.length} PARTIDAS
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-yellow-900/50 scrollbar-track-transparent">
              {allTicket.length === 0 && (
                <div className="font-mono text-[9px] text-zinc-600 text-center py-10 tracking-widest uppercase">
                  — Desglose vacío —
                </div>
              )}
              {allTicket.map((it, i) => (
                <div key={i} className="flex justify-between items-start gap-3 p-3 border-b border-zinc-900 last:border-0 hover:bg-zinc-900/50 transition-colors">
                  <div className="text-zinc-400 max-w-[65%]">
                    <div className="text-[8px] text-yellow-500 tracking-widest mb-1 uppercase font-mono truncate">
                      {it.grupo}
                    </div>
                    <div className="text-[10px] leading-tight font-medium text-zinc-300 line-clamp-2">{it.nombre}</div>
                  </div>
                  <div className="font-mono text-[10px] font-bold text-white whitespace-nowrap bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    {fmtUF(it.cost)} UF
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-zinc-800 bg-zinc-900/80 rounded-b-md">
              <div className="font-mono text-[9px] text-zinc-400 tracking-widest mb-1">TOTAL PROVISORIO (SIN IVA)</div>
              <div className="font-black text-4xl text-white leading-none tracking-tight flex items-baseline gap-1">
                {fmtUF(totalUF)} <span className="text-lg text-yellow-500">UF</span>
              </div>
              <div className="font-mono text-xs text-zinc-500 mt-2 bg-zinc-950 inline-block px-2 py-1 rounded border border-zinc-800">
                $ {fmt(totalUF * UF_VALOR)} CLP
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default SectionProyectos;