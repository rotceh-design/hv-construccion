import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, MapPin, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { db } from '../../firebase'; // Tu ruta a firebase
// import { storage } from '../../firebase'; // Descomenta cuando configures Firebase Storage
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PhotoUpload() {
  const [selectedProject, setSelectedProject] = useState('');
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  // Proyectos mockeados (esto luego vendrá de tu base de datos)
  const activeProjects = [
    { id: '1', name: 'Techo Exterior Pilares 4x4', location: 'Maipú' },
    { id: '2', name: 'Ampliación 2do Piso', location: 'Providencia' }
  ];

  const handleCaptureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      // Crear URL temporal para previsualización
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearPhoto = () => {
    setPhoto(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = async () => {
    if (!selectedProject || !photo) return alert('Falta seleccionar proyecto o tomar la foto.');
    
    setIsUploading(true);
    
    try {
      // AQUÍ VA LA LÓGICA REAL DE FIREBASE STORAGE (Comentada para que no rompa si no está configurado aún)
      /*
      const imageRef = ref(storage, `obras/${selectedProject}/${Date.now()}_${photo.name}`);
      const snapshot = await uploadBytes(imageRef, photo);
      const downloadURL = await getDownloadURL(snapshot.ref);
      */
      
      // Simulamos la subida de la imagen y obtenemos una URL mock
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      const mockDownloadURL = previewUrl; 

      // Guardamos el registro en Firestore
      await addDoc(collection(db, 'daily_logs'), {
        projectId: selectedProject,
        imageUrl: mockDownloadURL,
        description: description,
        uploadedBy: 'Maestro Responsable', // Esto vendrá del AuthContext
        timestamp: serverTimestamp()
      });

      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        clearPhoto();
        setDescription('');
        setSelectedProject('');
      }, 3000);

    } catch (error) {
      console.error("Error subiendo reporte:", error);
      alert('Hubo un problema al subir la foto.');
    } finally {
      setIsUploading(false);
    }
  };

  if (uploadSuccess) {
    return (
      <div style={{ background: '#0C0C0C', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#fff' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46, 204, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <CheckCircle2 size={40} color="#2ECC71" />
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed', fontSize: '32px', textTransform: 'uppercase', marginBottom: '10px' }}>¡Reporte Subido!</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>La bitácora de obra se ha actualizado correctamente.</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#0C0C0C', minHeight: '100vh', padding: '20px', paddingBottom: '100px', color: '#fff', fontFamily: 'Instrument Sans, sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      
      {/* Header Mobile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', marginTop: '10px' }}>
        <div style={{ width: '40px', height: '40px', background: '#FFCF40', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Camera size={20} color="#0C0C0C" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'Barlow Condensed', fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1' }}>Reporte de Terreno</h1>
          <span style={{ fontSize: '11px', color: '#888', fontWeight: '700', letterSpacing: '.05em' }}>BITÁCORA DIARIA</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Selector de Proyecto */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>1. Seleccionar Obra</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={16} color="#FFCF40" style={{ position: 'absolute', left: '14px', top: '16px' }} />
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{ width: '100%', appearance: 'none', background: '#141414', border: '1px solid rgba(255,207,64,0.3)', color: '#fff', padding: '14px 14px 14px 40px', borderRadius: '12px', fontSize: '14px', outline: 'none', fontWeight: '600' }}
            >
              <option value="" disabled>Elige la obra activa...</option>
              {activeProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name} - {p.location}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Zona de Captura (Cámara) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>2. Evidencia Fotográfica</label>
          
          {!previewUrl ? (
            <button 
              onClick={handleCaptureClick}
              style={{ width: '100%', height: '200px', background: '#111', border: '2px dashed rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'pointer', transition: 'all .2s' }}
            >
              <div style={{ width: '50px', height: '50px', background: 'rgba(255,207,64,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={24} color="#FFCF40" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#fff' }}>Abrir Cámara</span>
                <span style={{ fontSize: '11px', color: '#666' }}>Toma una foto del avance</span>
              </div>
            </button>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '250px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,207,64,0.4)' }}>
              <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button 
                onClick={clearPhoto}
                style={{ position: 'absolute', top: '10px', right: '10px', width: '36px', height: '36px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
              >
                <X size={18} />
              </button>
            </div>
          )}

          {/* Input Oculto que lanza la cámara en móviles */}
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
        </div>

        {/* Detalles / Comentarios */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px' }}>3. Descripción del Avance</label>
          <textarea 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej: Pilares de 4x4 instalados y plomados..."
            rows="3"
            style={{ width: '100%', background: '#141414', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '14px', outline: 'none', resize: 'none' }}
          />
        </div>

      </div>

      {/* Botón Flotante Subir */}
      <div style={{ position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)', width: 'calc(100% - 40px)', maxWidth: '460px', zIndex: 100 }}>
        <button 
          onClick={handleUpload}
          disabled={isUploading || !photo || !selectedProject}
          style={{ width: '100%', padding: '18px', background: (!photo || !selectedProject) ? '#222' : '#FFCF40', color: (!photo || !selectedProject) ? '#666' : '#0C0C0C', borderRadius: '16px', border: 'none', fontWeight: '800', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '.05em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', transition: '.2s' }}
        >
          {isUploading ? <Loader2 size={20} className="spin" /> : <Upload size={20} />}
          {isUploading ? 'Sincronizando...' : 'Subir a Bitácora'}
        </button>
      </div>

    </div>
  );
}