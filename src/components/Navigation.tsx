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
  COMPANY_ADDRESS_SHORT,
  LINKEDIN_PROFILE_URL
} from "../config/constants";

export type NavModule = "form" | "model" | "proposal" | "methodology" | "profile";

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

  const menuItems: { id: NavModule; label: string; icon: React.ReactNode }[] = [
    {
      id: "proposal",
      label: "Propuesta de Trabajo",
      icon: <Briefcase className="w-4 h-4 text-[#7A5F4B]" aria-hidden="true" />
    },
    {
      id: "form",
      label: "Nuevo Diagnóstico",
      icon: <FileText className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    },
    {
      id: "model",
      label: "Diagnóstico Modelo",
      icon: <FileCheck2 className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    },
    {
      id: "methodology",
      label: "Matriz & Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-600" aria-hidden="true" />
    },
    {
      id: "profile",
      label: "Perfil Profesional",
      icon: <UserRound className="w-4 h-4 text-[#2C6E9E]" aria-hidden="true" />
    }
  ];

  const handleSelect = (mod: NavModule) => {
    onSelectModule(mod);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Glassmorphic Top Bar */}
      <header className="lg:hidden print:hidden flex items-center justify-between px-4 py-2.5 glass-header sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <AppSquircleIcon size={38} />
          <div>
            <div className="text-xs font-semibold text-[#1E252D] font-['Outfit'] tracking-tight leading-tight">
              Information + Solutions
            </div>
            <div className="text-[10px] text-[#2C6E9E] font-medium tracking-wider uppercase font-['Outfit'] mt-0.5">
              Data Solutions
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#1E252D] hover:bg-white rounded-xl border border-[#E4ECF2] bg-white/80 cursor-pointer transition-colors"
          aria-label={mobileOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
          aria-expanded={mobileOpen}
          aria-controls="sidebar-nav"
        >
          {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </header>

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
          <div className="flex items-center gap-3">
            <AppSquircleIcon size={42} />
            <div>
              <div className="text-sm font-semibold text-[#1E252D] tracking-tight font-['Outfit'] leading-tight">
                Information + Solutions
              </div>
              <div className="text-[10px] font-medium text-[#2C6E9E] tracking-widest uppercase font-['Outfit'] mt-0.5">
                Data Solutions
              </div>
            </div>
          </div>
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
        <div className="mb-2">
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const active = currentModule === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  aria-current={active ? "page" : undefined}
                  className={`w-full min-h-[44px] lg:min-h-[40px] flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-white text-[#2C6E9E] border border-[#7EBCE6]/60 shadow-xs font-semibold"
                      : "bg-transparent text-slate-700 hover:bg-white/80 hover:text-[#1E252D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="font-['Inter']">{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#2C6E9E]" aria-hidden="true" />}
                </button>
              );
            })}

            <div className="pt-2">
              <a
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] lg:min-h-[40px] flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#E4ECF2] hover:border-[#0A66C2]/50 hover:bg-[#F0F7FF] text-[#1E252D] transition-colors group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                    <LinkedInIcon className="w-3 h-3" />
                  </span>
                  <span className="text-xs font-medium font-['Inter'] text-slate-700 group-hover:text-[#0A66C2] transition-colors truncate">
                    Conectar en LinkedIn
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0A66C2] transition-colors shrink-0" aria-hidden="true" />
              </a>
            </div>
          </nav>
        </div>

        {/* Footer Philosophy Card */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4ECF2] shadow-xs text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-[#1E252D] text-[11px] font-['Outfit']">
              <span className="text-[#2C6E9E]" aria-hidden="true">✦</span>
              <span>Propuesta de Valor I+S</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-['Inter'] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </p>
          </div>

          <div className="pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-[11px] text-slate-600 font-medium px-1">
            <span>{COMPANY_ADDRESS_SHORT}</span>
            <span className="font-semibold text-[#2C6E9E] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
