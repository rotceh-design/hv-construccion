import React from 'react';
import { 
  HardHat, DollarSign, Users, AlertTriangle, 
  TrendingUp, Clock, ArrowRight, CheckCircle2 
} from 'lucide-react';

const Dashboard = () => {
  // Datos de prueba simulando la base de datos
  const stats = [
    { title: 'Obras Activas', value: '4', icon: <HardHat size={24} className="text-primary" />, trend: '+1 este mes' },
    { title: 'Facturación Mensual', value: '$12.4M', icon: <DollarSign size={24} className="text-green-500" />, trend: '+15% vs mes anterior' },
    { title: 'Personal en Terreno', value: '12', icon: <Users size={24} className="text-blue-500" />, trend: '3 cuadrillas operativas' },
    { title: 'Alertas de Calidad', value: '2', icon: <AlertTriangle size={24} className="text-red-500" />, trend: 'Requieren revisión hoy' },
  ];

  const activeProjects = [
    { id: 'OBRA-042', client: 'Familia Pérez', type: 'Techumbre Exterior', progress: 75, status: 'En tiempo', date: 'Termina en 2 días' },
    { id: 'OBRA-043', client: 'Constructora SUR', type: 'Radier 100m2', progress: 30, status: 'Atrasado', date: 'Retraso de 1 día' },
    { id: 'OBRA-044', client: 'Local Comercial', type: 'Tabiquería', progress: 10, status: 'En tiempo', date: 'Iniciado hoy' },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Saludo y Fecha */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
            Resumen General
          </h1>
          <p className="text-gray-600 mt-2">Bienvenido al centro de control operativo de HV Construcción.</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-500 uppercase">Mes Actual</p>
          <p className="text-xl font-bold text-dark">Abril 2026</p>
        </div>
      </div>

      {/* Tarjetas de Métricas (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between hover:border-primary transition-colors cursor-default">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-gray-500">{stat.title}</p>
                <h3 className="text-3xl font-display font-bold text-dark mt-1">{stat.value}</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <p className="text-xs text-gray-400 font-semibold flex items-center gap-1">
              <TrendingUp size={14} /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Panel Izquierdo: Obras Activas */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-light">
            <h2 className="font-bold text-dark text-lg">Obras en Ejecución</h2>
            <button className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
              Ver todas <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {activeProjects.map((project, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary mt-1">
                    <HardHat size={20} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-400">{project.id}</span>
                    <h4 className="font-bold text-dark">{project.client}</h4>
                    <p className="text-sm text-gray-500">{project.type}</p>
                  </div>
                </div>
                
                <div className="flex-1 max-w-xs w-full">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-dark">Avance</span>
                    <span className="text-primary">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>

                <div className="text-right min-w-[120px]">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    project.status === 'En tiempo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {project.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-2 flex items-center justify-end gap-1">
                    <Clock size={12} /> {project.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Feed de Actividad IA / Alertas */}
        <div className="bg-dark text-white rounded-xl shadow-sm border-t-4 border-t-primary overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-2 bg-hazard-stripes"></div>
          <div className="p-4 border-b border-gray-700 mt-1">
            <h2 className="font-bold text-lg text-primary">Monitoreo de Terreno</h2>
          </div>
          
          <div className="p-4 space-y-4 flex-1">
            <div className="bg-dark-light p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-red-400 mb-1">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold">ALERTA DE CALIDAD</span>
              </div>
              <p className="text-sm text-gray-300">La IA detectó una desviación de 5mm en la plomada del pilar 2 (OBRA-042). Revisión sugerida.</p>
              <span className="text-xs text-gray-500 mt-2 block">Hace 10 min - Reporte del Trabajador</span>
            </div>

            <div className="bg-dark-light p-3 rounded-lg border border-gray-700">
              <div className="flex items-center gap-2 text-green-400 mb-1">
                <CheckCircle2 size={16} />
                <span className="text-xs font-bold">ETAPA APROBADA</span>
              </div>
              <p className="text-sm text-gray-300">Supervisor aprobó el trazado y nivelación de la obra Tabiquería Comercial.</p>
              <span className="text-xs text-gray-500 mt-2 block">Hace 1 hora</span>
            </div>
          </div>
          
          <div className="p-4 bg-dark-light border-t border-gray-700">
             <button className="w-full text-sm text-dark bg-primary font-bold py-2 rounded hover:bg-yellow-500 transition-colors">
               Ver todas las notificaciones
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;