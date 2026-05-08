import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, Download, CheckCircle2, Star, Target, 
  X, Lock, ShieldCheck, Zap, FileText, FileDown,
  Building, Building2, MapPin, Phone, Mail, Calendar, 
  ChevronRight, Package, Bot, RefreshCw, Check,
  Droplets, Wind, Paintbrush, Settings, Flame, Shield, Clock, ArrowRight, ShoppingCart,
  Camera, Sparkles, BrainCircuit
} from 'lucide-react';

import {
  SERVICIOS_DETALLE, PROYECTOS_DATA, UF_VALOR
} from '../../data/serviciosData';

import SectionProyectos from './SectionProyectos';
import SectionServicios from './SectionServicios';
import SectionUrgencias from './SectionUrgencias';

// ─── HELPERS ──────────────────────────────────────────────
export const fmt = n => Math.round(n).toLocaleString('es-CL');
export const fmtUF = n => (n ?? 0).toFixed(2);

// ─── MENSAJES DE CARGA PARA LA UI PREMIUM ─────────────────
const LOADING_MESSAGES = [
  "Iniciando...",
  "[1/8] Analizando selección de partidas...",
  "[2/8] Generando resumen ejecutivo...",
  "[3/8] Calculando lógica constructiva...",
  "[4/8] Elaborando guía de trabajadores...",
  "[5/8] Analizando materiales y riesgos...",
  "[6/8] Calculando timeline y optimizaciones...",
  "[7/8] Ensamblando expediente inteligente...",
  "[8/8] Generando PDF Final..."
];

// ─── SUBOPCIONES POR SERVICIO (Se mantienen intactas) ─────
export const SUBOPCIONES = {
  gas_bano_std: [
    {
      id:'wc_tipo', label:'Tipo de W.C.', tipo:'radio',
      opciones:[
        { id:'wc_standard', label:'W.C. Standard', img:'WC_STANDARD_IMG', uf_extra:0, desc:'Corona Savona / Fanaloza. Cisterna alta, blanco.', marca:'Corona Savona' },
        { id:'wc_alargado', label:'W.C. Alargado', img:'WC_ALARGADO_IMG', uf_extra:0.5, desc:'Roca Dama-N. Diseño alargado, asiento incluido.', marca:'Roca Dama-N' },
        { id:'wc_suspendido', label:'W.C. Suspendido', img:'WC_SUSPENDIDO_IMG', uf_extra:3.0, desc:'Geberit Duofix + Roca Meridian-N. Limpieza fácil.', marca:'Geberit / Roca' },
      ],
    },
    {
      id:'lavamanos_tipo', label:'Lavamanos', tipo:'radio',
      opciones:[
        { id:'lava_sobreponer', label:'Sobreponer', img:'LAVA_SOBRE_IMG', uf_extra:0, desc:'Sobre mesón. Cerámica blanca estándar.', marca:'IM Fontana / Vainsa' },
        { id:'lava_embutir', label:'Embutir en mesón', img:'LAVA_EMBUTIR_IMG', uf_extra:0.8, desc:'Bajo mesón. Requiere mueble vanity.', marca:'Roca / Vainsa' },
        { id:'lava_pedestal', label:'Pedestal', img:'LAVA_PEDESTAL_IMG', uf_extra:0.4, desc:'Sin mueble, columna completa. Ideal baños pequeños.', marca:'Corona / Fanaloza' },
      ],
    },
    {
      id:'ducha_tipo', label:'Tipo de Ducha', tipo:'radio',
      opciones:[
        { id:'ducha_simple', label:'Columna simple', img:'DUCHA_SIMPLE_IMG', uf_extra:0, desc:'Grifería monocomando Fima/Grival. Base acrílica.', marca:'Fima Plus' },
        { id:'ducha_rain', label:'Rain Shower 30cm', img:'DUCHA_RAIN_IMG', uf_extra:2.5, desc:'Cabezal lluvia Grohe/Hansgrohe. Termostática.', marca:'Grohe Rainshower 310' },
        { id:'ducha_cabina', label:'Cabina vidrio templado', img:'DUCHA_CABINA_IMG', uf_extra:4.5, desc:'Mamparas 8mm, perfilería aluminio mate.', marca:'PROFILTEK Sena' },
      ],
    },
    {
      id:'ceramica_piso', label:'Cerámica Piso', tipo:'radio',
      opciones:[
        { id:'cer_ceramica', label:'Cerámica 30×30', img:'CERAMICA_30_IMG', uf_extra:0, desc:'Cerámica antideslizante estándar, variedad de colores.', marca:'Corona / Portobello' },
        { id:'cer_porcelanato', label:'Porcelanato 60×60', img:'PORCELANATO_60_IMG', uf_extra:1.2, desc:'Rectificado mate o brillante. Aspecto premium.', marca:"Grès d'Alsace / Novoceram" },
        { id:'cer_vinilico', label:'Vinílico SPC', img:'VINILICO_IMG', uf_extra:0.6, desc:'100% resistente al agua, fácil recambio.', marca:'COREtec Plus 5mm' },
      ],
    },
    {
      id:'ceramica_muro', label:'Revestimiento Muro', tipo:'radio',
      opciones:[
        { id:'muro_ceramica', label:'Cerámica 20×40', img:'CERAMICA_MURO_IMG', uf_extra:0, desc:'Cerámica brillante blanca o colores. H=2m.', marca:'Corona / Cerámicas Santiago' },
        { id:'muro_porcelanato', label:'Porcelanato 30×60', img:'PORCELANATO_MURO_IMG', uf_extra:1.5, desc:'Rectificado, aspecto moderno. H=2m.', marca:'Novoceram / Porcelanosa' },
        { id:'muro_microcemento', label:'Microcemento', img:'MICROCEMENTO_IMG', uf_extra:2.2, desc:'Acabado industrial continuo sin juntas.', marca:'Weber Microcemento' },
      ],
    },
    {
      id:'espejo', label:'Espejo', tipo:'radio',
      opciones:[
        { id:'esp_simple', label:'Espejo simple 60×80', img:'ESPEJO_SIMPLE_IMG', uf_extra:0, desc:'Marco aluminio. 60×80cm.', marca:'Genérico' },
        { id:'esp_retroiluminado', label:'Retroiluminado LED', img:'ESPEJO_LED_IMG', uf_extra:1.2, desc:'LED perimetral regulable, antiempañante.', marca:'Roca Halo / Villeroy&Boch' },
        { id:'esp_mueble', label:'Botiquín con espejo', img:'BOTICUIN_IMG', uf_extra:0.8, desc:'Espejo + interior con 2 estantes.', marca:'IM / Ferrum' },
      ],
    },
    {
      id:'extras_bano', label:'Accesorios', tipo:'multi',
      opciones:[
        { id:'acc_toallero', label:'Toallero inox', img:'TOALLERO_IMG', uf_extra:0.2, desc:'Acero inox 304 satinado.', marca:'Acero Inox' },
        { id:'acc_extractor', label:'Extractor ventilación', img:'EXTRACTOR_IMG', uf_extra:0.4, desc:'Obligatorio baños sin ventana OGUC.', marca:'Vortice Punto M100' },
        { id:'acc_vanity', label:'Mueble vanity MDF', img:'VANITY_IMG', uf_extra:1.5, desc:'MDF laqueado, cajón suave. 60cm.', marca:'Arauco/Masisa MDF' },
        { id:'acc_toallero_elect', label:'Toallero eléctrico', img:'TOALLERO_ELECT_IMG', uf_extra:1.0, desc:'220V, termostato. Para invierno.', marca:'Zehnder / Kudos' },
      ],
    },
  ],
  gas_bano_premium: [
    {
      id:'wc_prem', label:'W.C. Suspendido', tipo:'radio',
      opciones:[
        { id:'wcp_geberit_roca', label:'Geberit + Roca Meridian', img:'WC_GEBERIT_ROCA_IMG', uf_extra:0, desc:'Bastidor Geberit Duofix, WC Roca Meridian-N, pulsador cromo.', marca:'Geberit + Roca' },
        { id:'wcp_grohe', label:'Grohe Solido + Roca', img:'WC_GROHE_IMG', uf_extra:1.5, desc:'Bastidor Grohe Rapid SL, WC Roca Inspira Round.', marca:'Grohe + Roca' },
        { id:'wcp_villeroy', label:'V&B Subway + Geberit', img:'WC_VB_IMG', uf_extra:3.0, desc:'WC suspendido Villeroy&Boch Subway 2.0 DirectFlush.', marca:'Villeroy & Boch' },
      ],
    },
    {
      id:'ducha_prem', label:'Sistema Ducha Premium', tipo:'radio',
      opciones:[
        { id:'dp_grohe_rain', label:'Grohe Rainshower 310', img:'GROHE_RAIN_IMG', uf_extra:0, desc:'Cabezal lluvia 30cm + termostática empotrada.', marca:'Grohe' },
        { id:'dp_hansgrohe', label:'Hansgrohe Raindance Select', img:'HANSGROHE_IMG', uf_extra:2.0, desc:'Select 3 jets + thermostatic iBox Universal.', marca:'Hansgrohe' },
        { id:'dp_cabina_integral', label:'Cabina integral 90×90', img:'CABINA_INTEGRAL_IMG', uf_extra:4.0, desc:'Cabina completa con hidrojets + vapor.', marca:'Novellini / Duka' },
      ],
    },
    {
      id:'revestimiento_prem', label:'Revestimiento Premium', tipo:'radio',
      opciones:[
        { id:'rp_gran_formato', label:'Porcelanato gran formato 120×60', img:'GRAN_FORMATO_IMG', uf_extra:0, desc:'Grandes losas sin juntas. Look minimalista.', marca:'Novoceram / Urbatek' },
        { id:'rp_marmol', label:'Mármol natural', img:'MARMOL_IMG', uf_extra:5.0, desc:'Mármol Carrara o Marquina. Exclusivo y duradero.', marca:'Mármoles Chile' },
        { id:'rp_microcemento', label:'Microcemento continuo', img:'MICRO_PREM_IMG', uf_extra:3.0, desc:'Sin juntas, aspecto industrial de lujo.', marca:'Topciment / Weber' },
      ],
    },
  ],
  gas_calefont_nuevo: [
    {
      id:'calefont_litros', label:'Capacidad (litros/min)', tipo:'radio',
      opciones:[
        { id:'cf_7l', label:'7 litros/min', img:'CALEFONT_7L_IMG', uf_extra:0, desc:'Para 1 servicio. Departamentos o baños únicos.', marca:'Rheem 7L / Midas' },
        { id:'cf_10l', label:'10 litros/min', img:'CALEFONT_10L_IMG', uf_extra:0.8, desc:'Para 1–2 servicios simultáneos. El más vendido.', marca:'Rheem 10L / Bosch WR 10-2P' },
        { id:'cf_14l', label:'14 litros/min', img:'CALEFONT_14L_IMG', uf_extra:1.5, desc:'Para 2–3 servicios. Casas medianas.', marca:'Rheem 14L / Bosch Therm 5600' },
        { id:'cf_20l', label:'20 litros/min', img:'CALEFONT_20L_IMG', uf_extra:2.5, desc:'Para más de 3 servicios. Casas grandes.', marca:'Rheem 20L / Vaillant MAG' },
      ],
    },
    {
      id:'calefont_tipo_gas', label:'Tipo de Gas', tipo:'radio',
      opciones:[
        { id:'gas_natural', label:'Gas Natural (red)', img:'GAS_NATURAL_IMG', uf_extra:0, desc:'Metano, red de distribución Metrogas/Lipigas.', marca:'—' },
        { id:'gas_glp_est', label:'GLP (cilindro 11/15/45kg)', img:'GLP_IMG', uf_extra:0.2, desc:'Gas licuado en cilindros estándar Chile.', marca:'Abastible / Lipigas / Gasco' },
        { id:'gas_glp_est100', label:'GLP (estanque ≥100L)', img:'ESTANQUE_100_IMG', uf_extra:0.5, desc:'Estanque fijo exterior. Para alto consumo.', marca:'Abastible / Gasco' },
      ],
    },
    {
      id:'calefont_tiro', label:'Tipo de Tiro (evacuación gases)', tipo:'radio',
      opciones:[
        { id:'tiro_atmosferico', label:'Tiro Natural/Atmosférico', img:'TIRO_NAT_IMG', uf_extra:0, desc:'Evacúa por convección natural. Requiere ducto vertical.', normativa:'DS66 — ducto mínimo Ø100mm', marca:'Rheem / Midas' },
        { id:'tiro_forzado', label:'Tiro Forzado (balón)', img:'TIRO_FORZADO_IMG', uf_extra:1.2, desc:'Ventilador integrado. Sale por muro exterior, más flexible.', normativa:'DS66 — tubería balón Ø60/100mm', marca:'Bosch Therm / Junkers' },
        { id:'tiro_condensacion', label:'Condensación (alta eficiencia)', img:'CONDENSACION_IMG', uf_extra:3.5, desc:'Eficiencia >95%. No necesita ducto tradicional.', normativa:'DS66 + certificación MINVU', marca:'Vaillant ecoTEC / Viessmann' },
      ],
    },
    {
      id:'calefont_marca', label:'Marca', tipo:'radio',
      opciones:[
        { id:'marca_rheem', label:'Rheem (Chile)', img:'RHEEM_IMG', uf_extra:0, desc:'La más vendida en Chile. Repuestos disponibles.', marca:'Rheem Chile' },
        { id:'marca_bosch', label:'Bosch Therm', img:'BOSCH_IMG', uf_extra:1.0, desc:'Alemán. Alta eficiencia, garantía 3 años.', marca:'Bosch Thermotechnology' },
        { id:'marca_vaillant', label:'Vaillant', img:'VAILLANT_IMG', uf_extra:2.5, desc:'Premium europeo. Mejor eficiencia del mercado.', marca:'Vaillant Group' },
        { id:'marca_junkers', label:'Junkers/Worcester', img:'JUNKERS_IMG', uf_extra:1.8, desc:'Alemán, grupo Bosch. Muy confiable.', marca:'Junkers Bosch' },
      ],
    },
  ],
  clima_split_12k_full: [
    {
      id:'split_btu', label:'Capacidad BTU', tipo:'radio',
      opciones:[
        { id:'sp_9k', label:'9.000 BTU', img:'SPLIT_9K_IMG', uf_extra:0, desc:'Hasta 18m². Dormitorio estándar.', marca:'Samsung / LG' },
        { id:'sp_12k', label:'12.000 BTU', img:'SPLIT_12K_IMG', uf_extra:1.5, desc:'Hasta 25m². Dormitorio grande o estudio.', marca:'Samsung WindFree' },
        { id:'sp_18k', label:'18.000 BTU', img:'SPLIT_18K_IMG', uf_extra:3.5, desc:'Hasta 35m². Living comedor pequeño.', marca:'LG DUALCOOL / Midea' },
        { id:'sp_24k', label:'24.000 BTU', img:'SPLIT_24K_IMG', uf_extra:6.0, desc:'Hasta 55m². Espacios abiertos.', marca:'Daikin / Carrier' },
      ],
    },
    {
      id:'split_tipo', label:'Tipo de Unidad', tipo:'radio',
      opciones:[
        { id:'tipo_pared', label:'Pared (split mural)', img:'SPLIT_PARED_IMG', uf_extra:0, desc:'El más común. Unidad interior en pared superior.', marca:'Estándar' },
        { id:'tipo_piso', label:'Consola piso/techo', img:'SPLIT_PISO_IMG', uf_extra:0.5, desc:'Unidad al ras del piso. Ideal ventanas amplias.', marca:'Daikin / Fujitsu' },
        { id:'tipo_cassette', label:'Cassette cielo empotrado', img:'SPLIT_CASSETTE_IMG', uf_extra:2.5, desc:'Va empotrado en cielo. Distribución 360°.', marca:'LG Cassette / Mitsubishi' },
      ],
    },
    {
      id:'split_marca', label:'Marca del Equipo', tipo:'radio',
      opciones:[
        { id:'sm_samsung', label:'Samsung WindFree', img:'SAMSUNG_IMG', uf_extra:0, desc:'El mejor inverter del mercado chileno. WiFi incluido.', marca:'Samsung WindFree AR12TXFCAWK' },
        { id:'sm_lg', label:'LG ARTCOOL', img:'LG_IMG', uf_extra:0.5, desc:'Diseño premium, muy silencioso. WiFi + HEPA filter.', marca:'LG ARTCOOL Gallery' },
        { id:'sm_daikin', label:'Daikin', img:'DAIKIN_IMG', uf_extra:1.5, desc:'El más eficiente energéticamente. A+++', marca:'Daikin FTXS-K' },
        { id:'sm_mitsubishi', label:'Mitsubishi Electric', img:'MITSUBISHI_IMG', uf_extra:2.5, desc:'Silencio extremo. Tecnología japonesa top.', marca:'Mitsubishi MSZ-LN' },
      ],
    },
    {
      id:'split_extras', label:'Instalación adicional', tipo:'multi',
      opciones:[
        { id:'sx_wifi', label:'Control WiFi + App', img:'WIFI_IMG', uf_extra:0.3, desc:'Control desde smartphone. Si el equipo no lo incluye.', marca:'Sensibo / Tado°' },
        { id:'sx_purificador', label:'Filtro purificador HEPA', img:'HEPA_IMG', uf_extra:0.5, desc:'PM2.5, olores, alergenos.', marca:'Sharp / Panasonic' },
        { id:'sx_tuberia_larga', label:'Tubería adicional >5m', img:'TUBERIA_IMG', uf_extra:0.4, desc:'Por cada 5m adicionales de cobre.', marca:'Cobre L Colmena' },
        { id:'sx_soporte_reforzado', label:'Soporte reforzado exterior', img:'SOPORTE_IMG', uf_extra:0.3, desc:'Para muros de cerámica, hormigón o ladrillo.', marca:'Unistrut' },
      ],
    },
  ],
  term_porcelanato_60_full: [
    {
      id:'porc_formato', label:'Formato de Porcelanato', tipo:'radio',
      opciones:[
        { id:'pf_60x60', label:'60×60cm', img:'PORC_60_IMG', uf_extra:0, desc:'El más versátil. Instalación rápida.', marca:'Corona Andes / Novoceram' },
        { id:'pf_90x90', label:'90×90cm', img:'PORC_90_IMG', uf_extra:1.5, desc:'Menos juntas, aspecto más amplio.', marca:'Novoceram Grande / Urbatek' },
        { id:'pf_120x60', label:'120×60cm rectificado', img:'PORC_120_IMG', uf_extra:2.5, desc:'Gran formato. Aspecto lujoso, pocas juntas.', marca:'Porcelanosa Venis / Keope' },
      ],
    },
    {
      id:'porc_acabado', label:'Acabado / Textura', tipo:'radio',
      opciones:[
        { id:'pa_mate', label:'Mate', img:'PORC_MATE_IMG', uf_extra:0, desc:'Antideslizante, no muestra huellas. Ideal living.', marca:'—' },
        { id:'pa_brillante', label:'Brillante polished', img:'PORC_BRILLO_IMG', uf_extra:0.3, desc:'Efecto espejo. Amplía visualmente el espacio.', marca:'—' },
        { id:'pa_madera', label:'Imitación madera', img:'PORC_MADERA_IMG', uf_extra:0.5, desc:'Textura madera con durabilidad de porcelanato.', marca:'Porcelanosa Forest / Novoceram' },
        { id:'pa_hormigon', label:'Imitación hormigón', img:'PORC_HORMIGON_IMG', uf_extra:0.5, desc:'Look industrial/loft muy tendencia.', marca:'Urbatek / Vives' },
      ],
    },
    {
      id:'porc_junta', label:'Tipo de Fragua', tipo:'radio',
      opciones:[
        { id:'pj_estandar', label:'Fragua estándar', img:'FRAGUA_STD_IMG', uf_extra:0, desc:'Fraguado convencional. 20+ colores.', marca:'Mapei Keracolor / Sika Ceram' },
        { id:'pj_epoxica', label:'Fragua epóxica', img:'FRAGUA_EPOX_IMG', uf_extra:0.4, desc:'Impermeable, antimanchas. Ideal cocinas y baños.', marca:'Mapei Kerapoxy' },
        { id:'pj_minima', label:'Junta mínima 1mm', img:'FRAGUA_MIN_IMG', uf_extra:0.3, desc:'Para rectificados. Aspecto más lujoso.', marca:'Bostik UltraColor Plus' },
      ],
    },
  ],
  elec_tablero_12: [
    {
      id:'tablero_amperaje', label:'Capacidad del Tablero', tipo:'radio',
      opciones:[
        { id:'tab_25a', label:'25A monofásico', img:'TABLERO_25A_IMG', uf_extra:0, desc:'Para casas hasta 80m². Uso residencial básico.', normativa:'NCh Elec 4', marca:'Schneider Easy9' },
        { id:'tab_40a', label:'40A monofásico', img:'TABLERO_40A_IMG', uf_extra:0.8, desc:'Para casas 80–150m². Climatización incluida.', normativa:'NCh Elec 4', marca:'Legrand DX3' },
        { id:'tab_63a', label:'63A monofásico', img:'TABLERO_63A_IMG', uf_extra:1.5, desc:'Para casas grandes o con AA múltiple.', normativa:'NCh Elec 4', marca:'ABB SACE' },
        { id:'tab_trifasico', label:'Trifásico industrial', img:'TABLERO_TRIF_IMG', uf_extra:3.0, desc:'Taller o equipamiento pesado. 3 fases.', normativa:'Instalador clase A SEC', marca:'Schneider Compact NSX' },
      ],
    },
    {
      id:'tablero_diferencial', label:'Tipo de Diferencial', tipo:'radio',
      opciones:[
        { id:'dif_30ma', label:'30mA (residencial)', img:'DIFERENCIAL_30_IMG', uf_extra:0, desc:'Estándar residencial chileno. Protección básica.', normativa:'NCh Elec 4 obligatorio', marca:'Schneider iID / Legrand' },
        { id:'dif_10ma', label:'10mA (zonas húmedas)', img:'DIFERENCIAL_10_IMG', uf_extra:0.3, desc:'Para baños y cocinas. Más sensible.', normativa:'NCh Elec 4 zonas húmedas', marca:'Legrand / BTicino' },
        { id:'dif_superinmunizado', label:'Super-inmunizado clase SI', img:'DIFERENCIAL_SI_IMG', uf_extra:0.6, desc:'Evita disparos accidentales con cargas capacitivas.', normativa:'IEC 61008 clase SI', marca:'Schneider Domae / Legrand DX3' },
      ],
    },
    {
      id:'tablero_marca', label:'Marca del Tablero', tipo:'radio',
      opciones:[
        { id:'tm_schneider', label:'Schneider Electric', img:'SCHNEIDER_IMG', uf_extra:0, desc:'El más usado en Chile. Easy9 / Acti9.', marca:'Schneider Electric' },
        { id:'tm_legrand', label:'Legrand', img:'LEGRAND_IMG', uf_extra:0.3, desc:'Francés. DX3 / Céliane. Alta calidad.', marca:'Legrand' },
        { id:'tm_abb', label:'ABB SACE', img:'ABB_IMG', uf_extra:0.5, desc:'Suizo. Premium industrial, residencial alto standard.', marca:'ABB' },
      ],
    },
  ],
  elec_enchufe_gfci: [
    {
      id:'gfci_marca', label:'Marca del Enchufe GFCI', tipo:'radio',
      opciones:[
        { id:'gfci_bticino', label:'BTicino Living Light', img:'BTICINO_IMG', uf_extra:0, desc:'Italiano premium. Diseño moderno.', normativa:'GFCI 30mA NCh Elec 4', marca:'BTicino Living Light GFCI' },
        { id:'gfci_legrand', label:'Legrand Céliane', img:'LEGRAND_GFCI_IMG', uf_extra:0.2, desc:'Francés. Compatible con serie Céliane completa.', normativa:'GFCI 30mA', marca:'Legrand Céliane GFCI' },
        { id:'gfci_schneider', label:'Schneider Unica', img:'SCHNEIDER_GFCI_IMG', uf_extra:0.1, desc:'Amplia gama de colores y texturas.', normativa:'GFCI 30mA NCh Elec 4', marca:'Schneider Unica GFCI' },
      ],
    },
    {
      id:'gfci_color', label:'Color / Acabado', tipo:'radio',
      opciones:[
        { id:'col_blanco', label:'Blanco', img:'BLANCO_IMG', uf_extra:0, desc:'El clásico universal.', marca:'—' },
        { id:'col_aluminio', label:'Aluminio mate', img:'ALUMINIO_IMG', uf_extra:0.1, desc:'Moderno, combina con cocinas contemporáneas.', marca:'—' },
        { id:'col_negro', label:'Negro mate', img:'NEGRO_IMG', uf_extra:0.1, desc:'Tendencia actual. Contrasta con muros blancos.', marca:'—' },
      ],
    },
  ],
  term_puerta_int_full: [
    {
      id:'puerta_tipo', label:'Tipo de Puerta', tipo:'radio',
      opciones:[
        { id:'pt_lisa', label:'Lisa (MDF)', img:'PUERTA_LISA_IMG', uf_extra:0, desc:'MDF 35mm chapado melamínico. Económica.', marca:'Arauco / Masisa' },
        { id:'pt_rebajada', label:'Rebajada (cuarterones)', img:'PUERTA_REBAJADA_IMG', uf_extra:0.5, desc:'Diseño tradicional con tableros rebajados.', marca:'Masonite / Jeld-Wen' },
        { id:'pt_vidrio', label:'Con panel de vidrio', img:'PUERTA_VIDRIO_IMG', uf_extra:0.8, desc:'Deja pasar la luz. Vidrio satinado o transparente.', marca:'Masonite Glass' },
        { id:'pt_corredera', label:'Corredera (guías aluminio)', img:'PUERTA_CORREDERA_IMG', uf_extra:1.2, desc:'Ahorra espacio. Ideal habitaciones pequeñas.', marca:'Hettich / Grass' },
      ],
    },
    {
      id:'puerta_acabado', label:'Acabado/Color', tipo:'radio',
      opciones:[
        { id:'pac_blanco', label:'Blanco (PVC fóil)', img:'PUERTA_BLANCO_IMG', uf_extra:0, desc:'El más vendido en Chile. Lavable.', marca:'—' },
        { id:'pac_madera', label:'Imitación madera roble', img:'PUERTA_MADERA_IMG', uf_extra:0.3, desc:'Madera oscura, calidez en el espacio.', marca:'—' },
        { id:'pac_lacado', label:'Lacado premium', img:'PUERTA_LACADO_IMG', uf_extra:0.6, desc:'Pintura PU al horno. Acabado perfecto.', marca:'Lacados industriales' },
      ],
    },
    {
      id:'puerta_cerraje', label:'Cerradura / Herraje', tipo:'radio',
      opciones:[
        { id:'pc_pomo', label:'Pomo esférico inox', img:'POMO_IMG', uf_extra:0, desc:'Clásico. Fácil instalación y mantenimiento.', marca:'Yale / Pomo Inox' },
        { id:'pc_palanca', label:'Palanca inox/dorado', img:'PALANCA_IMG', uf_extra:0.2, desc:'Ergonómica. Para personas mayores.', marca:'ASSA ABLOY / Yale' },
        { id:'pc_magnetica', label:'Cerradura magnética', img:'MAGNETICA_IMG', uf_extra:0.5, desc:'Sin llave. Código o tarjeta.', marca:'YALE / Schlage' },
      ],
    },
  ],
  term_ventana_termo_mo: [
    {
      id:'vent_material', label:'Material del Marco', tipo:'radio',
      opciones:[
        { id:'vm_aluminio_pt', label:'Aluminio RPT', img:'ALUM_RPT_IMG', uf_extra:0, desc:'Aluminio con rotura de puente térmico. Estándar RT.', normativa:'RT OGUC U≤2.0 W/m²K', marca:'Aluvid / Alusa Sistema 45' },
        { id:'vm_pvc', label:'PVC 5 cámaras', img:'PVC_VENT_IMG', uf_extra:1.5, desc:'Mejor aislación del mercado. Sin mantenimiento.', normativa:'RT OGUC U≤1.6 W/m²K', marca:'Rehau Euro 60 / VEKA Softline' },
        { id:'vm_madera', label:'Madera tratada + aluminio', img:'MADERA_VENT_IMG', uf_extra:2.5, desc:'Interior madera natural, exterior aluminio.', normativa:'RT OGUC', marca:'Solarlux / Unilux' },
      ],
    },
    {
      id:'vent_vidrio', label:'Tipo de Vidrio', tipo:'radio',
      opciones:[
        { id:'vv_dvh_std', label:'DVH 4+12+4mm', img:'DVH_STD_IMG', uf_extra:0, desc:'Doble vidriado hermético estándar.', marca:'Guardian / AGC' },
        { id:'vv_dvh_solar', label:'DVH control solar', img:'DVH_SOLAR_IMG', uf_extra:0.8, desc:'Reduce calor solar hasta 60%. Ideal orientación norte.', marca:'Guardian SunGuard / Saint-Gobain' },
        { id:'vv_dvh_acustico', label:'DVH acústtico 6+16+4mm', img:'DVH_ACUST_IMG', uf_extra:1.2, desc:'Para calles ruidosas. Reduce hasta 42dB.', marca:'AGC Stratophone / Pilkington' },
        { id:'vv_tvh', label:'TVH triple 4+12+4+12+4mm', img:'TVH_IMG', uf_extra:2.5, desc:'El mayor aislamiento térmico. Para zonas frías.', marca:'Rehau / VEKA' },
      ],
    },
    {
      id:'vent_apertura', label:'Tipo de Apertura', tipo:'radio',
      opciones:[
        { id:'va_corrediza', label:'Corrediza', img:'VENT_CORREDIZA_IMG', uf_extra:0, desc:'Deslizante horizontal. La más común en Chile.', marca:'—' },
        { id:'va_batiente', label:'Batiente', img:'VENT_BATIENTE_IMG', uf_extra:0.3, desc:'Abre hacia adentro o afuera. Mejor estanqueidad.', marca:'—' },
        { id:'va_proyectante', label:'Proyectante (oscilobatiente)', img:'VENT_PROYEC_IMG', uf_extra:0.5, desc:'Ventila por la parte superior sin corriente.', marca:'—' },
        { id:'va_guillotina', label:'Guillotina', img:'VENT_GUILLOTINA_IMG', uf_extra:0.4, desc:'Sube y baja. Estilo clásico americano.', marca:'—' },
      ],
    },
  ],
  urg_fuga_agua: [
    {
      id:'urg_tipo_fuga', label:'Tipo de fuga', tipo:'radio',
      opciones:[
        { id:'fuga_visible', label:'Fuga visible (cañería rota)', img:'FUGA_VISIBLE_IMG', uf_extra:0, desc:'Rotura evidente. Corte y reparación inmediata.', marca:'—' },
        { id:'fuga_oculta', label:'Fuga oculta (bajo piso/muro)', img:'FUGA_OCULTA_IMG', uf_extra:0.8, desc:'Requiere detección con presión. Más complejo.', marca:'Equipo presurización' },
        { id:'fuga_medidor', label:'Fuga en medidor/empalme', img:'FUGA_MEDIDOR_IMG', uf_extra:1.5, desc:'Requiere coordinación con empresa sanitaria.', marca:'—' },
      ],
    },
  ],
  urg_calefont_urg: [
    {
      id:'calefont_prob', label:'¿Qué le pasa?', tipo:'radio',
      opciones:[
        { id:'cp_no_enciende', label:'No enciende', img:'CALEFONT_NOENC_IMG', uf_extra:0, desc:'Diagnóstico pila, termopar, válvula gas.', marca:'—' },
        { id:'cp_apaga_solo', label:'Se apaga solo', img:'CALEFONT_APAGA_IMG', uf_extra:0, desc:'Revisión termostato, sensor llama, tiro.', marca:'—' },
        { id:'cp_agua_fria', label:'Agua tibia/fría', img:'CALEFONT_FRIO_IMG', uf_extra:0.3, desc:'Revisión capacidad vs demanda, intercambiador.', marca:'—' },
        { id:'cp_perdida', label:'Pérdida de agua', img:'CALEFONT_PERD_IMG', uf_extra:0.5, desc:'Revisión válvula bypass, conexiones.', marca:'—' },
      ],
    },
  ],
};

// ─── CSS GLOBAL (NUEVO TEMA BLANCO ESTILO NIKE) ───────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --gold: #FFCF40; --gold-dim: rgba(255,207,64,.15); --gold-border: rgba(255,207,64,.8);
    --bg: #ffffff; --bg2: #f8f9fa; --bg3: #f1f3f5;
    --border: rgba(0,0,0,.1); --border2: rgba(0,0,0,.15);
    --text: #111111; --text2: #495057; --text3: #868e96;
    --green: #0ca678; --red: #fa5252; --blue: #228be6;
    --ff-display: 'Barlow Condensed', sans-serif;
    --ff-body: 'DM Sans', sans-serif;
    --r-sm: 8px; --r-md: 12px; --r-lg: 16px; --r-xl: 24px;
  }
  
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: var(--ff-body); }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
  @keyframes slideRight { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse2   { 0%,100% { opacity:1 } 50% { opacity:.5 } }
  @keyframes bounceFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

  .fade-up   { animation: fadeUp  .45s cubic-bezier(.16,1,.3,1) both; }
  .fade-in   { animation: fadeIn  .3s ease both; }
  .scale-in  { animation: scaleIn .35s cubic-bezier(.16,1,.3,1) both; }
  .sl-right  { animation: slideRight .3s cubic-bezier(.16,1,.3,1) both; }

  /* ESTILO "NIKE": Bloques sólidos, bordes gruesos, contrastes agresivos */
  .title-nike {
    background: #111; 
    color: var(--gold); 
    display: inline-block; 
    padding: 8px 24px; 
    transform: skew(-8deg); 
    text-transform: uppercase;
    font-family: var(--ff-display);
    font-weight: 900;
    box-shadow: 6px 6px 0px rgba(0,0,0,0.1);
  }
  .title-nike span { display: block; transform: skew(8deg); }

  .macro-card {
    background: #fff; border: 2px solid #000; border-radius: 0px; /* Estilo más rudo/industrial */
    padding: 36px 32px; cursor: pointer; transition: all .2s ease;
    position: relative; overflow: hidden; text-align: left;
    box-shadow: 6px 6px 0px rgba(0,0,0,1);
  }
  .macro-card:hover { transform: translate(-4px, -4px); box-shadow: 10px 10px 0px rgba(0,0,0,1); }

  .cat-card {
    border-radius: var(--r-md); overflow: hidden; cursor: pointer;
    border: 2px solid var(--border); transition: all .3s ease;
    position: relative; aspect-ratio: 1;
    background: #fff;
  }
  .cat-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,.1); border-color: #000; }
  .cat-card.active { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold); }
  .cat-card .bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .5s; opacity: 0.8;}
  .cat-card:hover .bg { transform:scale(1.06); opacity: 1;}
  .cat-card .veil { position:absolute; inset:0; background:linear-gradient(to top,rgba(255,255,255,1) 0%,rgba(255,255,255,.2) 60%,transparent 100%); }
  .cat-card .cnt  { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:flex-end; padding:18px; color: #000;}

  .opt-card {
    border-radius: 0; border: 2px solid var(--border);
    cursor: pointer; transition: all .22s ease; overflow: hidden;
    position: relative; background: #fff;
  }
  .opt-card:hover { border-color: #000; transform: translateY(-2px); }
  .opt-card.sel { border-color: var(--gold); box-shadow: 0 0 0 2px var(--gold), 4px 4px 0px rgba(0,0,0,1); }
  .opt-card .opt-img { aspect-ratio:16/10; background:#f0f0f0; overflow:hidden; position:relative; }
  .opt-card .opt-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .opt-card:hover .opt-img img { transform:scale(1.05); }
  .opt-card .opt-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:#999; font-size:11px; text-transform:uppercase; letter-spacing:.1em; font-weight:700; background: #f0f0f0; }
  .opt-card .opt-body { padding: 12px 14px; }
  .opt-card .sel-ring { position:absolute; top:10px; right:10px; width:22px; height:22px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; z-index:5; border: 2px solid #000; color: #000; }
  .opt-card.sel .sel-ring { opacity:1; }

  .svc-row { border-bottom: 1px solid var(--border); transition: background .15s; background: #fff; }
  .svc-row:hover { background: var(--bg2); }
  .svc-row-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; gap: 16px; cursor: pointer; color: #111; }
  .svc-row-expanded { padding: 0 28px 24px; }

  .qty-wrap { display:flex; align-items:center; gap:6px; flex-shrink:0; }
  .qty-btn { width:30px; height:30px; border-radius:4px; border:2px solid #000; background:#fff; color:#000; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; font-weight: bold; }
  .qty-btn:hover { background: var(--gold); }

  .proj-opt { border:2px solid var(--border); border-radius:0; padding:14px 18px; cursor:pointer; transition:all .2s; background:#fff; display:flex; align-items:flex-start; gap:12px; }
  .proj-opt:hover { border-color:#000; }
  .proj-opt.sel   { border-color:var(--gold); background:rgba(255,207,64,.1); box-shadow: 4px 4px 0px rgba(0,0,0,1); }

  .norm-b { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:20px; font-size:9px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; background:rgba(46,204,113,.15); color:#0ca678; border:1px solid rgba(46,204,113,.3); }

  .m2-inp { background:#fff; border:3px solid #000; color:#000; font-size:30px; font-weight:900; text-align:center; width:110px; padding:10px; font-family:var(--ff-display); outline:none; transition:border-color .2s; box-shadow: inset 4px 4px 0px rgba(0,0,0,0.05); }
  .m2-inp:focus { border-color:var(--gold); }

  .cart-fab { position:fixed; bottom:24px; right:24px; z-index:300; background:var(--gold); color:#000; border:2px solid #000; border-radius:0; padding:14px 22px; font-weight:900; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:9px; letter-spacing:.04em; text-transform:uppercase; box-shadow:6px 6px 0px rgba(0,0,0,1); transition:all .1s; font-family:var(--ff-display); }
  .cart-fab:active { transform:translate(4px, 4px); box-shadow:2px 2px 0px rgba(0,0,0,1); }

  /* Estilos específicos para inputs oscuros en formulario final (para mantener contraste) */
  .form-input { flex:1; background:transparent; border:none; color:#111; font-size:14px; outline:none; font-family:var(--ff-body); font-weight: 600; width:100%; }
  .form-input::placeholder { color: #888; font-weight: 400; }

  /* Asistente IA Flotante */
  .ai-assistant {
    position: fixed; bottom: 24px; left: 24px; z-index: 250; 
    display: flex; align-items: flex-end; gap: 12px;
    pointer-events: none; /* Para que no bloquee clicks */
  }
  .ai-bubble {
    background: #111; color: #fff; padding: 12px 18px; border-radius: 16px 16px 16px 0;
    font-size: 13px; max-width: 280px; box-shadow: 4px 4px 15px rgba(0,0,0,0.2);
    border: 2px solid var(--gold);
    animation: bounceFloat 4s ease-in-out infinite;
  }
  .ai-avatar {
    width: 48px; height: 48px; background: var(--gold); border-radius: 50%;
    display: flex; align-items: center; justify-content: center; border: 2px solid #000;
    box-shadow: 2px 2px 0px rgba(0,0,0,1);
  }
`;

export const CAT_ICON = {
  gasfiteria: <Droplets size={20}/>, electricidad: <Zap size={20}/>,
  climatizacion: <Wind size={20}/>, terminaciones: <Paintbrush size={20}/>,
  mantenimiento: <Settings size={20}/>, tramites: <FileText size={20}/>,
  urgencias: <Flame size={20}/>,
};

export const BackBtn = ({ onClick, label='Volver' }) => (
  <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--text2)', fontSize:13, fontWeight:800, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer', padding:0, marginBottom:32, fontFamily:'var(--ff-display)' }}>
    <ArrowLeft size={16}/> {label}
  </button>
);

// ─── DASHBOARD PRINCIPAL ──────────────────────────────────
const CotizadorPage = () => {
  const [step, setStep]       = useState(1);
  const [macro, setMacro]     = useState(null);
  const [projCatId, setProjCatId] = useState(null);
  const [faseIdx, setFaseIdx] = useState(0);
  const [doneFases, setDoneFases] = useState(new Set());
  const [m2, setM2]           = useState(50);
  const [projSel, setProjSel] = useState({});
  const [activeCat, setActiveCat] = useState(null);
  const [expandedSvc, setExpandedSvc] = useState(null);
  const [svcSubs, setSvcSubs] = useState({});
  const [cart, setCart]       = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState({ nombre:'', telefono:'', email:'' });

  // ── ESTADOS PARA LA GENERACIÓN PREMIUM I.A. ──
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);

  // ── ESTADOS PARA ANÁLISIS DE IMAGEN INICIAL (GEMINI VISION) ──
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const fileInputRef = useRef(null);

  // ── ESTADO DEL COPILOTO I.A. ──
  const [aiMessage, setAiMessage] = useState("¡Hola! Soy tu asistente I.A. Selecciona una opción o sube una foto de tu espacio para empezar a cotizar.");

  const cartCount = Object.values(cart).reduce((a,i) => a + i.qty, 0);
  const cartUF    = Object.values(cart).reduce((a,i) => {
    const sub_extra = Object.entries(svcSubs[i.id] ?? {}).reduce((s,[gid,val]) => {
      const grupo = (SUBOPCIONES[i.id] ?? []).find(g => g.id === gid);
      if (!grupo) return s;
      const ids = Array.isArray(val) ? val : [val];
      return s + ids.reduce((ss, oid) => {
        const o = grupo.opciones.find(x => x.id === oid);
        return ss + (o?.uf_extra ?? 0);
      }, 0);
    }, 0);
    return a + ((i.ufTotal ?? 0) + sub_extra) * i.qty;
  }, 0);

  // ── EFECTO PARA EL COPILOTO I.A. (Monitoreo constante) ──
  useEffect(() => {
    if (step === 1) {
      setAiMessage("Analizo tus requerimientos. ¿Es una obra mayor, un servicio específico o una urgencia? Usa el botón de subir foto si prefieres que yo lo evalúe por ti.");
    } else if (step === 2 && macro === 'proyecto') {
      setAiMessage("Estoy calculando volumetrías. Ajusta los m² y selecciona tus materiales. Yo optimizaré la compatibilidad en tiempo real.");
    } else if (step === 2 && macro === 'servicio') {
      if (cartCount === 0) setAiMessage("Selecciona la categoría de servicio. Explora las opciones y te guiaré con sugerencias técnicas.");
      else setAiMessage(`Excelente. Llevas ${cartCount} servicios en tu cotización. Mis algoritmos de prevención no detectan incompatibilidades aún.`);
    } else if (step === 2 && macro === 'urgencia') {
      setAiMessage("Modo Urgencia Activado. Selecciona el problema; tenemos técnicos de guardia a menos de 2 horas de distancia en RM.");
    } else if (step >= 3) {
      setAiMessage("He empaquetado toda la data técnica. Para desbloquear el manual operativo, análisis de riesgos y guía paso a paso, genera el Expediente I.A.");
    }
  }, [step, macro, cartCount]);

  const goStep = n => { setStep(n); window.scrollTo({ top:0, behavior:'smooth' }); };

  const handleQty = (item, delta) => {
    setCart(prev => {
      const cur = prev[item.id]?.qty ?? 0;
      const nxt = Math.max(0, cur + delta);
      if (nxt === 0) { const c = {...prev}; delete c[item.id]; return c; }
      return { ...prev, [item.id]: { ...item, qty: nxt } };
    });
  };

  const handleSubopt = (itemId, grupoId, optId, tipo) => {
    setSvcSubs(prev => {
      const cur = { ...(prev[itemId] ?? {}) };
      if (tipo === 'radio') {
        cur[grupoId] = optId;
      } else {
        const arr = Array.isArray(cur[grupoId]) ? [...cur[grupoId]] : [];
        const idx = arr.indexOf(optId);
        if (idx >= 0) arr.splice(idx, 1); else arr.push(optId);
        cur[grupoId] = arr;
      }
      return { ...prev, [itemId]: cur };
    });
  };

  // ── FUNCIÓN DEL MOTOR I.A. (ANÁLISIS DE IMAGEN INICIAL) ──
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    setIsAnalyzingVision(true);
    setAiMessage("Procesando imagen con mis ojos digitales... dame unos segundos.");

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = reader.result.split(',')[1];
        const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
        const apiKey = rawKey.trim(); 

        if (!apiKey) throw new Error("API Key no detectada.");

        // Usamos gemini-1.5-flash para visión
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const prompt = `
          Eres el analista jefe de HV Construcción Chile. Mira esta imagen de un cliente. 
          Responde en 2 líneas breves:
          1. ¿Qué problema o necesidad de construcción/reparación ves?
          2. Recomienda si debe elegir "Proyecto Completo", "Servicio Especializado" o "Urgencia".
        `;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: prompt },
                  { inlineData: { mimeType: file.type, data: base64Data } }
                ]
              }
            ]
          })
        });

        if (!response.ok) throw new Error("Error en la API de visión.");

        const data = await response.json();
        const analisisText = data.candidates[0].content.parts[0].text;
        
        setAiMessage(`¡Análisis completo! 👀 ${analisisText}`);
        setIsAnalyzingVision(false);

      } catch (err) {
        console.error(err);
        setAiMessage("Hubo un fallo al analizar la imagen, pero no te preocupes, puedes elegir manualmente arriba.");
        setIsAnalyzingVision(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── FUNCIÓN DEL MOTOR I.A. (EXPEDIENTE FINAL) ──
  const handleComprarPremium = async () => {
    if (!clientInfo.nombre || !clientInfo.email) {
      alert("Por favor, ingresa tu nombre y correo en la sección de datos para personalizar el expediente.");
      return;
    }

    setIsPremiumLoading(true);
    
    let currentStep = 1;
    const progressInterval = setInterval(() => {
      if (currentStep < 7) {
        setLoadingStep(currentStep);
        currentStep++;
      }
    }, 1200);

    try {
      const isProj = macro === 'proyecto';
      const itemsSeleccionados = isProj ? Object.values(projSel) : Object.values(cart);
      const resumenPartidas = itemsSeleccionados.map(p => `- ${p.qty || 1}x ${p.nombre} (${p.unidad || 'und'})`).join('\n');

      const rawKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      const apiKey = rawKey.trim(); 

      if (!apiKey) throw new Error("No se detectó la API Key.");

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const prompt = `
        Eres el Ingeniero Jefe y Prevencionista de Riesgos de "HV Construcción Chile".
        El cliente ${clientInfo.nombre} va a ejecutar el siguiente proyecto (${isProj ? m2 + ' m²' : 'servicios específicos'}):
        ${resumenPartidas}

        Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura:
        {
          "resumen_ejecutivo": "3 párrafos detallados explicando qué se hará.",
          "analisis_constructivo": "Análisis de lógica constructiva.",
          "timeline": [ {"semana": 1, "tarea": "Demolición/Preparación", "trabajadores": 2} ],
          "guia_trabajadores": [ {"partida": "Nombre", "pasos": ["Paso 1"], "herramientas": "...", "errores_frecuentes": "..."} ],
          "riesgos": [ "Riesgo 1...", "Riesgo 2..." ],
          "optimizacion": "Sugerencias de ahorro basándose en el proyecto.",
          "checklist_pre_obra": [ "Permiso municipal (si aplica)" ],
          "validaciones_tecnicas": [ {"etapa": "Etapa 1", "como_validar": "..."} ],
          "garantias_mantencion": "Guía de mantención en Chile."
        }
      `;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
        })
      });

      clearInterval(progressInterval);

      if (!response.ok) throw new Error(`Google rechazó la petición (Status ${response.status}).`);

      setLoadingStep(7);

      const data = await response.json();
      const expedienteInteligente = JSON.parse(data.candidates[0].content.parts[0].text);
      
      setLoadingStep(8);

      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Expediente Técnico IA - ${clientInfo.nombre}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; line-height: 1.6; color: #111; background: #fff;}
              h1 { color: #FFCF40; background: #111; padding: 15px; border-radius: 0px; text-align: center; text-transform: uppercase; font-style: italic;}
              h2 { color: #111; border-bottom: 4px solid #FFCF40; padding-bottom: 5px; margin-top: 30px; text-transform: uppercase;}
              h3 { color: #333; font-weight: bold;}
              .section { margin-bottom: 25px; }
              .label { font-weight: bold; color: #000; }
              ul { padding-left: 20px; }
              li { margin-bottom: 8px; }
              .ai-badge { display: inline-block; background: #FFCF40; color: #000; padding: 4px 8px; font-size: 12px; font-weight: bold; margin-bottom: 10px; }
            </style>
          </head>
          <body>
            <h1>HV CONSTRUCCIÓN - EXPEDIENTE TÉCNICO I.A.</h1>
            <div class="section">
              <span class="ai-badge">✓ GENERADO POR MOTOR I.A.</span>
              <p><span class="label">Cliente:</span> ${clientInfo.nombre}</p>
              <p><span class="label">Email:</span> ${clientInfo.email}</p>
              <p><span class="label">Fecha:</span> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section"><h2>Resumen Ejecutivo</h2><p>${expedienteInteligente.resumen_ejecutivo}</p></div>
            <div class="section"><h2>Análisis Constructivo</h2><p>${expedienteInteligente.analisis_constructivo}</p></div>
            <div class="section">
              <h2>Línea de Tiempo (Timeline)</h2>
              <ul>${expedienteInteligente.timeline.map(t => `<li><strong>Semana ${t.semana}:</strong> ${t.tarea} (${t.trabajadores} trabajadores)</li>`).join('')}</ul>
            </div>
            <div class="section">
              <h2>Guía para Trabajadores</h2>
              ${expedienteInteligente.guia_trabajadores.map(g => `
                <h3>${g.partida}</h3>
                <ul><li><strong>Pasos:</strong> ${g.pasos.join(', ')}</li><li><strong>Herramientas:</strong> ${g.herramientas}</li><li><strong>Evitar:</strong> ${g.errores_frecuentes}</li></ul>
              `).join('')}
            </div>
            <div class="section"><h2>Análisis de Riesgos</h2><ul>${expedienteInteligente.riesgos.map(r => `<li>${r}</li>`).join('')}</ul></div>
            <div class="section"><h2>Optimizaciones</h2><p>${expedienteInteligente.optimizacion}</p></div>
            <div class="section"><h2>Checklist Pre-Obra</h2><ul>${expedienteInteligente.checklist_pre_obra.map(c => `<li>[ ] ${c}</li>`).join('')}</ul></div>
            <div class="section"><h2>Validaciones Técnicas</h2><ul>${expedienteInteligente.validaciones_tecnicas.map(v => `<li><strong>${v.etapa}:</strong> ${v.como_validar}</li>`).join('')}</ul></div>
            <div class="section"><h2>Garantías y Mantención</h2><p>${expedienteInteligente.garantias_mantencion}</p></div>
            
            <script>setTimeout(() => { window.print(); }, 500);</script>
          </body>
        </html>
      `);
      printWindow.document.close();

      setTimeout(() => {
        setIsPremiumLoading(false);
        setLoadingStep(0);
      }, 1500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsPremiumLoading(false);
      setLoadingStep(0);
      console.error("Falla en el motor IA:", error);
      alert(`Hubo un error con la IA: ${error.message}`);
    }
  };

  const renderMacro = () => (
    <div className="fade-up">
      <div style={{ textAlign:'center', marginBottom:40 }}>
        {/* IMAGEN SOLICITADA */}
        <img 
          src="https://firebasestorage.googleapis.com/v0/b/hv-construccion.firebasestorage.app/o/logo.png?alt=media&token=59649a35-319f-4ae7-b997-55cc147e1d17"
          alt="HV Construccion Especialista"
          style={{ width: '100%', maxWidth: 220, margin: '0 auto 10px auto', display: 'block', filter: 'drop-shadow(5px 5px 0px rgba(0,0,0,0.1))' }} 
        />
        
        <div style={{ fontSize:13, color:'#000', fontWeight:800, textTransform:'uppercase', letterSpacing:'.2em', marginBottom:14 }}>
          HV Construcción · Motor de Cotización <span style={{color:'var(--gold)', background:'#111', padding:'2px 6px', marginLeft:4}}>I.A.</span>
        </div>

        {/* TÍTULO ESTILO NIKE */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
          <h1 className="title-nike" style={{ fontSize: 'clamp(36px, 6vw, 70px)', lineHeight: 0.9 }}>
            <span>¿Qué vamos a</span>
            <span style={{ color: '#fff' }}>construir?</span>
          </h1>
        </div>

        <p style={{ color:'var(--text2)', fontSize:16, maxWidth:480, margin:'0 auto', lineHeight:1.5, fontWeight: 500 }}>
          Cotización detallada con precio máximo garantizado. Selecciona tu ruta o deja que nuestra I.A. analice una foto de tu espacio.
        </p>

        {/* BOTÓN SUBIR FOTO I.A. */}
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <input 
            type="file" 
            accept="image/*" 
            id="ia-upload" 
            style={{ display: 'none' }} 
            onChange={handleImageUpload}
          />
          <label 
            htmlFor="ia-upload" 
            style={{ 
              display:'inline-flex', alignItems:'center', gap:8, 
              background:'var(--gold)', color:'#111', padding:'12px 24px', 
              fontWeight:900, cursor:'pointer', textTransform:'uppercase', 
              letterSpacing:'.05em', border:'2px solid #000', boxShadow:'4px 4px 0px rgba(0,0,0,1)',
              transition: 'transform 0.1s', fontFamily: 'var(--ff-display)', fontSize: 16
            }}
            onMouseDown={e => e.currentTarget.style.transform = 'translate(2px, 2px)'}
            onMouseUp={e => e.currentTarget.style.transform = 'translate(0, 0)'}
          >
            {isAnalyzingVision ? <RefreshCw className="spin" size={18} /> : <Camera size={18}/>}
            {isAnalyzingVision ? 'Analizando espacio...' : 'Analizar foto con I.A.'}
          </label>
        </div>

      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:24 }}>
        {[
          { 
            id:'proyecto', 
            label:'Proyecto Completo', 
            sub:'Obras mayores', 
            border: '#000',
            desc:'Segundo piso, ampliaciones, techo, radier. Presupuesto con selección de materiales.',
            tags:['Ampliación','Techo','Radier'], 
            badge:null 
          },
          { 
            id:'servicio', 
            label:'Especializado', 
            sub:'Servicios puntuales', 
            border: '#000',
            desc:'Gasfitería, electricidad, climatización, terminaciones. Granular ítem por ítem.',
            tags:['Gas','Luz','Clima','Pisos'], 
            badge:null 
          },
          { 
            id:'urgencia', 
            label:'Urgencia 24/7', 
            sub:'Respuesta < 2 horas', 
            border: '#fa5252',
            desc:'Fuga de agua, corte eléctrico, destape. Llegamos ya. Precio fijo garantizado.',
            tags:['Fugas','Cortes','Destapes'], 
            badge:'24/7' 
          },
        ].map((cat, i) => (
          <button 
            key={cat.id} 
            className={`macro-card fade-up`}
            style={{ animationDelay: `${i * .1}s`, borderColor: cat.border }}
            onClick={() => {
              setMacro(cat.id);
              if (cat.id === 'proyecto') goStep(2);
              else { 
                setActiveCat(cat.id === 'urgencia' ? 'urgencias' : null); 
                goStep(2); 
              }
            }}
          >
            
            <div style={{ position:'relative', zIndex:1 }}>
              {cat.badge && (
                <div style={{ 
                  position:'absolute', top:-10, right:-10, 
                  background:'#fa5252', color:'#fff', 
                  fontSize:10, fontWeight:900, 
                  padding:'4px 12px', border:'2px solid #000',
                  letterSpacing:'.1em', textTransform:'uppercase', 
                  display:'flex', alignItems:'center', gap:4,
                  boxShadow: '2px 2px 0px rgba(0,0,0,1)'
                }}>
                  <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'pulse2 1.5s infinite' }}/>
                  {cat.badge}
                </div>
              )}
              
              <div style={{ fontSize:12, color: '#555', fontWeight:800, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8, display:'flex', alignItems:'center', gap:4 }}>
                {cat.id === 'proyecto' && <Building2 size={14}/>}
                {cat.id === 'servicio' && <Settings size={14}/>}
                {cat.id === 'urgencia' && <Flame size={14} color="#fa5252"/>}
                {cat.sub}
              </div>
              
              <h3 style={{ 
                fontFamily:'var(--ff-display)', 
                fontWeight:900, fontSize:34, 
                textTransform:'uppercase', color:'#111', 
                lineHeight:1, marginBottom:12,
              }}>
                {cat.label}
              </h3>
              
              <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.5, marginBottom:20, fontWeight:500 }}>
                {cat.desc}
              </p>
              
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {cat.tags.map(t => (
                  <span key={t} style={{ 
                    fontSize:10, padding:'4px 12px', 
                    background:'#f0f0f0', color:'#111', 
                    fontWeight:800, border: `1px solid #ccc`,
                    textTransform: 'uppercase'
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            
            <ArrowRight size={20} style={{ position:'absolute', bottom:26, right:26, color: '#111' }} />
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:28, justifyContent:'center', marginTop:56, flexWrap:'wrap' }}>
        {[<Shield size={16}/>, <Star size={16}/>, <Clock size={16}/>].map((ic,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#111', fontWeight:800, textTransform:'uppercase' }}>
            <span style={{ color:'var(--gold)', background:'#111', padding:4, borderRadius:4, display:'flex' }}>{ic}</span>
            {['Precio garantizado','Primeras marcas','Visita baja el costo'][i]}
          </div>
        ))}
      </div>
    </div>
  );

const renderResumen = () => {
    const isProj = macro === 'proyecto';
    const totalUF = isProj
      ? Object.values(projSel).reduce((a,s) => a + (s.costoTotal_uf ?? s.ufRef ?? 0), 0) * m2
      : cartUF;
    const totalCLP = totalUF * UF_VALOR;
    const moUF  = isProj ? totalUF * .42 : Object.values(cart).reduce((a,i) => a+(i.ufMO ?? 0)*i.qty,0);
    const matUF = isProj ? totalUF * .58 : Object.values(cart).reduce((a,i) => a+(i.ufMat ?? 0)*i.qty,0);
    const hvUF  = isProj ? totalUF * .30 : Object.values(cart).reduce((a,i) => a+(i.ufHV ?? 0)*i.qty,0);
    const colUF = moUF * .70;

    return (
      <div className="fade-up" style={{ paddingBottom: 100 }}>
        <BackBtn onClick={() => goStep(isProj ? 2.5 : 2)}/>
        
        {/* ── HEADER NIKE STYLE ── */}
        <div style={{ textAlign: 'center', marginBottom: 50, marginTop: 10 }}>
          <div style={{ fontSize:12, color:'#111', fontWeight:900, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:16 }}>
            <ShieldCheck size={16} style={{ display:'inline', verticalAlign:'middle', marginRight:6, color:'var(--green)' }}/>
            Ingeniería Finalizada
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <h1 className="title-nike" style={{ fontSize: 'clamp(30px, 5vw, 60px)', lineHeight: 0.9 }}>
              <span style={{ color: '#fff' }}>TU PROYECTO</span>
              <span>ESTÁ LISTO</span>
            </h1>
          </div>

          <p style={{ color:'var(--text2)', fontSize: 15, maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight:500 }}>
            Mis redes neuronales procesaron tus medidas. Ingresa tus datos y elige el formato de entrega de tu expediente.
          </p>
        </div>

        {/* ── DATOS DEL CLIENTE ── */}
        <div style={{ background:'#fff', border:'2px solid #000', borderRadius:'0', padding:32, maxWidth: 800, margin: '0 auto 40px auto', boxShadow: '6px 6px 0px rgba(0,0,0,1)' }}>
          <div style={{ fontSize:14, fontWeight:900, textTransform:'uppercase', color:'#111', letterSpacing:'.05em', marginBottom:20, borderBottom:'2px solid #f0f0f0', paddingBottom:10 }}>
            1. Datos del Titular
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {[
              { k:'nombre', ph:'Nombre completo', ic:<Package size={16}/> },
              { k:'telefono', ph:'Teléfono / WhatsApp', ic:<Phone size={16}/> },
              { k:'email', ph:'Correo electrónico', ic:<Mail size={16}/> },
            ].map(f => (
              <div key={f.k} style={{ display:'flex', alignItems:'center', gap:12, background:'#f8f9fa', border:'2px solid #000', padding:'12px 16px' }}>
                <span style={{ color:'#111', display:'flex' }}>{f.ic}</span>
                <input
                  className="form-input"
                  value={clientInfo[f.k] || ''} placeholder={f.ph}
                  onChange={e => setClientInfo(p => ({...p, [f.k]:e.target.value}))}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── TARJETAS FREEMIUM VS PREMIUM ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32, maxWidth: 1000, margin: '0 auto' }}>
          
          {/* TIER 1: BÁSICO */}
          <div style={{ display:'flex', flexDirection:'column', background:'#fff', border:'2px solid #000', overflow:'hidden', boxShadow:'4px 4px 0px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: 32, flex: 1 }}>
              <div style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', color:'#555', letterSpacing:'.1em', background:'#f0f0f0', padding:'6px 12px', display:'inline-block', marginBottom: 20 }}>
                Documento Básico
              </div>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize: 32, fontWeight: 900, color:'#111', marginBottom: 4, textTransform:'uppercase' }}>Presupuesto</h2>
              <div style={{ color:'var(--green)', fontWeight:900, fontSize:22, marginBottom: 20 }}>GRATIS</div>
              
              <p style={{ fontSize: 14, color:'var(--text2)', lineHeight: 1.6, marginBottom: 24, minHeight: 60, fontWeight:500 }}>
                Documento referencial en PDF. Ideal para tener una idea global del costo máximo estimado.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom: 32 }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#111', fontWeight:600 }}>
                  <Check size={18} color="var(--green)" style={{ marginTop:1 }}/> Totales: {fmtUF(totalUF)} UF
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#111', fontWeight:600 }}>
                  <Check size={18} color="var(--green)" style={{ marginTop:1 }}/> Listado de {Object.keys(projSel).length || cartCount} partidas
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#aaa', textDecoration:'line-through', fontWeight:500 }}>
                  <X size={18} style={{ marginTop:1 }}/> Guía de Trabajadores (I.A.)
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start', fontSize:14, color:'#aaa', textDecoration:'line-through', fontWeight:500 }}>
                  <X size={18} style={{ marginTop:1 }}/> Timeline y Riesgos (I.A.)
                </div>
              </div>

              <button style={{ width:'100%', padding:'16px', background:'#fff', color:'#111', border:'2px solid #000', fontWeight:900, cursor:'pointer', fontSize:13, textTransform:'uppercase', letterSpacing:'.05em', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition: 'background .2s', fontFamily:'var(--ff-display)' }}>
                <Download size={18}/> Descargar PDF Simple
              </button>
            </div>
            
            <div style={{ background:'#f8f9fa', borderTop:'2px solid #000', padding: 24, display:'flex', flexDirection:'column', gap:12 }}>
              <div>
                <div style={{ color:'#111', fontWeight:900, fontSize:14, display:'flex', alignItems:'center', gap:6, marginBottom:4, textTransform:'uppercase' }}>
                  <Target size={16} color="var(--blue)"/> Visita Técnica
                </div>
                <div style={{ color:'#555', fontSize:12, fontWeight:500 }}>Validamos medidas y reducimos costo.</div>
              </div>
              <button style={{ width:'100%', padding:'12px', background:'#fff', color:'#111', border:'2px solid #111', fontWeight:800, cursor:'pointer', fontSize:12, textTransform:'uppercase', letterSpacing:'.05em' }}>
                Agendar Evaluación
              </button>
            </div>
          </div>

          {/* TIER 2: PREMIUM I.A. */}
          <div style={{ display:'flex', flexDirection:'column', background:'#111', border:'2px solid #000', overflow:'hidden', position:'relative', transform:'translateY(-10px)', boxShadow:'8px 8px 0px var(--gold)' }}>
            <div style={{ position:'absolute', top:25, right:-35, background:'var(--gold)', color:'#000', fontSize:10, fontWeight:900, padding:'6px 40px', transform:'rotate(45deg)', letterSpacing:'.1em' }}>
              I.A. ENGINE
            </div>
            
            <div style={{ padding: 32, flex: 1 }}>
              <div style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', color:'#000', letterSpacing:'.1em', background:'var(--gold)', padding:'6px 12px', display:'inline-block', marginBottom: 20 }}>
                <BrainCircuit size={12} style={{ display:'inline', marginBottom:2, marginRight:4 }}/> Manual Operativo
              </div>
              <h2 style={{ fontFamily:'var(--ff-display)', fontSize: 32, fontWeight: 900, color:'#fff', marginBottom: 4, textTransform:'uppercase', paddingRight:40 }}>Expediente I.A.</h2>
              <div style={{ display:'flex', alignItems:'flex-end', gap:6, marginBottom: 20 }}>
                <div style={{ color:'var(--gold)', fontWeight:900, fontSize:38, lineHeight:1 }}>$99.000</div>
                <div style={{ color:'#aaa', fontSize:14, fontWeight:700, paddingBottom:4 }}>CLP</div>
              </div>
              
              <p style={{ fontSize: 14, color:'#bbb', lineHeight: 1.6, marginBottom: 24, minHeight: 60, fontWeight: 500 }}>
                El cerebro de tu obra. Diseñado por I.A. para evitar errores constructivos, pérdida de materiales y sobrecostos. Protege tu inversión.
              </p>

              <div style={{ display:'flex', flexDirection:'column', gap:18, marginBottom: 32 }}>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <CheckCircle2 size={22} color="var(--gold)" style={{ flexShrink:0 }}/>
                  <div>
                    <div style={{ color:'#fff', fontSize:14, fontWeight:800, marginBottom:2 }}>Desglose Inteligente</div>
                    <div style={{ color:'#888', fontSize:12, lineHeight:1.4, fontWeight:500 }}>Materiales justificados por función y riesgo.</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <CheckCircle2 size={22} color="var(--gold)" style={{ flexShrink:0 }}/>
                  <div>
                    <div style={{ color:'#fff', fontSize:14, fontWeight:800, marginBottom:2 }}>Guía de Trabajadores</div>
                    <div style={{ color:'#888', fontSize:12, lineHeight:1.4, fontWeight:500 }}>Paso a paso, herramientas y prevención de errores.</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                  <CheckCircle2 size={22} color="var(--gold)" style={{ flexShrink:0 }}/>
                  <div>
                    <div style={{ color:'#fff', fontSize:14, fontWeight:800, marginBottom:2 }}>Riesgos y Timeline</div>
                    <div style={{ color:'#888', fontSize:12, lineHeight:1.4, fontWeight:500 }}>Alertas tempranas de incompatibilidad constructiva.</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: 24, borderTop:'2px solid #222', background:'#000' }}>
              {isPremiumLoading ? (
                <div style={{ padding: '20px', background: 'rgba(255,207,64,.1)', border: '1px solid var(--gold)', textAlign: 'center' }}>
                  <RefreshCw size={24} color="var(--gold)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 10px auto' }} />
                  <div style={{ color: 'var(--gold)', fontWeight: 900, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 6 }}>
                    PROCESANDO RED NEURONAL
                  </div>
                  <div style={{ color: '#fff', fontSize: 12, fontFamily: 'monospace' }}>
                    {LOADING_MESSAGES[loadingStep]}
                  </div>
                  <div style={{ width: '100%', height: 4, background: '#222', marginTop: 12, overflow: 'hidden' }}>
                    <div style={{ width: `${(loadingStep / 8) * 100}%`, height: '100%', background: 'var(--gold)', transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleComprarPremium} 
                    style={{ width:'100%', padding:'18px', background:'var(--gold)', color:'#000', border:'none', fontWeight:900, cursor:'pointer', fontSize:15, textTransform:'uppercase', letterSpacing:'.05em', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'var(--ff-display)' }}
                  >
                    <Sparkles size={18}/> Generar Expediente I.A.
                  </button>
                  <div style={{ textAlign:'center', fontSize:11, color:'#666', marginTop:14, textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700 }}>
                    Pago 100% seguro · Generación en ~30 seg
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── ZONA ADMIN (PANEL HV) ── */}
        <div style={{ maxWidth: 800, margin: '60px auto 0 auto', background:'#f8f9fa', border:'2px solid #000', padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer' }} onClick={() => document.getElementById('admin-zone').classList.toggle('hidden')}>
            <div style={{ fontSize:12, fontWeight:900, color:'#111', textTransform:'uppercase', letterSpacing:'.12em' }}><Lock size={12} style={{ display:'inline', marginRight:6 }}/> Panel Administrativo HV</div>
          </div>
          
          <div id="admin-zone" className="hidden" style={{ marginTop: 20, paddingTop: 20, borderTop:'2px solid #000' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div>
                <div style={{ fontSize:13, color:'#555', marginBottom:4, fontWeight:600 }}>MO Base ({fmtUF(moUF)} UF)</div>
                <div style={{ fontSize:13, color:'#555', marginBottom:4, fontWeight:600 }}>Materiales ({fmtUF(matUF)} UF)</div>
              </div>
              <div>
                {[
                  { l:'Colaboradores 70% MO', v:colUF, c:'var(--blue)' },
                  { l:'Utilidad HV', v:hvUF, c:'var(--gold)' },
                ].map(r => (
                  <div key={r.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:10, height:10, background:r.c, border:'1px solid #000' }}/>
                      <span style={{ fontSize:12, color:'#111', fontWeight:700 }}>{r.l}</span>
                    </div>
                    <span style={{ fontFamily:'var(--ff-display)', fontSize:16, fontWeight:900, color:'#000' }}>{fmtUF(r.v)} UF</span>
                  </div>
                ))}
                <div style={{ height:6, background:'#e0e0e0', overflow:'hidden', marginTop:8, border:'1px solid #000' }}>
                  <div style={{ height:'100%', width:`${totalUF>0?(hvUF/totalUF*100).toFixed(0):0}%`, background:'var(--gold)' }}/>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  };

  const curStep = step >= 3 ? 3 : step >= 2 ? 2 : 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:'100vh', paddingTop:60 }}>
        
        {/* ── HEADER ── */}
        <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:60, background:'rgba(255,255,255,0.95)', backdropFilter:'blur(10px)', borderBottom:'2px solid #000', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px' }}>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:20, textTransform:'uppercase', letterSpacing:'.05em', color:'#111' }}>
            HV <span style={{ color:'var(--gold)', background:'#111', padding:'0 4px', fontStyle:'italic' }}>Construcción</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {['Categoría','Detalle','Resumen'].map((lbl,i) => {
              const done = curStep > i+1, active = curStep === i+1;
              return (
                <React.Fragment key={i}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', background:done?'var(--green)':active?'#111':'#f0f0f0', color:done||active?'#fff':'#999', border: active ? '2px solid #111' : '2px solid transparent' }}>
                    <span style={{ fontSize:11, fontWeight:900, textTransform:'uppercase', letterSpacing:'.06em', color: active ? 'var(--gold)' : 'inherit' }}>
                      {done ? <Check size={12} strokeWidth={4} style={{marginBottom:-2}}/> : `${i+1}. ${lbl}`}
                    </span>
                  </div>
                  {i<2 && <div style={{ width:12, height:2, background:'#e0e0e0' }}/>}
                </React.Fragment>
              );
            })}
          </div>
          {cartCount > 0 && macro !== 'proyecto' && (
            <button onClick={() => setCartOpen(!cartOpen)} className="cart-fab" style={{ position:'static', padding:'8px 16px', fontSize:12, boxShadow:'none' }}>
              <ShoppingCart size={14}/> {cartCount} · {fmtUF(cartUF)} UF
            </button>
          )}
          {macro === 'proyecto' && step >= 2.5 && (
            <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:18, color:'#111', background:'var(--gold)', padding:'4px 12px', border:'2px solid #000' }}>
              {fmtUF(Object.values(projSel).reduce((a,s)=>a+(s.costoTotal_uf??s.ufRef??0),0)*m2)} UF
            </div>
          )}
          {(!cartCount || macro === 'proyecto') && step < 2.5 && <div style={{ width:80 }}/>}
        </header>

        <main style={{ maxWidth:1160, margin:'0 auto', padding:'40px 24px 100px' }}>
          {step === 1 && renderMacro()}
          
          {macro === 'proyecto' && (step === 2 || step === 2.5) && (
            <SectionProyectos 
              step={step} goStep={goStep} 
              projCatId={projCatId} setProjCatId={setProjCatId} 
              projSel={projSel} setProjSel={setProjSel} 
              m2={m2} setM2={setM2} 
            />
          )}

          {macro === 'servicio' && step === 2 && (
            <SectionServicios 
              goStep={goStep} activeCat={activeCat} setActiveCat={setActiveCat} 
              cart={cart} handleQty={handleQty} 
              expandedSvc={expandedSvc} setExpandedSvc={setExpandedSvc} 
              svcSubs={svcSubs} handleSubopt={handleSubopt} 
              cartCount={cartCount}
            />
          )}

          {macro === 'urgencia' && step === 2 && (
            <SectionUrgencias 
              goStep={goStep} activeCat={activeCat} setActiveCat={setActiveCat} 
              cart={cart} handleQty={handleQty} 
              expandedSvc={expandedSvc} setExpandedSvc={setExpandedSvc} 
              svcSubs={svcSubs} handleSubopt={handleSubopt} 
              cartCount={cartCount}
            />
          )}

          {step === 3 && renderResumen()}
        </main>

        {/* ── BOTÓN CARRITO FLOTANTE ── */}
        {cartCount > 0 && step === 2 && macro !== 'proyecto' && (
          <button className="cart-fab" onClick={() => goStep(3)}>
            <ShoppingCart size={18}/>
            Ver {cartCount} ítem{cartCount>1?'s':''} · {fmtUF(cartUF)} UF
            <ArrowRight size={18}/>
          </button>
        )}

        {/* ── COPILOTO I.A. FLOTANTE ── */}
        <div className="ai-assistant">
          <div className="ai-avatar">
            <Bot size={24} color="#111" />
          </div>
          <div className="ai-bubble">
            <strong style={{ color: 'var(--gold)', display: 'block', marginBottom: 4, fontSize: 11, textTransform: 'uppercase' }}>Copiloto I.A.</strong>
            {aiMessage}
          </div>
        </div>

      </div>
    </>
  );
};

export default CotizadorPage;