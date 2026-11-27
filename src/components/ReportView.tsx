import React, { useState } from "react";
import { Interview } from "../types";
import {
  COMPANY_LOCATION,
  LINKEDIN_PROFILE_URL,
  MATRIZ_EVALUACION
} from "../config/constants";
import { GaugeChart } from "./charts/GaugeChart";
import { RadarChart } from "./charts/RadarChart";
import { LinkedInIcon } from "./LinkedInIcon";
import {
  Download,
  ArrowLeft,
  Printer,
  Building2,
  User,
  AlertTriangle,
  Check,
  ExternalLink
} from "lucide-react";
import { ContrailCurves } from "./BrandHeader";

interface ReportViewProps {
  interview: Interview;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const ReportView: React.FC<ReportViewProps> = ({
  interview,
  onBack,
  showBackButton = true
}) => {
  const [downloaded, setDownloaded] = useState(false);

  const matrizInfo =
    MATRIZ_EVALUACION[interview.nivel_madurez] ||
    MATRIZ_EVALUACION["Nivel 1: Inicial / Disperso"];

  const reportDate = (interview.created_at ?? "").substring(0, 10) || "Sin fecha";

  const handleDownloadTxt = () => {
    const resumenTxt = `# REPORTE DE EVALUACIÓN DE MADUREZ DE DATOS & BI
I+S DATA SOLUTIONS — Information + Solutions
========================================================================
Empresa: ${interview.empresa}
Responsable: ${interview.responsable_nombre} ${interview.responsable_rol ? `(${interview.responsable_rol})` : ""}
Sector: ${interview.sector}${interview.sector === "Otro" && interview.sector_otro ? ` (${interview.sector_otro})` : ""}
Fecha: ${reportDate}
Puntaje Global: ${interview.score_global}/100
Nivel de Madurez: ${interview.nivel_madurez}

CRITERIO DIAGNÓSTICO:
${matrizInfo.criterio}

SOLUCIÓN INICIAL RECOMENDADA:
${matrizInfo.solucion}

PLAN DE ACCIÓN:
${matrizInfo.prioridades_clave.map((p, idx) => `Paso ${idx + 1}: ${p}`).join("\n")}

PROCESO PRIORITARIO: ${interview.proceso_prioritario}${interview.proceso_prioritario === "Otro" && interview.proceso_prioritario_otro ? ` (${interview.proceso_prioritario_otro})` : ""}
VALOR ESPERADO: ${interview.valor_esperado}
OBSERVACIONES: ${interview.observaciones_consultor || "Sin observaciones"}
EVALUADOR: ${interview.entrevistador || "Autodiagnóstico"}
========================================================================
I+S DATA SOLUTIONS — ${COMPANY_LOCATION}
`;

    const blob = new Blob([resumenTxt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `diagnostico_bi_${(interview.empresa || "organizacion").toLowerCase().replace(/[^a-z0-9]/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 3500);
  };

  const handlePrint = () => {
    window.print();
  };

  const sectorDisplay =
    interview.sector === "Otro" && interview.sector_otro
      ? `Otro (${interview.sector_otro})`
      : interview.sector;

  const procesoPrioDisplay =
    interview.proceso_prioritario === "Otro" && interview.proceso_prioritario_otro
      ? `Otro (${interview.proceso_prioritario_otro})`
      : interview.proceso_prioritario;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        {showBackButton && onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold text-[#1E252D] bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-xs cursor-pointer font-['Outfit']"
          >
            <ArrowLeft className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
            Volver al Listado
          </button>
        ) : (
          <div />
        )}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold text-[#1E252D] bg-white border border-[#E4ECF2] rounded-xl hover:bg-[#F5F8FB] transition-colors shadow-xs cursor-pointer font-['Outfit']"
          >
            <Printer className="w-4 h-4 text-slate-600" aria-hidden="true" />
            Imprimir
          </button>
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="inline-flex items-center gap-2 px-4 py-2 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold text-white btn-primary cursor-pointer"
          >
            {downloaded ? (
              <>
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Informe descargado</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Descargar Informe (.txt)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Executive Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] shadow-[0px_4px_16px_rgba(30,37,45,0.08)] bg-[#1E252D] text-white">
        <ContrailCurves className="opacity-40" />

        <div className="relative p-5 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-sky-200">
              <span className="font-semibold tracking-wider uppercase text-[#D4C0B2] font-['Outfit']">
                INFORME DE EVALUACIÓN BI
              </span>
              <span aria-hidden="true" className="text-[#7EBCE6]/60">·</span>
              <span className="font-mono tabular-nums text-sky-200">
                {reportDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-medium text-white tracking-wide font-['Outfit']">
              {interview.empresa}
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-sky-100/90 pt-0.5 font-['Inter']">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#7EBCE6]" aria-hidden="true" />
                <span className="font-medium text-white">{interview.responsable_nombre}</span>
                {interview.responsable_rol && ` (${interview.responsable_rol})`}
              </span>
              <span aria-hidden="true" className="text-sky-300/40">·</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#7EBCE6]" aria-hidden="true" />
                <span>{sectorDisplay}</span>
              </span>
              <span aria-hidden="true" className="text-sky-300/40">·</span>
              <span className="font-mono tabular-nums text-sky-200">
                {interview.colaboradores} colaboradores
              </span>
            </div>
          </div>

          <div className="self-start md:self-auto p-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md min-w-[210px] text-left md:text-right">
            <span className="text-xs uppercase font-semibold tracking-wider text-sky-200 block font-['Outfit']">
              Diagnóstico Oficial
            </span>
            <div className="text-base sm:text-lg font-medium text-white mt-1 font-['Outfit']">
              {interview.nivel_madurez}
            </div>
            <div className="text-xs text-sky-100 font-mono tabular-nums mt-1">
              Score: <span className="text-base font-semibold text-white">{interview.score_global}</span> / 100 pts
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Grid: Gauge & Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-[#1E252D] mb-3 flex items-center gap-2 font-['Outfit']">
            <span className="text-[#2C6E9E]" aria-hidden="true">✦</span> Índice de Madurez Global
          </h2>
          <div className="flex-1 flex flex-col [&>*]:flex-1">
            <GaugeChart
              value={interview.score_global}
              label="Nivel de Preparación BI"
              badgeColor={matrizInfo.badge_color}
            />
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-[#1E252D] mb-3 flex items-center gap-2 font-['Outfit']">
            <span className="text-[#2C6E9E]" aria-hidden="true">✦</span> Evaluación por Dimensiones Clave
          </h2>
          <div className="flex-1 flex flex-col [&>*]:flex-1">
            <RadarChart dimensiones={interview.dimensiones} />
          </div>
        </div>
      </div>

      {/* Official Matrix Recommendation Cards */}
      <div className="border-t border-[#E4ECF2] pt-6 space-y-3">
        <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] flex items-center gap-2 font-['Outfit']">
          <span className="text-[#2C6E9E]" aria-hidden="true">✦</span> Dictamen y Solución Recomendada (Matriz Oficial)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-[#E4ECF2] bg-white shadow-xs space-y-2">
            <div className="text-xs font-semibold text-slate-600 font-['Outfit']">
              Criterio Diagnóstico
            </div>
            <p className="text-sm text-slate-700 leading-relaxed font-normal font-['Inter']">
              {matrizInfo.criterio}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl border border-[#7EBCE6]/50 bg-sky-50/40 shadow-xs space-y-2">
            <div className="text-xs font-semibold text-[#2C6E9E] font-['Outfit']">
              Solución Inicial Recomendada
            </div>
            <p className="text-sm text-[#1E252D] leading-relaxed font-medium font-['Inter']">
              {matrizInfo.solucion}
            </p>
          </div>
        </div>
      </div>

      {/* Action Plan Steps */}
      <div>
        <h3 className="text-sm font-semibold text-[#1E252D] mb-3 font-['Outfit']">
          Plan de Acción y Prioridades Clave
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {matrizInfo.prioridades_clave.map((paso, idx) => (
            <div
              key={paso}
              className="bg-white p-4 rounded-2xl border border-[#E4ECF2] shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold font-mono text-[#2C6E9E] tracking-wider uppercase block mb-1">
                  PASO {idx + 1}
                </span>
                <p className="text-sm text-slate-700 font-normal leading-snug font-['Inter']">
                  {paso}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Survey Findings */}
      <div className="border-t border-[#E4ECF2] pt-6">
        <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] mb-4 flex items-center gap-2 font-['Outfit']">
          <span className="text-[#2C6E9E]" aria-hidden="true">✦</span> Detalle del Diagnóstico de Información
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Infrastructure */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3 font-['Inter']">
            <h3 className="text-sm font-semibold text-[#1E252D] border-b border-[#E4ECF2] pb-2 font-['Outfit']">
              Infraestructura y Datos Actuales
            </h3>
            <div className="space-y-2 text-sm text-slate-700">
              <div>
                <span className="font-medium text-[#1E252D]">Integración entre áreas: </span>
                {interview.integracion_nivel}
              </div>
              <div>
                <span className="font-medium text-[#1E252D]">Frecuencia de actualización: </span>
                {interview.frecuencia_actualizacion}
              </div>
              <div>
                <span className="font-medium text-[#1E252D]">Confianza en los datos: </span>
                {interview.confianza_datos}
              </div>
              <div>
                <span className="font-medium text-[#1E252D]">Herramienta actual: </span>
                {interview.herramienta_visualizacion}
              </div>
              <div>
                <span className="font-medium text-[#1E252D]">Tiempo de reportabilidad: </span>
                {interview.tiempo_reporte}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E4ECF2]">
              <span className="font-medium text-[#1E252D] text-xs block mb-1.5 font-['Outfit']">
                Fuentes donde se almacena la información:
              </span>
              {interview.almacenamiento_fuentes && interview.almacenamiento_fuentes.length > 0 ? (
                <ul className="space-y-1">
                  {interview.almacenamiento_fuentes.map((f) => (
                    <li key={f} className="text-xs sm:text-sm text-slate-700 flex items-start gap-1.5">
                      <span className="text-[#2C6E9E] mt-0.5" aria-hidden="true">•</span>
                      <span>
                        {f}
                        {f === "Otro" && interview.almacenamiento_otro
                          ? ` (${interview.almacenamiento_otro})`
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-600 italic">No especificadas</span>
              )}
            </div>
          </div>

          {/* Column 2: Objectives & Obstacles */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3 font-['Inter']">
            <h3 className="text-sm font-semibold text-[#1E252D] border-b border-[#E4ECF2] pb-2 font-['Outfit']">
              Objetivos y Expectativas del Cliente
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
              <div>
                <span className="font-medium text-[#1E252D]">Proceso prioritario: </span>
                <span className="text-[#2C6E9E] font-semibold">
                  {procesoPrioDisplay}
                </span>
              </div>
              <div>
                <span className="font-medium text-[#1E252D]">Valor principal esperado: </span>
                <div className="text-slate-700 font-normal mt-0.5">{interview.valor_esperado}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E4ECF2]">
              <span className="font-medium text-[#1E252D] text-xs block mb-1.5 font-['Outfit']">
                Principales obstáculos reportados:
              </span>
              {interview.obstaculos_decision && interview.obstaculos_decision.length > 0 ? (
                <ul className="space-y-1.5">
                  {interview.obstaculos_decision.map((obs) => (
                    <li
                      key={obs}
                      className="text-xs sm:text-sm text-slate-700 bg-[#F5F8FB] px-3 py-2 rounded-xl border border-[#E4ECF2] flex items-center gap-2"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-[#7A5F4B] shrink-0" aria-hidden="true" />
                      <span>{obs}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-xs text-slate-600 italic">Ninguno especificado</span>
              )}
            </div>

            {interview.observaciones_consultor && (
              <div className="pt-2 border-t border-[#E4ECF2]">
                <span className="font-medium text-[#1E252D] text-xs block mb-1 font-['Outfit']">
                  Observaciones adicionales:
                </span>
                <div className="bg-sky-50/40 border border-[#7EBCE6]/40 rounded-xl p-3 text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  "{interview.observaciones_consultor}"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post-Diagnostic Next Step CTA */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] bg-[#1E252D] text-white p-5 sm:p-7 print:hidden">
        <ContrailCurves className="opacity-25" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="text-xs font-semibold text-[#D4C0B2] uppercase tracking-wider font-['Outfit']">
              Siguiente paso sugerido
            </div>
            <h2 className="text-lg sm:text-xl font-medium text-white font-['Outfit']">
              ¿Querés revisar este diagnóstico con I+S Data Solutions?
            </h2>
            <p className="text-sm text-sky-100 leading-relaxed">
              Descargá el archivo .txt y compartilo por LinkedIn para analizar juntos una hoja de ruta concreta para tu primer tablero de control.
            </p>
          </div>
          <a
            href={LINKEDIN_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl bg-[#0A66C2] hover:bg-[#0958A8] text-white text-sm font-semibold font-['Outfit'] transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <LinkedInIcon className="w-4 h-4" />
            <span>Conversar en LinkedIn</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
      </section>
    </div>
  );
};
