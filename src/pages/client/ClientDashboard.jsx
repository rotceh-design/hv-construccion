import React from 'react';
import { 
  Home, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Camera, 
  FileText, 
  Download,
  AlertCircle
} from 'lucide-react';

const ClientDashboard = () => {
  // Datos simulados del cliente logueado
  const clientProject = {
    id: 'OBRA-042',
    name: 'Techumbre Exterior y Terraza',
    progress: 25,
    startDate: '25 Abril 2026',
    estEndDate: '30 Abril 2026',
    status: 'En Ejecución - A tiempo'
  };

  const recentUpdates = [
    { id: 1, date: 'Hoy, 10:30 AM', title: 'Avance Aprobado: Pilares y Vigas', type: 'photo', desc: 'Se instalaron los pilares de 4x4 y vigas maestras. Todo nivelado y plomado según normativa.' },
    { id: 2, date: 'Ayer, 16:00 PM', title: 'Trazado y Excavación', type: 'milestone', desc: 'Se completaron los poyos de hormigón para las fundaciones.' },
    { id: 3, date: '25 Abr, 09:00 AM', title: 'Inicio de Obra', type: 'milestone', desc: 'Llegada de materiales y equipo a terreno.' },
  ];

  return (
    <div className="flex flex-col gap-8">
      
      {/* Saludo de Bienvenida */}
      <div>
        <h1 className="text-3xl font-display font-bold text-dark">Bienvenido, Familia Pérez</h1>
        <p className="text-gray-600 mt-1">Aquí puedes monitorear el avance en tiempo real de tu proyecto.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PANEL IZQUIERDO: Resumen del Proyecto (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Tarjeta Principal de Avance */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-2 inline-block">
                    {clientProject.id}
                  </span>
                  <h2 className="text-2xl font-bold text-dark flex items-center gap-2">
                    <Home className="text-primary" size={24} /> {clientProject.name}
                  </h2>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <CheckCircle2 size={16} /> {clientProject.status}
                </span>
              </div>

              {/* Barra de Progreso General */}
              <div className="mb-6">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-600">Avance Total de la Obra</span>
                  <span className="text-primary text-xl">{clientProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className="bg-primary h-3 rounded-full transition-all duration-1000" style={{ width: `${clientProject.progress}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Inicio</p>
                    <p className="font-semibold text-dark">{clientProject.startDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Entrega Estimada</p>
                    <p className="font-semibold text-dark">{clientProject.estEndDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline de Avances (Fotografías y Reportes) */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-dark mb-6 border-b border-gray-100 pb-2">Últimas Actualizaciones en Terreno</h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              
              {recentUpdates.map((update, index) => (
                <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Icono del Timeline */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-primary text-dark shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    {update.type === 'photo' ? <Camera size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  
                  {/* Tarjeta de Contenido */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-dark text-sm">{update.title}</h4>
                      <time className="text-xs font-semibold text-gray-400">{update.date}</time>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{update.desc}</p>
                    
                    {update.type === 'photo' && (
                      <div className="bg-gray-100 h-32 rounded-lg flex items-center justify-center text-gray-400 text-xs border border-gray-200 border-dashed">
                        [Fotografía del Trabajador]
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: Finanzas y Documentos */}
        <div className="space-y-6">
          
          {/* Tarjeta de Estado de Pagos */}
          <div className="bg-dark text-white rounded-2xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-0"></div>
            
            <h3 className="text-lg font-bold flex items-center gap-2 mb-6 relative z-10">
              <FileText className="text-primary" size={20} /> Estado de Pagos
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-white/10 p-4 rounded-xl border border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-300">Total Presupuesto</span>
                  <span className="font-bold">$1.845.000</span>
                </div>
                <div className="flex justify-between items-center mb-1 text-green-400">
                  <span className="text-sm">Abonado (Anticipo 30%)</span>
                  <span className="font-bold">-$553.500</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-gray-600">
                  <span className="text-sm font-bold text-primary">Saldo Pendiente</span>
                  <span className="font-bold text-xl text-primary">$1.291.500</span>
                </div>
              </div>

              <div className="bg-blue-900/40 border border-blue-800 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-sm font-bold text-blue-300">Próximo Pago Estimado</h4>
                  <p className="text-xs text-blue-200 mt-1">El estado de pago #2 (30%) se emitirá al finalizar la estructura principal de la techumbre.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Documentos Legales */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
             <h3 className="text-lg font-bold text-dark mb-4 border-b border-gray-100 pb-2">Documentos de la Obra</h3>
             
             <div className="space-y-3">
               <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-light transition-colors group">
                 <div className="flex items-center gap-3">
                   <FileText size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                   <span className="text-sm font-semibold text-gray-700">Contrato de Servicios.pdf</span>
                 </div>
                 <Download size={16} className="text-gray-400" />
               </button>

               <button className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-light transition-colors group">
                 <div className="flex items-center gap-3">
                   <FileText size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                   <span className="text-sm font-semibold text-gray-700">Presupuesto Detallado.pdf</span>
                 </div>
                 <Download size={16} className="text-gray-400" />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;