import React, { useState, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  OrbitControls, Environment, TransformControls, 
  Grid, useProgress, Html, useGLTF 
} from '@react-three/drei';
import { Plus, Trash2, BoxSelect, Loader2 } from 'lucide-react';

// --- PANTALLA DE CARGA CORPORATIVA ---
function PantallaCarga() {
  const { progress } = useProgress(); // Lee el % real de carga de texturas y modelos
  
  return (
    <Html center>
      <div style={{ 
        background: 'rgba(12, 12, 12, 0.95)', padding: '40px', borderRadius: '20px', 
        border: '1px solid rgba(255, 207, 64, 0.3)', textAlign: 'center', width: '320px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <Loader2 size={32} color="#FFCF40" className="spin" style={{ animation: 'spin 1s linear infinite' }}/>
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', margin: '0 0 5px 0', fontSize: '32px', color: '#fff', textTransform: 'uppercase' }}>
          HV <span style={{ color: '#FFCF40' }}>Construcción</span>
        </h2>
        <p style={{ fontSize: '11px', color: '#888', letterSpacing: '.15em', textTransform: 'uppercase', margin: 0 }}>
          Cargando Motor 3D Arquitectónico...
        </p>
        
        {/* Barra de progreso visual */}
        <div style={{ width: '100%', background: '#222', height: '4px', borderRadius: '2px', marginTop: '24px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, background: '#FFCF40', height: '100%', transition: 'width 0.3s ease-out' }} />
        </div>
        <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '900', color: '#FFCF40', fontFamily: 'Barlow Condensed' }}>
          {progress.toFixed(0)}%
        </div>
      </div>
    </Html>
  );
}

// --- EJEMPLO DE CÓMO CARGAR UN MUEBLE REAL (.GLB) ---
const MuebleCama = ({ position }) => {
  // 💡 INSTRUCCIONES PARA CUANDO DESCARGUES TU MODELO 3D:
  // 1. Guarda tu archivo "cama.glb" en la carpeta "public/" de tu proyecto Vite.
  // 2. Descomenta las siguientes dos líneas y borra el <group> de abajo.
  //
  // const { scene } = useGLTF('/cama.glb');
  // return <primitive object={scene} position={position} scale={1} castShadow />

  // 🛠️ MIENTRAS TANTO: Dibujamos una "Cama Maqueta" con polígonos puros
  return (
    <group position={position}>
      {/* Colchón */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.4, 1.9]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* Respaldo */}
      <mesh position={[0, 0.5, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" roughness={0.8} />
      </mesh>
      {/* Almohada */}
      <mesh position={[0, 0.5, -0.6]} castShadow>
        <boxGeometry args={[0.8, 0.1, 0.4]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.5} />
      </mesh>
    </group>
  );
};

// --- CONFIGURACIÓN DE MATERIALES (Obra Gruesa) ---
const MATERIALS = {
  Pieza: { floor: '#4A3B2C', wall: '#F5F5F5' }, // Madera oscura
  Baño: { floor: '#A9BACD', wall: '#FFFFFF' },   // Cerámica clara
  Pasillo: { floor: '#D3D3D3', wall: '#F0F0F0' },// Piso flotante
};

// --- COMPONENTE: HABITACIÓN 3D INTERACTIVA ---
const Room3D = ({ id, type, position, size, isSelected, onClick, onPositionChange, setOrbitEnabled }) => {
  const groupRef = useRef();
  const [w, h, d] = size; 
  const mat = MATERIALS[type] || MATERIALS.Pieza;
  const wallThickness = 0.2;
  const wallHeight = 2.5;

  return (
    <>
      {isSelected && (
        <TransformControls 
          object={groupRef} 
          mode="translate" 
          showY={false} 
          translationSnap={0.5} // Precisión de medio metro
          onDraggingChanged={(e) => setOrbitEnabled(!e.value)} 
          onMouseUp={() => {
            if (groupRef.current) {
              onPositionChange(id, [
                Math.round(groupRef.current.position.x * 2) / 2, // Ajuste exacto
                0,
                Math.round(groupRef.current.position.z * 2) / 2
              ]);
            }
          }}
        />
      )}

      <group ref={groupRef} position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {/* PISO */}
        <mesh receiveShadow position={[0, 0.05, 0]}>
          <boxGeometry args={[w, 0.1, d]} />
          <meshStandardMaterial color={isSelected ? '#FFCF40' : mat.floor} roughness={0.3} metalness={0.1} />
        </mesh>

        {/* MUROS CON SOMBRAS */}
        <mesh castShadow receiveShadow position={[0, wallHeight/2, -d/2 + wallThickness/2]}>
          <boxGeometry args={[w, wallHeight, wallThickness]} />
          <meshStandardMaterial color={mat.wall} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, wallHeight/2, d/2 - wallThickness/2]}>
          <boxGeometry args={[w, wallHeight, wallThickness]} />
          <meshStandardMaterial color={mat.wall} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[w/2 - wallThickness/2, wallHeight/2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, d]} />
          <meshStandardMaterial color={mat.wall} roughness={1} />
        </mesh>
        <mesh castShadow receiveShadow position={[-w/2 + wallThickness/2, wallHeight/2, 0]}>
          <boxGeometry args={[wallThickness, wallHeight, d]} />
          <meshStandardMaterial color={mat.wall} roughness={1} />
        </mesh>

        {/* SI ES UNA PIEZA, RENDERIZAMOS EL MODELO DEL MUEBLE ADENTRO */}
        {type === 'Pieza' && <MuebleCama position={[0, 0.1, 0]} />}
      </group>
    </>
  );
};

// --- COMPONENTE PRINCIPAL ---
export default function FloorPlanner3D() {
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [rooms, setRooms] = useState([
    { id: '1', type: 'Pieza', position: [0, 0, 0], size: [4, 0, 4] }
  ]);

  const addRoom = (type) => {
    const offset = rooms.length * 2;
    const size = type === 'Baño' ? [2, 0, 2] : type === 'Pasillo' ? [2, 0, 4] : [4, 0, 4];
    setRooms([...rooms, { id: Date.now().toString(), type, position: [offset, 0, offset], size }]);
  };

  const updateRoomPosition = (id, newPosition) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, position: newPosition } : r));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', height: '80vh', background: '#0C0C0C', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,207,64,0.2)' }}>
      
      {/* VISOR 3D */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '8px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BoxSelect size={14} color="#FFCF40" /> Modo Edición Activo
        </div>
        
        <Canvas shadows camera={{ position: [0, 15, 10], fov: 45 }} onPointerMissed={() => setSelectedRoomId(null)}>
          <color attach="background" args={['#141414']} />
          
          {/* SUSPENSE ENVUELVE TODO LO QUE CARGA TEXTURAS/MODELOS */}
          <Suspense fallback={<PantallaCarga />}>
            <ambientLight intensity={0.6} />
            {/* LUZ PRINCIPAL SIMULANDO EL SOL CON SOMBRAS SUAVES */}
            <directionalLight castShadow position={[10, 20, 10]} intensity={1.5} shadow-mapSize={[2048, 2048]} shadow-bias={-0.0001} />
            <Environment preset="city" />

            <Grid position={[0, -0.01, 0]} args={[50, 50]} cellSize={1} cellThickness={1} cellColor="#333" sectionSize={5} sectionThickness={1.5} sectionColor="#555" fadeDistance={30} />

            <group position={[0, 0, 0]}>
              {rooms.map((room) => (
                <Room3D 
                  key={room.id} id={room.id} type={room.type} position={room.position} size={room.size}
                  isSelected={selectedRoomId === room.id} onClick={() => setSelectedRoomId(room.id)}
                  onPositionChange={updateRoomPosition} setOrbitEnabled={setOrbitEnabled}
                />
              ))}
            </group>
          </Suspense>

          <OrbitControls makeDefault enabled={orbitEnabled} minPolarAngle={0} maxPolarAngle={Math.PI / 2.1} enableDamping />
        </Canvas>
      </div>

      {/* PANEL DE CONTROL LATERAL */}
      <div style={{ background: '#111', padding: '24px', borderLeft: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '28px', color: '#fff', textTransform: 'uppercase', margin: 0 }}>Catálogo</h2>
          <p style={{ fontSize: '12px', color: '#888' }}>Agrega y arrastra módulos.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {['Pieza', 'Baño', 'Pasillo'].map(type => (
            <button 
              key={type} onClick={() => addRoom(type)}
              style={{ background: '#181818', border: '1px solid rgba(255,207,64,0.3)', color: '#FFCF40', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px', textTransform: 'uppercase', transition: '.2s' }}
            >
              <Plus size={14} style={{ marginBottom: '4px' }} /> <br/> {type}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }}>
          {selectedRoomId && (
            <div style={{ background: 'rgba(255,207,64,0.1)', border: '1px solid #FFCF40', borderRadius: '10px', padding: '16px', marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', color: '#FFCF40', margin: '0 0 10px 0' }}>Módulo Seleccionado</h3>
              <p style={{ fontSize: '11px', color: '#ccc', margin: '0 0 16px 0', lineHeight: '1.4' }}>Usa las flechas roja y azul para mover la pieza.</p>
              <button 
                onClick={() => { setRooms(rooms.filter(r => r.id !== selectedRoomId)); setSelectedRoomId(null); }}
                style={{ width: '100%', background: '#E74C3C', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold' }}>
                <Trash2 size={16} /> Eliminar Módulo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}