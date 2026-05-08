import React from 'react';
import { 
  Wrench, ArrowRight, Shield, ChevronDown, Minus, Plus, Check, Zap, AlertTriangle 
} from 'lucide-react';
import { SERVICIOS_DETALLE } from '../../data/serviciosData';
import { SUBOPCIONES, CAT_ICON, fmt, fmtUF, BackBtn } from './Cotizadorpage';

// ─── TARJETA DE SUB-OPCIÓN (ESTILO TÁCTICO) ──────────────────────────────────
const SuboptCard = ({ opt, selected, onToggle }) => {
  const isSlot = !opt.img || opt.img.endsWith('_IMG');
  return (
    <div 
      className={`group cursor-pointer transition-all border-2 border-black flex flex-col relative overflow-hidden
        ${selected 
          ? 'bg-[#FFCF40] shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1' 
          : 'bg-white hover:shadow-[4px_4px_0px_#FFCF40] hover:-translate-y-1 shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
      onClick={() => onToggle(opt.id)}
    >
      <div className="h-24 bg-black relative overflow-hidden border-b-2 border-black">
        {isSlot ? (
          <div className="flex items-center justify-center h-full text-[9px] font-black text-zinc-500 uppercase tracking-tighter">Imagen No Disponible</div>
        ) : (
          <img src={opt.img} alt={opt.label} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" loading="lazy"/>
        )}
        {selected && (
          <div className="absolute top-2 right-2 bg-black text-[#FFCF40] p-1 border border-black shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
            <Check size={12} strokeWidth={4}/>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="font-black text-[11px] uppercase leading-tight mb-1 text-black">{opt.label}</div>
        <div className="font-mono font-black text-[12px] text-black mb-2">
          {opt.uf_extra > 0 ? `+${fmtUF(opt.uf_extra)} UF` : 'INCLUIDO'}
        </div>
        <div className="text-[10px] font-bold text-zinc-700 leading-tight mb-2 line-clamp-2">{opt.desc}</div>
        {opt.normativa && (
          <span className="flex items-center gap-1 text-[8px] font-black bg-black text-white px-1.5 py-0.5 w-fit uppercase">
            <Shield size={8}/> {opt.normativa}
          </span>
        )}
      </div>
    </div>
  );
};

// ─── GRUPO DE SUB-OPCIONES ──────────────────────────────────────────────────
const SuboptGroup = ({ grupo, selections, onChange }) => {
  return (
    <div className="mb-8 last:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <span className="font-mono font-black text-[11px] tracking-widest text-black bg-[#FFCF40] border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase">
          {grupo.label}
        </span>
        <span className={`text-[9px] font-black border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_rgba(0,0,0,1)] uppercase
          ${grupo.tipo === 'radio' ? 'bg-white text-black' : 'bg-black text-white'}`}>
          {grupo.tipo === 'radio' ? 'Selección Única' : 'Múltiple'}
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {grupo.opciones.map(opt => {
          const sel = Array.isArray(selections[grupo.id]) ? selections[grupo.id].includes(opt.id) : selections[grupo.id] === opt.id;
          return <SuboptCard key={opt.id} opt={opt} selected={sel} onToggle={id => onChange(grupo.id, id, grupo.tipo)}/>;
        })}
      </div>
    </div>
  );
};

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
const SectionUrgencias = ({
  goStep, activeCat, setActiveCat, cart, handleQty,
  expandedSvc, setExpandedSvc, svcSubs, handleSubopt, cartCount
}) => {
  const cats = Object.entries(SERVICIOS_DETALLE).filter(([k]) => k === 'urgencias');
  const catKey = activeCat ?? cats[0]?.[0];
  const catData = catKey ? SERVICIOS_DETALLE[catKey] : null;

  return (
    <div className="animate-fade-in max-w-[1400px] mx-auto py-6">
      <BackBtn onClick={() => goStep(1)}/>
      
      {/* HEADER BRUTALISTA DE EMERGENCIA */}
      <div className="mb-14 mt-6 border-b-4 border-black pb-8">
        <div className="font-mono text-[11px] text-white font-black bg-red-600 border-2 border-black px-3 py-1 inline-block shadow-[4px_4px_0px_rgba(0,0,0,1)] tracking-widest mb-6 uppercase">
          /// PROTOCOLO DE RESPUESTA INMEDIATA 24/7
        </div>
        <h1 className="font-black text-5xl md:text-7xl uppercase leading-none tracking-tight text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          EMERGENCIAS Y<br/><span className="text-[#FFCF40]">URGENCIAS</span>
        </h1>
      </div>

      {/* SELECTOR DE CATEGORÍA (ESTILO TÁCTICO) */}
      <div className="mb-16">
        {cats.map(([key, data]) => {
          const isActive = catKey === key;
          return (
            <button 
              key={key} 
              className={`flex items-center gap-4 p-5 border-4 border-black transition-all text-left relative overflow-hidden group max-w-sm
                ${isActive 
                  ? 'bg-[#FFCF40] shadow-[6px_6px_0px_rgba(0,0,0,1)]' 
                  : 'bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)]'}`}
              onClick={() => setActiveCat(key)}
            >
              <div className="text-black bg-white border-2 border-black p-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                {CAT_ICON[key] ?? <AlertTriangle size={24}/>}
              </div>
              <div>
                <div className="font-black text-xl uppercase leading-none text-black">{data.label}</div>
                <div className="font-mono text-[10px] font-black text-zinc-600 uppercase mt-1">{data.items.length} Servicios Activos</div>
              </div>
              <div className="absolute top-2 right-2 w-3 h-3 bg-black animate-pulse"></div>
            </button>
          );
        })}
      </div>

      {/* LISTADO DE URGENCIAS (CONTENEDOR DE ALTO IMPACTO) */}
      {catData && (
        <div className="animate-fade-in bg-white border-4 border-black shadow-[10px_10px_0px_#FFCF40] overflow-hidden mb-12">
          {/* Header de la sección */}
          <div className="bg-black text-white p-6 flex items-center gap-6 border-b-4 border-black">
            <div className="w-14 h-14 bg-red-600 text-white flex items-center justify-center shadow-[4px_4px_0px_rgba(220,38,38,0.3)] border-2 border-black">
              <Zap size={30} fill="currentColor" strokeWidth={0}/>
            </div>
            <div>
              <h2 className="font-black text-3xl uppercase leading-none">Despliegue Técnico Inmediato</h2>
              <p className="font-mono text-[11px] text-red-500 tracking-widest mt-1 uppercase font-black">Atención Prioritaria en Terreno</p>
            </div>
          </div>

          <div className="divide-y-4 divide-black">
            {catData.items.map(item => {
              const qty = cart[item.id]?.qty ?? 0;
              const isExp = expandedSvc === item.id;
              const subs = SUBOPCIONES[item.id];
              const subSels = svcSubs[item.id] ?? {};
              
              const subExtra = Object.entries(subSels).reduce((s,[gid,val]) => {
                const grupo = (subs ?? []).find(g => g.id === gid);
                if (!grupo) return s;
                const ids = Array.isArray(val) ? val : [val];
                return s + ids.reduce((ss,oid) => ss + (grupo.opciones.find(o => o.id===oid)?.uf_extra??0), 0);
              }, 0);
              const ufFinal = (item.ufTotal ?? 0) + subExtra;

              return (
                <div key={item.id} className={`transition-colors ${isExp ? 'bg-zinc-50' : 'bg-white hover:bg-zinc-50'}`}>
                  {/* Fila de la Urgencia */}
                  <div className="p-6 flex flex-wrap items-center gap-6 cursor-pointer" onClick={() => setExpandedSvc(isExp ? null : item.id)}>
                    <div className="flex-1 min-w-[280px]">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-black text-lg uppercase text-black leading-tight">{item.nombre}</span>
                        {item.normativa && (
                          <span className="flex items-center gap-1 text-[9px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-tighter">
                            <Shield size={10}/> {item.normativa.split('—')[0].trim()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 flex-wrap">
                        <span className="font-mono font-black text-2xl text-black bg-[#FFCF40] border-2 border-black px-2 shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                          {fmtUF(ufFinal)} UF
                        </span>
                        <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">/ {item.unidad}</span>
                        {subExtra > 0 && <span className="text-[10px] font-black text-green-600 bg-green-50 border border-green-200 px-2 py-0.5">+{fmtUF(subExtra)} UF AJUSTE</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 ml-auto">
                      <div className="qty-wrap flex items-center bg-black border-2 border-black p-1 shadow-[3px_3px_0px_rgba(0,0,0,0.2)]" onClick={e => e.stopPropagation()}>
                        <button className="w-10 h-10 flex items-center justify-center text-[#FFCF40] hover:bg-zinc-800 transition-colors" onClick={() => handleQty(item,-1)}>
                          <Minus size={18} strokeWidth={3}/>
                        </button>
                        <span className="w-12 text-center font-black text-xl text-white">{qty}</span>
                        <button className="w-10 h-10 flex items-center justify-center bg-[#FFCF40] text-black hover:bg-yellow-300 transition-colors" onClick={() => handleQty(item,1)}>
                          <Plus size={18} strokeWidth={3}/>
                        </button>
                      </div>
                      <ChevronDown size={20} className={`text-black transition-transform duration-300 ${isExp ? 'rotate-180' : ''}`} strokeWidth={3}/>
                    </div>
                  </div>

                  {/* Panel de Personalización (Expandido) */}
                  {isExp && (
                    <div className="px-8 pb-10 border-t-2 border-zinc-200 animate-fade-in">
                      <div className="bg-zinc-100 text-black p-5 my-6 font-bold text-sm leading-relaxed border-l-8 border-red-600">
                        {item.desc}
                      </div>
                      
                      {subs ? (
                        <div className="mt-8">
                          <div className="font-mono font-black text-[11px] text-black mb-6 flex items-center gap-2 uppercase tracking-widest border-b-2 border-black pb-2">
                            <AlertTriangle size={14} className="text-red-600" fill="currentColor"/> Configuración de la Urgencia
                          </div>
                          {subs.map(grupo => (
                            <SuboptGroup key={grupo.id} grupo={grupo} selections={subSels} onChange={(gid, oid, tipo) => handleSubopt(item.id, gid, oid, tipo)}/>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] font-black text-zinc-400 uppercase tracking-widest italic py-4">
                          Urgencia estándar sin opciones de personalización.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FOOTER ACCIÓN - BOTÓN FLOTANTE */}
      {cartCount > 0 && (
        <div className="flex justify-end mt-12 mb-20">
          <button 
            onClick={() => goStep(3)} 
            className="flex items-center gap-4 px-10 py-5 bg-[#FFCF40] text-black border-4 border-black font-black text-lg uppercase tracking-widest shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,1)] transition-all"
          >
            GENERAR COTIZACIÓN ({cartCount}) <ArrowRight size={24} strokeWidth={3}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionUrgencias;