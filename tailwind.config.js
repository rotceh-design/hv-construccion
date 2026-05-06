/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores extraídos del flyer de HV Construcción
        primary: {
          DEFAULT: '#EAB308', // Amarillo Construcción (el de las letras HV y franjas)
          hover: '#CA8A04',   // Amarillo más oscuro para cuando se presione un botón
        },
        dark: {
          DEFAULT: '#18181B', // El fondo gris carbón casi negro del flyer
          light: '#27272A',   // Un gris oscuro un poco más suave para tarjetas
        },
        light: {
          DEFAULT: '#F4F4F5', // Fondo general de la app
          card: '#FFFFFF',    // Blanco para destacar información
          icon: '#D4D4D8',    // El gris claro del casco y el overol de tu logo
        }
      },
      fontFamily: {
        // Mantendremos una tipografía limpia para la lectura técnica, 
        // pero puedes agregar una tipografía "Stencil" o "Impact" para los títulos si lo deseas después.
        sans: ['Inter', 'system-ui', 'sans-serif'], 
        display: ['Oswald', 'sans-serif'], // Ideal para los títulos gruesos tipo construcción
      },
      backgroundImage: {
        // ¡Magia de Tailwind! Aquí creamos el patrón de franjas de peligro de tu flyer
        'hazard-stripes': 'repeating-linear-gradient(45deg, #18181B, #18181B 20px, #EAB308 20px, #EAB308 40px)',
      }
    },
  },
  plugins: [],
}