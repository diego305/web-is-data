import { Suspense, lazy, useState } from "react";
import { Navigation, NavModule } from "./components/Navigation";
import { FormView } from "./components/FormView";
import { PropellerLoader } from "./components/BrandHeader";
import { Interview, SaveInterviewResult } from "./types";

const ModelDiagnosticView = lazy(() =>
  import("./components/ModelDiagnosticView").then((m) => ({
    default: m.ModelDiagnosticView
  }))
);
const ProposalView = lazy(() =>
  import("./components/ProposalView").then((m) => ({
    default: m.ProposalView
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
  const [currentModule, setCurrentModule] = useState<NavModule>("form");
  const [lastSaved, setLastSaved] = useState<Interview | null>(null);
  const [lastSavedPersisted, setLastSavedPersisted] = useState<boolean>(true);

  const handleSelectModule = (mod: NavModule) => {
    setCurrentModule(mod);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

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

      {/* Navigation Sidebar */}
      <Navigation
        currentModule={currentModule}
        onSelectModule={handleSelectModule}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 print:ml-0 flex flex-col min-h-screen">
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 print:p-0 overflow-y-auto"
        >
          {currentModule === "form" && (
            <FormView
              lastSaved={lastSaved}
              lastSavedPersisted={lastSavedPersisted}
              onDiagnosticSaved={handleDiagnosticSaved}
              onStartNewDiagnostic={handleStartNewDiagnostic}
            />
          )}

          {currentModule !== "form" && (
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
              {currentModule === "proposal" && <ProposalView />}
              {currentModule === "methodology" && <MethodologyView />}
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
