export type StorageSourceId =
  | "spreadsheets"
  | "erp"
  | "billing"
  | "crm"
  | "paper"
  | "other";

export type IntegrationLevelId = "1" | "2" | "3" | "4";

export type UpdateFrequencyId = "realtime" | "weekly" | "monthly" | "eventual";

export type DataConfidenceId = "low" | "medium" | "high";

export type ReportTimeId = "hours_days" | "half_day" | "minutes" | "none";

export type BiToolId = "excel" | "static_pdf" | "bi_tools" | "erp_native" | "none";

export interface TypedOption<T extends string> {
  id: T;
  label: string;
}

export interface DimensionScores {
  "Almacenamiento y Fuentes": number;
  "Integración entre Áreas": number;
  "Frecuencia de Actualización": number;
  "Calidad y Consistencia": number;
  "Eficiencia de Reportes": number;
}

export interface MatrizNivelInfo {
  badge_color: string;
  text_color: string;
  bg_color: string;
  criterio: string;
  solucion: string;
  prioridades_clave: string[];
}

export interface Interview {
  id: number;
  created_at: string;
  updated_at: string;
  entrevistador: string;
  responsable_nombre: string;
  responsable_rol: string;
  empresa: string;
  sector: string;
  sector_otro?: string;
  colaboradores: string;
  almacenamiento_fuentes: string[];
  almacenamiento_fuentes_ids?: StorageSourceId[];
  almacenamiento_otro?: string;
  integracion_nivel: string;
  integracion_nivel_id?: IntegrationLevelId;
  frecuencia_actualizacion: string;
  frecuencia_actualizacion_id?: UpdateFrequencyId;
  confianza_datos: string;
  confianza_datos_id?: DataConfidenceId;
  tiempo_reporte: string;
  tiempo_reporte_id?: ReportTimeId;
  herramienta_visualizacion: string;
  herramienta_visualizacion_id?: BiToolId;
  obstaculos_decision: string[];
  proceso_prioritario: string;
  proceso_prioritario_otro?: string;
  valor_esperado: string;
  observaciones_consultor: string;
  score_global: number;
  nivel_madurez: string;
  dimensiones: DimensionScores;
  estado: "Completada" | "En Seguimiento" | "Archivada";
}

export type InterviewFormData = Omit<
  Interview,
  "id" | "created_at" | "updated_at" | "score_global" | "nivel_madurez" | "dimensiones"
>;

export interface SaveInterviewResult {
  interview: Interview;
  persisted: boolean;
}

export interface DiagnosticResult {
  score_global: number;
  nivel: string;
  criterio: string;
  solucion_recomendada: string;
  badge_color: string;
  text_color: string;
  bg_color: string;
  prioridades_clave: string[];
  dimensiones: DimensionScores;
}

export interface FormDraft {
  interviewer: string;
  intervieweeName: string;
  role: string;
  company: string;
  sector: string;
  sectorOther: string;
  employeeCount: string;
  storageSourceIds: StorageSourceId[];
  storageOther: string;
  integrationLevelId: IntegrationLevelId | "";
  updateFrequencyId: UpdateFrequencyId | "";
  dataConfidenceId: DataConfidenceId | "";
  reportTimeId: ReportTimeId | "";
  currentBiToolId: BiToolId | "";
  decisionObstacles: string[];
  priorityProcess: string;
  priorityOther: string;
  expectedValue: string;
  consultantNotes: string;
  currentStep?: number;
}
