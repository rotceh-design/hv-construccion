import React from 'react';
import { ArrowLeft, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { PROYECTOS_DATA, UF_VALOR } from '../../data/serviciosData';

// Helpers
const fmt = n => Math.round(n).toLocaleString('es-CL');
const fmtUF = n => (n ?? 0).toFixed(2);

const BackBtn = ({ onClick, label='Volver' }) => (
  <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--text3)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer', padding:0, marginBottom:32 }}>
    <ArrowLeft size={13}/> {label}
  </button>
);

export const SectionProyectos = ({
  projCatId, setProjCatId,
  projSel, setProjSel,
  faseIdx, setFaseIdx,
  doneFases, setDoneFases,
  m2, setM2,
  goStep,
  projCat,
}) => {
  // SELECTOR DE PROYECTO
  if (!projCatId) {
    return (
      <div className="fade-up">
        <BackBtn onClick={() => goStep(1)}/>
        <div style={{ marginBottom:48 }}>
          <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:12 }}>Proyectos HV Construcción</div>
          <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(36px,5vw,68px)', textTransform:'uppercase', lineHeight:.9, marginBottom:14 }}>
            Elige tu<br/><em style={{ color:'var(--gold)' }}>tipo de obra</em>
          </h1>
          <p style={{ color:'var(--text3)', fontSize:14, maxWidth:520 }}>
            Precio asume todo desde cero. Selecciona materiales y la IA calcula el presupuesto máximo.
          </p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:20 }}>
          {Object.entries(PROYECTOS_DATA).map(([key, cat], i) => (
            <button key={key}
              style={{ animationDelay:`${i*.07}s`, background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', padding:'32px 28px', textAlign:'left', cursor:'pointer', transition:'all .3s', position:'relative', overflow:'hidden' }}
              className="macro-card fade-up"
              onClick={() => { setProjCatId(key); setProjSel({}); setFaseIdx(0); setDoneFases(new Set()); goStep(2.5); }}>
              <div style={{ fontSize:36, marginBottom:12 }}>{cat.emoji}</div>
              <h3 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:28, textTransform:'uppercase', color:'#fff', lineHeight:1, marginBottom:8 }}>{cat.label}</h3>
              <p style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6, marginBottom:16 }}>{cat.nota}</p>
              <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>
                {cat.items?.length} partidas disponibles <ChevronRight size={13}/>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // CONSTRUCTOR DE PROYECTO
  const items = projCat?.items ?? [];
  const totalUF = items.reduce((s,it) => {
    const key = `${it.nombre}_${it.id}`;
    return s + (projSel[key] ? (it.costoTotal_uf ?? 0) : 0);
  }, 0);
  const totalScaled = totalUF * m2;

  return (
    <div className="fade-up">
      <BackBtn onClick={() => { goStep(2); setProjCatId(null); }}/>
      <div style={{ display:'flex', gap:24, alignItems:'flex-start', flexWrap:'wrap', marginBottom:32 }}>
        <div style={{ flex:1, minWidth:220 }}>
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:6 }}>
            {projCat?.emoji} {projCat?.label}
          </div>
          <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(30px,4vw,52px)', textTransform:'uppercase', lineHeight:.9, marginBottom:8 }}>
            Selecciona<br/><em style={{ color:'var(--gold)' }}>tus partidas</em>
          </h1>
          <p style={{ fontSize:13, color:'var(--text3)', lineHeight:1.6, maxWidth:420 }}>{projCat?.nota}</p>
        </div>
        {/* M² + precio */}
        <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-lg)', padding:20, minWidth:240 }}>
          <div style={{ fontSize:11, color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:10 }}>Superficie</div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <button onClick={() => setM2(p => Math.max(10,p-5))} style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.08)', border:'none', color:'#fff', cursor:'pointer', fontSize:18 }}>−</button>
            <input type="number" value={m2} min={10} max={500} onChange={e => setM2(Number(e.target.value)||10)} className="m2-inp"/>
            <button onClick={() => setM2(p => Math.min(500,p+5))} style={{ width:34, height:34, borderRadius:9, background:'var(--gold)', border:'none', color:'#000', cursor:'pointer', fontSize:18 }}>+</button>
            <span style={{ fontSize:16, color:'var(--text3)' }}>m²</span>
          </div>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:38, color:'var(--gold)', lineHeight:1 }}>
            {fmtUF(totalScaled)} <span style={{ fontSize:18 }}>UF</span>
          </div>
          <div style={{ fontSize:11, color:'var(--text3)', marginTop:4 }}>${fmt(totalScaled * UF_VALOR)} CLP</div>
        </div>
      </div>

      {/* Items como tarjetas */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {items.map(it => {
          const key = `${it.nombre}_${it.id}`;
          const sel = !!projSel[key];
          return (
            <div key={it.id} className={`proj-opt ${sel ? 'sel' : ''}`}
              onClick={() => {
                setProjSel(prev => {
                  const n = { ...prev };
                  if (n[key]) delete n[key]; else n[key] = { ...it, qty:1, grupo: it.nombre };
                  return n;
                });
              }}>
              <div style={{ width:20, height:20, borderRadius:6, border:`2px solid ${sel ? 'var(--gold)' : 'rgba(255,255,255,.25)'}`, background:sel ? 'var(--gold)' : 'transparent', flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s' }}>
                {sel && <Check size={11} color="#000" strokeWidth={3}/>}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:'#fff', lineHeight:1.3 }}>{it.nombre}</div>
                  <div style={{ flexShrink:0, textAlign:'right' }}>
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:18, fontWeight:700, color: sel ? 'var(--gold)' : 'var(--text3)' }}>
                      {fmtUF(it.costoTotal_uf)} UF
                    </span>
                    <span style={{ fontSize:10, color:'var(--text3)', marginLeft:3 }}>/{it.unidad}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display:'flex', justifyContent:'flex-end', marginTop:32, gap:12 }}>
        <button onClick={() => goStep(3)}
          style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 28px', background:'var(--gold)', color:'#000', border:'none', borderRadius:'var(--r-md)', fontWeight:800, fontSize:14, cursor:'pointer', textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'var(--ff-body)' }}>
          Ver presupuesto <ArrowRight size={16}/>
        </button>
      </div>
    </div>
  );
};

export default SectionProyectos;
