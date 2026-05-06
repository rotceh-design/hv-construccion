import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  ClipboardEdit, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  MapPin,
  Clock
} from 'lucide-react';

const WorkerDashboard = () => {
  // Datos simulados del trabajador logueado (ej: Isaac, Maestro Primera)
  const currentProject = {
    id: 'OBRA-042',
    name: 'Techumbre Familia Pérez',
    location: 'Quinta Normal, RM',
    stage: 'Día 2: Emparrillado y Tijerales',
    startTime: '08:00 AM'
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto">
      
      {/* Tarjeta de Obra Asignada */}
      <div className="bg-dark text-white rounded-2xl shadow-lg overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-hazard-stripes"></div>
        <div className="p-5 mt-1">
          <div className="flex justify-between items-start mb-2">
            <span className="bg-primary text-dark text-xs font-bold px-2 py-1 rounded">OBRA ACTUAL</span>
            <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> En Curso
            </span>
          </div>
          
          <h2 className="text-xl font-display font-bold mb-1">{currentProject.name}</h2>
          <p className="text-gray-300 text-sm flex items-center gap-1 mb-4">
            <MapPin size={14} /> {currentProject.location}
          </p>
          
          <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-400">Etapa de Hoy</p>
              <p className="font-bold text-sm">{currentProject.stage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Inicio de Turno</p>
              <p className="font-bold text-sm flex items-center gap-1"><Clock size={14} className="text-primary"/> {currentProject.startTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción Rápida (Gigantes para la obra) */}
      <div className="grid grid-cols-2 gap-4">
        <Link 
          to="/worker/parte-diario" 
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
            <ClipboardEdit size={28} />
          </div>
          <span className="font-bold text-dark text-sm text-center">Parte Diario</span>
        </Link>

        <Link 
          to="/worker/subir-foto" 
          className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
            <Camera size={28} />
          </div>
          <span className="font-bold text-dark text-sm text-center">Subir Avance</span>
        </Link>
      </div>

      {/* Botón Libro de Vida (Ancho completo) */}
      <Link 
        to="/worker/playbook" 
        className="bg-primary text-dark p-4 rounded-2xl shadow-md flex items-center justify-between active:scale-95 transition-transform"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="font-bold">Libro de Vida</h3>
            <p className="text-xs opacity-80">Ver planos y paso a paso</p>
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-dark text-primary flex items-center justify-center">
          →
        </div>
      </Link>

      {/* Alertas o Notificaciones */}
      <div className="mt-2">
        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 pl-1">Mensajes del Supervisor</h3>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 mb-3">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-bold text-red-700">Revisión de Tolerancia</h4>
            <p className="text-xs text-red-600 mt-1">Asegurar plomada exacta en los pilares perimetrales antes de hormigonar poyos.</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
          <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
          <div>
            <h4 className="text-sm font-bold text-green-700">Materiales Recibidos</h4>
            <p className="text-xs text-green-600 mt-1">Llegaron las planchas de Zinc Alum. Firma la guía de despacho.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default WorkerDashboard;