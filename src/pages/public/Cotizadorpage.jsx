import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check, Shield, Bot, ShoppingCart, 
  Building2, Package, Star, Clock, Download, Phone, Mail, 
  RefreshCw, Droplets, Zap, Wind, Paintbrush, Settings, FileText, Flame
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

// ─── SUBOPCIONES POR SERVICIO ─────────────────────────────
export const SUBOPCIONES = {
  // ── BAÑO COMPLETO STD ──────────────────────────────────
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

  // ── BAÑO PREMIUM ──────────────────────────────────────
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

  // ── CALEFONT ──────────────────────────────────────────
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

  // ── MINI SPLIT ────────────────────────────────────────
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

  // ── PISO PORCELANATO ─────────────────────────────────
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

  // ── TABLERO ELÉCTRICO ─────────────────────────────────
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

  // ── ENCHUFE GFCI ─────────────────────────────────────
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

  // ── PUERTA INTERIOR ───────────────────────────────────
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

  // ── VENTANA TERMOPANEL ────────────────────────────────
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

  // ── URGENCIAS ─────────────────────────────────────────
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

// ─── CSS GLOBAL ───────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,900;1,700;1,900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --gold: #FFCF40; --gold-dim: rgba(255,207,64,.15); --gold-border: rgba(255,207,64,.25);
    --bg: #080808; --bg2: #111; --bg3: #181818;
    --border: rgba(255,255,255,.07); --border2: rgba(255,255,255,.12);
    --text: #fff; --text2: rgba(255,255,255,.55); --text3: rgba(255,255,255,.3);
    --green: #2ECC71; --red: #E74C3C; --blue: #3498DB;
    --ff-display: 'Barlow Condensed', sans-serif;
    --ff-body: 'DM Sans', sans-serif;
    --r-sm: 10px; --r-md: 16px; --r-lg: 22px; --r-xl: 28px;
  }
  html { scroll-behavior: smooth; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #222; border-radius: 2px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
  @keyframes scaleIn  { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
  @keyframes slideRight { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }
  @keyframes pulse2   { 0%,100% { opacity:1 } 50% { opacity:.4 } }
  .fade-up   { animation: fadeUp  .45s cubic-bezier(.16,1,.3,1) both; }
  .fade-in   { animation: fadeIn  .3s ease both; }
  .scale-in  { animation: scaleIn .35s cubic-bezier(.16,1,.3,1) both; }
  .sl-right  { animation: slideRight .3s cubic-bezier(.16,1,.3,1) both; }

  .macro-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r-xl);
    padding: 36px 32px; cursor: pointer; transition: all .3s cubic-bezier(.16,1,.3,1);
    position: relative; overflow: hidden; text-align: left;
  }
  .macro-card:hover { border-color: var(--gold-border); transform: translateY(-6px); box-shadow: 0 24px 56px rgba(0,0,0,.6); }

  .cat-card {
    border-radius: var(--r-lg); overflow: hidden; cursor: pointer;
    border: 1.5px solid var(--border); transition: all .3s ease;
    position: relative; aspect-ratio: 1;
  }
  .cat-card:hover { transform: translateY(-5px); box-shadow: 0 20px 48px rgba(0,0,0,.55); }
  .cat-card.active { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold); }
  .cat-card .bg { position:absolute; inset:0; background-size:cover; background-position:center; transition:transform .5s; }
  .cat-card:hover .bg { transform:scale(1.06); }
  .cat-card .veil { position:absolute; inset:0; background:linear-gradient(to top,rgba(0,0,0,.95) 0%,rgba(0,0,0,.4) 55%,transparent 100%); }
  .cat-card .cnt  { position:relative; z-index:2; height:100%; display:flex; flex-direction:column; justify-content:flex-end; padding:18px; }

  .opt-card {
    border-radius: var(--r-md); border: 1.5px solid var(--border);
    cursor: pointer; transition: all .22s ease; overflow: hidden;
    position: relative; background: var(--bg3);
  }
  .opt-card:hover { border-color: var(--border2); transform: translateY(-3px); }
  .opt-card.sel { border-color: var(--gold); box-shadow: 0 0 0 1px var(--gold-border), 0 8px 24px rgba(255,207,64,.15); }
  .opt-card .opt-img { aspect-ratio:16/10; background:#1a1a1a; overflow:hidden; position:relative; }
  .opt-card .opt-img img { width:100%; height:100%; object-fit:cover; display:block; transition:transform .4s; }
  .opt-card:hover .opt-img img { transform:scale(1.05); }
  .opt-card .opt-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,.1); font-size:11px; text-transform:uppercase; letter-spacing:.1em; font-weight:700; background: #1a1a1a; }
  .opt-card .opt-body { padding: 12px 14px; }
  .opt-card .sel-ring { position:absolute; top:10px; right:10px; width:22px; height:22px; border-radius:50%; background:var(--gold); display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity .2s; z-index:5; }
  .opt-card.sel .sel-ring { opacity:1; }

  .svc-row { border-bottom: 1px solid rgba(255,255,255,.04); transition: background .15s; }
  .svc-row:hover { background: rgba(255,255,255,.02); }
  .svc-row-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; gap: 16px; cursor: pointer; }
  .svc-row-expanded { padding: 0 28px 24px; }

  .qty-wrap { display:flex; align-items:center; gap:6px; flex-shrink:0; }
  .qty-btn { width:30px; height:30px; border-radius:8px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .15s; }

  .proj-opt { border:1.5px solid var(--border); border-radius:var(--r-md); padding:14px 18px; cursor:pointer; transition:all .2s; background:var(--bg3); display:flex; align-items:flex-start; gap:12px; }
  .proj-opt:hover { border-color:var(--border2); background:#1e1e1e; }
  .proj-opt.sel   { border-color:var(--gold); background:rgba(255,207,64,.04); }

  .norm-b { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:20px; font-size:9px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; background:rgba(46,204,113,.08); color:var(--green); border:1px solid rgba(46,204,113,.2); }

  .m2-inp { background:var(--bg); border:2px solid var(--border2); border-radius:var(--r-sm); color:#fff; font-size:30px; font-weight:700; text-align:center; width:110px; padding:10px; font-family:var(--ff-display); outline:none; transition:border-color .2s; }
  .m2-inp:focus { border-color:var(--gold); }

  .cart-fab { position:fixed; bottom:24px; right:24px; z-index:300; background:var(--gold); color:#000; border:none; border-radius:var(--r-lg); padding:14px 22px; font-weight:800; font-size:13px; cursor:pointer; display:flex; align-items:center; gap:9px; letter-spacing:.04em; text-transform:uppercase; box-shadow:0 10px 28px rgba(255,207,64,.4); transition:all .25s; font-family:var(--ff-body); }
  .cart-fab:hover { transform:translateY(-3px); box-shadow:0 18px 40px rgba(255,207,64,.5); }
`;

export const CAT_ICON = {
  gasfiteria: <Droplets size={20}/>, electricidad: <Zap size={20}/>,
  climatizacion: <Wind size={20}/>, terminaciones: <Paintbrush size={20}/>,
  mantenimiento: <Settings size={20}/>, tramites: <FileText size={20}/>,
  urgencias: <Flame size={20}/>,
};

// ─── COMPONENTES COMPARTIDOS ──────────────────────────────
export const BackBtn = ({ onClick, label='Volver' }) => (
  <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'var(--text3)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', cursor:'pointer', padding:0, marginBottom:32 }}>
    <ArrowLeft size={13}/> {label}
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
  const [isGenPDF, setIsGenPDF] = useState(false);
  const [aiText, setAiText]   = useState('');
  const [clientInfo, setClientInfo] = useState({ nombre:'', telefono:'', email:'' });

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

  const handleGenPDF = async () => {
    setIsGenPDF(true); setAiText('');
    const summary = Object.values(cart).map(i => `${i.qty}× ${i.nombre} (${fmtUF(i.ufTotal ?? 0)} UF/${i.unidad})`).join(', ');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          messages:[{ role:'user', content:`Eres el ingeniero jefe de HV Construcción Chile. El cliente ${clientInfo.nombre || 'sin nombre'} seleccionó: ${summary}. Total: ${fmtUF(cartUF)} UF. Redacta en 3 párrafos técnicos ejecutivos: 1) Alcance de los trabajos 2) Materiales específicos con marcas 3) Plazo en días hábiles y requisitos legales. Finaliza con la nota de que este es el valor máximo y la visita técnica puede reducirlo. Tono profesional, sin emojis.` }],
        }),
      });
      const data = await res.json();
      setAiText(data.content?.map(b => b.text||'').join('\n') || 'Análisis técnico generado.');
    } catch { setAiText('Análisis técnico disponible. El presupuesto incluye todos los ítems seleccionados con sus subespecificaciones.'); }
    setIsGenPDF(false);
  };

  const renderMacro = () => (
    <div className="fade-up">
      <div style={{ textAlign:'center', marginBottom:64 }}>
        <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.2em', marginBottom:14 }}>
          HV Construcción · Motor de Cotización IA
        </div>
        <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(44px,7vw,90px)', textTransform:'uppercase', lineHeight:.88, marginBottom:18 }}>
          ¿Qué vamos a<br/><em style={{ color:'var(--gold)', fontStyle:'italic' }}>construir juntos?</em>
        </h1>
        <p style={{ color:'var(--text3)', fontSize:15, maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
          Cotización detallada con precio máximo garantizado. La visita técnica solo puede bajar el valor.
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:16 }}>
        {[
          { id:'proyecto', label:'Proyecto Completo', sub:'Obras mayores · HV lidera', grad:'linear-gradient(145deg,#0f2444,#1a4db5)',
            desc:'Segundo piso, ampliaciones, techo, radier. Presupuesto con selección de materiales y precio por m².',
            tags:['Segundo Piso','Ampliación','Techo / Cobertizo','Radier'], badge:null },
          { id:'servicio', label:'Servicio Especializado', sub:'Colaboradores certificados HV', grad:'linear-gradient(145deg,#0c2a1e,#0f6e40)',
            desc:'Gasfitería, electricidad, climatización, terminaciones. Selección granular ítem por ítem.',
            tags:['Gasfitería','Electricidad','Clima','Pisos'], badge:null },
          { id:'urgencia', label:'Urgencia 24/7', sub:'Respuesta < 2 horas', grad:'linear-gradient(145deg,#3a0000,#c0392b)',
            desc:'Fuga de agua, corte eléctrico, destape, calefont apagado. Llegamos ya. Precio fijo.',
            tags:['Fuga de agua','Corte luz','Destape','Gas'], badge:'24/7' },
        ].map((cat,i) => (
          <button key={cat.id} className={`macro-card fade-up`}
            style={{ animationDelay:`${i*.1}s` }}
            onClick={() => {
              setMacro(cat.id);
              if (cat.id === 'proyecto') goStep(2);
              else { setActiveCat(cat.id === 'urgencia' ? 'urgencias' : null); goStep(2); }
            }}>
            <div style={{ position:'absolute', inset:0, background:cat.grad, opacity:.12 }}/>
            <div style={{ position:'relative', zIndex:1 }}>
              {cat.badge && (
                <div style={{ position:'absolute', top:0, right:0, background:'var(--red)', color:'#fff', fontSize:9, fontWeight:800, padding:'3px 10px', borderRadius:20, letterSpacing:'.08em', textTransform:'uppercase', display:'flex', alignItems:'center', gap:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:'#fff', animation:'pulse2 1.5s infinite' }}/>
                  {cat.badge}
                </div>
              )}
              <div style={{ fontSize:11, color:'var(--text3)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.1em', marginBottom:8 }}>{cat.sub}</div>
              <h3 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:32, textTransform:'uppercase', color:'#fff', lineHeight:1, marginBottom:10 }}>{cat.label}</h3>
              <p style={{ fontSize:13, color:'var(--text2)', lineHeight:1.6, marginBottom:18 }}>{cat.desc}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {cat.tags.map(t => <span key={t} style={{ fontSize:10, padding:'3px 10px', background:'rgba(255,255,255,.06)', borderRadius:20, color:'var(--text3)', fontWeight:600 }}>{t}</span>)}
              </div>
            </div>
            <ArrowRight size={16} style={{ position:'absolute', bottom:26, right:26, color:'rgba(255,255,255,.18)' }}/>
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:28, justifyContent:'center', marginTop:48, flexWrap:'wrap' }}>
        {[<Shield size={13}/>, <Star size={13}/>, <Clock size={13}/>].map((ic,i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:7, fontSize:12, color:'var(--text3)', fontWeight:500 }}>
            <span style={{ color:'var(--gold)' }}>{ic}</span>
            {['Precio máximo garantizado','Materiales de primera marca','Visita técnica baja el costo'][i]}
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
    const projCat = projCatId ? PROYECTOS_DATA[projCatId] : null;

    return (
      <div className="fade-up">
        <BackBtn onClick={() => goStep(isProj ? 2.5 : 2)}/>
        <div style={{ marginBottom:36 }}>
          <div style={{ fontSize:11, color:'var(--gold)', fontWeight:800, textTransform:'uppercase', letterSpacing:'.18em', marginBottom:10 }}>Presupuesto Máximo Estimado</div>
          <h1 style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:'clamp(34px,5vw,62px)', textTransform:'uppercase', lineHeight:.9 }}>
            Tu cotización<br/><em style={{ color:'var(--gold)' }}>oficial</em>
          </h1>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20, alignItems:'start' }}>
          <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-xl)', overflow:'hidden' }}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid var(--border)' }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', color:'var(--text3)', letterSpacing:'.1em' }}>
                {isProj ? `${projCat?.label} · ${m2}m²` : 'Servicios seleccionados'}
              </div>
            </div>
            <div style={{ padding:'0 24px' }}>
              {isProj ? Object.values(projSel).map(s => (
                <div key={s.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,.04)', gap:12 }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:13, color:'#fff', marginBottom:2 }}>{s.nombre}</div>
                    <div style={{ fontSize:11, color:'var(--text3)' }}>{fmtUF(s.costoTotal_uf??s.ufRef??0)} UF/{s.unidad} × {m2}m²</div>
                  </div>
                  <div style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:'var(--gold)' }}>
                    {fmtUF((s.costoTotal_uf??s.ufRef??0)*m2)} UF
                  </div>
                </div>
              )) : Object.values(cart).map(item => {
                const subSels = svcSubs[item.id] ?? {};
                const subs = SUBOPCIONES[item.id] ?? [];
                const subLines = Object.entries(subSels).flatMap(([gid, val]) => {
                  const grupo = subs.find(g => g.id === gid);
                  if (!grupo) return [];
                  const ids = Array.isArray(val) ? val : [val];
                  return ids.map(oid => {
                    const o = grupo.opciones.find(x => x.id === oid);
                    return o ? `${grupo.label}: ${o.label}` : null;
                  }).filter(Boolean);
                });
                const subExtra = Object.entries(subSels).reduce((s,[gid,val]) => {
                  const grupo = subs.find(g => g.id === gid);
                  if (!grupo) return s;
                  const ids = Array.isArray(val) ? val : [val];
                  return s + ids.reduce((ss,oid) => ss + (grupo.opciones.find(o => o.id===oid)?.uf_extra??0), 0);
                }, 0);
                return (
                  <div key={item.id} style={{ padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:12 }}>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:600, fontSize:14, color:'#fff', marginBottom:3 }}>
                          <span style={{ color:'var(--gold)', marginRight:6 }}>{item.qty}×</span>{item.nombre}
                        </div>
                        {subLines.length > 0 && (
                          <div style={{ marginTop:4 }}>
                            {subLines.map((l,i) => <div key={i} style={{ fontSize:11, color:'var(--text3)', display:'flex', alignItems:'center', gap:4 }}><ArrowRight size={9} color="var(--gold)"/>{l}</div>)}
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <div style={{ fontFamily:'var(--ff-display)', fontSize:20, fontWeight:700, color:'var(--gold)' }}>
                          {fmtUF(((item.ufTotal ?? 0)+subExtra)*item.qty)} UF
                        </div>
                        <div style={{ fontSize:11, color:'var(--text3)' }}>${fmt(((item.precioTotal_clp ?? 0)+subExtra*UF_VALOR)*item.qty)}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:'20px 24px', background:'#090909', borderTop:'1px solid rgba(255,255,255,.05)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12, color:'var(--text3)' }}>Mano de obra</span>
                <span style={{ fontSize:13, color:'var(--text2)' }}>{fmtUF(moUF)} UF</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
                <span style={{ fontSize:12, color:'var(--text3)' }}>Materiales</span>
                <span style={{ fontSize:13, color:'var(--text2)' }}>{fmtUF(matUF)} UF</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end' }}>
                <div>
                  <div style={{ fontSize:11, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.1em', fontWeight:700, marginBottom:2 }}>Total máximo</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.2)' }}>IVA no incluido · {!isProj && 'Visita técnica'}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:48, color:'var(--gold)', lineHeight:1 }}>
                    {fmtUF(totalUF)} <span style={{ fontSize:22 }}>UF</span>
                  </div>
                  <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>${fmt(totalCLP)} CLP</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'rgba(255,207,64,.06)', border:'1px solid var(--gold-border)', borderRadius:'var(--r-md)', padding:16 }}>
              <div style={{ fontSize:11, color:'var(--gold)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:6 }}>⚠ Presupuesto máximo</div>
              <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.65 }}>
                Este valor asume todo desde cero. La <strong style={{ color:'#fff' }}>visita técnica identifica lo que ya existe</strong> y puede reducir el costo significativamente.
              </p>
            </div>

            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:16 }}>
              <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', color:'var(--text3)', letterSpacing:'.1em', marginBottom:12 }}>Datos para el PDF</div>
              {[
                { k:'nombre', ph:'Tu nombre completo', ic:<Package size={13}/> },
                { k:'telefono', ph:'Teléfono', ic:<Phone size={13}/> },
                { k:'email', ph:'Correo electrónico', ic:<Mail size={13}/> },
              ].map(f => (
                <div key={f.k} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ color:'var(--text3)', flexShrink:0 }}>{f.ic}</span>
                  <input
                    value={clientInfo[f.k]} placeholder={f.ph}
                    onChange={e => setClientInfo(p => ({...p, [f.k]:e.target.value}))}
                    style={{ flex:1, background:'var(--bg)', border:'1px solid var(--border)', borderRadius:8, color:'#fff', padding:'8px 10px', fontSize:12, outline:'none', fontFamily:'var(--ff-body)' }}/>
                </div>
              ))}
            </div>

            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'rgba(46,204,113,.12)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--green)' }}><Bot size={15}/></div>
                <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>Análisis técnico IA</div>
              </div>
              {isGenPDF && <div style={{ fontSize:12, color:'var(--green)', display:'flex', gap:8, alignItems:'center' }}><RefreshCw size={13} style={{ animation:'spin 1s linear infinite' }}/> Generando…</div>}
              {aiText && <p style={{ fontSize:12, color:'var(--text2)', lineHeight:1.7, whiteSpace:'pre-wrap', maxHeight:200, overflowY:'auto' }}>{aiText}</p>}
              {!aiText && !isGenPDF && <p style={{ fontSize:12, color:'var(--text3)', lineHeight:1.6 }}>Genera el análisis técnico con alcance, materiales y plazos.</p>}
              <button onClick={handleGenPDF} disabled={isGenPDF}
                style={{ width:'100%', marginTop:10, padding:10, background:isGenPDF?'rgba(46,204,113,.08)':'rgba(46,204,113,.12)', color:'var(--green)', border:'1px solid rgba(46,204,113,.2)', borderRadius:9, fontWeight:700, cursor:isGenPDF?'default':'pointer', fontSize:12, textTransform:'uppercase', letterSpacing:'.06em', fontFamily:'var(--ff-body)' }}>
                {isGenPDF ? 'Analizando…' : aiText ? 'Regenerar análisis' : 'Generar análisis IA'}
              </button>
            </div>

            <div style={{ background:'var(--bg2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', padding:16 }}>
              <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,.2)', textTransform:'uppercase', letterSpacing:'.12em', marginBottom:10 }}>Distribución (admin)</div>
              {[
                { l:'Colaboradores 70% MO', v:colUF, c:'var(--blue)' },
                { l:'HV retiene (30%MO+mat)', v:hvUF, c:'var(--gold)' },
              ].map(r => (
                <div key={r.l} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <div style={{ width:7, height:7, borderRadius:'50%', background:r.c }}/>
                    <span style={{ fontSize:11, color:'var(--text3)' }}>{r.l}</span>
                  </div>
                  <span style={{ fontFamily:'var(--ff-display)', fontSize:16, fontWeight:700, color:r.c }}>{fmtUF(r.v)} UF</span>
                </div>
              ))}
              <div style={{ height:4, borderRadius:2, background:'rgba(255,255,255,.06)', overflow:'hidden', marginTop:6 }}>
                <div style={{ height:'100%', width:`${totalUF>0?(hvUF/totalUF*100).toFixed(0):0}%`, background:'var(--gold)', borderRadius:2, transition:'width .5s' }}/>
              </div>
            </div>

            <button style={{ padding:'16px', background:'var(--gold)', color:'#000', border:'none', borderRadius:'var(--r-md)', fontWeight:800, cursor:'pointer', fontSize:14, textTransform:'uppercase', letterSpacing:'.08em', display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'var(--ff-body)' }}>
              <Download size={17}/> Descargar PDF
            </button>
            <button style={{ padding:'14px', background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', fontWeight:600, cursor:'pointer', fontSize:13, textTransform:'uppercase', letterSpacing:'.06em', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'var(--ff-body)' }}>
              <Building2 size={15}/> Agendar visita técnica
            </button>
            <button onClick={() => { setStep(1); setMacro(null); setProjCatId(null); setCart({}); setProjSel({}); setSvcSubs({}); setAiText(''); }}
              style={{ padding:'10px', background:'transparent', color:'var(--text3)', border:'1px solid var(--border)', borderRadius:'var(--r-md)', fontWeight:600, cursor:'pointer', fontSize:12, fontFamily:'var(--ff-body)' }}>
              Nueva cotización
            </button>
          </div>
        </div>
      </div>
    );
  };

  const curStep = step >= 3 ? 3 : step >= 2 ? 2 : 1;

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight:'100vh', background:'var(--bg)', color:'var(--text)', fontFamily:'var(--ff-body)', paddingTop:60 }}>
        
        <header style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, height:56, background:'rgba(8,8,8,.97)', backdropFilter:'blur(20px)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px' }}>
          <div style={{ fontFamily:'var(--ff-display)', fontWeight:900, fontSize:17, textTransform:'uppercase', letterSpacing:'.08em' }}>
            HV <span style={{ color:'var(--gold)' }}>Construcción</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {['Categoría','Detalle','Resumen'].map((lbl,i) => {
              const done = curStep > i+1, active = curStep === i+1;
              return (
                <React.Fragment key={i}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:20, background:done?'rgba(46,204,113,.1)':active?'rgba(255,207,64,.1)':'transparent' }}>
                    <div style={{ width:17, height:17, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, background:done?'var(--green)':active?'var(--gold)':'rgba(255,255,255,.1)', color:done||active?'#000':'var(--text3)' }}>
                      {done ? <Check size={9} strokeWidth={3}/> : i+1}
                    </div>
                    <span style={{ fontSize:10, fontWeight:700, color:active?'var(--gold)':done?'var(--green)':'var(--text3)', textTransform:'uppercase', letterSpacing:'.06em' }}>{lbl}</span>
                  </div>
                  {i<2 && <div style={{ width:16, height:1, background:'rgba(255,255,255,.1)' }}/>}
                </React.Fragment>
              );
            })}
          </div>
          {cartCount > 0 && macro !== 'proyecto' && (
            <button onClick={() => setCartOpen(!cartOpen)} className="cart-fab" style={{ position:'static', padding:'6px 14px', fontSize:11, borderRadius:9, boxShadow:'none' }}>
              <ShoppingCart size={13}/> {cartCount} · {fmtUF(cartUF)} UF
            </button>
          )}
          {macro === 'proyecto' && step >= 2.5 && (
            <div style={{ fontFamily:'var(--ff-display)', fontWeight:800, fontSize:15, color:'var(--gold)' }}>
              {fmtUF(Object.values(projSel).reduce((a,s)=>a+(s.costoTotal_uf??s.ufRef??0),0)*m2)} UF est.
            </div>
          )}
          {(!cartCount || macro === 'proyecto') && step < 2.5 && <div style={{ width:80 }}/>}
        </header>

        <main style={{ maxWidth:1160, margin:'0 auto', padding:'32px 24px 100px' }}>
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

        {cartCount > 0 && step === 2 && macro !== 'proyecto' && (
          <button className="cart-fab" onClick={() => goStep(3)}>
            <ShoppingCart size={17}/>
            {cartCount} ítem{cartCount>1?'s':''} · {fmtUF(cartUF)} UF
            <ArrowRight size={15}/>
          </button>
        )}
      </div>
    </>
  );
};

export default CotizadorPage;