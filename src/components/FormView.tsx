import React, { useEffect, useRef, useState } from "react";
import {
  APP_TITLE,
  APP_SUBTITLE,
  APP_DESCRIPTION,
  SECTORES,
  RANGOS_COLABORADORES,
  STORAGE_SOURCE_OPTIONS,
  INTEGRATION_LEVEL_OPTIONS,
  UPDATE_FREQUENCY_OPTIONS,
  DATA_CONFIDENCE_OPTIONS,
  REPORT_TIME_OPTIONS,
  BI_TOOL_OPTIONS,
  OBSTACULOS_DECISION,
  AREAS_PRIORITARIAS,
  VALORES_ESPERADOS,
  MAX_DECISION_OBSTACLES,
  getOptionLabel
} from "../config/constants";
import {
  FormDraft,
  Interview,
  InterviewFormData,
  SaveInterviewResult,
  StorageSourceId
} from "../types";
import {
  clearFormDraft,
  clearStoredDiagnostics,
  getSavedInterviews,
  loadFormDraft,
  saveFormDraft,
  saveInterview
} from "../lib/storage";
import { ReportView } from "./ReportView";
import { BrandBanner } from "./BrandHeader";
import { CheckboxOptionGroup, RadioOptionGroup } from "./form/FormOptionGroups";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  ChevronRight,
  Trash2,
  ShieldCheck
} from "lucide-react";

interface FormViewProps {
  lastSaved: Interview | null;
  lastSavedPersisted: boolean;
  onDiagnosticSaved: (result: SaveInterviewResult) => void;
  onStartNewDiagnostic: () => void;
}

const DEFAULT_DRAFT: FormDraft = {
  interviewer: "",
  intervieweeName: "",
  role: "",
  company: "",
  sector: SECTORES[0],
  sectorOther: "",
  employeeCount: RANGOS_COLABORADORES[1],
  storageSourceIds: ["spreadsheets"],
  storageOther: "",
  integrationLevelId: "2",
  updateFrequencyId: "weekly",
  dataConfidenceId: "medium",
  reportTimeId: "hours_days",
  currentBiToolId: "excel",
  decisionObstacles: [OBSTACULOS_DECISION[0]],
  priorityProcess: AREAS_PRIORITARIAS[0],
  priorityOther: "",
  expectedValue: VALORES_ESPERADOS[0],
  consultantNotes: ""
};

const OBSTACLE_OPTIONS = OBSTACULOS_DECISION.map((obs) => ({
  id: obs,
  label: obs
}));

const EXPECTED_VALUE_OPTIONS = VALORES_ESPERADOS.map((val) => ({
  id: val,
  label: val
}));

function buildInitialDraft(): FormDraft {
  const saved = loadFormDraft();
  if (!saved) return { ...DEFAULT_DRAFT };
  return {
    ...DEFAULT_DRAFT,
    ...saved,
    storageSourceIds: Array.isArray(saved.storageSourceIds)
      ? saved.storageSourceIds
      : DEFAULT_DRAFT.storageSourceIds,
    decisionObstacles: Array.isArray(saved.decisionObstacles)
      ? saved.decisionObstacles.slice(0, MAX_DECISION_OBSTACLES)
      : DEFAULT_DRAFT.decisionObstacles
  };
}

