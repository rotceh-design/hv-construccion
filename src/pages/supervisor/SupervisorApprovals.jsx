import React from 'react';
import { Camera, CheckCircle, XCircle, AlertCircle, Info, HardHat, FileSignature } from 'lucide-react';

const SupervisorApprovals = () => {
  const approvals = [
    { 
      id: 'REQ-089', 
      obra: 'OBRA-042 - Techumbre', 
      tarea: 'Plomada de Pilares 4x4"', 
      worker: 'Isaac',
      time: 'Hace 15 min',
      aiStatus: 'success',
      aiMessage: 'Nivelación correcta. Desplome inferior a 2mm. Madera corresponde a pino impregnado.',
      img: 'https://images.unsplash.com/photo-1590059132213-f9163eefd67d?auto=format&fit=crop&w=400&q=80'
    },
    { 
      id: 'REQ-090', 
      obra: 'OBRA-044 - Local Comercial', 
      tarea: 'Trazado de Tabiquería', 
      worker: 'Cesar',
      time: 'Hace 45 min',
      aiStatus: 'warning',
      aiMessage: 'Fijaciones inferiores no visibles claramente. Se requiere inspección visual o nueva fotografía.',
      img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
          Bandeja de Aprobaciones
        </h1>
        <p className="text-gray-600 mt-2">Control de calidad asistido por Inteligencia Artificial.</p>
      </div>

      <div className="space-y-6">
        {approvals.map((req) => (
          <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
            
            {/* Foto de Evidencia */}
            <div className="md:w-1/3 relative bg-gray-100 min-h-[200px]">
              <img src={req.img} alt="Evidencia" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1 backdrop-blur-sm">
                <Camera size={12}/> Evidencia Original
              </div>
            </div>

            {/* Detalles y Acciones */}
            <div className="p-6 md:w-2/3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-xs font-bold text-gray-500">{req.obra}</span>
                    <h2 className="text-xl font-bold text-dark">{req.tarea}</h2>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded">{req.time}</span>
                </div>
                
                <p className="text-sm text-gray-600 flex items-center gap-1 mb-4">
                  <HardHat size={16} className="text-primary"/> Reportado por: {req.worker}
                </p>

                {/* Reporte de la IA */}
                <div className={`p-3 rounded-lg border flex items-start gap-3 mb-6 ${
                  req.aiStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
                }`}>
                  {req.aiStatus === 'success' ? (
                    <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={18} />
                  ) : (
                    <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={18} />
                  )}
                  <div>
                    <p className={`text-xs font-bold uppercase ${req.aiStatus === 'success' ? 'text-green-700' : 'text-orange-700'}`}>
                      Análisis Gemini Vision
                    </p>
                    <p className={`text-sm ${req.aiStatus === 'success' ? 'text-green-800' : 'text-orange-800'}`}>
                      {req.aiMessage}
                    </p>
                  </div>
                </div>
              </div>

              {/* Botonera de Decisión */}
              <div className="flex gap-3">
                <button className="flex-1 bg-green-500 text-white font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-green-600 transition-colors shadow-sm">
                  <FileSignature size={18}/> Aprobar
                </button>
                <button className="flex-1 bg-red-50 text-red-600 border border-red-200 font-bold py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-red-100 transition-colors">
                  <XCircle size={18}/> Rechazar
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorApprovals;