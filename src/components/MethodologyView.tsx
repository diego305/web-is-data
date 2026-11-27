import React from "react";
import { MATRIZ_EVALUACION } from "../config/constants";
import { BrandBanner, ContrailCurves } from "./BrandHeader";
import { ArrowRight } from "lucide-react";

interface MethodologyViewProps {
  onStartDiagnostic?: () => void;
}

export const MethodologyView: React.FC<MethodologyViewProps> = ({
  onStartDiagnostic
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 pb-12 font-['Inter']">
      {/* Compact Brand Hero Banner */}
      <BrandBanner
        title="Matriz Oficial de Evaluación Interna"
        subtitle="Criterios y soluciones recomendadas según el nivel de madurez analítica identificado"
        categoryTag="METODOLOGÍA I+S DATA SOLUTIONS"
        compact
      />

      {/* Cards list */}
      <div className="space-y-5">
        {Object.entries(MATRIZ_EVALUACION).map(([nivel, data]) => {
          return (
            <section
              key={nivel}
              className="bg-white border border-[#E4ECF2] rounded-2xl p-4 sm:p-6 shadow-xs space-y-4 transition-colors"
            >
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#E4ECF2]">
                <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] font-['Outfit'] tracking-tight">
                  {nivel}
                </h2>
                <span
                  className="text-xs font-semibold font-['Outfit']"
                  style={{ color: data.text_color }}
                >
                  Norma Oficial
                </span>
              </div>

              {/* Criterion */}
              <div className="p-4 bg-[#F5F8FB] rounded-xl border border-[#E4ECF2] space-y-1">
                <span className="text-xs font-semibold text-slate-600 block font-['Outfit']">
                  Criterio Diagnóstico
                </span>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {data.criterio}
                </p>
              </div>

              {/* Recommended Solution */}
              <div className="p-4 bg-sky-50/40 border border-[#7EBCE6]/50 rounded-xl space-y-1">
                <span className="text-xs font-semibold text-[#2C6E9E] block font-['Outfit']">
                  Solución Inicial Recomendada
                </span>
                <p className="text-sm text-[#1E252D] font-medium leading-relaxed">
                  {data.solucion}
                </p>
              </div>

              {/* Action Steps */}
              <div>
                <span className="text-xs font-semibold text-slate-600 block mb-2 font-['Outfit']">
                  Pasos de Ejecución Sugeridos
                </span>
                <ul className="space-y-2">
                  {data.prioridades_clave.map((paso, idx) => (
                    <li
                      key={paso}
                      className="text-sm text-slate-700 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-sky-50 text-[#2C6E9E] border border-[#7EBCE6]/50 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5 font-mono tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          );
        })}
      </div>

      {/* Closing CTA to eliminate dead-end navigation */}
      {onStartDiagnostic && (
        <section className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] bg-[#1E252D] text-white p-5 sm:p-7">
          <ContrailCurves className="opacity-25" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-xl">
              <h2 className="text-lg sm:text-xl font-medium text-white font-['Outfit']">
                Descubrí en qué nivel está tu organización
              </h2>
              <p className="text-sm text-sky-100 leading-relaxed">
                Respondé las 5 dimensiones del autodiagnóstico para obtener tu puntaje ponderado y el plan inicial recomendado.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartDiagnostic}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] text-sm font-semibold text-white btn-primary whitespace-nowrap shrink-0 cursor-pointer self-start md:self-auto"
            >
              <span>Iniciar Nuevo Diagnóstico</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
