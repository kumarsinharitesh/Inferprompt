import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const DEMO_TOKENS = [
  "Transformer", " attention", " works", " by", " computing",
  " a", " weighted", " sum", " of", " all", " input", " tokens",
  ".", " Each", " token", " learns", " to", " attend", " to",
  " the", " most", " relevant", " context", " dynamically", ".",
];

const features = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: "Token Streaming",
    desc: "Watch responses arrive token by token using Fetch + ReadableStream — zero polling, real-time.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M9 3H5a2 2 0 0 0-2 2v4M9 3h6M9 3v18m6-18h4a2 2 0 0 1 2 2v4M15 3v18M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4" />
      </svg>
    ),
    title: "ABTD Diff Engine",
    desc: "Custom Anchor-Based Token Diff algorithm compares model outputs at word level — faster than LCS.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
      </svg>
    ),
    title: "Audio Prompts",
    desc: "Record voice input via MediaRecorder. Live transcription via Web Speech API — editable before sending.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Live Metrics",
    desc: "Token count, tokens/sec, and latency tracked per-session. Visualised across sessions in the Analytics view.",
  },
];

const providers = ["Sarvam AI", "OpenRouter", "Gemini", "Groq", "Mock"];

const StatPill: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center gap-0.5 px-6 py-4 border-r border-[#1e1e2c] last:border-0">
    <span className="font-mono text-2xl font-bold text-amber-400">{value}</span>
    <span className="text-[11px] uppercase tracking-wider text-slate-600">{label}</span>
  </div>
);

const WelcomePage: React.FC = () => {
  const [visibleTokens, setVisibleTokens] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setVisibleTokens(n => {
        if (n >= DEMO_TOKENS.length) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return n;
        }
        return n + 1;
      });
    }, 90);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const replay = () => {
    setVisibleTokens(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setVisibleTokens(n => {
        if (n >= DEMO_TOKENS.length) { clearInterval(timerRef.current!); return n; }
        return n + 1;
      });
    }, 90);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center text-center pt-24 pb-20 px-4 overflow-hidden">
        {/* background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 0%, rgba(245,158,11,0.07) 0%, transparent 60%),
                              linear-gradient(#1e1e2c 1px, transparent 1px),
                              linear-gradient(90deg, #1e1e2c 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 40px 40px, 40px 40px",
          }}
        />

        <h1 className="relative z-10 text-5xl sm:text-7xl font-bold tracking-tight text-white leading-none mb-5">
          Infer<span className="text-amber-400">prompt</span>
        </h1>
        <p className="relative z-10 max-w-2xl text-lg text-slate-400 leading-relaxed mb-10">
          A developer playground for streaming LLM inference. Submit text or audio,
          watch tokens arrive in real time, diff outputs with ABTD, and explore analytics —
          all from your browser.
        </p>

        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/playground"
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-6 py-3
                       text-sm font-semibold text-black transition-all active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-[#0b0b0f]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Open Playground
          </Link>
          <Link
            to="/diff"
            className="flex items-center gap-2 rounded-xl border border-[#2a2a38] hover:border-[#3a3a48]
                       bg-[#12121a] hover:bg-[#16161e] px-6 py-3 text-sm font-medium text-slate-300 transition-all"
          >
            Try Diff View
          </Link>
        </div>
      </section>

      {/* Stats bar */}
      <div className="mx-auto w-half max-w-2xl border border-[#1e1e2c] rounded-2xl bg-[#12121a] flex overflow-hidden mb-16">
        <StatPill value="5" label="Providers" />
        <StatPill value="ABTD" label="Diff Algo" />
        <StatPill value="Server-Sent Events" label="Streaming" />
      </div>

      {/* Live token demo  */}
      <section className="mx-auto w-full max-w-3xl mb-20 px-4">
        <div className="rounded-2xl border border-[#1e1e2c] bg-[#0e0e16] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e2c] bg-[#12121a]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-amber-500/60" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <span className="text-xs text-slate-600 font-mono ml-2">mock-provider · streaming</span>
            </div>
            <button
              onClick={replay}
              className="text-[11px] text-slate-600 hover:text-amber-400 transition-colors font-mono"
              aria-label="Replay demo"
            >
              ↺ replay
            </button>
          </div>

          <div className="p-5 min-h-[80px]">
            <p className="text-[11px] uppercase tracking-wider text-slate-600 mb-3 font-mono">
              {">"} prompt: explain transformer attention
            </p>
            <p className="font-mono text-sm text-slate-200 leading-relaxed">
              {DEMO_TOKENS.slice(0, visibleTokens).map((tok, i) => (
                <span
                  key={i}
                  style={{ animation: "fadeToken 0.1s ease forwards" }}
                  className="animate-token"
                >
                  {tok}
                </span>
              ))}
              {visibleTokens < DEMO_TOKENS.length && (
                <span className="inline-block w-1 h-4 ml-0.5 bg-amber-400 animate-pulse align-middle rounded-sm" />
              )}
              {visibleTokens >= DEMO_TOKENS.length && (
                <span className="ml-2 text-[11px] text-emerald-400 font-normal">✓ complete</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto w-full max-w-5xl px-4 mb-20">
        <h2 className="text-2xl font-bold text-slate-100 mb-2 text-center">Everything you need</h2>
        <p className="text-slate-500 text-sm text-center mb-10">Built for engineers who want to inspect, compare, and understand LLM behaviour.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="group rounded-2xl border border-[#1e1e2c] bg-[#12121a] p-6
                         hover:border-amber-500/30 hover:bg-[#14140e] transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:bg-amber-500/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-sm font-semibold text-slate-100 mb-1.5">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Providers */}
      <section className="mx-auto w-full max-w-3xl px-4 mb-20 text-center">
        <p className="text-[11px] uppercase tracking-wider text-slate-600 mb-5">Supported providers</p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {providers.map(p => (
            <span
              key={p}
              className="rounded-lg border border-[#2a2a38] bg-[#12121a] px-3.5 py-2 text-sm text-slate-400 font-medium"
            >
              {p}
            </span>
          ))}
          <span className="rounded-lg border border-dashed border-[#2a2a38] px-3.5 py-2 text-sm text-slate-700">
            + your own
          </span>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-2xl px-4 mb-28 text-center">
        <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/5 to-transparent p-10 flex flex-col items-center gap-5">
          <h2 className="text-2xl font-bold text-slate-100">Ready to try it?</h2>
          <p className="text-slate-500 text-sm max-w-sm">
            No sign-up. No setup. The Mock provider works instantly — add your own API key when you're ready.
          </p>
          <Link
            to="/playground"
            className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 px-8 py-3.5
                       text-sm font-semibold text-black transition-all active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Launch Playground
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e1e2c] py-6 px-4 text-center">
        <p className="text-xs text-slate-700">
          Inferprompt@2026 All Right Reserved-Sarvam Assessment
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;
