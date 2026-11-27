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
  BiToolId,
  DataConfidenceId,
  FormDraft,
  IntegrationLevelId,
  Interview,
  InterviewFormData,
  ReportTimeId,
  SaveInterviewResult,
  StorageSourceId,
  UpdateFrequencyId
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
  ChevronLeft,
  Trash2,
  ShieldCheck,
  Check
} from "lucide-react";

interface FormViewProps {
  lastSaved: Interview | null;
  lastSavedPersisted: boolean;
  onDiagnosticSaved: (result: SaveInterviewResult) => void;
  onStartNewDiagnostic: () => void;
}

type FieldErrorKey =
  | "intervieweeName"
  | "company"
  | "sectorOther"
  | "storageSourceIds"
  | "storageOther"
  | "integrationLevelId"
  | "updateFrequencyId"
  | "dataConfidenceId"
  | "reportTimeId"
  | "currentBiToolId"
  | "priorityOther"
  | "expectedValue"
  | "general";

type FieldErrors = Partial<Record<FieldErrorKey, string>>;

const STEP_META = [
  {
    id: 1,
    shortTitle: "Organización",
    title: "01. Datos Generales de la Organización",
    description: "Información básica de la empresa y del referente que responde."
  },
  {
    id: 2,
    shortTitle: "Fuentes",
    title: "02. Almacenamiento y Fuentes de Información",
    description: "Identificación de repositorios, sistemas transaccionales e integración actual."
  },
  {
    id: 3,
    shortTitle: "Calidad",
    title: "03. Recolección, Actualización y Calidad",
    description: "Dinámica de refresco y confiabilidad percibida de la información."
  },
  {
    id: 4,
    shortTitle: "Reportes",
    title: "04. Generación de Reportes y Toma de Decisiones",
    description: "Tiempos de preparación, herramientas y principales fricciones directivas."
  },
  {
    id: 5,
    shortTitle: "Prioridades",
    title: "05. Prioridades y Expectativas",
    description: "Foco de negocio deseado y retorno esperado de la iniciativa de BI."
  }
] as const;

const TOTAL_STEPS = STEP_META.length;

const DEFAULT_DRAFT: FormDraft = {
  interviewer: "",
  intervieweeName: "",
  role: "",
  company: "",
  sector: SECTORES[0],
  sectorOther: "",
  employeeCount: RANGOS_COLABORADORES[1],
  storageSourceIds: [],
  storageOther: "",
  integrationLevelId: "",
  updateFrequencyId: "",
  dataConfidenceId: "",
  reportTimeId: "",
  currentBiToolId: "",
  decisionObstacles: [],
  priorityProcess: AREAS_PRIORITARIAS[0],
  priorityOther: "",
  expectedValue: "",
  consultantNotes: "",
  currentStep: 1
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
  const rawStep = typeof saved.currentStep === "number" ? saved.currentStep : 1;
  const safeStep = Math.min(TOTAL_STEPS, Math.max(1, rawStep));
  return {
    ...DEFAULT_DRAFT,
    ...saved,
    storageSourceIds: Array.isArray(saved.storageSourceIds)
      ? saved.storageSourceIds
      : DEFAULT_DRAFT.storageSourceIds,
    decisionObstacles: Array.isArray(saved.decisionObstacles)
      ? saved.decisionObstacles.slice(0, MAX_DECISION_OBSTACLES)
      : DEFAULT_DRAFT.decisionObstacles,
    currentStep: safeStep
  };
}

