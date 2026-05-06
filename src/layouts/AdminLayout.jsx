import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bot, 
  CircleDollarSign, 
  Users, 
  LogOut, 
  HardHat,
  Menu,
  BookOpen,
  Calculator
} from 'lucide-react';
// Herramientas para cerrar sesión de verdad
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Presupuesto 3D', path: '/admin/presupuestos', icon: <Calculator size={20} /> },
    { name: 'Configurador IA', path: '/admin/configurador', icon: <Bot size={20} /> },
    { name: 'Biblioteca', path: '/admin/biblioteca', icon: <BookOpen size={20} /> },
    { name: 'Finanzas', path: '/admin/finanzas', icon: <CircleDollarSign size={20} /> },
    { name: 'Personal', path: '/admin/team', icon: <Users size={20} /> },
  ];

  // Función para cerrar la sesión en el servidor de Google
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Volvemos a la landing page pública
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  return (
    <div className="flex h-screen bg-light">
      <aside className="w-64 bg-dark text-white flex flex-col hidden md:flex">
        <div className="h-16 flex items-center justify-center border-b border-dark-light bg-hazard-stripes bg-opacity-20">
          <HardHat className="text-primary mr-2" size={28} />
          <h2 className="text-2xl font-display font-bold text-primary tracking-wider">HV<span className="text-white">ADMIN</span></h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-primary text-dark font-bold' 
                    : 'text-gray-300 hover:bg-dark-light hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* BOTÓN DE SALIDA CORREGIDO */}
        <div className="p-4 border-t border-dark-light">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b-4 border-primary">
          <button className="md:hidden text-dark hover:text-primary">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm font-semibold text-dark">Hola, Héctor</span>
            <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center text-primary font-bold">
              HV
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;