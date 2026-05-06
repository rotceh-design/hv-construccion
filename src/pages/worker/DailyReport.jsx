import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ClipboardEdit, 
  Clock, 
  HardHat, 
  AlertCircle,
  Send
} from 'lucide-react';

const DailyReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulamos el envío a la base de datos
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-md mx-auto pb-20">
      
      {/* Cabecera Móvil */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/worker" className="p-2 bg-gray-200 rounded-full text-dark hover:bg-gray-300 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-dark">Parte Diario</h1>
          <p className="text-xs text-gray-500">Registro de Turno</p>
        </div>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-5 animate-fade-in">
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="font-bold text-dark flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <HardHat className="text-primary" size={20} /> Asignación
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Obra de Hoy</label>
                <select className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-dark">
                  <option>OBRA-042 - Techumbre Familia Pérez</option>
                  <option>OBRA-044 - Local Comercial</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Hora Ingreso</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="time" defaultValue="08:00" required className="w-full pl-9 p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-dark" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Hora Salida</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input type="time" defaultValue="18:00" required className="w-full pl-9 p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm font-bold text-dark" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex-1">
            <h2 className="font-bold text-dark flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
              <ClipboardEdit className="text-primary" size={20} /> Novedades
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Actividades Realizadas</label>
                <textarea 
                  required
                  rows="3" 
                  placeholder="Ej: Se instalaron 4 pilares y vigas maestras. Se dejó trazado listo para mañana..."
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary text-sm resize-none custom-scrollbar"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase flex items-center gap-1 text-orange-600">
                  <AlertCircle size={14}/> Retrasos o Problemas (Opcional)
                </label>
                <textarea 
                  rows="2" 
                  placeholder="¿Faltó material? ¿Problemas de clima?"
                  className="w-full p-3 bg-orange-50 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm resize-none custom-scrollbar"
                ></textarea>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform shadow-md mt-auto ${
              isSubmitting ? 'bg-gray-400 text-gray-700' : 'bg-primary text-dark hover:bg-yellow-500 active:scale-95'
            }`}
          >
            {isSubmitting ? 'Enviando...' : <><Send size={20}/> Enviar Parte Diario</>}
          </button>
        </form>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
            <Send size={48} className="ml-2" />
          </div>
          <h2 className="text-2xl font-display font-bold text-dark mb-2">¡Turno Registrado!</h2>
          <p className="text-gray-500 mb-8 max-w-[250px]">
            Tus horas y avances han sido enviados a la oficina central correctamente. ¡Buen trabajo hoy!
          </p>
          <Link 
            to="/worker"
            className="w-full bg-dark text-white font-bold py-4 rounded-xl shadow-md active:scale-95 transition-transform"
          >
            Volver a Mi Día
          </Link>
        </div>
      )}

    </div>
  );
};

export default DailyReport;