import React, { useEffect, useState } from "react";
import {
  FileText,
  FileCheck2,
  Briefcase,
  HelpCircle,
  UserRound,
  Menu,
  X,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import { AppSquircleIcon } from "./BrandHeader";
import { LinkedInIcon } from "./LinkedInIcon";
import {
  COMPANY_LOCATION,
  LINKEDIN_PROFILE_URL
} from "../config/constants";

export type NavModule = "form" | "model" | "proposal" | "methodology" | "profile";

export const MODULE_HASH_MAP: Record<NavModule, string> = {
  proposal: "propuesta",
  form: "diagnostico",
  model: "modelo",
  methodology: "metodologia",
  profile: "perfil"
};

export function getModuleFromHash(hash: string): NavModule {
  const normalized = (hash || "").replace(/^#\/?/, "").toLowerCase().trim();
  switch (normalized) {
    case "diagnostico":
    case "form":
      return "form";
    case "modelo":
    case "model":
      return "model";
    case "metodologia":
    case "methodology":
      return "methodology";
    case "perfil":
    case "profile":
      return "profile";
    case "propuesta":
    case "proposal":
    default:
      return "proposal";
  }
}

interface NavigationProps {
  currentModule: NavModule;
  onSelectModule: (module: NavModule) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentModule,
  onSelectModule
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const menuItems: {
    id: NavModule;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "proposal",
      label: "Propuesta de Trabajo",
      shortLabel: "Propuesta",
      icon: <Briefcase className="w-4 h-4 text-[#7A5F4B]" aria-hidden="true" />
    },
    {
      id: "form",
      label: "Nuevo Diagnóstico",
      shortLabel: "Diagnóstico",
      icon: <FileText className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    },
    {
      id: "model",
      label: "Diagnóstico Modelo",
      shortLabel: "Caso Modelo",
      icon: <FileCheck2 className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    },
    {
      id: "methodology",
      label: "Matriz & Metodología",
      shortLabel: "Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-600" aria-hidden="true" />
    },
    {
      id: "profile",
      label: "Perfil Profesional",
      shortLabel: "Perfil",
      icon: <UserRound className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    }
  ];

  const handleSelect = (
    e: React.MouseEvent<HTMLAnchorElement>,
    mod: NavModule
  ) => {
    e.preventDefault();
    onSelectModule(mod);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sticky Top Bar + Always-Visible Quick Section Strip */}
      <div className="lg:hidden print:hidden sticky top-0 z-40">
        <header className="flex items-center justify-between px-3.5 py-2.5 glass-header">
          <a
            href={`#${MODULE_HASH_MAP.proposal}`}
            onClick={(e) => handleSelect(e, "proposal")}
            className="flex items-center gap-2.5 min-h-[44px] text-left"
          >
            <AppSquircleIcon size={36} />
            <div>
              <div className="text-sm font-semibold text-[#1E252D] font-['Outfit'] tracking-tight leading-tight">
                Information + Solutions
              </div>
              <div className="text-[11px] text-[#2C6E9E] font-semibold tracking-wider uppercase font-['Outfit']">
                Data Solutions
              </div>
            </div>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E252D] hover:bg-white rounded-xl border border-[#E4ECF2] bg-white/90 cursor-pointer transition-colors"
            aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
            aria-expanded={mobileOpen}
            aria-controls="sidebar-nav"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </header>

        {/* Quick Section Strip: makes all 5 sections immediately discoverable on mobile */}
        <nav
          aria-label="Acceso rápido a secciones"
          className="bg-white/95 backdrop-blur-xs border-b border-[#E4ECF2] px-3 py-2"
        >
          <div className="mobile-nav-strip">
            {menuItems.map((item) => {
              const active = currentModule === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${MODULE_HASH_MAP[item.id]}`}
                  onClick={(e) => handleSelect(e, item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`shrink-0 inline-flex items-center px-3.5 py-2 min-h-[40px] rounded-xl text-xs font-semibold font-['Outfit'] transition-colors whitespace-nowrap ${
                    active
                      ? "bg-[#2C6E9E] text-white shadow-xs"
                      : "bg-[#F5F8FB] text-[#1E252D] border border-[#E4ECF2] hover:bg-[#EDF4FA]"
                  }`}
                >
                  {item.shortLabel}
                </a>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#1E252D]/40 backdrop-blur-xs z-40 lg:hidden print:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        id="sidebar-nav"
        aria-label="Navegación principal"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F5F8FB] border-r border-[#E4ECF2] flex flex-col p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 lg:visible print:hidden ${
          mobileOpen ? "translate-x-0 visible" : "-translate-x-full invisible"
        }`}
      >
        {/* Brand Header */}
        <div className="pb-4 mb-4 border-b border-[#E4ECF2] flex items-center justify-between">
          <a
            href={`#${MODULE_HASH_MAP.proposal}`}
            onClick={(e) => handleSelect(e, "proposal")}
            className="flex items-center gap-3"
          >
            <AppSquircleIcon size={42} />
            <div>
              <div className="text-sm font-semibold text-[#1E252D] tracking-tight font-['Outfit'] leading-tight">
                Information + Solutions
              </div>
              <div className="text-[11px] font-semibold text-[#2C6E9E] tracking-widest uppercase font-['Outfit'] mt-0.5">
                Data Solutions
              </div>
            </div>
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú de navegación"
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-600 hover:text-[#1E252D] hover:bg-white rounded-xl cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <div className="mb-2 overflow-y-auto">
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = currentModule === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${MODULE_HASH_MAP[item.id]}`}
                  onClick={(e) => handleSelect(e, item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "bg-white text-[#2C6E9E] border border-[#7EBCE6]/70 shadow-xs font-semibold"
                      : "bg-transparent text-slate-700 hover:bg-white/80 hover:text-[#1E252D]"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="font-['Inter']">{item.label}</span>
                  </span>
                  {active && (
                    <ChevronRight className="w-4 h-4 text-[#2C6E9E] shrink-0" aria-hidden="true" />
                  )}
                </a>
              );
            })}

            <div className="pt-2">
              <a
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#E4ECF2] hover:border-[#0A66C2]/50 hover:bg-[#F0F7FF] text-[#1E252D] transition-colors group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                    <LinkedInIcon className="w-3 h-3" />
                  </span>
                  <span className="text-sm font-medium font-['Inter'] text-slate-700 group-hover:text-[#0A66C2] transition-colors truncate">
                    Conectar en LinkedIn
                  </span>
                </span>
                <ExternalLink
                  className="w-3.5 h-3.5 text-slate-600 group-hover:text-[#0A66C2] transition-colors shrink-0"
                  aria-hidden="true"
                />
              </a>
            </div>
          </nav>
        </div>

        {/* Footer Philosophy Card */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4ECF2] shadow-xs text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#1E252D] text-xs font-['Outfit']">
              <span className="text-[#2C6E9E]" aria-hidden="true">✦</span>
              <span>Propuesta de Valor I+S</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-['Inter'] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </p>
          </div>

          <div className="pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-xs text-slate-600 font-medium px-1">
            <span>{COMPANY_LOCATION}</span>
            <span className="font-semibold text-[#2C6E9E] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
