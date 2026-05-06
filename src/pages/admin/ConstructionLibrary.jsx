import React, { useState } from 'react';
import { 
  BookOpen, Plus, Search, Save, AlertTriangle, 
  Ruler, Hammer, Layers, FileSignature, ChevronRight 
} from 'lucide-react';

// Datos de ejemplo simulando la base de datos de Firebase
const mockLibrary = [
  {
    id: 'TECH-001',
    nombre: 'Instalación de Pilares 4x4" y Vigas 6x2"',
    categoria: 'Obra Gruesa - Techumbre',
    normativa: 'NCh 1198 (Madera) y Capítulo 5 OGUC',
    materiales: ['Pino impregnado 4x4"', 'Pino impregnado 6x2"', 'Zapatas metálicas', 'Hormigón H20', 'Tornillos estructurales'],
    herramientas: ['Nivel de burbuja', 'Plomada', 'Huincha', 'Taladro percutor', 'Sierra Circular'],
    pasos: [
      { orden: 1, tarea: 'Trazado y Excavación', desc: 'Trazar ejes. Excavar poyos a profundidad mínima de 60cm para traspasar capa vegetal.', tolerancia: 'Desviación máx eje: +/- 5mm' },
      { orden: 2, tarea: 'Anclaje de Zapatas', desc: 'Instalar zapatas metálicas en hormigón fresco H20 alineadas al eje.' },
      { orden: 3, tarea: 'Fijación Pilares 4x4"', desc: 'Fijar pilares a la zapata asegurando la plomada en ambas caras.' , tolerancia: 'Desplome máx: 2mm por metro' },
      { orden: 4, tarea: 'Instalación Vigas 6x2"', desc: 'Fijar vigas maestras niveladas sobre los pilares usando conectores metálicos.' }
    ],
    seguridad: 'Uso obligatorio de casco. Arnés de seguridad obligatorio para trabajos sobre 1.8 metros de altura.'
  },
  {
    id: 'RAD-001',
    nombre: 'Radier de Hormigón 10cm',
    categoria: 'Fundaciones',
    normativa: 'NCh 170 (Hormigón)',
    materiales: ['Hormigón G20', 'Malla Acma C-139', 'Polietileno 0.15mm', 'Ripio', 'Arena'],
    herramientas: ['Sonda vibradora', 'Regla de aluminio', 'Platacho', 'Carretillas'],
    pasos: [
      { orden: 1, tarea: 'Preparación Subrasante', desc: 'Escarpe y compactación del terreno natural.', tolerancia: 'CBR > 15%' },
      { orden: 2, tarea: 'Cama de Ripio', desc: 'Colocación y compactación de cama de ripio de 10cm.' },
      { orden: 3, tarea: 'Barrera de Humedad y Armadura', desc: 'Instalación de manga de polietileno y malla Acma centrada mediante separadores.' },
      { orden: 4, tarea: 'Hormigonado', desc: 'Vaciado, vibrado y platachado del hormigón.' }
    ],
    seguridad: 'Uso de guantes impermeables y botas de goma obligatorios durante el vaciado.'
  }
];

const ConstructionLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPartida, setSelectedPartida] = useState(mockLibrary[0]);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
            Biblioteca Constructiva
          </h1>
          <p className="text-gray-600 mt-2">La fuente de verdad (RAG) para la Inteligencia Artificial. Normativas NCh y procesos estandarizados.</p>
        </div>
        <button className="bg-primary text-dark font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-primary-hover shadow-sm transition-colors">
          <Plus size={20} /> Nueva Partida
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* PANEL IZQUIERDO: LISTA DE PARTIDAS */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-light">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar proceso constructivo..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {mockLibrary.map((partida) => (
              <div 
                key={partida.id}
                onClick={() => { setSelectedPartida(partida); setIsEditing(false); }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex items-center justify-between ${
                  selectedPartida?.id === partida.id ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <h3 className="font-bold text-dark text-sm">{partida.nombre}</h3>
                  <p className="text-xs text-gray-500 mt-1">{partida.categoria}</p>
                </div>
                <ChevronRight size={16} className={selectedPartida?.id === partida.id ? 'text-primary' : 'text-gray-300'} />
              </div>
            ))}
          </div>
        </div>

        {/* PANEL DERECHO: DETALLE DE LA PARTIDA */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col relative">
          {/* Fondo sutil de advertencia en el borde superior */}
          <div className="h-1 w-full bg-hazard-stripes absolute top-0 left-0"></div>

          {selectedPartida ? (
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 mt-1">
              
              {/* Cabecera del Detalle */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                <div>
                  <span className="text-xs font-bold bg-dark text-white px-2 py-1 rounded">{selectedPartida.id}</span>
                  <h2 className="text-2xl font-bold text-dark mt-2">{selectedPartida.nombre}</h2>
                  <p className="text-sm text-primary font-semibold mt-1">{selectedPartida.categoria}</p>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`px-4 py-2 rounded text-sm font-bold flex items-center gap-2 transition-colors ${
                    isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-100 text-dark hover:bg-gray-200'
                  }`}
                >
                  {isEditing ? <><Save size={16}/> Guardar Cambios</> : 'Editar Partida'}
                </button>
              </div>

              {/* Contenido Estructurado */}
              <div className="space-y-8">
                
                {/* Normativa */}
                <section className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-bold text-dark uppercase flex items-center gap-2 mb-2">
                    <FileSignature size={16} className="text-primary"/> Normativa Aplicable
                  </h3>
                  <p className="text-sm text-gray-700">{selectedPartida.normativa}</p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Materiales */}
                  <section>
                    <h3 className="text-sm font-bold text-dark uppercase flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                      <Layers size={16} className="text-primary"/> Materiales Base
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedPartida.materiales.map((mat, i) => <li key={i}>{mat}</li>)}
                    </ul>
                  </section>

                  {/* Herramientas */}
                  <section>
                    <h3 className="text-sm font-bold text-dark uppercase flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
                      <Hammer size={16} className="text-primary"/> Herramientas
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      {selectedPartida.herramientas.map((herr, i) => <li key={i}>{herr}</li>)}
                    </ul>
                  </section>
                </div>

                {/* Paso a Paso */}
                <section>
                  <h3 className="text-sm font-bold text-dark uppercase flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                    <Ruler size={16} className="text-primary"/> Procedimiento Paso a Paso
                  </h3>
                  <div className="space-y-4">
                    {selectedPartida.pasos.map((paso) => (
                      <div key={paso.orden} className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-dark flex-shrink-0">
                          {paso.orden}
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex-1">
                          <h4 className="font-bold text-dark text-sm">{paso.tarea}</h4>
                          <p className="text-sm text-gray-600 mt-1">{paso.desc}</p>
                          {paso.tolerancia && (
                            <p className="text-xs text-red-600 font-semibold mt-2 flex items-center gap-1">
                              <AlertTriangle size={12}/> Tolerancia: {paso.tolerancia}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Seguridad */}
                <section className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-sm font-bold text-red-700 uppercase flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-red-500"/> Advertencias de Seguridad
                  </h3>
                  <p className="text-sm text-red-800 font-medium">{selectedPartida.seguridad}</p>
                </section>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Selecciona una partida constructiva del panel lateral.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConstructionLibrary;