import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HardHat, 
  ClipboardEdit, 
  Camera, 
  BookOpen, 
  LogOut, 
  Menu 
} from 'lucide-react';
// Herramientas de Firebase
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const WorkerLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Mi Día', path: '/worker', icon: <HardHat size={20} /> },
    { name: 'Parte Diario', path: '/worker/parte-diario', icon: <ClipboardEdit size={20} /> },
    { name: 'Subir Avance', path: '/worker/subir-foto', icon: <Camera size={20} /> },
    { name: 'Libro de Vida', path: '/worker/playbook', icon: <BookOpen size={20} /> },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return (
    <div className="flex h-screen bg-light">
      {/* Sidebar Oculto en móviles, visible en escritorio */}
      <aside className="w-64 bg-dark text-white flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-dark-light bg-hazard-stripes bg-opacity-20">
          <HardHat className="text-primary mr-2" size={28} />
          <h2 className="text-2xl font-display font-bold text-primary tracking-wider">HV<span className="text-white">TERRENO</span></h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive ? 'bg-primary text-dark font-bold' : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-dark-light">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-red-500 hover:text-white transition-colors">
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b-4 border-primary">
          <button className="md:hidden text-dark hover:text-primary">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <button onClick={handleLogout} className="md:hidden text-red-500 font-bold text-sm flex items-center gap-1">
              <LogOut size={16}/> Salir
            </button>
            <span className="text-sm font-semibold text-dark hidden md:block">Isaac (Terrenero)</span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;