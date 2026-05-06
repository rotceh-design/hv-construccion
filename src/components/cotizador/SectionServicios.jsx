import React from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, Plus, Minus, Wrench, Shield } from 'lucide-react';
import { SERVICIOS_DETALLE } from '../../data/serviciosData';

// Helpers
const fmtUF = n => (n ?? 0).toFixed(2);

const CAT_ICON = {
  gas_sanitaria: <Wrench size={32}/>,
  climatizacion: <Wrench size={32}/>,
  electricidad: <Wrench size={32}/>,
  estructuras: <Wrench size={32}/>,
  terminaciones: <Wrench size={32}/>,
  urgencias: <Wrench size={32}/>,
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

export const SectionServicios = ({
  activeCat, setActiveCat,
  expandedSvc, setExpandedSvc,
  cart, setCart,
  svcSubs, setSvcSubs,
  cartCount,
  goStep,
  SUBOPCIONES,
}) => {
  const cats = Object.entries(SERVICIOS_DETALLE).filter(([k]) => k !== 'urgencias');
  const catKey = activeCat ?? cats[0]?.[0];
  const catData = catKey ? SERVICIOS_DETALLE[catKey] : null;

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
        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:10 }}>
          🔧 Servicios Especializados
        </div>
        <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(34px,5vw,62px)', textTransform:'uppercase', lineHeight:.9, marginBottom:12 }}>
          Elige tu<br/>
          <em style={{ color:'var(--gold)' }}>especialidad</em>
        </h1>
      </div>

      {/* Tarjetas de categoría */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10, marginBottom:36 }}>
        {cats.map(([key, data]) => {
          const isActive = catKey === key;
          return (
            <div key={key} className={`cat-card ${isActive ? 'active' : ''} fade-in`}
              style={{ animationDelay:'.05s' }}
              onClick={() => setActiveCat(key)}>
              <div className="bg" style={{ background: data.color+'18' }}>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:data.color, opacity:.5, fontSize:32 }}>
                  {CAT_ICON[key] ?? <Wrench size={32}/>}
                </div>
              </div>
              <div className="veil"/>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:data.color }}/>
              <div className="cnt">
                <div style={{ color:data.color, marginBottom:4 }}>{CAT_ICON[key] ?? <Wrench size={16}/>}</div>
                <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:15, textTransform:'uppercase', lineHeight:1.1, color:'#fff', marginBottom:3 }}>{data.label}</div>
                <div style={{ fontSize:10, color:'var(--text3)', fontWeight:500 }}>{data.items.length} servicios</div>
                {isActive && <div style={{ position:'absolute', top:10, right:10, width:8, height:8, borderRadius:'50%', background:'var(--gold)' }}/>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lista de ítems */}
      {catData && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden' }} className="scale-in">
          <div style={{ padding:'22px 28px', borderBottom:'1px solid var(--border)', background:`linear-gradient(90deg,${catData.color}12 0%,transparent 60%)`, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:catData.color+'22', display:'flex', alignItems:'center', justifyContent:'center', color:catData.color }}>
              {CAT_ICON[catKey] ?? <Wrench size={22}/>}
            </div>
            <div>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:26, textTransform:'uppercase', color:'#fff' }}>{catData.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>{catData.items.length} servicios · Selecciona y personaliza</div>
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
                      {item.normativa && <span className="norm-b"><Shield size={7}/>{item.normativa.split('—')[0].trim()}</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:'var(--gold)' }}>
                        {fmtUF(ufFinal)} UF
                      </span>
                      <span style={{ fontSize:11, color:'var(--text3)' }}>/ {item.unidad}</span>
                      {subExtra > 0 && <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>+{fmtUF(subExtra)} UF subespecificaciones</span>}
                      {subs && <span style={{ fontSize:10, color:catData.color, fontWeight:600, background:catData.color+'15', padding:'2px 8px', borderRadius:20 }}>{subs.length} opciones</span>}
                    </div>
                    {item.marca && <div style={{ fontSize:10, color:'rgba(255,207,64,.35)', marginTop:3 }}>↗ {item.marca}</div>}
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
                        style={{ background:'var(--gold)', color:'#000' }}>
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
                        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:16 }}>
                          Personaliza este servicio
                        </div>
                        {subs.map(grupo => (
                          <SuboptGroup key={grupo.id} grupo={grupo}
                            selections={subSels}
                            onChange={(gid, oid, tipo) => handleSubopt(item.id, gid, oid, tipo)}/>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize:12, color:'var(--text3)', fontStyle:'italic', marginBottom:8 }}>Servicio estándar sin subespecificaciones adicionales.</div>
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
            style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background:'var(--gold)', color:'#000', border:'none', borderRadius:'var(--r-md)', fontWeight:800, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--ff-body)' }}>
            Ver cotización ({cartCount}) <ArrowRight size={16}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionServicios;
