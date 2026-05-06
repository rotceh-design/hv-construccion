import React from 'react';
import { Camera, Calendar, ArrowLeft, Maximize2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClientPhotoGallery = () => {
  const photos = [
    { id: 1, date: '27 Abr 2026', stage: 'Estructura', desc: 'Instalación de vigas maestras 6x2" finalizada.', img: 'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&w=400&q=80' },
    { id: 2, date: '26 Abr 2026', stage: 'Estructura', desc: 'Pilares 4x4" nivelados y plomados.', img: 'https://images.unsplash.com/photo-1590059132213-f9163eefd67d?auto=format&fit=crop&w=400&q=80' },
    { id: 3, date: '25 Abr 2026', stage: 'Fundaciones', desc: 'Vaciado de hormigón en poyos de fundación.', img: 'https://images.unsplash.com/photo-1541976535033-5c52c3e35821?auto=format&fit=crop&w=400&q=80' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/client" className="p-2 hover:bg-gray-100 rounded-full transition-colors"><ArrowLeft size={20}/></Link>
        <h1 className="text-2xl font-display font-bold text-dark">Galería de Avance Real</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
            <div className="relative h-48 bg-gray-200">
              <img src={photo.img} alt={photo.stage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 size={16} />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-primary uppercase">{photo.stage}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12}/> {photo.date}</span>
              </div>
              <p className="text-sm text-gray-600">{photo.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientPhotoGallery;