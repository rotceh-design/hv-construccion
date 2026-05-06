import React from 'react';
import { Receipt, Download, CheckCircle2, Clock, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientPayments = () => {
  const payments = [
    { id: 'EP-001', date: '20 Abr 2026', concept: 'Anticipo de Obra (30%)', amount: 553500, status: 'Pagado' },
    { id: 'EP-002', date: '27 Abr 2026', concept: 'Estado de Pago #2 - Obra Gruesa', amount: 450000, status: 'Pendiente' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/client" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></Link>
        <h1 className="text-2xl font-display font-bold text-dark">Estados de Pago y Facturación</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
          <p className="text-xs font-bold text-green-600 uppercase">Total Pagado</p>
          <h3 className="text-2xl font-bold text-dark">$553.500</h3>
        </div>
        <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-xs font-bold text-orange-600 uppercase">Por Pagar</p>
          <h3 className="text-2xl font-bold text-dark">$1.291.500</h3>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-xs font-bold text-blue-600 uppercase">Total Contrato</p>
          <h3 className="text-2xl font-bold text-dark">$1.845.000</h3>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase">
              <th className="p-4">Documento</th>
              <th className="p-4">Concepto</th>
              <th className="p-4">Monto</th>
              <th className="p-4 text-center">Estado</th>
              <th className="p-4 text-right">Descargar</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="p-4 font-bold">{p.id}</td>
                <td className="p-4">
                  {p.concept}
                  <span className="block text-xs text-gray-400">{p.date}</span>
                </td>
                <td className="p-4 font-semibold">${p.amount.toLocaleString('es-CL')}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                    p.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {p.status === 'Pagado' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                    {p.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-primary hover:text-dark-light transition-colors"><Download size={20}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientPayments;