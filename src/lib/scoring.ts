import { MATRIZ_EVALUACION } from "../config/constants";
import {
  BiToolId,
  DataConfidenceId,
  DiagnosticResult,
  DimensionScores,
  IntegrationLevelId,
  ReportTimeId,
  StorageSourceId,
  UpdateFrequencyId
} from "../types";

export function calcularPuntajeAlmacenamiento(
  fuentes: StorageSourceId[],
  otroDetalle?: string
): number {
  if (!fuentes || fuentes.length === 0) {
    return 20.0;
  }

  const set = new Set(fuentes);
  const tienePapel = set.has("paper");
  const tienePlanillas = set.has("spreadsheets");
  const tieneErp = set.has("erp");
  const tieneFacturacion = set.has("billing");
  const tieneCrm = set.has("crm");
  const tieneOtroDigital = set.has("other") && Boolean(otroDetalle?.trim());

  let score = 35.0;

  if (tieneErp && tieneCrm && !tienePapel) {
    score = 95.0;
  } else if (tieneErp && !tienePapel && (tieneFacturacion || tienePlanillas || tieneOtroDigital)) {
    score = 75.0;
  } else if (tieneErp) {
    // Penaliza cuando coexiste papel con ERP
    score = tienePapel ? 60.0 : 70.0;
  } else if (tieneCrm && !tienePapel) {
    score = tieneFacturacion || tieneOtroDigital ? 70.0 : 60.0;
  } else if (tieneFacturacion && !tienePapel) {
    score = tienePlanillas || tieneOtroDigital ? 55.0 : 50.0;
  } else if (tienePlanillas && !tienePapel) {
    score = tieneOtroDigital ? 45.0 : 40.0;
  } else if (tienePapel) {
    score = 20.0;
  } else if (tieneOtroDigital) {
    score = 45.0;
  }

  return Math.min(100.0, Math.max(10.0, score));
}

const INTEGRATION_SCORES: Record<IntegrationLevelId, number> = {
  "1": 25.0,
  "2": 50.0,
  "3": 75.0,
  "4": 100.0
};

export function calcularPuntajeIntegracion(integracion?: IntegrationLevelId): number {
  if (!integracion) return 25.0;
  return INTEGRATION_SCORES[integracion] ?? 50.0;
}

const FREQUENCY_SCORES: Record<UpdateFrequencyId, number> = {
  realtime: 100.0,
  weekly: 75.0,
  monthly: 50.0,
  eventual: 25.0
};

export function calcularPuntajeFrecuencia(frecuencia?: UpdateFrequencyId): number {
  if (!frecuencia) return 25.0;
  return FREQUENCY_SCORES[frecuencia] ?? 40.0;
}

const CONFIDENCE_SCORES: Record<DataConfidenceId, number> = {
  high: 100.0,
  medium: 65.0,
  low: 25.0
};

export function calcularPuntajeCalidad(calidad?: DataConfidenceId): number {
  if (!calidad) return 25.0;
  return CONFIDENCE_SCORES[calidad] ?? 40.0;
}

const REPORT_TIME_SCORES: Record<ReportTimeId, number> = {
  minutes: 100.0,
  half_day: 65.0,
  hours_days: 35.0,
  none: 20.0
};

const BI_TOOL_SCORES: Record<BiToolId, number> = {
  bi_tools: 100.0,
  erp_native: 75.0,
  excel: 50.0,
  static_pdf: 35.0,
  none: 15.0
};

export function calcularPuntajeEficiencia(
  tiempoReporte?: ReportTimeId,
  herramienta?: BiToolId
): number {
  const sTiempo = tiempoReporte ? (REPORT_TIME_SCORES[tiempoReporte] ?? 30.0) : 30.0;
  const sHerr = herramienta ? (BI_TOOL_SCORES[herramienta] ?? 30.0) : 30.0;

  return Math.round(((sTiempo * 0.5) + (sHerr * 0.5)) * 10) / 10;
}

export function evaluarDiagnostico(respuestas: {
  storage_source_ids?: StorageSourceId[];
  storage_other?: string;
  integration_level_id?: IntegrationLevelId;
  update_frequency_id?: UpdateFrequencyId;
  data_confidence_id?: DataConfidenceId;
  report_time_id?: ReportTimeId;
  current_bi_tool_id?: BiToolId;
}): DiagnosticResult {
  const pAlmacenamiento = calcularPuntajeAlmacenamiento(
    respuestas.storage_source_ids || [],
    respuestas.storage_other
  );
  const pIntegracion = calcularPuntajeIntegracion(respuestas.integration_level_id);
  const pFrecuencia = calcularPuntajeFrecuencia(respuestas.update_frequency_id);
  const pCalidad = calcularPuntajeCalidad(respuestas.data_confidence_id);
  const pEficiencia = calcularPuntajeEficiencia(
    respuestas.report_time_id,
    respuestas.current_bi_tool_id
  );

  // Ponderaciones estratégicas:
  // Almacenamiento: 20%, Integración: 25%, Frecuencia: 15%, Calidad: 20%, Eficiencia: 20%
  const scoreGlobal =
    Math.round(
      (pAlmacenamiento * 0.2 +
        pIntegracion * 0.25 +
        pFrecuencia * 0.15 +
        pCalidad * 0.2 +
        pEficiencia * 0.2) *
        10
    ) / 10;

  let nivel: string;
  if (scoreGlobal < 45.0) {
    nivel = "Nivel 1: Inicial / Disperso";
  } else if (scoreGlobal < 75.0) {
    nivel = "Nivel 2: Operativo / Estructurado";
  } else {
    nivel = "Nivel 3: Avanzado / Preparado";
  }

  const infoMatriz =
    MATRIZ_EVALUACION[nivel] || MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];

  const dimensiones: DimensionScores = {
    "Almacenamiento y Fuentes": pAlmacenamiento,
    "Integración entre Áreas": pIntegracion,
    "Frecuencia de Actualización": pFrecuencia,
    "Calidad y Consistencia": pCalidad,
    "Eficiencia de Reportes": pEficiencia
  };

  return {
    score_global: scoreGlobal,
    nivel,
    criterio: infoMatriz.criterio,
    solucion_recomendada: infoMatriz.solucion,
    badge_color: infoMatriz.badge_color,
    text_color: infoMatriz.text_color,
    bg_color: infoMatriz.bg_color,
    prioridades_clave: infoMatriz.prioridades_clave,
    dimensiones
  };
}
