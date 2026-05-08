// ════════════════════════════════════════════════════════════════════════════
// gasfiteriaData.js — HV CONSTRUCCIÓN CHILE
// Gasfitería, Sanitaria y Remodelación — v4.0 Productos Verificados
//
// MODELO DE PRECIOS:
//   precioMO_clp  → Mano de obra pura (colaborador instala, cliente pone materiales)
//   precioMat_clp → Materiales base (tier estándar que HV suministra)
//   variante.precioMat_clp → Precio materiales de ESA variante específica
//
// COLABORADOR cobra 70% de la MO | HV retiene 30% MO + margen materiales (~20%)
//
// PRECIOS REFERENCIA MERCADO CHILENO — mayo 2026 | UF = $40.160 CLP
// Fuente: Sodimac.cl | Easy.cl | Chilemat | Distribuidoras mayoristas
// ════════════════════════════════════════════════════════════════════════════

const UF_VALOR = 40_160;
const ufToClp = (uf) => Math.round(uf * UF_VALOR);
const toUF    = (clp) => parseFloat((clp / UF_VALOR).toFixed(3));

// ─── HELPER para crear variantes de forma limpia ─────────────────────────────
const mkVar = (id, tier, nombre, marca, modelo, mat_uf, specs = {}, extras = {}) => ({
  id,
  tier,     // 'economico' | 'estandar' | 'premium' | 'lujo'
  nombre,
  marca,
  modelo,
  precioMat_clp: ufToClp(mat_uf),
  specs,
  ...extras,
});

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 1: BAÑOS COMPLETOS (Configurador Interactivo)
// ════════════════════════════════════════════════════════════════════════════

