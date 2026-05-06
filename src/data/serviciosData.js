// ============================================================
// data/serviciosData.js — HV CONSTRUCCIÓN
// UF = $40.160 CLP (mayo 2026) — Actualizar mensualmente
//
// MODELO DE PRECIO:
//   PRECIO CLIENTE   = MO + Materiales (con margen HV ~18%)
//   COLABORADOR      = 70% de la MO
//   HV RETIENE       = 30% de la MO + Margen de materiales
//
// UNIDADES ESTÁNDAR:
//   m²  → superficies planas (muros, pisos, cielos, techos)
//   m³  → volúmenes (hormigón, excavaciones, rellenos)
//   ml  → metro lineal (tuberías, canaletas, bajadas, molduras, rejas)
//   pt  → punto (enchufes, interruptores, luminarias)
//   ud  → unidad (artefacto, equipo, pieza completa)
//   set → conjunto de piezas que van juntas
//   gl  → global (visita, faena completa de precio fijo)
// ============================================================

export const UF_VALOR = 40_160; // CLP por UF — actualizar 1° de cada mes

// ─── HELPERS ───────────────────────────────────────────────
/** Convierte CLP a UF redondeado a 3 decimales */
const toUF = (clp) => parseFloat((clp / UF_VALOR).toFixed(3));

/** Convierte UF a CLP (entero) */
const ufToClp = (uf) => Math.round(uf * UF_VALOR);

/**
 * Aplica el modelo financiero HV a un array de ítems raw.
 * Calcula: precioTotal_clp, ufTotal, ufMO, ufMat, ufColaborador, ufHV
 */
const calcularUF = (items) =>
  items.map((item) => {
    const mo  = item.precioMO_clp  ?? 0;
    const mat = item.precioMat_clp ?? 0;
    const total = mo + mat;
    return {
      ...item,
      precioTotal_clp: total,
      ufTotal:        toUF(total),
      ufMO:           toUF(mo),
      ufMat:          toUF(mat),
      ufColaborador:  toUF(mo * 0.70),   // 70 % de la MO
      ufHV:           toUF(mo * 0.30 + mat), // 30 % MO + margen materiales
    };
  });

// ─── MACRO CATEGORÍAS ──────────────────────────────────────
export const MACRO_CATEGORIAS = [
  {
    id:       'proyecto',
    titulo:   'Proyecto Completo',
    subtitulo:'Obras mayores con cuadrilla HV',
    desc:     'Segundo piso, ampliaciones, techumbres, radieres, construcción nueva. Ejecutado directamente por HV + colaboradores integrados.',
    icon:     'Home',
    color:    '#FFCF40',
    ejemplos: ['Segundo piso', 'Ampliación 1er piso', 'Techo / Cobertizo', 'Radier / Fundación'],
  },
  {
    id:       'servicio',
    titulo:   'Servicio Especializado',
    subtitulo:'Colaboradores certificados HV',
    desc:     'Gasfitería, electricidad, climatización, terminaciones, carpintería, herrería. Ejecutado por colaboradores verificados bajo supervisión HV.',
    icon:     'Wrench',
    color:    '#3498DB',
    ejemplos: ['Instalación eléctrica', 'Cambio WC', 'Mini split', 'Piso flotante'],
  },
  {
    id:       'urgencia',
    titulo:   'Urgencia 24/7',
    subtitulo:'Respuesta en menos de 2 horas',
    desc:     'Fugas de agua, cortes eléctricos, destapes, filtraciones, calefont sin llama. Atención inmediata con recargo de urgencia incluido.',
    icon:     'Flame',
    color:    '#E74C3C',
    ejemplos: ['Fuga de agua', 'Corte de luz', 'Destape WC', 'Calefont apagado'],
  },
];

//  SERVICIOS ESPECIALIZADOS
// ════════════════════════════════════════════════════════════

