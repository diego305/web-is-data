import React from "react";
import { BrandBanner, ContrailCurves } from "./BrandHeader";
import { LinkedInIcon } from "./LinkedInIcon";
import { COMPANY_ADDRESS, LINKEDIN_PROFILE_URL } from "../config/constants";
import {
  ShieldCheck,
  MapPin,
  ExternalLink,
  ArrowRight,
  FileCheck2
} from "lucide-react";

interface ProposalViewProps {
  onStartDiagnostic?: () => void;
  onViewModel?: () => void;
}

const SECTION_ANCHORS = [
  { id: "propuesta-quienes", label: "Quiénes somos" },
  { id: "propuesta-enfoque", label: "Enfoque" },
  { id: "propuesta-producto", label: "Producto y fases" },
  { id: "propuesta-trayectoria", label: "Trayectoria" },
  { id: "propuesta-contacto", label: "Contacto" }
];

export const ProposalView: React.FC<ProposalViewProps> = ({
  onStartDiagnostic,
  onViewModel
}) => {
  const scrollToAnchor = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5 sm:space-y-6 pb-12 font-['Inter']">
      {/* Brand Hero Banner */}
      <BrandBanner
        title="Propuesta de Servicios y Modelo de Trabajo"
        subtitle="Inteligencia de Datos para Decisiones Estratégicas en Empresas y Productores"
        categoryTag="MODELO DE TRABAJO I+S"
      />

      {/* Quick Action Bar & In-page Section Anchors */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="text-sm font-semibold text-[#1E252D] font-['Outfit']">
              ¿Querés conocer el nivel de madurez de datos de tu organización?
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Completá el autodiagnóstico gratuito en 5 minutos o revisá un ejemplo completo antes de empezar.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {onStartDiagnostic && (
              <button
                type="button"
                onClick={onStartDiagnostic}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-white btn-primary whitespace-nowrap cursor-pointer"
              >
                <span>Hacer Diagnóstico (5 min)</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
            {onViewModel && (
              <button
                type="button"
                onClick={onViewModel}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] text-sm font-semibold text-[#1E252D] bg-[#F5F8FB] hover:bg-[#EDF4FA] border border-[#E4ECF2] rounded-xl whitespace-nowrap cursor-pointer font-['Outfit'] transition-colors"
              >
                <FileCheck2 className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
                <span>Ver Caso Modelo</span>
              </button>
            )}
          </div>
        </div>

        <nav
          aria-label="Índice de la propuesta"
          className="pt-3 border-t border-[#E4ECF2]"
        >
          <div className="mobile-nav-strip">
            {SECTION_ANCHORS.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                onClick={(e) => scrollToAnchor(e, anchor.id)}
                className="shrink-0 inline-flex items-center px-3 py-1.5 min-h-[36px] rounded-lg bg-[#F5F8FB] hover:bg-[#EDF4FA] border border-[#E4ECF2] text-xs font-medium text-slate-700 hover:text-[#2C6E9E] transition-colors whitespace-nowrap"
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </nav>
      </div>

      <div className="space-y-5 sm:space-y-6">
        {/* 1. Quiénes Somos */}
        <section
          id="propuesta-quienes"
          className="scroll-mt-32 lg:scroll-mt-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3"
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] tracking-tight font-['Outfit']">
            01. Quiénes Somos y Filosofía
          </h2>
          <blockquote className="p-4 rounded-xl bg-sky-50/50 border border-[#7EBCE6]/40 text-sm font-medium text-[#1E252D] italic">
            "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
          </blockquote>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            En un entorno productivo y comercial cada vez más dinámico, las organizaciones no sufren por falta de información, sino por la dificultad de procesarla a tiempo y con precisión.
          </p>
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            <strong className="text-[#1E252D]">I+S Data Solutions</strong> es una consultora interdisciplinaria que ayuda a empresas, instituciones y unidades productivas a transformar registros dispersos en <strong className="text-[#1E252D]">sistemas visuales de control y análisis en tiempo real</strong>. Conectamos la realidad operativa con herramientas modernas de Business Intelligence para que cada decisión estratégica esté respaldada por evidencia concreta y confiable.
          </p>
        </section>

        {/* 2. Nuestro Enfoque */}
        <section
          id="propuesta-enfoque"
          className="scroll-mt-32 lg:scroll-mt-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4"
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] tracking-tight font-['Outfit']">
            02. Nuestro Enfoque: De los datos aislados a la acción concreta
          </h2>

          {/* Pipeline Visual 4 Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#F5F8FB] p-4 rounded-xl border border-[#E4ECF2] text-left sm:text-center flex flex-col justify-between">
              <div className="text-lg font-semibold mb-1 text-slate-600 font-['Outfit']">01</div>
              <div className="font-semibold text-[#1E252D] text-sm font-['Outfit']">Fuentes de Datos</div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-snug">
                Planillas, ERP, comprobantes y CRM dispersos.
              </p>
            </div>

            <div className="bg-sky-50/40 p-4 rounded-xl border border-[#7EBCE6]/40 text-left sm:text-center flex flex-col justify-between">
              <div className="text-lg font-semibold mb-1 text-[#2C6E9E] font-['Outfit']">02</div>
              <div className="font-semibold text-[#2C6E9E] text-sm font-['Outfit']">Integración y Limpieza</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-snug">
                Normalización y diccionario de métricas único.
              </p>
            </div>

            <div className="bg-[#FAF7F5] p-4 rounded-xl border border-[#BFA898]/50 text-left sm:text-center flex flex-col justify-between">
              <div className="text-lg font-semibold mb-1 text-[#7A5F4B] font-['Outfit']">03</div>
              <div className="font-semibold text-[#7A5F4B] text-sm font-['Outfit']">Tableros Interactivos</div>
              <p className="text-xs sm:text-sm text-slate-700 mt-1 leading-snug">
                Dashboards web y móviles con filtros ágiles.
              </p>
            </div>

            <div className="bg-[#F0FDF4] p-4 rounded-xl border border-emerald-200 text-left sm:text-center flex flex-col justify-between">
              <div className="text-lg font-semibold mb-1 text-emerald-700 font-['Outfit']">04</div>
              <div className="font-semibold text-emerald-800 text-sm font-['Outfit']">Decisión Asertiva</div>
              <p className="text-xs sm:text-sm text-emerald-800 mt-1 leading-snug">
                Anticipación de desvíos, ahorro de horas y margen.
              </p>
            </div>
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-[#E4ECF2]">
            <div className="text-sm text-slate-700">
              <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Objetividad:</strong>
              Métricas estandarizadas sin interpretaciones contradictorias entre departamentos.
            </div>
            <div className="text-sm text-slate-700">
              <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Oportunidad:</strong>
              Disponibilidad de indicadores clave en tiempo real, sin demoras operativas.
            </div>
            <div className="text-sm text-slate-700">
              <strong className="text-[#1E252D] block mb-0.5 font-['Outfit'] font-semibold">Claridad:</strong>
              Información visual, interactiva y accesible para los niveles directivos y mandos medios.
            </div>
          </div>
        </section>

        {/* 3. Nuestro Producto */}
        <section
          id="propuesta-producto"
          className="scroll-mt-32 lg:scroll-mt-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-4"
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] tracking-tight font-['Outfit']">
            03. Nuestro Producto: Business Intelligence y Analítica de Gestión
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Un servicio integral diseñado para ordenar el ecosistema de información de su empresa y desplegar tableros de control interactivos que simplifican el seguimiento de sus objetivos.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Problems */}
            <div className="bg-[#FAF7F5] border border-[#BFA898]/50 rounded-xl p-4 sm:p-5 space-y-2.5">
              <h3 className="text-sm font-semibold text-[#7A5F4B] font-['Outfit']">
                ¿Qué problemas resolvemos?
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#7A5F4B]" aria-hidden="true">•</span>
                  <span>
                    <strong className="text-[#1E252D]">Fin de planillas fragmentadas:</strong> Eliminamos inconsistencias entre archivos que no coinciden.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#7A5F4B]" aria-hidden="true">•</span>
                  <span>
                    <strong className="text-[#1E252D]">Ahorro de horas manuales:</strong> Chau al armado repetitivo y estresante de reportes a fin de mes.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-[#7A5F4B]" aria-hidden="true">•</span>
                  <span>
                    <strong className="text-[#1E252D]">Detección temprana de desvíos:</strong> Alertas visibles en costos, márgenes, compras y cobranzas.
                  </span>
                </li>
              </ul>
            </div>

            {/* Box Phases */}
            <div className="bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl p-4 sm:p-5 space-y-2.5">
              <h3 className="text-sm font-semibold text-[#2C6E9E] font-['Outfit']">
                Fases de Implementación
              </h3>
              <div className="text-sm">
                <div className="font-semibold text-[#1E252D] font-['Outfit']">1. Auditoría e Integración:</div>
                <div className="text-slate-600">Conexión de datos existentes (ERP, hojas de cálculo, comprobantes fiscales, CRM).</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#1E252D] font-['Outfit']">2. Modelado y Gobernanza:</div>
                <div className="text-slate-600">Definición de KPIs críticos con diccionario unificado de métricas.</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#1E252D] font-['Outfit']">3. Tableros Interactivos:</div>
                <div className="text-slate-600">Despliegue en la nube accesible desde PC y dispositivos móviles.</div>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-[#1E252D] font-['Outfit']">4. Capacitación y Adopción:</div>
                <div className="text-slate-600">Transferencia práctica para uso autónomo continuo.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Trayectoria y Respaldo */}
        <section
          id="propuesta-trayectoria"
          className="scroll-mt-32 lg:scroll-mt-6 bg-white p-4 sm:p-6 rounded-2xl border border-[#E4ECF2] shadow-xs space-y-3"
        >
          <h2 className="text-base sm:text-lg font-semibold text-[#1E252D] tracking-tight font-['Outfit']">
            04. Trayectoria y Respaldo Regional
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Contamos con una sólida experiencia en el análisis y sistematización de datos estratégicos para sectores clave de la región:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            <div className="p-4 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
              <div className="font-semibold text-[#1E252D] text-sm mb-1 font-['Outfit']">Sector Agroindustrial y Olivícola</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                Sinopsis estadísticas, mapeos territoriales, costos y rendimientos productivos.
              </p>
            </div>
            <div className="p-4 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
              <div className="font-semibold text-[#1E252D] text-sm mb-1 font-['Outfit']">Instituciones y Cámaras</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                Plataformas de información para organismos de desarrollo productivo y colegios profesionales.
              </p>
            </div>
            <div className="p-4 bg-[#F5F8FB] border border-[#E4ECF2] rounded-xl">
              <div className="font-semibold text-[#1E252D] text-sm mb-1 font-['Outfit']">Consultoría Empresarial</div>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug">
                Asesoramiento técnico en estructuración de flujos de datos para decisiones gerenciales.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Contacto */}
        <section
          id="propuesta-contacto"
          className="scroll-mt-32 lg:scroll-mt-6 relative rounded-2xl overflow-hidden border border-[#E4ECF2] shadow-[0px_4px_16px_rgba(30,37,45,0.08)] bg-[#1E252D] text-white p-5 sm:p-8 space-y-3"
        >
          <ContrailCurves className="opacity-30" />
          <div className="relative">
            <h2 className="text-base sm:text-lg font-semibold tracking-wide text-[#D4C0B2] font-['Outfit']">
              Contacto e Inicio de Proyecto
            </h2>
            <p className="text-sm text-sky-100 font-normal mt-1">
              Comience a gestionar su organización sobre bases sólidas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-sky-100/95 pt-3">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#7EBCE6] shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong className="text-white">Ubicación:</strong> {COMPANY_ADDRESS}.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#7EBCE6] shrink-0 mt-1" aria-hidden="true" />
                <span>
                  <strong className="text-white">Diagnóstico inicial sin cargo:</strong> Evaluamos el estado actual de los datos de su empresa y le presentamos una propuesta a medida para su primer tablero de control.
                </span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-sky-100/90">
                ¿Querés conversar directamente o evaluar el nivel actual de tu organización?
              </span>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {onStartDiagnostic && (
                  <button
                    type="button"
                    onClick={onStartDiagnostic}
                    className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-semibold text-white btn-primary whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Iniciar Diagnóstico</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
                <a
                  href={LINKEDIN_PROFILE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0A66C2] hover:bg-[#0958A8] text-white text-xs sm:text-sm font-semibold font-['Outfit'] transition-colors whitespace-nowrap shrink-0"
                >
                  <LinkedInIcon className="w-3.5 h-3.5" />
                  <span>Ver perfil en LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
