import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import LandingPage from "./Pages/LandingPage";
import PlanWizardPage from "./Pages/PlanWizardPage";
import TripWorkspacePage from "./Pages/TripWorkspacePage";
import ExplorePage from "./Pages/ExplorePage";
import DashboardPage from "./Pages/DashboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/plan" element={<PlanWizardPage />} />
            <Route path="/trip/:tripId" element={<TripWorkspacePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