// ── GASFITERÍA / SANITARIA Y REMODELACIÓN ─────────────────
const gasfiteriaItems = [

  // --- 1. INSTALACIONES DE BAÑO COMPLETAS (CONSTRUCTOR INTERACTIVO) ---
  {
    id: 'gas_bano_nuevo_std',
    nombre: 'Baño Completo Nuevo (Estándar Personalizable)',
    desc: 'Remodelación integral: incluye desarme, retiro de escombros, red nueva de agua (PPR) y desagüe (PVC). El valor base incluye instalación de piso/muro cerámico estándar, WC tradicional, lavamanos con pedestal y tina clásica. Podrás personalizar cada terminación a continuación.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(18.00),
    precioMat_clp: ufToClp(13.00),
    marca: 'Op.A: Vainsa / Corona | Op.B: Fanaloza / Fas',
    opcionesPersonalizacion: [
      {
        categoria: 'Tipo de Inodoro (W.C.)',
        opciones: [
          { nombre: 'Estándar One Piece (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'One Piece Dual Flush Premium (Ej. Roca The Gap)', extraMO_uf: 0, extraMat_uf: 2.5 },
          { nombre: 'Suspendido con Estanque Oculto en Muro', extraMO_uf: 2.5, extraMat_uf: 6.0 } 
        ]
      },
      {
        categoria: 'Zona de Ducha',
        opciones: [
          { nombre: 'Tina Acero Enlozado 150x70cm (Incluida)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Receptáculo Acrílico + Mampara Corredera', extraMO_uf: 1.0, extraMat_uf: 4.5 },
          { nombre: 'Shower Door en Obra (Cerámica antideslizante + Vidrio Fijo)', extraMO_uf: 3.5, extraMat_uf: 5.0 }
        ]
      },
      {
        categoria: 'Lavamanos y Mueble',
        opciones: [
          { nombre: 'Lavamanos con Pedestal Clásico (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Vanitorio de Pie con Mueble (2 Puertas)', extraMO_uf: 0.5, extraMat_uf: 2.0 },
          { nombre: 'Vanitorio Flotante Premium con Cajones', extraMO_uf: 1.0, extraMat_uf: 4.0 }
        ]
      },
      {
        categoria: 'Revestimiento (Pisos y Muros)',
        opciones: [
          { nombre: 'Cerámica Estándar 40x40cm (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Porcelanato Rectificado Formato Grande (Piso y Muro)', extraMO_uf: 3.0, extraMat_uf: 6.5 },
          { nombre: 'Muro Decorativo (Mosaico o Piedra en zona ducha)', extraMO_uf: 1.5, extraMat_uf: 2.5 }
        ]
      },
      {
        categoria: 'Espejo y Accesorios',
        opciones: [
          { nombre: 'Espejo Biselado Simple + Kit Accesorios (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Espejo LED Retroiluminado Antivaho', extraMO_uf: 0.5, extraMat_uf: 2.0 }
        ]
      }
    ]
  },
  {
    id: 'gas_bano_nuevo_prem',
    nombre: 'Baño Completo Nuevo (Alta Gama / Premium)',
    desc: 'Remodelación de lujo. Incluye nivelación láser, impermeabilización completa Mapei, porcelanatos rectificados en masa, griferías empotradas, shower door de cristal templado 8mm y bastidor oculto para WC. Pruebas de estanqueidad certificadas.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(28.00), 
    precioMat_clp: ufToClp(38.00), 
    marca: 'Op.A: Franz Viegener / Grohe | Op.B: Kohler / Roca Meridian',
    opcionesPersonalizacion: [
      {
        categoria: 'Sistema de Ducha (Shower)',
        opciones: [
          { nombre: 'Columna Ducha Rainshower (Incluida)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Ducha Empotrada en Cielo (Cielo Falso Requerido)', extraMO_uf: 2.0, extraMat_uf: 4.0 },
          { nombre: 'Cabina de Hidromasaje Integrada 4 Jets', extraMO_uf: 3.0, extraMat_uf: 12.0 }
        ]
      },
      {
        categoria: 'Climatización del Baño',
        opciones: [
          { nombre: 'Extractor de Aire Silencioso (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Radiador Toallero (Conexión a caldera central)', extraMO_uf: 2.5, extraMat_uf: 6.0 },
          { nombre: 'Piso Radiante Eléctrico (Malla calefactora bajo piso)', extraMO_uf: 4.0, extraMat_uf: 8.5 }
        ]
      }
    ]
  },
  {
    id: 'gas_medio_bano_visitas',
    nombre: 'Medio Baño de Visitas (Configurable)',
    desc: 'Ideal para espacios pequeños bajo escalera o ampliaciones. El valor base contempla red de agua, desagüe, WC tradicional y un lavamanos pequeño. No incluye ducha.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(12.00),
    precioMat_clp: ufToClp(8.00),
    marca: 'Línea compacta: Corona / Fanaloza',
    opcionesPersonalizacion: [
      {
        categoria: 'Estilo de W.C.',
        opciones: [
          { nombre: 'Clásico de 2 piezas (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'One Piece Compacto', extraMO_uf: 0, extraMat_uf: 1.5 },
          { nombre: 'Suspendido (Ideal para ahorrar espacio)', extraMO_uf: 2.0, extraMat_uf: 5.5 }
        ]
      },
      {
        categoria: 'Lavamanos',
        opciones: [
          { nombre: 'Lavamanos Mural de Esquina (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Vanitorio Compacto 40cm con puerta', extraMO_uf: 0.5, extraMat_uf: 1.2 },
          { nombre: 'Cubierta de Cuarzo a medida + Lavamanos sobrecubierta', extraMO_uf: 1.5, extraMat_uf: 3.5 }
        ]
      }
    ]
  },

  // --- 2. COCINAS Y LOGIAS (CONSTRUCTOR INTERACTIVO) ---
  {
    id: 'gas_cocina_remodelacion',
    nombre: 'Remodelación Sanitaria Cocina y Logia',
    desc: 'Renovación completa de las redes húmedas de tu cocina. El valor base incluye modificación de puntos de agua fría/caliente, desagües de lavaplatos y conexión estándar para lavadora en logia.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(10.00),
    precioMat_clp: ufToClp(6.00),
    marca: 'Tuberías PPR PN20 / PVC Vinilit',
    opcionesPersonalizacion: [
      {
        categoria: 'Lavaplatos y Grifería',
        opciones: [
          { nombre: 'Puntos estándar listos para instalar (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Lavaplatos Empotrado 2 Cubetas + Grifería Extraíble', extraMO_uf: 1.5, extraMat_uf: 6.0 },
          { nombre: 'Lavaplatos Bajo Cubierta + Grifería Táctil/Sensor', extraMO_uf: 2.5, extraMat_uf: 10.0 }
        ]
      },
      {
        categoria: 'Equipamiento Adicional',
        opciones: [
          { nombre: 'Sin equipamiento extra (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Instalación Triturador de Alimentos en Desagüe', extraMO_uf: 1.0, extraMat_uf: 4.5 },
          { nombre: 'Sistema de Filtro de Agua Ósmosis Inversa bajo mesón', extraMO_uf: 1.5, extraMat_uf: 5.5 }
        ]
      },
      {
        categoria: 'Logia / Lavadero',
        opciones: [
          { nombre: 'Conexión estándar Lavadora (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Instalación Pileta/Lavadero de fibra + grifería mural', extraMO_uf: 1.0, extraMat_uf: 2.0 }
        ]
      }
    ]
  },

  // --- 3. CALEFACCIÓN DE AGUA (CONSTRUCTOR INTERACTIVO) ---
  {
    id: 'gas_calefont_custom',
    nombre: 'Renovación o Instalación de Calefont (Configurable)',
    desc: 'Configura tu equipo a medida. El valor base cubre la Mano de Obra, retiro del antiguo (si aplica), kit de instalación (flexibles, teflón, llaves certificadas) y prueba SEC.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.80),
    precioMat_clp: ufToClp(1.20),
    marca: 'A elección del cliente',
    normativa: 'SEC — DS66',
    opcionesPersonalizacion: [
      {
        categoria: '1. Origen y Capacidad del Equipo',
        opciones: [
          { nombre: 'Solo Instalación (El cliente aporta el equipo)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: '10 Litros (Para 1 Ducha) - Incluye equipo y gestión', extraMO_uf: 0, extraMat_uf: 6.5 },
          { nombre: '13 a 14 Litros (Para 2 Duchas simultáneas)', extraMO_uf: 0, extraMat_uf: 9.5 },
          { nombre: '16 Litros (Alta demanda / 3 Duchas)', extraMO_uf: 0, extraMat_uf: 14.5 }
        ]
      },
      {
        categoria: '2. Marca del Equipo (Si nosotros lo compramos)',
        opciones: [
          { nombre: 'No aplica (Yo pongo el equipo)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Estándar (Splendid, Mademsa, Trotter)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Premium (Bosch, Junkers, Rheem)', extraMO_uf: 0, extraMat_uf: 3.0 }
        ]
      },
      {
        categoria: '3. Tipo de Evacuación de Gases',
        opciones: [
          { nombre: 'Tiro Natural (Ducto simple, ventilación natural)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Tiro Forzado (Ventilador interno, requiere 220V)', extraMO_uf: 0.8, extraMat_uf: 2.5 }
        ]
      }
    ]
  },
  {
    id: 'gas_caldera_mixta',
    nombre: 'Instalación Caldera Mural Mixta (Agua Sanitaria + Calefacción)',
    desc: 'Equipo central que provee agua caliente a las duchas y alimenta la red de radiadores o piso radiante. Valor base incluye montaje, conexiones hidráulicas y de gas.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(8.50),
    precioMat_clp: ufToClp(4.00), // Válvulas, filtros, kit de conexión concéntrico
    marca: 'Op.A: Anwo / Baxi | Op.B: Navien / Rinnai',
    normativa: 'SEC — DS66',
    opcionesPersonalizacion: [
      {
        categoria: 'Provisión del Equipo',
        opciones: [
          { nombre: 'Cliente aporta la Caldera', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Caldera Convencional 24kW (Incluye equipo)', extraMO_uf: 0, extraMat_uf: 26.0 },
          { nombre: 'Caldera de Condensación 24kW (Alta Eficiencia)', extraMO_uf: 0, extraMat_uf: 38.0 }
        ]
      },
      {
        categoria: 'Termostato Inteligente',
        opciones: [
          { nombre: 'Termostato Análogo Básico (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          { nombre: 'Termostato WiFi Programable (Control por App)', extraMO_uf: 0.5, extraMat_uf: 3.5 }
        ]
      }
    ]
  },
  {
    id: 'gas_termo_electrico',
    nombre: 'Instalación Termo Eléctrico (80L - 100L)',
    desc: 'Fijación mural pernos de expansión pesados, conexión hidráulica. Revisión válvula seguridad y ánodo de magnesio.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(5.50),
    marca: 'Op.A: Ariston Andris / Cointra | Op.B: Rheem / Splendid Eléctrico',
  },

  // --- 4. ARTEFACTOS SANITARIOS Y GRIFERÍA INDIVIDUAL ---
  {
    id: 'gas_wc_cambio',
    nombre: 'Cambio W.C. Completo (con Sello Antifuga)',
    desc: 'Retiro inodoro antiguo, limpieza base, instalación con pernos bronce. Sello elastomérico PVC o anillo de cera Fluidmaster.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.80),
    precioMat_clp: ufToClp(3.50), 
    marca: 'Op.A: Corona Savona + Sello Coflex | Op.B: Roca The Gap + Cera Fluidmaster',
  },
  {
    id: 'gas_bidet',
    nombre: 'Instalación de Bidet Independiente',
    desc: 'Instalación de artefacto bidet con grifería monocomando, desagüe y sifón. Requiere puntos de agua y alcantarillado existentes.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(4.50),
    marca: 'Op.A: Roca / Kohler | Op.B: FV / Vainsa',
  },
  {
    id: 'gas_urinario',
    nombre: 'Instalación de Urinario (Institucional/Comercial)',
    desc: 'Montaje de urinario mural con fluxómetro manual o sensor infrarrojo. Incluye sello de goma y fijaciones.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.00),
    precioMat_clp: ufToClp(6.50),
    marca: 'Op.A: Urinario Fanaloza + Fluxómetro Sloan',
  },
  {
    id: 'gas_lavamanos',
    nombre: 'Cambio Lavamanos Pedestal + Grifería',
    desc: 'Fijación a muro, armado pedestal, desagüe con rebalse, grifería monocomando.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.20),
    precioMat_clp: ufToClp(3.80), 
    marca: 'Op.A: Fima Loft / Grival Kuba | Op.B: Fanaloza / Fas',
  },
  {
    id: 'gas_griferia_cartucho',
    nombre: 'Cambio Grifería Baño (Disco Cerámico)',
    desc: 'Llave de lavamanos o tina con cartucho de alúmina: cero goteo a largo plazo. Incluye flexibles trenzados.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(1.50), 
    marca: 'Op.A: Stretto / Fas | Op.B: Grohe / Hansgrohe',
  },
  {
    id: 'gas_llave_jardin',
    nombre: 'Instalación Llave de Jardín (Exterior)',
    desc: 'Extensión de cañería hacia patio o antejardín. Llave de bola resistente a la intemperie con salida para manguera de 1/2" o 3/4".',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(1.00), 
    marca: 'Op.A: Llave HE/HE Niwa | Op.B: Taumm Forjada',
  },

  // --- 5. REDES DE AGUA, TRATAMIENTO Y BOMBEO ---
  {
    id: 'gas_tuberia_fria_ppr',
    nombre: 'Tubería Agua Fría PPR PN20 (Termofusión)',
    desc: 'Por ml instalado. PPR unido por termofusión a 260°C: sin pegamentos, pieza única impermeable. Incluye codos, uniones y fijaciones.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.20), 
    marca: 'Op.A: Tupac PPR | Op.B: Tigre PPR',
  },
  {
    id: 'gas_tuberia_caliente_pex',
    nombre: 'Tubería Agua Caliente PEX Multicapa (Crimpeado)',
    desc: 'Por ml instalado. PEX flexible, resiste altas T°, no se congela. Uniones bronce + anillos acero inox crimpeados. Ideal en tabiques.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.30), 
    marca: 'Op.A: Uponor PEX-A | Op.B: Rehau RAUTITAN',
  },
  {
    id: 'gas_tuberia_cobre',
    nombre: 'Reparación / Modificación Tubería de Cobre',
    desc: 'Por ml. Corte, limpieza de escoria, fundente y soldadura fuerte con soplete. Alta resistencia térmica y a presión.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.90),
    precioMat_clp: ufToClp(0.40), 
    marca: 'Op.A: Cobre Madeco tipo L',
  },
  {
    id: 'gas_llave_paso',
    nombre: 'Cambio Llave de Paso Matriz (Válvula de Bola)',
    desc: 'Extracción llave de compuerta antigua. Válvula de bola bronce macizo: corta al 100% con 1/4 vuelta. No sarta ni se traba.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.50), 
    precioMat_clp: ufToClp(0.60), 
    marca: 'Op.A: Niwa / Taumm',
  },
  {
    id: 'gas_hidropack',
    nombre: 'Instalación Sistema Presurizador Hidropack',
    desc: 'Aumenta la presión de agua de toda la casa. Consta de bomba de agua periférica/centrífuga + tanque de membrana + presostato. Ideal si el calefont no enciende por baja presión.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(4.50), 
    precioMat_clp: ufToClp(7.00), // Equipo 0.5HP a 1HP básico + piping
    marca: 'Op.A: Pedrollo / Leo | Op.B: Pentax / Vulcano',
  },
  {
    id: 'gas_ablandador_agua',
    nombre: 'Instalación de Ablandador de Agua (Antisarro)',
    desc: 'Equipo de resina de intercambio iónico a la entrada de la casa. Elimina el calcio/magnesio. Protege calefonts, griferías y lavadoras de la incrustación de sarro (dureza del agua).',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.50), 
    precioMat_clp: ufToClp(22.00), // Equipo ablandador automático salino + by-pass
    marca: 'Op.A: Vigaflow / Eura',
  },
  {
    id: 'gas_riego_automatico',
    nombre: 'Red de Riego Automático (Por Zona)',
    desc: 'Instalación de programador eléctrico, electroválvulas, tubería HDPE y aspersores/difusores pop-up. Valor calculado por circuito o zona de riego.',
    unidad: 'zona',
    precioMO_clp:  ufToClp(3.50), 
    precioMat_clp: ufToClp(4.50),
    marca: 'Controladores y válvulas: Rain Bird / Hunter',
  },

  // --- 6. REDES DE GAS ──────────────────────────────────────
  {
    id: 'gas_tuberia_pex_al_pex',
    nombre: 'Cañería Red de Gas PEX-AL-PEX',
    desc: 'Por ml instalado. Tubería plástica con alma de aluminio, aprobada por SEC. Anticorrosiva, flexible y segura. Uniones prensadas.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.40),
    normativa: 'SEC — PEX-AL-PEX amarillo',
  },
  {
    id: 'gas_nicho_balones',
    nombre: 'Construcción Nicho para Balones de Gas (45kg)',
    desc: 'Caseta exterior normativa. Base de hormigón, estructura incombustible (albañilería o fibrocemento), puertas con ventilación superior/inferior, y manifold de conexión con válvula inversora.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(6.50),
    precioMat_clp: ufToClp(5.50),
    normativa: 'SEC — Distancias de seguridad a puertas/enchufes',
  },

  // --- 7. ALCANTARILLADO Y FOSAS SÉPTICAS ───────────────────
  {
    id: 'gas_desague_pvc_50',
    nombre: 'Colector Desagüe PVC Ø50mm',
    desc: 'Por ml instalado. PVC unido por adhesivo solvente. Pendiente normativa 2-3%. Para lavamanos, duchas y lavaplatos.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.50),
    precioMat_clp: ufToClp(0.15), 
    marca: 'Op.A: Vinilit PVC Sanitario',
  },
  {
    id: 'gas_desague_pvc_110',
    nombre: 'Colector Desagüe PVC Ø110mm (WC / Bajada)',
    desc: 'Por ml instalado. Diámetro estándar para WC y bajadas principales. Pendiente 1-2%. Adhesivo solvente + prueba de descarga.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.25), 
  },
  {
    id: 'gas_fosa_septica',
    nombre: 'Instalación Fosa Séptica + Pozo Absorbente',
    desc: 'Solución sanitaria off-grid (Parcelas sin alcantarillado). Incluye excavación con retroexcavadora, fosa plástica, cámara desengrasadora, cámara de inspección y zanjas de infiltración o pozo dren.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(35.00), // Maquinaria, movimiento de tierra, topografía
    precioMat_clp: ufToClp(30.00), // Fosa 2000L a 3000L, bolones, geotextil, cámaras
    marca: 'Op.A: Fosas Infraplast / Biopur',
    normativa: 'Resolución Sanitaria Seremi de Salud',
  },

  // --- 8. DESTAPES, URGENCIAS Y DIAGNÓSTICO ─────────────────
  {
    id: 'gas_destape_mecanico',
    nombre: 'Desobstrucción de Cañería (Sonda Mecánica)',
    desc: '"Culebra" de acero motorizada: rompe tapones de grasa, pelo o papel hasta 15m sin romper muros. Prueba descarga posterior.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(0.00), 
    marca: 'Equipos RIDGID / Milwaukee',
  },
  {
    id: 'gas_destape_hidrojet',
    nombre: 'Desobstrucción de Cañería (Hidrojet 200 bar)',
    desc: 'Para obstrucciones graves, lodo o raíces. Agua a 200 bar lava paredes del tubo. Incluye inspección con cámara.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(4.50),
    precioMat_clp: ufToClp(0.00),
  },
  {
    id: 'gas_inspeccion_camara',
    nombre: 'Inspección de Cañería con Cámara Push',
    desc: 'Sonda de video flexible que recorre la tubería en tiempo real, detecta grietas, raíces u obstrucciones. Informe con grabación.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(0.00),
  },
  {
    id: 'gas_deteccion_ultrasonido',
    nombre: 'Detección de Fugas Infiltradas (Ultrasonido/Gas Trazador)',
    desc: 'Localización exacta de fugas ocultas bajo radier o en muros sin tener que picar a ciegas. Se utiliza geófono, termografía o inyección de gas trazador.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.00),
    precioMat_clp: ufToClp(0.00),
    marca: 'Tecnología Severin / Fluke',
  },

  // --- 9. TRÁMITES, CERTIFICACIONES Y PROYECTOS ─────────────
  {
    id: 'gas_regularizacion',
    nombre: 'Regularización Instalación Gas (Sello SEC)',
    desc: 'Inspección técnica, corrección no conformidades (ductos, válvulas, ventilaciones) y emisión del sello verde SEC.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(4.50), 
    precioMat_clp: ufToClp(0.80), 
    normativa: 'DS66 — Obligatorio para recepción final',
  },
  {
    id: 'gas_proyecto_sanitario',
    nombre: 'Diseño y Firma de Proyecto Sanitario (Agua/Alcantarillado)',
    desc: 'Levantamiento planimétrico, cálculo de dotación, isométricos y memoria explicativa firmada por ingeniero/instalador autorizado para ingresar a Aguas Andinas, Esval, o Seremi.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(12.00), // Trabajo de gabinete, AutoCAD, trámites
    precioMat_clp: ufToClp(0.00),
    marca: 'Planos formato DOM',
  },
  {
    id: 'gas_visita',
    nombre: 'Visita Diagnóstico Técnico Especializado',
    desc: 'Técnico acude para evaluar viabilidad de proyectos complejos, medir presiones o presupuestar remodelaciones. El valor se descuenta al 100% si se aprueba el presupuesto.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(1.00), 
    precioMat_clp: ufToClp(0.00),
  },
];

// ── ELECTRICIDAD ──────────────────────────────────────────
const electricidadItems = [

  // --- 1. TABLEROS E INSTALACIONES COMPLETAS ---
  {
    id: 'elec_instalacion_completa',
    nombre: 'Instalación Eléctrica Completa (Obra Nueva / Recableado)',
    desc: 'Por m². Conduit, cajas de derivación, cableado libre de halógenos (no emite humos tóxicos). Circuitos iluminación y enchufes separados.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(0.45),
    marca: 'Op.A: Cables Nexans + Conduit AMANCO | Op.B: General Cable + Tigre',
  },
  {
    id: 'elec_tablero_12',
    nombre: 'Tablero 12 Circuitos Monofásico',
    desc: 'Disyuntor general, diferencial 30mA (salvavidas: corta ante descarga a personas), barra tierra cobre puro, disyuntores por zona.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(1.50),
    marca: 'Op.A: Schneider Easy9 | Op.B: Legrand DX3 / BTicino Btdin',
    normativa: 'NCh Elec 4/2003 + SEC (Diferencial obligatorio)',
  },
  {
    id: 'elec_tablero_18',
    nombre: 'Tablero 18–24 Circuitos Trifásico',
    desc: 'Para alto consumo o talleres. Repartidor tetrapolar, 3 diferenciales (uno por fase), interruptores termomagnéticos calibrados.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.00),
    precioMat_clp: ufToClp(2.20),
    marca: 'Op.A: Schneider iC60 / Acti9 | Op.B: ABB SACE',
    normativa: 'Instalador Clase A SEC obligatorio',
  },
  {
    id: 'elec_normalizacion',
    nombre: 'Normalización Cableado Antiguo',
    desc: 'Por m². Retiro cordones paralelos o cables de tela, reemplazo por cable normado EVA (Superflex), ordenamiento cajas, ajuste de protecciones.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(0.35),
    marca: 'Op.A: Nexans | Op.B: Covisa EVA',
    normativa: 'Adecuación NCh Elec 4/2003',
  },
  {
    id: 'elec_puesta_a_tierra',
    nombre: 'Sistema de Puesta a Tierra (Jabalina + Conductor)',
    desc: 'Instalación de jabalina de cobre 5/8" × 1.8m, cable desnudo 10mm² hasta tablero, unión exotérmica. Medición de resistencia de tierra (≤25Ω).',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.80),
    marca: 'Jabalina Copperweld / Cable INDECO',
    normativa: 'NCh Elec 4 — Resistencia ≤25Ω',
  },

  // --- 2. ENCHUFES Y CIRCUITOS DE FUERZA ---
  {
    id: 'elec_enchufe_10a',
    nombre: 'Punto Enchufe 10A Estándar',
    desc: 'Módulo bipolar con toma de tierra. Cable 2.5mm² desde caja derivación. Altura normativa 30cm NPT.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.12),
    marca: 'Op.A: BTicino Living Light | Op.B: Legrand Céliane',
    normativa: 'NCh Elec 4 — h=30cm NPT',
  },
  {
    id: 'elec_enchufe_220',
    nombre: 'Punto Enchufe 20A Dedicado (Horno/Clima)',
    desc: 'Patas reforzadas para alto consumo. Cable 4mm² directo a tablero con disyuntor exclusivo. Obligatorio para cargas >1500W.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.15),
    marca: 'Op.A: Schneider Unica 20A | Op.B: Gewiss GW20000',
    normativa: 'Circuito independiente obligatorio >1500W',
  },
  {
    id: 'elec_enchufe_gfci',
    nombre: 'Punto Enchufe GFCI (Zonas Húmedas)',
    desc: 'Cortacorriente interno propio: salta en milisegundos ante contacto con agua. Obligatorio en baños y mesones cocina.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.18),
    marca: 'Op.A: Legrand GFCI 30mA | Op.B: BTicino GFCI',
    normativa: 'NCh Elec 4 — GFCI obligatorio a >1m del agua',
  },
  {
    id: 'elec_circuito_220',
    nombre: 'Tendido Circuito 220V Completo (Directo a Tablero)',
    desc: 'Línea independiente desde tablero hasta punto de uso (lavadora, secadora, termo eléctrico). Incluye breaker individual.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.22),
    marca: 'Op.A: Nexans 4mm² + Schneider | Op.B: Covisa + Legrand',
  },
  {
    id: 'elec_enchufe_usb',
    nombre: 'Punto Enchufe con Cargador USB-A/C Integrado',
    desc: 'Módulo de enchufe estándar + 2 puertos USB de carga rápida 18W integrados. Sin transformador externo visible.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.32),
    precioMat_clp: ufToClp(0.20),
    marca: 'Op.A: Schneider Unica USB | Op.B: BTicino USB',
  },

  // --- 3. ILUMINACIÓN E INTERRUPTORES ---
  {
    id: 'elec_interruptor_simple',
    nombre: 'Interruptor Simple / Doble',
    desc: 'Mecanismo de encendido embutido, caja, conexionado fase y retornos en 1.5mm², placa embellecedora.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.22),
    precioMat_clp: ufToClp(0.10),
    marca: 'Op.A: BTicino Axolute | Op.B: Legrand Mosaic',
  },
  {
    id: 'elec_conmutado',
    nombre: 'Interruptor Conmutado (Escaleras/Pasillos)',
    desc: 'Sistema de 3 vías: enciende en un extremo y apaga en el otro. Cableado especial incluido.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.28),
    precioMat_clp: ufToClp(0.12),
    marca: 'Op.A: BTicino Matix | Op.B: Schneider Unica',
  },
  {
    id: 'elec_dimmer',
    nombre: 'Instalación Dimmer (Regulador de Intensidad LED)',
    desc: 'Regulador de fase rotativo o táctil compatible con LED. Reduce consumo y ambiente de la iluminación.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.22),
    marca: 'Op.A: Legrand Céliane Dimmer | Op.B: Schneider New Unica',
  },
  {
    id: 'elec_led_dicroico',
    nombre: 'Foco LED Embutido (Dicroico GU10)',
    desc: 'Perforación cielo falso (volcanita), cableado desde centro de luz, foco embutido direccional, zócalo GU10 cerámica + ampolleta.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.22),
    precioMat_clp: ufToClp(0.18),
    marca: 'Op.A: Philips SceneSwitch 5W | Op.B: LEDVANCE / Osram',
  },
  {
    id: 'elec_panel_led',
    nombre: 'Placa Panel LED Ultradelgado 18W',
    desc: 'Luminaria plana gran dispersión (cocinas/baños). Driver integrado, corte de cielo, tensores de anclaje.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.20),
    marca: 'Op.A: Philips CoreLine | Op.B: Macroled / Osram',
  },
  {
    id: 'elec_lampara_colgante',
    nombre: 'Instalación Lámpara Colgante / Aplique',
    desc: 'Fijación reforzada a losa o viga para lámparas decorativas, armado roseta, conexión con regletas de empalme.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.20),
    precioMat_clp: ufToClp(0.10),
    marca: 'Op.A: Ferrolux / Konek | Op.B: Equipo del cliente',
  },
  {
    id: 'elec_tira_led',
    nombre: 'Instalación Tira LED (Perfil Aluminio + Difusor)',
    desc: 'Tendido de perfil aluminio anodizado empotrado o en cornisa, tira LED 24V alta densidad, difusor opalino, driver externo y control.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.45),
    marca: 'Op.A: Ledvance FlexClass / Profiled | Op.B: Elco Lighting',
  },

  // --- 4. CORRIENTES DÉBILES, REDES Y SEGURIDAD ---
  {
    id: 'elec_punto_tv',
    nombre: 'Punto TV Coaxial Empotrado',
    desc: 'Canalización separada para evitar interferencias. Cable RG6 blindado, conector F de compresión, placa mural.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.10),
    marca: 'Op.A: Legrand | Op.B: Schneider / Vitel',
  },
  {
    id: 'elec_punto_rj45',
    nombre: 'Punto de Datos RJ45 Cat6',
    desc: 'Cable UTP Cat6, keystone mural, probado con certificador. Para Smart TV, consolas o trabajo sin lag de WiFi.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.28),
    precioMat_clp: ufToClp(0.12),
    marca: 'Op.A: Panduit Cat6 | Op.B: AMP Netconnect / Furukawa',
  },
  {
    id: 'elec_switch_rack',
    nombre: 'Instalación Rack + Switch de Red (Hub doméstico)',
    desc: 'Caja de pared o rack 6U, patch panel Cat6, switch 8 puertos Gigabit, etiquetado de cables. Centro de datos doméstico.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(2.50),
    marca: 'Op.A: TP-Link TL-SG108 + Panduit | Op.B: Ubiquiti UniFi',
  },
  {
    id: 'elec_cctv',
    nombre: 'Instalación Cámara de Seguridad CCTV IP',
    desc: 'Fijación exterior/interior, cable red POE (energía + video en 1 cable), configuración visualización en celular.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.60),
    marca: 'Op.A: Hikvision ColorVu | Op.B: Dahua Full-Color',
  },
  {
    id: 'elec_portero_video',
    nombre: 'Video Portero con Pantalla 7"',
    desc: 'Placa callejera con cámara IR y micrófono. Pantalla interior color 7". Cableado y relé para cerradura eléctrica.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(1.20),
    marca: 'Op.A: BTicino Classe 300 | Op.B: Hikvision IP Intercom',
  },
  {
    id: 'elec_alarma',
    nombre: 'Sistema de Alarma Perimetral (Kit Básico)',
    desc: 'Central cableada/híbrida, teclado, sirena exterior, 2 sensores PIR, 4 contactos magnéticos en puertas.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(1.20),
    marca: 'Op.A: DSC PC1616 | Op.B: Paradox SP6000',
  },
  {
    id: 'elec_porton',
    nombre: 'Motorización Portón Corredizo',
    desc: 'Motor reductor sobre base hormigón, cremalleras soldadas, límites magnéticos, 2 controles remotos clonados.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.00),
    precioMat_clp: ufToClp(1.80),
    marca: 'Op.A: FAAC / BFT (uso pesado) | Op.B: CAME / Centurion',
  },
  {
    id: 'elec_cerradura_smart',
    nombre: 'Cerradura Inteligente Biométrica / APP',
    desc: 'Cerradura con huella dactilar, teclado, tarjeta RFID y app móvil. Historial de accesos. Incluye instalación y configuración.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(1.80),
    marca: 'Op.A: Samsung SHP-DP728 | Op.B: Yale YDR-323',
  },

  // --- 5. TRÁMITES Y CERTIFICACIONES ---
  {
    id: 'elec_te1',
    nombre: 'Certificado TE1 + Plano SEC (Firma Instalador)',
    desc: 'Por m². Plano unilineal, cuadro de cargas, memorias y trámite de código QR en portal SEC.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.10),
    precioMat_clp: 0,
    marca: 'Solo Instalador SEC Clase A/B Autorizado',
    normativa: 'Obligatorio para recepción municipal y empalmes',
  },
];

// ── CLIMATIZACIÓN ─────────────────────────────────────────
const climatizacionItems = [

  // --- 1. MINI SPLIT SUMINISTRO + INSTALACIÓN ---
  {
    id: 'clima_split_9k',
    nombre: 'Mini Split 9.000 BTU Inverter (hasta ~15m²)',
    desc: 'Dormitorios. Inverter ahorra hasta 40% energía. Incluye: perforación copa, tubería cobre aislada 1/4+3/8 hasta 4m, escuadras, cableado interconexión, vacío y carga gas R32.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.50),
    precioMat_clp: ufToClp(9.00),
    marca: 'Op.A: Midea Xtreme Save | Op.B: Samsung WindFree 9000',
    normativa: 'Punto 220V dedicado recomendado',
  },
  {
    id: 'clima_split_12k',
    nombre: 'Mini Split 12.000 BTU Inverter (20–25m²)',
    desc: 'Living / comedor estándar. Inverter + WiFi. Kit cobre 1/4+1/2, canaleta PVC exterior, drenaje por gravedad, prueba térmica.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.80),
    precioMat_clp: ufToClp(14.20),
    marca: 'Op.A: TCL Elite / Hisense | Op.B: LG ARTCOOL / Daikin 12000',
    normativa: 'Circuito 220V dedicado + diferencial',
  },
  {
    id: 'clima_split_18k',
    nombre: 'Mini Split 18.000 BTU Inverter (30–35m²)',
    desc: 'Escuadras reforzadas por peso del compresor. Kit cobre 1/4+1/2 o 5/8, bomba de vacío, sellado de muros.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(4.20),
    precioMat_clp: ufToClp(18.00),
    marca: 'Op.A: Khone / Midea MSAGBU | Op.B: LG DUALCOOL 18000',
    normativa: 'Circuito 220V dedicado obligatorio',
  },
  {
    id: 'clima_split_24k',
    nombre: 'Mini Split 24.000 BTU Inverter (45–55m²)',
    desc: 'Salones grandes / concepto abierto. Circuito eléctrico exclusivo 20A obligatorio. Carga gas R32/R410a ajustada por manómetro.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(4.80),
    precioMat_clp: ufToClp(22.00),
    marca: 'Op.A: Carrier 42LUVH | Op.B: Daikin FTXS24 / Mitsubishi',
    normativa: 'Circuito 220V/20A exclusivo obligatorio',
  },

  // --- 2. INSTALACIÓN DE EQUIPO DEL CLIENTE Y MULTI-SPLIT ---
  {
    id: 'clima_solo_instalacion',
    nombre: 'Solo Instalación Mini Split (Cliente aporta equipo)',
    desc: 'Proveemos MO + tubería cobre normada, aislante elastomérico, escuadras, canaletas, hermetización N₂, vacío y encendido.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.80),
    precioMat_clp: ufToClp(0.80),
    marca: 'Cobre normado tipo L, canaletas Dexson',
  },
  {
    id: 'clima_multisplit_2x1',
    nombre: 'Multi-Split 2×1 (2 interiores + 1 compresor)',
    desc: 'Un motor exterior → 2 unidades independientes (ej: 9k+9k BTU). Ideal departamentos con restricciones de fachada. Ruteo dual de cobre.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(6.00),
    precioMat_clp: ufToClp(28.00),
    marca: 'Op.A: Hisense Multi / Midea | Op.B: Samsung AJ052 / LG MU3R21',
  },
  {
    id: 'clima_multisplit_3x1',
    nombre: 'Multi-Split 3×1 (3 interiores + 1 compresor)',
    desc: '3 zonas independientes con una sola condensadora robusta. Presurización 24h antes de liberar gas.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(7.50),
    precioMat_clp: ufToClp(38.00),
    marca: 'Op.A: Midea 3 Zonas | Op.B: Daikin 3MXM / Mitsubishi MXZ',
  },
  {
    id: 'clima_conducto',
    nombre: 'Sistema Climatización por Conductos (Ducted)',
    desc: 'Equipo cassette o Fan Coil central oculto en cielo. Ductería metálica rectangular / circular, rejillas de impulsión y retorno, termostato central.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(12.00),
    precioMat_clp: ufToClp(35.00),
    marca: 'Op.A: Daikin Sky Air | Op.B: Mitsubishi PEA / Carrier 40MBDB',
    normativa: 'Requiere plano de conductos previo',
  },

  // --- 3. TUBERÍAS DE COBRE PARA CLIMATIZACIÓN ---
  {
    id: 'clima_tuberia_cobre_14_38',
    nombre: 'Tubería Cobre para A/A 1/4" + 3/8" (par)',
    desc: 'Por ml. Par de tuberías de cobre tipo L (líquido + aspiración) con aislante elastomérico negro 9mm. Para equipos hasta 12.000 BTU.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.35),
    marca: 'Cobre Madeco tipo L + Armaflex Class O',
  },
  {
    id: 'clima_tuberia_cobre_14_12',
    nombre: 'Tubería Cobre para A/A 1/4" + 1/2" (par)',
    desc: 'Por ml. Par de tuberías para equipos 18.000–24.000 BTU. Aislante elastomérico 13mm.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.32),
    precioMat_clp: ufToClp(0.42),
    marca: 'Cobre Madeco tipo L + Armaflex Class O 13mm',
  },
  {
    id: 'clima_drenaje_condensado',
    nombre: 'Canalización Drenaje de Condensado',
    desc: 'Por ml. Tubería PVC 16mm para evacuación del agua condensada del evaporador. Incluye sifón anti-retorno de olor.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.15),
    precioMat_clp: ufToClp(0.10),
    marca: 'PVC Sanitario / Canaleta Dexson',
  },

  // --- 4. MANTENIMIENTO TÉCNICO HVAC ---
  {
    id: 'clima_mantencion',
    nombre: 'Mantención Profunda Mini Split (Química + Presiones)',
    desc: 'Desarme de plásticos, lavado químico a presión de serpentín evaporador y condensador. Limpieza bandeja/drenaje, reapriete eléctrico, lectura de presiones R32/R410a.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.40),
    marca: 'Coil Cleaner + Gas R32/R410A',
  },
  {
    id: 'clima_mantencion_simple',
    nombre: 'Mantención Preventiva Mini Split',
    desc: 'Limpieza filtros, spray fungicida antibacteriano en aletas evaporador, revisión T° de inyección, chequeo aislamiento cañerías. Cada 6 meses.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.10),
    marca: 'Desinfectante antibacterial HVAC',
  },
  {
    id: 'clima_carga_gas',
    nombre: 'Recarga de Gas Refrigerante R32 / R410a',
    desc: 'Conexión de manómetros, extracción de gas residual, vacío y carga exacta según placa del fabricante. Incluye detective de fugas previo.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.90),
    precioMat_clp: ufToClp(0.60),
    marca: 'Gas R32 / R410a certificado',
    normativa: 'Solo técnico RSECE habilitado',
  },

  // --- 5. EXTRACCIÓN Y VENTILACIÓN ---
  {
    id: 'clima_campana_solo_inst',
    nombre: 'Instalación Campana Extractora (Solo MO)',
    desc: 'Anclaje a muro/mueble, conexión eléctrica a punto existente, acople a ducto de extracción.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(0.10),
    marca: '—',
  },
  {
    id: 'clima_campana_completo',
    nombre: 'Campana Extractora Completa (Equipo + Ducto)',
    desc: 'Campana acero inox, perforación de muro, ducto aluminio corrugado 150mm, celosía exterior antirretorno, conexión 220V.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(4.50),
    marca: 'Op.A: FDV / Ursus Trotter | Op.B: Bosch / Miele',
  },
  {
    id: 'clima_extractor_bano',
    nombre: 'Extractor de Aire para Baños (Equipo + Instalación)',
    desc: 'Extractor axial para muros o cielos. Conexión al circuito iluminación (con timer). Ducto flexible + rejilla descarga.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.60),
    marca: 'Op.A: Soler & Palau Silent 100 | Op.B: Vortice Punto',
    normativa: 'MINVU — Obligatorio baños sin ventana directa',
  },
  {
    id: 'clima_ventilacion_mecanica',
    nombre: 'Sistema Ventilación Mecánica Controlada (VMC)',
    desc: 'Unidad de recuperación de calor (HRU). Extrae aire viciado de baños/cocina e introduce aire fresco filtrado con recuperación de hasta 85% de temperatura. Por m² de vivienda.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.80),
    marca: 'Op.A: Zehnder ComfoAir | Op.B: Dantherm / Aldes',
    normativa: 'CTE HE3 / ASHRAE 62.2',
  },

  // --- 6. CALEFACCIÓN ESPECIALIZADA ---
  {
    id: 'clima_piso_radiante',
    nombre: 'Piso Radiante Eléctrico (Malla Calefactora)',
    desc: 'Por m². Estera de cables bajo porcelanato, termostato digital/WiFi por zona. Invisible, calor uniforme desde el suelo.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(1.40),
    marca: 'Op.A: Nuheat Membrane | Op.B: Warmup 3iE WiFi',
  },
  {
    id: 'clima_calefaccion_central',
    nombre: 'Calefacción Centralizada a Gas (Caldera + 2 Radiadores)',
    desc: 'Caldera mural mixta (ACS + calefacción). Tuberías PEX-AL-PEX embutidas o perimetrales. 2 radiadores de aluminio con válvulas termostáticas.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(5.00),
    precioMat_clp: ufToClp(15.00),
    marca: 'Op.A: Caldera Anwo / Fondital | Op.B: Junkers Bosch / Baxi',
  },
  {
    id: 'clima_radiador_extra',
    nombre: 'Instalación Radiador Adicional (Aluminio)',
    desc: 'Por unidad. Conexión a circuito de calefacción central existente. Válvula termostática, purgador y soporte mural.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(2.50),
    marca: 'Op.A: Ferroli / Radiadores DMC | Op.B: Baxi / Roca',
  },
];

// ── MANTENIMIENTO Y REPARACIONES ──────────────────────────
const mantenimientoItems = [

  // --- TECHUMBRE ---
  {
    id: 'mant_techo_pizarreno',
    nombre: 'Cambio Pizarreños (parcial hasta 10m²)',
    desc: 'Por m². Retiro pizarreños deteriorados, instalación nuevos, sellado cumbrera, revisión estructura.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.55),
    marca: 'Pizarreño Volcán Perfil 5 ondas',
  },
  {
    id: 'mant_techo_zincalum',
    nombre: 'Cambio Zinc-alum Acanalado (parcial)',
    desc: 'Por m². Retiro plancha vieja, instalación zinc-alum 0.35mm, sellado tornillos y traslapes.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.45),
    marca: 'Zinc-alum 0.35mm Polpaico / Novacero',
  },
  {
    id: 'mant_membrana',
    nombre: 'Impermeabilización Membrana Asfáltica (2 capas)',
    desc: 'Por m². Limpieza, imprimación asfáltica, 2 capas membrana 3mm antirraíz, terminación aluminio.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.00),
    precioMat_clp: ufToClp(0.80),
    marca: 'Ormiflex 3mm / SikaBit',
  },
  {
    id: 'mant_filtracion',
    nombre: 'Reparación Filtración Puntual',
    desc: 'Diagnóstico, sellado con mortero hidráulico, pintura impermeabilizante en zona afectada.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.50),
    marca: 'SikaSeal / Sika Monotop',
  },

  // --- AGUAS LLUVIAS (metro lineal) ---
  {
    id: 'mant_canaleta',
    nombre: 'Cambio Canaleta PVC 100mm',
    desc: 'Por ml. Retiro canaleta vieja, instalación nueva con pendiente correcta, uniones y esquineras.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.20),
    marca: 'Tigre PVC / Amanco 100mm',
  },
  {
    id: 'mant_bajada_lluvia',
    nombre: 'Cambio Bajada Aguas Lluvias PVC',
    desc: 'Por ml. Retiro bajada deteriorada, instalación PVC 75mm o 100mm con abrazaderas y codo pie.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.18),
    marca: 'Tigre PVC 75/100mm',
  },
  {
    id: 'mant_canaleta_galv',
    nombre: 'Cambio Canaleta Galvanizada a Medida',
    desc: 'Por ml. Canaleta rectangular especial fabricada en zinc galvanizado, soldada con estaño, ganchos de pletina.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.35),
    marca: 'Plancha Galvanizada Lisa 0.4mm',
  },

  // --- PINTURA Y FACHADAS ---
  {
    id: 'mant_pintura_ext',
    nombre: 'Pintura Exterior Fachada Completa',
    desc: 'Por m². Lija, estucado grietas, sellador, 2 manos pintura exterior elastomérica.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(0.30),
    marca: 'Sipa 2000 exterior / Sherwin-Williams Loxon',
  },
  {
    id: 'mant_pintura_int',
    nombre: 'Pintura Interior (Empaste + 2 manos látex)',
    desc: 'Por m². Empaste fino, lija, imprimación y 2 manos látex lavable premium.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.22),
    marca: 'Sherwin-Williams ProMar / Sipa Interior',
  },
  {
    id: 'mant_lavado_presion',
    nombre: 'Lavado a Presión de Fachada',
    desc: 'Por m². Hidrolimpiadora 200 bar. Sin andamios hasta 4m.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: 0,
    marca: 'Karcher K7 / Hidrolimpiadora profesional',
  },

  // --- GRIETAS, SELLOS Y PEQUEÑAS REPARACIONES ---
  {
    id: 'mant_grietas',
    nombre: 'Reparación Grietas / Fisuras',
    desc: 'Por ml. Apertura en V, relleno mortero fibrado, malla antifisura, empaste y pintura en zona.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.15),
    marca: 'Sika MonoTop 412N / Masilla fibra',
  },
  {
    id: 'mant_silicona',
    nombre: 'Cambio Silicona Marcos Ventanas',
    desc: 'Por ml. Retiro silicona vieja, limpieza, fondo y aplicación sellador neutro UV.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.18),
    precioMat_clp: ufToClp(0.06),
    marca: 'Sika Silicone N / Dow Corning 795',
  },
  {
    id: 'mant_ajuste_puerta',
    nombre: 'Ajuste Puerta / Ventana (Vientos + Engrase)',
    desc: 'Por pieza. Ajuste bisagras, rebaje marco, lubricación y ajuste cerrojo.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.05),
    marca: '—',
  },
  {
    id: 'mant_informe',
    nombre: 'Informe Estado General Inmueble (Técnico)',
    desc: 'Inspección visual completa, informe escrito con fotografías y presupuesto correctivo detallado.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(1.80),
    precioMat_clp: 0,
    marca: 'Informe escrito + fotografías HV',
  },
  {
    id: 'mant_reparacion_drywall',
    nombre: 'Reparación Placa Drywall / Volcanita (Impacto o Humedad)',
    desc: 'Por ud. Corte del área dañada, instalación de parche con perfilería, masilla, cinta, empaste y pintura.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.30),
    marca: 'Volcán Placa 10mm / Romeral',
  },
  {
    id: 'mant_cambio_cerradura',
    nombre: 'Cambio de Cerradura Puerta Principal',
    desc: 'Retiro de cerradura existente, instalación de cerradura de seguridad con cilindro europeo o multipunto. Entrega de 3 llaves.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.50),
    precioMat_clp: ufToClp(0.80),
    marca: 'Op.A: Poli Segurex / Scanavini | Op.B: Mottura / Cisa',
  },
];

// ── TERMINACIONES / PISOS / PINTURA ───────────────────────
const terminacionesItems = [

  // --- 1. PREPARACIÓN DE MUROS Y CIELOS ---
  {
    id: 'term_yeso_muro',
    nombre: 'Revoque de Yeso en Muros (Obra Nueva)',
    desc: 'Por m². Yeso proyectado o manual para nivelar y aplomar muros. Incluye puente adherente.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.25),
    marca: 'Yeso Romeral / Volcán',
  },
  {
    id: 'term_pasta_muro_int',
    nombre: 'Empaste Completo Muro Interior',
    desc: 'Por m². 2 manos pasta muro, lijado profundo y sellador fijador. Listo para pintar.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.15),
    marca: 'Pasta Muro Sipa / Sherwin Williams',
  },
  {
    id: 'term_pasta_muro_ext',
    nombre: 'Empaste Muro Exterior (Pasta Acrílica)',
    desc: 'Por m². Pasta exterior elastomérica resistente al agua y dilataciones. Lijado y sello.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.20),
    marca: 'Pasta Acrílica Ceresita / Sipa',
  },
  {
    id: 'term_tratamiento_juntas',
    nombre: 'Tratamiento de Juntas Volcanita',
    desc: 'Por ml. Cinta papel/fibra de vidrio, masilla base y terminación en uniones de tabiques secos.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.15),
    precioMat_clp: ufToClp(0.08),
    marca: 'Masilla Base Volcán / Romeral',
  },

  // --- 2. PINTURAS ---
  {
    id: 'term_pintura_int_latex',
    nombre: 'Pintura Interior Látex (2 manos)',
    desc: 'Por m². Sobre superficie preparada.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.15),
    marca: 'Sherwin Williams ProMar / Sipa',
  },
  {
    id: 'term_pintura_cielo',
    nombre: 'Pintura de Cielos',
    desc: 'Por m². Pintura antirreflejo especial para cielos. Trabajo hasta 2.8m altura estándar.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.12),
    marca: 'Sipa Cielo / Ceresita',
  },
  {
    id: 'term_pintura_ext_elastom',
    nombre: 'Pintura Exterior Elastomérica',
    desc: 'Por m². Alta resistencia UV e impermeabilidad para fachadas. 2 manos rodillo y brocha.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.28),
    marca: 'Sherwin Williams Loxon / Ceresita',
  },
  {
    id: 'term_pintura_texturada',
    nombre: 'Revestimiento Texturado / Martillina',
    desc: 'Por m². Acrílico texturado grano medio/fino con llana o rodillo de textura.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(0.45),
    marca: 'Martillina Sipa / Texturas Coraza',
  },
  {
    id: 'term_pintura_esmalte_sint',
    nombre: 'Pintura Esmalte Sintético (Puertas y Marcos)',
    desc: 'Por m². Lija suave + esmalte sintético o poliuretano en puertas madera o marcos metálicos.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.20),
    marca: 'Chilcorrofin / Sipa Esmalte',
  },
  {
    id: 'term_barniz_madera',
    nombre: 'Barniz / Protector Maderas (Cerchas / Vigas)',
    desc: 'Por m². Lija + impregnante o barniz marino protección UV para maderas a la vista.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.25),
    marca: 'Cerestain / Barniz Marino Sipa',
  },

  // --- 3. REVESTIMIENTOS DE MUROS ---
  {
    id: 'term_papel_mural',
    nombre: 'Instalación de Papel Mural',
    desc: 'Por m². Adhesivo celulósico + plomada. Muro liso requerido (no incluye empaste).',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.35),
    marca: 'Colowall / Muresco',
  },
  {
    id: 'term_siding_pvc',
    nombre: 'Siding PVC / Fibrocemento (Exterior)',
    desc: 'Por m². Perfiles inicio, esquineros, lamas de siding. Incluye barrera de humedad.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.85),
    marca: 'DVP Siding / Pizarreño Cedral',
  },
  {
    id: 'term_fachaleta',
    nombre: 'Fachaleta / Enchape Ladrillo o Piedra',
    desc: 'Por m². Mortero adhesivo, fraguado de canterías.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.85),
    precioMat_clp: ufToClp(0.90),
    marca: 'Ladrillo Princesa / Piedras Klipen',
  },
  {
    id: 'term_panel_3d',
    nombre: 'Paneles 3D / Palillaje MDF (Interior)',
    desc: 'Por m². Fijación de paneles MDF ranurado o PVC 3D decorativos.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(1.10),
    marca: 'Arauco / Paneles Decorativos Importados',
  },
  {
    id: 'term_microcemento_muro',
    nombre: 'Microcemento Decorativo en Muros',
    desc: 'Por m². Base, malla, microcemento pigmentado (2 manos), sellador poliuretano. Acabado industrial/moderno.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.10),
    precioMat_clp: ufToClp(1.20),
    marca: 'Topcret / Cemento Design',
  },

  // --- 4. PISOS MADERA Y FLOTANTES ---
  {
    id: 'term_piso_flotante_ac4',
    nombre: 'Instalación Piso Flotante AC4',
    desc: 'Por m². Foam nivelación 2mm, guardapolvos MDF, umbrales. El cliente aporta el piso.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.50),
    marca: 'Kronotex Robusto / Quick-Step Impressive',
  },
  {
    id: 'term_piso_flotante_ac5',
    nombre: 'Instalación Piso Flotante Premium AC5',
    desc: 'Por m². Alto tráfico resistente al agua, foam, instalación y perfiles transición.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.80),
    marca: 'Quick-Step Impressive Ultra / Pergo',
  },
  {
    id: 'term_vinilico_spc',
    nombre: 'Instalación Vinílico SPC Click',
    desc: 'Por m². Rígido resistente 100% al agua con manta integrada. Ideal baños y cocinas.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.65),
    marca: 'Laminam / COREtec Plus',
  },
  {
    id: 'term_madera_solida',
    nombre: 'Instalación Piso Madera Sólida / Parquet',
    desc: 'Por m². Pegado de tablas, pulido con máquina, sellado, 3 manos vitrificante.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(1.50),
    marca: 'Parquet Chile / Madera Nativa (Roble/Mañío)',
  },
  {
    id: 'term_vitrificado',
    nombre: 'Pulido y Vitrificado de Madera Existente',
    desc: 'Por m². Pulido profundo, sellado juntas, 3 manos barniz poliuretano alto tráfico.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.40),
    marca: 'Bona / Loba Poliuretano',
  },

  // --- 5. PISOS CERÁMICOS Y PORCELANATOS ---
  {
    id: 'term_ceramica_piso',
    nombre: 'Instalación Cerámica Estándar (hasta 45×45)',
    desc: 'Por m². Adhesivo normal, fragüe estándar.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.50),
    marca: 'Cordillera / Celima',
  },
  {
    id: 'term_porcelanato_60',
    nombre: 'Instalación Porcelanato 60×60',
    desc: 'Por m². Adhesivo flexible DA, fragua, niveladores de cuña.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.85),
    marca: 'Grès d\'Alsace / Corona',
  },
  {
    id: 'term_porcelanato_madera',
    nombre: 'Instalación Porcelanato Tipo Madera (20×120)',
    desc: 'Por m². Formato tabla, traslape al 20%, doble encolado, clips niveladores.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.95),
    precioMat_clp: ufToClp(0.90),
    marca: 'Klipen / Portinari',
  },
  {
    id: 'term_porcelanato_90',
    nombre: 'Instalación Porcelanato Gran Formato (90×90 o mayor)',
    desc: 'Por m². Rectificado, ventosas, doble encolado adhesivo reforzado SF.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(1.30),
    marca: 'Novoceram Grande / Porcelanosa',
  },
  {
    id: 'term_microcemento_piso',
    nombre: 'Microcemento Decorativo en Pisos',
    desc: 'Por m². Alto tráfico, malla fibra de vidrio, resinas y vitrificado poliuretano final.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.30),
    precioMat_clp: ufToClp(1.60),
    marca: 'Topcret / Cemento Design',
  },

  // --- 6. MUROS BAÑO / COCINA Y DETALLES ---
  {
    id: 'term_ceramica_muro',
    nombre: 'Cerámica / Porcelanato en Muros (Baño/Cocina)',
    desc: 'Por m². Corte, perforación artefactos, adhesivo DA, fragua, cantoneras aluminio o PVC en esquinas.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.85),
    precioMat_clp: ufToClp(0.65),
    marca: 'Corona / Cordillera Muro',
  },
  {
    id: 'term_mosaico',
    nombre: 'Instalación Mosaico / Subway Decorativo',
    desc: 'Por m². Mosaicos en mallas o subway pequeñas. Plomo perfecto, fragüe epóxico o fino.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.10),
    precioMat_clp: ufToClp(0.95),
    marca: 'Klipen Mosaicos / Hisbalit',
  },
  {
    id: 'term_guardapolvo',
    nombre: 'Instalación Guardapolvos / Zócalos',
    desc: 'Por ml. Corte inglete, MDF o PVC, clavos terminación o adhesivo de montaje.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.08),
    precioMat_clp: ufToClp(0.12),
    marca: 'Arauco MDF / DVP PVC',
  },
  {
    id: 'term_cornisas',
    nombre: 'Instalación de Cornisas (Cielo-Muro)',
    desc: 'Por ml. Corte inglete, cornisas poliestireno extruido pegadas. Sello acrílico en uniones.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.12),
    precioMat_clp: ufToClp(0.10),
    marca: 'Nomastyl / DVP',
  },
  {
    id: 'term_fraguado',
    nombre: 'Renovación de Fragüe (Baños/Cocinas)',
    desc: 'Por m². Raspado y retiro de fragüe antiguo, fragüe antihongos nuevo y limpieza profunda.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.08),
    marca: 'Bekron / Sika Ceram',
  },

  // --- 7. PUERTAS, VENTANAS Y MOBILIARIO ---
  {
    id: 'term_puerta_interior',
    nombre: 'Instalación Puerta Interior MDF (con marco)',
    desc: 'Cuadratura vano, puerta MDF lisa o rebajada + marco + chambrana + bisagras + cerradura.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.85),
    marca: 'Masonite Molded / Arauco MDF',
  },
  {
    id: 'term_puerta_exterior',
    nombre: 'Instalación Puerta Exterior Metálica/Sólida',
    desc: 'Puerta pesada, marco metálico o madera nativa, cerradura multipunto de seguridad, sellado de vano.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.10),
    precioMat_clp: ufToClp(2.50),
    marca: 'Segurex / Puertas Oregón',
  },
  {
    id: 'term_ventana_termo_pvc',
    nombre: 'Instalación Ventana PVC Termopanel',
    desc: 'Nivelación, fijación ventana PVC termopanel, sellado estructural con espuma poliuretano y silicona.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.85),
    precioMat_clp: ufToClp(3.20),
    marca: 'Rehau Euro 60 / VEKA Softline 82',
  },
  {
    id: 'term_closet_basico',
    nombre: 'Instalación Closet MDF (2 puertas)',
    desc: 'Módulos internos, 2 puertas correderas, cajonera básica, instalación anclada y aplomada.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.40),
    precioMat_clp: ufToClp(3.20),
    marca: 'Arauco MDF 18mm + rieles Hettich',
  },
  {
    id: 'term_mueble_cocina',
    nombre: 'Instalación Mueble Cocina Completo (Bajo+Alto)',
    desc: 'Por ml lineal de mueble. Armado, nivelación, fijación módulos MDF. Bisagras retén, rieles telescópicos.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(1.60),
    precioMat_clp: ufToClp(4.20),
    marca: 'Arauco MDF + herrajes Blum',
  },
  {
    id: 'term_meson_silestone',
    nombre: 'Instalación Mesón Cocina Silestone / Cuarzo',
    desc: 'Por ml lineal. Instalación superficie sólida, cortes en terreno, rebaje fregadero, faldón recto.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(4.80),
    marca: 'Cosentino Silestone',
  },
];

// ── ENERGÍAS RENOVABLES / ESPECIALES ──────────────────────
const energiasItems = [
  {
    id: 'ener_panel_3kw',
    nombre: 'Kit Solar Residencial 3kW (6 paneles + Inversor)',
    desc: '6 paneles 500W + inversor monofásico + estructura soporte + cableado CC/CA + protecciones. Incluye instalación y puesta en marcha.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(6.00),
    precioMat_clp: ufToClp(38.00),
    marca: 'Huawei SUN2000-3KTL + JA Solar 500W',
    normativa: 'Requiere TE1 eléctrico y tramitación distribuidora',
  },
  {
    id: 'ener_panel_5kw',
    nombre: 'Kit Solar 5kW (10 paneles + Inversor)',
    desc: '10 paneles 500W + inversor monofásico con optimizadores + estructura + cableado CC/CA + protecciones. Incluye instalación.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(8.00),
    precioMat_clp: ufToClp(58.00),
    marca: 'SolarEdge SE5K + Jinko 500W',
    normativa: 'Tramitación PMGD ante distribuidora eléctrica',
  },
  {
    id: 'ener_panel_10kw',
    nombre: 'Kit Solar 10kW (20 paneles + Inversor Trifásico)',
    desc: 'Sistema para alto consumo o PYME. Inversor trifásico, 20 paneles monocristalinos, monitoreo en nube.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(14.00),
    precioMat_clp: ufToClp(115.00),
    marca: 'Op.A: Huawei SUN2000-10KTL | Op.B: SMA STP10.0',
    normativa: 'Tramitación PMGD ante distribuidora',
  },
  {
    id: 'ener_bateria',
    nombre: 'Batería de Almacenamiento 10kWh',
    desc: 'Almacenamiento de energía solar para autoconsumo nocturno. Compatible con inversor híbrido.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.00),
    precioMat_clp: ufToClp(55.00),
    marca: 'BYD Battery-Box Premium HVS 10.2',
  },
  {
    id: 'ener_inversor_hibrido',
    nombre: 'Cambio a Inversor Híbrido (Solar + Batería)',
    desc: 'Reemplazo de inversor existente por modelo híbrido que gestiona red eléctrica, paneles solares y batería. Incluye configuración.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.00),
    precioMat_clp: ufToClp(20.00),
    marca: 'Op.A: Huawei SUN2000-5KTL-M1 | Op.B: GoodWe ET',
  },
  {
    id: 'ener_colector_solar',
    nombre: 'Colector Solar Agua Caliente (Termosifón 200L)',
    desc: 'Sistema solar térmico de circulación natural. Cubre hasta 80% del consumo de ACS. Incluye soporte, instalación hidráulica y conexión al calefont o termo eléctrico existente.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(4.00),
    precioMat_clp: ufToClp(20.00),
    marca: 'Solahart 302J / Chromagen',
  },
  {
    id: 'ener_bomba_calor',
    nombre: 'Bomba de Calor Agua Caliente 200L',
    desc: 'Extrae calor del aire ambiente para calentar agua. COP >3.5: consume 1 kWh para producir el equivalente a 3.5 kWh térmicos. Ahorro de 70% vs termo eléctrico convencional.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(3.00),
    precioMat_clp: ufToClp(22.00),
    marca: 'Op.A: Ariston Nuos Primo 200 | Op.B: Daikin Altherma',
  },
  {
    id: 'ener_cerco_electrico',
    nombre: 'Cerco Eléctrico Residencial',
    desc: 'Por ml. Postes, tensores, alambre inoxidable, energizador + teclado + sirena + conexión a alarma.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.55),
    precioMat_clp: ufToClp(0.40),
    marca: 'Nemtek Patriot / Energizer Chile',
  },
  {
    id: 'ener_cargador_ev',
    nombre: 'Instalación Cargador Vehículo Eléctrico (Wallbox)',
    desc: 'Carga tipo 2 (modo 3). Potencia hasta 7.4 kW en 1F o 22 kW en 3F. Incluye circuito 32A dedicado desde tablero, caja estanca IP44 y cargador.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(8.00),
    marca: 'Op.A: Wallbox Pulsar Plus | Op.B: ABB Terra AC',
    normativa: 'Circuito 32A dedicado SEC requerido',
  },
];

// ── JARDINERÍA Y PAISAJISMO ───────────────────────────────
const jardineriaItems = [

  // --- PREPARACIÓN DE TERRENO ---
  {
    id: 'jard_limpieza_terreno',
    nombre: 'Limpieza y Desmalezado (Manual/Mecánico)',
    desc: 'Por m². Retiro maleza, escombros, escarificado con rotovator y retiro a botadero.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.08),
    precioMat_clp: ufToClp(0.02),
    marca: 'Rotovator Husqvarna',
  },
  {
    id: 'jard_tierra_hoja',
    nombre: 'Sustrato Tierra de Hoja / Compost (5cm capa)',
    desc: 'Por m². Tierra de hoja harneada + compost orgánico para mejorar suelo antes de plantar.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.05),
    precioMat_clp: ufToClp(0.12),
    marca: 'Sustrato orgánico certificado / Armony',
  },

  // --- CÉSPED ---
  {
    id: 'jard_pasto_alfombra',
    nombre: 'Instalación Pasto Alfombra (Rollo Alto Tráfico)',
    desc: 'Por m². Palmetas/rollos césped natural (Festuca/Lolium o Bermuda). Nivelación fina, fertilizante iniciador, compactación, primer riego.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.10),
    precioMat_clp: ufToClp(0.15),
    marca: 'Op.A: Agrícola Nacional | Op.B: Pastos Premium',
  },
  {
    id: 'jard_pasto_siembra',
    nombre: 'Siembra de Césped Tradicional',
    desc: 'Por m². Cama de siembra, semillas, mantillo/arena, compactación ligera. Requiere riego diario 3 semanas por parte del cliente.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.06),
    precioMat_clp: ufToClp(0.06),
    marca: 'Semillas Anasac (Mezcla Estadio / Sombra)',
  },
  {
    id: 'jard_pasto_sint_25mm',
    nombre: 'Pasto Sintético 25mm (Paisajismo Estándar)',
    desc: 'Por m². Malla antimaleza, base arena compactada, cortes a medida, tape + adhesivo poliuretano, peinado final.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.15),
    precioMat_clp: ufToClp(0.40),
    marca: 'Op.A: Sporturf | Op.B: VerdeActivo 25mm',
  },
  {
    id: 'jard_pasto_sint_40mm',
    nombre: 'Pasto Sintético 40mm Premium (Alta Densidad)',
    desc: 'Por m². Hebras bicolor con rizoma interno, arena de sílice de lastre para máxima suavidad y aspecto natural.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.18),
    precioMat_clp: ufToClp(0.55),
    marca: 'Op.A: Tarkett Sports | Op.B: Realturf 40mm',
  },

  // --- RIEGO AUTOMÁTICO ---
  {
    id: 'jard_riego_matriz',
    nombre: 'Canalización Matriz Riego Automático (Zanja)',
    desc: 'Por ml. Excavación zanja 30cm, tubería matriz PVC hidráulico o HDPE, encolado y tapado.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.20),
    precioMat_clp: ufToClp(0.15),
    marca: 'Tuberías Tigre PVC / Planasa HDPE',
  },
  {
    id: 'jard_riego_aspersor',
    nombre: 'Punto de Riego (Aspersor/Difusor)',
    desc: 'Por punto. Collarín en matriz, difusor emergente pop-up o aspersor turbina, ajuste arco de riego.',
    unidad: 'pt',
    precioMO_clp:  ufToClp(0.25),
    precioMat_clp: ufToClp(0.20),
    marca: 'Op.A: Hunter PGP/PS Ultra | Op.B: Rain Bird 1804',
  },
  {
    id: 'jard_riego_goteo',
    nombre: 'Línea Riego por Goteo (Macizos y Arbustos)',
    desc: 'Por ml. Manguera polietileno ciega, goteros autocompensantes o línea integrada cada 30cm.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.08),
    precioMat_clp: ufToClp(0.12),
    marca: 'Op.A: Netafim | Op.B: Rivulis',
  },
  {
    id: 'jard_riego_valvula',
    nombre: 'Electroválvula 24VAC + Caja Enterrada',
    desc: 'Por ud. Electroválvula con llaves de corte PVC, conectores impermeables, caja protectora a nivel de suelo.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.50),
    precioMat_clp: ufToClp(0.70),
    marca: 'Op.A: Hunter PGV | Op.B: Rain Bird PGA',
  },
  {
    id: 'jard_riego_programador',
    nombre: 'Programador Riego WiFi (4–8 Zonas)',
    desc: 'Panel control a muro, cableado hacia electroválvulas, sensor lluvia, configuración app móvil Smart Watering.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(2.50),
    marca: 'Op.A: Hunter HC Hydrawise | Op.B: Orbit B-hyve',
  },

  // --- PAISAJISMO Y PLANTACIÓN ---
  {
    id: 'jard_plantacion_arbusto',
    nombre: 'Plantación de Arbustos / Macizos Florales',
    desc: 'Por ud. Hoyo, fertilizante de fondo, planta ornamental 10–20L, taza de riego.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.10),
    precioMat_clp: ufToClp(0.15),
    marca: 'Sustrato + Fertilizante Basacote',
  },
  {
    id: 'jard_plantacion_arbol',
    nombre: 'Plantación Árbol Frutal / Ornamental (>1.5m)',
    desc: 'Por ud. Excavación profunda, árbol joven, tutor madera con amarra elástica, tierra enriquecida.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.45),
    marca: 'Árbol vivero + Tutor madera tratada',
  },
  {
    id: 'jard_aridos_cuarzo',
    nombre: 'Gravilla / Cuarzo / Mulch Decorativo',
    desc: 'Por m². Malla geotextil fijada con grapas + capa árido decorativo o corteza de pino 4–5cm.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.12),
    precioMat_clp: ufToClp(0.28),
    marca: 'Malla Geotextil + Cuarzo blanco / Mulch Arauco',
  },
  {
    id: 'jard_pastelones',
    nombre: 'Senderos: Pastelones / Piedra Laja',
    desc: 'Por m². Excavación, cama de arena estabilizadora, pastelones prefabricados o piedra natural.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.45),
    marca: 'Pastelones Grau / Piedra Laja dimensionada',
  },
  {
    id: 'jard_bordadura',
    nombre: 'Bordaduras / Separadores de Ambientes',
    desc: 'Por ml. Solerillas hormigón, rollos madera impregnada o separadores plásticos.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.08),
    precioMat_clp: ufToClp(0.07),
    marca: 'Op.A: Solerilla Hormigón | Op.B: FlexBord Plástico',
  },
  {
    id: 'jard_pergola',
    nombre: 'Pérgola de Madera / Metalcon (Estructura)',
    desc: 'Por m² de sombra generada. Pilares, vigas maestras y enrejado superior en madera impregnada o perfiles metalcon. Sin cubierta (se cotiza por separado).',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(1.80),
    marca: 'Pino 4x4 impregnado / Metalcon estructural',
  },

  // --- MANTENCIÓN Y TRATAMIENTOS ---
  {
    id: 'jard_mantencion_basica',
    nombre: 'Mantención Áreas Verdes (hasta 100m²)',
    desc: 'Corte césped máquina rotativa, orillado, hojarasca, picado tazas, revisión emisores. Global por visita.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(1.00),
    precioMat_clp: ufToClp(0.10),
    marca: 'Husqvarna / Stihl',
  },
  {
    id: 'jard_poda_formacion',
    nombre: 'Poda Formación y Saneamiento (Árboles >3m)',
    desc: 'Por árbol. Poda en altura, ramas secas/chupones, sellado cortes con pasta poda, retiro biomasa.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.30),
    marca: 'Pasta de Poda Anasac',
  },
  {
    id: 'jard_fumigacion',
    nombre: 'Fumigación / Tratamiento Fitosanitario',
    desc: 'Global por visita. Insecticidas, acaricidas o fungicidas sistémicos para control de plagas u hongos.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.40),
    marca: 'Productos Anasac (Dimeclor, Mamboretá)',
  },
];

// ── HERRERÍA, ESTRUCTURAS METÁLICAS Y HOJALATERÍA ─────────
const herreriaHojalateriaItems = [

  // --- ESTRUCTURAS METÁLICAS Y REJAS ---
  {
    id: 'herr_reja_perimetral',
    nombre: 'Fabricación e Instalación Reja Perimetral',
    desc: 'Por ml. Perfil tubular o cuadrado, pilares anclados a cimiento, anticorrosivo y esmalte final.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(1.60),
    marca: 'Perfiles Cintac / Pintura Tricolor',
  },
  {
    id: 'herr_porton_corredera',
    nombre: 'Fabricación Portón Corredera (Estructura)',
    desc: 'Por m². Perfilería metálica reforzada, riel, pomeles invertidos y guía superior. (Motor no incluido).',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.80),
    precioMat_clp: ufToClp(2.50),
    marca: 'Acero Estructural Cintac / Rieles Ducasse',
  },
  {
    id: 'herr_puerta_peatonal',
    nombre: 'Fabricación Puerta Peatonal de Reja',
    desc: 'A medida, bisagras soldadas alta resistencia, caja chapa eléctrica y cerrojo.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(3.20),
    marca: 'Perfiles Cintac / Cerradura Poli / Scanavini',
  },
  {
    id: 'herr_proteccion_ventana',
    nombre: 'Protecciones Metálicas para Ventanas',
    desc: 'Por m². Fierro macizo redondo/cuadrado o perfil tubular. Anclaje químico a muro.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(1.10),
    precioMat_clp: ufToClp(1.40),
    marca: 'Fierro Macizo A630 / Anclaje Sika AnchorFix',
  },
  {
    id: 'herr_baranda_metalica',
    nombre: 'Baranda Metálica (Escaleras y Balcones)',
    desc: 'Por ml. Estructura soldada MIG/Arco, altura normativa, pasamanos liso y pintura terminada.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.90),
    precioMat_clp: ufToClp(1.10),
    marca: 'Perfiles Tubulares / Soldadura Indura',
    normativa: 'OGUC — Altura mínima barandas',
  },
  {
    id: 'herr_baranda_inox',
    nombre: 'Baranda Acero Inoxidable AISI 316',
    desc: 'Por ml. Pasamanos y montantes en tubo inox pulido espejo o cepillado. Ideal balcones y piscinas.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(3.00),
    marca: 'Acero Inox AISI 316 / Tubos Inox importados',
  },
  {
    id: 'herr_escalera_metalica',
    nombre: 'Fabricación Escalera Metálica Recta',
    desc: 'Perfiles C o canal U, peldaños plancha diamantada. Anclaje y pintura base.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(6.50),
    precioMat_clp: ufToClp(9.00),
    marca: 'Acero Estructural A36 / Plancha Diamantada',
  },
  {
    id: 'herr_reparacion_soldadura',
    nombre: 'Reparación Puntual Soldadura (Visita)',
    desc: 'Resoldar bisagras, picaportes, correcciones portón caído. Esmerilado y retoque.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.30),
    marca: 'Soldadura Indura 6011/7018',
  },
  {
    id: 'herr_malla_sombra',
    nombre: 'Instalación Malla Raschel / Sombra (Pérgola)',
    desc: 'Por m². Instalación de malla sombra 80% o raschel tensada sobre estructura existente. Tensores inox.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.40),
    marca: 'Malla Raschel 80% / Sombra Plantex',
  },

  // --- HOJALATERÍA Y DUCTOS ---
  {
    id: 'hoja_campana_quincho',
    nombre: 'Campana para Quincho a Medida',
    desc: 'Acero galvanizado o zinc-alum, diseño trapezoidal o piramidal, anclaje a muro/techo.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(2.00),
    precioMat_clp: ufToClp(3.50),
    marca: 'Acero Galvanizado 0.5mm / 0.8mm',
  },
  {
    id: 'hoja_caja_calefont',
    nombre: 'Gabinete Protector para Calefont',
    desc: 'Caja metálica galvanizada a medida con puerta, celosías de ventilación normativa y gorro.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(1.30),
    marca: 'Acero Galvanizado',
    normativa: 'SEC — Ventilación requerida DS66',
  },
  {
    id: 'hoja_ducto_extraccion',
    nombre: 'Ducto de Extracción Metálico (por metro lineal)',
    desc: 'Por ml. Ductería redonda zinc-alum para campanas o quinchos. Uniones selladas con cinta aluminio.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.40),
    precioMat_clp: ufToClp(0.70),
    marca: 'Zinc-alum / Galvanizado',
  },
  {
    id: 'hoja_gorro_ventilacion',
    nombre: 'Gorro Chino / Sombrerete Eólico',
    desc: 'Instalación de remate de ventilación en techumbre. Forro pasa-techo y sellado asfáltico.',
    unidad: 'ud',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(1.20),
    marca: 'SikaFlex / Tapagoteras',
  },
  {
    id: 'hoja_canaleta_medida',
    nombre: 'Canaleta Aguas Lluvias Galvanizada a Medida',
    desc: 'Por ml. Canaleta rectangular especial, soldada estaño, ganchos pletina a tapacán.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.45),
    precioMat_clp: ufToClp(0.35),
    marca: 'Plancha Galvanizada Lisa 0.4mm',
  },
  {
    id: 'hoja_forro_techumbre',
    nombre: 'Plegado e Instalación Forros / Limahoyas',
    desc: 'Por ml. Forros de borde, cortagoteras, limahoyas o limatesas en plancha lisa. Fijación y sellado.',
    unidad: 'ml',
    precioMO_clp:  ufToClp(0.30),
    precioMat_clp: ufToClp(0.25),
    marca: 'Zinc-alum Liso',
  },
];

// ── URGENCIAS 24/7 ────────────────────────────────────────
// Urgencias expresadas en CLP directos (montos fijos).
// Se incluyen en calcularUF para mantener coherencia del modelo.
const urgenciaItems = [
  {
    id: 'urg_fuga_agua',
    nombre: 'Fuga de Agua (Urgencia 24/7)',
    desc: 'Corte general, diagnóstico con detector de humedad, reparación o tapón provisional hasta normalizar suministro. Recargo urgencia incluido.',
    unidad: 'gl',
    precioMO_clp:  98_000,
    precioMat_clp: 22_000,
    marca: '—',
    urgencia: true,
  },
  {
    id: 'urg_destape_wc',
    nombre: 'Destape W.C. / Ducha (Urgencia 24/7)',
    desc: 'Destape mecánico urgente WC, ducha o lavamanos. Sonda motorizada. Prueba y limpieza del área.',
    unidad: 'gl',
    precioMO_clp:  88_000,
    precioMat_clp: 0,
    marca: '—',
    urgencia: true,
  },
  {
    id: 'urg_corte_luz',
    nombre: 'Corte de Luz / Falla Eléctrica (Urgencia 24/7)',
    desc: 'Diagnóstico tablero, restablecimiento suministro, cambio disyuntor quemado. Respuesta <2h.',
    unidad: 'gl',
    precioMO_clp:  95_000,
    precioMat_clp: 15_000,
    marca: 'Schneider / Legrand (disyuntores)',
    urgencia: true,
  },
  {
    id: 'urg_calefont',
    nombre: 'Calefont Apagado / Sin Agua Caliente (Urgencia)',
    desc: 'Diagnóstico calefont gas o eléctrico, reemplazo termopar, electroválvula o módulo ignición.',
    unidad: 'gl',
    precioMO_clp:  78_000,
    precioMat_clp: 25_000,
    marca: 'Rheem / Bosch / Midas (repuestos OEM)',
    urgencia: true,
  },
  {
    id: 'urg_filtracion_lluvia',
    nombre: 'Filtración por Lluvia (Urgencia)',
    desc: 'Impermeabilización provisional con membrana líquida, tarquín y cubierta temporal. Solución hasta 48h antes de reparación definitiva.',
    unidad: 'gl',
    precioMO_clp:  88_000,
    precioMat_clp: 35_000,
    marca: 'SikaTop Seal / Ormiflex líquida',
    urgencia: true,
  },
  {
    id: 'urg_vidrio',
    nombre: 'Reemplazo Vidrio Roto (Urgencia)',
    desc: 'Retiro vidrio roto, instalación vidrio simple o DVH de emergencia, sellado perímetro.',
    unidad: 'gl',
    precioMO_clp:  68_000,
    precioMat_clp: 35_000,
    marca: 'Cristalerías / Guardian Glass',
    urgencia: true,
  },
  {
    id: 'urg_gas_fuga',
    nombre: 'Fuga de Gas (Urgencia CRÍTICA 24/7)',
    desc: 'Corte de suministro en medidor, detección de punto de fuga con detector electrónico, reparación o sellado provisional. Prueba de estanqueidad post-reparación.',
    unidad: 'gl',
    precioMO_clp:  115_000,
    precioMat_clp: 20_000,
    marca: 'Detector gas Honeywell / Swagelok',
    urgencia: true,
    normativa: 'SEC — Notificación obligatoria post-intervención',
  },
  {
    id: 'urg_inundacion',
    nombre: 'Inundación / Anegamiento (Urgencia)',
    desc: 'Extracción de agua con bomba sumergible, diagnóstico de origen (cañería/lluvia), secado con sopladores industriales y reporte fotográfico para aseguradora.',
    unidad: 'gl',
    precioMO_clp:  125_000,
    precioMat_clp: 15_000,
    marca: 'Bomba Sumergible Grundfos / Soplador Industrial',
    urgencia: true,
  },
];

// ── ARQUITECTURA / TRÁMITES ───────────────────────────────
const tramitesItems = [
  {
    id: 'tram_levantamiento',
    nombre: 'Levantamiento Planos Existentes + Expediente DOM',
    desc: 'Por m². Levantamiento de planos, expediente técnico, firma profesional y gestión ante DOM.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.21),
    precioMat_clp: ufToClp(0.09),
    marca: 'Arquitecto habilitado CA',
    normativa: '0.30 UF/m² — Obligatorio regularización',
  },
  {
    id: 'tram_proyecto_arq',
    nombre: 'Proyecto Arquitectura Nuevo (Planta+Corte+Elevación)',
    desc: 'Por m². Planta, cortes, elevaciones, EETT y memorias. Listo para DOM.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.35),
    precioMat_clp: ufToClp(0.15),
    marca: 'Arquitecto — Colegio de Arquitectos Chile',
  },
  {
    id: 'tram_calculo_estructural',
    nombre: 'Proyecto Estructural (Ing. Civil)',
    desc: 'Por m². Memoria de cálculo NCh 433 + NCh 2369 (sismo), planos estructurales para DOM.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.28),
    precioMat_clp: ufToClp(0.12),
    marca: 'Ing. Civil Estructural — CICH',
    normativa: 'NCh 433 + NCh 2369',
  },
  {
    id: 'tram_te1',
    nombre: 'Certificado Eléctrico TE1 + Plano Firmado SEC',
    desc: 'Por m². Tramitación Certificado de Instalación Eléctrica TE1.',
    unidad: 'm²',
    precioMO_clp:  ufToClp(0.07),
    precioMat_clp: ufToClp(0.03),
    marca: 'Instalador A/B SEC',
    normativa: '0.10 UF/m² — Necesario para recepción final',
  },
  {
    id: 'tram_gas_sec',
    nombre: 'Certificado Instalación Gas (SEC)',
    desc: 'Inspección red gas, corrección no conformidades, prueba estanqueidad y emisión certificado.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(0.84),
    precioMat_clp: ufToClp(0.36),
    marca: 'Instalador gas SEC',
    normativa: 'DS66',
  },
  {
    id: 'tram_sanitario',
    nombre: 'Certificado Sanitario (SESMA/SEREMI)',
    desc: 'Tramitación certificado sanitario para establecimientos o negocios.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(0.70),
    precioMat_clp: ufToClp(0.30),
    marca: '—',
  },
  {
    id: 'tram_permiso',
    nombre: 'Gestión Permiso de Edificación DOM',
    desc: 'Coordinación y presentación del expediente completo ante la DOM. Honorarios variables según complejidad.',
    unidad: 'gl',
    precioMO_clp:  0,
    precioMat_clp: 0,
    marca: '—',
    normativa: 'Según arancel municipal',
  },
  {
    id: 'tram_estudio_suelo',
    nombre: 'Estudio de Suelo SPT (Sondaje + Informe)',
    desc: 'Sondaje Standard Penetration Test, informe geotécnico con recomendación de fundaciones.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(2.80),
    precioMat_clp: ufToClp(1.20),
    marca: 'Laboratorio ALS / SGS Chile',
  },
  {
    id: 'tram_topografia',
    nombre: 'Topografía Georeferenciada',
    desc: 'Levantamiento topográfico con GPS RTK. Curvas de nivel y planimetría.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(1.75),
    precioMat_clp: ufToClp(0.75),
    marca: 'Equipos GPS RTK Leica',
  },
  {
    id: 'tram_calculo_sismico',
    nombre: 'Cálculo Sísmico Refuerzo NCh 433',
    desc: 'Análisis sísmico de estructura existente o nueva. Propuesta de refuerzo.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(3.50),
    precioMat_clp: ufToClp(1.50),
    marca: 'Ing. Civil Estructural',
    normativa: 'NCh 433',
  },
  {
    id: 'tram_inspeccion_tecnica',
    nombre: 'Inspección Técnica de Obras (ITO) — Visita',
    desc: 'Visita de inspector técnico externo para verificar el cumplimiento de especificaciones en obra en ejecución. Informe escrito.',
    unidad: 'gl',
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: 0,
    marca: 'ITO — Colegio Ingenieros o Arquitectos',
  },
];

// ════════════════════════════════════════════════════════════
//  ENSAMBLAJE FINAL — SERVICIOS_DETALLE
// ════════════════════════════════════════════════════════════

export const SERVICIOS_DETALLE = {
  gasfiteria: {
    label:  'Gasfitería & Sanitaria',
    emoji:  '🚿',
    color:  '#3498DB',
    items:  calcularUF(gasfiteriaItems),
  },
  electricidad: {
    label:  'Electricidad',
    emoji:  '⚡',
    color:  '#F39C12',
    items:  calcularUF(electricidadItems),
  },
  climatizacion: {
    label:  'Climatización',
    emoji:  '❄️',
    color:  '#1ABC9C',
    items:  calcularUF(climatizacionItems),
  },
  terminaciones: {
    label:  'Pisos, Pintura & Terminaciones',
    emoji:  '🏠',
    color:  '#9B59B6',
    items:  calcularUF(terminacionesItems),
  },
  energias: {
    label:  'Energías Renovables',
    emoji:  '☀️',
    color:  '#F1C40F',
    items:  calcularUF(energiasItems),
  },
  mantenimiento: {
    label:  'Mantención & Reparaciones',
    emoji:  '🔧',
    color:  '#E67E22',
    items:  calcularUF(mantenimientoItems),
  },
  herreria_hojalateria: {
    label:  'Herrería & Hojalatería',
    emoji:  '🛠️',
    color:  '#7F8C8D',
    items:  calcularUF(herreriaHojalateriaItems),
  },
  tramites: {
    label:  'Arquitectura & Trámites',
    emoji:  '📐',
    color:  '#2ECC71',
    items:  calcularUF(tramitesItems),
  },
  jardineria: {
    label:  'Jardinería & Paisajismo',
    emoji:  '🌿',
    color:  '#27AE60',
    items:  calcularUF(jardineriaItems),
  },
  urgencias: {
    label:  'Urgencias 24/7',
    emoji:  '🚨',
    color:  '#E74C3C',
    items:  calcularUF(urgenciaItems),
  },
};

// ════════════════════════════════════════════════════════════
//  PROYECTOS — Sub-ítems detallados
//  Nota: subItems tienen { ufRef } = precio TOTAL referencial
//  (MO + Mat ya incluidos). Son orientativos para presupuestar
//  proyectos complejos en terreno.
// ════════════════════════════════════════════════════════════

// =============================================================================
//  PROYECTOS_DATA — Versión Completa y Exhaustiva
//  Cubre TODAS las partidas: estructura, terminaciones por recinto, instalaciones
//  eléctricas (canalización, tablero, puntos), gasfitería, sanitaria y más.
//  Unidad de precio: UF (referencial mano de obra + material básico, Santiago)
// =============================================================================

export const PROYECTOS_DATA = {

  // ══════════════════════════════════════════════════════════════════════════
  // 1. SEGUNDOS PISOS
  // ══════════════════════════════════════════════════════════════════════════
  segundos_pisos: {
    label:  'Segundos Pisos',
    emoji:  '🏗️',
    ufMin:  12,
    ufMax:  22,
    unidad: 'm²',
    desc:   'Todo desde cero: losa, muros, techo, instalaciones completas y terminaciones por recinto.',

    grupos: [

      // ── A. ENTREPISO Y ESTRUCTURA HORIZONTAL ──────────────────────────────
      {
        id: 'sp_A',
        nombre: 'Entrepiso y Estructura Horizontal',
        items: [
          { id: 'sp_A01', nombre: 'Losa hormigón armado H25 (moldaje + fierro ø8 + hormigonado + vibrado)', unidad: 'm²', ufRef: 3.20 },
          { id: 'sp_A02', nombre: 'Losa colaborante (plancha acero deck + hormigón H20 7cm)', unidad: 'm²', ufRef: 2.80 },
          { id: 'sp_A03', nombre: 'Entrepiso viguetas madera pino seco + OSB 18mm', unidad: 'm²', ufRef: 1.80 },
          { id: 'sp_A04', nombre: 'Entrepiso viguetas metalcon 200mm + OSB 18mm', unidad: 'm²', ufRef: 2.10 },
          { id: 'sp_A05', nombre: 'Viga de amarre perimetral (cadena) hormigón armado', unidad: 'ml', ufRef: 0.45 },
          { id: 'sp_A06', nombre: 'Pilar hormigón armado nuevo (incluye moldaje + enfierradura)', unidad: 'ud', ufRef: 1.20 },
          { id: 'sp_A07', nombre: 'Pilar metalcon estructural 150mm', unidad: 'ud', ufRef: 0.60 },
          { id: 'sp_A08', nombre: 'Viga de madera laminada / LVL (apoyada en muros existentes)', unidad: 'ml', ufRef: 0.90 },
          { id: 'sp_A09', nombre: 'Dintel de acero HEB (apertura vano existente)', unidad: 'ud', ufRef: 2.50 },
          { id: 'sp_A10', nombre: 'Impermeabilización losa (membrana líquida + geotextil)', unidad: 'm²', ufRef: 0.55 },
          { id: 'sp_A11', nombre: 'Relleno liviano polestireno expandido + mortero (sobre losa)', unidad: 'm²', ufRef: 0.40 },
        ],
      },

      // ── B. MUROS Y TABIQUES ───────────────────────────────────────────────
      {
        id: 'sp_B',
        nombre: 'Muros y Tabiques',
        items: [
          { id: 'sp_B01', nombre: 'Muro cortafuego albañilería ladrillo fiscal 14cm', unidad: 'm²', ufRef: 1.80 },
          { id: 'sp_B02', nombre: 'Muro cortafuego metalcon + fibrocemento RF 2 caras', unidad: 'm²', ufRef: 1.20 },
          { id: 'sp_B03', nombre: 'Tabique estructural metalcon 89mm + placa volcanita 10mm 1C', unidad: 'm²', ufRef: 1.55 },
          { id: 'sp_B04', nombre: 'Tabique estructural metalcon 89mm + volcanita 10mm 2C', unidad: 'm²', ufRef: 1.90 },
          { id: 'sp_B05', nombre: 'Tabique madera 2×4" pino seco + volcanita 1C', unidad: 'm²', ufRef: 1.45 },
          { id: 'sp_B06', nombre: 'Aislación acústica lana mineral 80mm en tabiques', unidad: 'm²', ufRef: 0.35 },
          { id: 'sp_B07', nombre: 'Aislación térmica lana mineral 80mm en muros exteriores', unidad: 'm²', ufRef: 0.35 },
          { id: 'sp_B08', nombre: 'Barrera de vapor (polietileno 0.15mm interior muros)', unidad: 'm²', ufRef: 0.08 },
          { id: 'sp_B09', nombre: 'Barrera de humedad exterior (Fieltro asfáltico 15 lbs)', unidad: 'm²', ufRef: 0.12 },
          { id: 'sp_B10', nombre: 'Revestimiento exterior Siding PVC con perfiles y esquinas', unidad: 'm²', ufRef: 1.25 },
          { id: 'sp_B11', nombre: 'Revestimiento exterior estuco proyectado sobre malla galvanizada', unidad: 'm²', ufRef: 0.70 },
          { id: 'sp_B12', nombre: 'Revestimiento exterior fibrocemento liso 8mm pintado', unidad: 'm²', ufRef: 0.95 },
          { id: 'sp_B13', nombre: 'Revestimiento exterior madera machihembrada pintada', unidad: 'm²', ufRef: 1.40 },
        ],
      },

      // ── C. CUBIERTA Y TECHO ───────────────────────────────────────────────
      {
        id: 'sp_C',
        nombre: 'Cubierta y Techo',
        items: [
          { id: 'sp_C01', nombre: 'Cerchas de madera estructural (fabricación + instalación)', unidad: 'ud', ufRef: 1.50 },
          { id: 'sp_C02', nombre: 'Cerchas metálicas tubulares galvanizadas', unidad: 'ud', ufRef: 2.10 },
          { id: 'sp_C03', nombre: 'Costaneras pino 2×2" o perfil Omega metálico', unidad: 'm²', ufRef: 0.30 },
          { id: 'sp_C04', nombre: 'Membrana hidrófuga respirable (Tyvek o similar)', unidad: 'm²', ufRef: 0.15 },
          { id: 'sp_C05', nombre: 'Aislación térmica cielo lana mineral / Fisitherm 80mm', unidad: 'm²', ufRef: 0.35 },
          { id: 'sp_C06', nombre: 'Cubierta teja asfáltica (base OSB 18mm + teja + cumbrera)', unidad: 'm²', ufRef: 1.30 },
          { id: 'sp_C07', nombre: 'Cubierta Zinc-Alum PV4 trapecial prepintado', unidad: 'm²', ufRef: 0.65 },
          { id: 'sp_C08', nombre: 'Cubierta teja española / romana (mortero + subbase)', unidad: 'm²', ufRef: 1.80 },
          { id: 'sp_C09', nombre: 'Limahoyas y limatesas galvanizadas / Zinc-Alum', unidad: 'ml', ufRef: 0.30 },
          { id: 'sp_C10', nombre: 'Canaletas aguas lluvias PVC ø100mm + bajadas + perforaciones', unidad: 'ml', ufRef: 0.25 },
          { id: 'sp_C11', nombre: 'Tapacán perimetral fibrocemento pintado', unidad: 'ml', ufRef: 0.18 },
          { id: 'sp_C12', nombre: 'Cielo interior segundo piso volcanita 10mm + perfilería', unidad: 'm²', ufRef: 0.70 },
        ],
      },

      // ── D. ESCALERA ───────────────────────────────────────────────────────
      {
        id: 'sp_D',
        nombre: 'Escalera',
        items: [
          { id: 'sp_D01', nombre: 'Escalera metalcon + peldaños madera (mixta prefabricada)', unidad: 'ud', ufRef: 5.50 },
          { id: 'sp_D02', nombre: 'Escalera estructura fierro soldado + peldaños madera', unidad: 'ud', ufRef: 6.50 },
          { id: 'sp_D03', nombre: 'Escalera hormigón armado (in situ)', unidad: 'ud', ufRef: 8.00 },
          { id: 'sp_D04', nombre: 'Revestimiento peldaños madera sólida (nogal/raulí)', unidad: 'ud', ufRef: 0.35 },
          { id: 'sp_D05', nombre: 'Revestimiento peldaños porcelanato antideslizante', unidad: 'ud', ufRef: 0.25 },
          { id: 'sp_D06', nombre: 'Baranda acero inox ø38mm + pasamano', unidad: 'ml', ufRef: 0.90 },
          { id: 'sp_D07', nombre: 'Baranda madera + balaustres (roble/raulí)', unidad: 'ml', ufRef: 0.70 },
          { id: 'sp_D08', nombre: 'Baranda vidrio laminado 10mm + abrazaderas acero inox', unidad: 'ml', ufRef: 1.80 },
          { id: 'sp_D09', nombre: 'Iluminación peldaños (cinta LED perfil embutido)', unidad: 'ml', ufRef: 0.45 },
        ],
      },

      // ── E. VENTANAS Y PUERTAS ─────────────────────────────────────────────
      {
        id: 'sp_E',
        nombre: 'Ventanas y Puertas',
        items: [
          { id: 'sp_E01', nombre: 'Ventana aluminio termopanel corredera 100×120cm', unidad: 'ud', ufRef: 1.60 },
          { id: 'sp_E02', nombre: 'Ventana aluminio termopanel proyectante 60×80cm', unidad: 'ud', ufRef: 1.20 },
          { id: 'sp_E03', nombre: 'Ventana PVC termopanel corredera 100×120cm', unidad: 'ud', ufRef: 1.90 },
          { id: 'sp_E04', nombre: 'Ventana madera / alerce termopanel 100×120cm', unidad: 'ud', ufRef: 2.80 },
          { id: 'sp_E05', nombre: 'Claraboya / tragaluz fijo policarbonato', unidad: 'ud', ufRef: 1.50 },
          { id: 'sp_E06', nombre: 'Puerta interior MDF lisa 80×200cm + marco pino + manilla', unidad: 'ud', ufRef: 0.63 },
          { id: 'sp_E07', nombre: 'Puerta interior HDF moldurada 80×200cm + marco', unidad: 'ud', ufRef: 0.75 },
          { id: 'sp_E08', nombre: 'Puerta interior madera sólida (roble/raulí) 80×200cm', unidad: 'ud', ufRef: 1.60 },
          { id: 'sp_E09', nombre: 'Puerta corredera riel 80×200cm (incluye riel)', unidad: 'ud', ufRef: 0.95 },
          { id: 'sp_E10', nombre: 'Puerta baño (MDF) 70×200cm + marco + bisagras + manilla', unidad: 'ud', ufRef: 0.58 },
          { id: 'sp_E11', nombre: 'Puerta acceso exterior blindada (BBF) 90×210cm', unidad: 'ud', ufRef: 3.50 },
          { id: 'sp_E12', nombre: 'Jambas, tapas y molduras terminación (por puerta)', unidad: 'ud', ufRef: 0.18 },
        ],
      },

      // ── F. TERMINACIONES PISOS ────────────────────────────────────────────
      {
        id: 'sp_F',
        nombre: 'Terminaciones — Pisos',
        items: [
          { id: 'sp_F01', nombre: 'Piso flotante melamínico AC4 8mm (dormitorios / estar)', unidad: 'm²', ufRef: 0.55 },
          { id: 'sp_F02', nombre: 'Piso flotante madera HDF AC5 12mm', unidad: 'm²', ufRef: 0.75 },
          { id: 'sp_F03', nombre: 'Piso madera sólida roble 18mm (instalación + lijado)', unidad: 'm²', ufRef: 1.90 },
          { id: 'sp_F04', nombre: 'Piso porcelanato 60×60cm (pasillos / baños)', unidad: 'm²', ufRef: 1.10 },
          { id: 'sp_F05', nombre: 'Piso cerámica 30×30cm antideslizante', unidad: 'm²', ufRef: 0.85 },
          { id: 'sp_F06', nombre: 'Piso vinílico SPC 5mm (click, resistente agua)', unidad: 'm²', ufRef: 0.65 },
          { id: 'sp_F07', nombre: 'Alfombra con underlayer (dormitorios)', unidad: 'm²', ufRef: 0.70 },
          { id: 'sp_F08', nombre: 'Zócalo MDF pintado 70mm (todos los recintos)', unidad: 'ml', ufRef: 0.14 },
          { id: 'sp_F09', nombre: 'Zócalo madera sólida 70mm barnizado', unidad: 'ml', ufRef: 0.22 },
          { id: 'sp_F10', nombre: 'Subbase nivelante autonivelante Anclaflex/Sikagard', unidad: 'm²', ufRef: 0.30 },
        ],
      },

      // ── G. TERMINACIONES MUROS Y CIELOS ───────────────────────────────────
      {
        id: 'sp_G',
        nombre: 'Terminaciones — Muros y Cielos',
        items: [
          { id: 'sp_G01', nombre: 'Empaste fino volcanita (1ª mano + 2ª mano + lija)', unidad: 'm²', ufRef: 0.32 },
          { id: 'sp_G02', nombre: 'Pintura látex premium 2 manos muros interiores', unidad: 'm²', ufRef: 0.18 },
          { id: 'sp_G03', nombre: 'Pintura cielo látex blanco 2 manos', unidad: 'm²', ufRef: 0.16 },
          { id: 'sp_G04', nombre: 'Cielo volcanita 10mm + perfilería (pasillo/dormitorios)', unidad: 'm²', ufRef: 0.70 },
          { id: 'sp_G05', nombre: 'Cielo enchapado madera (pino o raulí a la vista)', unidad: 'm²', ufRef: 1.20 },
          { id: 'sp_G06', nombre: 'Revestimiento cerámico muro baño (hasta 2.10m)', unidad: 'm²', ufRef: 0.95 },
          { id: 'sp_G07', nombre: 'Revestimiento porcelanato muro baño gran formato (60×120)', unidad: 'm²', ufRef: 1.40 },
          { id: 'sp_G08', nombre: 'Estuco interior muros hormigón / ladrillo', unidad: 'm²', ufRef: 0.50 },
          { id: 'sp_G09', nombre: 'Cornisas / molduras yeso decorativas (sala/comedor)', unidad: 'ml', ufRef: 0.28 },
          { id: 'sp_G10', nombre: 'Tapiz / papel mural (suministro + instalación)', unidad: 'm²', ufRef: 0.65 },
        ],
      },

      // ── H. INSTALACIÓN ELÉCTRICA COMPLETA ─────────────────────────────────
      {
        id: 'sp_H',
        nombre: 'Instalación Eléctrica — Completa',
        items: [
          { id: 'sp_H01', nombre: 'Tablero secundario 12 circuitos DIN (gabinete + disyuntores + diferencial 30mA)', unidad: 'ud', ufRef: 1.20 },
          { id: 'sp_H02', nombre: 'Alimentación tablero 2° piso (cable 2×6mm² + tierra + cañería EMT ø25)', unidad: 'ml', ufRef: 0.12 },
          { id: 'sp_H03', nombre: 'Cañería PVC corrugada ø20mm embutida en tabique (canalización)', unidad: 'ml', ufRef: 0.06 },
          { id: 'sp_H04', nombre: 'Cañería PVC corrugada ø25mm (circuitos cocina / calefacción)', unidad: 'ml', ufRef: 0.08 },
          { id: 'sp_H05', nombre: 'Cable THW 2×2.5mm² (circuito iluminación)', unidad: 'ml', ufRef: 0.04 },
          { id: 'sp_H06', nombre: 'Cable THW 2×4mm² (circuito enchufes)', unidad: 'ml', ufRef: 0.06 },
          { id: 'sp_H07', nombre: 'Caja de derivación 10×10cm empotrada (por caja)', unidad: 'ud', ufRef: 0.06 },
          { id: 'sp_H08', nombre: 'Punto eléctrico enchufe simple 10A (canalización + cable + caja + placa)', unidad: 'pt', ufRef: 0.22 },
          { id: 'sp_H09', nombre: 'Punto eléctrico enchufe doble 10A', unidad: 'pt', ufRef: 0.26 },
          { id: 'sp_H10', nombre: 'Punto eléctrico enchufe 16A (lavadora / microondas)', unidad: 'pt', ufRef: 0.32 },
          { id: 'sp_H11', nombre: 'Punto eléctrico interruptor simple', unidad: 'pt', ufRef: 0.18 },
          { id: 'sp_H12', nombre: 'Punto eléctrico interruptor doble', unidad: 'pt', ufRef: 0.22 },
          { id: 'sp_H13', nombre: 'Punto eléctrico interruptor de escalera (conmutación)', unidad: 'pt', ufRef: 0.28 },
          { id: 'sp_H14', nombre: 'Punto eléctrico interruptor dimmer', unidad: 'pt', ufRef: 0.38 },
          { id: 'sp_H15', nombre: 'Punto de luz colgante / plafón (con caja octogonal)', unidad: 'pt', ufRef: 0.20 },
          { id: 'sp_H16', nombre: 'Punto downlight embutido (caja + cable + roseta)', unidad: 'pt', ufRef: 0.22 },
          { id: 'sp_H17', nombre: 'Punto spot dicroico embutido', unidad: 'pt', ufRef: 0.20 },
          { id: 'sp_H18', nombre: 'Cinta LED perfil aluminio embutido (cielo / mueble)', unidad: 'ml', ufRef: 0.35 },
          { id: 'sp_H19', nombre: 'Punto TV / datos (canalización + caja + placa + roseta)', unidad: 'pt', ufRef: 0.20 },
          { id: 'sp_H20', nombre: 'Punto red datos Cat6 (canalización + caja + roseta)', unidad: 'pt', ufRef: 0.28 },
          { id: 'sp_H21', nombre: 'Punto extractor baño (cañería + caja + punto)', unidad: 'pt', ufRef: 0.30 },
          { id: 'sp_H22', nombre: 'Sistema domótico interruptores (Smart WiFi por punto)', unidad: 'pt', ufRef: 0.55 },
          { id: 'sp_H23', nombre: 'Detector de humo interconectado (por unidad)', unidad: 'ud', ufRef: 0.35 },
          { id: 'sp_H24', nombre: 'Certificación eléctrica SEC (informe + trámite)', unidad: 'gl', ufRef: 2.50 },
        ],
      },

      // ── I. INSTALACIÓN GASFITERÍA / RED AGUA FRÍA Y CALIENTE ─────────────
      {
        id: 'sp_I',
        nombre: 'Gasfitería — Red Agua Fría y Caliente',
        items: [
          { id: 'sp_I01', nombre: 'Tubería PPR PN20 ø20mm agua fría (incluye accesorios)', unidad: 'ml', ufRef: 0.18 },
          { id: 'sp_I02', nombre: 'Tubería PPR PN20 ø25mm agua fría (colector)', unidad: 'ml', ufRef: 0.22 },
          { id: 'sp_I03', nombre: 'Tubería cobre 1/2" agua caliente (soldadura)', unidad: 'ml', ufRef: 0.28 },
          { id: 'sp_I04', nombre: 'Tubería cobre 3/4" agua caliente (bajante principal)', unidad: 'ml', ufRef: 0.35 },
          { id: 'sp_I05', nombre: 'Llave de paso esfera 1/2" embutida por recinto (AF y AC)', unidad: 'ud', ufRef: 0.22 },
          { id: 'sp_I06', nombre: 'Llave de paso esfera 3/4" (corte general piso)', unidad: 'ud', ufRef: 0.28 },
          { id: 'sp_I07', nombre: 'Punto gasfitería lavamanos (AF + AC + desagüe sifón)', unidad: 'pt', ufRef: 0.55 },
          { id: 'sp_I08', nombre: 'Punto gasfitería WC (solo agua fría + válvula flotador)', unidad: 'pt', ufRef: 0.40 },
          { id: 'sp_I09', nombre: 'Punto gasfitería ducha (AF + AC + salida empotrada)', unidad: 'pt', ufRef: 0.60 },
          { id: 'sp_I10', nombre: 'Punto gasfitería tina / bañera (AF + AC + rebosadero)', unidad: 'pt', ufRef: 0.80 },
          { id: 'sp_I11', nombre: 'Punto gasfitería lavarropa (AF + llav + desagüe)', unidad: 'pt', ufRef: 0.45 },
          { id: 'sp_I12', nombre: 'Aislación tubería agua caliente (tuboflex 3/4")', unidad: 'ml', ufRef: 0.08 },
        ],
      },

      // ── J. INSTALACIÓN SANITARIA / RED EVACUACIÓN ─────────────────────────
      {
        id: 'sp_J',
        nombre: 'Sanitaria — Red de Evacuación',
        items: [
          { id: 'sp_J01', nombre: 'Tubería PVC desagüe ø50mm (desagüe lavamanos/ducha)', unidad: 'ml', ufRef: 0.14 },
          { id: 'sp_J02', nombre: 'Tubería PVC desagüe ø100mm (bajante WC + colector ppal)', unidad: 'ml', ufRef: 0.22 },
          { id: 'sp_J03', nombre: 'Tubería ventilación PVC ø63mm (hasta cubierta)', unidad: 'ml', ufRef: 0.16 },
          { id: 'sp_J04', nombre: 'Sombrero ventilación PVC (pasatecho)', unidad: 'ud', ufRef: 0.18 },
          { id: 'sp_J05', nombre: 'Trampa sifónica PVC bajo ducha/losa', unidad: 'ud', ufRef: 0.12 },
          { id: 'sp_J06', nombre: 'Cámara de inspección PVC ø110mm embutida losa', unidad: 'ud', ufRef: 0.35 },
          { id: 'sp_J07', nombre: 'Bajante exterior PVC ø100mm (conexión a red existente)', unidad: 'ml', ufRef: 0.18 },
          { id: 'sp_J08', nombre: 'Certificación sanitaria SEREMI Salud (informe)', unidad: 'gl', ufRef: 1.20 },
        ],
      },

      // ── K. BAÑO COMPLETO (itemizado) ──────────────────────────────────────
      {
        id: 'sp_K',
        nombre: 'Baño — Artefactos y Terminaciones',
        items: [
          { id: 'sp_K01', nombre: 'WC + bidet empotrado dual flush (instalación + sellado)', unidad: 'ud', ufRef: 0.80 },
          { id: 'sp_K02', nombre: 'WC suspendido + cisterna empotrada (carrier + armazón)', unidad: 'ud', ufRef: 2.20 },
          { id: 'sp_K03', nombre: 'Lavamanos bajo mesón cerámica + grifería monocomando', unidad: 'ud', ufRef: 0.90 },
          { id: 'sp_K04', nombre: 'Lavamanos ovalín sobre mesón + grifería', unidad: 'ud', ufRef: 1.10 },
          { id: 'sp_K05', nombre: 'Mesón baño madera MDF + cubierta laminada', unidad: 'ud', ufRef: 1.20 },
          { id: 'sp_K06', nombre: 'Mesón baño hormigón armado pulido / microcemento', unidad: 'ml', ufRef: 1.80 },
          { id: 'sp_K07', nombre: 'Ducha empotrada con grifería termostática + regadera', unidad: 'ud', ufRef: 1.60 },
          { id: 'sp_K08', nombre: 'Tina acrílica 160×70cm + grifería + rebosadero', unidad: 'ud', ufRef: 3.50 },
          { id: 'sp_K09', nombre: 'Mampara de vidrio templado 8mm (ducha)', unidad: 'ud', ufRef: 2.20 },
          { id: 'sp_K10', nombre: 'Espejo biselado con luz LED integrada', unidad: 'ud', ufRef: 0.90 },
          { id: 'sp_K11', nombre: 'Mueble espejo botiquín empotrado', unidad: 'ud', ufRef: 0.75 },
          { id: 'sp_K12', nombre: 'Toallero + porta papel + jabonera acero inox', unidad: 'gl', ufRef: 0.35 },
          { id: 'sp_K13', nombre: 'Extractor de aire baño (100mm) + rejilla', unidad: 'ud', ufRef: 0.45 },
          { id: 'sp_K14', nombre: 'Calefont mural a gas 11L + instalación gas', unidad: 'ud', ufRef: 2.80 },
          { id: 'sp_K15', nombre: 'Calefont eléctrico acumulador 100L (instalación)', unidad: 'ud', ufRef: 1.80 },
          { id: 'sp_K16', nombre: 'Revestimiento cerámica muro baño 30×60cm', unidad: 'm²', ufRef: 0.95 },
          { id: 'sp_K17', nombre: 'Revestimiento porcelanato gran formato muro 60×120cm', unidad: 'm²', ufRef: 1.40 },
          { id: 'sp_K18', nombre: 'Piso porcelanato antideslizante baño 30×30cm', unidad: 'm²', ufRef: 1.00 },
          { id: 'sp_K19', nombre: 'Umbral puerta baño porcelanato / aluminio', unidad: 'ud', ufRef: 0.12 },
          { id: 'sp_K20', nombre: 'Impermeabilización piso húmedo (membrana bajo cerámica)', unidad: 'm²', ufRef: 0.45 },
        ],
      },

      // ── L. TERMINACIONES POR RECINTO (DORMITORIOS) ───────────────────────
      {
        id: 'sp_L',
        nombre: 'Terminaciones — Dormitorios',
        items: [
          { id: 'sp_L01', nombre: 'Piso flotante AC4 dormitorio (incluye instalación + perfil)', unidad: 'm²', ufRef: 0.55 },
          { id: 'sp_L02', nombre: 'Alfombra + underlayer dormitorio', unidad: 'm²', ufRef: 0.70 },
          { id: 'sp_L03', nombre: 'Empaste + pintura látex 2 manos muro dormitorio', unidad: 'm²', ufRef: 0.50 },
          { id: 'sp_L04', nombre: 'Cielo volcanita + empaste + pintura dormitorio', unidad: 'm²', ufRef: 0.90 },
          { id: 'sp_L05', nombre: 'Closet melamínico a medida (hasta 2.4m alto, 2m ancho)', unidad: 'ud', ufRef: 3.80 },
          { id: 'sp_L06', nombre: 'Closet madera MDF lacado a medida (2.4m alto, 2m ancho)', unidad: 'ud', ufRef: 5.50 },
          { id: 'sp_L07', nombre: 'Walk-in closet melamínico (módulos por ml)', unidad: 'ml', ufRef: 1.80 },
          { id: 'sp_L08', nombre: 'Enchufe doble dormitorio (incluido en eléctrico, ref adicional)', unidad: 'pt', ufRef: 0.26 },
          { id: 'sp_L09', nombre: 'Interruptor luz dormitorio', unidad: 'pt', ufRef: 0.18 },
          { id: 'sp_L10', nombre: 'Luminaria plafón dormitorio (incluye instalación)', unidad: 'ud', ufRef: 0.25 },
        ],
      },

      // ── M. TERMINACIONES POR RECINTO (ESTAR / PASILLO) ───────────────────
      {
        id: 'sp_M',
        nombre: 'Terminaciones — Estar / Pasillo / Hall',
        items: [
          { id: 'sp_M01', nombre: 'Piso flotante AC4 estar / pasillo', unidad: 'm²', ufRef: 0.55 },
          { id: 'sp_M02', nombre: 'Empaste + pintura látex 2 manos', unidad: 'm²', ufRef: 0.50 },
          { id: 'sp_M03', nombre: 'Cielo volcanita + empaste + pintura estar', unidad: 'm²', ufRef: 0.90 },
          { id: 'sp_M04', nombre: 'Punto de luz downlight LED pasillo (incluye artefacto)', unidad: 'ud', ufRef: 0.40 },
          { id: 'sp_M05', nombre: 'Detector de movimiento + punto luz pasillo', unidad: 'ud', ufRef: 0.55 },
          { id: 'sp_M06', nombre: 'Enchufe doble estar', unidad: 'pt', ufRef: 0.26 },
          { id: 'sp_M07', nombre: 'Punto TV + datos estar (doble roseta)', unidad: 'pt', ufRef: 0.40 },
          { id: 'sp_M08', nombre: 'Zócalo MDF pintado 70mm', unidad: 'ml', ufRef: 0.14 },
        ],
      },

      // ── N. INSTALACIÓN GAS ────────────────────────────────────────────────
      {
        id: 'sp_N',
        nombre: 'Instalación Gas',
        items: [
          { id: 'sp_N01', nombre: 'Cañería cobre gas 1/2" (embutida o superficial)', unidad: 'ml', ufRef: 0.22 },
          { id: 'sp_N02', nombre: 'Cañería cobre gas 3/4" (bajante principal)', unidad: 'ml', ufRef: 0.28 },
          { id: 'sp_N03', nombre: 'Llave de paso gas esfera 1/2" por equipo', unidad: 'ud', ufRef: 0.20 },
          { id: 'sp_N04', nombre: 'Punto gas calefont / cocina (incluye llave + conexión)', unidad: 'pt', ufRef: 0.60 },
          { id: 'sp_N05', nombre: 'Detector de gas licuado / natural (empotrado)', unidad: 'ud', ufRef: 0.45 },
          { id: 'sp_N06', nombre: 'Prueba de estanqueidad + certificación SEC Gas', unidad: 'gl', ufRef: 1.50 },
        ],
      },

      // ── O. CALEFACCIÓN Y CLIMATIZACIÓN ───────────────────────────────────
      {
        id: 'sp_O',
        nombre: 'Calefacción y Climatización',
        items: [
          { id: 'sp_O01', nombre: 'Minisplit frío/calor 9000 BTU (incluye soporte + drenaje)', unidad: 'ud', ufRef: 3.80 },
          { id: 'sp_O02', nombre: 'Minisplit frío/calor 12000 BTU', unidad: 'ud', ufRef: 4.50 },
          { id: 'sp_O03', nombre: 'Cañería frigorígena cobre 1/4"+3/8" + aislación (por ml)', unidad: 'ml', ufRef: 0.25 },
          { id: 'sp_O04', nombre: 'Radiador eléctrico empotrado piso (por unidad)', unidad: 'ud', ufRef: 1.20 },
          { id: 'sp_O05', nombre: 'Calefacción suelo radiante eléctrico (kit + termostato)', unidad: 'm²', ufRef: 1.60 },
          { id: 'sp_O06', nombre: 'Extractor de aire ventana / muro (100mm)', unidad: 'ud', ufRef: 0.40 },
          { id: 'sp_O07', nombre: 'Rejilla ventilación fija muro (100mm c/ tapa)', unidad: 'ud', ufRef: 0.15 },
        ],
      },

      // ── P. DOMÓTICA Y TELECOMUNICACIONES ─────────────────────────────────
      {
        id: 'sp_P',
        nombre: 'Domótica y Telecomunicaciones',
        items: [
          { id: 'sp_P01', nombre: 'Premarco canalización TV + datos (cañería ø32mm pasatecho)', unidad: 'ud', ufRef: 0.35 },
          { id: 'sp_P02', nombre: 'Punto red Cat6 (caja + canalización + roseta keystone)', unidad: 'pt', ufRef: 0.28 },
          { id: 'sp_P03', nombre: 'Switch de red 8 puertos instalado en gabinete', unidad: 'ud', ufRef: 0.80 },
          { id: 'sp_P04', nombre: 'Punto cámara IP (caja + cañería + cable FTP Cat6)', unidad: 'pt', ufRef: 0.35 },
          { id: 'sp_P05', nombre: 'Sistema de intercomunicador / videoportero (2 pisos)', unidad: 'gl', ufRef: 2.50 },
          { id: 'sp_P06', nombre: 'Alarma perimetral (sensores + panel + sirena)', unidad: 'gl', ufRef: 4.50 },
        ],
      },

      // ── Q. TRÁMITES Y PROFESIONALES ───────────────────────────────────────
      {
        id: 'sp_Q',
        nombre: 'Trámites y Honorarios Profesionales',
        items: [
          { id: 'sp_Q01', nombre: 'Levantamiento topográfico + planos existentes', unidad: 'gl', ufRef: 2.50 },
          { id: 'sp_Q02', nombre: 'Proyecto arquitectura + cálculo estructural', unidad: 'm²', ufRef: 0.50 },
          { id: 'sp_Q03', nombre: 'Proyecto instalaciones eléctricas (memoria SEC)', unidad: 'gl', ufRef: 1.80 },
          { id: 'sp_Q04', nombre: 'Proyecto instalaciones sanitarias (memoria SEREMI)', unidad: 'gl', ufRef: 1.20 },
          { id: 'sp_Q05', nombre: 'Expediente DOM / permiso de edificación', unidad: 'm²', ufRef: 0.30 },
          { id: 'sp_Q06', nombre: 'Recepción municipal + libro de obras', unidad: 'gl', ufRef: 1.50 },
          { id: 'sp_Q07', nombre: 'ITO (Inspección Técnica de Obras) mensual', unidad: 'mes', ufRef: 3.00 },
        ],
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 2. AMPLIACIONES
  // ══════════════════════════════════════════════════════════════════════════
  ampliaciones: {
    label:  'Ampliaciones',
    emoji:  '🏠',
    ufMin:  10,
    ufMax:  18,
    unidad: 'm²',
    desc:   'Extensión en 1er piso. Fundaciones, radier, estructura, conexión a existente, instalaciones y terminaciones.',

    grupos: [

      // ── A. OBRAS PREVIAS Y MOVIMIENTO DE TIERRA ───────────────────────────
      {
        id: 'amp_A',
        nombre: 'Obras Previas y Movimiento de Tierra',
        items: [
          { id: 'amp_A01', nombre: 'Trazado y niveles (uso de nivel láser)', unidad: 'gl', ufRef: 0.35 },
          { id: 'amp_A02', nombre: 'Excavación zanjas fundaciones (retroexcavadora pequeña)', unidad: 'm³', ufRef: 0.50 },
          { id: 'amp_A03', nombre: 'Retiro tierra y escombros a botadero autorizado', unidad: 'm³', ufRef: 0.55 },
          { id: 'amp_A04', nombre: 'Demolición parcial muro existente (para conexión)', unidad: 'm²', ufRef: 0.90 },
          { id: 'amp_A05', nombre: 'Retiro escombros demolición (flete + botadero)', unidad: 'm³', ufRef: 0.65 },
        ],
      },

      // ── B. FUNDACIONES ────────────────────────────────────────────────────
      {
        id: 'amp_B',
        nombre: 'Fundaciones',
        items: [
          { id: 'amp_B01', nombre: 'Emplantillado hormigón pobre H10 5cm', unidad: 'm²', ufRef: 0.25 },
          { id: 'amp_B02', nombre: 'Fundación corrida hormigón ciclópeo H15', unidad: 'm³', ufRef: 2.80 },
          { id: 'amp_B03', nombre: 'Fundación corrida hormigón armado H20 + enfierradura', unidad: 'm³', ufRef: 3.50 },
          { id: 'amp_B04', nombre: 'Sobrecimiento moldaje + enfierradura + hormigón H20', unidad: 'ml', ufRef: 0.40 },
          { id: 'amp_B05', nombre: 'Impermeabilización sobrecimiento (pintura asfáltica)', unidad: 'ml', ufRef: 0.12 },
          { id: 'amp_B06', nombre: 'Relleno estabilizado compactado base radier', unidad: 'm³', ufRef: 0.55 },
          { id: 'amp_B07', nombre: 'Radier interior H20 7cm + malla C-84 + polietileno', unidad: 'm²', ufRef: 0.95 },
          { id: 'amp_B08', nombre: 'Radier interior H25 10cm reforzado (baño / cocina)', unidad: 'm²', ufRef: 1.20 },
        ],
      },

      // ── C. CONEXIÓN A ESTRUCTURA EXISTENTE ───────────────────────────────
      {
        id: 'amp_C',
        nombre: 'Conexión a Estructura Existente',
        items: [
          { id: 'amp_C01', nombre: 'Picado estuco cantería para amarre mecánico', unidad: 'ml', ufRef: 0.35 },
          { id: 'amp_C02', nombre: 'Anclaje espigo epóxico ø12mm (cada 30cm)', unidad: 'ud', ufRef: 0.08 },
          { id: 'amp_C03', nombre: 'Apertura vano muro existente (hasta 1.2m) + dintel', unidad: 'ud', ufRef: 1.80 },
          { id: 'amp_C04', nombre: 'Apertura vano muro existente (hasta 2.4m) + viga dintel', unidad: 'ud', ufRef: 2.80 },
          { id: 'amp_C05', nombre: 'Cierre / albañilería de vano antiguo', unidad: 'ud', ufRef: 0.90 },
          { id: 'amp_C06', nombre: 'Junta de dilatación / aislación sísmica', unidad: 'ml', ufRef: 0.15 },
        ],
      },

      // ── D. OBRA GRUESA ────────────────────────────────────────────────────
      {
        id: 'amp_D',
        nombre: 'Obra Gruesa — Muros y Cubierta',
        items: [
          { id: 'amp_D01', nombre: 'Muro albañilería ladrillo cerámico confinado 14cm', unidad: 'm²', ufRef: 3.20 },
          { id: 'amp_D02', nombre: 'Muro albañilería bloque cemento 15cm', unidad: 'm²', ufRef: 1.80 },
          { id: 'amp_D03', nombre: 'Tabique perimetral metalcon 89mm (estructura)', unidad: 'm²', ufRef: 1.55 },
          { id: 'amp_D04', nombre: 'Cadena de coronación superior hormigón armado', unidad: 'ml', ufRef: 0.65 },
          { id: 'amp_D05', nombre: 'Cubierta zinc-alum (cerchas + costaneras + plancha)', unidad: 'm²', ufRef: 1.50 },
          { id: 'amp_D06', nombre: 'Cubierta teja asfáltica (OSB + teja + cumbrera)', unidad: 'm²', ufRef: 1.80 },
          { id: 'amp_D07', nombre: 'Aislación térmica cubierta lana mineral 80mm', unidad: 'm²', ufRef: 0.35 },
          { id: 'amp_D08', nombre: 'Canaletas PVC ø100mm aguas lluvias + bajada', unidad: 'ml', ufRef: 0.25 },
        ],
      },

      // ── E. INSTALACIONES ──────────────────────────────────────────────────
      {
        id: 'amp_E',
        nombre: 'Instalaciones Ampliación',
        items: [
          // Eléctrica
          { id: 'amp_E01', nombre: 'Extensión circuito eléctrico desde tablero (cable + cañería)', unidad: 'ml', ufRef: 0.10 },
          { id: 'amp_E02', nombre: 'Punto enchufe doble (ampliación)', unidad: 'pt', ufRef: 0.26 },
          { id: 'amp_E03', nombre: 'Punto interruptor simple (ampliación)', unidad: 'pt', ufRef: 0.18 },
          { id: 'amp_E04', nombre: 'Punto luz colgante/plafón', unidad: 'pt', ufRef: 0.20 },
          // Agua fría y caliente
          { id: 'amp_E05', nombre: 'Extensión red AF/AC PPR ø20mm (desde colector existente)', unidad: 'ml', ufRef: 0.18 },
          { id: 'amp_E06', nombre: 'Punto gasfitería lavamanos (AF + AC + sifón)', unidad: 'pt', ufRef: 0.55 },
          { id: 'amp_E07', nombre: 'Punto gasfitería WC (AF + válvula)', unidad: 'pt', ufRef: 0.40 },
          { id: 'amp_E08', nombre: 'Punto gasfitería ducha (AF + AC empotrada)', unidad: 'pt', ufRef: 0.60 },
          // Sanitaria
          { id: 'amp_E09', nombre: 'Extensión red desagüe PVC ø50mm / ø100mm', unidad: 'ml', ufRef: 0.20 },
          { id: 'amp_E10', nombre: 'Cámara inspección PVC ø110mm (exterior)', unidad: 'ud', ufRef: 0.80 },
          // Gas
          { id: 'amp_E11', nombre: 'Extensión cañería gas cobre 1/2" + llave de corte', unidad: 'ml', ufRef: 0.22 },
        ],
      },

      // ── F. TERMINACIONES AMPLIACIÓN ───────────────────────────────────────
      {
        id: 'amp_F',
        nombre: 'Terminaciones Ampliación',
        items: [
          { id: 'amp_F01', nombre: 'Estuco exterior + platachado (fachada nueva)', unidad: 'm²', ufRef: 0.70 },
          { id: 'amp_F02', nombre: 'Pintura exterior látex o texturada', unidad: 'm²', ufRef: 0.22 },
          { id: 'amp_F03', nombre: 'Empaste + pintura interior muros y cielo', unidad: 'm²', ufRef: 0.50 },
          { id: 'amp_F04', nombre: 'Cielo volcanita 10mm + perfilería', unidad: 'm²', ufRef: 0.70 },
          { id: 'amp_F05', nombre: 'Piso porcelanato 60×60cm interior', unidad: 'm²', ufRef: 1.10 },
          { id: 'amp_F06', nombre: 'Piso flotante AC4 interior', unidad: 'm²', ufRef: 0.55 },
          { id: 'amp_F07', nombre: 'Puerta interior MDF 80×200 + marco + manilla', unidad: 'ud', ufRef: 0.63 },
          { id: 'amp_F08', nombre: 'Ventana aluminio termopanel 100×120cm', unidad: 'ud', ufRef: 1.60 },
          { id: 'amp_F09', nombre: 'Zócalo MDF pintado 70mm', unidad: 'ml', ufRef: 0.14 },
          { id: 'amp_F10', nombre: 'Revestimiento cerámico muro baño hasta 2.10m', unidad: 'm²', ufRef: 0.95 },
        ],
      },

      // ── G. BAÑO AMPLIACIÓN (artefactos) ──────────────────────────────────
      {
        id: 'amp_G',
        nombre: 'Baño Ampliación — Artefactos',
        items: [
          { id: 'amp_G01', nombre: 'WC + instalación + sellado', unidad: 'ud', ufRef: 0.80 },
          { id: 'amp_G02', nombre: 'Lavamanos + grifería monocomando', unidad: 'ud', ufRef: 0.90 },
          { id: 'amp_G03', nombre: 'Ducha empotrada + grifería + cubineto', unidad: 'ud', ufRef: 1.20 },
          { id: 'amp_G04', nombre: 'Mampara vidrio templado 8mm', unidad: 'ud', ufRef: 2.20 },
          { id: 'amp_G05', nombre: 'Espejo + iluminación LED', unidad: 'ud', ufRef: 0.70 },
          { id: 'amp_G06', nombre: 'Extractor 100mm + rejilla', unidad: 'ud', ufRef: 0.45 },
          { id: 'amp_G07', nombre: 'Impermeabilización piso húmedo', unidad: 'm²', ufRef: 0.45 },
        ],
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 3. COBERTIZOS
  // ══════════════════════════════════════════════════════════════════════════
  cobertizos: {
    label:  'Cobertizos',
    emoji:  '🌞',
    ufMin:  2.5,
    ufMax:  6,
    unidad: 'm²',
    desc:   'Estructuras exteriores adosadas o aisladas. Pilares, vigas y cubiertas ligeras.',

    grupos: [

      {
        id: 'cob_A',
        nombre: 'Fundaciones y Bases',
        items: [
          { id: 'cob_A01', nombre: 'Zapata aislada hormigón H20 50×50×40cm', unidad: 'ud', ufRef: 0.65 },
          { id: 'cob_A02', nombre: 'Placa metálica de anclaje (base pilar metálico)', unidad: 'ud', ufRef: 0.35 },
          { id: 'cob_A03', nombre: 'Pletina soldada + tornillos de anclaje ø16mm', unidad: 'ud', ufRef: 0.25 },
          { id: 'cob_A04', nombre: 'Hormigonado zapata + vibrado + curado', unidad: 'ud', ufRef: 0.20 },
        ],
      },

      {
        id: 'cob_B',
        nombre: 'Pilares y Estructura Vertical',
        items: [
          { id: 'cob_B01', nombre: 'Pilar madera pino Oregón 6×6" impregnado', unidad: 'ud', ufRef: 0.45 },
          { id: 'cob_B02', nombre: 'Pilar madera roble / raulí 6×6"', unidad: 'ud', ufRef: 0.80 },
          { id: 'cob_B03', nombre: 'Pilar tubo metálico cuadrado 80×3mm + pintura anticorrosiva', unidad: 'ud', ufRef: 0.60 },
          { id: 'cob_B04', nombre: 'Pilar tubo redondo ø100×3mm', unidad: 'ud', ufRef: 0.65 },
          { id: 'cob_B05', nombre: 'Pilar hormigón armado 20×20cm (jardinera / muro bajo)', unidad: 'ud', ufRef: 0.90 },
        ],
      },

      {
        id: 'cob_C',
        nombre: 'Estructura de Cubierta',
        items: [
          { id: 'cob_C01', nombre: 'Viga maestra adosada a muro (con anclaje epóxico)', unidad: 'ml', ufRef: 0.65 },
          { id: 'cob_C02', nombre: 'Vigas maestras y pares pino Oregón a la vista', unidad: 'm²', ufRef: 1.60 },
          { id: 'cob_C03', nombre: 'Vigas y costaneras perfil metálico C-100 soldado', unidad: 'm²', ufRef: 1.30 },
          { id: 'cob_C04', nombre: 'Correas madera 2×2"', unidad: 'ml', ufRef: 0.12 },
          { id: 'cob_C05', nombre: 'Uniones y herrajes Simpson (por kg instalado)', unidad: 'kg', ufRef: 0.15 },
        ],
      },

      {
        id: 'cob_D',
        nombre: 'Cubierta',
        items: [
          { id: 'cob_D01', nombre: 'Cubierta policarbonato alveolar 6mm + perfiles H/U aluminio', unidad: 'm²', ufRef: 0.75 },
          { id: 'cob_D02', nombre: 'Cubierta policarbonato macizo opal 4mm (vidriado)', unidad: 'm²', ufRef: 1.10 },
          { id: 'cob_D03', nombre: 'Cubierta zinc-alum ondulado/trapecial prepintado', unidad: 'm²', ufRef: 0.55 },
          { id: 'cob_D04', nombre: 'Cubierta teja asfáltica (sobre OSB 12mm)', unidad: 'm²', ufRef: 1.20 },
          { id: 'cob_D05', nombre: 'Membrana líquida impermeabilizante (plana/inclinada <5%)', unidad: 'm²', ufRef: 0.65 },
          { id: 'cob_D06', nombre: 'Canaleta PVC ø100mm + bajada + collarín fijación', unidad: 'ml', ufRef: 0.25 },
        ],
      },

      {
        id: 'cob_E',
        nombre: 'Cielos y Revestimientos',
        items: [
          { id: 'cob_E01', nombre: 'Cielo a la vista treillage madera pintado', unidad: 'm²', ufRef: 0.80 },
          { id: 'cob_E02', nombre: 'Cielo coligüe + estructura oculta', unidad: 'm²', ufRef: 0.95 },
          { id: 'cob_E03', nombre: 'Cielo fibrocemento 6mm pintado (exterior)', unidad: 'm²', ufRef: 0.65 },
          { id: 'cob_E04', nombre: 'Cierre lateral malla mosquito / zaran PVC', unidad: 'm²', ufRef: 0.35 },
          { id: 'cob_E05', nombre: 'Cierre lateral vidrio templado 6mm + perfilería', unidad: 'm²', ufRef: 2.50 },
          { id: 'cob_E06', nombre: 'Cierre lateral policarbonato 6mm + perfilería aluminio', unidad: 'm²', ufRef: 0.90 },
        ],
      },

      {
        id: 'cob_F',
        nombre: 'Acabados y Protección',
        items: [
          { id: 'cob_F01', nombre: 'Barniz protector UV Cetol/Sikkens madera (2 manos)', unidad: 'm²', ufRef: 0.25 },
          { id: 'cob_F02', nombre: 'Pintura esmalte anticorrosivo estructura metálica (2 manos)', unidad: 'm²', ufRef: 0.22 },
          { id: 'cob_F03', nombre: 'Galvanizado en frío spray (soldaduras y cortes)', unidad: 'gl', ufRef: 0.15 },
          { id: 'cob_F04', nombre: 'Impregnante preservante madera (brocha + compresor)', unidad: 'm²', ufRef: 0.18 },
        ],
      },

      {
        id: 'cob_G',
        nombre: 'Instalaciones Cobertizo',
        items: [
          { id: 'cob_G01', nombre: 'Punto luz exterior (caja estanca + canalización + cable)', unidad: 'pt', ufRef: 0.35 },
          { id: 'cob_G02', nombre: 'Punto enchufe exterior estanco IP55', unidad: 'pt', ufRef: 0.40 },
          { id: 'cob_G03', nombre: 'Luminaria LED exterior IP65 (artefacto + instalación)', unidad: 'ud', ufRef: 0.55 },
          { id: 'cob_G04', nombre: 'Cañería visible conduit galvanizado ø20mm', unidad: 'ml', ufRef: 0.10 },
        ],
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 4. QUINCHOS
  // ══════════════════════════════════════════════════════════════════════════
  quinchos: {
    label:  'Quinchos',
    emoji:  '🍖',
    ufMin:  5,
    ufMax:  15,
    unidad: 'm²',
    desc:   'Asadores de ladrillo, mesones, campanas, lavacopas y todas las instalaciones.',

    grupos: [

      {
        id: 'qui_A',
        nombre: 'Base y Estructura',
        items: [
          { id: 'qui_A01', nombre: 'Radier base H20 10cm reforzado para quincho', unidad: 'm²', ufRef: 1.10 },
          { id: 'qui_A02', nombre: 'Estructura albañilería ladrillo fiscal (muros quincho)', unidad: 'm²', ufRef: 2.20 },
          { id: 'qui_A03', nombre: 'Cadena de amarre hormigón armado', unidad: 'ml', ufRef: 0.55 },
          { id: 'qui_A04', nombre: 'Pilar ladrillo o hormigón (soporte cubierta)', unidad: 'ud', ufRef: 0.80 },
        ],
      },

      {
        id: 'qui_B',
        nombre: 'Asador / Parrilla',
        items: [
          { id: 'qui_B01', nombre: 'Estructura asador ladrillo fiscal (cuerpo + hogar)', unidad: 'ud', ufRef: 3.80 },
          { id: 'qui_B02', nombre: 'Revestimiento interior ladrillo refractario (hogar)', unidad: 'm²', ufRef: 3.50 },
          { id: 'qui_B03', nombre: 'Mortero refractario (junta + revoque interior hogar)', unidad: 'kg', ufRef: 0.05 },
          { id: 'qui_B04', nombre: 'Parrilla frontal elevable acero inox 304 + manivela', unidad: 'ud', ufRef: 5.50 },
          { id: 'qui_B05', nombre: 'Parrilla fija acero inox 304 con varillas ø10mm', unidad: 'ud', ufRef: 2.20 },
          { id: 'qui_B06', nombre: 'Caja de cenizas metálica deslizable acero 3mm', unidad: 'ud', ufRef: 0.90 },
          { id: 'qui_B07', nombre: 'Registro limpia hollín (tapa FD ø100mm)', unidad: 'ud', ufRef: 0.35 },
        ],
      },

      {
        id: 'qui_C',
        nombre: 'Campana y Extracción',
        items: [
          { id: 'qui_C01', nombre: 'Campana metálica a medida acero 1.2mm + pintura alta temp', unidad: 'ud', ufRef: 6.50 },
          { id: 'qui_C02', nombre: 'Campana ladrillo revocado (obra + revoque)', unidad: 'ud', ufRef: 4.50 },
          { id: 'qui_C03', nombre: 'Ducto extracción metálico Ø250mm galvanizado', unidad: 'ml', ufRef: 0.90 },
          { id: 'qui_C04', nombre: 'Gorro de techo + malla antisparks', unidad: 'ud', ufRef: 0.55 },
          { id: 'qui_C05', nombre: 'Pasatecho impermeable acero inox (pasada cubierta)', unidad: 'ud', ufRef: 0.80 },
          { id: 'qui_C06', nombre: 'Extractor mecánico industrial 250mm (si recinto cerrado)', unidad: 'ud', ufRef: 2.50 },
        ],
      },

      {
        id: 'qui_D',
        nombre: 'Mesones y Muebles',
        items: [
          { id: 'qui_D01', nombre: 'Losa mesón hormigón armado H20 (moldaje + enfierradura)', unidad: 'ml', ufRef: 1.80 },
          { id: 'qui_D02', nombre: 'Mesón granito / mármol importado (suministro + inst)', unidad: 'm²', ufRef: 5.50 },
          { id: 'qui_D03', nombre: 'Mesón porcelanato 60×60cm (sobre soportería)', unidad: 'm²', ufRef: 2.20 },
          { id: 'qui_D04', nombre: 'Revestimiento frente mesón piedra fachaleta', unidad: 'm²', ufRef: 1.60 },
          { id: 'qui_D05', nombre: 'Revestimiento frente mesón azulejo artesanal', unidad: 'm²', ufRef: 1.80 },
          { id: 'qui_D06', nombre: 'Puertas bajo mesón madera pino Oregón + herrajes', unidad: 'm²', ufRef: 1.20 },
          { id: 'qui_D07', nombre: 'Cajones con guías suaves (por cajón instalado)', unidad: 'ud', ufRef: 0.45 },
          { id: 'qui_D08', nombre: 'Escurridero / estante inox bajo mesón', unidad: 'ud', ufRef: 0.80 },
        ],
      },

      {
        id: 'qui_E',
        nombre: 'Lavacopas y Gasfitería',
        items: [
          { id: 'qui_E01', nombre: 'Lavacopas simple acero inox 316 60×40cm', unidad: 'ud', ufRef: 0.70 },
          { id: 'qui_E02', nombre: 'Lavacopas doble acero inox 80×45cm', unidad: 'ud', ufRef: 1.10 },
          { id: 'qui_E03', nombre: 'Grifería cuello de cisne acero inox (AF + AC)', unidad: 'ud', ufRef: 0.80 },
          { id: 'qui_E04', nombre: 'Red AF + AC PPR ø20mm a lavacopas (desde colector)', unidad: 'ml', ufRef: 0.18 },
          { id: 'qui_E05', nombre: 'Desagüe + sifón lavacopas PVC ø50mm', unidad: 'ud', ufRef: 0.22 },
          { id: 'qui_E06', nombre: 'Cámara de inspección exterior PVC ø110mm', unidad: 'ud', ufRef: 0.80 },
          { id: 'qui_E07', nombre: 'Trampa grasa PVC 20L (norma aguas servidas)', unidad: 'ud', ufRef: 1.20 },
        ],
      },

      {
        id: 'qui_F',
        nombre: 'Instalación Eléctrica Quincho',
        items: [
          { id: 'qui_F01', nombre: 'Circuito eléctrico desde tablero (20A + diferencial)', unidad: 'gl', ufRef: 0.80 },
          { id: 'qui_F02', nombre: 'Punto enchufe doble sobre mesón (estanco IP44)', unidad: 'pt', ufRef: 0.40 },
          { id: 'qui_F03', nombre: 'Punto enchufe 16A (refrigerador / parrilla eléctrica)', unidad: 'pt', ufRef: 0.45 },
          { id: 'qui_F04', nombre: 'Punto luz colgante / plafón (interior)', unidad: 'pt', ufRef: 0.22 },
          { id: 'qui_F05', nombre: 'Punto luz exterior (caja estanca + luminaria LED)', unidad: 'pt', ufRef: 0.35 },
          { id: 'qui_F06', nombre: 'Canalización exterior conduit galvanizado ø20mm', unidad: 'ml', ufRef: 0.10 },
          { id: 'qui_F07', nombre: 'Interruptor estanco exterior', unidad: 'ud', ufRef: 0.22 },
          { id: 'qui_F08', nombre: 'Iluminación LED tira 12V bajo mesón (transformador + cinta)', unidad: 'ml', ufRef: 0.35 },
        ],
      },

      {
        id: 'qui_G',
        nombre: 'Terminaciones Quincho',
        items: [
          { id: 'qui_G01', nombre: 'Revestimiento exterior piedra fachaleta (muros perimetrales)', unidad: 'm²', ufRef: 1.60 },
          { id: 'qui_G02', nombre: 'Revestimiento exterior estuco + pintura texturada', unidad: 'm²', ufRef: 0.85 },
          { id: 'qui_G03', nombre: 'Piso porcelanato antideslizante exterior 60×60cm', unidad: 'm²', ufRef: 1.10 },
          { id: 'qui_G04', nombre: 'Piso adoquín concreto (sobre cama arena)', unidad: 'm²', ufRef: 1.40 },
          { id: 'qui_G05', nombre: 'Cielo machihembrado pino / raulí (interior)', unidad: 'm²', ufRef: 1.20 },
          { id: 'qui_G06', nombre: 'Barniz protector UV cielo madera', unidad: 'm²', ufRef: 0.25 },
          { id: 'qui_G07', nombre: 'Mueble TV empotrado (MDF lacado)', unidad: 'ud', ufRef: 2.80 },
          { id: 'qui_G08', nombre: 'Ventilador de techo 56" (instalación)', unidad: 'ud', ufRef: 0.50 },
        ],
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 5. RADIERS
  // ══════════════════════════════════════════════════════════════════════════
  radiers: {
    label:  'Radiers',
    emoji:  '🧱',
    ufMin:  1.2,
    ufMax:  4,
    unidad: 'm²',
    desc:   'Losas de hormigón exteriores e interiores. Preparación, refuerzo y terminaciones.',

    grupos: [

      {
        id: 'rad_A',
        nombre: 'Preparación de Terreno',
        items: [
          { id: 'rad_A01', nombre: 'Nivelación, excavación y retiro capa vegetal', unidad: 'm²', ufRef: 0.35 },
          { id: 'rad_A02', nombre: 'Relleno y compactación base estabilizada (placa compactadora)', unidad: 'm²', ufRef: 0.40 },
          { id: 'rad_A03', nombre: 'Ripio chancado compactado base 10cm', unidad: 'm²', ufRef: 0.22 },
          { id: 'rad_A04', nombre: 'Barrera antihumedad polietileno 0.15mm', unidad: 'm²', ufRef: 0.05 },
          { id: 'rad_A05', nombre: 'Solera delimitadora prefabricada perimetral', unidad: 'ml', ufRef: 0.25 },
          { id: 'rad_A06', nombre: 'Encofrado perimetral madera (moldaje)', unidad: 'ml', ufRef: 0.18 },
        ],
      },

      {
        id: 'rad_B',
        nombre: 'Radiers y Losas',
        items: [
          { id: 'rad_B01', nombre: 'Radier simple H20 7cm + malla C-84 (Peatonal)', unidad: 'm²', ufRef: 0.95 },
          { id: 'rad_B02', nombre: 'Radier reforzado H25 10cm + malla doble C-84 (Mixto)', unidad: 'm²', ufRef: 1.25 },
          { id: 'rad_B03', nombre: 'Radier vehicular H30 15cm + enfierradura ø10 (Vehicular)', unidad: 'm²', ufRef: 1.80 },
          { id: 'rad_B04', nombre: 'Radier calefaccionado (tubería suelo radiante incluida)', unidad: 'm²', ufRef: 2.50 },
          { id: 'rad_B05', nombre: 'Hormigón H20 bombeado (recargo por bomba ≥30m³)', unidad: 'gl', ufRef: 3.50 },
        ],
      },

      {
        id: 'rad_C',
        nombre: 'Juntas y Curado',
        items: [
          { id: 'rad_C01', nombre: 'Juntas de dilatación corte con disco diamante', unidad: 'ml', ufRef: 0.10 },
          { id: 'rad_C02', nombre: 'Sello poliuretano bicomponente en juntas', unidad: 'ml', ufRef: 0.08 },
          { id: 'rad_C03', nombre: 'Curado químico (Concure o similar) aplicado a brocha', unidad: 'm²', ufRef: 0.08 },
          { id: 'rad_C04', nombre: 'Afinado helicóptero (fratasado mecánico)', unidad: 'm²', ufRef: 0.18 },
          { id: 'rad_C05', nombre: 'Bruñido manual bordes y zócalos', unidad: 'ml', ufRef: 0.10 },
        ],
      },

      {
        id: 'rad_D',
        nombre: 'Terminaciones de Pavimento',
        items: [
          { id: 'rad_D01', nombre: 'Adoquín hormigón (8cm) sobre cama arena 3cm', unidad: 'm²', ufRef: 1.40 },
          { id: 'rad_D02', nombre: 'Adoquín hormigón color (permeable)', unidad: 'm²', ufRef: 1.65 },
          { id: 'rad_D03', nombre: 'Cerámica / porcelanato antideslizante 30×30cm exterior', unidad: 'm²', ufRef: 0.90 },
          { id: 'rad_D04', nombre: 'Porcelanato gran formato 60×60cm exterior', unidad: 'm²', ufRef: 1.25 },
          { id: 'rad_D05', nombre: 'Pintura epoxi piso (2 manos, garaje / taller)', unidad: 'm²', ufRef: 0.45 },
          { id: 'rad_D06', nombre: 'Pintura tráfico líneas / señalética (garaje)', unidad: 'ml', ufRef: 0.10 },
          { id: 'rad_D07', nombre: 'Gravilla decorativa sobre membrana geotextil', unidad: 'm²', ufRef: 0.35 },
          { id: 'rad_D08', nombre: 'Piedra lavada encastada en mortero', unidad: 'm²', ufRef: 1.20 },
        ],
      },

      {
        id: 'rad_E',
        nombre: 'Obras Complementarias Exteriores',
        items: [
          { id: 'rad_E01', nombre: 'Canal de drenaje HDPE 10cm + rejilla galvanizada', unidad: 'ml', ufRef: 0.55 },
          { id: 'rad_E02', nombre: 'Sumidero de piso PVC ø110mm (patio / garaje)', unidad: 'ud', ufRef: 0.45 },
          { id: 'rad_E03', nombre: 'Cámara de acumulación aguas lluvias PVC (cisterna 500L)', unidad: 'ud', ufRef: 5.50 },
          { id: 'rad_E04', nombre: 'Canaleta de hormigón prefabricada tipo "L" (bordes)', unidad: 'ml', ufRef: 0.30 },
          { id: 'rad_E05', nombre: 'Rampa acceso vehicular (refuerzo ø8mm + terminación)', unidad: 'ml', ufRef: 1.50 },
        ],
      },
    ],
  },


// ══════════════════════════════════════════════════════════════════════════
  // 6. TECHOS Y COBERTIZOS
  // ══════════════════════════════════════════════════════════════════════════
  techos: {
    label:  'Techos y Cobertizos',
    emoji:  '☂️',
    ufMin:  1.5,
    ufMax:  14.5,
    unidad: 'm²',
    desc:   'Construcción integral de techumbres y terrazas. Incluye la elección del diseño arquitectónico, fundaciones, sistema de doble placa, estructuras, cubiertas, hojalatería y electricidad.',

    grupos: [

      {
        id: 'tec_A',
        nombre: 'Diseño Arquitectónico y Estilo del Techo',
        desc: 'Definición de la geometría y forma del cobertizo, quincho o terraza. Esta elección determina la estética, el escurrimiento de aguas lluvias y la complejidad estructural.',
        items: [
          { id: 'tec_A01', nombre: 'Techo a Un Agua (Pendiente Simple)', desc: 'Ideal para extensiones, terrazas y estacionamientos adosados a un muro de la casa. El agua escurre hacia un solo frente.', unidad: 'gl', ufRef: 1.00 },
          { id: 'tec_A02', nombre: 'Techo a Dos Aguas (Clásico / Gablete)', desc: 'Diseño tradicional en forma de triángulo. Perfecto para quinchos independientes. Permite excelente altura interior y ventilación.', unidad: 'gl', ufRef: 1.50 },
          { id: 'tec_A03', nombre: 'Techo a Cuatro Aguas (Estilo Faldones)', desc: 'Estilo tipo glorieta o colonial. El agua escurre hacia los cuatro lados perimetrales. Excelente para quinchos grandes e independientes.', unidad: 'gl', ufRef: 2.50 },
          { id: 'tec_A04', nombre: 'Techo Mediterráneo (Corte Recto / Oculto)', desc: 'Tendencia moderna. Techo visualmente plano con pendiente mínima oculta tras un tapacán perimetral ancho. Muy usado en terrazas minimalistas.', unidad: 'gl', ufRef: 1.80 },
          { id: 'tec_A05', nombre: 'Techo Curvo o Abovedado', desc: 'Estructura arqueada, generalmente con cerchas metálicas o vigas de madera laminada. Clásico para estacionamientos con policarbonato.', unidad: 'gl', ufRef: 2.20 },
          { id: 'tec_A06', nombre: 'Pérgola Abierta (Treillage / Sombreadero)', desc: 'Vigas a la vista sin cubierta impermeable. Uso exclusivo para dar sombra mediante palillos, coligües o mallas.', unidad: 'gl', ufRef: 1.20 },
          { id: 'tec_A07', nombre: 'Techo en "L" (Dos aguas interceptadas)', desc: 'Diseño complejo para terrazas que envuelven la esquina de la casa. Requiere instalación de limahoya para unir las pendientes de los dos techos.', unidad: 'gl', ufRef: 3.00 },
        ],
      },

      {
        id: 'tec_B',
        nombre: 'Diagnóstico, Ingeniería y Trabajos Previos',
        desc: 'Evaluaciones técnicas iniciales y preparación del área para asegurar la viabilidad estructural y proteger la propiedad durante la obra.',
        items: [
          { id: 'tec_B01', nombre: 'Visita técnica y evaluación estructural', desc: 'Determinación de la capacidad de los muros existentes para soportar nuevas cargas de techumbre.', unidad: 'gl', ufRef: 1.50 },
          { id: 'tec_B02', nombre: 'Cálculo estructural básico', desc: 'Para cobertizos y ampliaciones menores; asegura resistencia contra cargas de viento y sismo.', unidad: 'gl', ufRef: 3.50 },
          { id: 'tec_B03', nombre: 'Encarpado y protección contra lluvias', desc: 'Uso de lonas de alta densidad para evitar inundaciones o daños al interior de la vivienda durante el desarme.', unidad: 'gl', ufRef: 1.20 },
          { id: 'tec_B04', nombre: 'Instalación de andamios y líneas de vida', desc: 'Equipamiento de seguridad para trabajo seguro en altura.', unidad: 'gl', ufRef: 2.00 },
          { id: 'tec_B05', nombre: 'Demolición parcial y apertura de apoyos', desc: 'Romper cadenas o muros para insertar y anclar de manera segura las nuevas vigas maestras.', unidad: 'pto', ufRef: 0.85 },
        ],
      },

      {
        id: 'tec_C',
        nombre: 'Desarme y Retiro de Cubiertas Existentes',
        desc: 'Remoción cuidadosa de materiales antiguos y su correcta disposición legal.',
        items: [
          { id: 'tec_C01', nombre: 'Retiro cubierta zinc / planchas metálicas', desc: 'Desarme rápido, incluye desatornillado y acopio en suelo.', unidad: 'm²', ufRef: 0.22 },
          { id: 'tec_C02', nombre: 'Retiro teja asfáltica + base OSB deteriorada', desc: 'Remoción de capas adheridas y placas podridas por filtraciones pasadas.', unidad: 'm²', ufRef: 0.35 },
          { id: 'tec_C03', nombre: 'Retiro teja de arcilla o cemento', desc: 'Proceso lento y pesado debido al alto peso del material a bajar a mano.', unidad: 'm²', ufRef: 0.45 },
          { id: 'tec_C04', nombre: 'Desarme cuidadoso de cerchas o tijerales', desc: 'Corte y remoción de la estructura de soporte de madera o metal antigua.', unidad: 'ud', ufRef: 0.60 },
          { id: 'tec_C05', nombre: 'Retiro preventivo asbesto cemento (Pizarreño)', desc: 'Desmonte bajo protocolo SEREMI, embolsado y manejo de residuos peligrosos.', unidad: 'm²', ufRef: 1.10 },
          { id: 'tec_C06', nombre: 'Flete y disposición final de escombros', desc: 'Transporte a botadero autorizado con certificado medioambiental.', unidad: 'm³', ufRef: 0.75 },
        ],
      },

      {
        id: 'tec_D',
        nombre: 'Fundaciones y Soportes Verticales (Pilares)',
        desc: 'Elementos verticales que transmiten las cargas al suelo. Variantes de tamaño según la envergadura y luz (distancia) del techo.',
        items: [
          { id: 'tec_D01', nombre: 'Trazado, excavación y hormigonado de poyos', desc: 'Excavación manual de 40x40x60cm y llenado con hormigón H20.', unidad: 'ud', ufRef: 0.95 },
          { id: 'tec_D02', nombre: 'Pilar pino finger 4x4" (90x90mm)', desc: 'Para pérgolas ligeras y luces cortas. Incluye pletina base y anclaje.', unidad: 'ml', ufRef: 0.75 },
          { id: 'tec_D03', nombre: 'Pilar pino finger 5x5" (115x115mm)', desc: 'El estándar para cobertizos de madera. Incluye herrajes de base y superiores.', unidad: 'ml', ufRef: 0.95 },
          { id: 'tec_D04', nombre: 'Pilar madera nativa (Roble/Pellín) 6x6"', desc: 'Estética rústica/premium, para grandes cargas. Incluye anclaje pesado oculto.', unidad: 'ml', ufRef: 1.80 },
          { id: 'tec_D05', nombre: 'Pilar metálico tubular 100x100x3mm', desc: 'Estilo industrial/moderno. Incluye placa base soldada y pintura anticorrosiva.', unidad: 'ml', ufRef: 1.15 },
          { id: 'tec_D06', nombre: 'Anclajes epóxicos de pilares a radier existente', desc: 'Fijación química de alta resistencia sin necesidad de romper la losa completa.', unidad: 'ud', ufRef: 0.45 },
        ],
      },

      {
        id: 'tec_E',
        nombre: 'Estructura Principal (Vigas y Cerchas)',
        desc: 'El esqueleto del techo. Los componentes incluyen sus respectivos conectores estructurales para evitar pérdidas en el cálculo.',
        items: [
          { id: 'tec_E01', nombre: 'Viga maestra pino insigne seca 2x6" / 2x8"', desc: 'Para entramados de luces cortas a medias. Incluye conectores metálicos U.', unidad: 'ml', ufRef: 0.75 },
          { id: 'tec_E02', nombre: 'Viga maestra Oregón Nacional 2x8" / 2x10"', desc: 'Para techos con viga a la vista donde la viga aporta un alto valor estético.', unidad: 'ml', ufRef: 1.20 },
          { id: 'tec_E03', nombre: 'Vigas estructurales I-Joists (Vigas 2T)', desc: 'Soportan mayores luces sin pilares intermedios. Incluyen conectores de alma.', unidad: 'ml', ufRef: 1.35 },
          { id: 'tec_E04', nombre: 'Cercha prefabricada de madera', desc: 'Armada con placas dentadas. Incluye conectores tipo Hurricane Clip a muros.', unidad: 'ud', ufRef: 1.85 },
          { id: 'tec_E05', nombre: 'Cercha acero galvanizado Metalcon', desc: 'Incombustible e indeformable. Incluye tornillería estructural y escuadras de anclaje.', unidad: 'ud', ufRef: 2.45 },
          { id: 'tec_E06', nombre: 'Arriostramiento estructural (Cruz de San Andrés)', desc: 'Crucetas que evitan la deformación lateral del entramado por fuerzas de viento/sismo.', unidad: 'm²', ufRef: 0.35 },
        ],
      },

      {
        id: 'tec_F',
        nombre: 'Cámara de Aire, Entramados Base y Aislación (Sistema Doble Placa)',
        desc: 'Esencial para techos de viga a la vista: permite pasar cables, aísla térmicamente y previene que los clavos de la cubierta arruinen el cielo a la vista.',
        items: [
          // Placa Inferior (Cielo)
          { id: 'tec_F01', nombre: 'PLACA 1 (Cielo Viga a la Vista): Terciado ranurado', desc: 'Se instala sobre la viga. Acabado estético tipo tabla (Cantería 9cm o 5cm).', unidad: 'm²', ufRef: 0.90 },
          { id: 'tec_F02', nombre: 'PLACA 1 (Cielo Viga a la Vista): Machihembrado Pino', desc: 'Se instala sobre la viga. Estilo de madera clásico y cálido.', unidad: 'm²', ufRef: 1.15 },
          { id: 'tec_F03', nombre: 'CIELO TRADICIONAL (Bajo cerchas): Volcanita RH / Fibro', desc: 'Se cuelga de las cerchas. Cielo cerrado liso e invisible estructuralmente.', unidad: 'm²', ufRef: 0.85 },
          
          // Costaneras (Crean la cámara de aire)
          { id: 'tec_F04', nombre: 'Costaneras pino 2x1" (Separadores)', desc: 'Crea la cámara de aire mínima sobre la placa de cielo para pasar cables y proteger de los clavos.', unidad: 'm²', ufRef: 0.30 },
          { id: 'tec_F05', nombre: 'Costaneras pino 2x2" / 2x3" (Estructurales)', desc: 'Cámara más ancha para aislación gruesa o para estructurar cubiertas metálicas.', unidad: 'm²', ufRef: 0.40 },
          
          // Aislación y Barreras
          { id: 'tec_F06', nombre: 'Aislación: Lana mineral/vidrio (80/100mm)', desc: 'Control térmico y acústico (ruido de lluvia). Instalada en la cámara.', unidad: 'm²', ufRef: 0.45 },
          { id: 'tec_F07', nombre: 'Aislación: Espuma poliuretano proyectado', desc: 'Aislación premium monolítica. Elimina completamente condensación y puentes térmicos.', unidad: 'm²', ufRef: 0.95 },
          { id: 'tec_F08', nombre: 'Barrera de Vapor (Polietileno 0.15mm)', desc: 'Va en la cara cálida (sobre la placa cielo) para que el vapor interior no moje la aislación.', unidad: 'm²', ufRef: 0.12 },
          { id: 'tec_F09', nombre: 'Barrera Hidrófuga Respirable (Tyvek)', desc: 'Va bajo la placa superior. Impide paso de agua exterior, deja salir humedad interior.', unidad: 'm²', ufRef: 0.20 },

          // Placa Superior (Base de Cubierta)
          { id: 'tec_F10', nombre: 'PLACA 2 (Base Cubierta): OSB 11.1mm', desc: 'Sustrato liso final sobre las costaneras. Requerido para recibir tejuelas asfálticas.', unidad: 'm²', ufRef: 0.50 },
          { id: 'tec_F11', nombre: 'PLACA 2 (Base Cubierta): OSB 15.1mm', desc: 'Mayor exigencia para luces más anchas o techos que necesiten ser transitables.', unidad: 'm²', ufRef: 0.65 },
          { id: 'tec_F12', nombre: 'Fieltro asfáltico 15 lbs (Membrana Base)', desc: 'Última línea de defensa impermeabilizante bajo la cubierta final.', unidad: 'm²', ufRef: 0.15 },
        ],
      },

      {
        id: 'tec_G',
        nombre: 'Material de Cubierta Exterior',
        desc: 'La piel final del techo expuesta a la intemperie. La elección afecta el peso, la durabilidad y la estética.',
        items: [
          { id: 'tec_G01', nombre: 'Tejuela asfáltica 3 lengüetas estándar', desc: 'Excelente relación precio/calidad. Se fija con 4 a 6 clavos terranos por palmeta.', unidad: 'm²', ufRef: 0.95 },
          { id: 'tec_G02', nombre: 'Tejuela asfáltica arquitectónica laminada', desc: 'Apariencia de alta definición, mayor relieve y máxima resistencia a vientos fuertes.', unidad: 'm²', ufRef: 1.55 },
          { id: 'tec_G03', nombre: 'Panel continuo Zinc-Alum PV4/PV6', desc: 'Planchas a medida (sin uniones transversales). Ideal para pendientes muy bajas (estilo mediterráneo).', unidad: 'm²', ufRef: 0.90 },
          { id: 'tec_G04', nombre: 'Teja metálica estampada gravillada', desc: 'Look de teja colonial chilena pero con un peso 8 veces menor. Larga vida útil.', unidad: 'm²', ufRef: 1.45 },
          { id: 'tec_G05', nombre: 'Teja de arcilla o cemento tradicional', desc: 'Máxima durabilidad y aislación térmica natural. Requiere estructura reforzada por su alto peso.', unidad: 'm²', ufRef: 2.25 },
          { id: 'tec_G06', nombre: 'Policarbonato alveolar 6mm/8mm (Terrazas)', desc: 'Permite luz natural. Incluye sistema completo de perfiles H (unión) y U (sellado bordes).', unidad: 'm²', ufRef: 0.95 },
          { id: 'tec_G07', nombre: 'Policarbonato sólido liso 4mm (Terrazas)', desc: 'Estética de vidrio templado, bloquea radiación UV y es altamente resistente al granizo e impactos.', unidad: 'm²', ufRef: 1.75 },
        ],
      },

      {
        id: 'tec_H',
        nombre: 'Hojalatería, Evacuación de Aguas Lluvias y Remates',
        desc: 'Puntos críticos para evitar filtraciones y controlar el flujo de agua hacia el suelo.',
        items: [
          { id: 'tec_H01', nombre: 'Cumbrera tejuela asfáltica (Caballete armado)', desc: 'Remate superior fabricado a partir de la misma tejuela asfáltica para consistencia visual.', unidad: 'ml', ufRef: 0.35 },
          { id: 'tec_H02', nombre: 'Cumbrera metálica con ventilación cruzada', desc: 'Posee un espaciador pasivo que permite evacuar el vapor caliente del entretecho.', unidad: 'ml', ufRef: 0.50 },
          { id: 'tec_H03', nombre: 'Forros ocultos limahoyas/limatesas', desc: 'Canales de hojalata galvanizada instalados bajo la cubierta en intersecciones de techos en L o faldones.', unidad: 'ml', ufRef: 0.40 },
          { id: 'tec_H04', nombre: 'Manto pasatecho o faldón para ductos', desc: 'Sello impermeable de hojalata y silicona alta temperatura para salidas redondas de cañones o ventilaciones.', unidad: 'ud', ufRef: 0.55 },
          { id: 'tec_H05', nombre: 'Corta goteras perimetral', desc: 'Moldura metálica bajo el fieltro que aleja la gota del borde de la madera para evitar pudrición.', unidad: 'ml', ufRef: 0.20 },
          { id: 'tec_H06', nombre: 'Canaleta de caída PVC (Estándar/Colonial)', desc: 'Sistema modular fácil de mantener, no se oxida. Incluye soportes, esquinas y embudos de caída.', unidad: 'ml', ufRef: 0.35 },
          { id: 'tec_H07', nombre: 'Canaleta oculta Zinc-Alum continua', desc: 'Fabricada a medida sin cortes. Estética limpia y minimalista, previene filtraciones en uniones.', unidad: 'ml', ufRef: 0.60 },
          { id: 'tec_H08', nombre: 'Bajada de aguas lluvias (PVC o Metálica)', desc: 'Tubo vertical (ø75/100mm) anclado al pilar o muro para conducir el agua al suelo sin salpicar.', unidad: 'ml', ufRef: 0.25 },
          { id: 'tec_H09', nombre: 'Cadena estética de drenaje pluvial', desc: 'Alternativa visual (Acero/Cobre) a la bajada plástica. El agua escurre por los eslabones.', unidad: 'ml', ufRef: 0.70 },
          { id: 'tec_H10', nombre: 'Cámara decantadora de piso y drenaje', desc: 'Receptáculo a nivel de suelo para recibir la bajada y conectar a red de aguas lluvias o drenaje francés.', unidad: 'ud', ufRef: 1.60 },
        ],
      },

      {
        id: 'tec_I',
        nombre: 'Terminaciones, Tratamientos y Electricidad (Cobertizos)',
        desc: 'Cierres finales, protección de materiales a la intemperie y funcionalidad eléctrica para uso exterior.',
        items: [
          { id: 'tec_I01', nombre: 'Tratamiento maderas (Impregnante + Barniz UV)', desc: 'Doble protección contra hongos, humedad, termitas y deterioro por radiación solar.', unidad: 'm²', ufRef: 0.30 },
          { id: 'tec_I02', nombre: 'Tapacán perimetral y Cierre de aleros', desc: 'Madera de 1x8" o placa de Fibrocemento que oculta las cabezas de vigas y evita anidación de pájaros.', unidad: 'ml', ufRef: 0.35 },
          { id: 'tec_I03', nombre: 'Canalización eléctrica embutida', desc: 'Uso de tubo corrugado ignífugo, cableado totalmente oculto en la cámara de aire del cielo.', unidad: 'ml', ufRef: 0.45 },
          { id: 'tec_I04', nombre: 'Canalización eléctrica exterior a la vista', desc: 'Tubería de acero EMT rígida para estilo industrial o conduit plástico de alta resistencia a golpes.', unidad: 'ml', ufRef: 0.40 },
          { id: 'tec_I05', nombre: 'Centro iluminación + Spot LED embutido exterior', desc: 'Perforación exacta en cielo, cableado THHN y luminaria con protección IP65 contra agua.', unidad: 'pto', ufRef: 1.45 },
          { id: 'tec_I06', nombre: 'Centro de enchufes e interruptores estancos', desc: 'Artefactos eléctricos con tapa protectora (IP54/IP65) seguros contra lluvia y humedad ambiente.', unidad: 'pto', ufRef: 1.65 },
          { id: 'tec_I07', nombre: 'Instalación de ventilador de techo o calefactor', desc: 'Refuerzo estructural especial en viga central y línea eléctrica de fuerza para confort.', unidad: 'ud', ufRef: 1.20 },
        ]
      }
    ]
  },
  // ══════════════════════════════════════════════════════════════════════════
  // 7. MUROS PERIMETRALES
  // ══════════════════════════════════════════════════════════════════════════
  muros_perimetrales: {
    label:  'Muros Perimetrales',
    emoji:  '🚧',
    ufMin:  1.5,
    ufMax:  5,
    unidad: 'm²',
    desc:   'Cierres perimetrales, panderetas, albañilería, rejas y portones.',

    grupos: [

      {
        id: 'mur_A',
        nombre: 'Cimiento y Sobrecimiento',
        items: [
          { id: 'mur_A01', nombre: 'Trazado, excavación zanjas y retiro tierra', unidad: 'ml', ufRef: 0.45 },
          { id: 'mur_A02', nombre: 'Emplantillado hormigón pobre 5cm', unidad: 'ml', ufRef: 0.12 },
          { id: 'mur_A03', nombre: 'Cimiento corrido hormigón ciclópeo H15', unidad: 'ml', ufRef: 0.65 },
          { id: 'mur_A04', nombre: 'Sobrecimiento armado H20 (20×30cm)', unidad: 'ml', ufRef: 0.50 },
          { id: 'mur_A05', nombre: 'Impermeabilización sobrecimiento (asfalto caucho)', unidad: 'ml', ufRef: 0.12 },
        ],
      },

      {
        id: 'mur_B',
        nombre: 'Muros y Pilares',
        items: [
          { id: 'mur_B01', nombre: 'Muro albañilería ladrillo fiscal 14cm', unidad: 'm²', ufRef: 2.10 },
          { id: 'mur_B02', nombre: 'Muro albañilería bloque cemento vibrado 15cm', unidad: 'm²', ufRef: 1.60 },
          { id: 'mur_B03', nombre: 'Pandereta placa vibrada tipo Bulldog (instalación + suministro)', unidad: 'ml', ufRef: 1.10 },
          { id: 'mur_B04', nombre: 'Pilares de amarre hormigón armado H20 20×20cm', unidad: 'ud', ufRef: 0.55 },
          { id: 'mur_B05', nombre: 'Cadena superior hormigón armado', unidad: 'ml', ufRef: 0.45 },
          { id: 'mur_B06', nombre: 'Muro ladrillo decorativo a la vista (sin estuco)', unidad: 'm²', ufRef: 2.80 },
          { id: 'mur_B07', nombre: 'Pretil hormigón armado (coronamiento)', unidad: 'ml', ufRef: 0.55 },
        ],
      },

      {
        id: 'mur_C',
        nombre: 'Rejas y Portones',
        items: [
          { id: 'mur_C01', nombre: 'Reja frontal tubo cuadrado 40×2mm + punta lanza', unidad: 'm²', ufRef: 2.30 },
          { id: 'mur_C02', nombre: 'Reja frontal diseño contemporáneo (tubo rect + plano)', unidad: 'm²', ufRef: 2.80 },
          { id: 'mur_C03', nombre: 'Portón peatonal metálico abatible 1×2m', unidad: 'ud', ufRef: 2.20 },
          { id: 'mur_C04', nombre: 'Portón vehicular corredera manual (por m²)', unidad: 'm²', ufRef: 3.50 },
          { id: 'mur_C05', nombre: 'Portón vehicular abatible 2 hojas (por m²)', unidad: 'm²', ufRef: 3.20 },
          { id: 'mur_C06', nombre: 'Motor portón corredera 800kg + cremallera nylon', unidad: 'ud', ufRef: 5.80 },
          { id: 'mur_C07', nombre: 'Motor portón batiente (kit 2 brazos + mando)', unidad: 'ud', ufRef: 6.50 },
          { id: 'mur_C08', nombre: 'Botonera exterior + intercomunicador', unidad: 'ud', ufRef: 0.90 },
          { id: 'mur_C09', nombre: 'Fotocélulas seguridad portón (par)', unidad: 'ud', ufRef: 0.40 },
          { id: 'mur_C10', nombre: 'Luz de cortesía LED portón (punto eléctrico)', unidad: 'pt', ufRef: 0.35 },
        ],
      },

      {
        id: 'mur_D',
        nombre: 'Terminaciones',
        items: [
          { id: 'mur_D01', nombre: 'Estuco exterior proyectado + platachado', unidad: 'm²', ufRef: 0.70 },
          { id: 'mur_D02', nombre: 'Pintura exterior texturada (2 manos)', unidad: 'm²', ufRef: 0.22 },
          { id: 'mur_D03', nombre: 'Revestimiento piedra fachaleta', unidad: 'm²', ufRef: 1.60 },
          { id: 'mur_D04', nombre: 'Revestimiento cerámica / porcelanato exterior', unidad: 'm²', ufRef: 1.25 },
          { id: 'mur_D05', nombre: 'Pintura esmalte anticorrosivo reja (2 manos)', unidad: 'm²', ufRef: 0.22 },
          { id: 'mur_D06', nombre: 'Galvanizado en caliente reja (servicio externo)', unidad: 'kg', ufRef: 0.04 },
          { id: 'mur_D07', nombre: 'Coronamiento muro mortero + burbuja / pirca', unidad: 'ml', ufRef: 0.18 },
        ],
      },

      {
        id: 'mur_E',
        nombre: 'Iluminación y Seguridad Perimetral',
        items: [
          { id: 'mur_E01', nombre: 'Punto luz exterior muro (farol + cañería + cable)', unidad: 'pt', ufRef: 0.45 },
          { id: 'mur_E02', nombre: 'Luminaria LED empotrada muro (balizamiento)', unidad: 'ud', ufRef: 0.55 },
          { id: 'mur_E03', nombre: 'Sensor de movimiento + luminaria (aplique)', unidad: 'ud', ufRef: 0.65 },
          { id: 'mur_E04', nombre: 'Cámara IP exterior domo (punto + cañería + cámara)', unidad: 'ud', ufRef: 1.20 },
          { id: 'mur_E05', nombre: 'Cañería visible conduit galvanizado ø20mm exterior', unidad: 'ml', ufRef: 0.10 },
        ],
      },
    ],
  },


  // ══════════════════════════════════════════════════════════════════════════
  // 8. INSTALACIONES GENERALES (módulo standalone reutilizable)
  // ══════════════════════════════════════════════════════════════════════════
  instalaciones_generales: {
    label:  'Instalaciones Generales',
    emoji:  '⚡',
    ufMin:  null,
    ufMax:  null,
    unidad: 'pt / ml / ud',
    desc:   'Módulo de instalaciones eléctricas, sanitarias y de gas para cualquier proyecto.',

    grupos: [

      // ── TABLERO ELÉCTRICO ─────────────────────────────────────────────────
      {
        id: 'ig_A',
        nombre: 'Tablero Eléctrico',
        items: [
          { id: 'ig_A01', nombre: 'Tablero principal 24 circuitos DIN (gabinete + riel + bornes)', unidad: 'ud', ufRef: 2.20 },
          { id: 'ig_A02', nombre: 'Tablero secundario 12 circuitos DIN', unidad: 'ud', ufRef: 1.20 },
          { id: 'ig_A03', nombre: 'Interruptor diferencial 2×25A 30mA (ID)', unidad: 'ud', ufRef: 0.55 },
          { id: 'ig_A04', nombre: 'Interruptor diferencial 4×40A 30mA (ID trifásico)', unidad: 'ud', ufRef: 1.20 },
          { id: 'ig_A05', nombre: 'Disyuntor termomagnético 1×10A / 16A / 20A', unidad: 'ud', ufRef: 0.18 },
          { id: 'ig_A06', nombre: 'Disyuntor termomagnético 2×25A (cocina)', unidad: 'ud', ufRef: 0.35 },
          { id: 'ig_A07', nombre: 'Llave Sica / pastilla reconectadora SEC', unidad: 'ud', ufRef: 0.45 },
          { id: 'ig_A08', nombre: 'Puesta a tierra (jabalina copperweld 5/8"×1.8m)', unidad: 'ud', ufRef: 0.80 },
          { id: 'ig_A09', nombre: 'Medidor de energía (trámite + instalación)', unidad: 'ud', ufRef: 0.50 },
        ],
      },

      // ── CANALIZACIÓN ELÉCTRICA ────────────────────────────────────────────
      {
        id: 'ig_B',
        nombre: 'Canalización Eléctrica',
        items: [
          { id: 'ig_B01', nombre: 'Cañería PVC corrugada ø16mm embutida en muro/losa', unidad: 'ml', ufRef: 0.05 },
          { id: 'ig_B02', nombre: 'Cañería PVC corrugada ø20mm embutida', unidad: 'ml', ufRef: 0.06 },
          { id: 'ig_B03', nombre: 'Cañería PVC corrugada ø25mm embutida (circuitos fuerza)', unidad: 'ml', ufRef: 0.08 },
          { id: 'ig_B04', nombre: 'Cañería PVC corrugada ø32mm embutida (alimentador)', unidad: 'ml', ufRef: 0.10 },
          { id: 'ig_B05', nombre: 'Conduit EMT ø3/4" superficial (visible)', unidad: 'ml', ufRef: 0.14 },
          { id: 'ig_B06', nombre: 'Conduit galvanizado ø3/4" exterior', unidad: 'ml', ufRef: 0.18 },
          { id: 'ig_B07', nombre: 'Bandeja porta cable perforada (por ml)', unidad: 'ml', ufRef: 0.30 },
          { id: 'ig_B08', nombre: 'Caja derivación rectangular 10×5cm embutida', unidad: 'ud', ufRef: 0.06 },
          { id: 'ig_B09', nombre: 'Caja derivación octogonal (punto de luz)', unidad: 'ud', ufRef: 0.06 },
          { id: 'ig_B10', nombre: 'Caja profunda 4×4" (tablero chico / concentración)', unidad: 'ud', ufRef: 0.08 },
        ],
      },

      // ── CABLES ────────────────────────────────────────────────────────────
      {
        id: 'ig_C',
        nombre: 'Cables',
        items: [
          { id: 'ig_C01', nombre: 'Cable THW 2×1.5mm² iluminación', unidad: 'ml', ufRef: 0.03 },
          { id: 'ig_C02', nombre: 'Cable THW 2×2.5mm² iluminación / enchufes', unidad: 'ml', ufRef: 0.04 },
          { id: 'ig_C03', nombre: 'Cable THW 2×4mm² enchufes de fuerza', unidad: 'ml', ufRef: 0.06 },
          { id: 'ig_C04', nombre: 'Cable THW 2×6mm² alimentador sub-tablero', unidad: 'ml', ufRef: 0.09 },
          { id: 'ig_C05', nombre: 'Cable THW 2×10mm² acometida / cocina eléctrica', unidad: 'ml', ufRef: 0.14 },
          { id: 'ig_C06', nombre: 'Cable tierra verde/amarillo 2.5mm²', unidad: 'ml', ufRef: 0.03 },
          { id: 'ig_C07', nombre: 'Cable FTP Cat6 datos / cámara', unidad: 'ml', ufRef: 0.05 },
          { id: 'ig_C08', nombre: 'Cable coaxial RG6 (TV/antena)', unidad: 'ml', ufRef: 0.04 },
        ],
      },

      // ── PUNTOS ELÉCTRICOS DETALLADOS ──────────────────────────────────────
      {
        id: 'ig_D',
        nombre: 'Puntos Eléctricos (Mano de Obra + Material)',
        items: [
          { id: 'ig_D01', nombre: 'Enchufe simple 10A (caja + cable + placa Bticino/similar)', unidad: 'pt', ufRef: 0.22 },
          { id: 'ig_D02', nombre: 'Enchufe doble 10A', unidad: 'pt', ufRef: 0.26 },
          { id: 'ig_D03', nombre: 'Enchufe triple 10A', unidad: 'pt', ufRef: 0.32 },
          { id: 'ig_D04', nombre: 'Enchufe 16A (monofásico, horno / lavadora)', unidad: 'pt', ufRef: 0.38 },
          { id: 'ig_D05', nombre: 'Enchufe 2P+T estanco IP44 exterior', unidad: 'pt', ufRef: 0.42 },
          { id: 'ig_D06', nombre: 'Interruptor simple 10A', unidad: 'pt', ufRef: 0.18 },
          { id: 'ig_D07', nombre: 'Interruptor doble 10A', unidad: 'pt', ufRef: 0.22 },
          { id: 'ig_D08', nombre: 'Interruptor triple 10A', unidad: 'pt', ufRef: 0.26 },
          { id: 'ig_D09', nombre: 'Conmutador (interruptor de escalera)', unidad: 'pt', ufRef: 0.28 },
          { id: 'ig_D10', nombre: 'Interruptor dimmer 400W', unidad: 'pt', ufRef: 0.40 },
          { id: 'ig_D11', nombre: 'Interruptor sensor horario / crepuscular', unidad: 'pt', ufRef: 0.55 },
          { id: 'ig_D12', nombre: 'Punto luz colgante (caja octogonal + roseta + cable)', unidad: 'pt', ufRef: 0.20 },
          { id: 'ig_D13', nombre: 'Punto downlight embutido LED (caja + cable + roseta)', unidad: 'pt', ufRef: 0.22 },
          { id: 'ig_D14', nombre: 'Punto spot dicroico empotrado (caja + cable)', unidad: 'pt', ufRef: 0.20 },
          { id: 'ig_D15', nombre: 'Punto luz exterior (caja estanca + cable)', unidad: 'pt', ufRef: 0.35 },
          { id: 'ig_D16', nombre: 'Punto TV RG6 (caja + cable + roseta F)', unidad: 'pt', ufRef: 0.20 },
          { id: 'ig_D17', nombre: 'Punto datos Cat6 (caja + FTP + roseta keystone)', unidad: 'pt', ufRef: 0.28 },
          { id: 'ig_D18', nombre: 'Punto extractor baño 100mm (cañería + caja + cable)', unidad: 'pt', ufRef: 0.30 },
          { id: 'ig_D19', nombre: 'Punto campana extractora (enchufe + cable)', unidad: 'pt', ufRef: 0.28 },
          { id: 'ig_D20', nombre: 'Punto calefont eléctrico / acumulador (32A)', unidad: 'pt', ufRef: 0.55 },
          { id: 'ig_D21', nombre: 'Punto carga VE (auto eléctrico) 32A + protección', unidad: 'pt', ufRef: 1.80 },
        ],
      },

      // ── RED AGUA FRÍA Y CALIENTE ──────────────────────────────────────────
      {
        id: 'ig_E',
        nombre: 'Red Agua Fría y Caliente',
        items: [
          { id: 'ig_E01', nombre: 'Colector PPR ø25mm distribución (entrada agua)', unidad: 'ud', ufRef: 0.35 },
          { id: 'ig_E02', nombre: 'Tubería PPR PN20 ø20mm (AF)', unidad: 'ml', ufRef: 0.18 },
          { id: 'ig_E03', nombre: 'Tubería PPR PN20 ø25mm (AF, colector principal)', unidad: 'ml', ufRef: 0.22 },
          { id: 'ig_E04', nombre: 'Tubería cobre 1/2" (AC + soldadura)', unidad: 'ml', ufRef: 0.28 },
          { id: 'ig_E05', nombre: 'Tubería cobre 3/4" (bajante caliente principal)', unidad: 'ml', ufRef: 0.35 },
          { id: 'ig_E06', nombre: 'Llave de paso esfera 1/2" embutida por recinto', unidad: 'ud', ufRef: 0.22 },
          { id: 'ig_E07', nombre: 'Llave de paso esfera 3/4" corte general', unidad: 'ud', ufRef: 0.28 },
          { id: 'ig_E08', nombre: 'Válvula reductora de presión 3/4"', unidad: 'ud', ufRef: 0.55 },
          { id: 'ig_E09', nombre: 'Aislación tubería AC (tuboflex 1/2" y 3/4")', unidad: 'ml', ufRef: 0.08 },
          { id: 'ig_E10', nombre: 'Punto gasfitería lavamanos (AF + AC + sifón PVC)', unidad: 'pt', ufRef: 0.55 },
          { id: 'ig_E11', nombre: 'Punto gasfitería WC (AF + válvula flotador)', unidad: 'pt', ufRef: 0.40 },
          { id: 'ig_E12', nombre: 'Punto gasfitería ducha / tina (AF + AC empotrada)', unidad: 'pt', ufRef: 0.60 },
          { id: 'ig_E13', nombre: 'Punto gasfitería lavarropa (AF + llave + desagüe)', unidad: 'pt', ufRef: 0.45 },
          { id: 'ig_E14', nombre: 'Punto gasfitería calefont / termost (AF + AC + flex)', unidad: 'pt', ufRef: 0.55 },
          { id: 'ig_E15', nombre: 'Calefont mural gas 11L (suministro + instalación)', unidad: 'ud', ufRef: 2.80 },
          { id: 'ig_E16', nombre: 'Calefont instantáneo eléctrico 7.5kW', unidad: 'ud', ufRef: 1.20 },
          { id: 'ig_E17', nombre: 'Termoestanque eléctrico 150L (instalación completa)', unidad: 'ud', ufRef: 2.20 },
          { id: 'ig_E18', nombre: 'Bomba de recirculación AC (calor instantáneo)', unidad: 'ud', ufRef: 1.80 },
          { id: 'ig_E19', nombre: 'Estanque acumulación agua fría 500L (fibra de vidrio)', unidad: 'ud', ufRef: 3.50 },
          { id: 'ig_E20', nombre: 'Bomba elevación presión 1/2HP + presostato', unidad: 'ud', ufRef: 2.20 },
        ],
      },

      // ── RED SANITARIA / EVACUACIÓN ────────────────────────────────────────
      {
        id: 'ig_F',
        nombre: 'Red Sanitaria y Evacuación',
        items: [
          { id: 'ig_F01', nombre: 'Tubería PVC desagüe ø40mm', unidad: 'ml', ufRef: 0.12 },
          { id: 'ig_F02', nombre: 'Tubería PVC desagüe ø50mm', unidad: 'ml', ufRef: 0.14 },
          { id: 'ig_F03', nombre: 'Tubería PVC desagüe ø75mm', unidad: 'ml', ufRef: 0.18 },
          { id: 'ig_F04', nombre: 'Tubería PVC colector ø110mm (bajante WC)', unidad: 'ml', ufRef: 0.22 },
          { id: 'ig_F05', nombre: 'Tubería PVC colector ø160mm (horizontal enterrado)', unidad: 'ml', ufRef: 0.35 },
          { id: 'ig_F06', nombre: 'Tubería ventilación PVC ø63mm (hasta cubierta)', unidad: 'ml', ufRef: 0.16 },
          { id: 'ig_F07', nombre: 'Sombrero ventilación PVC pasatecho', unidad: 'ud', ufRef: 0.18 },
          { id: 'ig_F08', nombre: 'Trampa sifónica PVC 2" (desagüe ducha/lavamanos)', unidad: 'ud', ufRef: 0.12 },
          { id: 'ig_F09', nombre: 'Sifón curva 100×50mm (tipo WC)', unidad: 'ud', ufRef: 0.15 },
          { id: 'ig_F10', nombre: 'Cámara de inspección PVC ø110mm con tapa', unidad: 'ud', ufRef: 0.80 },
          { id: 'ig_F11', nombre: 'Cámara de inspección H.A. 40×40cm con tapa HF', unidad: 'ud', ufRef: 1.80 },
          { id: 'ig_F12', nombre: 'Trampa de grasa 20L (norma aguas servidas cocina)', unidad: 'ud', ufRef: 1.20 },
          { id: 'ig_F13', nombre: 'Sumidero piso ducha ø50mm (desagüe lineal acero inox)', unidad: 'ud', ufRef: 0.55 },
          { id: 'ig_F14', nombre: 'Conexión a red alcantarillado existente (exterior)', unidad: 'ud', ufRef: 1.20 },
        ],
      },

      // ── GAS ───────────────────────────────────────────────────────────────
      {
        id: 'ig_G',
        nombre: 'Instalación Gas',
        items: [
          { id: 'ig_G01', nombre: 'Cañería cobre gas 1/4" (calefont chico)', unidad: 'ml', ufRef: 0.18 },
          { id: 'ig_G02', nombre: 'Cañería cobre gas 1/2"', unidad: 'ml', ufRef: 0.22 },
          { id: 'ig_G03', nombre: 'Cañería cobre gas 3/4" (bajante principal)', unidad: 'ml', ufRef: 0.28 },
          { id: 'ig_G04', nombre: 'Cañería cobre gas 1" (colector edificio)', unidad: 'ml', ufRef: 0.38 },
          { id: 'ig_G05', nombre: 'Llave de paso esfera cobre 1/2" (por equipo)', unidad: 'ud', ufRef: 0.20 },
          { id: 'ig_G06', nombre: 'Llave de paso esfera 3/4" (corte general)', unidad: 'ud', ufRef: 0.28 },
          { id: 'ig_G07', nombre: 'Regulador de presión gas licuado 1ª etapa', unidad: 'ud', ufRef: 0.35 },
          { id: 'ig_G08', nombre: 'Punto gas calefont / cocina (llave + conexión flexible)', unidad: 'pt', ufRef: 0.60 },
          { id: 'ig_G09', nombre: 'Detector gas licuado GLP (sensor bajo + alarma)', unidad: 'ud', ufRef: 0.55 },
          { id: 'ig_G10', nombre: 'Detector gas natural (sensor alto + alarma)', unidad: 'ud', ufRef: 0.55 },
          { id: 'ig_G11', nombre: 'Prueba de estanqueidad + certificado SEC Gas', unidad: 'gl', ufRef: 1.50 },
        ],
      },
    ],
  },

};