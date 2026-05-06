import React from 'react';
import { MapPin, HardHat, AlertTriangle, CheckCircle2, Clock, Eye, BarChart2 } from 'lucide-react';

const SupervisorWorks = () => {
  const activeWorks = [
    {
      id: 'OBRA-042',
      name: 'Techumbre Familia Pérez',
      location: 'Quinta Normal',
      progress: 35,
      status: 'En tiempo',
      workersCount: 2,
      criticalPath: 'Emparrillado y Tijerales',
      alert: null
    },
    {
      id: 'OBRA-044',
      name: 'Ampliación Local Comercial',
      location: 'Maipú',
      progress: 15,
      status: 'Atención',
      workersCount: 2,
      criticalPath: 'Trazado y Tabiquería',
      alert: 'Retraso en entrega de perfiles Metalcon'
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
          Visión de Obras en Terreno
        </h1>
        <p className="text-gray-600 mt-2">Monitoreo de avance físico y distribución de cuadrillas.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeWorks.map((obra) => (
          <div key={obra.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className={`p-4 border-b flex justify-between items-center ${
              obra.status === 'En tiempo' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
            }`}>
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase">{obra.id}</span>
                <h3 className="font-bold text-dark text-lg">{obra.name}</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                obra.status === 'En tiempo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {obra.status === 'En tiempo' ? <CheckCircle2 size={14}/> : <AlertTriangle size={14}/>}
                {obra.status}
              </span>
            </div>

            <div className="p-5">
              <div className="flex justify-between text-sm mb-4">
                <span className="flex items-center gap-1 text-gray-600"><MapPin size={16}/> {obra.location}</span>
                <span className="flex items-center gap-1 text-gray-600"><HardHat size={16}/> {obra.workersCount} en terreno</span>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-gray-600">Avance Físico</span>
                  <span className="text-primary">{obra.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${obra.progress}%` }}></div>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Ruta Crítica Actual</p>
                <p className="text-sm font-semibold text-dark">{obra.criticalPath}</p>
              </div>

              {obra.alert && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-start gap-2 mb-4">
                  <AlertTriangle size={16} className="text-red-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-700 font-semibold">{obra.alert}</p>
                </div>
              )}

              <button className="w-full bg-dark text-white font-bold py-2 rounded-lg text-sm hover:bg-dark-light transition-colors flex justify-center items-center gap-2">
                <Eye size={16}/> Ver Detalle Técnico
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupervisorWorks;