import React from 'react';
import { Wrench, ArrowRight, Shield, ChevronDown, Minus, Plus, Check } from 'lucide-react';
import { SERVICIOS_DETALLE } from '../../data/serviciosData';
import { SUBOPCIONES, CAT_ICON, fmt, fmtUF, BackBtn } from './Cotizadorpage';

const SuboptCard = ({ opt, selected, onToggle }) => {
  const isSlot = !opt.img || opt.img.endsWith('_IMG');
  return (
    <div className={`opt-card ${selected ? 'sel' : ''}`} onClick={() => onToggle(opt.id)}>
      <div className="opt-img">
        {isSlot ? <div className="opt-img-placeholder">📷 imagen</div> : <img src={opt.img} alt={opt.label} loading="lazy"/>}
        <div className="sel-ring"><Check size={12} color="#000" strokeWidth={3}/></div>
      </div>
      <div className="opt-body">
        <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:3, lineHeight:1.3 }}>{opt.label}</div>
        {opt.uf_extra > 0 && <div style={{ fontSize:12, color:'var(--gold)', fontWeight:700, marginBottom:4 }}>+{fmtUF(opt.uf_extra)} UF</div>}
        {opt.uf_extra === 0 && <div style={{ fontSize:11, color:'var(--green)', fontWeight:700, marginBottom:4 }}>Incluido</div>}
        <div style={{ fontSize:11, color:'var(--text3)', lineHeight:1.5 }}>{opt.desc}</div>
        {opt.normativa && <span className="norm-b" style={{ marginTop:6, display:'inline-flex' }}><Shield size={7}/>{opt.normativa}</span>}
        {opt.marca && <div style={{ fontSize:10, color:'rgba(255,207,64,.4)', marginTop:4 }}>↗ {opt.marca}</div>}
      </div>
    </div>
  );
};

