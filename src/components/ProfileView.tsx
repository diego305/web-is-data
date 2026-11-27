import React from "react";
import { BrandBanner, ContrailCurves } from "./BrandHeader";
import { LinkedInIcon } from "./LinkedInIcon";
import { LINKEDIN_PROFILE_URL } from "../config/constants";
import {
  ArrowRight,
  ExternalLink,
  MapPin,
  Briefcase,
  GraduationCap,
  Layers
} from "lucide-react";

interface ProfileViewProps {
  onStartDiagnostic?: () => void;
}

const EXPERIENCE_ITEMS = [
  {
    role: "Director General de Análisis de Datos",
    organization: "Secretaría de Gestión Estratégica · Jefatura de Gabinete · Gobierno de La Rioja",
    period: "Dic. 2019 — Actualidad",
    location: "La Rioja Capital, Argentina",
    summary:
      "Liderazgo de equipos técnicos orientados al procesamiento de información estratégica, control de gestión y soporte analítico para la toma de decisiones en políticas públicas.",
    highlights: [
      "Diseño y despliegue de tableros de comando e informes ejecutivos para la alta dirección.",
      "Procesamiento y sistematización de grandes volúmenes de datos interinstitucionales.",
      "Implementación y administración de sistemas de gestión digital y expedientes electrónicos (Selex).",
      "Participación en instancias de intercambio interinstitucional sobre analítica y planificación estratégica."
    ]
  },
  {
    role: "Fundador & Consultor en Business Intelligence",
    organization: "Information + Solutions (I+S Data Solutions)",
    period: "Consultoría independiente",
    location: "La Rioja, Argentina",
    summary:
      "Acompañamiento a empresas, unidades productivas e instituciones en la transformación de registros dispersos en ecosistemas visuales de control y analítica aplicada al negocio.",
    highlights: [
      "Relevamiento y diagnóstico de madurez de datos para PyMEs, comercio y sector agroindustrial.",
      "Normalización de fuentes heterogéneas (ERP, planillas, facturación y CRM) y definición de KPIs críticos.",
      "Construcción de tableros interactivos accesibles desde web y dispositivos móviles con capacitación para adopción autónoma."
    ]
  }
];

const EDUCATION_ITEMS = [
  {
    degree: "Tecnicatura en Ciencia de Datos",
    institution: "Universidad Nacional de Chilecito (UNdeC)",
    focus:
      "Formación orientada al análisis estadístico, programación aplicada a datos, modelado predictivo y explotación de información a escala."
  },
  {
    degree: "Formación de Base en Comercialización",
    institution: "Orientación Comercial y Estratégica",
    focus:
      "Base de negocio enfocada en análisis de mercados, rentabilidad, procesos comerciales y lectura ejecutiva de indicadores."
  },
  {
    degree: "Especializaciones y Certificaciones Técnicas",
    institution: "Formación continua en Analítica & BI",
    focus:
      "Capacitación especializada en Power BI, Tableau, Looker Studio, Python, Machine Learning, Análisis Exploratorio de Datos (EDA), Big Data, SIG/GIS y metodologías ágiles."
  }
];

const SKILL_DOMAINS = [
  {
    title: "Visualización & Business Intelligence",
    items: [
      "Power BI (modelado y tableros ejecutivos)",
      "Tableau y Looker Studio (Google Data Studio)",
      "Diseño de tableros de comando e infografías",
      "Control de gestión y definición de KPIs"
    ]
  },
  {
    title: "Ciencia de Datos & Procesamiento",
    items: [
      "Python aplicado al análisis de datos",
      "Análisis Exploratorio de Datos (EDA)",
      "Fundamentos de Machine Learning y Big Data",
      "Limpieza, integración y calidad de datos"
    ]
  },
  {
    title: "Gestión Estratégica & Territorio",
    items: [
      "Sistemas de Información Geográfica (SIG / GIS)",
      "Metodologías ágiles en proyectos de datos",
      "Gestión documental y expedientes digitales (Selex)",
      "Visión comercial aplicada a decisiones directivas"
    ]
  }
];

