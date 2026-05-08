/**
 * ════════════════════════════════════════════════════════════════════════════
 * aiService.js — HV CONSTRUCCIÓN CHILE
 * Motor de Inteligencia Artificial Multi-Agente v3.0 Premium
 *
 * ARQUITECTURA: 5 Expertos Especializados + 1 Jefe de Proyecto Sintetizador
 *
 * ⚙️  Agente 1 — Ingeniero Civil Estructural  (NCh 433, NCh 1198, NCh 3171)
 * 📐  Agente 2 — Arquitecto                   (OGUC, habitabilidad, permisos)
 * 🔨  Agente 3 — Maestro Constructor          (secuencia, errores, oficio)
 * ⛑️  Agente 4 — Prevencionista de Riesgos    (Ley 16.744, DS 594, DS 40)
 * 💰  Agente 5 — Gestor de Costos             (cantidades, mermas, mercado)
 * 📋  Sintetizador — Jefe de Proyecto Master  (integración + expediente final)
 *
 * SEGURIDAD: En producción, exponer SOLO desde un backend (Next.js API Routes,
 * Vercel Functions, Express). Nunca en el bundle del navegador.
 *
 * MODELOS SOPORTADOS: Anthropic Claude (primario) | Google Gemini (alternativo)
 * ════════════════════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 1: CONFIGURACIÓN Y CONSTANTES
// ─────────────────────────────────────────────────────────────────────────────

const CONFIG = {
  anthropic: {
    url:     'https://api.anthropic.com/v1/messages',
    model:   'claude-sonnet-4-20250514',
    version: '2023-06-01',
    maxTokensSintetizador: 8192,
    maxTokensAgentes:      4096,
  },
  gemini: {
    url:   (key) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    model: 'gemini-1.5-flash',
  },
  retry: {
    maxAttempts:  3,
    baseDelayMs:  1200,
    maxDelayMs:   12000,
  },
};

const UF_VALOR = 40_160; // CLP — actualizar mensualmente

/** Factores de merma por unidad de medida */
const MERMA = {
  'm²':    1.12,  // +12% en planchas, pisos, revestimientos
  'ml':    1.08,  // +8%  en tubos, molduras, canaletas
  'ud':    1.05,  // +5%  en unidades (puertas, ventanas)
  'kg':    1.10,  // +10% en soldadura, pegamentos
  'lt':    1.08,  // +8%  en pintura, impermeabilizante
  'saco':  1.10,  // +10% en cemento, yeso, adhesivo
  'global': 1.00, // sin merma en trabajos globales
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 2: MARCO NORMATIVO CHILENO
// Inyectado en todos los prompts para garantizar cumplimiento legal
// ─────────────────────────────────────────────────────────────────────────────

const NORMAS_CHILE = `
╔══════════════════════════════════════════════════════════════════╗
║          MARCO NORMATIVO OBLIGATORIO — CHILE                    ║
╚══════════════════════════════════════════════════════════════════╝

ESTRUCTURALES:
  • NCh 433.Of1996 Mod.2009  Diseño sísmico de edificios (Zona Z1–Z4)
  • NCh 2369.Of2003          Diseño sísmico de estructuras industriales
  • NCh 1198.Of2006          Madera: cálculo estructural + conexiones
  • NCh 3171.Of2010          Hormigón estructural. Requisitos generales
  • NCh 204.Of2006           Acero para uso estructural
  • NCh 432.Of1971           Cálculo de la acción del viento sobre estructuras
  • NCh 1537.Of1987          Diseño estructural de edificios. Cargas permanentes

INSTALACIONES:
  • NCh Elec. 4/2003         Instalaciones eléctricas de baja tensión residencial
  • DS N°66/2007 MINENERGIA  Reglamento instalaciones interiores de gas combustible
  • NCh 2485.Of2000          Instalaciones domiciliarias de agua potable y alcantarillado
  • Ord. 423 SESMA           Instalaciones sanitarias y evacuación pluvial

URBANISMO Y HABITABILIDAD:
  • OGUC (DFL N°458/1975)    Ordenanza General de Urbanismo y Construcciones
  • NCh 1079.Of1977 Rev.2008 Clasificación zonas climáticas Chile (1–6)
  • RT 080/2021 MINVU        Reglamento Térmico habitacional (Zonas térmicas 1–7)

SEGURIDAD LABORAL:
  • Ley N°16.744             Accidentes del Trabajo y Enfermedades Profesionales
  • DS N°594/1999 MINSAL     Condiciones sanitarias y ambientales en trabajos
  • DS N°40/1969 MINTRAB     Prevención de riesgos profesionales
  • DS N°63/2005 MINTRAB     Equipos de protección personal

REGLAS CRÍTICAS INAMOVIBLES:
  [R1] Zona sísmica 3 (Santiago y gran parte del país): Factor 0.40g.
       TODA estructura debe calcular carga sísmica — sin excepción.
  [R2] Madera en exterior: MÍNIMO clase H3 impregnada vacío-presión (CCA/ACQ).
       Sin impregnación → se pudre en 3–8 años.
  [R3] Conexiones de madera: SIEMPRE con conectores metálicos certificados
       (Simpson Strong-Tie / MiTek / Prodac). Clavos solos no son suficientes.
  [R4] Tablero eléctrico: Diferencial 30mA OBLIGATORIO. TE1 firmado por
       instalador SEC Clase A o B antes de recepción final.
  [R5] Gas: Certificado SEC OBLIGATORIO. Solo instaladores habilitados DS66.
       Prueba manométrica 15 min antes de entregar.
  [R6] Obras > 6 m² o que modifiquen estructura: Permiso DOM requerido.
       Sin permiso → la obra no se puede recepcionar ni vender.
  [R7] Hormigón: esperar MÍNIMO 24 h para cargar (20°C). En frío: 48–72 h.
  [R8] Teja asfáltica: pendiente mínima 18° (32%). Bajo eso → filtra.
`;

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 3: UTILIDADES INTERNAS
// ─────────────────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Ejecuta una función con reintentos exponenciales ante errores transitorios.
 * Falla inmediatamente ante errores permanentes (API key inválida, 400 Bad Request).
 */
const withRetry = async (fn, options = {}) => {
  const {
    maxAttempts = CONFIG.retry.maxAttempts,
    baseDelayMs  = CONFIG.retry.baseDelayMs,
    maxDelayMs   = CONFIG.retry.maxDelayMs,
    onRetry,
  } = options;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isPermanent =
        err.message?.includes('API_KEY') ||
        err.message?.includes('401')     ||
        err.message?.includes('400')     ||
        err.message?.includes('invalid_api_key');

      if (attempt === maxAttempts || isPermanent) throw err;

      const delay  = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      const jitter = Math.random() * 0.25 * delay;
      onRetry?.({ attempt, maxAttempts, delay: delay + jitter, error: err });
      await sleep(delay + jitter);
    }
  }
};