const SuboptGroup = ({ grupo, selections, onChange }) => {
  const cols = grupo.opciones.length <= 2 ? 2 : grupo.opciones.length === 3 ? 3 : 4;
  return (
    <div style={{ marginBottom:24 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <span style={{ fontSize:12, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:'.06em' }}>{grupo.label}</span>
        <span style={{ fontSize:10, padding:'2px 8px', borderRadius:20, fontWeight:600, background: grupo.tipo==='radio' ? 'rgba(255,207,64,.1)' : 'rgba(46,204,113,.1)', color: grupo.tipo==='radio' ? 'var(--gold)' : 'var(--green)' }}>
          {grupo.tipo === 'radio' ? 'Elige 1' : 'Varios posibles'}
        </span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(cols, 4)}, 1fr)`, gap:10 }}>
        {grupo.opciones.map(opt => {
          const sel = Array.isArray(selections[grupo.id]) ? selections[grupo.id].includes(opt.id) : selections[grupo.id] === opt.id;
          return <SuboptCard key={opt.id} opt={opt} selected={sel} onToggle={id => onChange(grupo.id, id, grupo.tipo)}/>;
        })}
      </div>
    </div>
  );
};

const SectionUrgencias = ({
  goStep, activeCat, setActiveCat, cart, handleQty,
  expandedSvc, setExpandedSvc, svcSubs, handleSubopt, cartCount
}) => {
  const cats = Object.entries(SERVICIOS_DETALLE).filter(([k]) => k === 'urgencias');
  const catKey = activeCat ?? cats[0]?.[0];
  const catData = catKey ? SERVICIOS_DETALLE[catKey] : null;

  return (
    <div className="fade-up">
      <BackBtn onClick={() => goStep(1)}/>
      <div style={{ marginBottom:36 }}>
        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:10 }}>
          🚨 Urgencias 24/7
        </div>
        <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(34px,5vw,62px)', textTransform:'uppercase', lineHeight:.9, marginBottom:12 }}>
          Emergencias,<br/><em style={{ color:'var(--gold)' }}>resolvemos ya</em>
        </h1>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10, marginBottom:36 }}>
        {cats.map(([key, data]) => {
          const isSlot = true;
          const isActive = catKey === key;
          return (
            <div key={key} className={`cat-card ${isActive ? 'active' : ''} fade-in`} onClick={() => setActiveCat(key)}>
              <div className="bg" style={{ background: isSlot ? data.color+'18' : `url(#) center/cover` }}>
                {isSlot && <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', color:data.color, opacity:.5, fontSize:32 }}>{CAT_ICON[key] ?? <Wrench size={32}/>}</div>}
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

      {catData && (
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden' }} className="scale-in">
          <div style={{ padding:'22px 28px', borderBottom:'1px solid var(--border)', background:`linear-gradient(90deg,${catData.color}12 0%,transparent 60%)`, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:catData.color+'22', display:'flex', alignItems:'center', justifyContent:'center', color:catData.color }}>
              {CAT_ICON[catKey] ?? <Wrench size={22}/>}
            </div>
            <div>
              <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:26, textTransform:'uppercase', color:'#fff' }}>{catData.label}</div>
              <div style={{ fontSize:12, color:'var(--text3)' }}>{catData.items.length} urgencias disponibles</div>
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
                      <span style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:'var(--gold)' }}>{fmtUF(ufFinal)} UF</span>
                      <span style={{ fontSize:11, color:'var(--text3)' }}>/ {item.unidad}</span>
                      <span style={{ fontSize:11, color:'rgba(255,255,255,.2)' }}>· ${fmt(item.precioTotal_clp ?? 0)}</span>
                      {subExtra > 0 && <span style={{ fontSize:11, color:'var(--green)', fontWeight:600 }}>+{fmtUF(subExtra)} UF subespecificaciones</span>}
                      {subs && <span style={{ fontSize:10, color:catData.color, fontWeight:600, background:catData.color+'15', padding:'2px 8px', borderRadius:20 }}>{subs.length} opciones</span>}
                    </div>
                    {item.marca && <div style={{ fontSize:10, color:'rgba(255,207,64,.35)', marginTop:3 }}>↗ {item.marca}</div>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:12, flexShrink:0 }}>
                    <ChevronDown size={15} style={{ color:'var(--text3)', transform:isExp?'rotate(180deg)':'none', transition:'transform .2s' }}/>
                    <div className="qty-wrap" onClick={e => e.stopPropagation()}>
                      <button className="qty-btn" onClick={() => handleQty(item,-1)} style={{ background:qty>0?'rgba(255,255,255,.1)':'transparent', color:qty>0?'#fff':'rgba(255,255,255,.15)' }}><Minus size={12}/></button>
                      <span style={{ width:22, textAlign:'center', fontWeight:700, fontSize:14, color:qty>0?'var(--gold)':'var(--text3)' }}>{qty}</span>
                      <button className="qty-btn" onClick={() => handleQty(item,1)} style={{ background:'var(--gold)', color:'#000' }}><Plus size={12}/></button>
                    </div>
                  </div>
                </div>

                {isExp && (
                  <div className="svc-row-expanded fade-in">
                    <div style={{ background:'var(--bg3)', borderRadius:'var(--r-sm)', padding:'12px 14px', marginBottom:20, fontSize:12, color:'var(--text2)', lineHeight:1.6 }}>{item.desc}</div>
                    {subs ? (
                      <div>
                        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:16 }}>Personaliza esta urgencia</div>
                        {subs.map(grupo => (
                          <SuboptGroup key={grupo.id} grupo={grupo} selections={subSels} onChange={(gid, oid, tipo) => handleSubopt(item.id, gid, oid, tipo)}/>
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
          <button onClick={() => goStep(3)} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background:'var(--gold)', color:'#000', border:'none', borderRadius:'var(--r-md)', fontWeight:800, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--ff-body)' }}>
            Ver cotización ({cartCount}) <ArrowRight size={16}/>
          </button>
        </div>
      )}
    </div>
  );
};

export default SectionUrgencias;