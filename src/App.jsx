import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

// --- HERRAMIENTAS DE FIREBASE ---
import { auth, db } from './firebase'; // Importamos db para la base de datos
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore'; // Agregamos estas funciones necesarias

// --- IMPORTACIONES DE LAYOUTS ---
import AdminLayout from './layouts/AdminLayout';
import WorkerLayout from './layouts/WorkerLayout';
import ClientLayout from './layouts/ClientLayout';
import SupervisorLayout from './layouts/SupervisorLayout';

// --- IMPORTACIONES DE PÁGINAS ---
import LandingPage from './pages/public/LandingPage';
import Login from './pages/auth/Login';
import Cotizadorpage from './pages/public/Cotizadorpage';

import Dashboard from './pages/admin/Dashboard';
import AiConfigurator from './pages/admin/AiConfigurator';
import ConstructionLibrary from './pages/admin/ConstructionLibrary';
import Finances from './pages/admin/Finances';
import Team from './pages/admin/Team';
import AdminBudgetBuilder from './pages/admin/AdminBudgetBuilder'; // <-- COMPONENTE 3D AÑADIDO

import WorkerDashboard from './pages/worker/WorkerDashboard';
import PhotoUpload from './pages/worker/PhotoUpload';
import Playbook from './pages/worker/Playbook';
import DailyReport from './pages/worker/DailyReport';

import ClientDashboard from './pages/client/ClientDashboard';
import ClientPhotoGallery from './pages/client/ClientPhotoGallery';
import ClientPayments from './pages/client/ClientPayments';

import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import SupervisorWorks from './pages/supervisor/SupervisorWorks';
import SupervisorApprovals from './pages/supervisor/SupervisorApprovals';

// --- GUARDIÁN DE SEGURIDAD (Protección de Rutas) ---
const ProtectedRoute = ({ isAllowed, redirectTo = "/login", children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // 1. BYPASS DE SEGURIDAD PARA EL DUEÑO (Héctor)
        // Esto asegura que siempre puedas entrar como Admin pase lo que pase con la BD
        if (currentUser.email === 'admin@hv.cl') {
          setUser({ 
            email: currentUser.email, 
            role: 'admin', 
            name: 'Héctor (Admin)' 
          });
          setIsAuthReady(true);
          return;
        }

        // 2. BUSQUEDA DE ROL EN FIRESTORE (Para el resto del equipo)
        try {
          const q = query(
            collection(db, "users"), 
            where("email", "==", currentUser.email.toLowerCase())
          );
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setUser({ 
              email: currentUser.email, 
              role: userData.role, 
              name: userData.name 
            });
          } else {
            // Si el correo no está registrado en la colección "users"
            setUser({ email: currentUser.email, role: 'client' });
          }
        } catch (error) {
          console.error("Error al obtener rol desde Firestore:", error);
          // En caso de fallo de red, asumimos rol básico para no romper la app
          setUser({ email: currentUser.email, role: 'client' });
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Pantalla de carga profesional
  if (!isAuthReady) {
    return (
      <>
        {/* ── FONDO GLOBAL ANIMADO ── */}
        <div className="global-animated-bg"></div>
        
        {/* Contenido de carga asegurando z-index para estar por encima del fondo */}
        <div className="min-h-screen relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-primary font-bold animate-pulse uppercase tracking-widest text-sm">
            Iniciando Sistemas HV
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ── FONDO GLOBAL ANIMADO (Para el resto de la plataforma) ── */}
      <div className="global-animated-bg"></div>

      {/* ENVOLTORIO PARA MANTENER LA APP SOBRE EL FONDO */}
      <div className="relative z-10 w-full min-h-screen">
        <Routes>
          {/* ZONA PÚBLICA (Redirección inteligente) */}
          <Route 
            path="/" 
            element={user ? <Navigate to={`/${user?.role}`} replace /> : <LandingPage />} 
          /> 
          <Route 
            path="/login" 
            element={user ? <Navigate to={`/${user?.role}`} replace /> : <Login />} 
          />
          
          {/* 🚀 NUEVA RUTA: Aquí está el cotizador público */}
          <Route 
            path="/cotizador" 
            element={<Cotizadorpage />} 
          />

          {/* ZONA 🏗️ ADMINISTRADOR HV */}
          <Route path="/admin/*" element={
            <ProtectedRoute isAllowed={!!user && user.role === 'admin'} >
              <AdminLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                  <Route path="presupuestos" element={<AdminBudgetBuilder />} /> {/* <-- RUTA 3D AÑADIDA */}
                  <Route path="configurador" element={<AiConfigurator />} />
                  <Route path="biblioteca" element={<ConstructionLibrary />} />
                  <Route path="finanzas" element={<Finances />} />
                  <Route path="team" element={<Team />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          } />

          {/* ZONA 🔍 SUPERVISOR */}
          <Route path="/supervisor/*" element={
            <ProtectedRoute isAllowed={!!user && user.role === 'supervisor'} >
              <SupervisorLayout>
                <Routes>
                  <Route index element={<SupervisorDashboard />} />
                  <Route path="obras" element={<SupervisorWorks />} />
                  <Route path="aprobaciones" element={<SupervisorApprovals />} />
                </Routes>
              </SupervisorLayout>
            </ProtectedRoute>
          } />

          {/* ZONA 👷 TRABAJADOR (Web App Móvil) */}
          <Route path="/worker/*" element={
            <ProtectedRoute isAllowed={!!user && user.role === 'worker'} >
              <WorkerLayout>
                <Routes>
                  <Route index element={<WorkerDashboard />} />
                  <Route path="parte-diario" element={<DailyReport />} />
                  <Route path="subir-foto" element={<PhotoUpload />} />
                  <Route path="playbook" element={<Playbook />} />
                </Routes>
              </WorkerLayout>
            </ProtectedRoute>
          } />

          {/* ZONA 🏠 CLIENTE PORTAL */}
          <Route path="/client/*" element={
            <ProtectedRoute isAllowed={!!user && user.role === 'client'} >
              <ClientLayout>
                <Routes>
                  <Route index element={<ClientDashboard />} />
                  <Route path="avance" element={<ClientPhotoGallery />} />
                  <Route path="pagos" element={<ClientPayments />} />
                </Routes>
              </ClientLayout>
            </ProtectedRoute>
          } />

          {/* Redirección automática para rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;