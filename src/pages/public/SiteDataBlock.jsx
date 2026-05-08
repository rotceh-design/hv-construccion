/**
 * ════════════════════════════════════════════════════════════════════════════
 * SiteDataBlock.jsx — HV CONSTRUCCIÓN CHILE
 * Bloque de Recopilación de Datos del Terreno para Motor IA
 * ESTILO "NIKE / BRUTALISTA" (Alto contraste, bordes gruesos, sombras duras)
 * ════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  Layers, MapPin, Compass, Sun, CloudRain, Wind, Thermometer,
  Mountain, Droplets, Zap, AlertTriangle, Camera, Upload,
  X, Check, ChevronDown, ChevronUp, Info, Eye, Home,
  Building2, Trees, Car, Truck, Users, Clock, Ruler,
  Shield, FileText, Image, Plus, Trash2, RotateCcw,
  ArrowUpDown, Waves, Flame, Shovel, HardHat, Wifi,
  Phone, Radio, Globe, BarChart2, Navigation, Lock
} from 'lucide-react';

// ─── ESTADO INICIAL EXPORTABLE ────────────────────────────────────────────
export const SITE_DATA_INITIAL = {
  soil: 'normal', soil_humedad: 'seco', soil_profundidad: '0-50cm', soil_napa: 'no', soil_pendiente: 'plano',
  access: 'camion', access_ancho: 'normal', acceso_horario: 'libre', estacionamiento: 'si',
  debris: 'limpio', demolicion_tipo: 'ninguna', arboles: 'ninguno', instalaciones: [],
  entorno_tipo: 'residencial', vecinos_distancia: 'normal', ruido_permitido: 'laboral', acceso_peatonal: 'si',
  agua_obra: 'si', electricidad_obra: 'si', gas_disponible: 'si', internet_obra: 'no',
  orientacion: 'norte', exposicion_viento: 'media', zona_sismica: 'Z3', zona_termica: 'ZT4', heladas: 'no', inundacion: 'no',
  zona_conservacion: 'no', altura_maxima: 'sin_restriccion', rasante: 'no_aplica', servidumbre: 'no',
  proyecto_tipo: 'remodelacion', uso_final: 'vivienda', ocupacion_durante: 'desocupado', plazo_requerido: 'normal', presupuesto_flex: 'moderada',
  observaciones: '', riesgos_detectados: '', fotos: [],
};

// ─── TOOLTIP COMPONENT ───────────────────────────────────────────────────
const Tip = ({ txt }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position:'relative', display:'inline-flex', marginLeft:6 }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={14} style={{ color:'#000', cursor:'help' }}/>
      {show && (
        <span style={{ position:'absolute', bottom:'calc(100% + 8px)', left:'50%', transform:'translateX(-50%)', background:'#111', border:'2px solid var(--gold)', borderRadius:0, padding:'8px 12px', fontSize:11, color:'#fff', zIndex:50, lineHeight:1.5, width:'max-content', maxWidth:220, whiteSpace:'normal', fontWeight:700, boxShadow:'4px 4px 0px rgba(0,0,0,1)' }}>
          {txt}
        </span>
      )}
    </span>
  );
};

// ─── CAMPO SELECT ─────────────────────────────────────────────────────────
const Field = ({ label, tip, children }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
    <label style={{ fontSize:11, fontFamily:'var(--ff-display)', color:'#111', textTransform:'uppercase', letterSpacing:'.1em', display:'flex', alignItems:'center', fontWeight:900 }}>
      {label} {tip && <Tip txt={tip}/>}
    </label>
    {children}
  </div>
);

const Select = ({ value, onChange, options, warn }) => (
  <select
    value={value} onChange={e => onChange(e.target.value)}
    style={{ background:'#fff', border:`2px solid ${warn ? '#ef4444' : '#000'}`, borderRadius:0, padding:'12px 14px', fontSize:13, color:'#111', outline:'none', cursor:'pointer', transition:'all .2s', width:'100%', fontFamily:'var(--ff-body)', fontWeight:700, boxShadow:'inset 4px 4px 0px rgba(0,0,0,0.05)' }}
    onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '4px 4px 0px rgba(0,0,0,1)'; }}
    onBlur={e => { e.target.style.borderColor = warn ? '#ef4444' : '#000'; e.target.style.boxShadow = 'inset 4px 4px 0px rgba(0,0,0,0.05)'; }}>
    {options.map(o => <option key={o.v} value={o.v} style={{ background:'#fff', color:'#111' }}>{o.l}</option>)}
  </select>
);

// ─── MULTI-CHECK ─────────────────────────────────────────────────────────
const MultiCheck = ({ options, value = [], onChange }) => (
  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
    {options.map(o => {
      const sel = value.includes(o.v);
      return (
        <button key={o.v} type="button"
          onClick={() => onChange(sel ? value.filter(x => x !== o.v) : [...value, o.v])}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:0, border:'2px solid #000', background: sel ? 'var(--gold)' : '#fff', color: '#111', fontSize:11, fontWeight:900, cursor:'pointer', transition:'all .15s', textTransform:'uppercase', letterSpacing:'.05em', boxShadow: sel ? '4px 4px 0px rgba(0,0,0,1)' : '2px 2px 0px rgba(0,0,0,0.1)' }}
          onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
          onMouseUp={e => e.currentTarget.style.transform = 'translate(0, 0)'}
        >
          {sel && <Check size={14} strokeWidth={4}/>}
          {o.l}
        </button>
      );
    })}
  </div>
);

// ─── UPLOAD DE FOTOS ──────────────────────────────────────────────────────
const FotoUpload = ({ fotos, onChange }) => {
  const inputRef = useRef();

  const handleFiles = useCallback((files) => {
    const nuevas = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      nuevas.push({
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        url, name: file.name, size: file.size, tipo: 'general', caption: '',
      });
    });
    onChange([...fotos, ...nuevas]);
  }, [fotos, onChange]);

  const removePhoto = (id) => onChange(fotos.filter(f => f.id !== id));
  const updatePhoto = (id, key, val) => onChange(fotos.map(f => f.id === id ? { ...f, [key]: val } : f));

  const TIPOS_FOTO = [
    { v:'general', l:'Vista general' }, { v:'suelo', l:'Suelo/terreno' },
    { v:'acceso', l:'Acceso' }, { v:'vecindad', l:'Entorno' },
    { v:'instalaciones', l:'Instalaciones' }, { v:'problema', l:'Problema/daño' },
    { v:'medicion', l:'Medición' }, { v:'otro', l:'Otro' },
  ];

  return (
    <div>
      <div
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        style={{ border:'2px dashed #000', borderRadius:0, padding:'30px', textAlign:'center', cursor:'pointer', transition:'all .2s', background:'#f8f9fa' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#000'; e.currentTarget.style.background = '#f8f9fa'; }}>
        <Camera size={24} style={{ color:'#111', margin:'0 auto 12px auto' }}/>
        <div style={{ fontSize:14, color:'#111', marginBottom:4, fontWeight:700 }}>
          Arrastra fotos aquí o <span style={{ color:'var(--gold)', background:'#111', padding:'2px 6px', marginLeft:4 }}>Sube desde tu equipo</span>
        </div>
        <div style={{ fontSize:11, color:'#666', textTransform:'uppercase', fontWeight:800 }}>JPG, PNG · Máx. 10 fotos</div>
        <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={e => handleFiles(e.target.files)}/>
      </div>

      {fotos.length > 0 && (
        <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:16 }}>
          {fotos.map(foto => (
            <div key={foto.id} style={{ background:'#fff', border:'2px solid #000', boxShadow:'4px 4px 0px rgba(0,0,0,1)' }}>
              <div style={{ position:'relative', aspectRatio:'4/3', borderBottom:'2px solid #000' }}>
                <img src={foto.url} alt={foto.caption || foto.name} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>
                <button onClick={() => removePhoto(foto.id)}
                  style={{ position:'absolute', top:8, right:8, background:'#ef4444', border:'2px solid #000', borderRadius:0, width:24, height:24, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', boxShadow:'2px 2px 0px rgba(0,0,0,1)' }}>
                  <X size={14} strokeWidth={3}/>
                </button>
              </div>
              <div style={{ padding:'12px' }}>
                <select value={foto.tipo} onChange={e => updatePhoto(foto.id, 'tipo', e.target.value)}
                  style={{ width:'100%', background:'#f0f0f0', border:'2px solid #000', padding:'6px', fontSize:10, color:'#111', fontWeight:900, outline:'none', marginBottom:8, fontFamily:'var(--ff-display)', textTransform:'uppercase', letterSpacing:'.06em' }}>
                  {TIPOS_FOTO.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
                </select>
                <input value={foto.caption} onChange={e => updatePhoto(foto.id, 'caption', e.target.value)}
                  placeholder="Descripción..."
                  style={{ width:'100%', background:'transparent', border:'none', borderBottom:'2px solid #ccc', fontSize:12, color:'#111', outline:'none', padding:'4px 0', fontFamily:'var(--ff-body)', fontWeight:600 }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = '#ccc'}/>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── SECCIÓN COLAPSABLE ───────────────────────────────────────────────────
const Section = ({ icon, title, badge, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 16 }}>
      <button type="button" onClick={() => setOpen(!open)}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', background: open ? '#111' : '#fff', color: open ? '#fff' : '#111', border:'2px solid #000', cursor:'pointer', transition:'all 0.2s', boxShadow: open ? 'none' : '6px 6px 0px rgba(0,0,0,1)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color: open ? 'var(--gold)' : '#111', display:'flex' }}>{icon}</span>
          <span style={{ fontSize:15, fontWeight:900, textTransform:'uppercase', letterSpacing:'.05em', fontFamily:'var(--ff-display)' }}>{title}</span>
          {badge && (
            <span style={{ fontSize:10, fontWeight:900, padding:'4px 8px', background:'var(--gold)', color:'#000', border:'2px solid #000', textTransform:'uppercase', letterSpacing:'.05em', marginLeft: 8 }}>
              {badge}
            </span>
          )}
        </div>
        <span style={{ display:'flex' }}>
          {open ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
        </span>
      </button>
      {open && (
        <div style={{ padding:'24px', borderLeft:'2px solid #000', borderRight:'2px solid #000', borderBottom:'2px solid #000', background:'#fff', boxShadow:'6px 6px 0px rgba(0,0,0,1)' }}>
          {children}
        </div>
      )}
    </div>
  );
};

// ─── INDICADOR DE COMPLETITUD ─────────────────────────────────────────────
const calcCompletitud = (siteData) => {
  const campos = [
    siteData.soil !== 'normal', siteData.soil_humedad !== 'seco', siteData.soil_pendiente !== 'plano',
    siteData.access, siteData.debris, siteData.entorno_tipo, siteData.agua_obra, siteData.electricidad_obra,
    siteData.orientacion, siteData.zona_sismica, siteData.zona_termica, siteData.proyecto_tipo,
    siteData.uso_final, siteData.observaciones?.length > 10, siteData.fotos?.length > 0, siteData.instalaciones?.length > 0,
  ];
  return Math.round((campos.filter(Boolean).length / campos.length) * 100);
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────
const SiteDataBlock = ({ siteData, setSiteData }) => {
  const set = (key, val) => setSiteData(prev => ({ ...prev, [key]: val }));
  const completitud = calcCompletitud(siteData);

  const alertas = [];
  if (siteData.soil_napa === 'si') alertas.push({ nivel:'alto', txt:'Napa freática detectada — requiere impermeabilización y cálculo de subpresión.' });
  if (siteData.soil === 'arcilloso') alertas.push({ nivel:'medio', txt:'Suelo arcilloso — exige cama de ripio y posible mejoramiento de suelo.' });
  if (siteData.soil === 'rocoso') alertas.push({ nivel:'medio', txt:'Suelo rocoso — excavación con compresor, mayor plazo y costo.' });
  if (siteData.inundacion === 'si') alertas.push({ nivel:'alto', txt:'Zona de inundación — requiere radier elevado y drenaje perimetral.' });
  if (siteData.zona_conservacion === 'si') alertas.push({ nivel:'alto', txt:'Zona de conservación histórica — permiso especial y restricciones de fachada.' });
  if (siteData.heladas === 'si') alertas.push({ nivel:'medio', txt:'Zona con heladas — fundaciones bajo la línea de congelamiento (mín. 60cm).' });
  if (siteData.acceso === 'dificil') alertas.push({ nivel:'medio', txt:'Acceso difícil — costo de logística aumenta 15–25%. Prever acopio.' });
  if (siteData.servidumbre === 'si') alertas.push({ nivel:'alto', txt:'Servidumbre registrada — consultar con abogado antes de iniciar obras.' });

  return (
    <div style={{ background:'#fff', border:'2px solid #000', borderRadius:0, overflow:'hidden', boxShadow:'10px 10px 0px rgba(0,0,0,1)', marginBottom: 40 }}>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <div style={{ padding:'24px', borderBottom:'2px solid #000', background:'#111', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ background:'var(--gold)', border:'2px solid #000', padding:12, display:'flex', boxShadow:'4px 4px 0px rgba(0,0,0,1)' }}>
            <Layers size={24} style={{ color:'#111' }}/>
          </div>
          <div>
            <div style={{ fontSize:11, fontFamily:'var(--ff-display)', color:'var(--gold)', textTransform:'uppercase', letterSpacing:'.2em', marginBottom:4, fontWeight:900 }}>Bloque 3 · I.A. Engine</div>
            <div style={{ fontSize:22, fontWeight:900, color:'#fff', textTransform:'uppercase', fontFamily:'var(--ff-display)' }}>Diagnóstico del Entorno</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:16, flexShrink:0 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:10, color:'#888', textTransform:'uppercase', letterSpacing:'.1em', marginBottom:4, fontWeight:800 }}>Completitud de Data</div>
            <div style={{ fontSize:24, fontWeight:900, fontFamily:'var(--ff-display)', color: completitud >= 70 ? 'var(--green)' : completitud >= 40 ? 'var(--gold)' : '#ef4444' }}>
              {completitud}%
            </div>
          </div>
          <div style={{ width:48, height:48, position:'relative' }}>
            <svg viewBox="0 0 36 36" style={{ transform:'rotate(-90deg)', width:'100%', height:'100%' }}>
              <circle cx="18" cy="18" r="15" fill="none" stroke="#333" strokeWidth="4"/>
              <circle cx="18" cy="18" r="15" fill="none"
                stroke={completitud >= 70 ? 'var(--green)' : completitud >= 40 ? 'var(--gold)' : '#ef4444'}
                strokeWidth="4" strokeLinecap="butt"
                strokeDasharray={`${(completitud / 100) * 94.2} 94.2`}
                style={{ transition:'stroke-dasharray .5s ease' }}/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── ALERTAS AUTOMÁTICAS ─────────────────────────────────────────── */}
      {alertas.length > 0 && (
        <div style={{ padding:'20px', borderBottom:'2px solid #000', background:'#f8f9fa', display:'flex', flexDirection:'column', gap:12 }}>
          {alertas.map((a, i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'14px 18px', background: a.nivel === 'alto' ? '#ffebe9' : '#fff9db', border:`2px solid ${a.nivel === 'alto' ? '#ef4444' : '#f59e0b'}`, boxShadow:'4px 4px 0px rgba(0,0,0,1)' }}>
              <AlertTriangle size={18} style={{ color: a.nivel === 'alto' ? '#ef4444' : '#d97706', flexShrink:0, marginTop:2 }}/>
              <span style={{ fontSize:13, color:'#111', fontWeight:700, lineHeight:1.5 }}>{a.txt}</span>
            </div>
          ))}
        </div>
      )}

      {/* ── CUERPO ──────────────────────────────────────────────────────── */}
      <div style={{ padding:'30px', display:'flex', flexDirection:'column', gap:16, background:'#f0f0f0' }}>

        <Section icon={<Shovel size={20}/>} title="Suelo y Geotecnia" badge="Crítico" defaultOpen={true}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:24 }}>
            <Field label="Composición del suelo" tip="Afecta directamente la profundidad y costo de fundaciones">
              <Select value={siteData.soil} onChange={v => set('soil', v)} options={[
                { v:'normal', l:'Normal / Compacto' }, { v:'arcilloso', l:'Arcilloso / Blando' },
                { v:'arenoso', l:'Arenoso / Suelto' }, { v:'rocoso', l:'Rocoso / Duro' },
                { v:'relleno', l:'Relleno artificial' }, { v:'organico', l:'Orgánico / Turba' },
              ]} warn={['arcilloso','arenoso','relleno','organico'].includes(siteData.soil)}/>
            </Field>

            <Field label="Humedad del suelo">
              <Select value={siteData.soil_humedad} onChange={v => set('soil_humedad', v)} options={[
                { v:'seco', l:'Seco (sin humedad)' }, { v:'humedo', l:'Húmedo (sin agua libre)' },
                { v:'saturado', l:'Saturado / Con agua' }, { v:'estacional', l:'Varía según estación' },
              ]} warn={['saturado'].includes(siteData.soil_humedad)}/>
            </Field>

            <Field label="Profundidad de roca">
              <Select value={siteData.soil_profundidad} onChange={v => set('soil_profundidad', v)} options={[
                { v:'0-50cm', l:'0–50 cm (superficial)' }, { v:'50-100cm', l:'50–100 cm' },
                { v:'100-150cm', l:'100–150 cm' }, { v:'>150cm', l:'>150 cm (libre)' }, { v:'desconocida', l:'No se sabe' },
              ]}/>
            </Field>

            <Field label="Napa freática">
              <Select value={siteData.soil_napa} onChange={v => set('soil_napa', v)} options={[
                { v:'no', l:'No detectada' }, { v:'probable', l:'Probable (zona húmeda)' },
                { v:'si', l:'Confirmada / Visible' }, { v:'desconocida', l:'Sin información' },
              ]} warn={siteData.soil_napa === 'si'}/>
            </Field>

            <Field label="Pendiente del terreno">
              <Select value={siteData.soil_pendiente} onChange={v => set('soil_pendiente', v)} options={[
                { v:'plano', l:'Plano (0–3%)' }, { v:'leve', l:'Leve (3–8%)' },
                { v:'moderado', l:'Moderado (8–20%)' }, { v:'pronunciado', l:'Pronunciado (20–40%)' },
                { v:'escarpado', l:'Escarpado (>40%)' },
              ]} warn={['pronunciado','escarpado'].includes(siteData.soil_pendiente)}/>
            </Field>
          </div>
        </Section>

        <Section icon={<Truck size={20}/>} title="Acceso y Logística">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:24 }}>
            <Field label="Punto de descarga">
              <Select value={siteData.access} onChange={v => set('access', v)} options={[
                { v:'camion', l:'Camión a pie de obra' }, { v:'carretilla', l:'Ingreso manual' },
                { v:'elevador', l:'Requiere grúa' }, { v:'dificil', l:'Escaleras / Difícil' },
              ]} warn={['dificil'].includes(siteData.access)}/>
            </Field>
            <Field label="Horario permitido">
              <Select value={siteData.acceso_horario} onChange={v => set('acceso_horario', v)} options={[
                { v:'libre', l:'Sin restricción' }, { v:'laboral', l:'Lun–Vie 8:00–18:00' },
                { v:'condominio', l:'Reglamento condominio' },
              ]}/>
            </Field>
            <Field label="Seguridad sitio">
              <Select value={siteData.seguridad ?? 'normal'} onChange={v => set('seguridad', v)} options={[
                { v:'alta', l:'Cierre perimetral seguro' }, { v:'normal', l:'Portón básico' },
                { v:'baja', l:'Terreno abierto' },
              ]}/>
            </Field>
          </div>
        </Section>

        <Section icon={<HardHat size={20}/>} title="Estado Previo">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:24, marginBottom:24 }}>
            <Field label="Terreno actual">
              <Select value={siteData.debris} onChange={v => set('debris', v)} options={[
                { v:'limpio', l:'Limpio y nivelado' }, { v:'escombros', l:'Con escombros' },
                { v:'demolicion', l:'Requiere demolición' },
              ]} warn={['demolicion'].includes(siteData.debris)}/>
            </Field>
          </div>
          <Field label="Instalaciones existentes a preservar">
            <MultiCheck value={siteData.instalaciones} onChange={v => set('instalaciones', v)}
              options={[
                { v:'agua', l:'Agua' }, { v:'alcantarillado', l:'Alcantarillado' },
                { v:'electrica', l:'Electricidad' }, { v:'gas', l:'Gas' },
                { v:'fibra', l:'Fibra óptica' }, { v:'arboles_prot', l:'Árboles' },
              ]}/>
          </Field>
        </Section>

        <Section icon={<Zap size={20}/>} title="Suministros en Obra">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:24 }}>
            <Field label="Agua disponible">
              <Select value={siteData.agua_obra} onChange={v => set('agua_obra', v)} options={[
                { v:'si', l:'Sí (red pública)' }, { v:'pozo', l:'Pozo' }, { v:'no', l:'No (cotizar provisión)' },
              ]} warn={siteData.agua_obra === 'no'}/>
            </Field>
            <Field label="Electricidad">
              <Select value={siteData.electricidad_obra} onChange={v => set('electricidad_obra', v)} options={[
                { v:'si', l:'220V disponible' }, { v:'trifasica', l:'380V disponible' },
                { v:'generador', l:'Requiere generador' }, { v:'no', l:'Sin suministro' },
              ]} warn={['generador','no'].includes(siteData.electricidad_obra)}/>
            </Field>
            <Field label="Baños">
              <Select value={siteData.banos_obra ?? 'propios'} onChange={v => set('banos_obra', v)} options={[
                { v:'propios', l:'Baños propiedad' }, { v:'bano_quim', l:'Baño químico' }, { v:'no', l:'Sin solución' },
              ]} warn={siteData.banos_obra === 'no'}/>
            </Field>
          </div>
        </Section>

        <Section icon={<Sun size={20}/>} title="Clima y Normativa">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:24 }}>
            <Field label="Orientación principal">
              <Select value={siteData.orientacion} onChange={v => set('orientacion', v)} options={[
                { v:'norte', l:'Norte (caluroso)' }, { v:'sur', l:'Sur (frío)' },
                { v:'oriente', l:'Oriente' }, { v:'poniente', l:'Poniente' },
              ]}/>
            </Field>
            <Field label="Zona sísmica">
              <Select value={siteData.zona_sismica} onChange={v => set('zona_sismica', v)} options={[
                { v:'Z1', l:'Z1 (Baja)' }, { v:'Z2', l:'Z2 (Moderada)' },
                { v:'Z3', l:'Z3 (Alta - RM)' }, { v:'Z4', l:'Z4 (Costera)' },
              ]}/>
            </Field>
            <Field label="Zona térmica">
              <Select value={siteData.zona_termica} onChange={v => set('zona_termica', v)} options={[
                { v:'ZT1', l:'ZT1 (Norte)' }, { v:'ZT4', l:'ZT4 (Centro)' }, { v:'ZT6', l:'ZT6 (Sur)' },
              ]}/>
            </Field>
          </div>
        </Section>

        <Section icon={<FileText size={20}/>} title="Observaciones (Opcional)">
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <Field label="Anotaciones extra para la I.A.">
              <textarea value={siteData.observaciones} onChange={e => set('observaciones', e.target.value)}
                placeholder="Escribe aquí cualquier detalle visual o técnico importante..." rows={4}
                style={{ background:'#fff', border:'2px solid #000', borderRadius:0, padding:'14px', fontSize:13, color:'#111', outline:'none', resize:'vertical', fontFamily:'var(--ff-body)', fontWeight:600, boxShadow:'inset 4px 4px 0px rgba(0,0,0,0.05)' }}
                onFocus={e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '4px 4px 0px rgba(0,0,0,1)'; }}
                onBlur={e => { e.target.style.borderColor = '#000'; e.target.style.boxShadow = 'inset 4px 4px 0px rgba(0,0,0,0.05)'; }}/>
            </Field>
          </div>
        </Section>

        <Section icon={<Camera size={20}/>} title="Registro Fotográfico" badge="I.A. Vision">
          <FotoUpload fotos={siteData.fotos} onChange={v => set('fotos', v)}/>
        </Section>

      </div>

      {/* ── FOOTER: RESUMEN PARA IA ──────────────────────────────────────── */}
      <div style={{ padding:'20px 30px', borderTop:'2px solid #000', background:'#fff', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
          {[
            { l:'Zona', v:siteData.zona_sismica, c:'#ef4444' },
            { l:'Clima', v:siteData.zona_termica, c:'#3b82f6' },
            { l:'Suelo', v:siteData.soil, c: siteData.soil === 'normal' ? 'var(--green)' : '#ef4444' },
          ].map(r => (
            <div key={r.l} style={{ display:'flex', flexDirection:'column', gap:4 }}>
              <span style={{ fontSize:10, fontFamily:'var(--ff-display)', color:'#888', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:900 }}>{r.l}</span>
              <span style={{ fontSize:14, fontWeight:900, color:r.c, textTransform:'uppercase' }}>{r.v}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:12, color:'#111', fontWeight:800, textTransform:'uppercase' }}>
          <div style={{ width:10, height:10, borderRadius:0, border:'2px solid #000', background: completitud >= 70 ? 'var(--green)' : 'var(--gold)', animation: completitud < 70 ? 'pulse2 2s infinite' : 'none', boxShadow:'2px 2px 0px rgba(0,0,0,1)' }}/>
          {completitud >= 70 ? 'Data óptima para I.A.' : `Requiere más datos (${completitud}%)`}
        </div>
      </div>

    </div>
  );
};

export default SiteDataBlock;