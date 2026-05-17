import React from "react";
import { NavLink } from "react-router-dom";

const routes = [
  { to: "/playground", label: "Playground" },
  { to: "/diff", label: "Diff" },
  { to: "/analytics", label: "Analytics" },
];

interface Props {
  onKeys: () => void;
}

const Navbar: React.FC<Props> = ({ onKeys }) => (
  <header className="sticky top-0 z-40 bg-[#0b0b0f]/95 backdrop-blur-md border-b border-[#1e1e2c]">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 flex items-center justify-between">
      <NavLink to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-amber-500/50 rounded-lg">
        <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-slate-100 tracking-tight">Inferprompt</span>
      </NavLink>

      <nav className="flex items-center gap-1" aria-label="Main">
        {routes.map(r => (
          <NavLink
            key={r.to}
            to={r.to}
            end={r.to === "/"}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                isActive
                  ? "bg-[#1e1e2c] text-amber-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#16161e]"
              }`
            }
          >
            {r.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onKeys}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-400
                   hover:text-slate-200 hover:bg-[#16161e] border border-[#2a2a38] hover:border-[#3a3a48]
                   transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        aria-label="Manage API keys"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="15" r="5" />
          <path d="M11.5 11.5L20 3M18 5l2 2M15 8l2 2" />
        </svg>
        Keys
      </button>
    </div>
  </header>
);

export default Navbar;
