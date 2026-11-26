import React, { useState } from "react";
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
import { LINKEDIN_PROFILE_URL } from "../config/constants";

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

  const menuItems: { id: NavModule; label: string; icon: React.ReactNode }[] = [
    {
      id: "proposal",
      label: "Propuesta de Trabajo",
      icon: <Briefcase className="w-4 h-4 text-[#BFA898]" />
    },
    {
      id: "form",
      label: "Nuevo Diagnóstico",
      icon: <FileText className="w-4 h-4 text-[#3B8AC4]" />
    },
    {
      id: "model",
      label: "Diagnóstico Modelo",
      icon: <FileCheck2 className="w-4 h-4 text-[#3B8AC4]" />
    },
    {
      id: "methodology",
      label: "Matriz & Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />
    },
    {
      id: "profile",
      label: "Perfil Profesional",
      icon: <UserRound className="w-4 h-4 text-[#3B8AC4]" />
    }
  ];

  const handleSelect = (mod: NavModule) => {
    onSelectModule(mod);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Glassmorphic Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 glass-header sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <AppSquircleIcon size={38} />
          <div>
            <div className="text-xs font-semibold text-[#1E252D] font-['Outfit'] tracking-tight leading-tight">
              Information + Solutions
            </div>
            <div className="text-[10px] text-[#2C6E9E] font-normal tracking-wider uppercase font-['Outfit'] mt-0.5">
              Data Solutions
            </div>
          </div>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-[#1E252D] hover:bg-white rounded-xl border border-[#E4ECF2] bg-white/70 cursor-pointer transition-colors"
          aria-label="Abrir menú"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#1E252D]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#F5F8FB] border-r border-[#E4ECF2] flex flex-col p-4 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="pb-4 mb-4 border-b border-[#E4ECF2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AppSquircleIcon size={42} />
            <div>
              <h2 className="text-sm font-semibold text-[#1E252D] tracking-tight font-['Outfit'] leading-tight">
                Information + Solutions
              </h2>
              <div className="text-[10px] font-normal text-[#2C6E9E] tracking-widest uppercase font-['Outfit'] mt-0.5">
                Data Solutions
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
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
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-white text-[#3B8AC4] border border-[#7EBCE6]/50 shadow-xs font-semibold"
                      : "bg-transparent text-slate-700 hover:bg-white/80 hover:text-[#1E252D]"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    {item.icon}
                    <span className="font-['Inter']">{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-[#3B8AC4]" />}
                </button>
              );
            })}

            <div className="pt-2">
              <a
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#E4ECF2] hover:border-[#0A66C2]/50 hover:bg-[#F0F7FF] text-[#1E252D] transition-colors group"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <span className="w-5 h-5 rounded-md bg-[#0A66C2] text-white flex items-center justify-center shrink-0">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 fill-current"
                      aria-hidden="true"
                    >
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium font-['Inter'] text-slate-700 group-hover:text-[#0A66C2] transition-colors truncate">
                    Conectar en LinkedIn
                  </span>
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0A66C2] transition-colors shrink-0" />
              </a>
            </div>
          </nav>
        </div>

        {/* Footer Philosophy Card */}
        <div className="mt-auto pt-4 space-y-3">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4ECF2] shadow-xs text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-[#1E252D] text-[11px] font-['Outfit']">
              <span className="text-[#3B8AC4]">✦</span>
              <span>Propuesta de Valor I+S</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-['Inter'] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </p>
          </div>

          <div className="pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-[10.5px] text-slate-500 font-medium px-1">
            <span>E. Carriego N° 431, La Rioja</span>
            <span className="font-bold text-[#2C6E9E] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
