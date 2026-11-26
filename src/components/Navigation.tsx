import React, { useState } from "react";
import {
  FileText,
  FileCheck2,
  Briefcase,
  HelpCircle,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { AppSquircleIcon } from "./BrandHeader";

export type NavModule = "form" | "model" | "proposal" | "methodology";

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
      id: "proposal",
      label: "Propuesta de Trabajo",
      icon: <Briefcase className="w-4 h-4 text-[#BFA898]" />
    },
    {
      id: "methodology",
      label: "Matriz & Metodología",
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />
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
          </nav>
        </div>

        {/* Footer Philosophy Card */}
        <div className="mt-auto pt-4">
          <div className="bg-white rounded-2xl p-3.5 border border-[#E4ECF2] shadow-xs text-xs text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-medium text-[#1E252D] text-[11px] font-['Outfit']">
              <span className="text-[#3B8AC4]">✦</span>
              <span>Propuesta de Valor I+S</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-['Inter'] italic">
              "El valor real no está en acumular datos, sino en saber utilizarlos para decidir mejor."
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E4ECF2] flex items-center justify-between text-[10.5px] text-slate-500 font-medium px-1">
            <span>E. Carriego N° 431, La Rioja</span>
            <span className="font-bold text-[#2C6E9E] font-['Outfit']">I+S Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
