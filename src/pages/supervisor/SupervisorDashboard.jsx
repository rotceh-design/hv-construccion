import React from 'react';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  Users, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Camera,
  HardHat
} from 'lucide-react';

const SupervisorDashboard = () => {
  // Datos simulados para el supervisor en terreno
  const supervisorZone = "Zona Centro-Sur (Quinta Normal / Maipú)";
  
  const pendingApprovals = [
    { 
      id: 1, 
      obra: 'OBRA-042 - Techumbre', 
      tarea: 'Plomada de Pilares 4x4"', 
      worker: 'Isaac (Maestro Primera)',
      time: 'Hace 15 min',
      aiStatus: 'Aprobado por IA (Desplome 1mm)',
      requiresManual: true
    },
    { 
      id: 2, 
      obra: 'OBRA-044 - Local Comercial', 
      tarea: 'Trazado de Tabiquería', 
      worker: 'Cesar (Maestro Carpintero)',
      time: 'Hace 45 min',
      aiStatus: 'Revisión Manual Sugerida',
      requiresManual: true
    }
  ];

  const teamOnSite = [
    { name: 'Isaac', role: 'Maestro Primera', status: 'Trabajando', location: 'OBRA-042' },
    { name: 'Natalia', role: 'Supervisora Calidad', status: 'En Inspección', location: 'OBRA-042' },
    { name: 'Mileyda', role: 'Ayudante Avanzada', status: 'Colación', location: 'OBRA-044' },
    { name: 'Cesar', role: 'Maestro Carpintero', status: 'Trabajando', location: 'OBRA-044' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Encabezado del Supervisor */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
            Panel de Inspección
          </h1>
          <p className="text-gray-600 mt-2 flex items-center gap-1">
            <MapPin size={16} /> {supervisorZone}
          </p>
        </div>
        <div className="hidden md:block bg-dark text-white px-4 py-2 rounded-lg text-sm font-bold">
          <span className="text-primary">4</span> Obras Activas Hoy
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: Tareas Pendientes de Aprobación */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-light flex justify-between items-center">
              <h2 className="font-bold text-dark text-lg flex items-center gap-2">
                <ClipboardCheck className="text-primary" size={24} /> 
                Aprobaciones Pendientes (Puntos Críticos)
              </h2>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingApprovals.length} Pendientes
              </span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-500">{item.obra}</span>
                        <span className="text-xs text-gray-400">• {item.time}</span>
                      </div>
                      <h3 className="font-bold text-dark text-lg">{item.tarea}</h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <HardHat size={14} /> Ejecutado por: {item.worker}
                      </p>
                      
                      <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${
                        item.aiStatus.includes('Aprobado') ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {item.aiStatus.includes('Aprobado') ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                        {item.aiStatus}
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                      <button className="flex-1 md:flex-none bg-gray-100 text-dark p-3 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2 font-bold text-sm transition-colors">
                        <Camera size={18} /> Ver Evidencia
                      </button>
                      <button className="flex-1 md:flex-none bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 flex items-center justify-center font-bold text-sm transition-colors shadow-sm">
                        Aprobar Etapa
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: Control de Cuadrilla */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-dark text-white rounded-xl shadow-md border-t-4 border-t-primary overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-hazard-stripes"></div>
            
            <div className="p-5 border-b border-gray-700 mt-1">
              <h2 className="font-bold text-lg text-primary flex items-center gap-2">
                <Users size={20} /> Cuadrillas en Terreno
              </h2>
            </div>
            
            <div className="p-4 space-y-3">
              {teamOnSite.map((worker, index) => (
                <div key={index} className="bg-dark-light p-3 rounded-lg border border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {worker.name.charAt(0)}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-white leading-tight">{worker.name}</p>
                       <p className="text-xs text-gray-400">{worker.role}</p>
                     </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                      worker.status === 'Trabajando' ? 'bg-green-900/50 text-green-400 border border-green-800' :
                      worker.status === 'Colación' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' :
                      'bg-blue-900/50 text-blue-400 border border-blue-800'
                    }`}>
                      {worker.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{worker.location}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-700 bg-black/20">
               <button className="w-full text-sm text-dark bg-primary font-bold py-2 rounded hover:bg-yellow-500 transition-colors">
                 Reportar Incidencia (SSOMA)
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;