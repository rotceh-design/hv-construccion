import React, { useState, useEffect, useRef } from 'react';
import {
  Users, UserPlus, Trash2, HardHat, Mail, Loader2, Phone,
  Fingerprint, Camera, Wrench, Zap, Droplets,
  Hammer, Paintbrush, ShieldCheck, ClipboardCheck, X, Share2, Award,
  ChevronRight, Star, Search, Filter, TrendingUp
} from 'lucide-react';
import { db, storage } from '../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

/* ─── helpers ─────────────────────────────────────────── */
const safeName   = (name) => (typeof name === 'string' && name.trim() ? name : 'Miembro');
const safeInitial = (name) => safeName(name).charAt(0).toUpperCase();
const safeFirst   = (name) => safeName(name).split(' ')[0];

/* ─── paleta de rol ────────────────────────────────────── */
const roleColors = {
  terreno:    { bg: '#FFF4E0', text: '#C47A00', border: '#F5A623' },
  oficina:    { bg: '#E8F0FF', text: '#1A4DB5', border: '#4A80F5' },
  externo:    { bg: '#F0FFF4', text: '#1A7A3A', border: '#2ECC71' },
};

const getRoleColor = (role) => roleColors[role] || roleColors.terreno;

/* ─── icons de especialidad ────────────────────────────── */
const specIcons = {
  Electricidad: <Zap size={13} />,
  Gasfitería:   <Droplets size={13} />,
  Carpintería:  <Hammer size={13} />,
  Pintura:      <Paintbrush size={13} />,
  Albañilería:  <Wrench size={13} />,
  Estructura:   <Hammer size={13} />,
  Seguridad:    <ShieldCheck size={13} />,
  Planos:       <ClipboardCheck size={13} />,
};

const oficios = [
  'Albañil', 'Carpintero', 'Eléctrico', 'Gasfiter', 'Soldador',
  'Pintor', 'Tabiquero', 'Enfierrador', 'Jefe de Obra', 'ITO',
  'Arquitecto', 'Ingeniero',
];

