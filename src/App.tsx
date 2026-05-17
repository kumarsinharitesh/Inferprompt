import React, { useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ApiKeySettings from "./components/ApiKeySettings";
import WelcomePage from "./pages/WelcomePage";
import PlaygroundPage from "./pages/PlaygroundPage";
import DiffPage from "./pages/DiffPage";
import AnalyticsPage from "./pages/AnalyticsPage";

const App: React.FC = () => {
  const [keysOpen, setKeysOpen] = useState(false);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#0b0b0f] text-slate-100 antialiased">
        <Navbar onKeys={() => setKeysOpen(true)} />

        <main id="main-content">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route
              path="/playground"
              element={
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                  <PlaygroundPage />
                </div>
              }
            />
            <Route
              path="/diff"
              element={
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                  <DiffPage />
                </div>
              }
            />
            <Route
              path="/analytics"
              element={
                <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
                  <AnalyticsPage />
                </div>
              }
            />
            <Route
              path="*"
              element={
                <div className="flex flex-col items-center justify-center gap-3 py-40 text-center">
                  <p className="text-5xl font-bold text-[#1e1e2c]">404</p>
                  <p className="text-slate-600 text-sm">Page not found</p>
                  <a href="#/" className="text-amber-500 hover:text-amber-400 text-sm underline">
                    Go home
                  </a>
                </div>
              }
            />
          </Routes>
        </main>

        {keysOpen && <ApiKeySettings onClose={() => setKeysOpen(false)} />}

        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50
                     focus:bg-amber-500 focus:text-black focus:px-3 focus:py-1.5 focus:rounded-lg focus:text-sm"
        >
          Skip to content
        </a>
      </div>
    </HashRouter>
  );
};

export default App;