/**
 * Extrae JSON válido de una respuesta de texto (soporta markdown code blocks).
 */
const parseJSON = (raw) => {
  const stripped = raw
    .replace(/^```json\s*/m, '')
    .replace(/^```\s*/m, '')
    .replace(/```\s*$/m, '')
    .trim();

  // Intentar parsear directamente
  try { return JSON.parse(stripped); } catch { /* continuar */ }

  // Extraer el bloque JSON más grande
  const match = stripped.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);

  throw new Error(`No se encontró JSON válido en la respuesta.\nPrimeros 300 chars: ${raw.slice(0, 300)}`);
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 4: CLIENTE API UNIVERSAL (Anthropic + Gemini)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Llama a la API de Anthropic Claude.
 * @param {string} systemPrompt - Instrucciones del sistema (rol del agente)
 * @param {string} userPrompt   - Mensaje del usuario (datos del proyecto)
 * @param {string} apiKey       - API key de Anthropic
 * @param {Object} opts         - { temperature, maxTokens }
 */
const callAnthropic = async (systemPrompt, userPrompt, apiKey, opts = {}) => {
  const { temperature = 0.08, maxTokens = CONFIG.anthropic.maxTokensAgentes } = opts;

  const res = await fetch(CONFIG.anthropic.url, {
    method:  'POST',
    headers: {
      'Content-Type':    'application/json',
      'x-api-key':       apiKey,
      'anthropic-version': CONFIG.anthropic.version,
    },
    body: JSON.stringify({
      model:      CONFIG.anthropic.model,
      max_tokens: maxTokens,
      temperature,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      `Anthropic ${res.status}: ${body?.error?.message ?? res.statusText}`
    );
  }

  const data = await res.json();
  return parseJSON(data.content?.[0]?.text ?? '');
};

/**
 * Llama a la API de Google Gemini (alternativa).
 * @param {string} prompt  - Prompt combinado (sistema + usuario)
 * @param {string} apiKey  - API key de Google Generative AI
 */
const callGemini = async (prompt, apiKey) => {
  const res = await fetch(CONFIG.gemini.url(apiKey.trim()), {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.1 },
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(`Gemini ${res.status}: ${body?.error?.message ?? res.statusText}`);
  }

  const data = await res.json();
  return parseJSON(data.candidates?.[0]?.content?.parts?.[0]?.text ?? '');
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 5: ENRIQUECIMIENTO DEL CONTEXTO DEL PROYECTO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transforma los datos crudos del proyecto en un contexto enriquecido con
 * métricas derivadas, detección de tipo de obra y áreas calculadas.
 */
const enriquecerContexto = (datos) => {
  const { partidas = [], m2 = 0, cliente = 'No especificado', ubicacion = 'Santiago (Z3)' } = datos;

  // ── Detección de tipo de obra ─────────────────────────────────────────
  const tiene = (keywords) =>
    partidas.some((p) => keywords.some((kw) => p.nombre?.toLowerCase().includes(kw) || p.id?.includes(kw)));

  const tipoObra = {
    estructura:    tiene(['pilar', 'viga', 'cercha', 'fundac', 'poyo', '_B', '_C', '_D', '_E', '_F']),
    cubierta:      tiene(['cubierta', 'zinc', 'teja', 'polica', 'memb', '_H']),
    electricidad:  tiene(['eléctri', 'foco', 'enchufe', 'tablero', 'cctv', '_K']),
    gas:           tiene(['gas', 'calefont', 'caldero', 'calefac']),
    sanitaria:     tiene(['agua', 'tuber', 'sanitari', 'wc', 'baño', 'desagüe', 'ppr', 'pex']),
    aislacion:     tiene(['aisla', 'lana', 'poliuret', 'thermal', 'membrana']),
    cielo:         tiene(['cielo', 'machih', 'volcanit', 'pvc', '_J']),
    demolicion:    tiene(['retiro', 'demolic', 'desarme', '_B0']),
  };

  // ── Métricas financieras ──────────────────────────────────────────────
  const metricas = partidas.reduce(
    (acc, p) => ({
      totalUF:  acc.totalUF  + (p.totalUF  ?? (p.ufRef ?? 0) * (p.qty ?? 1)),
      totalMO:  acc.totalMO  + (p.totalMO  ?? 0),
      totalMat: acc.totalMat + (p.totalMat ?? 0),
    }),
    { totalUF: 0, totalMO: 0, totalMat: 0 }
  );

  // ── Estimaciones de áreas ─────────────────────────────────────────────
  const perim = Math.sqrt(m2) * 4 * 0.9; // perímetro aproximado
  const areas = {
    piso:        m2,
    techo:       +(m2 * 1.25).toFixed(1),   // factor pendiente
    muros_ext:   +(perim * 2.4).toFixed(1), // perímetro × altura estándar
    muros_int:   +(m2 * 0.7).toFixed(1),    // tabiques internos estimados
    perimetro_ml: +perim.toFixed(1),
  };

  return {
    ...datos,
    cliente,
    ubicacion,
    tipoObra,
    metricas: { ...metricas, cantidadPartidas: partidas.length },
    areas,
    resumenPartidas: partidas.map((p) => ({
      nombre: p.nombre,
      qty:    p.qty    ?? 1,
      unidad: p.unidad ?? 'ud',
      ufRef:  +(p.totalUF ?? (p.ufRef ?? 0) * (p.qty ?? 1)).toFixed(3),
      variante: p.varianteLabel ?? p.spec ?? '',
    })),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 6: LOS 5 AGENTES ESPECIALIZADOS
// ─────────────────────────────────────────────────────────────────────────────

// ╔══════════════════════════════════╗
// ║  AGENTE 1 — ING. ESTRUCTURAL    ║
// ╚══════════════════════════════════╝
const agentEstructural = (ctx, apiKey) => {
  const system = `Eres el INGENIERO CIVIL ESTRUCTURAL SENIOR de HV Construcción Chile.
25 años de experiencia. Registro vigente en el Colegio de Ingenieros de Chile.
Especialidad: estructuras de madera, acero liviano y hormigón armado residencial.

${NORMAS_CHILE}

PROTOCOLO OBLIGATORIO:
1. Asumir Zona Sísmica 3 (0.40g) salvo que se indique otra ubicación.
2. Verificar CADA elemento contra su norma respectiva.
3. Marcar como CRÍTICO cualquier elemento que comprometa vidas.
4. Generar recomendación de "requiere cálculo de ingeniero" si la estructura
   supera alcance de inspección visual o supera cargas residenciales típicas.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO PARA ANÁLISIS ESTRUCTURAL:
Cliente: ${ctx.cliente} | Ubicación: ${ctx.ubicacion} | Superficie: ${ctx.m2} m²
Presupuesto total: ${ctx.metricas.totalUF.toFixed(2)} UF

PARTIDAS SELECCIONADAS:
${ctx.resumenPartidas.map((p) => `  • ${p.qty}× ${p.nombre}${p.variante ? ` [${p.variante}]` : ''} (${p.unidad})`).join('\n')}

ÁREAS ESTIMADAS:
  Piso: ${ctx.areas.piso} m² | Techo: ${ctx.areas.techo} m²
  Muros ext: ${ctx.areas.muros_ext} m² | Muros int: ${ctx.areas.muros_int} m²

GENERA ESTE JSON EXACTO:
{
  "sistema_estructural": "descripción del sistema detectado",
  "zona_sismica": "Z3 (0.40g) Santiago — ajustar si se provee ubicación",
  "normas_aplicables": ["NCh 433", "NCh 1198", "etc."],
  "cargas_de_diseno": {
    "carga_propia_cubierta_kgm2": 0,
    "carga_viva_uso_kgm2": 0,
    "carga_viento_kgm2": 0,
    "comentario_sismico": "descripción carga sísmica NCh 433"
  },
  "verificacion_elementos": [
    {
      "elemento": "nombre específico del elemento",
      "seccion_o_dimension": "especificación",
      "estado": "OK | ALERTA | CRÍTICO",
      "observacion_tecnica": "análisis detallado",
      "norma_de_referencia": "NCh xxx Art. x.x"
    }
  ],
  "conexiones_criticas": [
    {
      "union": "descripción de qué se une con qué",
      "tipo_conector_requerido": "nombre específico del conector",
      "especificacion": "dimensiones, material, cantidad",
      "marca_referencia": "Simpson Strong-Tie / MiTek / etc.",
      "normativa": "NCh 1198 + referencia"
    }
  ],
  "fundaciones": {
    "evaluacion": "comentario sobre las fundaciones del proyecto",
    "tipo_recomendado": "especificación de la fundación correcta",
    "dimension_minima": "ej: poyo 40x40x60cm H20"
  },
  "requiere_calculo_ingeniero": false,
  "justificacion_calculo": "razón técnica de la respuesta anterior",
  "alertas_estructurales": [
    { "nivel": "CRÍTICO | ALTO | MEDIO", "mensaje": "descripción", "accion": "qué hacer" }
  ],
  "recomendaciones": ["recomendación 1", "recomendación 2"]
}`;

  return withRetry(() => callAnthropic(system, user, apiKey, { temperature: 0.05 }));
};

// ╔══════════════════════════════════╗
// ║  AGENTE 2 — ARQUITECTO          ║
// ╚══════════════════════════════════╝
const agentArquitectonico = (ctx, apiKey) => {
  const system = `Eres la ARQUITECTA SENIOR de HV Construcción Chile.
Titulada Universidad de Chile. 18 años de experiencia en proyectos residenciales y comerciales livianos.
Especialidad: análisis de habitabilidad, iluminación natural, ventilación, flujo espacial, cumplimiento OGUC y permisos municipales.

${NORMAS_CHILE}

ENFOQUE: Detectar si el proyecto es coherente como espacio. Identificar problemas de
habitabilidad. Señalar permisos requeridos según el alcance de las obras.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO PARA ANÁLISIS ARQUITECTÓNICO:
${ctx.m2}m² | ${ctx.ubicacion}
Tipo de obra detectado: ${JSON.stringify(ctx.tipoObra)}

Partidas: ${ctx.resumenPartidas.map((p) => `${p.qty}× ${p.nombre}`).join('; ')}

GENERA ESTE JSON EXACTO:
{
  "tipo_espacio_detectado": "cobertizo / quincho / ampliación / etc.",
  "coherencia_espacial": {
    "evaluacion": "Buena | Regular | Mejorable",
    "observaciones": ["obs 1", "obs 2"]
  },
  "iluminacion_natural": {
    "estimacion": "Suficiente | Insuficiente | Verificar",
    "aperturas_recomendadas_m2": 0,
    "recomendaciones": ["rec 1"]
  },
  "ventilacion": {
    "evaluacion": "Adecuada | Requiere mejora | Insuficiente",
    "renovaciones_hora_requeridas": 0,
    "soluciones": ["sol 1"]
  },
  "cumplimiento_oguc": [
    {
      "articulo": "OGUC Art. x.x",
      "descripcion": "qué exige este artículo",
      "estado": "Cumple | No cumple | Verificar en terreno",
      "accion_requerida": "descripción de lo que hay que hacer"
    }
  ],
  "permisos_requeridos": [
    {
      "permiso": "nombre del permiso",
      "entidad": "DOM | SEC | SEREMI Salud | SMA",
      "obligatorio": true,
      "cuando_tramitar": "antes de iniciar obras | antes de energizar | etc.",
      "documentos_necesarios": ["plano de planta", "memoria cálculo", "etc."],
      "tiempo_tramitacion_estimado": "4-8 semanas",
      "costo_estimado_uf": 0
    }
  ],
  "accesibilidad": {
    "aplica_nch_1914": false,
    "observaciones": "descripción si aplica"
  },
  "eficiencia_energetica": {
    "zona_termica": "Zona X según RT 080/2021",
    "transmitancia_requerida_ufm2k": 0,
    "cumple_con_lo_seleccionado": true,
    "observacion": "descripción"
  },
  "recomendaciones_diseno": ["rec 1", "rec 2"],
  "alertas": [{ "nivel": "ALTO | MEDIO", "mensaje": "" }]
}`;

  return withRetry(() => callAnthropic(system, user, apiKey, { temperature: 0.12 }));
};

// ╔══════════════════════════════════╗
// ║  AGENTE 3 — MAESTRO CONSTRUCTOR ║
// ╚══════════════════════════════════╝
const agentConstructor = (ctx, apiKey) => {
  const system = `Eres el MAESTRO MAYOR JEFE de HV Construcción Chile.
30 años de oficio. Has construido cobertizos, quinchos, segundos pisos, ampliaciones y casa completa.
Conoces el ORDEN EXACTO de las faenas, los tiempos reales en Chile, cuántos trabajadores
se necesitan en cada etapa, y cuáles son los errores que comete un maestro menos experimentado.

${NORMAS_CHILE}

LENGUAJE: Técnico-práctico. Directo. Incluir los trucos del oficio que evitan errores costosos.
Si un error de secuencia puede costar una semana de trabajo, di exactamente cuál es.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO PARA GUÍA DE EJECUCIÓN:
${ctx.m2}m² | ${ctx.ubicacion} | ${ctx.metricas.totalUF.toFixed(1)} UF

PARTIDAS (en el orden en que el cliente las seleccionó):
${ctx.resumenPartidas.map((p, i) => `  ${i + 1}. ${p.qty}× ${p.nombre} — ${p.unidad}`).join('\n')}

GENERA ESTE JSON EXACTO:
{
  "secuencia_faenas": [
    {
      "orden": 1,
      "faena": "nombre corto (ej: Demolición techo existente)",
      "descripcion_completa": "qué se hace exactamente, cómo y con qué",
      "partidas_que_ejecuta": ["nombre partida 1"],
      "duracion_dias_habiles": 1,
      "trabajadores_necesarios": { "maestros": 1, "ayudantes": 1, "especialistas": "" },
      "condicion_de_inicio": "qué debe estar 100% listo antes de empezar esto",
      "validacion_antes_de_avanzar": "qué se verifica y cómo antes de pasar a la siguiente faena",
      "es_punto_de_no_retorno": false,
      "razon_punto_no_retorno": "por qué no se puede deshacer (si aplica)",
      "riesgo_si_se_omite_validacion": "qué pasa si se salta la validación"
    }
  ],
  "ruta_critica_dias_totales": 0,
  "holgura_estimada_dias": 0,
  "hitos": [
    { "dia": 0, "nombre": "Inicio de obra", "descripcion": "" },
    { "dia": 0, "nombre": "Obra sellada a la lluvia", "descripcion": "A partir de aquí se trabaja sin riesgo climático" }
  ],
  "guia_por_especialidad": [
    {
      "especialidad": "Carpintero | Gasfiter | Electricista | Maestro general | etc.",
      "cuando_entra_a_obra": "descripción precisa (ej: Día 3, después de que las vigas estén instaladas)",
      "cuando_sale": "descripción",
      "tareas_en_secuencia": ["tarea 1 con detalle", "tarea 2"],
      "herramientas_imprescindibles": ["herramienta con especificación"],
      "materiales_que_deben_estar_en_sitio": ["material con cantidad aproximada"],
      "errores_frecuentes": [
        {
          "error": "descripción exacta del error (ej: instalar las vigas sin plomada)",
          "frecuencia": "Muy común | Común | Ocasional",
          "consecuencia": "qué pasa exactamente si se comete",
          "costo_del_error": "en UF o días de retraso",
          "como_evitarlo": "procedimiento correcto paso a paso"
        }
      ],
      "checklist_al_terminar": ["ítem verificable 1", "ítem verificable 2"]
    }
  ],
  "logistica_materiales": {
    "pedidos_urgentes": [
      {
        "material": "nombre del material",
        "dias_anticipacion_necesarios": 5,
        "razon": "por qué tarda o por qué hay que pedirlo antes",
        "proveedor_sugerido": "nombre o tipo de proveedor en Chile"
      }
    ],
    "almacenamiento_critico": [
      { "material": "nombre", "condicion": "bajo techo / horizontal / etc.", "razon": "" }
    ],
    "secuencia_llegada_ideal": ["primero llega X", "luego Y", "finalmente Z"]
  },
  "condiciones_que_detienen_la_obra": [
    { "condicion": "lluvia intensa durante hormigonado", "accion": "suspender y cubrir", "retomar": "24h después" }
  ],
  "trucos_del_oficio": [
    { "faena": "en qué faena aplica", "truco": "descripción del truco que ahorra tiempo o evita error" }
  ]
}`;

  return withRetry(() => callAnthropic(system, user, apiKey, { temperature: 0.10 }));
};

// ╔══════════════════════════════════╗
// ║  AGENTE 4 — PREVENCIONISTA      ║
// ╚══════════════════════════════════╝
const agentPrevencionista = (ctx, apiKey) => {
  const system = `Eres el PREVENCIONISTA DE RIESGOS SENIOR de HV Construcción Chile.
Acreditado por la Mutual de Seguridad CChC. 20 años de experiencia en obras residenciales y comerciales livianas.
Conoces a fondo la Ley 16.744, DS 594, DS 40, DS 63 y los protocolos de emergencia en Chile.

${NORMAS_CHILE}

METODOLOGÍA: Jerarquía de controles — Eliminación → Sustitución → Ingeniería → Señalización → EPP.
Todo riesgo "Intolerable" debe tener un plan de contingencia inmediato.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO PARA ANÁLISIS DE RIESGOS:
${ctx.m2}m² | Tipo de obra: ${Object.keys(ctx.tipoObra).filter((k) => ctx.tipoObra[k]).join(', ')}

Partidas: ${ctx.resumenPartidas.slice(0, 12).map((p) => p.nombre).join(' | ')}

GENERA ESTE JSON EXACTO:
{
  "nivel_riesgo_general_proyecto": "Bajo | Medio | Alto | Muy Alto",
  "justificacion": "por qué ese nivel de riesgo",
  "matriz_riesgos": [
    {
      "id": "R001",
      "riesgo": "descripción específica del riesgo",
      "actividad": "faena donde puede ocurrir",
      "probabilidad": "Alta | Media | Baja",
      "severidad": "Crítica | Alta | Media | Baja",
      "nivel": "Intolerable | Importante | Moderado | Aceptable",
      "controles": {
        "eliminacion": "cómo eliminar el riesgo en origen (si aplica, sino null)",
        "sustitucion": "con qué se puede reemplazar el agente peligroso (si aplica)",
        "ingenieria": "barandas, apuntalamientos, encofrados, protecciones físicas",
        "senalizacion": "carteles, demarcaciones, colores de seguridad",
        "epp": "equipo específico: marca, norma, para quién"
      },
      "normativa": "artículo específico aplicable"
    }
  ],
  "epp_obligatorio": [
    {
      "item": "nombre del EPP",
      "norma_certificacion": "NCh / ANSI / EN",
      "especificacion_minima": "descripción técnica",
      "para_quien": "todos | carpinteros | electricistas | etc.",
      "en_que_faenas": ["faena 1"]
    }
  ],
  "instalaciones_de_faena": [
    {
      "instalacion": "nombre",
      "descripcion": "qué debe tener mínimamente",
      "obligatorio": true,
      "norma": "DS 594 Art. X"
    }
  ],
  "capacitaciones_pre_inicio": [
    {
      "tema": "nombre de la capacitación",
      "duracion_horas": 1,
      "para_quien": "todos los trabajadores | solo especialistas",
      "antes_de_que_faena": "nombre de la faena",
      "quien_la_imparte": "Mutual de Seguridad | Empresa | Especialista"
    }
  ],
  "procedimientos_emergencia": [
    {
      "tipo": "Caída en altura | Electrocución | Corte profundo | Incendio",
      "pasos_inmediatos": ["paso 1", "paso 2", "paso 3"],
      "numeros_de_emergencia": {
        "SAMU": "131",
        "Bomberos": "132",
        "Carabineros": "133",
        "Mutual_de_Seguridad": "600 423 5000"
      }
    }
  ],
  "alerta_critica": "mensaje de alerta si hay riesgo crítico que debe atenderse ANTES de iniciar, null si no hay"
}`;

  return withRetry(() => callAnthropic(system, user, apiKey, { temperature: 0.05 }));
};

// ╔══════════════════════════════════╗
// ║  AGENTE 5 — GESTOR DE COSTOS    ║
// ╚══════════════════════════════════╝
const agentCostos = (ctx, apiKey) => {
  const system = `Eres la GESTORA DE COSTOS Y ABASTECIMIENTO SENIOR de HV Construcción Chile.
15 años de experiencia en gestión de presupuestos de construcción residencial.
Conoces los precios actuales del mercado chileno: Sodimac, Easy, Chilemat, Volvo, distribuidoras mayoristas.
Mantienes relaciones con proveedores que permiten identificar alternativas de calidad a mejor precio.

UF = $${UF_VALOR} CLP.

MISIÓN:
1. Validar si el presupuesto es coherente con el mercado chileno actual.
2. Calcular cantidades exactas de cada material, CON factores de merma realistas.
3. Identificar dónde se puede optimizar y dónde NO se debe escatimar.
4. Señalar materiales con tiempos de entrega largos que hay que pedir hoy.

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO PARA ANÁLISIS DE COSTOS Y MATERIALES:
${ctx.m2}m² | Total presupuestado: ${ctx.metricas.totalUF.toFixed(2)} UF
($${(ctx.metricas.totalUF * UF_VALOR).toLocaleString('es-CL')} CLP)

PARTIDAS CON PRECIOS:
${ctx.resumenPartidas.map((p) => `  • ${p.qty}× ${p.nombre} [${p.unidad}] → ${p.ufRef.toFixed(2)} UF`).join('\n')}

GENERA ESTE JSON EXACTO:
{
  "validacion_presupuesto": {
    "estado": "Coherente | Subestimado | Sobreestimado",
    "rango_mercado_uf_m2": { "min": 0, "max": 0 },
    "observacion": "análisis técnico del presupuesto vs. lo que cuesta esto en Chile hoy",
    "porcentaje_desvio": "ej: +15% sobre mercado o -10% bajo mercado"
  },
  "cantidades_materiales": [
    {
      "material": "nombre exacto del material",
      "partida": "nombre de la partida que lo genera",
      "unidad": "m² | ml | kg | ud | saco",
      "cantidad_neta": 0,
      "factor_merma_pct": 10,
      "cantidad_a_comprar": 0,
      "precio_unitario_clp_estimado": 0,
      "subtotal_clp": 0,
      "marca_primera_opcion": "marca específica disponible en Chile",
      "marca_alternativa": "segunda marca con precio diferente",
      "donde_comprar_chile": "Sodimac | Easy | Chilemat | Distribuidora | Ferretería industrial",
      "tiempo_entrega_dias": 1,
      "hay_que_pedirlo_hoy": false,
      "razon_urgencia": "por qué hay que pedirlo con anticipación (si aplica)"
    }
  ],
  "contingencia": {
    "porcentaje_recomendado": 15,
    "justificacion": "por qué ese porcentaje para este proyecto específico",
    "monto_uf": 0
  },
  "oportunidades_de_ahorro": [
    {
      "partida": "nombre",
      "ahorro_potencial_uf": 0,
      "alternativa_propuesta": "qué se puede cambiar",
      "impacto_en_calidad": "ninguno | menor | moderado | alto",
      "recomendacion_hv": "Sí aplicar | No aplicar | Consultar con cliente"
    }
  ],
  "no_escatimar_jamas": [
    {
      "item": "nombre del elemento",
      "razon_tecnica": "por qué NO se puede bajar la calidad aquí",
      "consecuencia_a_5_anos": "qué problema aparece si se usa material de menor calidad"
    }
  ],
  "flete_y_logistica": {
    "estimado_uf": 0,
    "optimizacion": "cómo reducir el costo de flete"
  },
  "resumen_financiero": {
    "materiales_uf":    0,
    "mano_obra_uf":     0,
    "flete_uf":         0,
    "contingencia_uf":  0,
    "total_cliente_uf": 0,
    "total_cliente_clp": 0,
    "para_colaboradores_uf": 0,
    "retencion_hv_uf": 0
  }
}`;

  return withRetry(() => callAnthropic(system, user, apiKey, { temperature: 0.08 }));
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 7: SINTETIZADOR MASTER — JEFE DE PROYECTO
// ─────────────────────────────────────────────────────────────────────────────

const agentSintetizador = (ctx, reportes, apiKey) => {
  const system = `Eres el JEFE DE PROYECTO SENIOR de HV Construcción Chile.
Tu trabajo es integrar los reportes de 5 expertos en un único EXPEDIENTE TÉCNICO EJECUTIVO.

REGLAS DE SÍNTESIS:
1. Si hay contradicción entre dos agentes → usar el criterio más conservador (más seguro).
2. Las alertas CRÍTICAS van SIEMPRE al inicio, no enterradas en el cuerpo.
3. El resumen para el cliente es en lenguaje normal. El de los maestros es técnico.
4. El cronograma integra los tiempos de TODOS los agentes, con dependencias correctas.
5. Si un agente falló (tiene campo _error: true) → marcar esa sección como "Requiere revisión".

${NORMAS_CHILE}

RESPONDE ÚNICAMENTE con un objeto JSON válido. Sin texto previo, sin backticks.`;

  const user = `PROYECTO MASTER:
Cliente: ${ctx.cliente} | Superficie: ${ctx.m2}m² | Ubicación: ${ctx.ubicacion}
Presupuesto: ${ctx.metricas.totalUF.toFixed(2)} UF ($${(ctx.metricas.totalUF * UF_VALOR).toLocaleString('es-CL')} CLP)
Partidas: ${ctx.metricas.cantidadPartidas} ítems seleccionados

═══ REPORTE INGENIERO ESTRUCTURAL ═══
${JSON.stringify(reportes.estructural ?? { _error: true })}

═══ REPORTE ARQUITECTO ═══
${JSON.stringify(reportes.arquitectonico ?? { _error: true })}

═══ REPORTE MAESTRO CONSTRUCTOR ═══
${JSON.stringify(reportes.constructor ?? { _error: true })}

═══ REPORTE PREVENCIONISTA ═══
${JSON.stringify(reportes.prevencionista ?? { _error: true })}

═══ REPORTE GESTOR DE COSTOS ═══
${JSON.stringify(reportes.costos ?? { _error: true })}

GENERA EL EXPEDIENTE MASTER EN ESTE JSON EXACTO:
{
  "titulo_proyecto": "descripción concisa del proyecto",
  "alertas_criticas": [
    {
      "nivel": "CRÍTICO | ALTO | MEDIO",
      "origen": "Estructural | Arquitectónico | Seguridad | Costos | Legal",
      "mensaje": "descripción clara del problema",
      "accion_inmediata": "qué hay que hacer HOY antes de avanzar"
    }
  ],
  "resumen_ejecutivo": {
    "para_el_cliente": "3 párrafos en lenguaje normal: qué se hará, en cuánto tiempo, qué se incluye y qué esperar del proceso",
    "para_los_maestros": "resumen técnico-práctico: sistema constructivo, secuencia, puntos críticos, materiales clave",
    "alcance_incluye": ["ítem 1", "ítem 2"],
    "alcance_no_incluye": ["ítem que el cliente podría asumir que está pero no está"],
    "puntos_no_negociables": ["elemento que no se puede modificar sin comprometer la obra"]
  },
  "cronograma_integrado": [
    {
      "semana": 1,
      "dia_inicio": 1,
      "dia_fin": 5,
      "faenas_paralelas": ["faena 1", "faena 2"],
      "faenas_secuenciales": ["faena 3 espera a faena 1"],
      "hito": "qué debe estar 100% terminado al cerrar esta semana",
      "trabajadores_total": 2,
      "materiales_que_deben_llegar_esta_semana": ["material 1"],
      "es_punto_de_no_retorno": false,
      "descripcion_punto_no_retorno": "si aplica: qué queda sellado esta semana"
    }
  ],
  "duracion_total": {
    "dias_habiles": 0,
    "semanas_calendario": 0,
    "con_imprevistos_clima_dias_extra": 0,
    "fecha_inicio_recomendada": "descripción (ej: lunes después de tramitar permiso DOM)"
  },
  "checklist_pre_obra": [
    {
      "item": "descripción clara de la tarea",
      "categoria": "Legal | Técnico | Logística | Seguridad | Cliente",
      "responsable": "HV | Cliente | Especialista SEC | Arquitecto",
      "plazo": "X días antes de iniciar",
      "obligatorio": true,
      "consecuencia_si_se_omite": "qué pasa si no se hace"
    }
  ],
  "checkpoints_calidad": [
    {
      "numero": 1,
      "momento": "Antes de tapar X / Al terminar Y / Antes de energizar",
      "que_validar": "descripción técnica precisa de qué se verifica",
      "como_medirlo": "instrumento o método (ej: nivel laser, manómetro, detector fugas)",
      "tolerancia_maxima_aceptable": "valor numérico o descripción",
      "quien_debe_estar_presente": "Jefe HV | Electricista SEC | Gasfiter SEC | Ambos",
      "quien_firma_el_ok": "cargo específico",
      "consecuencia_si_no_pasa": "qué se debe hacer si el checkpoint falla"
    }
  ],
  "guia_ejecucion_maestros": [
    {
      "etapa": "nombre de la etapa",
      "dia_inicio_estimado": 1,
      "duracion_dias": 1,
      "perfil_maestro": "Maestro general | Gasfiter | Electricista Clase A/B | Herrero",
      "herramientas_imprescindibles": ["herramienta específica con especificación"],
      "materiales_en_sitio_antes_de_comenzar": ["material con cantidad estimada"],
      "procedimiento_paso_a_paso": [
        { "paso": 1, "accion": "descripción detallada de la acción", "duracion_estimada": "X horas", "verificacion": "cómo saber que quedó bien hecho" }
      ],
      "errores_criticos_a_evitar": [
        { "error": "descripción exacta del error", "costo_si_ocurre": "en UF o días", "como_prevenirlo": "procedimiento correcto" }
      ],
      "entrega_de_etapa": "descripción de cómo queda el espacio al terminar esta etapa"
    }
  ],
  "normativas_y_permisos": {
    "permisos": [
      {
        "nombre": "Permiso de Edificación DOM",
        "entidad": "DOM Municipal",
        "obligatorio": true,
        "cuando_tramitar": "antes de iniciar cualquier trabajo",
        "documentos": ["Plano de planta", "Memoria descriptiva", "Formulario DOM"],
        "tiempo_estimado_semanas": 6,
        "costo_estimado_uf": 1.5
      }
    ],
    "certificaciones_al_terminar": [
      {
        "nombre": "TE1 Instalación Eléctrica",
        "quien_emite": "Instalador SEC Clase A",
        "cuando": "antes de la recepción final",
        "es_obligatorio_para": "recepción DOM y venta del inmueble"
      }
    ]
  },
  "seguridad_resumen": {
    "nivel_riesgo_proyecto": "Bajo | Medio | Alto | Muy Alto",
    "epp_minimo_obligatorio_todos": ["casco blanco", "zapatos punta acero", "guantes"],
    "riesgos_criticos_top3": [
      { "riesgo": "", "medida_principal": "", "epp_especifico": "" }
    ],
    "alerta_critica_seguridad": "mensaje o null"
  },
  "presupuesto_validado": {
    "total_partidas_uf": 0,
    "contingencia_recomendada_uf": 0,
    "total_con_contingencia_uf": 0,
    "total_con_contingencia_clp": 0,
    "desglose_por_fase": [
      { "fase": "nombre", "porcentaje": 0, "uf": 0 }
    ],
    "para_colaboradores_70pct_mo_uf": 0,
    "retencion_hv_uf": 0,
    "alertas_presupuesto": ["alerta 1"]
  },
  "materiales_pedir_hoy": [
    {
      "material": "nombre específico",
      "cantidad": "X unidades / m² / kg",
      "tiempo_entrega_dias": 5,
      "proveedor_chile": "Sodimac | Easy | Chilemat | Distribuidora específica",
      "urgencia": "INMEDIATO | ESTA_SEMANA | ANTES_DE_INICIO",
      "razon": "por qué hay que pedirlo con anticipación"
    }
  ],
  "optimizaciones_recomendadas": [
    {
      "sugerencia": "descripción clara de la optimización",
      "ahorro_estimado_uf": 0,
      "impacto_en_calidad_o_durabilidad": "Ninguno | Leve | Moderado | Alto",
      "recomendacion": "Aplicar | No aplicar | Solo si el presupuesto es ajustado"
    }
  ],
  "mantencion_preventiva": {
    "al_mes_de_entrega": ["acción 1", "acción 2"],
    "semestral": ["acción 1"],
    "anual": ["acción 1"],
    "cada_5_anos": ["acción 1"],
    "senales_de_alerta_temprana": [
      { "senal": "qué ver / escuchar / oler", "que_significa": "descripción", "accion_al_verla": "qué hacer" }
    ]
  },
  "documentos_a_entregar_al_cliente": [
    { "documento": "nombre", "quien_lo_genera": "HV | Instalador SEC | Arquitecto", "cuando": "al terminar la obra | antes de recepción" }
  ],
  "garantia_hv": {
    "mano_obra_anos": 1,
    "que_cubre": "defectos de instalación, filtraciones en juntas ejecutadas, fallas en conexiones",
    "que_no_cubre": "daños por uso inadecuado, sismos, accidentes externos",
    "como_hacer_efectiva": "contactar a HV Construcción con fotos del defecto"
  }
}`;

  return withRetry(
    () => callAnthropic(system, user, apiKey, {
      temperature: 0.05,
      maxTokens: CONFIG.anthropic.maxTokensSintetizador,
    }),
    { maxAttempts: 3 }
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 8: ORQUESTADOR PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera un expediente técnico ejecutivo completo usando 5 agentes IA en paralelo
 * más un agente sintetizador que integra todos los reportes.
 *
 * @param {Object}   datosProyecto              Datos del proyecto
 * @param {Object[]} datosProyecto.partidas      Array de partidas seleccionadas
 * @param {number}   datosProyecto.m2            Superficie del proyecto en m²
 * @param {string}   [datosProyecto.cliente]     Nombre del cliente
 * @param {string}   [datosProyecto.ubicacion]   Ciudad o región
 * @param {string}   apiKey                      API key de Anthropic
 * @param {Function} [onProgress]               Callback (paso, total, descripcion) => void
 * @param {Object}   [options]
 * @param {boolean}  [options.modoRapido=false]  Si true: 1 llamada en vez de 6 (menos detallado)
 * @param {boolean}  [options.incluirReportes=false] Si true: incluye reportes individuales en respuesta
 * @returns {Promise<Object>} Expediente técnico completo
 */
export const generarExpedientePremium = async (
  datosProyecto,
  apiKey,
  onProgress = () => {},
  options = {}
) => {
  const { modoRapido = false, incluirReportes = false } = options;
  const TOTAL = modoRapido ? 3 : 8;
  const prog = (paso, desc) => onProgress(paso, TOTAL, desc);

  // ── Paso 1: Enriquecer contexto ──────────────────────────────────────────
  prog(1, '🔍 Analizando partidas y tipo de obra...');
  const ctx = enriquecerContexto(datosProyecto);

  // ── Modo rápido: un solo agente sintetizador ─────────────────────────────
  if (modoRapido) {
    prog(2, '⚡ Generando expediente en modo rápido...');
    const expediente = await agentSintetizador(ctx, {}, apiKey);
    prog(3, '✅ Expediente generado');
    return { ...expediente, _meta: { modo: 'rapido', timestamp: new Date().toISOString() } };
  }

  // ── Pasos 2–5: 5 agentes en paralelo ────────────────────────────────────
  prog(2, '🏗️ Convocando equipo de 5 expertos en paralelo...');

  const AGENTES = [
    { clave: 'estructural',   nombre: 'Ingeniero Estructural',  emoji: '⚙️', fn: agentEstructural  },
    { clave: 'arquitectonico',nombre: 'Arquitecto',              emoji: '📐', fn: agentArquitectonico },
    { clave: 'constructor',   nombre: 'Maestro Constructor',     emoji: '🔨', fn: agentConstructor  },
    { clave: 'prevencionista',nombre: 'Prevencionista de Riesgos',emoji: '⛑️', fn: agentPrevencionista },
    { clave: 'costos',        nombre: 'Gestor de Costos',        emoji: '💰', fn: agentCostos       },
  ];

  prog(3, `${AGENTES.map((a) => a.emoji).join('')} Ejecutando análisis especializados...`);

  const resultados = await Promise.allSettled(
    AGENTES.map((a) => a.fn(ctx, apiKey))
  );

  // Mapear resultados con fallbacks seguros
  const reportes = {};
  const exitosos = [];
  const fallidos = [];

  AGENTES.forEach((agente, i) => {
    const r = resultados[i];
    if (r.status === 'fulfilled') {
      reportes[agente.clave] = r.value;
      exitosos.push(agente.nombre);
    } else {
      console.warn(`[HV] Agente "${agente.nombre}" falló:`, r.reason?.message);
      reportes[agente.clave] = { _error: true, _mensaje: r.reason?.message ?? 'Error desconocido' };
      fallidos.push(agente.nombre);
    }
  });

  prog(6, `📊 ${exitosos.length}/5 expertos completados${fallidos.length ? ` (${fallidos.join(', ')} con error)` : ''}. Sintetizando...`);

  // ── Paso 6: Sintetizador Master ──────────────────────────────────────────
  prog(7, '📋 Jefe de proyecto integrando todos los reportes...');

  const expedienteMaster = await withRetry(
    () => agentSintetizador(ctx, reportes, apiKey),
    {
      maxAttempts: 3,
      onRetry: ({ attempt }) => prog(7, `🔄 Reintentando síntesis (intento ${attempt}/3)...`),
    }
  );

  prog(8, '✅ Expediente técnico premium completado');

  // ── Respuesta final ──────────────────────────────────────────────────────
  const resultado = {
    ...expedienteMaster,
    _meta: {
      version:            '3.0.0',
      modo:               'multi_agente',
      agentes_exitosos:   exitosos,
      agentes_con_error:  fallidos,
      confianza:          `${Math.round((exitosos.length / AGENTES.length) * 100)}%`,
      proyecto_m2:        ctx.m2,
      total_partidas:     ctx.metricas.cantidadPartidas,
      presupuesto_uf:     ctx.metricas.totalUF,
      timestamp:          new Date().toISOString(),
    },
  };

  if (incluirReportes) resultado._reportes_especializados = reportes;

  return resultado;
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 9: FUNCIONES AUXILIARES EXPORTADAS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Genera solo el análisis estructural.
 * Útil para validación rápida antes de cerrar un presupuesto.
 */
export const validarEstructura = async (datosProyecto, apiKey) => {
  const ctx = enriquecerContexto(datosProyecto);
  return agentEstructural(ctx, apiKey);
};

/**
 * Genera solo la guía de ejecución para los maestros.
 * Sin análisis estructural ni permisos.
 */
export const generarGuiaMaestros = async (datosProyecto, apiKey, onProgress = () => {}) => {
  onProgress(1, 3, 'Analizando partidas...');
  const ctx = enriquecerContexto(datosProyecto);
  onProgress(2, 3, 'Generando guía de ejecución...');
  const guia = await agentConstructor(ctx, apiKey);
  onProgress(3, 3, '✅ Guía completada');
  return guia;
};

/**
 * Valida el presupuesto contra el mercado chileno y calcula cantidades con merma.
 */
export const validarPresupuesto = async (datosProyecto, apiKey) => {
  const ctx = enriquecerContexto(datosProyecto);
  return agentCostos(ctx, apiKey);
};

/**
 * Calcula cantidades de materiales con factores de merma SIN llamar a la IA.
 * Útil como fallback cuando no hay API key o para estimaciones rápidas.
 */
export const calcularCantidadesMateriales = (datosProyecto) =>
  datosProyecto.partidas.map((p) => {
    const unidad       = p.unidad ?? 'ud';
    const factorMerma  = MERMA[unidad] ?? 1.10;
    const cantidadNeta = p.qty ?? 1;
    return {
      nombre:             p.nombre,
      unidad,
      cantidad_neta:      cantidadNeta,
      factor_merma_pct:   Math.round((factorMerma - 1) * 100),
      cantidad_a_comprar: Math.ceil(cantidadNeta * factorMerma),
      contingencia_5pct:  Math.ceil(cantidadNeta * factorMerma * 0.05),
    };
  });

/**
 * Genera el texto del expediente adaptado para Gemini (proveedor alternativo).
 * Útil como fallback si la API de Anthropic no está disponible.
 */
export const generarExpedienteConGemini = async (datosProyecto, geminiApiKey, onProgress = () => {}) => {
  onProgress(1, 3, '🔍 Preparando contexto...');
  const ctx = enriquecerContexto(datosProyecto);

  const prompt = `
Eres el Jefe de Proyecto de HV Construcción Chile (empresa de construcción residencial).
${NORMAS_CHILE}

PROYECTO:
Cliente: ${ctx.cliente} | ${ctx.m2}m² | ${ctx.metricas.totalUF.toFixed(2)} UF
Partidas: ${ctx.resumenPartidas.map((p) => `${p.qty}× ${p.nombre}`).join('; ')}

Genera un EXPEDIENTE TÉCNICO EJECUTIVO como objeto JSON con los campos:
titulo_proyecto, alertas_criticas[], resumen_ejecutivo{para_el_cliente, para_los_maestros},
cronograma_integrado[], checklist_pre_obra[], checkpoints_calidad[],
guia_ejecucion_maestros[], normativas_y_permisos{permisos[], certificaciones_al_terminar[]},
presupuesto_validado{total_uf, contingencia_uf, total_con_contingencia_uf},
mantencion_preventiva{semestral[], anual[], señales_alerta_temprana[]}.

DEVUELVE SOLO JSON VÁLIDO SIN TEXTO ADICIONAL NI BACKTICKS.`;

  onProgress(2, 3, '🤖 Generando expediente con Gemini...');
  const resultado = await withRetry(() => callGemini(prompt, geminiApiKey));
  onProgress(3, 3, '✅ Expediente generado');

  return {
    ...resultado,
    _meta: { modo: 'gemini_single', timestamp: new Date().toISOString() },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// SECCIÓN 10: CONSTANTES EXPORTADAS (para usar en el frontend)
// ─────────────────────────────────────────────────────────────────────────────

export const PASOS_EXPEDIENTE = [
  { paso: 1, descripcion: '🔍 Analizando partidas del proyecto' },
  { paso: 2, descripcion: '🏗️ Convocando equipo de expertos' },
  { paso: 3, descripcion: '⚙️ Análisis estructural (NCh 433)' },
  { paso: 4, descripcion: '📐 Revisión arquitectónica (OGUC)' },
  { paso: 5, descripcion: '🔨 Guía de ejecución del constructor' },
  { paso: 6, descripcion: '⛑️ Análisis de riesgos (Ley 16.744)' },
  { paso: 7, descripcion: '📋 Integrando reportes — Jefe de Proyecto' },
  { paso: 8, descripcion: '✅ Expediente técnico completado' },
];

export { UF_VALOR, MERMA };