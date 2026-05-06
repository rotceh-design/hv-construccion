import React, { useState, useRef, Suspense } from 'react';
import { 
  MousePointer2, Plus, Calculator, Trash2, Save, User, MapPin, 
  CheckCircle2, FileText, Loader2, BoxSelect, Maximize2, RotateCw, Tent
} from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- IMPORTS DE THREE.JS ---
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, TransformControls, Grid, useProgress, Html } from '@react-three/drei';

// ==========================================
// 1. COMPONENTES VISUALES Y DE CARGA
// ==========================================

function PantallaCarga() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{ background: 'rgba(12, 12, 12, 0.95)', padding: '30px', borderRadius: '20px', border: '1px solid rgba(255, 207, 64, 0.3)', textAlign: 'center', width: '280px', boxShadow: '0 20px 50px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}>
        <Loader2 size={28} color="#FFCF40" className="spin" style={{ margin: '0 auto 12px', animation: 'spin 1s linear infinite' }}/>
        <h2 style={{ fontFamily: 'Barlow Condensed', margin: '0 0 5px 0', fontSize: '24px', color: '#fff', textTransform: 'uppercase' }}>
          HV <span style={{ color: '#FFCF40' }}>Construcción</span>
        </h2>
        <div style={{ width: '100%', background: '#222', height: '4px', borderRadius: '2px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#FFCF40', height: '100%', transition: 'width 0.3s ease-out' }} />
        </div>
      </div>
    </Html>
  );
}

// Muebles Estáticos de Relleno
const MuebleCama = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.25, 0]} castShadow receiveShadow><boxGeometry args={[1.4, 0.4, 1.9]} /><meshStandardMaterial color="#ffffff" roughness={0.1} /></mesh>
    <mesh position={[0, 0.5, -0.9]} castShadow receiveShadow><boxGeometry args={[1.5, 1, 0.1]} /><meshStandardMaterial color="#8B5A2B" roughness={0.8} /></mesh>
  </group>
);

const MuebleBano = ({ position }) => (
  <group position={position}>
    <mesh position={[0, 0.4, -0.6]} castShadow receiveShadow><boxGeometry args={[0.5, 0.8, 0.6]} /><meshStandardMaterial color="#ffffff" roughness={0.1} /></mesh>
    <mesh position={[0, 0.05, 0]} receiveShadow><boxGeometry args={[0.8, 0.1, 0.8]} /><meshStandardMaterial color="#A9BACD" /></mesh>
  </group>
);

// Diccionario de Materiales Arquitectónicos
const MATERIALS = {
  Pieza: { floor: '#4A3B2C', wall: '#F5F5F5' }, 
  Baño: { floor: '#A9BACD', wall: '#E8F6F3' },   
  Pasillo: { floor: '#D3D3D3', wall: '#F0F0F0' },
  Puerta: { frame: '#5C4033', leaf: '#8B5A2B' },
  Ventana: { frame: '#333333', glass: '#85C1E9' },
  Pilar: { wood: '#A0522D' },
  Techo: { zinc: '#4A5568' }
};

// ==========================================
// 2. EL MOTOR DE ENSAMBLAJE Y GEOMETRÍA 3D
// ==========================================

const Room3D = ({ id, type, position, rotation, size, isSelected, onClick, onPositionChange, setOrbitEnabled }) => {
  const groupRef = useRef();
  const [w, h, d] = size; 
  const mat = MATERIALS[type] || MATERIALS.Pieza;
  const wallThickness = 0.2;
  const wallHeight = 2.5;

  return (
    <>
      {isSelected && (
        <TransformControls 
          object={groupRef} mode="translate" showY={false} translationSnap={0.5}
          onDraggingChanged={(e) => setOrbitEnabled(!e.value)} 
          onMouseUp={() => {
            if (groupRef.current) {
              onPositionChange(id, [
                Math.round(groupRef.current.position.x * 2) / 2, 0,
                Math.round(groupRef.current.position.z * 2) / 2
              ]);
            }
          }}
        />
      )}
      
      <group ref={groupRef} position={position} rotation={[0, rotation, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        
        {/* HABITACIONES HABITABLES */}
        {['Pieza', 'Baño', 'Pasillo'].includes(type) && (
          <>
            <mesh receiveShadow position={[0, 0.05, 0]}>
              <boxGeometry args={[w, 0.1, d]} />
              <meshStandardMaterial color={isSelected ? '#FFCF40' : mat.floor} roughness={0.3} />
            </mesh>
            <mesh castShadow receiveShadow position={[0, wallHeight/2, -d/2 + wallThickness/2]}><boxGeometry args={[w, wallHeight, wallThickness]} /><meshStandardMaterial color={mat.wall} /></mesh>
            <mesh castShadow receiveShadow position={[0, wallHeight/2, d/2 - wallThickness/2]}><boxGeometry args={[w, wallHeight, wallThickness]} /><meshStandardMaterial color={mat.wall} /></mesh>
            <mesh castShadow receiveShadow position={[w/2 - wallThickness/2, wallHeight/2, 0]}><boxGeometry args={[wallThickness, wallHeight, d - (wallThickness*2)]} /><meshStandardMaterial color={mat.wall} /></mesh>
            <mesh castShadow receiveShadow position={[-w/2 + wallThickness/2, wallHeight/2, 0]}><boxGeometry args={[wallThickness, wallHeight, d - (wallThickness*2)]} /><meshStandardMaterial color={mat.wall} /></mesh>
            
            {type === 'Pieza' && <MuebleCama position={[0, 0.1, 0]} />}
            {type === 'Baño' && <MuebleBano position={[0, 0.1, 0]} />}
          </>
        )}

        {/* PUERTA ABIERTA */}
        {type === 'Puerta' && (
          <group position={[0, 1.05, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[0.9, 2.1, 0.3]} /><meshStandardMaterial color={isSelected ? '#FFCF40' : mat.frame} /></mesh>
            <mesh position={[-0.4, 0, 0.4]} rotation={[0, Math.PI / 4, 0]} castShadow>
              <boxGeometry args={[0.8, 2.0, 0.05]} />
              <meshStandardMaterial color={mat.leaf} roughness={0.9} />
            </mesh>
          </group>
        )}

        {/* VENTANAL PANORÁMICO */}
        {type === 'Ventana' && (
          <group position={[0, 1.25, 0]}>
            <mesh castShadow receiveShadow><boxGeometry args={[1.5, 1.5, 0.3]} /><meshStandardMaterial color={isSelected ? '#FFCF40' : mat.frame} /></mesh>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1.4, 1.4, 0.1]} />
              <meshStandardMaterial color={mat.glass} transparent opacity={0.6} roughness={0.1} metalness={0.8} />
            </mesh>
          </group>
        )}

        {/* PILAR ESTRUCTURAL */}
        {type === 'Pilar 4x4' && (
          <mesh castShadow receiveShadow position={[0, wallHeight/2, 0]}>
            <boxGeometry args={[0.1, wallHeight, 0.1]} />
            <meshStandardMaterial color={isSelected ? '#FFCF40' : mat.wood} roughness={0.8} />
          </mesh>
        )}

        {/* TECHUMBRES ESTRUCTURALES (Geometría IA) */}
        {type === 'Techo 1 Agua' && (
          <group position={[0, wallHeight + (w * 0.1), 0]}>
            <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/16]} castShadow>
              <boxGeometry args={[w + 0.6, 0.1, d + 0.6]} />
              <meshStandardMaterial color={isSelected ? '#FFCF40' : MATERIALS.Techo.zinc} roughness={0.7} />
            </mesh>
          </group>
        )}

        {type === 'Techo 2 Aguas' && (
          <group position={[0, wallHeight + (w * 0.15), 0]}>
            {/* Agua Izquierda */}
            <mesh position={[-w/4, 0, 0]} rotation={[0, 0, Math.PI/8]} castShadow>
              <boxGeometry args={[w/1.9, 0.1, d + 0.6]} />
              <meshStandardMaterial color={isSelected ? '#FFCF40' : MATERIALS.Techo.zinc} roughness={0.7} />
            </mesh>
            {/* Agua Derecha */}
            <mesh position={[w/4, 0, 0]} rotation={[0, 0, -Math.PI/8]} castShadow>
              <boxGeometry args={[w/1.9, 0.1, d + 0.6]} />
              <meshStandardMaterial color={isSelected ? '#FFCF40' : MATERIALS.Techo.zinc} roughness={0.7} />
            </mesh>
          </group>
        )}

      </group>
    </>
  );
};

