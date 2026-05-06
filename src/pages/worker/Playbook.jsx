import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  AlertTriangle,
  Ruler,
  ShieldAlert
} from 'lucide-react';

const Playbook = () => {
  // Simulación de los datos traídos desde tu "Biblioteca Constructiva"
  const playbookData = {
    obra: 'OBRA-042 - Techumbre',
    partida: 'Instalación de Pilares 4x4"',
    progreso: 25, // Porcentaje completado
    pasos: [
      { 
        id: 1, 
        tarea: 'Trazado y Excavación', 
        desc: 'Trazar ejes. Excavar poyos a profundidad mínima de 60cm para traspasar capa vegetal.', 
        tolerancia: 'Desviación máx eje: +/- 5mm',
        completado: true 
      },
      { 
        id: 2, 
        tarea: 'Anclaje de Zapatas', 
        desc: 'Instalar zapatas metálicas en hormigón fresco H20 alineadas al eje. Esperar fraguado inicial.', 
        completado: false 
      },
      { 
        id: 3, 
        tarea: 'Fijación Pilares 4x4"', 
        desc: 'Fijar pilares a la zapata asegurando la plomada en ambas caras.', 
        tolerancia: 'Desplome máx: 2mm por metro',
        completado: false 
      },
    ]
  };

  // Estado para controlar qué paso está abierto (expandido)
  const [expandedStep, setExpandedStep] = useState(2);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pb-20">
      
      {/* Cabecera Móvil */}
      <div className="flex items-center gap-3 mb-4">
        <Link to="/worker" className="p-2 bg-gray-200 rounded-full text-dark hover:bg-gray-300 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-dark">Libro de Vida</h1>
          <p className="text-xs text-gray-500">{playbookData.obra}</p>
        </div>
      </div>

      <div className="bg-dark text-white p-5 rounded-2xl shadow-md mb-6 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
         <div className="flex items-start gap-3 mb-4 mt-1">
            <div className="p-2 bg-white/10 rounded-lg text-primary">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">{playbookData.partida}</h2>
              <p className="text-xs text-gray-400 mt-1">Estándar NCh 1198</p>
            </div>
         </div>
         
         {/* Barra de progreso */}
         <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Progreso de Partida</span>
              <span className="text-primary">{playbookData.progreso}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-500" style={{ width: `${playbookData.progreso}%` }}></div>
            </div>
         </div>
      </div>

      {/* Advertencia General */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 mb-6">
        <ShieldAlert className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-red-700">Norma de Seguridad</h4>
          <p className="text-xs text-red-600 mt-1">Uso obligatorio de casco y guantes. Elementos de protección personal requeridos antes de iniciar.</p>
        </div>
      </div>

      {/* Lista de Pasos (Acordeón) */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-gray-500 uppercase ml-1">Pasos a Ejecutar</h3>
        
        {playbookData.pasos.map((paso) => (
          <div 
            key={paso.id} 
            className={`border rounded-xl overflow-hidden transition-colors ${
              paso.completado ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            {/* Cabecera del Paso (Clickeable) */}
            <div 
              className="p-4 flex items-center gap-3 cursor-pointer"
              onClick={() => setExpandedStep(expandedStep === paso.id ? null : paso.id)}
            >
              <button className="flex-shrink-0">
                {paso.completado ? (
                  <CheckCircle2 size={24} className="text-green-500" />
                ) : (
                  <Circle size={24} className="text-gray-300" />
                )}
              </button>
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${paso.completado ? 'text-green-700 line-through opacity-70' : 'text-dark'}`}>
                  {paso.id}. {paso.tarea}
                </h4>
              </div>
            </div>

            {/* Contenido Expandido */}
            {expandedStep === paso.id && !paso.completado && (
              <div className="px-4 pb-4 pt-1 animate-fade-in pl-11">
                <p className="text-sm text-gray-600 mb-3">{paso.desc}</p>
                
                {paso.tolerancia && (
                  <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex items-start gap-2 mb-4">
                    <Ruler size={16} className="text-orange-500 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-orange-700 block">Tolerancia Técnica</span>
                      <span className="text-xs text-orange-600">{paso.tolerancia}</span>
                    </div>
                  </div>
                )}
                
                <button className="w-full bg-dark text-white font-bold py-3 rounded-lg text-sm active:scale-95 transition-transform">
                  Marcar como Completado
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default Playbook;