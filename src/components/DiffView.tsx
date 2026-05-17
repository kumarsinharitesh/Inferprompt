import React, { useState, useCallback } from "react";
import type { DiffResult } from "../types";
import { runABTD } from "../utils/diff";
import { session } from "../utils/storage";

const tokenClass = {
  equal: "text-slate-300",
  insert: "bg-emerald-900/40 text-emerald-300 rounded px-0.5",
  delete: "bg-red-900/40 text-red-400 rounded px-0.5 line-through",
} as const;

const DiffPanel: React.FC<{ label: string; tokens: DiffResult["tokensA"] }> = ({ label, tokens }) => (
  <div className="flex flex-col gap-2 min-w-0">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>
    <div
      className="min-h-[200px] rounded-xl border border-[#1e1e2c] bg-[#0e0e16] p-4
                 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words overflow-auto"
      aria-label={label}
    >
      {tokens.length === 0 ? (
        <span className="text-slate-700 italic">Paste output here…</span>
      ) : (
        tokens.map((t, i) => <span key={i} className={tokenClass[t.type]}>{t.text}</span>)
      )}
    </div>
  </div>
);

const DiffView: React.FC = () => {
  const [textA, setTextA] = useState(session.getOutputA());
  const [textB, setTextB] = useState(session.getOutputB());
  const [result, setResult] = useState<DiffResult | null>(null);
  const [running, setRunning] = useState(false);

  const compare = useCallback(() => {
    if (!textA.trim() || !textB.trim()) return;
    setRunning(true);
    setTimeout(() => {
      setResult(runABTD(textA, textB));
      session.setOutputA(textA);
      session.setOutputB(textB);
      setRunning(false);
    }, 0);
  }, [textA, textB]);

  const reset = () => { setTextA(""); setTextB(""); setResult(null); };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-base font-semibold text-slate-200">Output Comparison</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by ABTD — anchor-based token-level diff
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-900/60 border border-emerald-800" /> Inserted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-900/60 border border-red-800" /> Deleted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-[#1e1e2c] border border-[#2a2a38]" /> Unchanged</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Output A", val: textA, set: setTextA, id: "output-a" },
          { label: "Output B", val: textB, set: setTextB, id: "output-b" },
        ].map(({ label, val, set, id }) => (
          <div key={id} className="flex flex-col gap-2">
            <label htmlFor={id} className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</label>
            <textarea
              id={id}
              value={val}
              onChange={e => { set(e.target.value); setResult(null); }}
              placeholder={`Paste ${label.toLowerCase()}…`}
              rows={7}
              className="w-full resize-none rounded-xl border border-[#2a2a38] bg-[#0e0e16]
                         px-4 py-3 font-mono text-sm text-slate-200 placeholder-slate-600
                         focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
              aria-label={label}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          id="compare-btn"
          onClick={compare}
          disabled={!textA.trim() || !textB.trim() || running}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400
                     text-black text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed
                     transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 3H5a2 2 0 0 0-2 2v4M9 3h6M9 3v18m6-18h4a2 2 0 0 1 2 2v4M15 3v18M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
          </svg>
          {running ? "Computing…" : "Compare"}
        </button>
        <button onClick={reset} className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
          Clear
        </button>
      </div>

      {result && (
        <div className="flex flex-col gap-4 animate-slide-up">
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { label: "added", val: result.stats.added, cls: "text-emerald-400 bg-emerald-900/20 border-emerald-900" },
              { label: "removed", val: result.stats.removed, cls: "text-red-400 bg-red-900/20 border-red-900" },
              { label: "unchanged", val: result.stats.unchanged, cls: "text-slate-400 bg-[#1e1e2c] border-[#2a2a38]" },
              { label: "similarity", val: `${result.stats.similarityPct}%`, cls: "text-amber-400 bg-amber-900/20 border-amber-900" },
            ].map(({ label, val, cls }) => (
              <span key={label} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border font-medium ${cls}`}>
                {val} {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DiffPanel label="Output A" tokens={result.tokensA} />
            <DiffPanel label="Output B" tokens={result.tokensB} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiffView;
