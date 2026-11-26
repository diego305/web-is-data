import {
  FormDraft,
  Interview,
  InterviewFormData,
  SaveInterviewResult
} from "../types";
import { evaluarDiagnostico } from "./scoring";

const STORAGE_KEY = "is_data_solutions_entrevistas_v1";
const DRAFT_STORAGE_KEY = "is_data_solutions_draft_v1";

function buildInterviewFromRaw(
  id: number,
  raw: InterviewFormData,
  createdAt?: string
): Interview {
  const diag = evaluarDiagnostico({
    storage_source_ids: raw.almacenamiento_fuentes_ids,
    storage_other: raw.almacenamiento_otro,
    integration_level_id: raw.integracion_nivel_id,
    update_frequency_id: raw.frecuencia_actualizacion_id,
    data_confidence_id: raw.confianza_datos_id,
    report_time_id: raw.tiempo_reporte_id,
    current_bi_tool_id: raw.herramienta_visualizacion_id
  });

  const now = new Date().toISOString().replace("T", " ").substring(0, 19);

  return {
    ...raw,
    id,
    created_at: createdAt || now,
    updated_at: now,
    score_global: diag.score_global,
    nivel_madurez: diag.nivel,
    dimensiones: diag.dimensiones,
    estado: raw.estado || "Completada"
  };
}

export function getSavedInterviews(): Interview[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInterview(formData: InterviewFormData): SaveInterviewResult {
  const list = getSavedInterviews();
  const nextId =
    list.reduce((max, item) => (typeof item.id === "number" && item.id > max ? item.id : max), 0) + 1;
  const newInterview = buildInterviewFromRaw(nextId, formData);
  const updated = [newInterview, ...list];

  let persisted = true;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("storage_updated"));
  } catch (err) {
    persisted = false;
    console.error("Error saving diagnostic to localStorage:", err);
  }

  return { interview: newInterview, persisted };
}

export function clearStoredDiagnostics(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
    window.dispatchEvent(new Event("storage_updated"));
    return true;
  } catch (err) {
    console.error("Error clearing local diagnostic storage:", err);
    return false;
  }
}

export function loadFormDraft(): Partial<FormDraft> | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Partial<FormDraft>) : null;
  } catch {
    return null;
  }
}

export function saveFormDraft(draft: FormDraft): void {
  try {
    sessionStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Ignore storage quota/privacy mode errors for ephemeral draft
  }
}

export function clearFormDraft(): void {
  try {
    sessionStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}
