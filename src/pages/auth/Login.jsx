import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HardHat, Lock, Mail, AlertTriangle, Loader2 } from 'lucide-react';
// Importamos las herramientas de Firebase reales
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Nos conectamos a Firebase de verdad
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log("¡Usuario logueado con éxito!", user.email);

      // Detectamos el rol según el correo para redirigir
      let role = 'client';
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('supervisor')) role = 'supervisor';
      else if (email.includes('worker')) role = 'worker';

      // Guardamos el rol temporalmente para mantener la sesión
      localStorage.setItem('hv_role', role);
      
      // Redirigimos al panel correspondiente
      navigate(`/${role}`);

    } catch (error) {
      console.error(error.code);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos. Verifica tus datos.');
      } else {
        setError('Ocurrió un error al intentar entrar. Revisa tu conexión.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Fondo industrial de la constructora */}
      <div className="absolute top-0 left-0 w-full h-3 bg-hazard-stripes"></div>
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in relative z-10">
        
        {/* Cabecera del Login */}
        <div className="bg-light p-8 text-center border-b border-gray-200">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <HardHat size={32} className="text-dark" />
          </div>
          <h2 className="text-2xl font-display font-bold text-dark tracking-wider">
            HV<span className="text-primary">CONSTRUCCIÓN</span>
          </h2>
          <p className="text-sm text-gray-500 mt-2 font-semibold">Portal de Acceso Corporativo</p>
        </div>

        {/* Formulario */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold text-dark"
                  placeholder="ejemplo@hv.cl"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">¿Olvidaste tu clave?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-bold text-dark"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-transform shadow-md mt-4 ${
                isLoading ? 'bg-gray-400 text-gray-700' : 'bg-primary text-dark hover:bg-yellow-500 active:scale-95'
              }`}
            >
              {isLoading ? (
                <><Loader2 className="animate-spin" size={20} /> Conectando al servidor...</>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;