export const FormView: React.FC<FormViewProps> = ({
  lastSaved,
  lastSavedPersisted,
  onDiagnosticSaved,
  onStartNewDiagnostic
}) => {
  const [draft, setDraft] = useState<FormDraft>(buildInitialDraft);
  const [step, setStep] = useState<number>(() => draft.currentStep || 1);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [savedCount, setSavedCount] = useState<number>(() => getSavedInterviews().length);
  const [clearFeedback, setClearFeedback] = useState("");
  const stepTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!lastSaved) {
      saveFormDraft({ ...draft, currentStep: step });
    }
  }, [draft, step, lastSaved]);

  const clearFieldError = (key: FieldErrorKey) => {
    setFieldErrors((prev) => {
      if (!prev[key] && !prev.general) return prev;
      const next = { ...prev };
      delete next[key];
      delete next.general;
      return next;
    });
  };

  const updateField = <K extends keyof FormDraft>(key: K, value: FormDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key as FieldErrorKey);
  };

  const scrollToStepTop = () => {
    requestAnimationFrame(() => {
      stepTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const focusFirstInvalidField = (errors: FieldErrors) => {
    const firstKey = Object.keys(errors)[0] as FieldErrorKey | undefined;
    if (!firstKey) return;
    const focusMap: Partial<Record<FieldErrorKey, string>> = {
      intervieweeName: "interviewee-name",
      company: "company-name",
      sectorOther: "company-sector-other",
      storageOther: "storage-other",
      priorityOther: "priority-process-other"
    };
    const elementId = focusMap[firstKey];
    requestAnimationFrame(() => {
      if (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
      }
      stepTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const validateStep = (targetStep: number): FieldErrors => {
    const errors: FieldErrors = {};

    if (targetStep === 1) {
      if (!draft.intervieweeName.trim()) {
        errors.intervieweeName = "Ingresá el nombre y apellido del referente de la organización.";
      }
      if (!draft.company.trim()) {
        errors.company = "Ingresá el nombre de tu empresa u organización.";
      }
      if (draft.sector === "Otro" && !draft.sectorOther.trim()) {
        errors.sectorOther = "Especificá el sector o actividad principal.";
      }
    }

    if (targetStep === 2) {
      if (draft.storageSourceIds.length === 0) {
        errors.storageSourceIds = "Seleccioná al menos una fuente de almacenamiento de datos.";
      }
      if (draft.storageSourceIds.includes("other") && !draft.storageOther.trim()) {
        errors.storageOther = "Especificá cuál es el otro medio de almacenamiento.";
      }
      if (!draft.integrationLevelId) {
        errors.integrationLevelId = "Elegí el nivel de integración que mejor describe a tu organización.";
      }
    }

    if (targetStep === 3) {
      if (!draft.updateFrequencyId) {
        errors.updateFrequencyId = "Indicá con qué frecuencia se actualizan los datos clave.";
      }
      if (!draft.dataConfidenceId) {
        errors.dataConfidenceId = "Seleccioná el nivel de confianza en la consistencia actual.";
      }
    }

    if (targetStep === 4) {
      if (!draft.reportTimeId) {
        errors.reportTimeId = "Indicá cuánto tiempo toma consolidar los reportes periódicos.";
      }
      if (!draft.currentBiToolId) {
        errors.currentBiToolId = "Seleccioná la herramienta que utilizan hoy para visualizar indicadores.";
      }
    }

    if (targetStep === 5) {
      if (draft.priorityProcess === "Otro" && !draft.priorityOther.trim()) {
        errors.priorityOther = "Especificá el área o proceso prioritario.";
      }
      if (!draft.expectedValue) {
        errors.expectedValue = "Elegí el valor principal esperado de la implementación de BI.";
      }
    }

    return errors;
  };

  const handleNextStep = () => {
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      focusFirstInvalidField(errors);
      return;
    }
    setFieldErrors({});
    setStep((prev) => Math.min(TOTAL_STEPS, prev + 1));
    scrollToStepTop();
  };

  const handlePrevStep = () => {
    setFieldErrors({});
    setStep((prev) => Math.max(1, prev - 1));
    scrollToStepTop();
  };

  const handleJumpToStep = (target: number) => {
    if (target === step) return;
    if (target < step) {
      setFieldErrors({});
      setStep(target);
      scrollToStepTop();
      return;
    }
    // Validate current step before moving forward
    const errors = validateStep(step);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      focusFirstInvalidField(errors);
      return;
    }
    setFieldErrors({});
    setStep(target);
    scrollToStepTop();
  };

  const handleStartNew = () => {
    clearFormDraft();
    setDraft({ ...DEFAULT_DRAFT });
    setStep(1);
    setFieldErrors({});
    onStartNewDiagnostic();
    window.scrollTo(0, 0);
  };

  const handleToggleStorage = (id: StorageSourceId) => {
    setDraft((prev) => {
      const exists = prev.storageSourceIds.includes(id);
      const next = exists
        ? prev.storageSourceIds.filter((item) => item !== id)
        : [...prev.storageSourceIds, id];
      return { ...prev, storageSourceIds: next };
    });
    clearFieldError("storageSourceIds");
    if (id === "other") clearFieldError("storageOther");
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

    // Validate all steps sequentially so nothing can be skipped
    for (let s = 1; s <= TOTAL_STEPS; s++) {
      const stepErrs = validateStep(s);
      if (Object.keys(stepErrs).length > 0) {
        setStep(s);
        setFieldErrors(stepErrs);
        focusFirstInvalidField(stepErrs);
        return;
      }
    }

    const integrationId = draft.integrationLevelId as IntegrationLevelId;
    const frequencyId = draft.updateFrequencyId as UpdateFrequencyId;
    const confidenceId = draft.dataConfidenceId as DataConfidenceId;
    const reportTimeId = draft.reportTimeId as ReportTimeId;
    const biToolId = draft.currentBiToolId as BiToolId;

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
      integracion_nivel: getOptionLabel(INTEGRATION_LEVEL_OPTIONS, integrationId),
      integracion_nivel_id: integrationId,
      frecuencia_actualizacion: getOptionLabel(UPDATE_FREQUENCY_OPTIONS, frequencyId),
      frecuencia_actualizacion_id: frequencyId,
      confianza_datos: getOptionLabel(DATA_CONFIDENCE_OPTIONS, confidenceId),
      confianza_datos_id: confidenceId,
      tiempo_reporte: getOptionLabel(REPORT_TIME_OPTIONS, reportTimeId),
      tiempo_reporte_id: reportTimeId,
      herramienta_visualizacion: getOptionLabel(BI_TOOL_OPTIONS, biToolId),
      herramienta_visualizacion_id: biToolId,
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
      setFieldErrors({});
      onDiagnosticSaved(result);
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      console.error("Error generating diagnostic:", err);
      setFieldErrors({
        general: "Ocurrió un error al generar el diagnóstico. Intentá nuevamente."
      });
    }
  };

  if (lastSaved) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <div
          role="status"
          className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs print:hidden ${
            lastSavedPersisted
              ? "bg-sky-50/80 border border-[#7EBCE6]/70"
              : "bg-amber-50 border border-amber-300"
          }`}
        >
          <div className="flex items-start sm:items-center gap-3">
            {lastSavedPersisted ? (
              <CheckCircle2 className="w-5 h-5 text-[#2C6E9E] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            )}
            <div>
              <div className="text-sm font-semibold text-[#1E252D] font-['Outfit']">
                {lastSavedPersisted
                  ? "Diagnóstico de Madurez completado con éxito"
                  : "Informe generado sin guardado local en este navegador"}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 mt-0.5 font-['Inter']">
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
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] btn-primary text-xs sm:text-sm cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            Nuevo Diagnóstico
          </button>
        </div>

        <ReportView interview={lastSaved} showBackButton={false} />
      </div>
    );
  }

  const currentStepInfo = STEP_META[step - 1];
  const progressPct = Math.round((step / TOTAL_STEPS) * 100);
  const activeErrorsList = Object.values(fieldErrors).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-12 font-['Inter']">
      {/* Compact Brand Hero Banner so the form starts higher on mobile */}
      <BrandBanner
        title={APP_TITLE}
        subtitle={APP_SUBTITLE}
        categoryTag="DIAGNÓSTICO INTERACTIVO DE MADUREZ DE DATOS & BI"
        compact
      />

      {/* Value Promise Intro (only expanded on Step 1 to reduce vertical scroll on Steps 2-5) */}
      {step === 1 && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {APP_DESCRIPTION}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#2C6E9E] pt-0.5 font-['Outfit']">
            <Clock className="w-3.5 h-3.5 text-[#2C6E9E]" aria-hidden="true" />
            <span>Tiempo estimado: 5 a 7 minutos</span>
            <span className="text-slate-400" aria-hidden="true">·</span>
            <span className="text-slate-600 font-normal font-['Inter']">
              Resultado inmediato con informe descargable
            </span>
          </div>
        </div>
      )}

      {/* Guided Stepper Progress Bar */}
      <div
        ref={stepTopRef}
        className="scroll-mt-32 lg:scroll-mt-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs sm:text-sm font-semibold text-[#1E252D] font-['Outfit']">
            Paso {step} de {TOTAL_STEPS} ·{" "}
            <span className="text-[#2C6E9E]">{currentStepInfo.shortTitle}</span>
          </div>
          <span className="text-xs font-mono tabular-nums font-semibold text-slate-600">
            {progressPct}%
          </span>
        </div>

        <div
          className="w-full h-2 bg-[#E4ECF2] rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progreso del diagnóstico: paso ${step} de ${TOTAL_STEPS}`}
        >
          <div
            className="h-full bg-[#2C6E9E] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <ol className="grid grid-cols-5 gap-1.5 pt-0.5" aria-label="Pasos del diagnóstico">
          {STEP_META.map((item) => {
            const isActive = item.id === step;
            const isCompleted = item.id < step;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleJumpToStep(item.id)}
                  aria-current={isActive ? "step" : undefined}
                  className={`w-full min-h-[38px] px-1.5 py-1.5 rounded-xl text-xs font-semibold font-['Outfit'] flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#2C6E9E] text-white"
                      : isCompleted
                      ? "bg-sky-50 text-[#2C6E9E] border border-[#7EBCE6]/70 hover:bg-sky-100/70"
                      : "bg-[#F5F8FB] text-slate-600 border border-[#E4ECF2] hover:bg-[#EDF4FA]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  ) : (
                    <span className="font-mono tabular-nums">{item.id}</span>
                  )}
                  <span className="hidden sm:inline truncate">{item.shortTitle}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Inline Step Error Summary (only shown when user tries to advance with missing fields) */}
      {activeErrorsList.length > 0 && (
        <div
          role="alert"
          aria-live="assertive"
          className="p-4 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-sm flex items-start gap-2.5"
        >
          <AlertCircle className="w-4 h-4 text-[#B4372D] shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <div className="font-semibold font-['Outfit'] text-sm">
              Completá los campos marcados antes de continuar
            </div>
            <p className="text-xs text-rose-900/90 mt-0.5">
              {fieldErrors.general || activeErrorsList[0]}
            </p>
          </div>
        </div>
      )}

      {/* Main Step-by-Step Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <section
          aria-labelledby={`step-${step}-title`}
          className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-5"
        >
          <div className="border-b border-[#E4ECF2] pb-3.5">
            <h2
              id={`step-${step}-title`}
              className="text-base sm:text-lg font-semibold text-[#1E252D] tracking-tight font-['Outfit']"
            >
              {currentStepInfo.title}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {currentStepInfo.description}
            </p>
          </div>

          {/* PASO 1: DATOS GENERALES */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="interviewee-name"
                    className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Nombre y Apellido del responsable{" "}
                    <span className="text-[#B4372D]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="interviewee-name"
                    name="intervieweeName"
                    type="text"
                    autoComplete="name"
                    value={draft.intervieweeName}
                    onChange={(e) => updateField("intervieweeName", e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.intervieweeName ? "true" : undefined}
                    aria-describedby={
                      fieldErrors.intervieweeName ? "interviewee-name-error" : undefined
                    }
                    className="form-control"
                  />
                  {fieldErrors.intervieweeName && (
                    <p
                      id="interviewee-name-error"
                      role="alert"
                      className="text-xs font-medium text-[#B4372D]"
                    >
                      {fieldErrors.intervieweeName}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="company-name"
                    className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Nombre de la empresa u organización{" "}
                    <span className="text-[#B4372D]" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="company-name"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={draft.company}
                    onChange={(e) => updateField("company", e.target.value)}
                    placeholder="Ej: Bodegas Andinas S.A."
                    required
                    aria-required="true"
                    aria-invalid={fieldErrors.company ? "true" : undefined}
                    aria-describedby={fieldErrors.company ? "company-name-error" : undefined}
                    className="form-control"
                  />
                  {fieldErrors.company && (
                    <p
                      id="company-name-error"
                      role="alert"
                      className="text-xs font-medium text-[#B4372D]"
                    >
                      {fieldErrors.company}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="interviewee-role"
                    className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Cargo / Rol en la organización{" "}
                    <span className="text-xs font-normal text-slate-600">(opcional)</span>
                  </label>
                  <input
                    id="interviewee-role"
                    name="role"
                    type="text"
                    autoComplete="organization-title"
                    value={draft.role}
                    onChange={(e) => updateField("role", e.target.value)}
                    placeholder="Ej: Gerente de Operaciones / Dueño"
                    className="form-control"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="employee-count"
                    className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Cantidad aproximada de colaboradores
                  </label>
                  <select
                    id="employee-count"
                    name="employeeCount"
                    value={draft.employeeCount}
                    onChange={(e) => updateField("employeeCount", e.target.value)}
                    className="form-control cursor-pointer"
                  >
                    {RANGOS_COLABORADORES.map((r) => (
                      <option key={r} value={r}>
                        {r} colaboradores
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="company-sector"
                  className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                >
                  Sector o actividad principal
                </label>
                <select
                  id="company-sector"
                  name="sector"
                  value={draft.sector}
                  onChange={(e) => updateField("sector", e.target.value)}
                  className="form-control cursor-pointer"
                >
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {draft.sector === "Otro" && (
                  <div className="pt-2 space-y-1.5">
                    <label
                      htmlFor="company-sector-other"
                      className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                    >
                      Especifique el sector o actividad{" "}
                      <span className="text-[#B4372D]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="company-sector-other"
                      type="text"
                      value={draft.sectorOther}
                      onChange={(e) => updateField("sectorOther", e.target.value)}
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.sectorOther ? "true" : undefined}
                      aria-describedby={
                        fieldErrors.sectorOther ? "sector-other-error" : undefined
                      }
                      placeholder="Ej: Fintech, Energía solar, Salud..."
                      className="form-control"
                    />
                    {fieldErrors.sectorOther && (
                      <p
                        id="sector-other-error"
                        role="alert"
                        className="text-xs font-medium text-[#B4372D]"
                      >
                        {fieldErrors.sectorOther}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 2: ALMACENAMIENTO Y FUENTES */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <CheckboxOptionGroup
                  legend="¿Dónde se registra y almacena hoy la mayor parte de la información operativa y comercial?"
                  hint="Seleccioná todas las opciones que apliquen."
                  options={STORAGE_SOURCE_OPTIONS}
                  selected={draft.storageSourceIds}
                  onToggle={handleToggleStorage}
                  columns={2}
                  required
                  error={fieldErrors.storageSourceIds}
                  errorId="storage-sources-error"
                />

                {draft.storageSourceIds.includes("other") && (
                  <div className="pt-2 space-y-1.5">
                    <label
                      htmlFor="storage-other"
                      className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                    >
                      Especifique otro medio de almacenamiento{" "}
                      <span className="text-[#B4372D]" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="storage-other"
                      type="text"
                      value={draft.storageOther}
                      onChange={(e) => updateField("storageOther", e.target.value)}
                      required
                      aria-required="true"
                      aria-invalid={fieldErrors.storageOther ? "true" : undefined}
                      aria-describedby={
                        fieldErrors.storageOther ? "storage-other-error" : undefined
                      }
                      placeholder="Ej: PostgreSQL, Notion, Access..."
                      className="form-control"
                    />
                    {fieldErrors.storageOther && (
                      <p
                        id="storage-other-error"
                        role="alert"
                        className="text-xs font-medium text-[#B4372D]"
                      >
                        {fieldErrors.storageOther}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-[#E4ECF2]">
                <RadioOptionGroup
                  legend="¿Cómo calificaría la integración entre sus distintas áreas (ventas, compras, administración, operaciones)?"
                  name="integrationLevel"
                  options={INTEGRATION_LEVEL_OPTIONS}
                  value={draft.integrationLevelId}
                  onChange={(val) => updateField("integrationLevelId", val)}
                  required
                  error={fieldErrors.integrationLevelId}
                  errorId="integration-level-error"
                />
              </div>
            </div>
          )}

          {/* PASO 3: RECOLECCIÓN, ACTUALIZACIÓN Y CALIDAD */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RadioOptionGroup
                legend="¿Con qué frecuencia se actualizan los datos clave del negocio?"
                name="updateFrequency"
                options={UPDATE_FREQUENCY_OPTIONS}
                value={draft.updateFrequencyId}
                onChange={(val) => updateField("updateFrequencyId", val)}
                required
                error={fieldErrors.updateFrequencyId}
                errorId="update-frequency-error"
              />

              <RadioOptionGroup
                legend="¿Qué nivel de confianza tiene en la consistencia de sus datos actuales?"
                name="dataConfidence"
                options={DATA_CONFIDENCE_OPTIONS}
                value={draft.dataConfidenceId}
                onChange={(val) => updateField("dataConfidenceId", val)}
                required
                error={fieldErrors.dataConfidenceId}
                errorId="data-confidence-error"
              />
            </div>
          )}

          {/* PASO 4: GENERACIÓN DE REPORTES Y TOMA DE DECISIONES */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RadioOptionGroup
                  legend="¿Cuánto tiempo le toma a su equipo consolidar los reportes periódicos?"
                  name="reportTime"
                  options={REPORT_TIME_OPTIONS}
                  value={draft.reportTimeId}
                  onChange={(val) => updateField("reportTimeId", val)}
                  required
                  error={fieldErrors.reportTimeId}
                  errorId="report-time-error"
                />

                <RadioOptionGroup
                  legend="¿Qué herramienta utilizan actualmente para visualizar los indicadores?"
                  name="currentBiTool"
                  options={BI_TOOL_OPTIONS}
                  value={draft.currentBiToolId}
                  onChange={(val) => updateField("currentBiToolId", val)}
                  required
                  error={fieldErrors.currentBiToolId}
                  errorId="bi-tool-error"
                />
              </div>

              <div className="pt-2 border-t border-[#E4ECF2]">
                <CheckboxOptionGroup
                  legend="¿Cuáles son los principales obstáculos que enfrenta la dirección al tomar decisiones?"
                  hint={`Opcional — elegí hasta ${MAX_DECISION_OBSTACLES} prioridades (${draft.decisionObstacles.length}/${MAX_DECISION_OBSTACLES} seleccionados).`}
                  options={OBSTACLE_OPTIONS}
                  selected={draft.decisionObstacles}
                  onToggle={handleToggleObstacle}
                  accent="bronze"
                  maxSelections={MAX_DECISION_OBSTACLES}
                />
              </div>
            </div>
          )}

          {/* PASO 5: PRIORIDADES, OBSERVACIONES Y MODO CONSULTOR */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label
                    htmlFor="priority-process"
                    className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Área o proceso prioritario para implementar su primer tablero
                  </label>
                  <select
                    id="priority-process"
                    value={draft.priorityProcess}
                    onChange={(e) => updateField("priorityProcess", e.target.value)}
                    className="form-control cursor-pointer"
                  >
                    {AREAS_PRIORITARIAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  {draft.priorityProcess === "Otro" && (
                    <div className="pt-2 space-y-1.5">
                      <label
                        htmlFor="priority-process-other"
                        className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                      >
                        Especifique el área o proceso prioritario{" "}
                        <span className="text-[#B4372D]" aria-hidden="true">*</span>
                      </label>
                      <input
                        id="priority-process-other"
                        type="text"
                        value={draft.priorityOther}
                        onChange={(e) => updateField("priorityOther", e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={fieldErrors.priorityOther ? "true" : undefined}
                        aria-describedby={
                          fieldErrors.priorityOther ? "priority-other-error" : undefined
                        }
                        placeholder="Ej: Logística de frío, mermas..."
                        className="form-control"
                      />
                      {fieldErrors.priorityOther && (
                        <p
                          id="priority-other-error"
                          role="alert"
                          className="text-xs font-medium text-[#B4372D]"
                        >
                          {fieldErrors.priorityOther}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <RadioOptionGroup
                  legend="Valor principal esperado de la implementación de BI"
                  name="expectedValue"
                  options={EXPECTED_VALUE_OPTIONS}
                  value={draft.expectedValue}
                  onChange={(val) => updateField("expectedValue", val)}
                  required
                  error={fieldErrors.expectedValue}
                  errorId="expected-value-error"
                />
              </div>

              <div className="pt-4 border-t border-[#E4ECF2] space-y-1.5">
                <label
                  htmlFor="additional-notes"
                  className="block text-sm font-medium text-[#1E252D] font-['Outfit']"
                >
                  Observaciones o contexto adicional{" "}
                  <span className="text-xs font-normal text-slate-600">(opcional)</span>
                </label>
                <p className="text-xs text-slate-600">
                  Sistemas específicos en uso, urgencias comerciales, cambios previstos o comentarios útiles para el diagnóstico.
                </p>
                <textarea
                  id="additional-notes"
                  value={draft.consultantNotes}
                  onChange={(e) => updateField("consultantNotes", e.target.value)}
                  rows={3}
                  placeholder="Ej: Planeamos cambiar de ERP el año próximo. Tenemos urgencia en el tablero de ventas y cobranzas."
                  className="form-control"
                />
              </div>

              {/* Internal Evaluator field tucked cleanly inside a collapsible block */}
              <details className="rounded-xl border border-[#E4ECF2] bg-[#F5F8FB] px-4 py-3">
                <summary className="text-xs font-semibold text-slate-700 font-['Outfit'] cursor-pointer select-none">
                  ¿Completás este relevamiento como consultor o evaluador? (opcional)
                </summary>
                <div className="pt-3 space-y-1.5">
                  <label
                    htmlFor="diagnostic-evaluator"
                    className="block text-xs font-medium text-[#1E252D] font-['Outfit']"
                  >
                    Nombre del evaluador o consultor
                  </label>
                  <input
                    id="diagnostic-evaluator"
                    type="text"
                    value={draft.interviewer}
                    onChange={(e) => updateField("interviewer", e.target.value)}
                    placeholder="Dejar vacío para autodiagnóstico"
                    className="form-control"
                  />
                </div>
              </details>
            </div>
          )}

          {/* Step Navigation Controls */}
          <div className="pt-4 border-t border-[#E4ECF2] flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-xl border border-[#CBD5E1] bg-white hover:bg-[#F5F8FB] text-[#1E252D] text-sm font-semibold font-['Outfit'] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                <span>Paso Anterior</span>
              </button>
            ) : (
              <div className="hidden sm:block text-xs text-slate-600">
                Los campos marcados con <span className="text-[#B4372D] font-semibold">*</span> son obligatorios.
              </div>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl text-sm font-semibold text-white btn-primary cursor-pointer"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] rounded-xl text-sm font-semibold text-white btn-primary cursor-pointer"
              >
                <span>Finalizar y Obtener Diagnóstico</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </section>

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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] text-xs font-medium text-slate-700 hover:text-rose-800 hover:bg-rose-50 border border-[#E4ECF2] rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
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
