import React from 'react';
import { 
  CircleDollarSign, TrendingUp, TrendingDown, 
  AlertTriangle, FileBarChart, Camera, CheckCircle2,
  BarChart3, Wallet, FileDown
} from 'lucide-react';

const Finances = () => {
  // Datos simulados de proyectos activos para el control de costos
  const costControl = [
    { id: 'OBRA-042', cliente: 'Familia Pérez', cubicacionIA: 1450000, gastoReal: 1200000, estado: 'ok', margen: 17.2 },
    { id: 'OBRA-043', cliente: 'Constructora SUR', cubicacionIA: 3200000, gastoReal: 3450000, estado: 'alerta', margen: -7.8 },
    { id: 'OBRA-044', cliente: 'Local Comercial', cubicacionIA: 850000, gastoReal: 400000, estado: 'ok', margen: 22.5 },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* Encabezado */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-dark border-b-4 border-primary pb-2 inline-block">
            Control Financiero Total
          </h1>
          <p className="text-gray-600 mt-2">Cruce inteligente entre presupuesto teórico IA y gasto real ejecutado.</p>
        </div>
        <button className="bg-dark text-white font-bold px-4 py-2 rounded flex items-center gap-2 hover:bg-dark-light transition-colors">
          <FileDown size={20} /> Exportar Balance
        </button>
      </div>

      {/* KPIs Financieros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Ingresos (Q2 - Quarter Actual)</p>
              <h3 className="text-3xl font-display font-bold text-dark mt-1">$15.8M</h3>
            </div>
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-red-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Costos Materiales + Mano de Obra</p>
              <h3 className="text-3xl font-display font-bold text-dark mt-1">$11.2M</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <Wallet size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 border-l-4 border-l-primary">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500">Margen Neto Promedio</p>
              <h3 className="text-3xl font-display font-bold text-dark mt-1">29.1%</h3>
            </div>
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL IZQUIERDO: Control de Desviaciones (IA vs Realidad) */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-light flex justify-between items-center">
            <h2 className="font-bold text-dark flex items-center gap-2">
              <CircleDollarSign className="text-primary" size={20} /> 
              Monitor de Desviación de Costos
            </h2>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                  <th className="p-4 font-semibold">ID Proyecto</th>
                  <th className="p-4 font-semibold">Presupuesto IA</th>
                  <th className="p-4 font-semibold">Costo Real Acumulado</th>
                  <th className="p-4 font-semibold text-center">Desviación</th>
                  <th className="p-4 font-semibold text-right">Margen Actual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {costControl.map((obra) => (
                  <tr key={obra.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-bold text-dark">{obra.id} <span className="block text-xs font-normal text-gray-500">{obra.cliente}</span></td>
                    <td className="p-4 text-gray-600">${obra.cubicacionIA.toLocaleString('es-CL')}</td>
                    <td className="p-4 font-semibold">${obra.gastoReal.toLocaleString('es-CL')}</td>
                    <td className="p-4 text-center">
                      {obra.estado === 'alerta' ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 mx-auto max-w-[100px]">
                          <AlertTriangle size={12} /> Sobrecosto
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold flex items-center justify-center gap-1 mx-auto max-w-[100px]">
                          <CheckCircle2 size={12} /> En Rango
                        </span>
                      )}
                    </td>
                    <td className={`p-4 text-right font-bold ${obra.margen < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {obra.margen}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DERECHO: Fidelización de Clientes (Estados de Pago) */}
        <div className="bg-dark text-white rounded-xl shadow-sm border-t-4 border-t-primary p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-hazard-stripes"></div>
          
          <h2 className="font-bold text-lg text-primary flex items-center gap-2 mb-4 mt-1">
            <FileBarChart size={20} /> Generador Estado de Pago
          </h2>
          
          <p className="text-sm text-gray-300 mb-6">
            Construye confianza. Emite el cobro de la etapa enviando un reporte automático al portal del cliente.
          </p>

          <div className="bg-dark-light p-4 rounded-lg border border-gray-700 space-y-4 flex-1">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Seleccionar Obra</label>
              <select className="w-full p-2 bg-dark border border-gray-600 rounded text-sm outline-none focus:border-primary">
                <option>OBRA-042 - Familia Pérez (Etapa 2)</option>
                <option>OBRA-044 - Local Comercial (Anticipo)</option>
              </select>
            </div>

            <div className="bg-black/20 p-3 rounded border border-gray-700">
              <h4 className="text-xs font-bold text-primary mb-2 flex items-center gap-1">
                <Camera size={14} /> Respaldo Fotográfico Original
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                El reporte adjuntará automáticamente <strong>4 fotografías originales</strong> capturadas por el trabajador en terreno hoy. Se garantiza la omisión de filtros o reinterpretaciones de IA para asegurar total transparencia técnica ante el cliente.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-sm text-gray-300">Monto a Facturar:</span>
              <span className="text-xl font-bold text-white">$450.000</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-primary text-dark font-bold py-3 rounded hover:bg-yellow-500 shadow-md transition-colors flex justify-center items-center gap-2">
            Emitir y Notificar al Cliente
          </button>
        </div>

      </div>
    </div>
  );
};

export default Finances;