export const ProfileView: React.FC<ProfileViewProps> = ({ onStartDiagnostic }) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-['Inter']">
      {/* Hero Banner */}
      <BrandBanner
        title="Diego Jesús Andrada"
        subtitle="Ciencia de Datos, Business Intelligence y Analítica para la Toma de Decisiones Estratégicas"
        categoryTag="PERFIL PROFESIONAL"
        compact
      />

      {/* Executive Profile Overview */}
      <section className="bg-white rounded-2xl border border-[#E4ECF2] shadow-xs p-4 sm:p-7">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Brand-aligned Monogram Avatar */}
            <div
              style={{
                background: "linear-gradient(135deg, #3B8AC4 0%, #1E5E94 100%)",
                boxShadow: "0px 4px 14px rgba(59, 138, 196, 0.28)"
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 flex items-center justify-center border border-white/25 text-white font-['Outfit'] font-semibold text-xl sm:text-2xl tracking-tight select-none"
              aria-label="Iniciales de Diego Jesús Andrada"
            >
              DA
            </div>

            <div className="space-y-2 min-w-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1E252D] font-['Outfit'] tracking-tight">
                  Diego Jesús Andrada
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#2C6E9E] mt-0.5">
                  Director General de Análisis de Datos · Consultor en Business Intelligence &amp; Ciencia de Datos
                </p>
              </div>

              {/* Clean unboxed metadata row */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#3B8AC4]" />
                  La Rioja Capital, Argentina
                </span>
                <span aria-hidden="true">·</span>
                <span>Information + Solutions</span>
                <span aria-hidden="true">·</span>
                <span>LinkedIn /in/diegoandrada</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0A66C2] hover:bg-[#0958A8] text-white text-xs font-semibold font-['Outfit'] transition-colors whitespace-nowrap shrink-0"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              <span>Ver perfil en LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#E4ECF2] space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">
          <p>
            Profesional radicado en <strong className="text-[#1E252D]">La Rioja Capital</strong> que combina una formación de base en <strong className="text-[#1E252D]">Comercialización</strong> con especialización técnica en <strong className="text-[#1E252D]">Ciencia de Datos y Business Intelligence</strong>.
          </p>
          <p>
            Su enfoque une la comprensión práctica de los objetivos comerciales y operativos con el procesamiento, modelado y visualización de datos a escala, transformando información dispersa en tableros claros y accionables para optimizar procesos y respaldar decisiones estratégicas tanto en organizaciones públicas como privadas.
          </p>
        </div>

        {/* Summary Highlights Row */}
        <div className="mt-6 pt-5 border-t border-[#E4ECF2] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="text-[11px] font-medium text-slate-600">Foco principal</div>
            <div className="text-sm font-semibold text-[#1E252D] font-['Outfit'] mt-0.5">
              Business Intelligence &amp; Data Science
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-600">Herramientas centrales</div>
            <div className="text-sm font-semibold text-[#1E252D] font-['Outfit'] mt-0.5">
              Power BI · Tableau · Looker Studio · Python
            </div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-600">Ámbito de impacto</div>
            <div className="text-sm font-semibold text-[#1E252D] font-['Outfit'] mt-0.5">
              Gestión Pública, PyMEs y Sector Productivo
            </div>
          </div>
        </div>
      </section>

      {/* 01. Trayectoria Profesional */}
      <section className="bg-white rounded-2xl border border-[#E4ECF2] shadow-xs p-4 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4ECF2] pb-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-4 h-4 text-[#2C6E9E] shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-[#1E252D] font-['Outfit']">
              01. Experiencia y Liderazgo en Datos
            </h3>
          </div>
          <span className="text-xs text-slate-600">
            Sector Público &amp; Consultoría
          </span>
        </div>

        <div className="divide-y divide-[#E4ECF2]">
          {EXPERIENCE_ITEMS.map((item, idx) => (
            <div key={item.role} className={idx === 0 ? "pb-6" : "pt-6"}>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <h4 className="text-sm sm:text-base font-semibold text-[#1E252D] font-['Outfit']">
                  {item.role}
                </h4>
                <span className="text-xs font-mono tabular-nums text-[#2C6E9E] font-medium shrink-0">
                  {item.period}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600 mt-1">
                <span className="font-medium text-slate-700">{item.organization}</span>
                <span aria-hidden="true">·</span>
                <span>{item.location}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-3">
                {item.summary}
              </p>

              <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs text-slate-700">
                {item.highlights.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#3B8AC4] font-bold mt-0.5" aria-hidden="true">
                      •
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 02. Formación Académica */}
      <section className="bg-white rounded-2xl border border-[#E4ECF2] shadow-xs p-4 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4ECF2] pb-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-[#7A5F4B] shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-[#1E252D] font-['Outfit']">
              02. Formación Académica y Especializaciones
            </h3>
          </div>
          <span className="text-xs text-slate-600">
            Negocio &amp; Tecnología
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION_ITEMS.map((edu, index) => (
            <div
              key={edu.degree}
              className={`space-y-2 ${
                index > 0 ? "md:border-l md:border-[#E4ECF2] md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#E4ECF2]" : ""
              }`}
            >
              <div className="text-xs font-mono tabular-nums text-slate-600">
                0{index + 1}
              </div>
              <h4 className="text-sm font-semibold text-[#1E252D] font-['Outfit'] leading-snug">
                {edu.degree}
              </h4>
              <div className="text-xs font-medium text-[#2C6E9E]">
                {edu.institution}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {edu.focus}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 03. Stack Técnico y Competencias */}
      <section className="bg-white rounded-2xl border border-[#E4ECF2] shadow-xs p-4 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4ECF2] pb-4">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-[#2C6E9E] shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-[#1E252D] font-['Outfit']">
              03. Stack Tecnológico y Competencias Clave
            </h3>
          </div>
          <span className="text-xs text-slate-600">
            Herramientas &amp; Metodologías
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SKILL_DOMAINS.map((domain, index) => (
            <div
              key={domain.title}
              className={`space-y-3 ${
                index > 0 ? "md:border-l md:border-[#E4ECF2] md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-[#E4ECF2]" : ""
              }`}
            >
              <h4 className="text-xs font-semibold text-[#1E252D] font-['Outfit'] tracking-wide">
                {domain.title}
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {domain.items.map((skill) => (
                  <li key={skill} className="flex items-start gap-2 leading-snug">
                    <span className="text-[#3B8AC4] font-bold" aria-hidden="true">
                      –
                    </span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 04. Cierre y Conexión */}
      <section className="relative rounded-2xl overflow-hidden border border-[#E4ECF2] shadow-[0px_4px_16px_rgba(30,37,45,0.08)] bg-[#1E252D] text-white p-5 sm:p-8">
        <ContrailCurves className="opacity-30" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="text-xs font-semibold text-[#D4C0B2] uppercase tracking-wider font-['Outfit']">
              Conexión directa y consultoría
            </div>
            <h3 className="text-lg sm:text-xl font-medium text-white font-['Outfit'] tracking-wide">
              ¿Querés conocer el detalle completo de mi trayectoria o evaluar un proyecto de BI?
            </h3>
            <p className="text-sm text-sky-100 leading-relaxed">
              Podés conectar directamente por LinkedIn o completar el diagnóstico inicial para recibir una evaluación automatizada del nivel de madurez de datos de tu organización.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-[#0A66C2] hover:bg-[#0958A8] text-white text-xs font-semibold font-['Outfit'] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Ir a LinkedIn</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            {onStartDiagnostic && (
              <button
                type="button"
                onClick={onStartDiagnostic}
                className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold font-['Outfit'] transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>Iniciar Diagnóstico</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
