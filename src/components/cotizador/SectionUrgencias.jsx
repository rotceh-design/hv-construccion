import React from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Minus, Flame, AlertTriangle } from 'lucide-react';
import { SERVICIOS_DETALLE } from '../../data/serviciosData';

// Helpers
const fmtUF = n => (n ?? 0).toFixed(2);

const CAT_ICON = {
  urgencias: <Flame size={32}/>,
};

const BackBtn = ({ onClick, label='Volver' }) => (
  <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--text3)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer', padding:0, marginBottom:32 }}>
    <ArrowLeft size={13}/> {label}
  </button>
);

const SuboptGroup = ({ grupo, selections, onChange }) => (
  <div style={{ marginBottom:18 }}>
    <div style={{ fontSize:12, fontWeight:600, color:'#fff', marginBottom:10, textTransform:'capitalize' }}>{grupo.label}</div>
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      {grupo.opciones.map(opt => {
        const sel = grupo.tipo === 'radio'
          ? selections[grupo.id] === opt.id
          : Array.isArray(selections[grupo.id]) && selections[grupo.id].includes(opt.id);
        return (
          <label key={opt.id} style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', padding:'10px 12px', borderRadius:8, background:'rgba(255,255,255,.03)', transition:'all .2s', border:'1px solid transparent' }}>
            <input type={grupo.tipo === 'radio' ? 'radio' : 'checkbox'}
              checked={sel}
              onChange={() => onChange(grupo.id, opt.id, grupo.tipo)}
              style={{ marginTop:3, cursor:'pointer' }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{opt.label}</div>
              {opt.desc && <div style={{ fontSize:11, color:'var(--text3)', marginTop:2 }}>{opt.desc}</div>}
              {opt.marca && <div style={{ fontSize:10, color:'rgba(255,207,64,.4)', marginTop:2 }}>↗ {opt.marca}</div>}
              {opt.uf_extra > 0 && <div style={{ fontSize:11, color:'var(--green)', marginTop:2, fontWeight:600 }}>+{fmtUF(opt.uf_extra)} UF</div>}
            </div>
          </label>
        );
      })}
    </div>
  </div>
);

export const SectionUrgencias = ({
  activeCat, setActiveCat,
  expandedSvc, setExpandedSvc,
  cart, setCart,
  svcSubs, setSvcSubs,
  cartCount,
  goStep,
  SUBOPCIONES,
}) => {
  const cats = Object.entries(SERVICIOS_DETALLE).filter(([k]) => k === 'urgencias');
  const catKey = 'urgencias';
  const catData = SERVICIOS_DETALLE['urgencias'] ?? null;

  const handleQty = (item, delta) => {
    setCart(prev => {
      const cur = prev[item.id]?.qty ?? 0;
      const nxt = Math.max(0, cur + delta);
      if (nxt === 0) { const c = {...prev}; delete c[item.id]; return c; }
      return { ...prev, [item.id]: { ...item, qty: nxt } };
    });
  };

  const handleSubopt = (itemId, grupoId, optId, tipo) => {
    setSvcSubs(prev => {
      const cur = { ...(prev[itemId] ?? {}) };
      if (tipo === 'radio') {
        cur[grupoId] = optId;
      } else {
        const arr = Array.isArray(cur[grupoId]) ? [...cur[grupoId]] : [];
        const idx = arr.indexOf(optId);
        if (idx >= 0) arr.splice(idx, 1); else arr.push(optId);
        cur[grupoId] = arr;
      }
      return { ...prev, [itemId]: cur };
    });
  };

  return (
    <div className="fade-up">
      <BackBtn onClick={() => goStep(1)}/>
      <div style={{ marginBottom:36 }}>
        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
          <Flame size={16} style={{ color:'var(--red)' }}/> Urgencias 24/7
        </div>
        <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(34px,5vw,62px)', textTransform:'uppercase', lineHeight:.9, marginBottom:12 }}>
          Emergencias,<br/>
          <em style={{ color:'var(--red)' }}>resolvemos ya</em>
        </h1>
        <p style={{ color:'var(--text3)', fontSize:14, maxWidth:520 }}>
          Respuesta en menos de 2 horas. Precio fijo garantizado. Fugas, cortes eléctricos, destabes, reparaciones urgentes.
        </p>
      </div>

      {/* Tarjeta de categoría */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:28, background:'rgba(192,57,43,.08)', border:'1px solid rgba(192,57,43,.2)', borderRadius:'var(--r-lg)', padding:16 }}>
        <div style={{ width:50, height:50, borderRadius:12, background:'rgba(192,57,43,.15)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red)', flexShrink:0 }}>
          <AlertTriangle size={24}/>
        </div>
        <div>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:20, textTransform:'uppercase', color:'#fff', marginBottom:2 }}>Urgencias 24/7</div>
          <div style={{ fontSize:13, color:'var(--text3)' }}>Disponibles todos los días. Respuesta inmediata garantizada.</div>
        </div>
        <div style={{ marginLeft:'auto', flexShrink:0, display:'flex', alignItems:'center', gap:6, padding:'6px 14px', background:'rgba(192,57,43,.2)', borderRadius:20 }}>
          <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--red)', animation:'pulse2 1.5s infinite' }}/>
          <span style={{ fontSize:11, fontWeight:700, color:'var(--red)', textTransform:'uppercase' }}>Activo</span>
        </div>
      </div>

      {/* Lista de ítems */}
      {catData && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden' }} className="scale-in">
          <div style={{ padding:'22px 28px', borderBottom:'1px solid var(--border)', background:`linear-gradient(90deg,#c0392b12 0%,transparent 60%)`, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'#c0392b22', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--red)' }}>
              <Flame size={22}/>
            </div>
            <div>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:26, textTransform:'uppercase', color:'#fff' }}>{catData.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>{catData.items.length} servicios · Selecciona lo que necesitas</div>
            </div>
          </div>

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
              <div key={item.id} className="svc-row">
                <div className="svc-row-header" onClick={() => setExpandedSvc(isExp ? null : item.id)}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4, flexWrap:'wrap' }}>
                      <span style={{ fontWeight:600, fontSize:14, color:'#fff' }}>{item.nombre}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:'var(--gold)' }}>
                        {fmtUF(ufFinal)} UF
                      </span>
                      <span style={{ fontSize:11, color:'var(--text3)' }}>/ {item.unidad}</span>
                      {subExtra > 0 && <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>+{fmtUF(subExtra)} UF</span>}
                      {subs && <span style={{ fontSize:10, color:'var(--red)', fontWeight:600, background:'#c0392b15', padding:'2px 8px', borderRadius:20 }}>{subs.length} opciones</span>}
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                    <ChevronDown size={15} style={{ color:'var(--text3)', transform:isExp?'rotate(180deg)':'none', transition:'transform .2s' }}/>
                    <div className="qty-wrap" onClick={e => e.stopPropagation()}>
                      <button className="qty-btn" onClick={() => handleQty(item,-1)}
                        style={{ background:qty>0?'rgba(255,255,255,.1)':'transparent', color:qty>0?'#fff':'rgba(255,255,255,.15)' }}>
                        <Minus size={12}/>
                      </button>
                      <span style={{ width:22, textAlign:'center', fontWeight:700, fontSize:14, color:qty>0?'var(--gold)':'var(--text3)' }}>{qty}</span>
                      <button className="qty-btn" onClick={() => handleQty(item,1)}
                        style={{ background:'var(--red)', color:'#fff' }}>
                        <Plus size={12}/>
                      </button>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="svc-row-expanded fade-in">
                    <div style={{ background:'var(--bg3)', borderRadius:'var(--r-sm)', padding:'12px 14px', marginBottom:20, fontSize:12, color:'var(--text2)', lineHeight:1.6 }}>
                      {item.desc}
                    </div>
                    {subs ? (
                      <div>
                        <div style={{ fontSize:11, color:'var(--red)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:16 }}>
                          Especificar urgencia
                        </div>
                        {subs.map(grupo => (
                          <SuboptGroup key={grupo.id} grupo={grupo}
                            selections={subSels}
                            onChange={(gid, oid, tipo) => handleSubopt(item.id, gid, oid, tipo)}/>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize:12, color:'var(--text3)', fontStyle:'italic', marginBottom:8 }}>Servicio urgente sin opciones adicionales.</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {cartCount > 0 && (
        <div style={{ display:'flex', justifyContent:'flex-end', marginTop:28 }}>
          <button onClick={() => goStep(3)}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background:'var(--red)', color:'#fff', border:'none', borderRadius:'var(--r-md)', fontWeight:800, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--ff-body)' }}>
            Ver urgencia ({cartCount}) <ArrowRight size={16}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionUrgencias;
