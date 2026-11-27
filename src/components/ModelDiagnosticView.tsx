import React, { useMemo, useState } from "react";
import { BrandBanner, ContrailCurves } from "./BrandHeader";
import { GaugeChart } from "./charts/GaugeChart";
import { RadarChart } from "./charts/RadarChart";
import { evaluarDiagnostico } from "../lib/scoring";
import { COMPANY_LOCATION, MATRIZ_EVALUACION } from "../config/constants";
import {
  BiToolId,
  DataConfidenceId,
  IntegrationLevelId,
  ReportTimeId,
  StorageSourceId,
  UpdateFrequencyId
} from "../types";
import {
  ArrowRight,
  Building2,
  Check,
  Download,
  Printer,
  User
} from "lucide-react";

type ViewFilter = "completo" | "diagnostico" | "propuesta";

interface ModelDiagnosticViewProps {
  onStartDiagnostic: () => void;
}

const MODEL_CASE_RAW = {
  empresa: "Distribuidora Cuyo Express S.A.",
  responsable_nombre: "Valeria Gómez",
  responsable_rol: "Directora de Operaciones",
  sector: "Comercio mayorista / minorista",
  colaboradores: "51 a 200",
  fecha: "2026-11-15",
  storage_source_ids: ["spreadsheets", "erp", "billing"] as StorageSourceId[],
  integration_level_id: "2" as IntegrationLevelId,
  update_frequency_id: "weekly" as UpdateFrequencyId,
  data_confidence_id: "medium" as DataConfidenceId,
  report_time_id: "half_day" as ReportTimeId,
  current_bi_tool_id: "erp_native" as BiToolId,
  obstaculos_decision: [
    "Demora en obtener números actualizados.",
    "Dificultad para visualizar tendencias o anomalías a tiempo."
  ],
  proceso_prioritario: "Control de stock, inventario y compras",
  valor_esperado:
    "Visibilidad ejecutiva en tiempo real accesible desde el celular o la web.",
  observaciones_consultor:
    "Cuentan con ERP Tango para facturación y compras, pero la conciliación de quiebres de stock y reposición se realiza manualmente en planillas Excel cada semana."
};

const DIMENSION_FINDINGS: Record<string, string> = {
  "Almacenamiento y Fuentes":
    "ERP y facturación electrónica operativos, pero coexisten con planillas paralelas de control.",
  "Integración entre Áreas":
    "Cruce manual de información entre ventas, depósito y compras al cierre de cada período.",
  "Frecuencia de Actualización":
    "Consolidación semanal; sin visibilidad intradía sobre quiebres críticos de inventario.",
  "Calidad y Consistencia":
    "Base confiable en origen, aunque requiere limpieza y validación manual antes de reportar.",
  "Eficiencia de Reportes":
    "Medio día de trabajo operativo para armar informes con plantillas semi-manuales."
};

const IMPLEMENTATION_PHASES = [
  {
    fase: "Fase 1",
    plazo: "Semana 1",
    titulo: "Auditoría de Fuentes y Diccionario de KPIs",
    entregable:
      "Mapeo de tablas del ERP Tango, comprobantes fiscales y definición unificada de métricas de inventario, rotación y quiebres."
  },
  {
    fase: "Fase 2",
    plazo: "Semanas 2 – 3",
    titulo: "Pipeline Automatizado y Modelado de Datos",
    entregable:
      "Extracción y limpieza automatizada sin planillas intermedias, con reglas de calidad y modelo estrella listo para analítica."
  },
  {
    fase: "Fase 3",
    plazo: "Semanas 4 – 5",
    titulo: "Despliegue de Tablero Ejecutivo de Stock y Compras",
    entregable:
      "Panel interactivo en Power BI / Looker Studio accesible desde web y celular con alertas de punto de pedido y cobertura por SKU."
  },
  {
    fase: "Fase 4",
    plazo: "Semana 6",
    titulo: "Capacitación, Adopción y Puesta en Marcha",
    entregable:
      "Transferencia práctica al equipo de operaciones y dirección, documentación de uso y seguimiento inicial de indicadores."
  }
];