/* ══════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════════ */
const Team = () => {
  const [users,          setUsers]          = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [isAdding,       setIsAdding]       = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery,    setSearchQuery]    = useState('');
  const [showForm,       setShowForm]       = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', role: 'terreno',
    profession: 'Carpintero', phone: '+569', rut: '',
    gender: 'Masculino', photoFile: null, photoPreview: null,
  });
  const [selectedSpecs, setSelectedSpecs] = useState([]);

  /* email automático */
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const slug = `${formData.firstName}.${formData.lastName}`
        .toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
      setFormData(prev => ({ ...prev, email: `${slug}@hv.cl` }));
    }
  }, [formData.firstName, formData.lastName]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'users'));
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, photoFile: file, photoPreview: URL.createObjectURL(file) });
  };

  const toggleSpec = (spec) => {
    setSelectedSpecs(prev =>
      prev.find(s => s.name === spec)
        ? prev.filter(s => s.name !== spec)
        : [...prev, { name: spec, exp: 1 }]
    );
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      let photoUrl = '';
      if (formData.photoFile) {
        const storageRef = ref(storage, `team/${Date.now()}-${formData.photoFile.name}`);
        await uploadBytes(storageRef, formData.photoFile);
        photoUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, 'users'), {
        name:        `${formData.firstName} ${formData.lastName}`,
        email:       formData.email,
        role:        formData.role,
        profession:  formData.profession,
        phone:       formData.phone,
        rut:         formData.rut,
        gender:      formData.gender,
        photo:       photoUrl,
        specialties: selectedSpecs,
        overall:     selectedSpecs.reduce((a, c) => a + parseInt(c.exp || 0), 0),
        createdAt:   new Date().toISOString(),
      });
      setFormData({ firstName: '', lastName: '', email: '', role: 'terreno', profession: 'Carpintero', phone: '+569', rut: '', gender: 'Masculino', photoFile: null, photoPreview: null });
      setSelectedSpecs([]);
      setShowForm(false);
      await fetchTeam();
    } catch { alert('Error al guardar'); }
    setIsAdding(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este miembro?')) return;
    try {
      await deleteDoc(doc(db, 'users', id));
      setUsers(prev => prev.filter(u => u.id !== id));
      if (selectedMember?.id === id) setSelectedMember(null);
    } catch { alert('Error al eliminar'); }
  };

  const filteredUsers = users.filter(u =>
    safeName(u.name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.profession || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ── OVR color ── */
  const ovrColor = (ovr) => {
    if (ovr >= 80) return '#2ECC71';
    if (ovr >= 50) return '#F5A623';
    return '#E74C3C';
  };

  /* ══════════════════════════════════ RENDER ══════════════════════════════════ */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');

        .team-root * { box-sizing: border-box; margin: 0; padding: 0; }
        .team-root { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Bebas Neue', sans-serif; }

        .card-member {
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #F0EDE8;
          cursor: pointer;
          transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
          position: relative;
          overflow: hidden;
        }
        .card-member:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 40px rgba(0,0,0,.1);
          border-color: #FFCF40;
        }
        .card-member::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,207,64,.08) 0%, transparent 60%);
          opacity: 0;
          transition: opacity .2s;
        }
        .card-member:hover::before { opacity: 1; }

        .ovr-badge {
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: .04em;
        }

        .spec-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 8px;
          font-size: 10px;
          font-weight: 700;
          background: #F5F3EE;
          color: #555;
          border: 1px solid #EAE8E2;
        }
        .spec-chip-active {
          background: #FFF4CC;
          color: #A67800;
          border-color: #FFCF40;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(10,10,15,.85);
          backdrop-filter: blur(10px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn .25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }

        .modal-card {
          animation: slideUp .3s cubic-bezier(.16,1,.3,1);
          width: 360px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,.5);
        }

        .form-panel {
          background: #fff;
          border-radius: 24px;
          border: 1.5px solid #F0EDE8;
          overflow: hidden;
        }
        .input-field {
          width: 100%;
          padding: 10px 14px;
          background: #FAFAF8;
          border: 1.5px solid #EAE8E2;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          color: #1A1A1A;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color .2s;
        }
        .input-field:focus { border-color: #FFCF40; background: #FFFDF5; }
        .input-field::placeholder { color: #B0ADA6; }

        .btn-primary {
          background: #FFCF40;
          color: #1A1000;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: .08em;
          text-transform: uppercase;
          border: none;
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          width: 100%;
          transition: transform .15s, box-shadow .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(255,207,64,.45);
        }
        .btn-primary:active:not(:disabled) { transform: scale(.98); }
        .btn-primary:disabled { opacity: .6; cursor: not-allowed; }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          border: 1.5px solid #EAE8E2;
          border-radius: 14px;
          padding: 8px 14px;
        }
        .search-bar input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          color: #1A1A1A;
          flex: 1;
        }
        .search-bar input::placeholder { color: #B0ADA6; }

        .stat-bar {
          height: 4px;
          border-radius: 4px;
          background: #F0EDE8;
          overflow: hidden;
        }
        .stat-bar-fill {
          height: 100%;
          border-radius: 4px;
          background: #FFCF40;
        }

        .tab-btn {
          padding: 6px 16px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: background .15s, color .15s;
          font-family: 'DM Sans', sans-serif;
        }
        .tab-active { background: #1A1A1A; color: #fff; }
        .tab-inactive { background: transparent; color: #888; }

        .delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,.9);
          border: 1px solid #EAE8E2;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity .15s, background .15s;
        }
        .card-member:hover .delete-btn { opacity: 1; }
        .delete-btn:hover { background: #FEE2E2; border-color: #FCA5A5; }

        .slide-panel {
          position: fixed;
          inset: 0;
          z-index: 150;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          background: rgba(0,0,0,.4);
          backdrop-filter: blur(4px);
          animation: fadeIn .2s ease;
        }
        .slide-panel-inner {
          width: 100%;
          max-width: 480px;
          max-height: 92vh;
          overflow-y: auto;
          background: #fff;
          border-radius: 28px 28px 0 0;
          padding: 28px;
          animation: slideUp .3s cubic-bezier(.16,1,.3,1);
        }

        @media (min-width: 768px) {
          .slide-panel { align-items: center; }
          .slide-panel-inner { border-radius: 28px; max-height: 85vh; }
        }

        .ovr-ring {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #1A1A1A;
        }
        .avatar-xl {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        .info-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid #F0EDE8;
        }
        .info-row:last-child { border-bottom: none; }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2ECC71;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(46,204,113,.4); }
          50% { box-shadow: 0 0 0 6px rgba(46,204,113,0); }
        }
      `}</style>

      <div className="team-root" style={{ minHeight: '100vh', background: '#F9F7F4', padding: '24px' }}>

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <div className="pulse-dot" />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                {users.length} Miembro{users.length !== 1 ? 's' : ''} activo{users.length !== 1 ? 's' : ''}
              </span>
            </div>
            <h1 className="font-display" style={{ fontSize: 42, color: '#1A1A1A', lineHeight: 1, letterSpacing: '.02em' }}>
              EQUIPO <span style={{ color: '#FFCF40' }}>HV</span>
            </h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ width: 'auto', padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 14 }}
          >
            <UserPlus size={16} /> Fichar
          </button>
        </div>

        {/* ── SEARCH + STATS ── */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
            <Search size={16} color="#B0ADA6" />
            <input
              placeholder="Buscar miembro o profesión..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* mini stat cards */}
          {[
            { label: 'Terreno', count: users.filter(u => u.role === 'terreno').length, color: '#F5A623' },
            { label: 'Oficina', count: users.filter(u => u.role === 'oficina').length, color: '#4A80F5' },
            { label: 'Promedio OVR', count: users.length ? Math.round(users.reduce((a, u) => a + (u.overall || 0), 0) / users.length) : 0, color: '#2ECC71' },
          ].map(s => (
            <div key={s.label} style={{ background: '#fff', border: '1.5px solid #F0EDE8', borderRadius: 14, padding: '8px 16px', display: 'flex', flexDirection: 'column', minWidth: 80 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#AAA', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.label}</span>
              <span className="font-display" style={{ fontSize: 24, color: s.color, lineHeight: 1.2 }}>{s.count}</span>
            </div>
          ))}
        </div>

        {/* ── GRID DE MIEMBROS ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <Loader2 size={32} color="#FFCF40" style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
            {filteredUsers.map(member => {
              const rc = getRoleColor(member.role);
              return (
                <div
                  key={member.id}
                  className="card-member"
                  onClick={() => setSelectedMember(member)}
                >
                  {/* delete */}
                  <button className="delete-btn" onClick={e => handleDelete(member.id, e)}>
                    <Trash2 size={12} color="#EF4444" />
                  </button>

                  {/* foto / inicial */}
                  <div style={{ height: 130, background: '#F5F3EE', overflow: 'hidden', position: 'relative' }}>
                    {member.photo ? (
                      <img src={member.photo} alt={safeName(member.name)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span className="font-display" style={{ fontSize: 64, color: '#DDD', lineHeight: 1 }}>
                          {safeInitial(member.name)}
                        </span>
                      </div>
                    )}
                    {/* OVR chip */}
                    <div style={{
                      position: 'absolute', top: 8, left: 8,
                      background: '#1A1A1A', borderRadius: 10, padding: '3px 8px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                      <span className="ovr-badge" style={{ color: ovrColor(member.overall || 0), fontSize: 18, lineHeight: 1 }}>
                        {member.overall || 0}
                      </span>
                      <span style={{ fontSize: 8, color: '#888', fontWeight: 700, letterSpacing: '.06em' }}>OVR</span>
                    </div>
                  </div>

                  {/* info */}
                  <div style={{ padding: '12px 14px 14px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', lineHeight: 1.2, marginBottom: 4 }}>
                      {safeFirst(member.name)}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
                      {member.profession || '—'}
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                      background: rc.bg, color: rc.text,
                      border: `1px solid ${rc.border}`,
                      borderRadius: 8, padding: '2px 8px', fontSize: 9, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '.06em',
                    }}>
                      {member.role || 'terreno'}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* empty state */}
            {filteredUsers.length === 0 && !loading && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 20px', color: '#AAA' }}>
                <Users size={40} color="#DDD" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600 }}>Sin miembros{searchQuery ? ' que coincidan' : ''}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════ MODAL: FICHA PRO ══════════════ */}
      {selectedMember && (
        <div className="modal-overlay" onClick={() => setSelectedMember(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>

            {/* foto + gradiente */}
            <div style={{ position: 'relative', background: '#1A1A1A' }}>
              {selectedMember.photo ? (
                <img src={selectedMember.photo} className="avatar-xl" alt={safeName(selectedMember.name)} />
              ) : (
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                  <span className="font-display" style={{ fontSize: 100, color: '#333' }}>
                    {safeInitial(selectedMember.name)}
                  </span>
                </div>
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.85) 0%, transparent 50%)' }} />

              {/* close */}
              <button
                onClick={() => setSelectedMember(null)}
                style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: 12, background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(4px)' }}
              >
                <X size={18} color="#fff" />
              </button>

              {/* OVR grande */}
              <div style={{ position: 'absolute', top: 14, left: 14, textAlign: 'center' }}>
                <div className="font-display" style={{ fontSize: 52, color: ovrColor(selectedMember.overall || 0), lineHeight: 1 }}>
                  {selectedMember.overall || 0}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,.6)', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                  {selectedMember.role?.substring(0, 3).toUpperCase() || 'TER'}
                </div>
              </div>

              {/* nombre sobre foto */}
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <h2 className="font-display" style={{ fontSize: 34, color: '#fff', letterSpacing: '.03em', lineHeight: 1 }}>
                  {safeName(selectedMember.name).toUpperCase()}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <span style={{ background: '#FFCF40', color: '#1A1000', fontWeight: 700, fontSize: 10, padding: '3px 10px', borderRadius: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    {selectedMember.profession || '—'}
                  </span>
                  <div className="pulse-dot" />
                </div>
              </div>
            </div>

            {/* contenido */}
            <div style={{ background: '#1A1A1A', padding: '20px 20px 0' }}>
              {/* especialidades FIFA-style */}
              {selectedMember.specialties?.length > 0 && (
                <>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#FFCF40', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>
                    Estadísticas
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: 20 }}>
                    {selectedMember.specialties.map(s => (
                      <div key={s.name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,.6)', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                            <span style={{ color: '#FFCF40' }}>{specIcons[s.name]}</span> {s.name.substring(0, 6)}
                          </span>
                          <span className="font-display" style={{ fontSize: 18, color: '#fff', lineHeight: 1 }}>
                            {String(s.exp || 0).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="stat-bar">
                          <div className="stat-bar-fill" style={{ width: `${Math.min((s.exp / 10) * 100, 100)}%`, background: ovrColor(s.exp * 10) }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* datos de contacto */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16, paddingBottom: 20 }}>
                {[
                  { icon: <Fingerprint size={14} />, label: 'RUT',    value: selectedMember.rut   || '—' },
                  { icon: <Phone size={14} />,       label: 'Tel',    value: selectedMember.phone || '—' },
                  { icon: <Mail size={14} />,        label: 'Email',  value: selectedMember.email || '—' },
                ].map(row => (
                  <div key={row.label} className="info-row" style={{ borderBottomColor: 'rgba(255,255,255,.06)' }}>
                    <span style={{ color: '#FFCF40' }}>{row.icon}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', letterSpacing: '.08em', width: 38 }}>{row.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.8)', flex: 1, textAlign: 'right', wordBreak: 'break-all' }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* footer */}
            <div style={{ background: '#FFCF40', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={18} color="#1A1000" />
                <span style={{ fontWeight: 700, fontSize: 11, color: '#1A1000', textTransform: 'uppercase', letterSpacing: '.1em' }}>HV Certified 2026</span>
              </div>
              <button
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1A1000', border: 'none', borderRadius: 10, padding: '8px 14px', fontSize: 11, fontWeight: 700, color: '#FFCF40', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.06em' }}
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ SLIDE-UP: FORMULARIO ══════════════ */}
      {showForm && (
        <div className="slide-panel" onClick={() => setShowForm(false)}>
          <div className="slide-panel-inner" onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 className="font-display" style={{ fontSize: 30, color: '#1A1A1A', letterSpacing: '.03em' }}>FICHAR MIEMBRO</h2>
                <p style={{ fontSize: 12, color: '#AAA', fontWeight: 500 }}>Agregar nuevo al roster HV</p>
              </div>
              <button onClick={() => setShowForm(false)} style={{ width: 36, height: 36, borderRadius: 12, background: '#F5F3EE', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={18} color="#666" />
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* foto */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
                <div
                  onClick={() => fileInputRef.current.click()}
                  style={{ width: 90, height: 90, borderRadius: 22, background: '#F5F3EE', border: '2px dashed #FFCF40', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                >
                  {formData.photoPreview
                    ? <img src={formData.photoPreview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <Camera size={24} color="#FFCF40" />
                  }
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" style={{ display: 'none' }} />
              </div>

              {/* nombres */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input required placeholder="Nombre" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} className="input-field" />
                <input required placeholder="Apellido" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} className="input-field" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input required placeholder="RUT" value={formData.rut} onChange={e => setFormData({ ...formData, rut: e.target.value })} className="input-field" />
                <input required placeholder="Teléfono" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-field" />
              </div>

              <input readOnly value={formData.email} className="input-field" style={{ background: '#F0EDE8', color: '#AAA', fontSize: 12 }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <select value={formData.profession} onChange={e => setFormData({ ...formData, profession: e.target.value })} className="input-field" style={{ cursor: 'pointer' }}>
                  {oficios.map(o => <option key={o}>{o}</option>)}
                </select>
                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="input-field" style={{ cursor: 'pointer' }}>
                  <option value="terreno">Terreno</option>
                  <option value="oficina">Oficina</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              {/* especialidades */}
              <div style={{ background: '#1A1A1A', borderRadius: 18, padding: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#FFCF40', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Especialidades & Stats
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {Object.keys(specIcons).map(spec => {
                    const active = !!selectedSpecs.find(s => s.name === spec);
                    return (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => toggleSpec(spec)}
                        className={`spec-chip ${active ? 'spec-chip-active' : ''}`}
                        style={{ cursor: 'pointer', border: active ? '1px solid #FFCF40' : '1px solid rgba(255,255,255,.1)', background: active ? '#FFF4CC' : 'rgba(255,255,255,.06)', color: active ? '#A67800' : 'rgba(255,255,255,.4)' }}
                      >
                        <span style={{ color: active ? '#A67800' : 'rgba(255,255,255,.4)' }}>{specIcons[spec]}</span>
                        {spec}
                      </button>
                    );
                  })}
                </div>
                {selectedSpecs.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedSpecs.map(s => (
                      <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.7)' }}>
                          <span style={{ color: '#FFCF40' }}>{specIcons[s.name]}</span> {s.name}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="font-display" style={{ color: '#FFCF40', fontSize: 18, lineHeight: 1, width: 24, textAlign: 'center' }}>{s.exp}</span>
                          <input
                            type="range" min="1" max="10" value={s.exp}
                            onChange={e => setSelectedSpecs(prev => prev.map(item => item.name === s.name ? { ...item, exp: parseInt(e.target.value) } : item))}
                            style={{ width: 80, accentColor: '#FFCF40' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="submit" disabled={isAdding} className="btn-primary">
                {isAdding ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Procesando...</span> : '⚡ Fichar Miembro'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Team;