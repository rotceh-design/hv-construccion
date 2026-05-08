import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight, Check, ArrowRight, Shield, Layers, Zap,
  Droplets, Paintbrush, Box, Trash2, Eye,
  Home, Bath, ChevronLeft, Info, Triangle
} from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';
import { fmt, fmtUF, BackBtn } from './Cotizadorpage';
import SiteDataBlock from './SiteDataBlock'; // <--- IMPORTACIÓN DEL NUEVO BLOQUE I.A.

// ─── MAPEO DE IMÁGENES DE FIREBASE STORAGE ──────────────────────────────────
const PROJECT_IMAGES = {
  segundos_pisos: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/segundos_pisos.png?alt=media&token=d646a127-6d68-49e6-9420-0b6cd2d3dea8",
  ampliaciones: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/ampliaciones.png?alt=media&token=33da03ec-bb74-4aaa-9a66-6d966dd22057",
  techos: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/techos.png?alt=media&token=84466f57-a41f-4f06-9148-0c355fe3ea40",
  quinchos: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/quincho.png?alt=media&token=9205561b-6da1-4ca3-b390-82c8191d0ec9",
  radiers: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/radier.png?alt=media&token=16e227c2-510e-4be1-8aae-8ca2cc9de14b",
  muros_perimetrales: "https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/muros.png?alt=media&token=ab74d4b5-5a23-46ee-a3d8-2f66cc8f0119"
};

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
  techos: { // Merge cobertizos input/calc here (they were identical)
    inputs: [
      { key: 'largo', label: 'LARGO TECHO/COBERTIZO', step: 0.5, unit: 'm', def: 6 },
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
  
  // Estados para la FASE 00 (IA y Terreno)
  const [aiStatus, setAiStatus] = useState('idle'); // 'idle' | 'analyzing' | 'done'
  const [siteData, setSiteData] = useState({ soil: 'normal', access: 'camion', debris: 'limpio' });

  // Inicializar dimensiones
  useEffect(() => {
    if (projCatId) {
      const config = CATEGORY_CONFIG[projCatId] || CATEGORY_CONFIG.default;
      const initialDims = {};
      config.inputs.forEach(inp => initialDims[inp.key] = inp.def);
      setDims(initialDims);
      setAiStatus('idle'); // Reset IA
    }
  }, [projCatId]);

  const catConfig = CATEGORY_CONFIG[projCatId] || CATEGORY_CONFIG.default;
  const metrics = catConfig.calc(dims); // Retorna { m2, ml, m3, ud }

  // Simulador de procesamiento IA
  const handleAITrigger = () => {
    if (aiStatus !== 'idle') return;
    setAiStatus('analyzing');
    setTimeout(() => {
      setAiStatus('done');
    }, 2500); // Finge pensar por 2.5s
  };

  // ─── GENERADOR DINÁMICO DE FASES: AHORA INCLUYE LA FASE 00 DE ANÁLISIS ──────
  const stages = useMemo(() => {
    if (!projCat || !projCat.grupos) return [];
    
    // Convertimos los grupos reales de la BD a Fases
    const dbStages = projCat.grupos.map((grupo, idx) => ({
      id: `stage_${idx + 1}`,
      // Reemplazado FASE por ETAPA DE PARTIDAS
      phase: `ETAPA DE PARTIDAS ${String(idx + 1).padStart(2, '0')}`,
      title: grupo.nombre,
      desc: grupo.desc || 'Selecciona todas las partidas técnicas requeridas para esta etapa.',
      options: grupo.items,
      type: 'db'
    }));

    // Inyectamos la FASE 00 como el primer paso obligatorio
    const phase0 = {
      id: 'stage_0',
      // Reemplazado FASE 00 por etiqueta descriptiva
      phase: 'ANÁLISIS INICIAL Y MEDIDAS',
      title: 'ANÁLISIS DE SITIO E IA',
      desc: 'Ingresa medidas, condiciones del terreno y análisis fotográfico.',
      type: 'ai_setup'
    };

    return [phase0, ...dbStages];
  }, [projCat]);

  // Total en UF
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
      <div className="animate-fade-in text-black font-sans bg-transparent">
        <BackBtn onClick={() => goStep(1)}/>

        {/* Espaciado mb aumentado mb-14 -> mb-20 */}
        <div className="mb-20">
          <div className="text-[11px] text-black font-black bg-[#FFCF40] border-2 border-white px-2 py-1 inline-block shadow-[2px_2px_0px_rgba(0,0,0,1)] tracking-widest mb-4 uppercase font-mono">
            /// INGENIERÍA Y PROYECTOS
          </div>
          <h1 className="font-black text-5xl md:text-7xl uppercase leading-none mb-5 tracking-tight text-white">
            ELIGE TU<br/><span className="text-[#131211] bg-[#FFCF40] px-2 py-1 inline-block mt-2 shadow-[6px_6px_0px_rgba(0,0,0,1)]">OBRA</span>
          </h1>
          <p className="text-white font-bold text-sm max-w-xl leading-relaxed mt-6">
            Catálogo maestro de partidas. Selecciona la categoría para dimensionar y acceder al desglose técnico detallado de nuestra base de datos.
          </p>
        </div>

        {/* Espaciado gap aumentado gap-6 -> gap-10 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {Object.entries(PROYECTOS_DATA).filter(([k]) => k !== 'instalaciones_generales' && k !== 'cobertizos').map(([key, cat], i) => (
            <button key={key} 
                    className="group bg-white border-2 border-black transition-all cursor-pointer relative overflow-hidden flex flex-col text-left rounded-none shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[10px_10px_0px_rgba(0,0,0,1)]"
                    onClick={() => handlePickCat(key)}>
              {/* Contenedor de imagen: Reemplazado emoji por img tag con URL de Firebase */}
              <div className="h-48 bg-[#111] w-full relative overflow-hidden flex items-center justify-center border-b-2 border-black">
                {PROJECT_IMAGES[key] ? (
                  <img src={PROJECT_IMAGES[key]} alt={cat.label} className="w-full h-full object-cover group-hover:scale-110 duration-500 transition-transform"/>
                ) : (
                  <span className="text-6xl opacity-100 group-hover:scale-125 duration-500">{cat.emoji}</span>
                )}
              </div>
              {/* Padding interno aumentado p-6 -> p-8 */}
              <div className="p-8 flex flex-col flex-1">
                <span className="font-mono font-black text-[9px] tracking-widest uppercase px-2 py-1 border-2 mb-4 w-fit border-black text-black bg-[#FFCF40] shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                  LEVANTAMIENTO + BD DETALLADA
                </span>
                <h3 className="font-black text-2xl uppercase text-black leading-tight mb-3">
                  {cat.label}
                </h3>
                <p className="text-xs font-bold text-gray-600 leading-relaxed mb-8 flex-1">
                  {cat.desc}
                </p>
                <div className="flex justify-between items-center border-t-2 border-black pt-4 mt-auto">
                  <div className="font-black text-sm text-black flex items-center gap-2 tracking-wide">
                    INICIAR PROYECTO <ArrowRight size={16} className="text-black group-hover:translate-x-2 transition-transform stroke-[3px]"/>
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
      <div className="max-w-[1600px] mx-auto animate-fade-in font-sans text-black mt-10">
        <BackBtn onClick={() => { goStep(2); setProjCatId(null); setProjSel({}); }}/>

        {/* HEADER LIMPIO Y ESTÉTICO - Espaciado mb aumentado */}
        <div className="flex flex-wrap gap-8 items-end mb-14 border-b-4 border-black pb-8">
          <div className="flex-1 min-w-[280px]">
            <div className="font-mono text-[10px] text-[#FFCF40] bg-[#111] border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-2 py-1 w-fit font-black tracking-widest mb-4 flex items-center gap-2">
              {projCat.emoji} CALCULADORA ARQUITECTÓNICA // {projCat.label.toUpperCase()}
            </div>
            <h1 className="font-black text-4xl md:text-6xl uppercase text-white leading-none tracking-tight">
              CONFIGURADOR DE<br/><span className="text-[#000000] bg-[#fcfcfc] px-3 inline-block shadow-[6px_6px_0px_rgba(0,0,0,1)] mt-2">PARTIDAS</span>
            </h1>
          </div>

          <div className="flex gap-8 items-center bg-white px-6 py-4 rounded-none border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)]">
            <div>
              <div className="font-mono font-black text-[10px] text-gray-500 mb-1 tracking-widest uppercase">Área Total Calculada</div>
              <div className="font-mono text-3xl font-black text-black flex items-baseline gap-1">
                {metrics.m2?.toFixed(1)} <span className="text-sm text-black bg-[#FFCF40] px-1 border-2 border-black font-bold">m²</span>
              </div>
            </div>
            {metrics.ml > 0 && (
              <>
                <div className="w-[2px] h-12 bg-black hidden md:block"></div>
                <div>
                  <div className="font-mono font-black text-[10px] text-gray-500 mb-1 tracking-widest uppercase">Perímetro</div>
                  <div className="font-mono text-xl font-black text-black flex items-baseline gap-1">
                    {metrics.ml?.toFixed(1)} <span className="text-xs text-black bg-[#f0f0f0] px-1 border-2 border-black font-bold">ml</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* NAVEGADOR DINÁMICO DE FASES - Espaciado mb aumentado */}
        <div className="flex gap-0 mb-14 border-2 border-black overflow-x-auto scrollbar-hide bg-white shadow-[6px_6px_0px_rgba(0,0,0,1)]">
          {stages.map((st, idx) => {
            const active = idx === stageIdx;
            const hasSelection = st.type === 'ai_setup' ? true : st.options.some(opt => projSel[opt.id]);
            
            return (
              <div key={st.id}
                   className={`flex-none min-w-[180px] border-r-2 border-black p-5 cursor-pointer transition-all relative
                              ${active ? 'bg-[#111] text-white border-b-4 border-[#FFCF40] opacity-100' : 'bg-white text-black hover:bg-gray-100 opacity-100'}
                              ${hasSelection && !active ? 'bg-[#FFCF40]' : ''}`}
                   onClick={() => setStageIdx(idx)}>
                <div className={`font-mono font-black text-[10px] mb-1.5 tracking-widest flex items-center gap-1 ${active ? 'text-[#FFCF40]' : 'text-black'}`}>
                  {st.type === 'ai_setup' && <Eye size={12} strokeWidth={3} />} {st.phase}
                </div>
                <div className={`font-black text-[13px] leading-tight uppercase ${active ? 'text-white' : 'text-black'}`}>
                  {st.title}
                </div>
                {hasSelection && st.type !== 'ai_setup' && <Check size={20} strokeWidth={4} className={`absolute top-5 right-5 ${active ? 'text-[#FFCF40]' : 'text-black'}`} />}
              </div>
            );
          })}
        </div>

        {/* LAYOUT A 3 COLUMNAS - Gap aumentado gap-8 -> gap-12 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px_340px] gap-12 items-start mb-16">

          {/* COLUMNA 1: CONTENIDO DINÁMICO (FASE 00 o LISTA DE PARTIDAS) */}
          <div className="min-w-0">
            {stages[stageIdx] && (
              <div className="animate-fade-in">
                <div className="flex gap-5 items-start mb-10 bg-white border-2 border-black p-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <div className="font-black text-6xl text-black leading-none select-none drop-shadow-[2px_2px_0px_rgba(255,207,64,1)]">
                    {String(stageIdx).padStart(2,'0')}
                  </div>
                  <div className="mt-1">
                    {/* Reemplazado visualmente FASE 00/01... por ETAPA DE PARTIDAS */}
                    <h2 className="font-black text-2xl uppercase text-black tracking-wide m-0">
                        {stageIdx === 0 ? "ANÁLISIS INICIAL Y MEDIDAS" : `ETAPA DE PARTIDAS ${String(stageIdx).padStart(2,'0')}`} // {stages[stageIdx].title}
                    </h2>
                    <p className="text-xs font-bold text-gray-700 mt-1.5">{stages[stageIdx].desc}</p>
                  </div>
                </div>

                {/* ─── RENDER EXCLUSIVO PARA LA FASE 00 ────────────────────────── */}
                {stages[stageIdx].type === 'ai_setup' && (
                  <div className="flex flex-col gap-10"> {/* Gap aumentado */}
                    
                    {/* BLOQUE 1: DIMENSIONES */}
                    <div className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                      <h3 className="font-black text-sm text-black bg-[#FFCF40] border-2 border-black px-2 py-1 w-fit uppercase mb-6 flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        <Triangle size={16} strokeWidth={3}/> Geometría del Proyecto
                      </h3>
                      <div className="flex flex-wrap gap-5 relative z-10"> {/* Gap aumentado */}
                        {catConfig.inputs.map(({ key, label, step, unit }) => (
                          <div key={key} className="flex flex-col bg-[#f8f9fa] p-5 border-2 border-black w-44 hover:border-black focus-within:bg-[#FFCF40] focus-within:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all">
                            <label className="font-black text-[10px] text-black mb-2.5 tracking-widest">{label} ({unit})</label>
                            <input type="number" min={0.1} step={step} 
                                   className="bg-transparent text-black font-mono text-3xl font-black outline-none border-b-2 border-black pb-1.5 w-full"
                                   value={dims[key] || ''}
                                   onChange={e => setDims(d => ({ ...d, [key]: Math.max(0.1, Number(e.target.value)) }))}/>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* BLOQUE 2: MOTOR IA FOTOGRÁFICO */}
                    <div className="bg-white p-6 border-2 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] relative">
                      <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4 gap-4 flex-wrap">
                        <h3 className="font-black text-sm text-black bg-[#FFCF40] border-2 border-black px-2 py-1 uppercase flex items-center gap-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <Eye size={18} strokeWidth={3}/> Motor de Análisis Visual
                        </h3>
                        <div className="flex items-center gap-2 font-black text-[10px] bg-[#111] border-2 border-black text-[#FFCF40] px-3 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          <span className="relative flex h-2 w-2">
                            {aiStatus === 'analyzing' && <span className="animate-ping absolute inline-flex h-full w-full bg-[#FFCF40] opacity-75"></span>}
                            <span className="relative inline-flex h-2 w-2 bg-[#FFCF40]"></span>
                          </span>
                          GEMINI AI ASSISTANT
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Gap aumentado */}
                        {/* Zona Drop de Imagen */}
                        <div className={`border-4 border-dashed border-black p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[260px]
                                        ${aiStatus === 'idle' ? 'bg-[#f0f0f0] hover:bg-[#FFCF40] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)]' : 
                                          aiStatus === 'analyzing' ? 'bg-[#111] text-white border-solid' : 'bg-white border-solid shadow-[6px_6px_0px_rgba(0,0,0,1)]'}`}
                             onClick={handleAITrigger}>
                          
                          {aiStatus === 'idle' && (
                            <div className="animate-fade-in flex flex-col items-center">
                              <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <Eye size={30} className="text-black" strokeWidth={3} />
                              </div>
                              <p className="text-md font-black text-black mb-1.5">Subir Fotografía del Sitio</p>
                              <p className="text-[10px] font-bold text-black uppercase tracking-widest max-w-[200px] leading-relaxed mt-2 bg-white border-2 border-black px-2 py-1">
                                Clic para evaluar interferencias
                              </p>
                            </div>
                          )}
                          
                          {aiStatus === 'analyzing' && (
                            <div className="animate-fade-in flex flex-col items-center">
                              <div className="w-12 h-12 border-4 border-[#FFCF40] border-t-transparent rounded-none animate-spin mb-5"></div>
                              <p className="text-sm text-[#FFCF40] font-black font-mono tracking-widest uppercase mb-1.5">Ejecutando Modelos...</p>
                              <p className="text-[10px] text-white font-bold uppercase mt-2">Escaneando topografía y materialidad</p>
                            </div>
                          )}
                          
                          {aiStatus === 'done' && (
                            <div className="animate-fade-in flex flex-col items-center">
                              <div className="w-16 h-16 bg-[#FFCF40] border-4 border-black flex items-center justify-center mb-5 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                <Check size={36} className="text-black" strokeWidth={4} />
                              </div>
                              <p className="text-lg font-black text-black mb-1.5">Mapeo Completado</p>
                              <p className="text-[10px] font-bold text-black uppercase tracking-widest mt-1.5 bg-[#f0f0f0] border-2 border-black px-2 py-1">Resultados extraídos a la derecha</p>
                            </div>
                          )}
                        </div>

                        {/* Resultados Mock IA */}
                        <div className="flex flex-col justify-center gap-5 relative"> {/* Gap aumentado */}
                          {aiStatus !== 'done' && (
                            <div className="absolute inset-0 bg-white/95 z-10 flex items-center justify-center border-4 border-dashed border-black">
                              <span className="font-black text-[12px] text-black bg-[#FFCF40] border-2 border-black px-5 py-2.5 uppercase tracking-widest text-center shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                                Esperando fotografía<br/>para extraer telemetría
                              </span>
                            </div>
                          )}
                          <div className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <span className="text-[10px] font-black text-black bg-[#FFCF40] px-2 py-1 uppercase border-2 border-black w-fit block mb-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">Detección de Topografía</span>
                            <span className="text-sm font-bold text-black">Pendiente Leve (~5%) detectada en el plano base.</span>
                          </div>
                          <div className="p-5 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <span className="text-[10px] font-black text-black bg-[#FFCF40] px-2 py-1 uppercase border-2 border-black w-fit block mb-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">Accesibilidad Espacial</span>
                            <span className="text-sm font-bold text-black">Apertura estrecha de 1.2m. Imposibilita ingreso de maquinaria pesada.</span>
                          </div>
                          <div className="p-5 border-2 border-black bg-[#111] shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                            <span className="text-[10px] font-black text-[#111] bg-[#ef4444] px-2 py-1 uppercase border-2 border-black w-fit block mb-2.5 shadow-[2px_2px_0px_rgba(0,0,0,1)]">Interferencias (Atención)</span>
                            <span className="text-sm font-bold text-white">Presencia de radier antiguo y escombros menores que requieren retiro.</span>
                          </div>
                          <div className="text-right mt-2.5">
                            <button className="text-[10px] font-black text-black bg-white border-2 border-black px-2.5 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:bg-[#FFCF40] uppercase tracking-widest transition-colors"
                                    onClick={() => setAiStatus('idle')}>
                              [ Limpiar y reescanear ]
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BLOQUE 3: CONDICIONES DE ENTORNO (MANUAL) */}
                    <div className="mb-8"> {/* Espaciado extra */}
                        <SiteDataBlock siteData={siteData} setSiteData={setSiteData} />
                    </div>

                  </div>
                )}

                {/* ─── RENDER NORMAL PARA LISTADO DE PARTIDAS (BD) ─────────────── */}
                {stages[stageIdx].type === 'db' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-10"> {/* Gaps y margen aumentados */}
                    {stages[stageIdx].options.map((opt) => {
                      const sel = !!projSel[opt.id];
                      return (
                        <div key={opt.id} 
                             className={`group flex flex-col bg-white border-2 transition-all cursor-pointer relative 
                                        ${sel ? 'border-black bg-[#FFCF40] shadow-[6px_6px_0px_rgba(0,0,0,1)] -translate-y-1' : 'border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
                             onClick={() => setProjSel(p => { 
                               const n = {...p}; 
                               if (n[opt.id]) delete n[opt.id]; 
                               else n[opt.id] = { ...opt, grupo: stages[stageIdx].title }; 
                               return n; 
                             })}>
                          
                          <div className="p-6 flex-1 flex flex-col"> {/* Padding aumentado */}
                            <div className="flex justify-between items-start mb-5">
                              <h3 className={`font-black text-[14px] uppercase pr-8 leading-tight text-black`}>
                                {opt.nombre}
                              </h3>
                              {sel ? (
                                <Check size={24} strokeWidth={4} className="text-black absolute top-5 right-5 flex-shrink-0"/>
                              ) : (
                                <div className="w-5 h-5 border-2 border-black absolute top-5 right-5 flex-shrink-0 bg-white"></div>
                              )}
                            </div>
                            
                            {opt.desc && <p className="text-[12px] font-bold text-gray-700 leading-relaxed mb-7 line-clamp-3">{opt.desc}</p>}
                            
                            <div className="mt-auto pt-5 border-t-2 border-black flex justify-between items-center">
                              <span className="font-black text-[11px] bg-black text-white border-2 border-black px-2.5 py-1 tracking-widest uppercase">
                                {opt.unidad}
                              </span>
                              <span className={`font-mono text-[14px] font-black text-black bg-white px-2.5 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]`}>
                                {opt.ufRef} UF / Base
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* BOTONERÍA DE NAVEGACIÓN - Margen superior aumentado */}
            <div className="flex justify-between mt-16 pt-10 border-t-4 border-black">
              {stageIdx > 0 ? (
                <button className="flex items-center gap-2.5 font-black text-sm uppercase px-7 py-4.5 border-2 border-black bg-white text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all"
                        onClick={() => setStageIdx(s => s-1)}>
                  <ChevronLeft size={20} strokeWidth={3}/> ANTERIOR
                </button>
              ) : <div></div>}
              
              {stageIdx < stages.length - 1 ? (
                <button className="flex items-center gap-2.5 font-black text-sm uppercase px-9 py-4.5 border-2 border-black bg-[#FFCF40] text-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all" 
                        onClick={() => setStageIdx(s => s+1)}>
                  SIGUIENTE ETAPA <ArrowRight size={20} strokeWidth={3}/>
                </button>
              ) : (
                <button className="flex items-center gap-2.5 font-black text-sm uppercase px-9 py-4.5 border-2 border-black bg-black text-[#FFCF40] shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={allTicket.length === 0}
                        onClick={() => goStep(3)}>
                  CERRAR PRESUPUESTO <ArrowRight size={20} strokeWidth={3}/>
                </button>
              )}
            </div>
          </div>

          {/* COLUMNA 2: INFO EXTRA Y CONTEXTO MATEMÁTICO - Espaciado interno aumentado */}
          <div className="sticky top-10 hidden lg:block mb-10">
            <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2.5 mb-6 border-b-2 border-black pb-5">
                <Info size={20} className="text-black" strokeWidth={3}/>
                <span className="font-black text-[12px] text-black tracking-widest bg-[#FFCF40] px-2 py-1 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">INFO MOTOR HV</span>
              </div>
              <p className="text-[13px] font-bold text-black leading-relaxed mb-7">
                El sistema extrae el desglose técnico directo de la base de datos maestra. Puedes seleccionar <strong className="bg-[#FFCF40] px-1 border-2 border-black">múltiples partidas</strong> dentro de cada etapa. Las operaciones matemáticas se ejecutarán en base a las medidas del ANÁLISIS INICIAL.
              </p>
              
              <div className="bg-[#f0f0f0] border-2 border-black p-5 text-[13px] text-black font-mono font-black mb-8 leading-relaxed shadow-[4px_4px_0px_rgba(0,0,0,1)] flex flex-col gap-3">
                <div className="flex justify-between items-center gap-2">Área Analizada: <span className="bg-white px-2 py-0.5 border-2 border-black whitespace-nowrap">{metrics.m2.toFixed(1)} m²</span></div>
                <div className="flex justify-between items-center gap-2">Perímetro Activo: <span className="bg-white px-2 py-0.5 border-2 border-black whitespace-nowrap">{metrics.ml?.toFixed(1)} ml</span></div>
                {metrics.m3 > 0 && <div className="flex justify-between items-center gap-2">Volumen en Obra: <span className="bg-white px-2 py-0.5 border-2 border-black whitespace-nowrap">{metrics.m3.toFixed(1)} m³</span></div>}
              </div>

              {/* Rango Referencial */}
              {projCat.ufMin && (
                <div className="bg-[#111] border-2 border-black p-6 mt-8 text-white shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                  <div className="font-black text-[11px] text-[#FFCF40] tracking-widest mb-5 text-center border-b-2 border-[#FFCF40] pb-3">RANGO DE MERCADO (UF/m²)</div>
                  <div className="flex justify-between items-center text-white font-black text-3xl">
                    <span>{projCat.ufMin}</span>
                    <div className="flex-1 h-[2px] bg-white mx-5 relative">
                      <div className="absolute h-4 bg-[#FFCF40] border-y-2 border-black w-1/3 top-[-7px] left-1/3 shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
                    </div>
                    <span>{projCat.ufMax}</span>
                  </div>
                  <div className="text-[10px] font-bold text-center text-gray-400 mt-5 uppercase tracking-widest">Referencia Construcción Chile</div>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA 3: TICKET FIJO DE INVERSIÓN (CARRITO) */}
          <div className="sticky top-10 bg-white border-2 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] flex flex-col h-[calc(100vh-60px)] max-h-[750px] mb-10">
            <div className="p-7 border-b-4 border-black bg-[#111] text-white">
              <div className="flex items-center gap-2.5 mb-3">
                <Zap size={22} strokeWidth={3} className="text-[#FFCF40]"/>
                <span className="font-black text-xl text-white uppercase tracking-wider">
                  CARRITO DE OBRA
                </span>
              </div>
              <div className="font-black text-[11px] text-[#FFCF40] tracking-widest bg-white text-black px-2.5 py-1 inline-block border-2 border-black">
                {metrics.m2.toFixed(1)} m² SUPERFICIE · {allTicket.length} PARTIDAS
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
              {allTicket.length === 0 && (
                <div className="font-black text-[12px] text-gray-500 text-center py-16 tracking-widest uppercase border-2 border-dashed border-gray-300 m-5">
                  — Desglose vacío —
                </div>
              )}
              {allTicket.map((it, i) => (
                <div key={i} className="flex justify-between items-start gap-4 p-5 border-b-2 border-black last:border-b-0 hover:bg-[#f0f0f0] transition-colors">
                  <div className="text-black max-w-[65%]">
                    <div className="text-[10px] text-black bg-[#FFCF40] border-2 border-black px-1.5 font-black tracking-widest mb-2.5 uppercase font-mono w-fit shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                      {it.grupo}
                    </div>
                    <div className="text-[13px] leading-tight font-black text-black">{it.nombre}</div>
                  </div>
                  <div className="font-mono text-[13px] font-black text-black bg-white px-2.5 py-1.5 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] whitespace-nowrap">
                    {fmtUF(it.cost)} UF
                  </div>
                </div>
              ))}
            </div>

            <div className="p-7 border-t-4 border-black bg-[#FFCF40]">
              <div className="font-black text-[12px] text-black tracking-widest mb-3 uppercase">TOTAL PROVISORIO (SIN IVA)</div>
              <div className="font-black text-5xl text-black leading-none tracking-tight flex items-baseline gap-2.5">
                {fmtUF(totalUF)} <span className="text-2xl text-black">UF</span>
              </div>
              <div className="font-mono font-black text-sm text-white bg-[#111] border-2 border-black px-4 py-1.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] mt-5 inline-block">
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