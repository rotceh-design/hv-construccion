import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HardHat, Shield, Zap, ArrowRight, CheckCircle2,
  Menu, X, MapPin, Phone, Mail,
  TrendingUp, Wrench, Hammer,
  Droplets, Paintbrush, ClipboardList, ShieldCheck,
  Activity, ChevronRight, Star, Loader2, MessageCircle,
  Camera, Calculator, Maximize2, Image as ImageIcon,
  Grid, Layers, Bot, Pickaxe, Home, ArrowUpRight,
  Brush, Ruler, Bath, DoorOpen, Trash2, Flame, Wind,
  BarChart2, CheckSquare, Package, Users, Eye, Cpu
} from 'lucide-react';

import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const LOGO_URL =
  'https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/Gemini_Generated_Image_kex7g9kex7g9kex7-removebg-preview.png?alt=media&token=c1033643-721d-4041-851a-5aa3eb68971a';

/* ─── Helpers seguros ──────────────────────────────────── */
const safeName    = (v) => (typeof v === 'string' && v.trim() ? v.trim() : 'Miembro');
const safeInitial = (v) => safeName(v).charAt(0).toUpperCase();
const safeFirst   = (v) => safeName(v).split(' ')[0];

/* ─── Ticker services ───────────────────────────────────── */
const TICKER_SERVICES = [
  { label: 'Arquitectura' }, { label: 'Construcción' }, { label: 'Gasfitería' },
  { label: 'Electricidad' }, { label: 'Ampliaciones' }, { label: 'Techumbres' },
  { label: 'Pavimentos' }, { label: 'Revisión Normativa' }, { label: 'Portal 24/7' },
  { label: 'Pintura y Revestimientos' }, { label: 'Puertas y Ventanas' },
  { label: 'Instalaciones Sanitarias' }, { label: 'Demoliciones' },
  { label: 'Edificaciones' }, { label: 'Tabiquería y Yeso' },
];

/* ─── Counter animado (Soporta decimales) ──────────────── */
const Counter = ({ target, suffix = '', isFloat = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const steps = 60, dur = 1600;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + target / steps, target);
          setCount(isFloat ? Number(cur.toFixed(1)) : Math.floor(cur));
          if (cur >= target) clearInterval(t);
        }, dur / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, isFloat]);
  return <span ref={ref}>{count.toLocaleString('es-CL')}{suffix}</span>;
};

/* ─── Íconos de especialidad y colores ─────────────────── */
const SPEC_ICONS = {
  'Electricidad': <Zap size={10} />, 'Gasfitería': <Droplets size={10} />,
  'Carpintería': <Hammer size={10} />, 'Pintura': <Paintbrush size={10} />,
  'Albañilería': <Wrench size={10} />, 'Estructura': <Hammer size={10} />,
  'Seguridad': <ShieldCheck size={10} />, 'Planos': <ClipboardList size={10} />,
};
const COLORS = ['#C49800','#1A4DB5','#1A7A3A','#993C1D','#534AB7','#0F6E56','#A32D2D','#3B6D11'];
const ovrColor = (v) => v >= 80 ? '#2ECC71' : v >= 50 ? '#FFCF40' : '#E74C3C';

/* ══════════════════════════════════════════════════════════
   1. PORTAFOLIO DE TRABAJOS (Desde Firebase)
══════════════════════════════════════════════════════════ */
const CATS = ['Todos','Techo','Ampliación','Pavimento','Pintura','Baño','Gasfitería','Electricidad','Otro'];

const PortafolioSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('Todos');
  const [viewMode, setViewMode] = useState('grid');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    setLoading(true);
    let q;
    try { q = query(collection(db, 'projects'), orderBy('createdAt', 'desc')); }
    catch { q = collection(db, 'projects'); }
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => { setProjects([]); setLoading(false); });
    return () => setTimeout(() => unsub(), 0);
  }, []);

  const filtered = catFilter === 'Todos' ? projects : projects.filter(p => p.categoria === catFilter);

  const nextImg = () => {
    if (!lightbox) return;
    const imgs = Array.isArray(lightbox.project.fotos) ? lightbox.project.fotos : [lightbox.project.foto];
    setLightbox(l => ({ ...l, imgIdx: (l.imgIdx + 1) % imgs.length }));
  };
  const prevImg = () => {
    if (!lightbox) return;
    const imgs = Array.isArray(lightbox.project.fotos) ? lightbox.project.fotos : [lightbox.project.foto];
    setLightbox(l => ({ ...l, imgIdx: (l.imgIdx - 1 + imgs.length) % imgs.length }));
  };

  return (
    <div id="portafolio" className="port-bg" style={{ paddingBottom: '96px' }}>
      <div style={{ padding: '96px 60px 0', maxWidth: 1300, margin: '0 auto' }} className="section-padding-mob">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,207,64,.65)', marginBottom: 12 }}>
          <span style={{ display: 'block', width: 16, height: 2, background: 'rgba(255,207,64,.65)' }} />Trabajos realizados
        </div>
        <div className="section-header-grid" style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 900, fontSize: 'clamp(40px,5vw,70px)', color: '#fff', textTransform: 'uppercase', lineHeight: .93 }}>
            Nuestros proyectos<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,207,64,.65)' }}>hablan por sí solos</em>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.8 }}>
            Cada proyecto fotografiado desde el primer día hasta la entrega. Calidad verificable, trabajos reales, clientes reales.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{ padding: '6px 16px', borderRadius: 30, font: '700 10px/1 "Instrument Sans",sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', background: catFilter === c ? '#FFCF40' : 'rgba(255,255,255,.05)', color: catFilter === c ? '#0C0C0C' : 'rgba(255,255,255,.45)', border: catFilter === c ? '1px solid #FFCF40' : '1px solid rgba(255,255,255,.07)' }}>
                {c}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ v: 'grid', Icon: Grid }, { v: 'masonry', Icon: Layers }].map(({ v, Icon }) => (
              <button key={v} onClick={() => setViewMode(v)}
                style={{ width: 34, height: 34, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all .2s', background: viewMode === v ? '#FFCF40' : 'rgba(255,255,255,.05)', color: viewMode === v ? '#0C0C0C' : 'rgba(255,255,255,.35)', border: viewMode === v ? '1px solid #FFCF40' : '1px solid rgba(255,255,255,.07)' }}>
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '0 60px', maxWidth: 1300, margin: '0 auto' }} className="section-padding-mob">
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '48px 0', color: 'rgba(255,255,255,.3)', fontSize: 12, fontWeight: 600, letterSpacing: '.08em', textTransform: 'uppercase' }}>
            <Loader2 size={20} color="#FFCF40" style={{ animation: 'spin 1s linear infinite' }} /> Cargando bitácora…
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 20px', color: 'rgba(255,255,255,.2)' }}>
            <Camera size={48} style={{ margin: '0 auto 16px', display: 'block', opacity: .3 }} />
            <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 24, textTransform: 'uppercase', marginBottom: 8 }}>Sin proyectos en esta categoría</div>
          </div>
        )}
        {!loading && filtered.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill,minmax(280px,1fr))' : 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
            {filtered.map((p, idx) => {
              const fotos = Array.isArray(p.fotos) ? p.fotos : (p.foto ? [p.foto] : []);
              const coverUrl = fotos[0] || null;
              return (
                <div key={p.id} onClick={() => fotos.length > 0 && setLightbox({ project: p, imgIdx: 0 })}
                  style={{ background: '#181818', borderRadius: 18, overflow: 'hidden', border: '1.5px solid rgba(255,255,255,.06)', cursor: fotos.length > 0 ? 'pointer' : 'default', transition: 'all .2s', gridRow: viewMode === 'masonry' && idx % 3 === 1 ? 'span 2' : 'span 1' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,207,64,.35)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                  <div style={{ height: viewMode === 'masonry' && idx % 3 === 1 ? 300 : 200, background: '#222', overflow: 'hidden', position: 'relative' }}>
                    {coverUrl
                      ? <img src={coverUrl} alt={p.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                      : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.2)' }}><Camera size={32} style={{ opacity: .3 }} /></div>}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(0,0,0,.72)', border: '1px solid rgba(255,207,64,.2)', color: '#FFCF40', fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, backdropFilter: 'blur(4px)' }}>{p.categoria || 'General'}</div>
                    {fotos.length > 1 && <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,.72)', color: 'rgba(255,255,255,.7)', fontSize: 9, fontWeight: 700, padding: '3px 9px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}><ImageIcon size={10} /> {fotos.length}</div>}
                  </div>
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.titulo || 'Proyecto HV'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      {p.comuna && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.4)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={9} />{p.comuna}</span>}
                      {p.año && <span style={{ fontSize: 10, color: 'rgba(255,255,255,.25)' }}>· {p.año}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {lightbox && (() => {
        const { project: p, imgIdx } = lightbox;
        const fotos = Array.isArray(p.fotos) ? p.fotos : [p.foto];
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.95)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}><X size={20} /></button>
            {fotos.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prevImg(); }} style={{ position: 'absolute', left: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, fontSize: 20 }}>‹</button>
                <button onClick={e => { e.stopPropagation(); nextImg(); }} style={{ position: 'absolute', right: 20, background: 'rgba(255,255,255,.08)', border: 'none', color: '#fff', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, fontSize: 20 }}>›</button>
              </>
            )}
            <img src={fotos[imgIdx]} alt="" style={{ maxWidth: '88vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 12 }} onClick={e => e.stopPropagation()} />
            <div style={{ marginTop: 16, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 22, color: '#fff', textTransform: 'uppercase' }}>{p.titulo}</div>
            </div>
            {fotos.length > 1 && (
              <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '80vw' }} onClick={e => e.stopPropagation()}>
                {fotos.map((f, i) => <img key={i} src={f} alt="" onClick={() => setLightbox(l => ({ ...l, imgIdx: i }))} style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', opacity: i === imgIdx ? 1 : .45, border: i === imgIdx ? '2px solid #FFCF40' : '2px solid transparent', transition: 'all .2s' }} />)}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════
   2. LANDING PAGE MAIN
══════════════════════════════════════════════════════════ */
const TEAM_CATEGORIES = ['Todos', 'Ingenieros', 'Arquitectos', 'Técnicos', 'Pintores', 'Gasfíteres', 'Eléctricos'];

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [carouselOffset, setCarouselOffset] = useState(0);
  const [contactMember, setContactMember] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);
  const [teamFilter, setTeamFilter] = useState('Todos');

  const [bgIndex, setBgIndex] = useState(0); // Para CTA de fondo dinámico

  const trackRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const offsetStart = useRef(0);

  // Scroll Navbar Effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Fetch Team Firebase
  useEffect(() => {
    setTeamLoading(true);
    let q;
    try { q = query(collection(db, 'users'), orderBy('createdAt', 'desc')); }
    catch { q = collection(db, 'users'); }
    const unsub = onSnapshot(q,
      snap => { setTeam(snap.docs.map(d => ({ id: d.id, ...d.data() }))); setTeamLoading(false); },
      err => { setTeamError('Error al cargar equipo.'); setTeamLoading(false); }
    );
    return () => setTimeout(() => unsub(), 0);
  }, []);

  // Rotar imagen de CTA
  useEffect(() => {
    if (team.length === 0) return;
    const interval = setInterval(() => setBgIndex(i => (i + 1) % Math.min(team.length, 5)), 4000);
    return () => clearInterval(interval);
  }, [team]);

  // Cálculos dinámicos
  const totalTeamExp = team.reduce((acc, m) => {
    const specs = Array.isArray(m.specialties) ? m.specialties : [];
    return acc + specs.reduce((a, c) => a + Number(c.exp || 0), 0);
  }, 0);

  // Filtrado y Ordenamiento del Equipo
  const filteredTeam = team.filter(m => {
    if (teamFilter === 'Todos') return true;
    const role = (m.profession || m.role || '').toLowerCase();
    const map = {
      'Ingenieros': 'ingenier', 'Arquitectos': 'arquitect', 'Técnicos': 'técnic',
      'Pintores': 'pintor', 'Gasfíteres': 'gasf', 'Eléctricos': 'eléctric'
    };
    return role.includes(map[teamFilter] || teamFilter.toLowerCase());
  }).sort((a, b) => {
    // Ordenar siempre por mayor experiencia primero
    const expA = (Array.isArray(a.specialties) ? a.specialties : []).reduce((sum, c) => sum + Number(c.exp || 0), 0);
    const expB = (Array.isArray(b.specialties) ? b.specialties : []).reduce((sum, c) => sum + Number(c.exp || 0), 0);
    return expB - expA;
  });

  const maxOff = () => {
    const cardW = 240;
    const visible = trackRef.current ? trackRef.current.parentElement.offsetWidth : 700;
    return Math.max(0, filteredTeam.length * cardW - visible + 80);
  };
  const clamp = v => Math.max(-maxOff(), Math.min(0, v));
  const onMD = e => { isDragging.current = true; dragStart.current = e.clientX; offsetStart.current = carouselOffset; };
  const onMM = e => { if (!isDragging.current) return; setCarouselOffset(clamp(offsetStart.current + (e.clientX - dragStart.current))); };
  const onMU = () => { isDragging.current = false; };
  const onTS = e => { if (e.touches) { dragStart.current = e.touches[0].clientX; offsetStart.current = carouselOffset; } };
  const onTM = e => { if (e.touches) setCarouselOffset(clamp(offsetStart.current + (e.touches[0].clientX - dragStart.current))); };
  const closeModal = () => { setContactMember(null); setTimeout(() => setFormSubmitted(false), 300); };

  const ctaBgImage = team[bgIndex]?.photo || LOGO_URL;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,900;1,700;1,900&family=Instrument+Sans:wght@400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{font-family:'Instrument Sans',sans-serif;background:#0C0C0C;color:#fff;overflow-x:hidden}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:20px 48px;display:flex;align-items:center;justify-content:space-between;transition:all .3s}
        .nav.sc{background:rgba(10,10,10,.96);padding:14px 48px;backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,207,64,.1)}
        .logo{display:flex;align-items:center;gap:10px;text-decoration:none}
        .logo img{height:44px;width:auto;object-fit:contain}
        .logo-t{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:19px;color:#fff;letter-spacing:.06em;line-height:1.1}
        .logo-t span{color:#FFCF40}
        .nav-links{display:flex;align-items:center;gap:32px}
        .nl{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);text-decoration:none;transition:color .2s}
        .nl:hover{color:#FFCF40}
        .nav-cta{background:#FFCF40;color:#0C0C0C;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;padding:10px 22px;border-radius:10px;text-decoration:none;transition:transform .15s,box-shadow .2s}
        .nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,207,64,.3)}

        .hero{min-height:100vh;background:#0C0C0C;position:relative;overflow:hidden;display:flex;align-items:center}
        .hgrid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,207,64,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,207,64,.025) 1px,transparent 1px);background-size:72px 72px}
        .hhaz{position:absolute;top:0;left:0;right:0;height:5px;background:repeating-linear-gradient(90deg,#FFCF40 0,#FFCF40 26px,#111 26px,#111 52px)}
        .hhaz-b{position:absolute;bottom:0;left:0;right:0;height:5px;background:repeating-linear-gradient(90deg,#FFCF40 0,#FFCF40 26px,#111 26px,#111 52px)}
        .hero-inner{max-width:1300px;margin:0 auto;padding:140px 60px 100px;display:grid;grid-template-columns:1.2fr 0.8fr;gap:60px;align-items:center;width:100%;position:relative;z-index:2}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#FFCF40;margin-bottom:16px}
        .eyebrow::before{content:'';display:block;width:18px;height:2px;background:#FFCF40}
        .h1{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(50px,7vw,100px);color:#fff;line-height:.92;letter-spacing:-.01em;text-transform:uppercase;margin-bottom:28px}
        .h1 em{display:block;font-style:italic;color:#FFCF40}
        .hero-body{font-size:15px;line-height:1.75;color:rgba(255,255,255,.48);max-width:480px;margin-bottom:44px}
        .hero-actions{display:flex;gap:14px;flex-wrap:wrap}
        .btn-gold{display:inline-flex;align-items:center;gap:9px;background:#FFCF40;color:#0C0C0C;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:15px 26px;border-radius:12px;border:none;cursor:pointer;text-decoration:none;transition:transform .15s,box-shadow .2s;font-family:'Instrument Sans',sans-serif}
        .btn-gold:hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(255,207,64,.3)}
        .btn-ghost{display:inline-flex;align-items:center;gap:9px;background:transparent;color:rgba(255,255,255,.6);font-weight:600;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:15px 26px;border-radius:12px;border:1.5px solid rgba(255,255,255,.1);cursor:pointer;text-decoration:none;transition:border-color .2s,color .2s;font-family:'Instrument Sans',sans-serif}
        .btn-ghost:hover{border-color:#FFCF40;color:#FFCF40}

        .hero-collab-btn{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);padding:10px 20px;border-radius:30px;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;text-decoration:none;margin-top:24px;transition:all .2s;backdrop-filter:blur(4px)}
        .hero-collab-btn:hover{background:rgba(255,207,64,.15);border-color:#FFCF40;color:#FFCF40;transform:translateY(-2px)}

        /* Mini-cards Calidad Hero */
        .q-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;width:100%;max-width:380px;justify-self:end}
        .q-card{background:rgba(20,20,20,.8);border:1.5px solid rgba(255,207,64,.15);border-radius:16px;padding:16px;backdrop-filter:blur(10px);transition:all .2s;display:flex;flex-direction:column;gap:10px}
        .q-card:hover{border-color:rgba(255,207,64,.5);transform:translateY(-3px);background:rgba(30,30,30,.9)}
        .q-icon{width:32px;height:32px;border-radius:10px;background:rgba(255,207,64,.1);display:flex;align-items:center;justify-content:center;color:#FFCF40}
        .q-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:18px;color:#fff;text-transform:uppercase;line-height:1.1}
        .q-desc{font-size:11px;color:rgba(255,255,255,.45);line-height:1.5}

        /* ── TICKER ── */
        .ticker{background:#FFCF40;padding:11px 0;overflow:hidden;position:relative}
        .ticker::before,.ticker::after{content:'';position:absolute;top:0;width:60px;height:100%;z-index:2;pointer-events:none}
        .ticker::before{left:0;background:linear-gradient(to right,#FFCF40,transparent)}
        .ticker::after{right:0;background:linear-gradient(to left,#FFCF40,transparent)}
        .t-track{display:flex;white-space:nowrap;animation:tick 50s linear infinite}
        .t-track:hover{animation-play-state:paused}
        .t-item{display:inline-flex;align-items:center;gap:0;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:14px;color:#0C0C0C;letter-spacing:.1em;text-transform:uppercase;padding:0 6px}
        .t-dot{padding:0 14px;color:rgba(0,0,0,0.3);font-size:10px}

        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);background:#111}
        .si{padding:42px 24px;text-align:center;border-right:1px solid rgba(255,255,255,.05);transition:background .2s}
        .si:last-child{border-right:none}
        .si:hover{background:rgba(255,207,64,.03)}
        .sn{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-style:italic;font-size:58px;color:#FFCF40;line-height:1;display:block;margin-bottom:5px}
        .sl{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.32)}

        .svc-bg{background:#F5F3EE}
        .section{padding:96px 60px;max-width:1300px;margin:0 auto}
        .stag{display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#C49800;margin-bottom:12px}
        .stag::before{content:'';display:block;width:16px;height:2px;background:#C49800}
        
        /* Contenedor de títulos ajustado para móviles */
        .section-header-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          align-items: end;
        }

        .sh-dark{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,5vw,70px);color:#0C0C0C;text-transform:uppercase;line-height:.93;margin-bottom:14px}
        .sh-dark em{font-style:italic;color:#C49800}
        .sh-light{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:clamp(40px,5vw,70px);color:#fff;text-transform:uppercase;line-height:.93;margin-bottom:14px}
        .sh-light em{font-style:italic;color:rgba(255,207,64,.65)}

        .svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:#DDD9D2;border-radius:20px;overflow:hidden;margin-top:52px}
        .sc-card{background:#fff;padding:42px 34px;position:relative;overflow:hidden;transition:background .25s;cursor:default}
        .sc-card:hover{background:#0C0C0C}.sc-card:hover .sc-t{color:#fff}.sc-card:hover .sc-b{color:rgba(255,255,255,.4)}.sc-card:hover .sc-iw{background:#FFCF40}.sc-card:hover .sc-n{color:rgba(255,255,255,.04)}.sc-card:hover .sc-arr{opacity:1;transform:translate(0,0)}
        .sc-n{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:108px;color:rgba(0,0,0,.04);position:absolute;top:-14px;right:10px;line-height:1;transition:color .25s}
        .sc-iw{width:50px;height:50px;background:#F0EDE8;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:24px;transition:background .25s}
        .sc-t{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:25px;color:#0C0C0C;text-transform:uppercase;margin-bottom:10px;transition:color .25s;line-height:1.1}
        .sc-b{font-size:13px;color:#666;line-height:1.7;transition:color .25s}
        .sc-arr{position:absolute;bottom:26px;right:26px;width:34px;height:34px;background:#FFCF40;border-radius:10px;display:flex;align-items:center;justify-content:center;opacity:0;transform:translate(8px,8px);transition:opacity .25s,transform .25s}

        .team-bg{background:#0D0D0D;padding:96px 60px}
        .team-inner{max-width:1300px;margin:0 auto}
        .cw{overflow:hidden;cursor:grab;user-select:none;margin-top:24px;padding:20px 0}
        .cw:active{cursor:grabbing}
        .ct{display:flex;gap:14px;will-change:transform}
        .mc{flex:0 0 218px;background:#181818;border:1.5px solid rgba(255,255,255,.06);border-radius:20px;overflow:hidden;transition:all .3s cubic-bezier(.4,0,.2,1);cursor:pointer;position:relative}
        .mc:hover{border-color:rgba(255,207,64,.3);transform:translateY(-3px)}
        .mc.act{border-color:#FFCF40;box-shadow:0 15px 40px rgba(0,0,0,.7),0 0 0 1px rgba(255,207,64,.2);transform:scale(1.05) translateY(-5px);z-index:10}
        .mp{height:155px;overflow:hidden;position:relative;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .mp-img{width:100%;height:100%;object-fit:cover;transition:filter .3s}
        .mc:hover .mp-img{filter:brightness(1.08)}
        .mi{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:72px;line-height:1;pointer-events:none}
        .ovr-badge{position:absolute;top:9px;left:9px;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:22px;line-height:1;background:#0C0C0C;border-radius:8px;padding:3px 8px;letter-spacing:.02em;z-index:4}
        .ovr-sub{font-size:8px;font-weight:700;color:rgba(255,255,255,.4);letter-spacing:.08em;text-transform:uppercase;display:block;text-align:center;margin-top:1px}
        .mst{position:absolute;top:9px;right:9px;display:flex;align-items:center;gap:4px;background:rgba(0,0,0,.75);border-radius:20px;padding:3px 9px;font-size:9px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;z-index:5;backdrop-filter:blur(4px)}
        .dot-on{width:6px;height:6px;border-radius:50%;background:#2ECC71;animation:pulse 2s infinite;flex-shrink:0}
        .dot-off{width:6px;height:6px;border-radius:50%;background:#444;flex-shrink:0}
        .role-badge{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);white-space:nowrap;background:rgba(0,0,0,.72);border:1px solid rgba(255,207,64,.2);color:#FFCF40;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:20px;backdrop-filter:blur(4px);z-index:4}
        .minfo{padding:12px 14px 14px}
        .mname{font-weight:700;font-size:13px;color:#fff;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .mspecs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
        .chip{display:inline-flex;align-items:center;gap:3px;padding:3px 7px;border-radius:6px;font-size:9px;font-weight:700;background:rgba(255,255,255,.05);color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.07)}
        .mexp{font-size:10px;color:rgba(255,255,255,.4);font-weight:600;display:flex;align-items:center;gap:5px;margin-bottom:4px}
        .stars{display:flex;align-items:center;gap:2px;margin-bottom:6px}
        .macts{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.06)}
        .btn-contactar{width:100%;display:flex;align-items:center;justify-content:center;gap:6px;padding:10px;border-radius:9px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;border:1px solid #FFCF40;background:#FFCF40;color:#0C0C0C;cursor:pointer;transition:background .15s;font-family:'Instrument Sans',sans-serif}
        .btn-contactar:hover{background:#E8BB00}
        .team-state{display:flex;align-items:center;gap:12px;padding:48px 0;color:rgba(255,255,255,.3);font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase}
        .team-bar{display:flex;align-items:center;gap:6px;margin-top:18px;padding-top:16px;border-top:1px solid rgba(255,255,255,.05)}
        .team-dot{width:8px;height:8px;border-radius:50%;background:#2ECC71;animation:pulse 2s infinite}
        .team-count{font-size:11px;font-weight:700;color:rgba(255,255,255,.3);letter-spacing:.08em;text-transform:uppercase}

        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(5px);z-index:999;display:flex;align-items:center;justify-content:center;animation:fadeIn .2s}
        .modal-box{background:#141414;border:1px solid rgba(255,207,64,.2);border-radius:20px;padding:32px;width:90%;max-width:420px;position:relative;box-shadow:0 20px 60px rgba(0,0,0,.7);animation:slideUp .25s ease}
        .modal-close{position:absolute;top:18px;right:18px;background:rgba(255,255,255,.05);border:none;color:rgba(255,255,255,.5);cursor:pointer;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s}
        .modal-close:hover{background:rgba(255,207,64,.1);color:#FFCF40}
        .f-input{width:100%;background:#0C0C0C;border:1px solid rgba(255,255,255,.1);color:#fff;padding:14px 16px;border-radius:12px;font-family:'Instrument Sans',sans-serif;font-size:13px;transition:border-color .2s}
        .f-input:focus{outline:none;border-color:#FFCF40}
        .f-input::placeholder{color:rgba(255,255,255,.3)}

        /* ── PROCESO ── */
        .proc-bg{background:#0C0C0C;padding:96px 60px}
        .proc-inner{max-width:1300px;margin:0 auto}
        .pg{display:grid;grid-template-columns:repeat(4,1fr);position:relative;margin-top:52px}
        .pg::before{content:'';position:absolute;top:28px;left:calc(12.5% + 2px);right:calc(12.5% + 2px);height:1px;background:rgba(255,255,255,.08);z-index:0}
        .ps{padding:0 20px 0 0;position:relative}
        .psn-wrap{display:flex;align-items:center;gap:10px;margin-bottom:22px;position:relative;z-index:1}
        .psn{width:56px;height:56px;border-radius:50%;border:1.5px solid rgba(255,207,64,.3);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#FFCF40;background:#0C0C0C;flex-shrink:0}
        .ps-badge{font-size:10px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;background:rgba(255,207,64,.08);color:#FFCF40;border:0.5px solid rgba(255,207,64,.2);border-radius:4px;padding:3px 8px;white-space:nowrap}
        .pst{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:21px;color:#fff;text-transform:uppercase;margin-bottom:10px;line-height:1.1}
        .psb{font-size:12px;color:rgba(255,255,255,.38);line-height:1.75;margin-bottom:16px}
        .ps-perks{display:flex;flex-direction:column;gap:7px}
        .ps-perk{display:flex;align-items:flex-start;gap:7px;font-size:11px;color:rgba(255,255,255,.5);line-height:1.5}
        .ps-perk-dot{width:5px;height:5px;border-radius:50%;background:#FFCF40;margin-top:4px;flex-shrink:0;opacity:.6}

        .vs-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:52px}
        .vs-card{border-radius:12px;padding:22px 26px}
        .vs-us{background:rgba(255,207,64,.06);border:0.5px solid rgba(255,207,64,.18)}
        .vs-them{background:rgba(255,255,255,.02);border:0.5px solid rgba(255,255,255,.07)}
        .vs-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px}
        .vs-item{display:flex;align-items:center;gap:9px;font-size:12px;margin-bottom:9px}
        .vs-item:last-child{margin-bottom:0}
        .vs-check{width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;font-weight:700}

        /* ── CTA Final Animado ── */
        .cta-band{position:relative;padding:90px 60px;overflow:hidden}
        .cta-bg-img{position:absolute;inset:0;background-size:cover;background-position:center top;filter:grayscale(100%) brightness(40%);transition:background-image 1s ease-in-out, transform 4s linear;transform:scale(1.05);z-index:0}
        .cta-overlay{position:absolute;inset:0;background:linear-gradient(90deg, #FFCF40 0%, rgba(255,207,64,.8) 40%, rgba(0,0,0,.7) 100%);z-index:1}
        .cta-in{position:relative;z-index:2;max-width:1300px;margin:0 auto;display:grid;grid-template-columns:1fr auto;align-items:center;gap:48px}
        .cta-h{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-style:italic;font-size:clamp(38px,5vw,70px);color:#0C0C0C;text-transform:uppercase;line-height:.93}
        .cta-s{font-size:14px;color:rgba(0,0,0,.7);margin-top:11px;font-weight:600;max-width:400px}
        .btn-dark{display:inline-flex;align-items:center;gap:9px;background:#0C0C0C;color:#FFCF40;font-weight:700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;padding:17px 30px;border-radius:12px;border:none;cursor:pointer;text-decoration:none;white-space:nowrap;transition:transform .15s,box-shadow .2s;font-family:'Instrument Sans',sans-serif}
        .btn-dark:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.5)}

        .footer{background:#080808;padding:62px 60px 34px;border-top:1px solid rgba(255,255,255,.05)}
        .ft{max-width:1300px;margin:0 auto}
        .ftop{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:60px;padding-bottom:46px;border-bottom:1px solid rgba(255,255,255,.05);margin-bottom:26px}
        .fc-t{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#FFCF40;margin-bottom:14px}
        .fl{display:block;font-size:12px;color:rgba(255,255,255,.38);text-decoration:none;margin-bottom:9px;transition:color .2s}
        .fl:hover{color:#fff}
        .fb{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:rgba(255,255,255,.22)}
        .fhv{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:13px;letter-spacing:.1em;color:rgba(255,255,255,.1)}

        .mob-menu{position:fixed;inset:0;background:#080808;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;animation:fadeIn .2s}
        .mob-lnk{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:50px;text-transform:uppercase;color:#fff;text-decoration:none;letter-spacing:.02em;transition:color .15s}
        .mob-lnk:hover{color:#FFCF40}
        .hmb{display:none;background:none;border:none;cursor:pointer}

        .port-bg{background:#0D0D0D}

        /* ── MEDIA QUERIES PARA RESPONSIVIDAD ── */
        @media(max-width:1024px){
          .hero-inner{grid-template-columns:1fr;padding:120px 30px 80px}
          .q-grid{justify-self:start;max-width:100%}
          .svc-grid{grid-template-columns:1fr}
          .stats-bar{grid-template-columns:1fr 1fr}
          .si:nth-child(2){border-right:none}
          .pg{grid-template-columns:1fr 1fr}
          .ftop{grid-template-columns:1fr 1fr}
          .cta-in{grid-template-columns:1fr}
          .nav-links{display:none}
          .hmb{display:block}
          
          /* Arreglo para que títulos y bajadas no compartan espacio en pantallas chicas */
          .section-header-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            align-items: start;
          }
          
          .section,.team-bg,.proc-bg,.cta-band,.footer{padding-left:30px;padding-right:30px}
          .section-padding-mob { padding-left: 30px !important; padding-right: 30px !important; }
          .vs-row{grid-template-columns:1fr}
        }
        
        @media(max-width:600px){
          .pg{grid-template-columns:1fr}
          .q-grid{grid-template-columns:1fr}
          .ftop{grid-template-columns:1fr;gap:30px}
          .fb{flex-direction:column;gap:8px;text-align:center}
          .nav,.nav.sc{padding:14px 20px}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? ' sc' : ''}`}>
        <Link to="/" className="logo">
          <img src={LOGO_URL} alt="HV Construcción" />
          <div className="logo-t">HV<br /><span>CONSTRUCCIÓN</span></div>
        </Link>
        <div className="nav-links">
          <a href="#servicios" className="nl">Servicios</a>
          <a href="#portafolio" className="nl">Trabajos</a>
          <Link to="/cotizador" className="nl">Presupuesto</Link>
          <a href="#equipo" className="nl">Equipo</a>
          <a href="#proceso" className="nl">Proceso</a>
          <Link to="/login" className="nav-cta">Portal →</Link>
        </div>
        <button className="hmb" onClick={() => setMenuOpen(true)}><Menu size={26} color="#fff" /></button>
      </nav>

      {menuOpen && (
        <div className="mob-menu">
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: 20, right: 22, background: 'none', border: 'none', cursor: 'pointer' }}><X size={28} color="#fff" /></button>
          <a href="#servicios" className="mob-lnk" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#portafolio" className="mob-lnk" onClick={() => setMenuOpen(false)}>Trabajos</a>
          <Link to="/cotizador" className="mob-lnk" onClick={() => setMenuOpen(false)}>Presupuesto</Link>
          <a href="#equipo" className="mob-lnk" onClick={() => setMenuOpen(false)}>Equipo</a>
          <a href="#proceso" className="mob-lnk" onClick={() => setMenuOpen(false)}>Proceso</a>
          <Link to="/login" className="btn-gold" onClick={() => setMenuOpen(false)} style={{ marginTop: 8 }}>Portal <ArrowRight size={15} /></Link>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hgrid" /><div className="hhaz" /><div className="hhaz-b" />
        <div className="hero-inner">
          <div>
            <div className="eyebrow">Construcción inteligente · Chile</div>
            <h1 className="h1">Construimos<br /><em>el futuro</em><br />hoy.</h1>
            <p className="hero-body">Primera constructora en Chile con motor de IA integrado. Cubicaciones exactas, cumplimiento de normativas garantizado y transparencia total en cada avance.</p>
            <div className="hero-actions">
              <Link to="/cotizador" className="btn-gold"><Calculator size={15} /> Ir a presupuesto gratis</Link>
              <a href="#portafolio" className="btn-ghost"><Camera size={14} /> Ver trabajos</a>
            </div>
            
            {/* Banner de colaboradores */}
            <a href="#equipo" className="hero-collab-btn">
              <Users size={14} color="#FFCF40" /> Trabaja con uno de nuestros colaboradores
            </a>
          </div>
          
          {/* Tarjetas de Calidad y Confianza */}
          <div className="q-grid">
            {[
              { i: ShieldCheck, t: 'Procesos Legales', d: 'Gestionamos y auditamos los permisos de tu obra sin intermediarios.' },
              { i: Cpu, t: 'Recomendaciones IA', d: 'Motor predictivo que calcula el material exacto sin sorpresas al final.' },
              { i: CheckCircle2, t: 'Instalaciones Certificadas', d: 'Profesionales habilitados por la SEC y bajo normativas chilenas.' },
              { i: HardHat, t: 'Seguridad Operativa', d: 'Planificación de riesgos y control exhaustivo en cada cuadrilla.' }
            ].map(({ i: Icon, t, d }) => (
              <div className="q-card" key={t}>
                <div className="q-icon"><Icon size={18} /></div>
                <div>
                  <div className="q-title">{t}</div>
                  <div className="q-desc">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="t-track">
          {Array(2).fill(TICKER_SERVICES).flat().map((s, i) => (
            <span key={i} className="t-item">
              {s.label}<span className="t-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS (Dinámicos) ── */}
      <div className="stats-bar">
        {[
          { n: 100, s: '+', l: 'Proyectos entregados', isFloat: false },
          { n: totalTeamExp || 12, s: ' Años', l: 'Experiencia combinada', isFloat: false },
          { n: 4.5, s: ' / 5', l: 'Clientes satisfechos', isFloat: true },
          { n: 15000, s: '+', l: 'Horas trabajadas', isFloat: false },
        ].map(({ n, s, l, isFloat }) => (
          <div key={l} className="si">
            <span className="sn"><Counter target={n} suffix={s} isFloat={isFloat} /></span>
            <span className="sl">{l}</span>
          </div>
        ))}
      </div>

      {/* ── SERVICIOS DIFERENCIADORES ── */}
      <div className="svc-bg" id="servicios">
        <div className="section">
          <div className="stag">Nuestros pilares</div>
          <div className="section-header-grid">
            <h2 className="sh-dark">Soluciones que<br /><em>marcan diferencia</em></h2>
            <p style={{ fontSize: 13, color: '#777', lineHeight: 1.8, maxWidth: 440 }}>Nos alejamos del estándar tradicional de la construcción, adoptando innovación pura para proteger tu inversión y tranquilidad.</p>
          </div>
          <div className="svc-grid">
            {[
              { n: '01', Icon: Bot, t: 'Inteligencia Artificial', b: 'Presupuestos milimétricos y proyecciones automáticas que evitan sobrecostos de materiales y optimizan los tiempos de tu obra.' },
              { n: '02', Icon: Eye, t: 'Transparencia Total', b: 'Tu proyecto incluye un Portal 24/7. Fotografías diarias, estados de avance y pagos documentados a un clic de distancia.' },
              { n: '03', Icon: ClipboardList, t: 'Tecnología y Planos', b: 'Diseños bajo normativa actualizada. Planificamos la estructura y el diseño 3D garantizando factibilidad desde el día cero.' },
              { n: '04', Icon: ShieldCheck, t: 'Prevención de Errores', b: 'Sistemas de auditoría cruzada durante la ejecución para identificar potenciales problemas antes de que se conviertan en gastos.' },
              { n: '05', Icon: Users, t: 'Perfil del Cliente', b: 'Adaptamos el flujo, las comunicaciones y el equipo de trabajo específicamente a tus necesidades y nivel de conocimiento técnico.' },
              { n: '06', Icon: CheckSquare, t: 'Instalaciones Cert.', b: 'Solo operamos con técnicos evaluados. Electricidad y gasfitería con sellos de garantía y certificaciones correspondientes.' },
            ].map(({ n, Icon, t, b }) => (
              <div className="sc-card" key={n}>
                <div className="sc-n">{n}</div>
                <div className="sc-iw"><Icon size={21} color="#0C0C0C" /></div>
                <div className="sc-t">{t}</div><div className="sc-b">{b}</div>
                <div className="sc-arr"><ArrowRight size={15} color="#0C0C0C" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── PORTAFOLIO ── */}
      <PortafolioSection />

      {/* ── EQUIPO ── */}
      <div className="team-bg" id="equipo">
        <div className="team-inner">
          <div className="stag" style={{ color: 'rgba(255,207,64,.65)' }}>Capital humano certificado</div>
          <div className="section-header-grid">
            <h2 className="sh-light">Nuestro equipo<br /><em>de élite</em></h2>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.8, marginBottom: 12 }}>Conoce a los especialistas que harán realidad tu proyecto. Los perfiles con más experiencia siempre lideran cada categoría.</p>
              {!teamLoading && !teamError && (
                <div className="team-bar">
                  <div className="team-dot" />
                  <span className="team-count">{filteredTeam.length} profesional{filteredTeam.length !== 1 ? 'es' : ''} listo{filteredTeam.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Filtros de Equipo */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 32 }}>
            {TEAM_CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setTeamFilter(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 30, fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s',
                  background: teamFilter === cat ? '#FFCF40' : 'rgba(255,255,255,.05)',
                  color: teamFilter === cat ? '#0A0A0A' : 'rgba(255,255,255,.5)',
                  border: teamFilter === cat ? '1px solid #FFCF40' : '1px solid rgba(255,255,255,.1)'
                }}>
                {cat}
              </button>
            ))}
          </div>

          {teamLoading && <div className="team-state"><Loader2 size={20} color="#FFCF40" style={{ animation: 'spin 1s linear infinite' }} />Sincronizando…</div>}
          {teamError && !teamLoading && <div className="team-state" style={{ color: 'rgba(231,76,60,.6)' }}>⚠ {teamError}</div>}
          {!teamLoading && !teamError && (
            filteredTeam.length === 0
              ? <div className="team-state">No hay especialistas registrados en esta categoría aún.</div>
              : <div className="cw" onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={onMU}>
                <div ref={trackRef} className="ct" style={{ transform: `translateX(${carouselOffset}px)` }}>
                  {filteredTeam.map((m, idx) => {
                    const isActive = activeCard === m.id;
                    const col = COLORS[idx % COLORS.length];
                    const nombre = safeName(m.name); const ovr = m.overall || 0;
                    const prof = m.profession || m.role || 'Especialista';
                    const specs = Array.isArray(m.specialties) ? m.specialties : [];
                    const expTotal = specs.reduce((a, c) => a + Number(c.exp || 0), 0);
                    const isOn = m.active !== false;
                    return (
                      <div key={m.id} className={`mc${isActive ? ' act' : ''}`} onClick={() => setActiveCard(isActive ? null : m.id)}>
                        <div className="mp" style={{ background: `${col}1A` }}>
                          {m.photo ? <img src={m.photo} alt={nombre} className="mp-img" /> : <span className="mi" style={{ color: `${col}55` }}>{safeInitial(m.name)}</span>}
                          <div className="ovr-badge" style={{ color: ovrColor(ovr) }}>{ovr}<span className="ovr-sub">OVR</span></div>
                          <div className="mst"><div className={isOn ? 'dot-on' : 'dot-off'} /><span style={{ color: isOn ? '#2ECC71' : 'rgba(255,255,255,.3)', fontSize: 9, fontWeight: 700 }}>{isOn ? 'Activo' : 'No disp.'}</span></div>
                          <div className="role-badge">{prof}</div>
                        </div>
                        <div className="minfo">
                          <div className="mname">{nombre}</div>
                          <div className="stars">
                            {[1, 2, 3, 4, 5].map(n => <svg key={n} width="9" height="9" viewBox="0 0 10 10"><polygon points="5,1 6.2,3.8 9,3.8 6.8,5.8 7.6,8.7 5,7 2.4,8.7 3.2,5.8 1,3.8 3.8,3.8" fill={n <= 4 ? '#FFCF40' : 'rgba(255,255,255,.1)'} /></svg>)}
                            <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.35)', marginLeft: 4 }}>4.8</span>
                          </div>
                          {specs.length > 0 && <div className="mspecs">{(isActive ? specs : specs.slice(0, 3)).map(s => <span key={s.name} className="chip"><span style={{ color: 'rgba(255,207,64,.55)' }}>{SPEC_ICONS[s.name] || <Star size={10} />}</span>{s.name}</span>)}{!isActive && specs.length > 3 && <span className="chip">+{specs.length - 3}</span>}</div>}
                          <div className="mexp"><Activity size={10} color="rgba(255,207,64,.6)" />{expTotal > 0 ? `${expTotal} años de exp.` : 'Sin especialidades aún'}</div>
                          {isActive && <div className="macts"><button className="btn-contactar" onClick={e => { e.stopPropagation(); setContactMember(m); }}><MessageCircle size={14} /> Contactar</button></div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <ChevronRight size={12} color="rgba(255,255,255,.15)" />
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,.18)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' }}>Arrastra · Pincha para expandir</span>
          </div>
        </div>
      </div>

      {/* MODAL contacto */}
      {contactMember && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><X size={18} /></button>
            {!formSubmitted ? (
              <>
                <h3 style={{ fontSize: 24, marginBottom: 8, fontFamily: 'Barlow Condensed', textTransform: 'uppercase', color: '#fff' }}>
                  Contactar a <span style={{ color: '#FFCF40' }}>{safeFirst(contactMember.name)}</span>
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 24, lineHeight: 1.6 }}>Déjanos tus datos. Coordinaremos tu solicitud para asignarte a este especialista.</p>
                <form style={{ display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); setFormSubmitted(true); }}>
                  <input required type="text" placeholder="Tu nombre completo" className="f-input" />
                  <input required type="text" placeholder="Teléfono o correo" className="f-input" />
                  <textarea required rows="4" placeholder="Describe brevemente el trabajo…" className="f-input" style={{ resize: 'none' }} />
                  <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', marginTop: 8, padding: '16px' }}>Enviar solicitud</button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(46,204,113,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={30} color="#2ECC71" />
                </div>
                <h3 style={{ fontSize: 26, fontFamily: 'Barlow Condensed', textTransform: 'uppercase', color: '#fff', marginBottom: 10 }}>¡Solicitud enviada!</h3>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', lineHeight: 1.6 }}>Nos pondremos en contacto contigo a la brevedad para coordinar con {safeFirst(contactMember.name)}.</p>
                <button onClick={closeModal} className="btn-ghost" style={{ marginTop: 24, width: '100%', justifyContent: 'center' }}>Cerrar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROCESO MEJORADO ── */}
      <div className="proc-bg" id="proceso">
        <div className="proc-inner">
          <div className="stag" style={{ color: 'rgba(255,207,64,.65)' }}>Cómo trabajamos</div>
          <div className="section-header-grid">
            <h2 className="sh-light">Tu proyecto en<br /><em>4 etapas claras</em></h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.38)', lineHeight: 1.8 }}>
              Control total, visibilidad real y cero sorpresas desde el primer día. Sin letra chica, sin intermediarios, sin demoras.
            </p>
          </div>

          <div className="pg">
            {[
              { n: '01', badge: 'Sin costo', t: 'Diagnóstico', b: 'Levantamiento técnico en terreno, factibilidad y presupuesto detallado por IA en menos de 24 horas.', perks: ['Presupuesto itemizado en 24 h', 'Revisión en terreno', 'Sin compromiso de contratación'] },
              { n: '02', badge: 'Todo incluido', t: 'Diseño y Normativa', b: 'Arquitectura, cálculo estructural y tramitación de permisos bajo los estándares vigentes.', perks: ['Arquitecto y calculista', 'Gestión DOM', 'Planos aprobados en 7 días'] },
              { n: '03', badge: 'Trazabilidad total', t: 'Ejecución', b: 'Fotos diarias, avance por partida, revisión de calidad continua y acceso al portal en tiempo real.', perks: ['Reporte fotográfico diario', 'Portal 24/7', 'Control de calidad permanente'] },
              { n: '04', badge: 'Garantía perpetua', t: 'Entrega Final', b: 'Recepción municipal, manual del propietario y un portal para gestionar tus garantías siempre activo.', perks: ['Recepción coordinada', 'Manual técnico', 'Portal de garantías activo'] },
            ].map(({ n, badge, t, b, perks }) => (
              <div className="ps" key={n}>
                <div className="psn-wrap">
                  <div className="psn">{n}</div>
                  <span className="ps-badge">{badge}</span>
                </div>
                <div className="pst">{t}</div>
                <div className="psb">{b}</div>
                <div className="ps-perks">
                  {perks.map((p, i) => (
                    <div key={i} className="ps-perk">
                      <div className="ps-perk-dot" />
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="vs-row">
            {[
              {
                us: true, label: 'HV Construcción',
                items: ['Presupuesto exacto sin costo en 24h', 'Permisos y revisión normativa (LGUC)', 'Portal del cliente con fotos diarias', 'Estándares de seguridad certificados', 'Garantía digital post-entrega'],
              },
              {
                us: false, label: 'Constructora tradicional',
                items: ['Presupuesto al ojo, sin desglose', 'Permisos quedan a cargo del cliente', 'Sin seguimiento ni transparencia', 'Sin garantía de cumplimiento', 'Una vez cobrado, desaparecen'],
              },
            ].map(({ us, label, items }) => (
              <div key={label} className={`vs-card ${us ? 'vs-us' : 'vs-them'}`}>
                <div className="vs-label" style={{ color: us ? '#FFCF40' : 'rgba(255,255,255,.25)' }}>{label}</div>
                {items.map((item, i) => (
                  <div key={i} className="vs-item" style={{ color: us ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.28)' }}>
                    <div className="vs-check" style={{ background: us ? 'rgba(255,207,64,.12)' : 'rgba(255,255,255,.05)', color: us ? '#FFCF40' : 'rgba(255,255,255,.2)' }}>
                      {us ? '✓' : '✕'}
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA Final con Imagen Rotativa ── */}
      <div className="cta-band">
        {/* Fondo fotográfico dinámico */}
        <div className="cta-bg-img" style={{ backgroundImage: `url(${ctaBgImage})` }} />
        <div className="cta-overlay" />
        
        <div className="cta-in">
          <div>
            <div className="cta-h">¿Listo para<br />comenzar?</div>
            <div className="cta-s">Cotiza tu proyecto. Un integrante de nuestro equipo responderá y evaluará tus necesidades.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/cotizador" className="btn-dark" style={{ background: '#fff', color: '#0A0A0A', padding: '18px 34px', fontSize: 13 }}><Calculator size={16} /> Ir a presupuesto gratis</Link>
            <div style={{ textAlign: 'center', fontSize: 9, color: 'rgba(0,0,0,.6)', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Rápido · Transparente · Exacto</div>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="ft">
          <div className="ftop">
            <div>
              <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                <img src={LOGO_URL} alt="HV" style={{ height: 38 }} />
                <div className="logo-t">HV<br /><span>CONSTRUCCIÓN</span></div>
              </Link>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.32)', lineHeight: 1.75, marginTop: 14, maxWidth: 230 }}>Primera constructora chilena con IA integrada para presupuestos exactos y calidad garantizada.</p>
            </div>
            <div>
              <div className="fc-t">Navegación</div>
              <a href="#servicios" className="fl">Servicios</a>
              <a href="#portafolio" className="fl">Trabajos</a>
              <Link to="/cotizador" className="fl">Presupuesto</Link>
              <a href="#equipo" className="fl">Equipo</a>
              <a href="#proceso" className="fl">Proceso</a>
              <Link to="/login" className="fl">Portal Privado</Link>
            </div>
            <div>
              <div className="fc-t">Legal</div>
              {['Privacidad', 'Términos', 'Garantías'].map(l => <a key={l} href="#" className="fl">{l}</a>)}
            </div>
            <div>
              <div className="fc-t">Contacto</div>
              {[{ I: MapPin, t: 'Santiago, Chile' }, { I: Phone, t: '+56 9 3543 8480' }, { I: Mail, t: 'contacto@hv.cl' }].map(({ I, t }) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9 }}>
                  <I size={11} color="rgba(255,207,64,.45)" />
                  <span className="fl" style={{ margin: 0 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="fb">
            <span>© 2026 HV Construcción y Tecnología SpA · Todos los derechos reservados</span>
            <span className="fhv">HV · CONSTRUCCIÓN</span>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;