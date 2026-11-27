import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { Navigation, NavModule, MODULE_HASH_MAP, getModuleFromHash } from "./components/Navigation";
import { FormView } from "./components/FormView";
import { ProposalView } from "./components/ProposalView";
import { PropellerLoader } from "./components/BrandHeader";
import { Interview, SaveInterviewResult } from "./types";

const ModelDiagnosticView = lazy(() =>
  import("./components/ModelDiagnosticView").then((m) => ({
    default: m.ModelDiagnosticView
  }))
);
const MethodologyView = lazy(() =>
  import("./components/MethodologyView").then((m) => ({
    default: m.MethodologyView
  }))
);
const ProfileView = lazy(() =>
  import("./components/ProfileView").then((m) => ({
    default: m.ProfileView
  }))
);

export function App() {
  const [currentModule, setCurrentModule] = useState<NavModule>(() =>
    getModuleFromHash(window.location.hash)
  );
  const [lastSaved, setLastSaved] = useState<Interview | null>(null);
  const [lastSavedPersisted, setLastSavedPersisted] = useState<boolean>(true);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentModule(getModuleFromHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleSelectModule = useCallback((mod: NavModule) => {
    setCurrentModule(mod);
    const targetHash = `#${MODULE_HASH_MAP[mod]}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, "", targetHash);
    }
    window.scrollTo(0, 0);
  }, []);

  const handleDiagnosticSaved = (result: SaveInterviewResult) => {
    setLastSaved(result.interview);
    setLastSavedPersisted(result.persisted);
  };

  const handleStartNewDiagnostic = () => {
    setLastSaved(null);
    setLastSavedPersisted(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-[#1E252D] flex flex-col lg:flex-row font-['Inter']">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-xl focus:bg-[#1E252D] focus:text-white focus:text-xs focus:font-semibold"
      >
        Saltar al contenido principal
      </a>

      {/* Navigation Sidebar + Mobile Quick Strip */}
      <Navigation
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 print:ml-0 flex flex-col min-h-screen min-w-0">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-3.5 sm:p-6 lg:p-8 print:p-0"
        >
          {currentModule === "proposal" && (
            <ProposalView
              onStartDiagnostic={() => handleSelectModule("form")}
              onViewModel={() => handleSelectModule("model")}
            />
          )}

          {currentModule === "form" && (
            <FormView
              lastSaved={lastSaved}
              lastSavedPersisted={lastSavedPersisted}
              onDiagnosticSaved={handleDiagnosticSaved}
              onStartNewDiagnostic={handleStartNewDiagnostic}
            />
          )}

          {currentModule !== "proposal" && currentModule !== "form" && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <PropellerLoader size={30} text="Cargando sección..." />
                </div>
              }
            >
              {currentModule === "model" && (
                <ModelDiagnosticView
                  onStartDiagnostic={() => handleSelectModule("form")}
                />
              )}
              {currentModule === "methodology" && (
                <MethodologyView
                  onStartDiagnostic={() => handleSelectModule("form")}
                />
              )}
              {currentModule === "profile" && (
                <ProfileView
                  onStartDiagnostic={() => handleSelectModule("form")}
                />
              )}
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