// ==========================================
// 3. LA APLICACIÓN PRINCIPAL (ESTADO, MATEMÁTICA Y UI)
// ==========================================

export default function AdminBudgetBuilder() {
  const [clientName, setClientName] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState([]);

  // CÁLCULOS DINÁMICOS FINANCIEROS (Ignoramos aberturas para los metros base)
  const habitableRooms = rooms.filter(r => ['Pieza', 'Baño', 'Pasillo'].includes(r.type));
  const totalArea = habitableRooms.reduce((acc, r) => acc + (r.size[0] * r.size[2]), 0);
  const totalPerimeter = habitableRooms.reduce((acc, r) => acc + (r.size[0] * 2 + r.size[2] * 2), 0);
  
  // Parámetros de costo UF base
  const costPerM2 = 2.5; 
  const costPerML = 0.8; 
  
  // Costo adicional por techumbre (Aprox 1.2 UF por m2 de techo)
  const roofRooms = rooms.filter(r => r.type.includes('Techo'));
  const roofArea = roofRooms.reduce((acc, r) => acc + (r.size[0] * r.size[2]), 0);
  
  const totalBudgetUF = (totalArea * costPerM2) + (totalPerimeter * costPerML) + (roofArea * 1.2);

  // ACCIONES DE CREACIÓN 3D
  const addElement = (type) => {
    const offset = rooms.length * 2;
    let size = [4, 0, 4];
    if (type === 'Baño') size = [2, 0, 2];
    if (type === 'Pasillo') size = [2, 0, 4];
    if (type === 'Puerta') size = [0.9, 2.1, 0.3];
    if (type === 'Ventana') size = [1.5, 1.5, 0.3];
    if (type === 'Pilar 4x4') size = [0.1, 2.5, 0.1];
    if (type.includes('Techo')) size = [4, 0, 4];

    setRooms([...rooms, { 
      id: Date.now().toString(), 
      type, position: [offset, 0, offset], rotation: 0, size 
    }]);
  };

  const updateRoomPosition = (id, newPosition) => setRooms(rooms.map(r => r.id === id ? { ...r, position: newPosition } : r));
  const updateRoomSize = (id, newWidth, newDepth) => setRooms(rooms.map(r => r.id === id ? { ...r, size: [newWidth, 0, newDepth] } : r));
  const rotateElement = () => selectedRoomId && setRooms(rooms.map(r => r.id === selectedRoomId ? { ...r, rotation: r.rotation + (Math.PI / 2) } : r));
  const removeSelected = () => { setRooms(rooms.filter(r => r.id !== selectedRoomId)); setSelectedRoomId(null); };

  // GUARDADO EN FIREBASE
  const handleSaveToDatabase = async () => {
    if (!clientName || !projectAddress) return alert("Falta Cliente o Dirección.");
    if (rooms.length === 0) return alert("El lienzo está vacío.");
    setIsSaving(true);
    try {
      await addDoc(collection(db, 'budgets'), {
        clientName, projectAddress, totalArea, totalPerimeter, totalBudgetUF,
        rooms: rooms.map(r => ({ type: r.type, size: r.size, position: r.position })),
        status: 'Pendiente', createdAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      alert("Error al guardar presupuesto.");
    } finally { setIsSaving(false); }
  };

  // EXPORTAR EXCEL TÉCNICO
  const exportToExcel = () => {
    if (rooms.length === 0) return alert("Agrega al menos un recinto.");
    const headers = ['ID', 'Elemento', 'Ancho (m)', 'Largo (m)', 'Area (m2)', 'Perimetro (ml)', 'Costo Est. (UF)'];
    const rows = rooms.map((r, i) => {
      let cost = 0;
      if (['Pieza', 'Baño', 'Pasillo'].includes(r.type)) cost = ((r.size[0] * r.size[2]) * costPerM2) + ((r.size[0] * 2 + r.size[2] * 2) * costPerML);
      if (r.type.includes('Techo')) cost = (r.size[0] * r.size[2]) * 1.2;
      return [
        `R-${i+1}`, r.type, r.size[0].toFixed(2).replace('.', ','), r.size[2].toFixed(2).replace('.', ','),
        (r.size[0] * r.size[2]).toFixed(2).replace('.', ','), (r.size[0] * 2 + r.size[2] * 2).toFixed(2).replace('.', ','), cost.toFixed(2).replace('.', ',')
      ];
    });
    rows.push(['', '', '', '', '', '', '']);
    rows.push(['TOTALES', clientName || 'Sin Cliente', '', '', totalArea.toFixed(2).replace('.', ','), totalPerimeter.toFixed(2).replace('.', ','), totalBudgetUF.toFixed(2).replace('.', ',')]);
    
    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(";")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
    link.setAttribute("download", `HV_Presupuesto_${clientName.replace(/\s+/g, '_') || 'Nuevo'}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  // ESTADO Y VARIABLES DE LA SELECCIÓN
  const selectedElement = rooms.find(r => r.id === selectedRoomId);
  const isHabitable = selectedElement && ['Pieza', 'Baño', 'Pasillo'].includes(selectedElement.type);
  const isRoof = selectedElement && selectedElement.type.includes('Techo');

  // LÓGICA ESTRUCTURAL IA PARA TECHOS
  const getStructuralRecommendation = (spanWidth) => {
    if (spanWidth <= 3.5) return { type: "Cercha A (Simple)", desc: "Estructura estándar de pino 2x4.", color: "#2ECC71" };
    if (spanWidth <= 5.5) return { type: "Cercha Tijeral", desc: "Refuerzo diagonal necesario para la luz libre.", color: "#F39C12" };
    return { type: "Cercha W (Reforzada)", desc: "Exige doble placa dentada estructural.", color: "#E74C3C" };
  };

  return (
    <div style={{ padding: '40px', background: '#080808', minHeight: '100vh', fontFamily: 'Instrument Sans, sans-serif' }}>
      
      {/* Cabecera Corporativa */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFCF40', fontSize: '11px', fontWeight: '700', letterSpacing: '.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
          <Calculator size={14} /> Arquitectura Inteligente y Presupuestos
        </div>
        <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: '42px', color: '#fff', textTransform: 'uppercase', fontWeight: '900', lineHeight: '1' }}>
          Motor BIM <em style={{ fontStyle: 'italic', color: '#FFCF40' }}>HV Construcción</em>
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '30px', alignItems: 'start' }}>
        
        {/* COLUMNA IZQUIERDA: Formulario y Lienzo 3D */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#111', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Cliente / Proyecto</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#666" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Ej: Ampliación Familia Pérez" style={{ width: '100%', background: '#0C0C0C', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 14px 12px 40px', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: '#888', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>Dirección de la Obra</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="#666" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                <input type="text" value={projectAddress} onChange={(e) => setProjectAddress(e.target.value)} placeholder="Ej: Av. Pajaritos 1234, Maipú" style={{ width: '100%', background: '#0C0C0C', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 14px 12px 40px', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Área del Visor 3D y Botonera */}
          <div style={{ background: '#111', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#141414', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              
              {/* Botonera de Recintos */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#888', fontWeight: '800', width: '70px' }}>RECINTOS:</span>
                {['Pieza', 'Baño', 'Pasillo'].map(type => (
                  <button key={type} onClick={() => addElement(type)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'rgba(255,207,64,0.1)', color: '#FFCF40', fontWeight: '700', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}>
                    <Plus size={14} /> {type}
                  </button>
                ))}
              </div>

              {/* Botonera de Estructura y Aberturas */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', color: '#888', fontWeight: '800', width: '70px' }}>ESTRUCTURA:</span>
                {['Puerta', 'Ventana', 'Pilar 4x4', 'Techo 1 Agua', 'Techo 2 Aguas'].map(type => (
                  <button key={type} onClick={() => addElement(type)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: 'none', background: 'rgba(255,255,255,0.05)', color: '#ccc', fontWeight: '700', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}>
                    <Plus size={14} /> {type}
                  </button>
                ))}
                
                {/* Indicador de Edición */}
                <div style={{ marginLeft: 'auto', fontSize: '11px', color: selectedRoomId ? '#FFCF40' : '#666', fontWeight: '700', letterSpacing: '.1em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BoxSelect size={14} color={selectedRoomId ? '#FFCF40' : '#666'} /> {selectedRoomId ? 'Edición Activa' : 'Vista General'}
                </div>
              </div>

            </div>

            {/* Lienzo Canvas 3D */}
            <div style={{ background: '#181818', height: '550px', position: 'relative' }}>
              <Canvas shadows camera={{ position: [0, 15, 12], fov: 45 }} onPointerMissed={() => setSelectedRoomId(null)}>
                <color attach="background" args={['#141414']} />
                <Suspense fallback={<PantallaCarga />}>
                  <ambientLight intensity={0.6} />
                  <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
                  <Environment preset="city" />
                  <Grid position={[0, -0.01, 0]} args={[50, 50]} cellSize={0.5} cellThickness={1} cellColor="#333" sectionSize={5} sectionThickness={1.5} sectionColor="#555" fadeDistance={30} />
                  
                  <group position={[0, 0, 0]}>
                    {rooms.map((room) => (
                      <Room3D 
                        key={room.id} id={room.id} type={room.type} position={room.position} rotation={room.rotation} size={room.size}
                        isSelected={selectedRoomId === room.id} onClick={() => setSelectedRoomId(room.id)}
                        onPositionChange={updateRoomPosition} setOrbitEnabled={setOrbitEnabled}
                      />
                    ))}
                  </group>
                </Suspense>
                <OrbitControls makeDefault enabled={orbitEnabled} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enableDamping />
              </Canvas>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: Resumen Financiero y Paramétrico */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#141414', padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,207,64,0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '700' }}>Superficie Radier</div>
                <div style={{ fontSize: '28px', fontFamily: 'Barlow Condensed', fontWeight: '900', color: '#fff' }}>{totalArea.toFixed(1)} <span style={{fontSize:'16px'}}>m²</span></div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#666', textTransform: 'uppercase', fontWeight: '700' }}>Muros Lineales</div>
                <div style={{ fontSize: '28px', fontFamily: 'Barlow Condensed', fontWeight: '900', color: '#fff' }}>{totalPerimeter.toFixed(1)} <span style={{fontSize:'16px'}}>ml</span></div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
              <div style={{ fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>Costo Proyectado Obra Gruesa</div>
              <div style={{ fontSize: '48px', fontFamily: 'Barlow Condensed', fontWeight: '900', color: '#2ECC71', lineHeight: '1' }}>
                {totalBudgetUF.toFixed(1)} <span style={{fontSize:'20px'}}>UF</span>
              </div>
            </div>
          </div>

          {/* CONTROLES PARAMÉTRICOS Y LÓGICA ESTRUCTURAL */}
          {selectedElement ? (
            <div style={{ background: 'rgba(255,207,64,0.1)', border: '1px solid #FFCF40', borderRadius: '16px', padding: '20px', animation: 'fadeIn 0.2s' }}>
              <h3 style={{ fontSize: '14px', color: '#FFCF40', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Maximize2 size={16} /> Ajustes: {selectedElement.type}
              </h3>
              
              <button onClick={rotateElement} style={{ width: '100%', marginBottom: '16px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                <RotateCw size={14} /> Rotar Objeto 90°
              </button>

              {/* Controles de Sliders si es ajustable */}
              {(isHabitable || isRoof) && (
                <div style={{ padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '10px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                      <span>Luz Libre (Eje X)</span>
                      <span style={{ color: '#FFCF40' }}>{selectedElement.size[0].toFixed(1)} m</span>
                    </div>
                    <input type="range" min="1" max="15" step="0.5" value={selectedElement.size[0]} onChange={(e) => updateRoomSize(selectedElement.id, parseFloat(e.target.value), selectedElement.size[2])} style={{ width: '100%', accentColor: '#FFCF40', cursor: 'ew-resize' }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '8px' }}>
                      <span>Fondo (Eje Z)</span>
                      <span style={{ color: '#FFCF40' }}>{selectedElement.size[2].toFixed(1)} m</span>
                    </div>
                    <input type="range" min="1" max="15" step="0.5" value={selectedElement.size[2]} onChange={(e) => updateRoomSize(selectedElement.id, selectedElement.size[0], parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#FFCF40', cursor: 'ew-resize' }} />
                  </div>
                </div>
              )}

              {/* Lógica de Inteligencia Estructural para Techos */}
              {isRoof && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#181818', borderRadius: '10px', borderLeft: `4px solid ${getStructuralRecommendation(selectedElement.size[0]).color}` }}>
                  <div style={{ fontSize: '10px', color: '#888', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Tent size={12}/> Sugerencia de Ingeniería</div>
                  <div style={{ color: getStructuralRecommendation(selectedElement.size[0]).color, fontWeight: '900', fontSize: '14px', marginBottom: '2px' }}>
                    {getStructuralRecommendation(selectedElement.size[0]).type}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '11px', lineHeight: '1.4' }}>
                    {getStructuralRecommendation(selectedElement.size[0]).desc}
                  </div>
                </div>
              )}

              <button onClick={removeSelected} style={{ width: '100%', marginTop: '16px', background: '#E74C3C', border: 'none', color: '#fff', padding: '12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', fontSize: '12px' }}>
                <Trash2 size={16} /> Eliminar Elemento
              </button>
            </div>
          ) : (
            <div style={{ background: '#111', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center', color: '#555', fontSize: '12px' }}>
              Haz clic en cualquier elemento 3D para ajustar sus dimensiones y ver el análisis estructural.
            </div>
          )}

          {/* Botonera de Exportación Final */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            <button onClick={handleSaveToDatabase} disabled={isSaving || saveSuccess} style={{ width: '100%', padding: '16px', background: saveSuccess ? 'rgba(46, 204, 113, 0.1)' : '#111', color: saveSuccess ? '#2ECC71' : '#fff', border: saveSuccess ? '1px solid #2ECC71' : '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '.2s' }}>
              {isSaving ? <Loader2 size={18} className="spin" /> : saveSuccess ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {isSaving ? 'Guardando...' : saveSuccess ? 'Presupuesto Creado' : 'Guardar Cotización Oficial'}
            </button>
            <button onClick={exportToExcel} style={{ width: '100%', padding: '16px', background: '#FFCF40', color: '#0C0C0C', borderRadius: '14px', border: 'none', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'transform .2s' }}>
              <FileText size={18} /> Extraer Excel Técnico
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}