const PROPOSAL_DELIVERABLES = [
  {
    titulo: "Tablero Ejecutivo de Stock, Rotación y Quiebres",
    detalle:
      "Visibilidad diaria de inventario valorizado, días de cobertura por categoría, productos inmovilizados y alertas de reposición."
  },
  {
    titulo: "Integración Directa con ERP y Facturación",
    detalle:
      "Eliminación del cruce manual semanal en Excel mediante un flujo automatizado y auditable desde las fuentes actuales."
  },
  {
    titulo: "Indicadores Unificados para Dirección y Compras",
    detalle:
      "Definición única de margen bruto, cumplimiento de proveedores, quiebre por sucursal y evolución semanal de ventas."
  },
  {
    titulo: "Acceso Web y Móvil con Adopción Asistida",
    detalle:
      "Consulta desde cualquier dispositivo y capacitación operativa para que el equipo tome decisiones de forma autónoma."
  }
];

export const ModelDiagnosticView: React.FC<ModelDiagnosticViewProps> = ({
  onStartDiagnostic
}) => {
  const [viewFilter, setViewFilter] = useState<ViewFilter>("completo");
  const [downloaded, setDownloaded] = useState(false);

  const diagnostic = useMemo(
    () =>
      evaluarDiagnostico({
        storage_source_ids: MODEL_CASE_RAW.storage_source_ids,
        integration_level_id: MODEL_CASE_RAW.integration_level_id,
        update_frequency_id: MODEL_CASE_RAW.update_frequency_id,
        data_confidence_id: MODEL_CASE_RAW.data_confidence_id,
        report_time_id: MODEL_CASE_RAW.report_time_id,
        current_bi_tool_id: MODEL_CASE_RAW.current_bi_tool_id
      }),
    []
  );

  const matrizInfo =
    MATRIZ_EVALUACION[diagnostic.nivel] ||
    MATRIZ_EVALUACION["Nivel 2: Operativo / Estructurado"];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadModelDocument = () => {
    const content = `DIAGNÓSTICO MODELO Y PROPUESTA DE IMPLEMENTACIÓN BI
I+S DATA SOLUTIONS — Information + Solutions
========================================================================

1. DATOS DE LA ORGANIZACIÓN (CASO MODELO)
Empresa: ${MODEL_CASE_RAW.empresa}
Referente: ${MODEL_CASE_RAW.responsable_nombre} (${MODEL_CASE_RAW.responsable_rol})
Sector: ${MODEL_CASE_RAW.sector} · ${MODEL_CASE_RAW.colaboradores} colaboradores
Fecha de referencia: ${MODEL_CASE_RAW.fecha}

2. RESULTADO DEL DIAGNÓSTICO DE MADUREZ
Score Global: ${diagnostic.score_global} / 100 pts
Nivel de Madurez: ${diagnostic.nivel}

Puntaje por Dimensión:
${Object.entries(diagnostic.dimensiones)
  .map(([dim, val]) => `  - ${dim}: ${val}/100`)
  .join("\n")}

Criterio Diagnóstico:
${matrizInfo.criterio}

3. PROPUESTA DE IMPLEMENTACIÓN ASOCIADA
Proceso Prioritario: ${MODEL_CASE_RAW.proceso_prioritario}
Solución Recomendada: ${matrizInfo.solucion}
Valor Principal Esperado: ${MODEL_CASE_RAW.valor_esperado}

Plan de Ejecución (6 Semanas):
${IMPLEMENTATION_PHASES.map(
  (p) => `  ${p.fase} (${p.plazo}) — ${p.titulo}: ${p.entregable}`
).join("\n")}

========================================================================
I+S DATA SOLUTIONS — ${COMPANY_LOCATION}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagnostico_y_propuesta_modelo_is_data_solutions.txt";
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3500);
  };

  const showDiagnostic = viewFilter === "completo" || viewFilter === "diagnostico";
  const showProposal = viewFilter === "completo" || viewFilter === "propuesta";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 font-['Inter'] print:space-y-5">
      {/* Hero Banner */}
      <BrandBanner
        title="Diagnóstico Modelo y Propuesta Asociada"
        subtitle="Ejemplo integral del informe de madurez de datos y la propuesta técnica de Business Intelligence que generamos para cada organización"
        categoryTag="CASO MODELO DE REFERENCIA"
        compact
      />

      {/* Interactive View Controls & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div
          role="tablist"
          aria-label="Secciones del caso modelo"
          className="inline-flex items-center gap-1 p-1 bg-white border border-[#E4ECF2] rounded-xl self-start max-w-full overflow-x-auto"
        >
          {(
            [
              { id: "completo", label: "Vista Completa" },
              { id: "diagnostico", label: "Diagnóstico Modelo" },
              { id: "propuesta", label: "Propuesta Asociada" }
            ] as { id: ViewFilter; label: string }[]
          ).map((tab) => {
            const active = viewFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setViewFilter(tab.id)}
                className={`px-3.5 py-2 min-h-[40px] sm:min-h-[36px] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer font-['Outfit'] ${
                  active
                    ? "bg-[#2C6E9E] text-white"
                    : "text-slate-700 hover:text-[#1E252D] hover:bg-[#F5F8FB]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-semibold text-[#1E252D] bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors whitespace-nowrap shrink-0 cursor-pointer font-['Outfit']"
          >
            <Printer className="w-4 h-4 text-slate-600" aria-hidden="true" />
            <span>Imprimir</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadModelDocument}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] sm:min-h-[38px] text-xs font-semibold text-white btn-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Caso Modelo descargado</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Descargar Caso Modelo (.txt)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Model Organization Executive Header */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] bg-[#1E252D] text-white">
        <ContrailCurves className="opacity-35" />
        <div className="relative p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200">
              <span className="font-semibold text-[#D4C0B2] font-['Outfit']">
                Caso Modelo de Referencia
              </span>
              <span aria-hidden="true" className="text-sky-300/50">·</span>
              <span className="font-mono tabular-nums text-sky-200">
                {MODEL_CASE_RAW.fecha}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-medium text-white tracking-wide font-['Outfit'] text-balance">
              {MODEL_CASE_RAW.empresa}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-sky-100/90 pt-0.5">
              <span className="inline-flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7EBCE6]" />
                <span className="font-medium text-white">
                  {MODEL_CASE_RAW.responsable_nombre}
                </span>
                <span>({MODEL_CASE_RAW.responsable_rol})</span>
              </span>
              <span aria-hidden="true" className="text-sky-300/40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#7EBCE6]" />
                <span>{MODEL_CASE_RAW.sector}</span>
              </span>
              <span aria-hidden="true" className="text-sky-300/40">·</span>
              <span className="font-mono tabular-nums text-sky-200">
                {MODEL_CASE_RAW.colaboradores} colaboradores
              </span>
            </div>
          </div>

          <div className="self-start md:self-auto pt-4 md:pt-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/15 min-w-[220px] text-left md:text-right">
            <div className="text-xs text-sky-200 font-['Outfit']">
              Resultado del Diagnóstico
            </div>
            <div className="text-base sm:text-lg font-medium text-white mt-0.5 font-['Outfit']">
              {diagnostic.nivel}
            </div>
            <div className="text-xs text-sky-100 font-mono tabular-nums mt-1">
              Score Global:{" "}
              <span className="text-lg font-semibold text-white">
                {diagnostic.score_global}
              </span>{" "}
              / 100 pts
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* PARTE 1: DIAGNÓSTICO MODELO */}
      {/* ================================================================= */}
      {showDiagnostic && (
        <section aria-labelledby="model-diagnostic-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E4ECF2] pb-3">
            <h3
              id="model-diagnostic-heading"
              className="text-lg sm:text-xl font-medium text-[#1E252D] font-['Outfit'] tracking-wide"
            >
              01. Diagnóstico de Madurez de Datos & BI
            </h3>
            <span className="text-xs text-slate-600">
              Evaluación ponderada en 5 dimensiones clave
            </span>
          </div>

          {/* Visual Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <div className="flex flex-col">
              <div className="text-xs font-semibold text-slate-600 mb-2.5 font-['Outfit']">
                Índice de Madurez Global
              </div>
              <div className="flex-1 flex flex-col [&>*]:flex-1">
                <GaugeChart
                  value={diagnostic.score_global}
                  label="Nivel de Preparación BI"
                  badgeColor={matrizInfo.badge_color}
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="text-xs font-semibold text-slate-600 mb-2.5 font-['Outfit']">
                Perfil Analítico por Dimensión
              </div>
              <div className="flex-1 flex flex-col [&>*]:flex-1">
                <RadarChart dimensiones={diagnostic.dimensiones} />
              </div>
            </div>
          </div>

          {/* Dimension Table & Current Situation */}
          <div className="bg-white rounded-2xl border border-[#E4ECF2] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#E4ECF2] flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-[#1E252D] font-['Outfit']">
                Desglose por Dimensión y Hallazgos Técnicos
              </h4>
              <span className="text-xs text-slate-600 font-mono tabular-nums">
                Promedio ponderado: {diagnostic.score_global} / 100
              </span>
            </div>

            <div className="divide-y divide-[#E4ECF2]">
              {Object.entries(diagnostic.dimensiones).map(([dim, score]) => (
                <div
                  key={dim}
                  className="px-6 py-4 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center"
                >
                  <div className="md:col-span-4">
                    <div className="text-xs sm:text-sm font-medium text-[#1E252D] font-['Outfit']">
                      {dim}
                    </div>
                  </div>
                  <div className="md:col-span-3 flex items-center gap-3">
                    <div className="flex-1 bg-[#F5F8FB] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${score}%`,
                          backgroundColor:
                            score >= 75
                              ? "#3B8AC4"
                              : score >= 55
                              ? "#BFA898"
                              : "#E05D52"
                        }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#1E252D] font-mono tabular-nums w-11 text-right">
                      {score}%
                    </span>
                  </div>
                  <div className="md:col-span-5 text-xs text-slate-600 leading-relaxed">
                    {DIMENSION_FINDINGS[dim]}
                  </div>
                </div>
              ))}
            </div>

            {/* Diagnostic Synthesis Footer */}
            <div className="px-6 py-5 bg-[#F5F8FB] border-t border-[#E4ECF2] grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[#1E252D] font-['Outfit']">
                  Criterio Diagnóstico Aplicado
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {matrizInfo.criterio}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {MODEL_CASE_RAW.observaciones_consultor}
                </p>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#1E252D] font-['Outfit']">
                  Principales Fricciones Detectadas
                </div>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  {MODEL_CASE_RAW.obstaculos_decision.map((obs) => (
                    <li key={obs} className="flex items-start gap-2">
                      <span className="text-[#BFA898] font-bold" aria-hidden="true">
                        —
                      </span>
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-xs text-slate-600 pt-1">
                  Foco prioritario declarado:{" "}
                  <span className="font-semibold text-[#2C6E9E]">
                    {MODEL_CASE_RAW.proceso_prioritario}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* PARTE 2: PROPUESTA DE IMPLEMENTACIÓN ASOCIADA AL DIAGNÓSTICO */}
      {/* ================================================================= */}
      {showProposal && (
        <section aria-labelledby="model-proposal-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#E4ECF2] pb-3">
            <h3
              id="model-proposal-heading"
              className="text-lg sm:text-xl font-medium text-[#1E252D] font-['Outfit'] tracking-wide"
            >
              02. Propuesta de Implementación Derivada del Diagnóstico
            </h3>
            <span className="text-xs text-slate-600">
              Plan técnico a medida para {MODEL_CASE_RAW.empresa}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#E4ECF2] divide-y divide-[#E4ECF2]">
            {/* Scope & Recommended Architecture */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-2 max-w-2xl">
                  <div className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
                    Solución Recomendada — {diagnostic.nivel}
                  </div>
                  <h4 className="text-lg sm:text-xl font-light text-[#1E252D] font-['Outfit'] leading-snug text-balance">
                    {matrizInfo.solucion}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Tomando como punto de partida el ecosistema actual de{" "}
                    <strong className="text-[#1E252D]">{MODEL_CASE_RAW.empresa}</strong>{" "}
                    (ERP Tango y facturación electrónica), proponemos automatizar el flujo de datos hacia un tablero ejecutivo enfocado en{" "}
                    <strong className="text-[#1E252D]">
                      {MODEL_CASE_RAW.proceso_prioritario}
                    </strong>{" "}
                    sin interrumpir la operación diaria.
                  </p>
                </div>

                <div className="md:text-right shrink-0 space-y-1 pt-2 md:pt-0">
                  <div className="text-xs text-slate-600">Horizonte estimado</div>
                  <div className="text-2xl font-light text-[#1E252D] font-mono tabular-nums">
                    6 semanas
                  </div>
                  <div className="text-xs text-slate-600">
                    4 fases · Entrega incremental
                  </div>
                </div>
              </div>
            </div>

            {/* Concrete Deliverables */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="text-xs font-semibold text-slate-600 font-['Outfit']">
                Entregables Incluidos en la Primera Etapa
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {PROPOSAL_DELIVERABLES.map((item) => (
                  <div key={item.titulo} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-md bg-sky-50 text-[#3B8AC4] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <div className="space-y-1">
                      <div className="text-xs sm:text-sm font-semibold text-[#1E252D] font-['Outfit']">
                        {item.titulo}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.detalle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4-Phase Roadmap Table */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="text-xs font-semibold text-slate-600 font-['Outfit']">
                  Hoja de Ruta de Implementación
                </div>
                <span className="text-xs text-slate-600">
                  Seguimiento semanal con dirección y referentes operativos
                </span>
              </div>

              <div className="divide-y divide-[#E4ECF2] border-t border-b border-[#E4ECF2]">
                {IMPLEMENTATION_PHASES.map((step) => (
                  <div
                    key={step.fase}
                    className="py-4 grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-baseline"
                  >
                    <div className="md:col-span-3 flex items-baseline gap-2">
                      <span className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
                        {step.fase}
                      </span>
                      <span aria-hidden="true" className="text-slate-400">·</span>
                      <span className="text-xs font-mono tabular-nums text-slate-600">
                        {step.plazo}
                      </span>
                    </div>
                    <div className="md:col-span-4 text-xs sm:text-sm font-semibold text-[#1E252D] font-['Outfit']">
                      {step.titulo}
                    </div>
                    <div className="md:col-span-5 text-xs text-slate-600 leading-relaxed">
                      {step.entregable}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurable Expected Impact */}
            <div className="p-6 sm:p-8 bg-[#F5F8FB] grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-slate-600 font-['Outfit']">
                  Tiempo de consolidación
                </div>
                <div className="text-lg font-medium text-[#1E252D] font-mono tabular-nums mt-1">
                  De medio día a 0 min
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Actualización programada automática sin armado manual de planillas.
                </p>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-['Outfit']">
                  Frecuencia de decisión
                </div>
                <div className="text-lg font-medium text-[#2C6E9E] font-mono tabular-nums mt-1">
                  Semanal → Diaria
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Detección temprana de quiebres de inventario antes de impactar ventas.
                </p>
              </div>
              <div>
                <div className="text-xs text-slate-600 font-['Outfit']">
                  Valor principal alcanzado
                </div>
                <div className="text-sm font-semibold text-[#1E252D] font-['Outfit'] mt-1 leading-snug">
                  {MODEL_CASE_RAW.valor_esperado}
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-snug">
                  Una sola versión de la verdad para dirección, compras y depósito.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Action CTA to Start User's Own Diagnostic */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] bg-[#1E252D] text-white p-6 sm:p-8 print:hidden">
        <ContrailCurves className="opacity-25" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <h3 className="text-lg sm:text-xl font-light text-white font-['Outfit'] text-balance">
              Obtenga este mismo diagnóstico para su organización
            </h3>
            <p className="text-xs sm:text-sm text-sky-100/85 leading-relaxed">
              Complete la evaluación interactiva en 5 minutos para conocer su score de madurez de datos, su perfil en las 5 dimensiones y el plan inicial recomendado.
            </p>
          </div>
          <button
            onClick={onStartDiagnostic}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs sm:text-sm font-semibold text-white btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
          >
            <span>Iniciar Nuevo Diagnóstico</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
