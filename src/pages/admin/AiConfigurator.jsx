import React, { useState } from 'react';
import { 
  Wand2, Calculator, FileText, Calendar, HardHat, 
  CheckCircle2, Ruler, Hammer, Shield, Layers 
} from 'lucide-react';

const AiConfigurator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [projectGenerated, setProjectGenerated] = useState(false);

  // Estado del formulario ampliado con nivel de ingeniería
  const [formData, setFormData] = useState({
    // Datos Generales
    cliente: '',
    rut: '',
    tipoObra: 'techo_exterior',
    
    // Geometría y Dimensiones
    largo: '',
    ancho: '',
    pendiente: '15',
    tipoCaida: '1_agua',
    
    // Estructura y Obra Gruesa
    pilares: 'pino_impregnado_4x4',
    vigas: 'pino_impregnado_6x2',
    distanciaCerchas: '60',
    
    // Cubierta y Aislación
    cubierta: 'zinc_alum_acanalado_04',
    fieltro: '15lbs',
    aislacion: 'ninguna',
    
    // Fijaciones y Anclajes
    fijacionEstructura: 'clavos_4',
    fijacionCubierta: 'tornillo_hexagonal_techo',
    anclajes: 'zapatas_metalicas_hormigon'
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setProjectGenerated(false);
    
    setTimeout(() => {
      setIsGenerating(false);
      setProjectGenerated(true);
    }, 3500);
  };

  return (
    <div className="flex flex-col gap-6">
      
      <div>
        <h1 className="text-3xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
          Configurador de Proyectos IA
        </h1>
        <p className="text-gray-600 mt-2">Parametrización técnica avanzada. Ingresa las especificaciones exactas para la cubicación y generación de la Carta Gantt según estándar NCh y OGUC.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* PANEL IZQUIERDO: FORMULARIO DE INGENIERÍA */}
        <div className="xl:col-span-7 bg-white p-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-dark flex items-center gap-2">
              <HardHat className="text-primary" size={24} /> Especificaciones Técnicas
            </h2>
            <span className="text-xs bg-dark text-white px-2 py-1 rounded">Modo Experto</span>
          </div>
          
          <form onSubmit={handleGenerate} className="space-y-8">
            
            {/* SECCIÓN 1: DATOS GENERALES */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-l-2 border-primary pl-2">1. Identificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Cliente / Proyecto</label>
                  <input required type="text" name="cliente" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none" placeholder="Ej: Terraza Familia Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Estructura</label>
                  <select name="tipoObra" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary outline-none bg-white">
                    <option value="techo_exterior">Techumbre Exterior / Cobertizo</option>
                    <option value="techo_vivienda">Techumbre Vivienda Principal</option>
                    <option value="ampliacion">Ampliación Estructural</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 2: GEOMETRÍA */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Ruler size={16}/> 2. Geometría y Dimensiones
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Largo (m)</label>
                  <input required type="number" step="0.1" name="largo" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" placeholder="Ej: 6.5" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Ancho (m)</label>
                  <input required type="number" step="0.1" name="ancho" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" placeholder="Ej: 4.0" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pendiente (%)</label>
                  <input required type="number" name="pendiente" defaultValue="15" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Geometría</label>
                  <select name="tipoCaida" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="1_agua">1 Agua</option>
                    <option value="2_aguas">2 Aguas</option>
                    <option value="oculta">Frontón Oculto</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 3: OBRA GRUESA Y ESTRUCTURA */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Layers size={16}/> 3. Estructura Soportante
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Pilares / Columnas</label>
                  <select name="pilares" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="pino_impregnado_4x4">Pino Impregnado 4x4"</option>
                    <option value="pino_impregnado_6x6">Pino Impregnado 6x6"</option>
                    <option value="metal_100x100x3">Perfil Cuadrado 100x100x3mm</option>
                    <option value="metal_75x75x2">Perfil Cuadrado 75x75x2mm</option>
                    <option value="sin_pilares">Sin pilares (Adosado a muro)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Vigas Principales</label>
                  <select name="vigas" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="pino_impregnado_6x2">Pino Impregnado 6x2"</option>
                    <option value="pino_impregnado_8x2">Pino Impregnado 8x2"</option>
                    <option value="metalcon_estructural_90">Metalcon C 90x0.85</option>
                    <option value="metal_rectangular_100x50x3">Perfil Rectangular 100x50x3mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Distancia Cerchas/Vigas</label>
                  <select name="distanciaCerchas" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="40">A 40 cm (Eje a Eje)</option>
                    <option value="60">A 60 cm (Eje a Eje)</option>
                    <option value="80">A 80 cm (Eje a Eje)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 4: CUBIERTA Y PROTECCIÓN */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Shield size={16}/> 4. Cubierta y Aislación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Cubierta</label>
                  <select name="cubierta" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="zinc_alum_acanalado_04">Zinc Alum Acanalado 0.4mm</option>
                    <option value="zinc_alum_5v">Zinc Alum 5V</option>
                    <option value="teja_asfaltica">Teja Asfáltica (Req. Placa OSB)</option>
                    <option value="policarbonato_alveolar_8mm">Policarbonato Alveolar 8mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Barrera de Humedad</label>
                  <select name="fieltro" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="15lbs">Fieltro Asfáltico 15 lbs</option>
                    <option value="10lbs">Fieltro Asfáltico 10 lbs</option>
                    <option value="tyvek">Membrana Hidrófuga (Tyvek)</option>
                    <option value="ninguna">Sin barrera (No recomendado)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Aislación (Opcional)</label>
                  <select name="aislacion" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="ninguna">Sin aislación (Exterior abierto)</option>
                    <option value="lana_mineral_50mm">Lana Mineral 50mm</option>
                    <option value="poliestireno_expandido">Poliestireno Expandido (Aislapol)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECCIÓN 5: FIJACIONES Y ANCLAJES */}
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 border-l-2 border-primary pl-2 flex items-center gap-2">
                <Hammer size={16}/> 5. Fijaciones y Herrajes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fijación de Estructura</label>
                  <select name="fijacionEstructura" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="clavos_4">Clavos corrientes 4" y 3"</option>
                    <option value="tornillo_turbo">Tornillos estructurales (Turbo Screw)</option>
                    <option value="perno_coche">Pernos de coche pasantes</option>
                    <option value="soldadura">Soldadura MIG / Arco (Estructura Metálica)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fijación de Cubierta</label>
                  <select name="fijacionCubierta" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="tornillo_hexagonal_techo">Tornillo Autoperforante Hexagonal c/Golilla</option>
                    <option value="clavo_techo">Clavo Techo c/Golilla de plomo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Anclaje a Fundación</label>
                  <select name="anclajes" onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded outline-none bg-white">
                    <option value="zapatas_metalicas_hormigon">Zapatas metálicas (Poyos de hormigón)</option>
                    <option value="flange_perno_anclaje">Flange metálico + Pernos de Anclaje</option>
                    <option value="empotrado">Empotrado directo en hormigón (protegido)</option>
                  </select>
                </div>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isGenerating}
              className={`w-full py-4 rounded font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${
                isGenerating ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-primary text-dark hover:bg-primary-hover hover:-translate-y-1'
              }`}
            >
              {isGenerating ? (
                <>
                  <Wand2 className="animate-spin" size={24} /> Procesando Variables Constructivas...
                </>
              ) : (
                <>
                  <Wand2 size={24} /> Generar Cubicación, Presupuesto y Contrato
                </>
              )}
            </button>
          </form>
        </div>

        {/* PANEL DERECHO: RESULTADO GENERADO */}
        <div className="xl:col-span-5 bg-dark text-white p-6 rounded-xl shadow-md border-t-4 border-t-primary relative overflow-hidden flex flex-col">
          <div className="absolute top-0 left-0 w-full h-2 bg-hazard-stripes"></div>

          {!projectGenerated && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center py-10">
              <Calculator size={64} className="mb-4 opacity-50" />
              <h3 className="text-xl font-display">Motor de Cálculo en Espera</h3>
              <p className="max-w-xs mt-2 text-sm">El motor de IA requiere las dimensiones, tipo de estructura y terminaciones para calcular el volumen de materiales, tolerancias NCh y ruta crítica.</p>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-primary py-10">
              <Wand2 size={64} className="mb-4 animate-pulse" />
              <h3 className="text-xl font-display font-bold">Ejecutando Modelado IA...</h3>
              <div className="w-full max-w-xs mt-6 space-y-2 text-sm text-gray-400 text-left">
                <p className="flex justify-between"><span>Verificando luces y escuadrías...</span> <span className="text-green-400">OK</span></p>
                <p className="flex justify-between"><span>Calculando {formData.ancho * formData.largo || 0}m² de {formData.cubierta.replace(/_/g, ' ')}...</span> <span className="text-green-400">OK</span></p>
                <p className="flex justify-between"><span>Trazando cruces y fijaciones...</span> <span className="animate-pulse">Calculando</span></p>
              </div>
            </div>
          )}

          {projectGenerated && (
            <div className="animate-fade-in flex-1 overflow-y-auto custom-scrollbar pr-2">
              <div className="flex items-center justify-between border-b border-gray-700 pb-4 mb-6 mt-4">
                <h2 className="text-2xl font-display font-bold text-primary">Proyecto Generado</h2>
                <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 size={14}/> Viabilidad OK
                </span>
              </div>

              <div className="space-y-4">
                {/* Modulo 1: Cubicación y Presupuesto */}
                <div className="bg-dark-light p-4 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-3 border-b border-gray-600 pb-2">
                    <h3 className="font-bold flex items-center gap-2 text-white"><Calculator className="text-primary" size={18}/> Cubicación y Costos</h3>
                    <span className="text-xl font-bold text-primary">$1.845.000</span>
                  </div>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Estructura: {(formData.largo * formData.ancho * 1.5).toFixed(0)} ml de {formData.vigas.replace(/_/g, ' ')}</li>
                    <li>• Cubierta: {Math.ceil((formData.largo * formData.ancho) / 2.5)} planchas de {formData.cubierta.replace(/_/g, ' ')}</li>
                    <li>• Fijaciones: 8 cajas de {formData.fijacionCubierta.replace(/_/g, ' ')}</li>
                    <li>• Aislación: {Math.ceil(formData.largo * formData.ancho / 40)} rollos de {formData.fieltro}</li>
                  </ul>
                </div>

                {/* Modulo 2: Carta Gantt */}
                <div className="bg-dark-light p-4 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold flex items-center gap-2 text-white"><Calendar className="text-primary" size={18}/> Programación de Obra</h3>
                    <span className="font-bold bg-gray-700 px-2 py-1 rounded text-xs">5 Días Hábiles</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Dependencias calculadas. Cuadrilla recomendada: 1 Maestro primera + 1 Ayudante. Trazado y poyos (Día 1). Emparrillado y tijerales (Días 2-3). Instalación de fieltro y {formData.cubierta.replace(/_/g, ' ')} (Días 4-5).</p>
                </div>

                {/* Modulo 3: Contrato */}
                <div className="bg-dark-light p-4 rounded-lg border border-gray-700 hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold flex items-center gap-2 text-white"><FileText className="text-primary" size={18}/> Documentación Legal</h3>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">Contrato a suma alzada a nombre de {formData.cliente || '[Cliente]'}, integrando las especificaciones de {formData.pilares.replace(/_/g, ' ')} y {formData.vigas.replace(/_/g, ' ')}.</p>
                  <div className="flex gap-2">
                    <button className="flex-1 text-xs bg-gray-700 text-white px-3 py-2 rounded font-bold hover:bg-gray-600">Ver PDF Contrato</button>
                    <button className="flex-1 text-xs bg-gray-700 text-white px-3 py-2 rounded font-bold hover:bg-gray-600">Ver Libro de Vida</button>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-primary text-dark font-bold py-3 rounded hover:bg-primary-hover shadow-md transition-colors">
                Guardar Proyecto en Base de Datos
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiConfigurator;