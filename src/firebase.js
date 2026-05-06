import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Usamos las variables de entorno de Vite para proteger las llaves
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializamos la aplicación
const app = initializeApp(firebaseConfig);

// Exportamos las herramientas para usarlas en otras pantallas
export const auth = getAuth(app);           // Para Login de usuarios
export const db = getFirestore(app);        // Para guardar proyectos y partes diarios
export const storage = getStorage(app);     // Para guardar fotos y PDFs