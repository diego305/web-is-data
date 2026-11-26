import React, { useState } from "react";
import { Navigation, NavModule } from "./components/Navigation";
import { FormView } from "./components/FormView";
import { ModelDiagnosticView } from "./components/ModelDiagnosticView";
import { ProposalView } from "./components/ProposalView";
import { MethodologyView } from "./components/MethodologyView";
import { ProfileView } from "./components/ProfileView";

export function App() {
  const [currentModule, setCurrentModule] = useState<NavModule>("form");

  return (
    <div className="min-h-screen bg-[#F5F8FB] text-[#1E252D] flex flex-col lg:flex-row font-['Inter']">
      {/* Navigation Sidebar */}
      <Navigation
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentModule === "form" && <FormView />}
          {currentModule === "model" && (
            <ModelDiagnosticView onStartDiagnostic={() => setCurrentModule("form")} />
          )}
          {currentModule === "proposal" && <ProposalView />}
          {currentModule === "methodology" && <MethodologyView />}
          {currentModule === "profile" && (
            <ProfileView onStartDiagnostic={() => setCurrentModule("form")} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