const banoItems = [

  // ── 1.1 BAÑO COMPLETO ESTÁNDAR ────────────────────────────────────────────
  {
    id: 'gas_bano_nuevo_std',
    nombre: 'Baño Completo Nuevo (Estándar Configurable)',
    desc: `Remodelación integral desde cero: demolición y retiro de escombros, 
nivelación láser del piso, impermeabilización con membrana líquida Sikatop en piso y 
muros de ducha (2 capas), red nueva de agua fría y caliente en PPR PN20 por termofusión, 
colectores de desagüe PVC Ø50-110mm con pendiente normativa 2%, losa de cerámica/porcelanato 
con adhesivo flexible DA y fraguado antihongo. El valor base incluye WC estándar, 
lavamanos con pedestal, tina clásica y cerámica 40×40. Cada terminación es configurable.`,
    unidad: 'ud',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(18.00),
    precioMat_clp: ufToClp(14.00), // tier estándar
    nota_tecnica: 'Superficie típica: 4-6 m². Tiempo de ejecución: 10-14 días hábiles. Incluye prueba de presión hidráulica antes de cerrar muros.',

    opcionesPersonalizacion: [

      // W.C.
      {
        categoria: 'W.C. — Inodoro',
        nota: 'El WC define el estilo del baño. La diferencia entre dual-flush y tradicional es el consumo de agua: hasta 50% de ahorro.',
        opciones: [
          {
            id: 'wc_std_1',
            nombre: 'Fanaloza Classic 2 Piezas (Descarga 6L)',
            tier: 'economico',
            marca: 'Fanaloza (Chile)',
            modelo: 'Classic FP600',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Descarga: '6L', Material: 'Cerámica vitrificada', Color: 'Blanco', Garantía: '1 año' },
            disponibilidad: 'Sodimac, Easy',
          },
          {
            id: 'wc_std_2',
            nombre: 'Corona Savona Duo Flush (3/6L) — Incluido en precio base',
            tier: 'estandar',
            marca: 'Corona (EE.UU.)',
            modelo: 'Savona Duo 21EL',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Descarga: 'Dual 3L / 6L', Material: 'Vitreous China', Ahorro: '50% agua vs. 6L único', Garantía: '5 años estructura' },
            disponibilidad: 'Sodimac, Easy, Corona dealers',
          },
          {
            id: 'wc_std_3',
            nombre: 'Roca The Gap One Piece (Dual Flush)',
            tier: 'premium',
            marca: 'Roca (España)',
            modelo: 'The Gap A34H47C000',
            extraMO_uf: 0, extraMat_uf: 2.80,
            specs: { Diseño: 'One Piece compacto', Descarga: 'Dual 2.5L / 4.5L', Tapa: 'Amortiguada incluida', Garantía: '5 años' },
            disponibilidad: 'Sodimac, Roca dealers',
          },
          {
            id: 'wc_std_4',
            nombre: 'FV Siena One Piece Elongado',
            tier: 'premium',
            marca: 'FV (Argentina/Brasil)',
            modelo: 'Siena Gama II',
            extraMO_uf: 0, extraMat_uf: 2.20,
            specs: { Diseño: 'Elongado one piece', Descarga: 'Dual 3/6L', Tapa: 'Amortiguada', Garantía: '3 años' },
            disponibilidad: 'Sodimac, Easy',
          },
          {
            id: 'wc_std_5',
            nombre: 'WC Suspendido Geberit + Roca Rimless (Sin bordes, máxima higiene)',
            tier: 'lujo',
            marca: 'Geberit (Suiza) + Roca (España)',
            modelo: 'Duofix Basic + The Gap Rimless',
            extraMO_uf: 2.80, extraMat_uf: 8.50,
            nota: 'Requiere tabique de mínimo 15cm de profundidad para el bastidor. El estanque queda completamente oculto. La placa pulsadora se instala en el tabique.',
            specs: { Bastidor: 'Geberit Duofix Basic H112cm', WC: 'Roca The Gap Rimless', Pulsador: 'Geberit Sigma20 Cromado', Descarga: 'Dual 3/6L' },
          },
        ],
      },

      // ZONA DE DUCHA
      {
        categoria: 'Zona de Ducha / Tina',
        nota: 'La zona de ducha define el lujo percibido del baño. El shower door en obra es el upgrade más valorizado.',
        opciones: [
          {
            id: 'ducha_std_1',
            nombre: 'Tina Enlozada 150×70cm Acero (Incluida)',
            tier: 'estandar',
            marca: 'Roca / Vainsa',
            modelo: 'Continental 150',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Dimensiones: '150×70cm', Material: 'Acero enlozado 3.5mm', Desagüe: 'Ø52mm', Garantía: '10 años esmalte' },
          },
          {
            id: 'ducha_std_2',
            nombre: 'Receptáculo Acrílico 80×80cm + Mampara Corredera 2 Hojas',
            tier: 'estandar',
            marca: 'Xenz (Holanda) + Profiltek (España)',
            modelo: 'Flat 80 + Serie Sena',
            extraMO_uf: 1.20, extraMat_uf: 4.80,
            specs: { Base: 'Acrílico reforzado 80×80cm', Mampara: 'Vidrio templado 6mm', Perfil: 'Aluminio anodizado' },
          },
          {
            id: 'ducha_std_3',
            nombre: 'Shower Door en Obra: Cerámica antideslizante + Vidrio Fijo 8mm',
            tier: 'premium',
            marca: 'Cristales Chile / Profiltek',
            modelo: 'Shower Door a Medida',
            extraMO_uf: 3.80, extraMat_uf: 5.50,
            nota: 'La solución más elegante y duradera. El shower door se construye con la misma cerámica del piso extendida al interior, más un panel o mampara de vidrio templado 8mm fijo o abatible.',
            specs: { Cerámica: 'Antideslizante (misma del piso)', Vidrio: 'Templado 8mm fijo', Perfil: 'Acero inox o aluminio' },
          },
        ],
      },

      // LAVAMANOS
      {
        categoria: 'Lavamanos + Grifería',
        opciones: [
          {
            id: 'lm_std_1',
            nombre: 'Lavamanos Pedestal + Grifería FV Stretto (Incluido)',
            tier: 'estandar',
            marca: 'Fanaloza + FV',
            modelo: 'Fanaloza F25 Pedestal + FV Stretto Monocomando',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Ancho: '50cm', Grifería: 'Monocomando cartucho cerámico', Desagüe: 'Con rebalse' },
          },
          {
            id: 'lm_std_2',
            nombre: 'Lavamanos Roca Hall 55cm + Grifería Roca Monodin Chrome',
            tier: 'premium',
            marca: 'Roca (España)',
            modelo: 'Hall 55 A327660000 + Monodin A5A3035C00',
            extraMO_uf: 0.50, extraMat_uf: 3.20,
            specs: { Ancho: '55cm', Material: 'Porcelana sanitaria', Grifería: 'Cartucho 35mm', Acabado: 'Cromo brillante' },
          },
          {
            id: 'lm_std_3',
            nombre: 'Vanitorio Flotante 60cm (MDF + Lavamanos sobreponer) + Grifería Grohe',
            tier: 'lujo',
            marca: 'Kohler + Grohe (Alemania)',
            modelo: 'Kohler Caxton K-2210 + Grohe BauEdge 23327001',
            extraMO_uf: 1.20, extraMat_uf: 7.50,
            specs: { Mueble: 'MDF lacado 60cm', Lavamanos: 'Sobreponer Kohler', Grifería: 'Grohe BauEdge cartucho SilkMove', Garantía: 'Grohe 5 años' },
          },
        ],
      },

      // REVESTIMIENTO
      {
        categoria: 'Revestimiento Piso y Muro',
        nota: 'La cerámica y el porcelanato definen el 60% del aspecto visual del baño.',
        opciones: [
          {
            id: 'rev_std_1',
            nombre: 'Cerámica 40×40cm Piso + 30×60cm Muro (Incluido)',
            tier: 'estandar',
            marca: 'Cordillera / Celima',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Piso: '40×40cm antideslizante', Muro: '30×60cm', Fragua: 'Antihongo', Adhesivo: 'Flexible DA' },
          },
          {
            id: 'rev_std_2',
            nombre: 'Porcelanato Rectificado 60×60cm Piso + 60×120cm Muro',
            tier: 'premium',
            marca: "Grès d'Alsace / Klipen / Portinari",
            extraMO_uf: 3.20, extraMat_uf: 7.80,
            specs: { Piso: '60×60cm rectificado', Muro: '60×120cm', Fragua: 'Epóxica premium', Técnica: 'Doble encolado + niveladores cuña' },
          },
          {
            id: 'rev_std_3',
            nombre: 'Gran Formato 90×90cm Piso + Mosaico Decorativo Zona Ducha',
            tier: 'lujo',
            marca: 'Novoceram / Hisbalit / Klipen',
            extraMO_uf: 5.50, extraMat_uf: 12.00,
            specs: { Piso: '90×90cm rectificado (manipulación con ventosas)', Mosaico: '30×30cm zona ducha', Fragua: 'Epóxica bicomponente' },
          },
        ],
      },

      // ESPEJO Y ACCESORIOS
      {
        categoria: 'Espejo y Accesorios',
        opciones: [
          {
            id: 'acc_std_1',
            nombre: 'Espejo Biselado 60×80cm + Kit Accesorios Inox (Incluido)',
            tier: 'estandar',
            marca: 'Cristalerías Chile',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Espejo: '60×80cm biselado', Kit: 'Toallero, papelero, jabonera inox' },
          },
          {
            id: 'acc_std_2',
            nombre: 'Espejo LED 80×60cm Antivaho + Demister + Accesorios Premium',
            tier: 'premium',
            marca: 'Aquatica / Kerovit',
            modelo: 'LED Mirror con función antivaho',
            extraMO_uf: 0.60, extraMat_uf: 3.50,
            specs: { Espejo: '80×60cm retroiluminado 5000K', Antivaho: 'Resistencia incorporada', Accesorios: 'Cromados premium' },
          },
        ],
      },
    ],
  },

  // ── 1.2 BAÑO COMPLETO ALTA GAMA ──────────────────────────────────────────
  {
    id: 'gas_bano_nuevo_prem',
    nombre: 'Baño Completo Alta Gama (Llave en Mano)',
    desc: `Remodelación de lujo total. Incluye nivelación con nivel láser rotativo, 
impermeabilización completa Mapei 2 componentes en piso y TODOS los muros, porcelanato 
rectificado mínimo 60×60cm con doble encolado y niveladores de cuña, griferías empotradas 
con llave de empotrar y ducto colector en acero inox, shower door de cristal templado 8mm 
fijo, WC suspendido con bastidor oculto. Pruebas de estanqueidad hidrostática certificadas 
con manómetro. Sellado fungicida final. Garantía HV extendida 2 años.`,
    unidad: 'ud',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(28.00),
    precioMat_clp: ufToClp(40.00),
    nota_tecnica: 'Superficie típica: 5-8 m². Tiempo: 18-25 días hábiles. Proyecto requiere visita técnica previa sin costo.',

    opcionesPersonalizacion: [
      {
        categoria: 'Sistema de Ducha Premium',
        opciones: [
          {
            id: 'ducha_prem_1',
            nombre: 'Columna Ducha Grohe Rainshower 310 (Incluida)',
            marca: 'Grohe (Alemania)',
            modelo: 'Rainshower 310 System 26641000',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Plato: 'Grohe Rainshower 310mm', Válvula: 'Thermostatic mixer', Caudal: '40 L/min' },
          },
          {
            id: 'ducha_prem_2',
            nombre: 'Sistema Empotrado Hansgrohe Raindance Select 360 + Termostatato',
            marca: 'Hansgrohe (Alemania)',
            modelo: 'Raindance Select 360 + Ecostat 1001CL',
            extraMO_uf: 2.50, extraMat_uf: 6.50,
            nota: 'Requiere cielo falso de 20cm mínimo para ocultar la acometida superior.',
            specs: { Plato: '360mm lluvia', Control: 'Termostático 2 salidas', Instalación: 'Empotrada en cielo' },
          },
          {
            id: 'ducha_prem_3',
            nombre: 'Cabina Hidromasaje 90×90cm 6 Jets + Aromaterapia + Bluetooth',
            marca: 'Aquaestil / Teuco',
            modelo: 'Aquaestil Plus 90×90',
            extraMO_uf: 4.00, extraMat_uf: 15.00,
            specs: { Dimensiones: '90×90cm', Jets: '6 jets laterales + plato lluvia', Extras: 'Radio bluetooth, aromaterapia, cromoterapia' },
          },
        ],
      },
      {
        categoria: 'Climatización y Calor',
        opciones: [
          {
            id: 'clim_prem_1',
            nombre: 'Extractor Soler & Palau Silent 100 (Incluido)',
            marca: 'Soler & Palau (España)',
            modelo: 'Silent-100 CRZ',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Caudal: '95 m³/h', Ruido: '26 dB(A)', Timer: 'Con temporizador' },
          },
          {
            id: 'clim_prem_2',
            nombre: 'Radiador Toallero Eléctrico 500W + Cromo',
            marca: 'Zehnder / Vasco',
            modelo: 'Zehnder Yucca Spark',
            extraMO_uf: 2.00, extraMat_uf: 7.50,
            specs: { Potencia: '500W', Acabado: 'Cromo', Control: 'Temporizador incorporado', Alto: '120cm' },
          },
          {
            id: 'clim_prem_3',
            nombre: 'Piso Radiante Eléctrico Nuheat + Termostato WiFi',
            marca: 'Nuheat (Canadá)',
            modelo: 'Nuheat Membrane + Signature WiFi',
            extraMO_uf: 4.50, extraMat_uf: 9.50,
            nota: 'Se instala la malla calefactora sobre el radier existente, cubierta por nivelador de piso antes del porcelanato. El termostato WiFi controla por App.',
            specs: { Potencia: '120W/m²', App: 'iOS y Android', Profundidad: '+12mm sobre radier', Garantía: '25 años malla' },
          },
        ],
      },
    ],
  },

  // ── 1.3 MEDIO BAÑO DE VISITAS ────────────────────────────────────────────
  {
    id: 'gas_medio_bano_visitas',
    nombre: 'Medio Baño de Visitas (Configurable)',
    desc: 'Ideal para espacios compactos (1.5-3 m²). Red de agua, desagüe, WC y lavamanos. Sin ducha ni tina.',
    unidad: 'ud',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(12.00),
    precioMat_clp: ufToClp(9.00),

    opcionesPersonalizacion: [
      {
        categoria: 'W.C.',
        opciones: [
          {
            id: 'wc_vis_1', nombre: 'Fanaloza Classic 2p (Incluido)', tier: 'economico',
            marca: 'Fanaloza', modelo: 'Classic FP600',
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Descarga: '6L', Dimensiones: '35×67cm' },
          },
          {
            id: 'wc_vis_2', nombre: 'Corona Compact One Piece (Dual 3/6L)', tier: 'estandar',
            marca: 'Corona', modelo: 'Cadet 3 One-Piece',
            extraMO_uf: 0, extraMat_uf: 1.80,
            specs: { Diseño: 'One Piece compacto', Descarga: 'Dual 3/6L', Largo: '62cm' },
          },
          {
            id: 'wc_vis_3', nombre: 'WC Suspendido Compacto Roca (Ideal bajo escalera)', tier: 'premium',
            marca: 'Roca', modelo: 'Meridian Compact Suspendido A34H649000',
            extraMO_uf: 2.20, extraMat_uf: 6.80,
            specs: { Largo: '48cm solo', Bastidor: 'Geberit Duofix 80cm', Ahorro_espacio: '+30% vs. suelo' },
          },
        ],
      },
      {
        categoria: 'Lavamanos',
        opciones: [
          {
            id: 'lm_vis_1', nombre: 'Lavamanos Mural Angular 42cm + Grifería FV (Incluido)', tier: 'estandar',
            marca: 'Fanaloza + FV', extraMO_uf: 0, extraMat_uf: 0,
            specs: { Ancho: '42cm', Tipo: 'Mural fijación a pared' },
          },
          {
            id: 'lm_vis_2', nombre: 'Vanitorio Suspendido 45cm con Puerta + Grifería Roca', tier: 'premium',
            marca: 'Roca', modelo: 'Gap Suspendido 45cm + Monodin',
            extraMO_uf: 0.60, extraMat_uf: 2.80,
            specs: { Ancho: '45cm', Mueble: 'Lacado blanco brillo', Lavamanos: 'Integrado sobre encimera' },
          },
          {
            id: 'lm_vis_3', nombre: 'Cubierta Silestone 50cm + Lavamanos Kohler Sobrecubierta', tier: 'lujo',
            marca: 'Cosentino Silestone + Kohler', extraMO_uf: 1.80, extraMat_uf: 5.00,
            specs: { Mesón: 'Silestone a medida', Lavamanos: 'Kohler Caxton K-2210 sobrecubierta', Grosor: '2cm' },
          },
        ],
      },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 2: AGUA CALIENTE — CALEFONTS, CALDERAS Y TERMOS
// ════════════════════════════════════════════════════════════════════════════

const aguaCalienteItems = [

  // ── 2.1 CALEFONT CONFIGURABLE ────────────────────────────────────────────
  {
    id: 'gas_calefont_custom',
    nombre: 'Instalación / Cambio Calefont Gas (Configurable)',
    desc: `Servicio integral que incluye: retiro del equipo antiguo y sus conexiones, 
instalación del nuevo equipo con fijación mural firme (tarugos expansivos de alta carga), 
conexión gas en cobre tipo L con soldadura fuerte (plata al 5%), dos flexibles trenzados 
de agua 1/2" certificados, prueba de estanqueidad manométrica 15 minutos, 
prueba de combustión con detector de CO, y encendido final con ajuste de llama. 
Certificado de instalación SEC incluido. El precio MO cubre todo lo anterior: 
el equipo se elige a continuación.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(2.80),  // Solo mano de obra (cliente trae equipo)
    precioMat_clp: ufToClp(1.20),  // Kit instalación: flexibles, llaves, codos, kit gas
    normativa: 'SEC — DS N°66. Obligatorio instalador habilitado. Certificado emitido al cliente.',

    opcionesPersonalizacion: [

      // CAPACIDAD
      {
        categoria: '1 — Capacidad del equipo (litros/minuto)',
        nota: 'Regla práctica: 10L = 1 ducha simultánea | 13L = 2 duchas | 16L = 3 duchas o bañera.',
        opciones: [
          {
            id: 'cal_cap_0', nombre: 'Solo mano de obra — yo aporto el equipo',
            extraMO_uf: 0, extraMat_uf: 0,
            nota: 'Precio MO incluye kit de instalación (flexibles, teflón, llaves).',
          },
          { id: 'cal_cap_10', nombre: 'Equipo 10L/min (1 servicio)',  extraMO_uf: 0, extraMat_uf: 0,  nota: 'Ver marcas en siguiente opción.' },
          { id: 'cal_cap_13', nombre: 'Equipo 13-14L/min (2 servicios)', extraMO_uf: 0, extraMat_uf: 3.00, nota: 'Más caudal = mayor costo equipo.' },
          { id: 'cal_cap_16', nombre: 'Equipo 16L/min (3 servicios)',  extraMO_uf: 0, extraMat_uf: 6.00 },
        ],
      },

      // MARCA / TIER — TIRO NATURAL
      {
        categoria: '2 — Marca del Equipo (Tiro Natural)',
        nota: 'Tiro Natural usa ventilación atmosférica. Requiere ducto existente en buenas condiciones.',
        opciones: [
          {
            id: 'cal_tn_eco',
            nombre: 'Económica — Midas Classic / Splendid / Trotter (10-13L)',
            tier: 'economico',
            marcas: ['Midas', 'Splendid', 'Trotter'],
            modelos: ['Midas Classic TN10', 'Splendid GN-10 / GN-13', 'Trotter Select 10'],
            extraMO_uf: 0, extraMat_uf: 0,
            specs: { Encendido: 'Piezoeléctrico manual', Modulación: 'No', Garantía: '1 año', Origen: 'Brasil / China' },
          },
          {
            id: 'cal_tn_std',
            nombre: 'Estándar — Rheem RTE o Junkers WR (13-14L)',
            tier: 'estandar',
            marcas: ['Rheem', 'Junkers (Bosch Group)'],
            modelos: ['Rheem RTE-13 14L', 'Junkers WR13-2KME', 'Rinnai RUS-13 Eco'],
            extraMO_uf: 0, extraMat_uf: 3.00,
            specs: { Encendido: 'Electrónico automático', Modulación: 'Llama modulante', Garantía: '2 años', Origen: 'EE.UU. / Alemania / Japón' },
          },
          {
            id: 'cal_tn_prem',
            nombre: 'Premium — Bosch Therm 4600 / Vaillant atmoTEC (14-16L)',
            tier: 'premium',
            marcas: ['Bosch Thermotechnology', 'Vaillant', 'Rinnai'],
            modelos: ['Bosch WTD 15AM E', 'Vaillant atmoTEC plus VUW', 'Rinnai REU-VC2327W'],
            extraMO_uf: 0, extraMat_uf: 6.50,
            specs: { Encendido: 'Electrónico + modulación digital', Display: 'LCD temperatura', Ahorro: '30% vs. modular sin display', Garantía: '3 años' },
          },
        ],
      },

      // TIRO FORZADO
      {
        categoria: '3 — Opción: Tiro Forzado (Sin ducto existente)',
        nota: 'Tiro Forzado instala su propio ducto concéntrico (doble tubo) por un muro exterior. No necesita ducto. Requiere enchufe 220V cercano.',
        opciones: [
          { id: 'cal_tf_no', nombre: 'No aplica — equipo de tiro natural', extraMO_uf: 0, extraMat_uf: 0 },
          {
            id: 'cal_tf_std',
            nombre: 'Tiro Forzado Estándar — Rheem Chamber / Junkers WR-G',
            tier: 'estandar',
            marcas: ['Rheem', 'Junkers'],
            modelos: ['Rheem Chamber TF 11L', 'Junkers WR11-2G41 ME'],
            extraMO_uf: 1.00, extraMat_uf: 6.50,
            nota: 'Incluye ducto concéntrico coaxial Ø60/100mm + perforación de muro.',
            specs: { Ventilador: 'Interno integrado', Ducto: 'Coaxial 60/100mm', Longitud_max: '4m', Enchufe: '220V requerido' },
          },
          {
            id: 'cal_tf_prem',
            nombre: 'Tiro Forzado Premium — Bosch Therm 4600 F / Rinnai REP',
            tier: 'premium',
            marcas: ['Bosch Thermotechnology', 'Rinnai'],
            modelos: ['Bosch WTD 13AM G23', 'Rinnai REP-E132CP'],
            extraMO_uf: 1.00, extraMat_uf: 11.00,
            specs: { Caudal: '13L/min', Modulación: 'Digital 6 potencias', Pantalla: 'LED temperatura', Garantía: '3 años' },
          },
        ],
      },
    ],
  },

  // ── 2.2 CALDERA MIXTA ────────────────────────────────────────────────────
  {
    id: 'gas_caldera_mixta',
    nombre: 'Instalación Caldera Mural Mixta (Sanitaria + Calefacción)',
    desc: `Equipo central que entrega agua caliente sanitaria (duchas) Y alimenta el 
circuito de radiadores o piso radiante. Valor base incluye: montaje mural con soporte 
antivibratorio, conexiones hidráulicas en cobre (ida/retorno calefacción + agua sanitaria), 
conexión gas con válvula de seguridad, vaso de expansión, purgadores de aire, desagüe 
de seguridad, y ajuste de presión de red (1 a 1.5 bar de trabajo). El equipo se elige abajo.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(9.50),   // MO + kit de instalación
    precioMat_clp: ufToClp(5.00),   // Kit: válvulas, cobre, vaso expansión, purgadores
    normativa: 'SEC DS66 + NCh 2048 instalación calefacción',

    variantes: [
      mkVar('cal_v1', 'economico',
        'Navien NCB-210 24kW — Caldera a gas estándar',
        'Navien (Corea del Sur)', 'NCB-210/24',
        28.00,
        { Potencia: '24 kW', Eficiencia: '86%', Caudal_sanitario: '12.3 L/min', Display: 'LED básico', Garantía: '3 años intercambiador' },
        { disponibilidad: 'Distribuidores Navien Chile', nota: 'La más instalada en Chile. Recambios disponibles en todo el país.' }
      ),
      mkVar('cal_v2', 'estandar',
        'Rinnai REU / Baxi Luna 3 Comfort 24kW',
        'Rinnai (Japón) / Baxi (Italia)', 'Rinnai REU-VC2437W / Baxi Luna 3 Comfort 1.24',
        34.00,
        { Potencia: '24 kW', Eficiencia: '90%', Caudal_sanitario: '14 L/min', Display: 'LCD + autodiagnóstico', Garantía: '3 años' },
        { disponibilidad: 'Sodimac, distribuidores especializados' }
      ),
      mkVar('cal_v3', 'premium',
        'Bosch Condens 7000W 24kW — Condensación (alta eficiencia)',
        'Bosch Thermotechnology (Alemania)', 'Condens 7000W ZBR24-3A',
        50.00,
        { Potencia: '24 kW', Eficiencia: '109% (condensación)', Ahorro: '25-35% gas vs. convencional', Display: 'Control digital 7-día', Emisiones: 'NOx Clase 6 (mínimas)', Garantía: '5 años' },
        { nota: 'La caldera de condensación recupera el calor de los gases de evacuación. El mayor ahorro de gas del mercado.', normativa: 'Cumple ErP 2021 Europa — máxima certificación energética.' }
      ),
    ],

    opcionesPersonalizacion: [
      {
        categoria: 'Termostato / Control',
        opciones: [
          { id: 'cal_term_1', nombre: 'Termostato Análogo Básico (Incluido)', extraMO_uf: 0, extraMat_uf: 0 },
          {
            id: 'cal_term_2',
            nombre: 'Termostato WiFi Netatmo / Heatmiser — Programable por App',
            marca: 'Netatmo (Francia) / Heatmiser (UK)',
            modelos: ['Netatmo NTH01-EN-EU', 'Heatmiser neoStat-e'],
            extraMO_uf: 0.60, extraMat_uf: 3.80,
            specs: { Control: 'App iOS/Android', Programación: '7 días × 6 horarios', Ahorro_adicional: '37% energía según Netatmo' },
          },
        ],
      },
    ],
  },

  // ── 2.3 TERMO ELÉCTRICO ──────────────────────────────────────────────────
  {
    id: 'gas_termo_electrico',
    nombre: 'Instalación Termo Eléctrico 80L-150L',
    desc: `Fijación mural con pernos de expansión Fischer de alta carga (el equipo lleno pesa 
~100-180kg), conexión hidráulica con válvula de seguridad y retención, revisión del ánodo 
de magnesio (protege el interior del óxido), ajuste de temperatura a 65°C (destruye la 
bacteria Legionella). Incluye bandeja de evacuación y desagüe de seguridad.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(1.00), // Kit instalación (pernos, flexibles, válvula)

    variantes: [
      mkVar('term_v1', 'economico',
        'Cointra CE-80 — 80L eléctrico básico',
        'Cointra (España)', 'CE-80',
        5.50,
        { Capacidad: '80L', Potencia: '1500W', Tiempo_calentamiento: '~135 min', Aislación: '35mm PU', Garantía: '2 años', Diámetro: '45cm', Alto: '110cm' },
        { disponibilidad: 'Sodimac, Easy', nota: 'Suficiente para 2-3 personas. La opción más económica del mercado.' }
      ),
      mkVar('term_v2', 'estandar',
        'Ariston Andris Pro1 80L — Calentamiento rápido',
        'Ariston (Italia)', 'Andris Pro1 80H',
        7.50,
        { Capacidad: '80L', Potencia: '2500W', Tiempo_calentamiento: '~80 min (30% más rápido)', Ánodo: 'Magnesio desmontable', Garantía: '3 años', Control: 'Digital con timer' },
        { disponibilidad: 'Sodimac, distribuidores Ariston' }
      ),
      mkVar('term_v3', 'premium',
        'Bosch Tronic 3000T 120L — Mayor capacidad',
        'Bosch (Alemania)', 'TR3500T 120B',
        11.00,
        { Capacidad: '120L', Potencia: '2000W', Aislación: '45mm (pérdidas mínimas)', Garantía: '3 años', Ánodo: 'Doble ánodo mg', Perfecto_para: '4-5 personas' },
        { nota: '120L es el punto ideal para familias de 4-5 personas sin calefont.' }
      ),
      mkVar('term_v4', 'lujo',
        'Ariston NUOS Primo 200L — Bomba de calor (Ahorro 70% electricidad)',
        'Ariston (Italia)', 'NUOS Primo 200',
        55.00,
        { Capacidad: '200L', Tecnología: 'Heat pump (bomba de calor)', COP: '3.4 (produce 3.4 kWh por cada 1 consumido)', Ahorro: '70% vs. eléctrico convencional', Garantía: '5 años' },
        { nota: 'La bomba de calor extrae calor del aire ambiente para calentar el agua. Consume 5 veces menos que un termo eléctrico. ROI en 3-4 años.', normativa: 'Elegible subsidio MINVU eficiencia energética' }
      ),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 3: ARTEFACTOS SANITARIOS Y GRIFERÍA INDIVIDUAL
// ════════════════════════════════════════════════════════════════════════════

const artefactosItems = [

  // ── 3.1 WC INDIVIDUAL ───────────────────────────────────────────────────
  {
    id: 'gas_wc_cambio',
    nombre: 'Cambio W.C. (Retiro + Instalación)',
    desc: `Retiro del inodoro antiguo y limpieza de la base. Instalación mediante pernos de 
anclaje de bronce (no acero que se oxida). Sello antifuga elegible: anillo de cera Fluidmaster 
(tradicional, se amolda al calor) o sello elastomérico PVC (más limpio, sin olor). 
Regulación de mecánica interior (flotador, válvula de entrada, cadena de descarga). 
Sellado perimetral con silicona fungicida blanca o gris. Prueba de descarga completa.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(2.80),
    precioMat_clp: ufToClp(0.50), // Kit: sello, pernos, silicona

    variantes: [
      mkVar('wc_v1', 'economico',
        'Fanaloza Integral 2 Piezas — Descarga Dual 3/6L',
        'Fanaloza (Chile)', 'Integral FPC600',
        2.10,
        { Tipo: '2 piezas (taza + estanque separado)', Descarga: 'Dual 3L / 6L', Material: 'Cerámica blanca vitrificada', Dimensiones: '35×66cm', Garantía: '1 año' },
        { disponibilidad: 'Sodimac, Easy, Chilemat' }
      ),
      mkVar('wc_v2', 'estandar',
        'Corona Savona Duo Flush — One Piece 3/6L',
        'Corona (EE.UU.)', 'Savona 21ER',
        3.30,
        { Tipo: 'One Piece compacto', Descarga: 'Dual 3L / 6L', Material: 'Vitreous China extra brillo', Dimensiones: '37×67cm', Tapa: 'Polipropileno amortiguada', Garantía: '5 años estructura cerámica' },
        { disponibilidad: 'Sodimac, Easy', nota: 'La más vendida en Chile. Excelente balance calidad-precio-durabilidad.' }
      ),
      mkVar('wc_v3', 'premium',
        'Roca The Gap Square One Piece — Diseño Europeo Cuadrado',
        'Roca (España)', 'The Gap Square A34H04C000',
        6.50,
        { Tipo: 'One Piece cuadrado moderno', Descarga: 'Dual 2.5L / 4.5L (agua mínima)', Material: 'Porcelana sanitaria extra pesada', Tapa: 'Termoplástico amortiguada', Garantía: '5 años Roca Chile' },
        { disponibilidad: 'Roca dealers, Sodimac premium' }
      ),
      mkVar('wc_v4', 'lujo',
        'Kohler Cimarron Comfort Height ADA — Taza Elongada Premium',
        'Kohler (EE.UU.)', 'Cimarron K-3609-0',
        10.00,
        { Tipo: 'One Piece elongado comfort height (45cm)', Tecnología: 'Class 5 flushing (sin atasco)', Descarga: '4.8L ultra bajo consumo', Material: 'Vitreous China triple cocido', Garantía: '10 años estructura' },
        { nota: 'Comfort Height = altura de silla (45cm). Recomendado adultos mayores y personas con movilidad reducida.' }
      ),
    ],
  },

  // ── 3.2 BIDET ───────────────────────────────────────────────────────────
  {
    id: 'gas_bidet',
    nombre: 'Instalación de Bidet Independiente',
    desc: 'Montaje de artefacto bidet con grifería monocomando mezcladora, desagüe con rebalse y sifón de botella. Requiere puntos de agua fría/caliente y alcantarillado existentes junto al WC.',
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: ufToClp(0.80),

    variantes: [
      mkVar('bid_v1', 'estandar',
        'FV Alegra Bidet + Grifería Monocomando FV',
        'FV (Brasil/Argentina)', 'Alegra + FV Stretto Bidet',
        4.20,
        { Dimensiones: '38×60cm', Grifería: 'Monocomando cartucho cerámico', Desagüe: 'Con rebalse 1 1/4"', Garantía: '2 años' },
        { disponibilidad: 'Sodimac, Easy' }
      ),
      mkVar('bid_v2', 'premium',
        'Roca The Gap + Grifería Roca Atlas',
        'Roca (España)', 'The Gap A357477000 + Atlas A5A0054C00',
        7.50,
        { Diseño: 'Cuadrado europeo', Dimensiones: '37×56cm', Grifería: 'Roca Atlas monocomando', Acabado: 'Cromo brillo', Garantía: '5 años Roca' },
        { disponibilidad: 'Roca dealers, Sodimac premium' }
      ),
      mkVar('bid_v3', 'lujo',
        'TOTO Washlet C5 — Bidet Electrónico (Asiento Inteligente)',
        'TOTO (Japón)', 'Washlet C5 SW3056AT',
        28.00,
        { Tecnología: 'Asiento bidet electrónico', Funciones: 'Agua caliente, secado aire, asiento calefaccionado, luz nocturna', Control: 'Control remoto o App', Agua: 'Solo requiere enchufe 220V junto al WC', Nota: 'No requiere grifo de bidet separado' },
        { nota: 'Se instala SOBRE el WC existente. No requiere obra civil, solo enchufe 220V.' }
      ),
    ],
  },

  // ── 3.3 LAVAMANOS INDIVIDUAL ─────────────────────────────────────────────
  {
    id: 'gas_lavamanos',
    nombre: 'Cambio Lavamanos + Grifería (Completo)',
    desc: `Retiro del lavamanos antiguo y limpieza de muros. Instalación del nuevo: 
fijación con pernos expansivos al muro, armado del pedestal, instalación del desagüe 
con rebalse (el orificio lateral que impide desbordarse), colocación de grifería 
monocomando con cartucho cerámico de 35mm (larga vida, sin goteo), conexión con 
flexibles trenzados de acero inoxidable.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(2.20),
    precioMat_clp: ufToClp(0.60), // Kit: sifón, flexibles, silicona

    variantes: [
      mkVar('lm_v1', 'economico',
        'Fanaloza Básico 50cm Pedestal + Grifería Grival Kuba',
        'Fanaloza (Chile) + Grival (Chile)', 'F25 Pedestal + Kuba Monocomando',
        2.50,
        { Ancho: '50cm', Grifería: 'Cartucho cerámico 35mm', Desagüe: 'Con rebalse Ø32', Garantía: '1 año' },
        { disponibilidad: 'Sodimac, Easy, Chilemat' }
      ),
      mkVar('lm_v2', 'estandar',
        'FV Modelle 55cm Pedestal + Grifería FV Siena',
        'FV (Brasil/Argentina)', 'Modelle 55 + Siena Monocomando',
        4.20,
        { Ancho: '55cm', Material: 'Porcelana sanitaria', Grifería: 'Cartucho cerámico 40mm alto flujo', Estilo: 'Contemporáneo', Garantía: '2 años' },
        { disponibilidad: 'Sodimac, Easy' }
      ),
      mkVar('lm_v3', 'premium',
        'Roca Inspira Round 55cm + Grifería Roca Insignia',
        'Roca (España)', 'Inspira A327520000 + Insignia A5A3A8C00',
        7.80,
        { Ancho: '55cm', Diseño: 'Curvo contemporáneo premium', Grifería: 'Cartucho SilentClose 40mm', Acabado: 'Cromo brillo o mate a elegir', Garantía: '5 años Roca Chile' },
        { disponibilidad: 'Roca dealers, Sodimac premium' }
      ),
      mkVar('lm_v4', 'lujo',
        'Duravit D-Neo 60cm Sobre Encimera + Grifería Grohe Essence',
        'Duravit (Alemania) + Grohe (Alemania)', 'D-Neo 0458600000 + Grohe Essence 23591001',
        15.50,
        { Tipo: 'Sobre encimera redondo', Ancho: '60cm', Grifería: 'Grohe SilkMove cartucho cerámico', Acabado: 'Alpine White ultra brillo', Garantía: 'Duravit 5 años / Grohe 5 años' },
        { nota: 'Requiere mueble o encimera de apoyo. La grifería Grohe Essence tiene el acabado más limpio del mercado.' }
      ),
    ],
  },

  // ── 3.4 GRIFERÍA LAVAMANOS / DUCHA ───────────────────────────────────────
  {
    id: 'gas_griferia_cartucho',
    nombre: 'Cambio Grifería Lavamanos o Ducha (Disco Cerámico)',
    desc: `Retiro de la llave antigua y limpieza del asiento. Instalación de grifería nueva 
con cartucho de discos cerámicos de alúmina (los discos se deslizan con fricción mínima 
para mezclar agua, sin gomas que desgastar, garantizando cero goteo por décadas). 
Incluye flexibles trenzados de acero inox 40cm.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(1.20),
    precioMat_clp: ufToClp(0.30), // Flexibles, teflón

    variantes: [
      mkVar('gri_v1', 'economico',
        'FV Stretto Monocomando — El más vendido en Chile',
        'FV (Brasil/Argentina)', 'Stretto 1/2" Monocomando',
        1.30,
        { Cartucho: 'Cerámico 35mm', Cuerpo: 'Zamak cromo', Hilo: '1/2"', Garantía: '2 años', Nota: 'Repuestos disponibles en toda ferretería' }
      ),
      mkVar('gri_v2', 'estandar',
        'Grival Quartz Monocomando Chrome — Diseño Moderno',
        'Grival (Chile/Brasil)', 'Quartz Monoc. GR890',
        2.20,
        { Cartucho: 'Cerámico 40mm (mayor flujo)', Cuerpo: 'Latón cromo pulido', Diseño: 'Cuadrado contemporáneo', Garantía: '3 años' }
      ),
      mkVar('gri_v3', 'premium',
        'Roca Monodin Chrome — Línea Profesional',
        'Roca (España)', 'Monodin A5A3035C00',
        4.50,
        { Cartucho: 'Roca Eco-cartridge 35mm (ahorro agua 30%)', Cuerpo: 'Latón pesado cromo espejo', Garantía: '5 años Roca Chile' }
      ),
      mkVar('gri_v4', 'lujo',
        'Grohe BauEdge — Línea Profesional Alemana',
        'Grohe (Alemania)', 'BauEdge 23327001',
        8.50,
        { Cartucho: 'Grohe SilkMove® 46mm (ultra suave)', Cuerpo: 'Latón StarLight® (resistente a arañazos)', Aerador: 'Grohe EcoJoy 5.7L/min', Garantía: '5 años Grohe International' }
      ),
      mkVar('gri_v5', 'lujo',
        'Hansgrohe Logis 100 — Certificación WaterSense',
        'Hansgrohe (Alemania)', 'Logis 100 71100000',
        11.00,
        { Cartucho: 'Cerámico 35mm Hansgrohe', Certificación: 'WaterSense (máxima eficiencia hídrica)', EcoRight: '4.5L/min (60% ahorro)', Acabado: 'Cromo brillante', Garantía: '5 años' }
      ),
    ],
  },

  // ── 3.5 LLAVE DE JARDÍN ─────────────────────────────────────────────────
  {
    id: 'gas_llave_jardin',
    nombre: 'Instalación Llave de Jardín / Exterior',
    desc: 'Extensión de cañería PPR o cobre desde la red interior hacia patio o antejardín. Llave con rosca de salida 1/2" o 3/4" para manguera. Fijación mural y protección UV.',
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(0.50),

    variantes: [
      mkVar('jar_v1', 'economico',
        'Llave Macho-Hembra Cobre Niquelado 1/2" — Básica',
        'Niwa (Chile)', 'Llave HE 1/2"',
        0.80,
        { Material: 'Cobre niquelado', Rosca: 'Macho 1/2" + hembra manguera', Resistencia_UV: 'Media' }
      ),
      mkVar('jar_v2', 'estandar',
        'Llave de Jardín Forjada 3/4" con Codo y Soporte Mural',
        'Taumm (Chile)', 'Jardín 3/4" Con soporte',
        1.40,
        { Material: 'Bronce macizo forjado', Rosca: '3/4" mayor caudal para mangueras largas', Soporte: 'Mural incluido', Resistencia: 'Antihielo -15°C' }
      ),
      mkVar('jar_v3', 'premium',
        'Grifo Anti-retorno con Llave de Corte Interior — Anticontaminación',
        'Watts / Honeywell', 'Grifo de jardín anti-sifón',
        2.50,
        { Tipo: 'Anti-sifón (anti-retorno)', Función: 'Evita contaminación de la red de agua potable si la manguera queda sumergida', Normativa: 'Recomendado por NCh 2485', Material: 'Bronce pesado' },
        { nota: 'El anti-sifón es obligatorio según norma donde hay piscinas o jardines con riego químico.' }
      ),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 4: REDES DE AGUA, BOMBEO Y TRATAMIENTO
// ════════════════════════════════════════════════════════════════════════════

const redesItems = [

  // ── 4.1 TUBERÍA PPR ─────────────────────────────────────────────────────
  {
    id: 'gas_tuberia_fria_ppr',
    nombre: 'Red de Agua Fría PPR PN20 (Termofusión)',
    desc: `Por metro lineal instalado. El PPR (Polipropileno Random) se une mediante 
termofusión a 260°C: una máquina calienta el tubo y el accesorio hasta que el plástico 
se funde y forma una pieza única sin pegamentos. Resultado: hermético de por vida. 
Incluye codos, tees, manguitos y fijaciones con collares cada 1m.`,
    unidad: 'ml',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(0.60),
    precioMat_clp: ufToClp(0.20),

    variantes: [
      mkVar('ppr_v1', 'estandar',
        'Tupac PPR PN20 Ø20mm (3/4") — Agua fría distribución',
        'Tupac (Chile)', 'PPR PN20 20mm',
        0.18, { Diámetro: '20mm (3/4")', PN: 'PN20', Temp_max: '60°C', Unión: 'Termofusión', Fabricante: 'Nacional' }
      ),
      mkVar('ppr_v2', 'estandar',
        'Tigre PPR PN20 Ø25mm (1") — Troncal principal',
        'Tigre (Brasil)', 'PPR PN20 25mm',
        0.28, { Diámetro: '25mm (1")', Uso: 'Troncal principal y subidas por piso', PN: 'PN20', Garantía: '50 años según fabricante' }
      ),
      mkVar('ppr_v3', 'premium',
        'Rehau RAUTITAN PEX-a Ø16mm — Agua caliente (Crimpeado)',
        'Rehau (Alemania)', 'RAUTITAN PEX-a 16mm',
        0.40,
        { Diámetro: '16mm', Material: 'PEX-a cross-linked', Unión: 'Crimpeado anillos inox (expande-contrae sin fugas)', Temp_max: '95°C', Flexible: 'Dobla a mano sin romper', Uso: 'Agua caliente sin riesgo de escaldaduras' },
        { nota: 'El PEX es el estándar europeo para agua caliente por su resistencia a temperaturas y a los golpes de ariete.' }
      ),
    ],
  },

  // ── 4.2 TUBERÍA COBRE ───────────────────────────────────────────────────
  {
    id: 'gas_tuberia_cobre',
    nombre: 'Reparación o Modificación Tubería de Cobre',
    desc: `Por metro lineal. Corte de la matriz afectada, esmerilado y limpieza de la 
zona de soldadura, aplicación de pasta fundente (flux), calentamiento con soplete a 600°C 
y soldadura con varilla de plata al 5% (soldadura fuerte, distinta de la blanda de estaño). 
La soldadura de plata tiene resistencia mecánica de 200 MPa y resiste hasta 700°C.`,
    unidad: 'ml',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(0.90),
    precioMat_clp: ufToClp(0.40),

    variantes: [
      mkVar('cob_v1', 'estandar',
        'Cobre Madeco tipo L 1/2" (15mm) — Estándar residencial',
        'Madeco (Chile)', 'Tipo L 15mm',
        0.38,
        { Diámetro: '15mm (1/2")', Tipo: 'L (pared media)', Uso: 'Agua y gas domiciliario', Espesor_pared: '1.02mm', Garantía_material: '50 años' }
      ),
      mkVar('cob_v2', 'estandar',
        'Cobre Madeco tipo L 3/4" (22mm) — Alimentación principal',
        'Madeco (Chile)', 'Tipo L 22mm',
        0.58,
        { Diámetro: '22mm (3/4")', Uso: 'Troncal / alimentación principal', Espesor_pared: '1.14mm' }
      ),
      mkVar('cob_v3', 'premium',
        'Cobre Nibco tipo K 1/2" — Gas y agua caliente alta presión',
        'Nibco (EE.UU.)', 'Tipo K 15mm',
        0.55,
        { Diámetro: '15mm', Tipo: 'K (pared gruesa 1.24mm)', Uso: 'Gas + agua caliente alta presión', Certificación: 'ASTM B88 Type K' },
        { nota: 'El tipo K es obligatorio para instalaciones de gas y sistemas con presión superior a 8 bar.' }
      ),
    ],
  },

  // ── 4.3 VÁLVULAS DE PASO ─────────────────────────────────────────────────
  {
    id: 'gas_llave_paso',
    nombre: 'Cambio Llave de Paso / Válvula de Bola',
    desc: `Corte del suministro general, extracción de la llave de compuerta antigua 
(que con el tiempo se calcifica y no cierra bien) e instalación de válvula de bola de 
bronce macizo. La válvula de bola tiene una esfera perforada en su interior: un giro de 
1/4 de vuelta corta el flujo al 100%. No se traba, no gotea.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(1.50),
    precioMat_clp: ufToClp(0.30),

    variantes: [
      mkVar('val_v1', 'estandar',
        'Válvula Bola Bronce Niwa 1/2" — La más usada en Chile',
        'Niwa (Chile)', 'VB-12 1/2"',
        0.58,
        { Cuerpo: 'Bronce macizo fundido', Esfera: 'Bronce cromado', Temperatura: '-20°C a 120°C', Presión: 'PN16 (16 bar)', Rosca: 'BSP 1/2"' }
      ),
      mkVar('val_v2', 'estandar',
        'Válvula Bola Bronce Taumm 3/4" — Mayor caudal',
        'Taumm (Chile)', 'VB-34 3/4"',
        0.85,
        { Cuerpo: 'Bronce pesado', Rosca: 'BSP 3/4"', Uso: 'Troncal principal / calefacción' }
      ),
      mkVar('val_v3', 'premium',
        'Válvula Bola Bugatti / Nibco Full Port 1" — Pérdida presión mínima',
        'Nibco (EE.UU.) / Bugatti (Italia)', 'T-585-70 1"',
        2.20,
        { Tipo: 'Full port (orificio completo = sin pérdida de carga)', Rosca: 'BSP 1"', Manija: 'Acero inox extraíble', Certificación: 'NSF 61 (agua potable)', Temperatura: '-20°C a 180°C' },
        { nota: 'Full port es esencial en la válvula general de la casa: no reduce la presión de toda la instalación.' }
      ),
    ],
  },

  // ── 4.4 SISTEMA PRESURIZADOR ─────────────────────────────────────────────
  {
    id: 'gas_hidropack',
    nombre: 'Instalación Sistema Presurizador de Agua (Hidropack)',
    desc: `Solución cuando la presión de agua es insuficiente para calefont, ducha de presión 
o segundo piso. Sistema completo: bomba periférica o centrífuga + tanque hidroneumático 
de membrana (evita que la bomba arranque con cada micro-apertura de grifo) + presostato 
(sensor que enciende la bomba automáticamente al bajar la presión a 1.5 bar y la apaga 
a 3 bar). Incluye by-pass manual para mantenimiento sin cortar el agua.`,
    unidad: 'ud',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(4.50),
    precioMat_clp: ufToClp(1.50), // By-pass, adaptadores, cañería conexión

    variantes: [
      mkVar('hid_v1', 'economico',
        'Leo XKm 60-H 0.5HP + Tanque 24L — Hasta 4 salidas',
        'Leo (China/internacional)', 'XKm 60-H + Tanque 24L',
        5.80,
        { Potencia: '0.5HP (370W)', Caudal_max: '40L/min', Presión_max: '3.5 bar', Tanque: '24L membrana', Tensión: '220V', Garantía: '1 año' },
        { nota: 'La solución más económica. Funciona bien para casas de 1-2 baños con baja demanda.' }
      ),
      mkVar('hid_v2', 'estandar',
        'Pedrollo PKm 60-MD 0.75HP + Tanque 24L — Silenciosa',
        'Pedrollo (Italia)', 'PKm 60 MD + Tanque 24L',
        7.50,
        { Potencia: '0.75HP (550W)', Caudal_max: '60L/min', Presión_max: '4.0 bar', Vibración: 'Baja (motor italiano)', Garantía: '2 años' }
      ),
      mkVar('hid_v3', 'premium',
        'Grundfos SCALA1 — Sistema Automático Inteligente (Sin tanque)',
        'Grundfos (Dinamarca)', 'SCALA1 3-45 PA',
        17.50,
        { Potencia: '0.75HP', Caudal_max: '65L/min', Presión: 'Constante automática (no fluctúa)', Ruido: '47 dB(A)', Tanque: 'No requiere (incorporado 2L)', Control: 'Electrónico dry-run protection', Garantía: '3 años Grundfos' },
        { nota: 'SCALA1 detecta automáticamente cuántas llaves están abiertas y ajusta la presión constantemente. El resultado: presión idéntica con 1 o con 4 llaves abiertas al mismo tiempo.' }
      ),
    ],
  },

  // ── 4.5 ABLANDADOR DE AGUA ──────────────────────────────────────────────
  {
    id: 'gas_ablandador_agua',
    nombre: 'Instalación Ablandador de Agua (Anti-Sarro)',
    desc: `Equipo de resina de intercambio iónico instalado en la entrada general de agua. 
Captura los iones de calcio y magnesio (causantes del sarro) y los intercambia por sodio. 
Resultado: agua blanda que no deposita incrustaciones en calefonts, griferías, lavadoras 
ni duchas de vidrio. La resina se regenera automáticamente con sal común según un timer.`,
    unidad: 'ud',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(3.50),
    precioMat_clp: ufToClp(1.50), // By-pass, conexiones, salero inicial

    variantes: [
      mkVar('abl_v1', 'estandar',
        'Vigaflow 15L resina — Hasta 2 baños / 4 personas',
        'Vigaflow (Chile)', 'VF-15L Manual',
        22.00,
        { Capacidad_resina: '15 litros', Para: '1-4 personas / 1-2 baños', Regeneración: 'Manual (el cliente echa sal)', Consumo_sal: '3-4 kg/mes', Dureza_salida: '<1 ppm (agua suave)' }
      ),
      mkVar('abl_v2', 'premium',
        'Eura 25L resina Automático — Hasta 5 personas, regeneración nocturna',
        'Eura (Europa)', 'Eura AQX-25',
        38.00,
        { Capacidad_resina: '25 litros', Para: '3-6 personas', Regeneración: 'Automática nocturna por timer (bajo consumo)', Control: 'Digital programable', Certificación: 'NSF 44 (agua potable)' }
      ),
      mkVar('abl_v3', 'lujo',
        'Kinetico 2060 OD — Doble Tanque, 100% Mecánico (Sin electricidad)',
        'Kinetico (EE.UU.)', 'Kinetico 2060 OD',
        85.00,
        { Tecnología: 'Doble tanque mecánico (uno regenerando, otro activo = agua suave 24/7)', Sin_electricidad: 'Funciona solo con la energía del flujo de agua', Regeneración: 'Automática por demanda (no por timer)', Garantía: '10 años equipos Kinetico' },
        { nota: 'La tecnología más avanzada del mercado. Sin electricidad, sin sal residual en el agua de consumo. ROI en 5-7 años por protección de equipos.' }
      ),
    ],
  },

  // ── 4.6 RIEGO AUTOMÁTICO ─────────────────────────────────────────────────
  {
    id: 'gas_riego_automatico',
    nombre: 'Red de Riego Automático por Zona',
    desc: `Por zona/circuito. Sistema completo: programador electrónico, electroválvula 
(grifo automático eléctrico que abre/cierra por señal), tubería HDPE Ø25mm en zanja 
de 30cm, aspersores emergentes (pop-up, suben al activarse y bajan al terminar) o difusores 
de abanico para céspedes. El programador puede configurarse desde 1 a 4 riegos diarios 
por zona, con duración independiente.`,
    unidad: 'zona',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(3.50),
    precioMat_clp: ufToClp(4.80),

    variantes: [
      mkVar('rie_v1', 'estandar',
        'Rain Bird 1804 difusores + Válvula PGA — Zona jardín 40m²',
        'Rain Bird (EE.UU.)', '1804 + PGA-U + ESP-Me',
        5.20,
        { Aspersor: 'Rain Bird 1804 pop-up 10cm', Radio_cobertura: '1.2-4.8m (ajustable)', Electroválvula: 'PGA-U 3/4" (Rain Bird)', Programador: 'ESP-Me compatible WiFi' }
      ),
      mkVar('rie_v2', 'premium',
        'Hunter MP Rotator + Válvula PGV + Controlador WiFi Hydrawise',
        'Hunter Industries (EE.UU.)', 'MP Rotator + PGV + HC-600i Hydrawise',
        7.80,
        { Aspersor: 'Hunter MP Rotator (rotación lenta = absorción 100%)', Ahorro_agua: '30% vs. aspersor estándar (no encharca)', Electroválvula: 'PGV 3/4"', Controlador: 'Hydrawise WiFi 6 zonas + sensor lluvia', Control_remoto: 'App iOS/Android + pronóstico meteorológico' },
        { nota: 'El MP Rotator aplica el agua lentamente, evitando el escurrimiento. Ideal para suelos de Santiago que se encharcan con aspersor rápido.' }
      ),
      mkVar('rie_v3', 'premium',
        'Netafim Gotero + Orbit B-hyve — Sistema por Goteo (Máximo ahorro)',
        'Netafim (Israel) + Orbit', 'Netafim Techline + B-hyve Pro 8 zonas',
        8.50,
        { Sistema: 'Riego por goteo (agua directo a la raíz)', Ahorro_agua: '50-70% vs. aspersor', Gotero: 'Netafim autocompensante 2L/h', Controlador: 'Orbit B-hyve Pro 8 zonas WiFi', Ideal_para: 'Arbustos, huerto, jardín vertical' }
      ),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 5: REDES DE GAS Y NICHO BALONES
// ════════════════════════════════════════════════════════════════════════════

const gasItems = [
  {
    id: 'gas_tuberia_pex_al_pex',
    nombre: 'Cañería Red de Gas PEX-AL-PEX (por ml)',
    desc: `Tubería aprobada SEC para gas licuado (LPG) y gas natural. 
La capa de aluminio intermedia evita la permeación de gas y le da rigidez. 
Las uniones son prensadas (no soldadas), más seguras para el instalador. 
Color amarillo normalizado para identificación inmediata.`,
    unidad: 'ml',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp:  ufToClp(0.80),
    precioMat_clp: ufToClp(0.40),
    normativa: 'DS N°66 — SEC. Solo PEX-AL-PEX color amarillo habilitado para gas.',

    variantes: [
      mkVar('gse_v1', 'estandar',
        'Tigre PEX-AL-PEX Amarillo Ø16mm — Ramales individuales',
        'Tigre (Brasil)', 'Gas PEX-AL-PEX 16mm',
        0.38, { Diámetro: '16mm', Color: 'Amarillo gas', Presión: 'PN25', Certificación: 'SEC Chile' }
      ),
      mkVar('gse_v2', 'estandar',
        'Tigre PEX-AL-PEX Amarillo Ø20mm — Troncal principal',
        'Tigre (Brasil)', 'Gas PEX-AL-PEX 20mm',
        0.52, { Diámetro: '20mm', Uso: 'Troncal desde medidor a primeras derivaciones' }
      ),
      mkVar('gse_v3', 'premium',
        'Uponor PEX Amarillo Ø20mm — Alto rendimiento',
        'Uponor (Finlandia)', 'Uponor Gas PEX 20mm',
        0.75,
        { Diámetro: '20mm', Tecnología: 'PEX-a (cross-link máximo, más flexible)', Certificación: 'DVGW + SEC Chile', Memoria_forma: 'Vuelve a posición original si se aplana' }
      ),
    ],
  },

  {
    id: 'gas_nicho_balones',
    nombre: 'Construcción Nicho para Balones de Gas 45kg',
    desc: `Construcción de caseta exterior normativa SEC para balones de gas licuado. 
Incluye: base de hormigón, estructura incombustible (albañilería o fibrocemento), 
puertas con ventilación superior e inferior (ventilación natural cruzada que evacua 
el gas en caso de fuga, ya que el gas LPG es más pesado que el aire), manifold de 
conexión con válvula inversora automática (cambia al segundo balón automáticamente 
cuando el primero se vacía).`,
    unidad: 'ud',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(7.00),
    precioMat_clp: ufToClp(6.00),
    normativa: 'DS N°66 SEC — Distancia mínima 0.5m de puertas/ventanas y 1m de enchufes eléctricos.',

    variantes: [
      mkVar('nic_v1', 'estandar',
        'Nicho Fibrocemento 2 balones 45kg — Con manifold básico',
        'Superboard + Manifold local', 'Nicho estándar 2B',
        12.00,
        { Capacidad: '2 balones 45kg', Material: 'Fibrocemento incombustible', Manifold: 'Con válvula inversora manual', Ventilación: 'Superior + inferior normativa SEC' }
      ),
      mkVar('nic_v2', 'premium',
        'Nicho Albañilería Revocada + Manifold Automático Cavagna',
        'Albañilería + Cavagna (Italia)', 'Nicho albañilería + Cavagna D3200',
        18.00,
        { Capacidad: '2 balones 45kg', Material: 'Albañilería ladrillo revocado', Manifold: 'Cavagna automático (no requiere intervención al cambiar balón)', Puertas: 'Metálicas lacadas con cerramiento magnético', Aspecto: 'Se integra con la fachada' }
      ),
      mkVar('nic_v3', 'premium',
        'Nicho XL Albañilería 4 balones + Manifold Automático + Sistema monitoreo',
        'Albañilería + sistema IoT', 'Nicho XL 4B + sensor gas',
        28.00,
        { Capacidad: '4 balones 45kg (mayor autonomía)', Material: 'Albañilería armada', Manifold: 'Automático + sensor IoT que notifica App cuando queda 1 balón', Ideal_para: 'Industria / Restaurante / Casa grande' }
      ),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 6: ALCANTARILLADO Y FOSAS SÉPTICAS
// ════════════════════════════════════════════════════════════════════════════

const alcantarilladoItems = [
  {
    id: 'gas_desague_pvc_50',
    nombre: 'Colector Desagüe PVC Sanitario Ø50mm (por ml)',
    desc: 'Para lavamanos, ducha y lavaplatos. PVC unido por adhesivo solvente. Pendiente normativa 2-3%. Incluye codos, tees y abrazaderas de fijación.',
    unidad: 'ml',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp: ufToClp(0.50),
    precioMat_clp: ufToClp(0.15),
    variantes: [
      mkVar('des_v1', 'estandar', 'Vinilit PVC Sanitario Ø50mm — Fabricación nacional', 'Vinilit (Chile)', 'PVC SD 50', 0.14, { Color: 'Gris claro', Pared: 'SDR 41', Unión: 'Adhesivo solvente Tangit' }),
      mkVar('des_v2', 'estandar', 'Amanco PVC Sanitario Ø50mm', 'Amanco (Brasil/Chile)', 'PVC Defofo 50', 0.14, { Color: 'Gris', Certificación: 'INN NCh 1632' }),
      mkVar('des_v3', 'premium',  'IPEX PVC Celular Core Ø50mm — Pared triple', 'IPEX (EE.UU.)', 'Sure-Lock', 0.22, { Tipo: 'Celular core (3 capas, más rígida y ligera)', Ruido: 'Menor transmisión de ruido de flujo' }),
    ],
  },

  {
    id: 'gas_desague_pvc_110',
    nombre: 'Colector Desagüe PVC Ø110mm (WC / Bajadas)',
    desc: 'Diámetro obligatorio para WC y bajadas verticales principales. Pendiente 1-2%. Adhesivo solvente + prueba de descarga con WC a máxima capacidad.',
    unidad: 'ml',
    modosCobro: ['mo_solo', 'mo_mat'],
    precioMO_clp: ufToClp(0.70),
    precioMat_clp: ufToClp(0.25),
    variantes: [
      mkVar('d110_v1', 'estandar', 'Vinilit PVC Ø110mm SDR41 — Nacional', 'Vinilit (Chile)', 'PVC SD 110', 0.22, { Diámetro: '110mm', Pared: 'SDR 41', Unión: 'Adhesivo solvente' }),
      mkVar('d110_v2', 'estandar', 'Tigre PVC Sanitario Ø110mm', 'Tigre (Brasil)', 'PVC 110 Defofo', 0.24, { Diámetro: '110mm', Certificación: 'NCh 1632' }),
      mkVar('d110_v3', 'premium',  'Genova SDCO Ø110mm (SDR 35, pared extra gruesa)', 'Genova (EE.UU.)', 'SDCO 4"', 0.38, { Tipo: 'SDR35 (pared gruesa para instalaciones exigidas)', Uso: 'Bajadas verticales altas y colectores enterrados' }),
    ],
  },

  {
    id: 'gas_fosa_septica',
    nombre: 'Instalación Fosa Séptica + Pozo Absorbente (Off-Grid)',
    desc: `Solución sanitaria completa para parcelas sin red de alcantarillado. 
Incluye: topografía de pendiente, excavación con retroexcavadora, instalación de fosa 
plástica séptica (anaeróbica, donde las bacterias descomponen los sólidos), cámara 
desengrasadora previa, cámara de inspección de PVC, y zanjas de infiltración (drenes 
perforados enterrados que esparcen el efluente tratado en el terreno).`,
    unidad: 'gl',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(38.00),
    precioMat_clp: ufToClp(32.00),
    normativa: 'Resolución Sanitaria Seremi de Salud regional. Requiere Informe de Percolación del suelo.',

    variantes: [
      mkVar('fos_v1', 'estandar',
        'Infraplast 2.000L + Pozo Absorbente — Hasta 4 personas',
        'Infraplast (Chile)', 'Fosa 2000L monocámara',
        60.00,
        { Capacidad: '2.000 litros', Personas_max: '4', Material: 'HDPE virgen inyectado', Limpieza: 'Cada 2-3 años', Garantía: '10 años contra defectos' }
      ),
      mkVar('fos_v2', 'premium',
        'Biopur 3.000L Bicámara + Dren 30m — Hasta 6 personas',
        'Biopur (Chile)', 'Sistema BPR-3000',
        82.00,
        { Capacidad: '3.000 litros bicámara (mejor tratamiento)', Personas_max: '6', Dren: '30ml zanjas perforadas', Eficiencia: 'Reduce sólidos 60% más que monocámara' }
      ),
      mkVar('fos_v3', 'premium',
        'Bio-Fosa 5.000L + Sistema Biolítico Aeróbico — Alta eficiencia',
        'Darco (Polonia/Chile)', 'Bio-Fosa 5000 + BioFiber',
        145.00,
        { Capacidad: '5.000 litros', Tecnología: 'Aeróbica (inyecta aire = bacteria más eficiente)', Efluente: 'Calidad para riego (no drena al suelo)', Consumo_electrico: '75W continuo', Garantía: '5 años', Para: 'Casas grandes, condominios pequeños, parcelas exigidas' }
      ),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 7: DIAGNÓSTICO, DESTAPES Y URGENCIAS
// ════════════════════════════════════════════════════════════════════════════

const diagnosticoItems = [
  {
    id: 'gas_destape_mecanico',
    nombre: 'Desobstrucción de Cañería — Sonda Mecánica',
    desc: `"Culebra" flexible de acero motorizada que ingresa por el desagüe y avanza 
rompiendo tapones de pelo, papel o grasa por rotación. Alcance hasta 15 metros sin 
romper muros ni picar pisos. Prueba de descarga completa al terminar.`,
    unidad: 'ud',
    modosCobro: ['mo_solo'],
    precioMO_clp:  ufToClp(2.50),
    precioMat_clp: 0,
    variantes: [
      mkVar('dest_v1', 'estandar', 'Sonda manual 7.5m — WC y lavamanos', 'RIDGID (EE.UU.)', 'K-45', 0, { Alcance: '7.5m', Diámetro_tubo: '2"-4"' }),
      mkVar('dest_v2', 'estandar', 'Sonda motorizada 15m — Colectores y bajadas', 'RIDGID', 'K-400', 0, { Alcance: '15m', Motor: 'Eléctrico 1/3HP', Diámetro_tubo: '1.5"-4"' }),
      mkVar('dest_v3', 'premium',  'Sonda motorizada + cámara de inspección simultánea', 'RIDGID', 'K-400 + SeeSnake Mini', 0, { Alcance: '15m', Extra: 'Cámara push 17mm con grabación, localiza exactamente el tapón' }),
    ],
  },

  {
    id: 'gas_destape_hidrojet',
    nombre: 'Desobstrucción — Hidrojet 200 bar (Obstrucciones graves)',
    desc: `Para obstrucciones que la sonda no puede romper: lodo consolidado, raíces, 
calcificaciones. Una manguera con boquilla especial dispara agua a 200 bar hacia atrás 
mientras avanza, lavando completamente las paredes del tubo. Incluye inspección de cámara.`,
    unidad: 'ud',
    modosCobro: ['mo_solo'],
    precioMO_clp:  ufToClp(4.50),
    precioMat_clp: 0,
    variantes: [
      mkVar('hid_d1', 'estandar', 'Hidrojet 150 bar — Diámetros 2"-4"', 'Kränzle (Alemania)', 'B 150 TS T', 0, { Presión: '150 bar', Caudal: '20L/min', Manguera: '30m' }),
      mkVar('hid_d2', 'premium',  'Hidrojet 200 bar — Raíces y barro seco', 'Kränzle', 'B 200 TS T', 0, { Presión: '200 bar', Caudal: '25L/min', Boquillas: 'Rotativa + penetrante + raíces' }),
      mkVar('hid_d3', 'premium',  'Hidrojet 200 bar + CCTV (Grabación diagnóstico)', 'Kränzle + RIDGID', 'B 200 + SeeSnake Compact', 0, { Presión: '200 bar', Extra: 'Cámara CCTV con grabación digital entregada al cliente' }),
    ],
  },

  {
    id: 'gas_inspeccion_camara',
    nombre: 'Inspección de Cañería con Cámara Push',
    desc: 'Sonda de video flexible que recorre la tubería en tiempo real. Detecta grietas, raíces, deformaciones y obstrucciones. El cliente recibe grabación en MP4 con informe técnico escrito.',
    unidad: 'ud',
    modosCobro: ['mo_solo'],
    precioMO_clp: ufToClp(2.50),
    precioMat_clp: 0,
    variantes: [
      mkVar('cam_v1', 'estandar', 'Cámara Push 17mm — Hasta 30m', 'RIDGID', 'SeeSnake Mini', 0, { Diámetro_cabezal: '17mm', Alcance: '30m', Video: 'Full color', Grabación: 'USB incluido' }),
      mkVar('cam_v2', 'premium',  'Cámara Push 25mm con localizador — Hasta 60m', 'RIDGID', 'SeeSnake CS6x', 0, { Diámetro_cabezal: '25mm', Alcance: '60m', Localizador: 'Marca el punto exacto en superficie para excavar', Video: '4K color' }),
      mkVar('cam_v3', 'premium',  'Cámara Autopropulsada (para colectores 6"+)', 'iPEK / Envirosight', 'Rovion Mini', 0, { Tipo: 'Autopropulsada con ruedas motorizadas', Diámetro_tubo: '6" en adelante', Alcance: '150m' }),
    ],
  },

  {
    id: 'gas_deteccion_ultrasonido',
    nombre: 'Detección de Fugas Ocultas (Geófono / Gas Trazador)',
    desc: `Localización exacta de fugas ocultas bajo radier o muros sin picar a ciegas. 
El geófono amplifica el sonido de la fuga (inaudible al oído) para localizar el punto 
exacto. El gas trazador (mezcla hidrógeno/nitrógeno inerte) se inyecta en la cañería: 
el detector rastrea el gas que sale por la fisura en la superficie.`,
    unidad: 'ud',
    modosCobro: ['mo_solo'],
    precioMO_clp: ufToClp(3.50),
    precioMat_clp: 0,
    variantes: [
      mkVar('det_v1', 'estandar', 'Geófono digital — Tuberías bajo radier', 'Aquaphon (Alemania)', 'Aquaphon A 200', 0, { Tecnología: 'Geófono electrónico', Precisión: '±30cm', Profundidad: 'Hasta 5m' }),
      mkVar('det_v2', 'premium',  'Gas Trazador H2/N2 + Detector — Precisión ±5cm', 'Sewerin (Alemania)', 'VARIOTEC 460 H2', 0, { Tecnología: 'Gas trazador hidrógeno/nitrógeno 5%', Precisión: '±5cm', Gas_inerte: 'No inflamable, no tóxico, aprobado agua potable' }),
      mkVar('det_v3', 'premium',  'Termografía + Humedad — Detección sin contacto', 'FLIR (EE.UU.)', 'FLIR E8-XT + Fluke 975', 0, { Tecnología: 'Cámara termográfica + higrómetro de pared', Uso: 'Fugas detrás de muros sin tocarlos', Rango_temperatura: '-20°C a +550°C', Extras: 'Detección de humedad relativa + temperatura de punto de rocío' }),
    ],
  },

  {
    id: 'gas_visita',
    nombre: 'Visita Diagnóstico Técnico Especializado',
    desc: `El gasfiter senior acude con manómetro, detector de fugas de gas, medidor 
de caudal y kit de diagnóstico. Evalúa presiones, caudales, estado de redes y detecta 
problemas no visibles. Entrega informe escrito con fotografías y presupuesto formal detallado. 
El 100% del valor de la visita se descuenta al aceptar el presupuesto.`,
    unidad: 'gl',
    modosCobro: ['mo_solo'],
    precioMO_clp: ufToClp(1.00),
    precioMat_clp: 0,
    variantes: [
      mkVar('vis_v1', 'estandar', 'Visita de diagnóstico — Entrega informe básico', 'HV Construcción', 'Diagnóstico Estándar', 0, { Duración: '45-60 min', Informe: 'Verbal + presupuesto' }),
      mkVar('vis_v2', 'premium',  'Visita técnica completa — Informe escrito con fotos', 'HV Construcción', 'Diagnóstico Premium', 0, { Duración: '60-90 min', Informe: 'Escrito con fotografías + plano croquis + presupuesto detallado por partida', Entrega: '24h siguientes' }),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// SECCIÓN 8: TRÁMITES, CERTIFICACIONES Y PROYECTOS
// ════════════════════════════════════════════════════════════════════════════

const tramitesGasItems = [
  {
    id: 'gas_regularizacion',
    nombre: 'Regularización Instalación Gas (Sello Verde SEC)',
    desc: `Inspección técnica visual de toda la red de gas: ductos de evacuación, 
ventilaciones de locales de combustión, distancias normativas, estado de conexiones 
y válvulas. Corrección de puntos no conformes (pintar cañerías, ajustar llaves de paso, 
reforzar fijaciones). Emisión del Sello Verde SEC oficial.`,
    unidad: 'gl',
    modosCobro: ['mo_mat'],
    precioMO_clp:  ufToClp(4.50),
    precioMat_clp: ufToClp(0.80),
    normativa: 'DS N°66 MINENERGIA — Obligatorio para recepción final DOM y venta de inmueble.',
    variantes: [
      mkVar('reg_v1', 'estandar', 'Regularización red gas + Sello SEC estándar', 'Instalador SEC habilitado HV', 'Cert. DS66', 0.80, { Plazo: '5-7 días hábiles', Incluye: 'Inspección + correcciones menores + certificado' }),
      mkVar('reg_v2', 'premium',  'Regularización + Prueba manométrica + Informe escrito', 'HV Construcción — Instalador SEC', 'Cert. Premium DS66', 1.20, { Plazo: '3-5 días hábiles', Incluye: 'Todo lo anterior + prueba manométrica 15 min. + Informe técnico para banco/notaría' }),
    ],
  },

  {
    id: 'gas_proyecto_sanitario',
    nombre: 'Diseño y Firma Proyecto Sanitario (Agua + Alcantarillado)',
    desc: `Levantamiento planimétrico con medidas reales, cálculo de dotación según 
OGUC, diseño isométrico de las redes, memoria explicativa técnica, firmado por 
profesional habilitado. Listo para presentar a Aguas Andinas, Esval, ESSBIO, 
o Seremi de Salud según corresponda.`,
    unidad: 'gl',
    modosCobro: ['mo_solo'],
    precioMO_clp:  ufToClp(12.00),
    precioMat_clp: 0,
    variantes: [
      mkVar('proy_v1', 'estandar', 'Proyecto sanitario básico — Vivienda unifamiliar', 'HV Construcción', 'Proyecto básico', 0, { Entrega: '10 días hábiles', Formato: 'PDF + DWG autocad', Firmas: 'Instalador autorizado' }),
      mkVar('proy_v2', 'premium',  'Proyecto sanitario completo + tramitación DOM', 'HV Construcción', 'Proyecto full', 0, { Entrega: '15 días hábiles', Formato: 'PDF + DWG + memorias cálculo', Tramitación: 'HV gestiona ingreso a DOM + seguimiento hasta aprobación' }),
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════════
// ENSAMBLAJE FINAL — exportar array completo
// ════════════════════════════════════════════════════════════════════════════

// Función que calcula automáticamente los campos UF y colaborador/HV
const calcularCamposUF = (items) =>
  items.map((item) => {
    const totalClp = item.precioMO_clp + item.precioMat_clp;
    const ufTotal     = toUF(totalClp);
    const ufMO        = toUF(item.precioMO_clp);
    const ufMat       = toUF(item.precioMat_clp);
    const ufColaborador = toUF(item.precioMO_clp * 0.70);
    const ufHV          = toUF(item.precioMO_clp * 0.30 + item.precioMat_clp);

    return {
      ...item,
      precioTotal_clp: totalClp,
      ufTotal,
      ufMO,
      ufMat,
      ufColaborador,
      ufHV,
      // Calcular los campos equivalentes para cada variante
      variantes: item.variantes?.map((v) => {
        const vTotal       = item.precioMO_clp + v.precioMat_clp;
        const vUfMO        = toUF(item.precioMO_clp);
        const vUfMat       = toUF(v.precioMat_clp);
        const vUfTotal     = toUF(vTotal);
        const vUfColab     = toUF(item.precioMO_clp * 0.70);
        const vUfHV        = toUF(item.precioMO_clp * 0.30 + v.precioMat_clp);
        return {
          ...v,
          precioTotal_clp:    vTotal,
          ufTotal:            vUfTotal,
          ufMO:               vUfMO,
          ufMat:              vUfMat,
          ufColaborador:      vUfColab,
          ufHV:               vUfHV,
        };
      }),
    };
  });

export const gasfiteriaItems = calcularCamposUF([
  ...banoItems,
  ...aguaCalienteItems,
  ...artefactosItems,
  ...redesItems,
  ...gasItems,
  ...alcantarilladoItems,
  ...diagnosticoItems,
  ...tramitesGasItems,
]);

export default gasfiteriaItems;