export const FormView: React.FC<FormViewProps> = ({
  lastSaved,
  lastSavedPersisted,
  onDiagnosticSaved,
  onStartNewDiagnostic
}) => {
  const [draft, setDraft] = useState<FormDraft>(buildInitialDraft);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedCount, setSavedCount] = useState<number>(() => getSavedInterviews().length);
  const [clearFeedback, setClearFeedback] = useState("");
  const errorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lastSaved) {
      saveFormDraft(draft);
    }
  }, [draft, lastSaved]);

  const updateField = <K extends keyof FormDraft>(key: K, value: FormDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const showValidationError = (msg: string) => {
    setErrorMessage(msg);
    requestAnimationFrame(() => {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      errorRef.current?.focus();
    });
  };

  const handleStartNew = () => {
    clearFormDraft();
    setDraft({ ...DEFAULT_DRAFT });
    setErrorMessage("");
    onStartNewDiagnostic();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleStorage = (id: StorageSourceId) => {
    setDraft((prev) => {
      const exists = prev.storageSourceIds.includes(id);
      const next = exists
        ? prev.storageSourceIds.filter((item) => item !== id)
        : [...prev.storageSourceIds, id];
      return { ...prev, storageSourceIds: next };
    });
  };

  const handleToggleObstacle = (obs: string) => {
    setDraft((prev) => {
      const exists = prev.decisionObstacles.includes(obs);
      if (exists) {
        return {
          ...prev,
          decisionObstacles: prev.decisionObstacles.filter((item) => item !== obs)
        };
      }
      if (prev.decisionObstacles.length >= MAX_DECISION_OBSTACLES) {
        return prev;
      }
      return {
        ...prev,
        decisionObstacles: [...prev.decisionObstacles, obs]
      };
    });
  };

  const handleClearLocalHistory = () => {
    const ok = clearStoredDiagnostics();
    if (ok) {
      setSavedCount(0);
      setClearFeedback("Se eliminaron los diagnósticos almacenados en este navegador.");
    } else {
      setClearFeedback("No se pudo limpiar el almacenamiento local en este navegador.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!draft.intervieweeName.trim()) {
      showValidationError("Por favor, ingrese el nombre del referente de la organización.");
      return;
    }
    if (!draft.company.trim()) {
      showValidationError("Por favor, ingrese el nombre de la empresa u organización.");
      return;
    }
    if (draft.sector === "Otro" && !draft.sectorOther.trim()) {
      showValidationError("Por favor, especifique el sector o actividad principal.");
      return;
    }
    if (draft.storageSourceIds.length === 0) {
      showValidationError("Debe seleccionar al menos una fuente de almacenamiento de datos.");
      return;
    }
    if (draft.storageSourceIds.includes("other") && !draft.storageOther.trim()) {
      showValidationError("Por favor, especifique el otro medio de almacenamiento de datos.");
      return;
    }
    if (draft.priorityProcess === "Otro" && !draft.priorityOther.trim()) {
      showValidationError("Por favor, especifique el área o proceso prioritario.");
      return;
    }

    const payload: InterviewFormData = {
      entrevistador: draft.interviewer.trim() || "Autodiagnóstico",
      responsable_nombre: draft.intervieweeName.trim(),
      responsable_rol: draft.role.trim(),
      empresa: draft.company.trim(),
      sector: draft.sector,
      sector_otro: draft.sector === "Otro" ? draft.sectorOther.trim() : "",
      colaboradores: draft.employeeCount,
      almacenamiento_fuentes: draft.storageSourceIds.map((id) =>
        getOptionLabel(STORAGE_SOURCE_OPTIONS, id)
      ),
      almacenamiento_fuentes_ids: draft.storageSourceIds,
      almacenamiento_otro: draft.storageSourceIds.includes("other")
        ? draft.storageOther.trim()
        : "",
      integracion_nivel: getOptionLabel(INTEGRATION_LEVEL_OPTIONS, draft.integrationLevelId),
      integracion_nivel_id: draft.integrationLevelId,
      frecuencia_actualizacion: getOptionLabel(UPDATE_FREQUENCY_OPTIONS, draft.updateFrequencyId),
      frecuencia_actualizacion_id: draft.updateFrequencyId,
      confianza_datos: getOptionLabel(DATA_CONFIDENCE_OPTIONS, draft.dataConfidenceId),
      confianza_datos_id: draft.dataConfidenceId,
      tiempo_reporte: getOptionLabel(REPORT_TIME_OPTIONS, draft.reportTimeId),
      tiempo_reporte_id: draft.reportTimeId,
      herramienta_visualizacion: getOptionLabel(BI_TOOL_OPTIONS, draft.currentBiToolId),
      herramienta_visualizacion_id: draft.currentBiToolId,
      obstaculos_decision: draft.decisionObstacles.slice(0, MAX_DECISION_OBSTACLES),
      proceso_prioritario: draft.priorityProcess,
      proceso_prioritario_otro:
        draft.priorityProcess === "Otro" ? draft.priorityOther.trim() : "",
      valor_esperado: draft.expectedValue,
      observaciones_consultor: draft.consultantNotes.trim(),
      estado: "Completada"
    };

    try {
      const result = saveInterview(payload);
      clearFormDraft();
      setSavedCount(getSavedInterviews().length);
      onDiagnosticSaved(result);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      console.error("Error generating diagnostic:", err);
      showValidationError("Ocurrió un error al generar el diagnóstico. Intente nuevamente.");
    }
  };

  if (lastSaved) {
    return (
      <div className="space-y-6">
        <div
          role="status"
          className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden ${
            lastSavedPersisted
              ? "bg-sky-50/70 border border-[#7EBCE6]/60"
              : "bg-amber-50 border border-amber-300"
          }`}
        >
          <div className="flex items-center gap-3">
            {lastSavedPersisted ? (
              <CheckCircle2 className="w-5 h-5 text-[#2C6E9E] shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" aria-hidden="true" />
            )}
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#1E252D] font-['Outfit']">
                {lastSavedPersisted
                  ? "Diagnóstico de Madurez completado con éxito"
                  : "Informe generado sin guardado local en este navegador"}
              </div>
              <div className="text-xs text-slate-700 mt-0.5 font-['Inter']">
                {lastSavedPersisted ? (
                  <>
                    El informe de <strong>{lastSaved.empresa}</strong> ya está disponible y guardado en este navegador.
                  </>
                ) : (
                  <>
                    El informe de <strong>{lastSaved.empresa}</strong> está listo, pero el navegador bloqueó el guardado local. Descargalo en .txt para conservarlo.
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleStartNew}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] btn-primary text-xs cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nuevo Diagnóstico
          </button>
        </div>

        <ReportView interview={lastSaved} showBackButton={false} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Brand Hero Banner */}
      <BrandBanner
        title={APP_TITLE}
        subtitle={APP_SUBTITLE}
        categoryTag="ACCESO AL DIAGNÓSTICO DE MADUREZ DE DATOS & BI"
      />

      {/* Description & Value Promise card */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
          {APP_DESCRIPTION}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-[#F5F8FB] border border-[#E4ECF2]">
            <div className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
              01 · Evalúe 5 dimensiones
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">
              Fuentes, integración, frecuencia, calidad y reportabilidad actual.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F8FB] border border-[#E4ECF2]">
            <div className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
              02 · Conozca su nivel BI
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">
              Score ponderado (0 a 100) y radar visual de madurez de datos.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#F5F8FB] border border-[#E4ECF2]">
            <div className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
              03 · Obtenga su plan
            </div>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">
              Solución inicial recomendada y pasos clave para su primer tablero.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#2C6E9E] pt-1 font-['Outfit']">
          <Clock className="w-3.5 h-3.5 text-[#2C6E9E]" aria-hidden="true" />
          <span>Tiempo estimado: 5 a 7 minutos</span>
          <span className="text-slate-400" aria-hidden="true">·</span>
          <span className="text-slate-600 font-normal font-['Inter']">
            Resultado inmediato con informe descargable
          </span>
        </div>
      </div>

      {errorMessage && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          aria-live="assertive"
          className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-xs sm:text-sm font-medium flex items-center gap-2.5 shadow-2xs font-['Inter']"
        >
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Diagnostic Context Metadata */}
        <div className="bg-white p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3">
          <div className="text-xs font-semibold text-slate-600 font-['Outfit']">
            Datos del Diagnóstico
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label
                htmlFor="diagnostic-evaluator"
                className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
              >
                Evaluador o consultor (opcional)
              </label>
              <input
                id="diagnostic-evaluator"
                type="text"
                value={draft.interviewer}
                onChange={(e) => updateField("interviewer", e.target.value)}
                placeholder="Dejar vacío para autodiagnóstico"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white transition-colors"
              />
            </div>
            <div className="text-xs text-slate-600 sm:pt-4">
              El informe ejecutivo de madurez y la hoja de ruta se generarán automáticamente al finalizar.
            </div>
          </div>
        </div>

        {/* SECCIÓN 1: DATOS GENERALES */}
        <section
          aria-labelledby="section-1-title"
          className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4"
        >
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between gap-2">
            <div>
              <h2
                id="section-1-title"
                className="text-sm font-medium text-[#1E252D] tracking-wide font-['Outfit']"
              >
                01. Datos Generales de la Organización
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Información básica de la empresa y del referente que responde.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
              1 / 5
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="interviewee-name"
                className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
              >
                Nombre y Apellido del responsable{" "}
                <span className="text-[#2C6E9E]" aria-hidden="true">*</span>
              </label>
              <input
                id="interviewee-name"
                type="text"
                value={draft.intervieweeName}
                onChange={(e) => updateField("intervieweeName", e.target.value)}
                placeholder="Ej: Juan Pérez"
                required
                aria-required="true"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="interviewee-role"
                className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
              >
                Cargo / Rol en la organización
              </label>
              <input
                id="interviewee-role"
                type="text"
                value={draft.role}
                onChange={(e) => updateField("role", e.target.value)}
                placeholder="Ej: Gerente de Operaciones / Dueño"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="company-name"
                className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
              >
                Nombre de la empresa u organización{" "}
                <span className="text-[#2C6E9E]" aria-hidden="true">*</span>
              </label>
              <input
                id="company-name"
                type="text"
                value={draft.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="Ej: Bodegas Andinas S.A."
                required
                aria-required="true"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="employee-count"
                className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
              >
                Cantidad aproximada de colaboradores
              </label>
              <select
                id="employee-count"
                value={draft.employeeCount}
                onChange={(e) => updateField("employeeCount", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white cursor-pointer transition-colors"
              >
                {RANGOS_COLABORADORES.map((r) => (
                  <option key={r} value={r}>
                    {r} colaboradores
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="company-sector"
              className="block text-xs font-medium text-[#1E252D] mb-1 font-['Outfit']"
            >
              Sector o actividad principal
            </label>
            <select
              id="company-sector"
              value={draft.sector}
              onChange={(e) => updateField("sector", e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white cursor-pointer transition-colors"
            >
              {SECTORES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {draft.sector === "Otro" && (
              <div className="mt-2">
                <label htmlFor="company-sector-other" className="sr-only">
                  Especifique el sector o actividad principal
                </label>
                <input
                  id="company-sector-other"
                  type="text"
                  value={draft.sectorOther}
                  onChange={(e) => updateField("sectorOther", e.target.value)}
                  required
                  aria-required="true"
                  placeholder="Especifique el sector o actividad (ej: Fintech, Energía solar...)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#3B8AC4] rounded-xl bg-sky-50/30"
                />
              </div>
            )}
          </div>
        </section>

        {/* SECCIÓN 2: ALMACENAMIENTO Y FUENTES */}
        <section
          aria-labelledby="section-2-title"
          className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-5"
        >
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between gap-2">
            <div>
              <h2
                id="section-2-title"
                className="text-sm font-medium text-[#1E252D] tracking-wide font-['Outfit']"
              >
                02. Almacenamiento y Fuentes de Información
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Identificación de repositorios, sistemas transaccionales e integración actual.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
              2 / 5
            </span>
          </div>

          <div>
            <CheckboxOptionGroup
              legend="¿Dónde se registra y almacena hoy la mayor parte de la información operativa y comercial?"
              hint="(Seleccione todas las que apliquen)"
              options={STORAGE_SOURCE_OPTIONS}
              selected={draft.storageSourceIds}
              onToggle={handleToggleStorage}
              columns={2}
            />
            {draft.storageSourceIds.includes("other") && (
              <div className="mt-2.5">
                <label htmlFor="storage-other" className="sr-only">
                  Especifique otro medio de almacenamiento
                </label>
                <input
                  id="storage-other"
                  type="text"
                  value={draft.storageOther}
                  onChange={(e) => updateField("storageOther", e.target.value)}
                  required
                  aria-required="true"
                  placeholder="Especifique otro medio de almacenamiento (ej: PostgreSQL, Notion, Access...)"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#3B8AC4] rounded-xl bg-sky-50/30"
                />
              </div>
            )}
          </div>

          <div className="pt-2">
            <RadioOptionGroup
              legend="¿Cómo calificaría la integración entre sus distintas áreas (ventas, compras, administración, operaciones)?"
              name="integrationLevel"
              options={INTEGRATION_LEVEL_OPTIONS}
              value={draft.integrationLevelId}
              onChange={(val) => updateField("integrationLevelId", val)}
            />
          </div>
        </section>

        {/* SECCIÓN 3: RECOLECCIÓN, ACTUALIZACIÓN Y CALIDAD */}
        <section
          aria-labelledby="section-3-title"
          className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4"
        >
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between gap-2">
            <div>
              <h2
                id="section-3-title"
                className="text-sm font-medium text-[#1E252D] tracking-wide font-['Outfit']"
              >
                03. Recolección, Actualización y Calidad
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Dinámica de refresco y confiabilidad percibida de la información.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
              3 / 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioOptionGroup
              legend="¿Con qué frecuencia se actualizan los datos clave del negocio?"
              name="updateFrequency"
              options={UPDATE_FREQUENCY_OPTIONS}
              value={draft.updateFrequencyId}
              onChange={(val) => updateField("updateFrequencyId", val)}
            />

            <RadioOptionGroup
              legend="¿Qué nivel de confianza tiene en la consistencia de sus datos actuales?"
              name="dataConfidence"
              options={DATA_CONFIDENCE_OPTIONS}
              value={draft.dataConfidenceId}
              onChange={(val) => updateField("dataConfidenceId", val)}
            />
          </div>
        </section>

        {/* SECCIÓN 4: GENERACIÓN DE REPORTES Y TOMA DE DECISIONES */}
        <section
          aria-labelledby="section-4-title"
          className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-5"
        >
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between gap-2">
            <div>
              <h2
                id="section-4-title"
                className="text-sm font-medium text-[#1E252D] tracking-wide font-['Outfit']"
              >
                04. Generación de Reportes y Toma de Decisiones
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Tiempos de preparación, herramientas y principales fricciones directivas.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
              4 / 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RadioOptionGroup
              legend="¿Cuánto tiempo le toma a su equipo consolidar los reportes periódicos?"
              name="reportTime"
              options={REPORT_TIME_OPTIONS}
              value={draft.reportTimeId}
              onChange={(val) => updateField("reportTimeId", val)}
            />

            <RadioOptionGroup
              legend="¿Qué herramienta utilizan actualmente para visualizar los indicadores?"
              name="currentBiTool"
              options={BI_TOOL_OPTIONS}
              value={draft.currentBiToolId}
              onChange={(val) => updateField("currentBiToolId", val)}
            />
          </div>

          <div className="pt-2">
            <CheckboxOptionGroup
              legend="¿Cuáles son los principales obstáculos que enfrenta la dirección al tomar decisiones?"
              hint={`Seleccione hasta ${MAX_DECISION_OBSTACLES} prioridades (${draft.decisionObstacles.length}/${MAX_DECISION_OBSTACLES} seleccionados)`}
              options={OBSTACLE_OPTIONS}
              selected={draft.decisionObstacles}
              onToggle={handleToggleObstacle}
              accent="bronze"
              maxSelections={MAX_DECISION_OBSTACLES}
            />
          </div>
        </section>

        {/* SECCIÓN 5: PRIORIDADES Y EXPECTATIVAS */}
        <section
          aria-labelledby="section-5-title"
          className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4"
        >
          <div className="border-b border-[#E4ECF2] pb-3 flex items-center justify-between gap-2">
            <div>
              <h2
                id="section-5-title"
                className="text-sm font-medium text-[#1E252D] tracking-wide font-['Outfit']"
              >
                05. Prioridades y Expectativas
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Foco de negocio deseado y retorno esperado de la iniciativa de BI.
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-600 shrink-0">
              5 / 5
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="priority-process"
                className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']"
              >
                Área o proceso prioritario para implementar su primer tablero
              </label>
              <select
                id="priority-process"
                value={draft.priorityProcess}
                onChange={(e) => updateField("priorityProcess", e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white cursor-pointer transition-colors"
              >
                {AREAS_PRIORITARIAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              {draft.priorityProcess === "Otro" && (
                <div className="mt-2">
                  <label htmlFor="priority-process-other" className="sr-only">
                    Especifique el área o proceso prioritario
                  </label>
                  <input
                    id="priority-process-other"
                    type="text"
                    value={draft.priorityOther}
                    onChange={(e) => updateField("priorityOther", e.target.value)}
                    required
                    aria-required="true"
                    placeholder="Especifique el área o proceso prioritario (ej: Logística de frío, mermas...)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#3B8AC4] rounded-xl bg-sky-50/30"
                  />
                </div>
              )}
            </div>

            <RadioOptionGroup
              legend="Valor principal esperado de la implementación de BI"
              name="expectedValue"
              options={EXPECTED_VALUE_OPTIONS}
              value={draft.expectedValue}
              onChange={(val) => updateField("expectedValue", val)}
            />
          </div>
        </section>

        {/* OBSERVACIONES ADICIONALES */}
        <div className="bg-white p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-2">
          <label
            htmlFor="additional-notes"
            className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
          >
            Observaciones o contexto adicional (opcional)
          </label>
          <p className="text-xs text-slate-600 font-['Inter']">
            Sistemas específicos en uso, urgencias comerciales, cambios previstos o comentarios útiles para el diagnóstico:
          </p>
          <textarea
            id="additional-notes"
            value={draft.consultantNotes}
            onChange={(e) => updateField("consultantNotes", e.target.value)}
            rows={3}
            placeholder="Ej: Planeamos cambiar de ERP el año próximo. Tenemos urgencia en el tablero de ventas y cobranzas."
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E4ECF2] rounded-xl focus:border-[#2C6E9E] bg-white transition-colors font-['Inter']"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full py-3.5 px-6 min-h-[48px] rounded-xl text-sm font-semibold text-white btn-primary flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Finalizar y Obtener Diagnóstico de Madurez</span>
            <ChevronRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Privacy Notice & Local Clear Control */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border border-[#E4ECF2] text-xs text-slate-600">
          <div className="flex items-start sm:items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2C6E9E] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <span>
              Tus respuestas se procesan localmente en este navegador y no se envían a servidores externos.
            </span>
          </div>
          {savedCount > 0 && (
            <button
              type="button"
              onClick={handleClearLocalHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] text-xs font-medium text-slate-700 hover:text-rose-800 hover:bg-rose-50 border border-[#E4ECF2] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Borrar historial local ({savedCount})</span>
            </button>
          )}
        </div>

        {clearFeedback && (
          <p role="status" className="text-xs text-slate-600 px-1">
            {clearFeedback}
          </p>
        )}
      </form>
    </div>
  );
};
