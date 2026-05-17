import React, { useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { ChartType } from "../types";
import { local } from "../utils/storage";

const sessions = [
  { name: "S1", tokens: 142, tps: 38, latency: 3.7, sim: 72 },
  { name: "S2", tokens: 208, tps: 42, latency: 4.9, sim: 85 },
  { name: "S3", tokens: 97,  tps: 51, latency: 1.9, sim: 60 },
  { name: "S4", tokens: 315, tps: 44, latency: 7.1, sim: 91 },
  { name: "S5", tokens: 178, tps: 39, latency: 4.5, sim: 78 },
];

const PIE_COLORS = ["#f59e0b", "#22d3ee", "#34d399", "#a78bfa", "#f87171"];

const tooltipStyle = {
  contentStyle: { background: "#12121a", border: "1px solid #2a2a38", borderRadius: 10, fontSize: 12 },
  labelStyle: { color: "#f1f5f9", fontWeight: 600 },
  itemStyle: { color: "#94a3b8" },
};

const axisProps = { tick: { fill: "#64748b", fontSize: 11 } };

const chartViews: { id: ChartType; label: string }[] = [
  { id: "bar", label: "Bar" },
  { id: "line", label: "Line" },
  { id: "pie", label: "Pie" },
  { id: "table", label: "Table" },
];

const BarView = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={sessions} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2c" />
      <XAxis dataKey="name" {...axisProps} />
      <YAxis {...axisProps} />
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ color: "#64748b", fontSize: 12 }} />
      <Bar dataKey="tokens" fill="#f59e0b" name="Tokens" radius={[4, 4, 0, 0]} />
      <Bar dataKey="tps" fill="#22d3ee" name="tok/s" radius={[4, 4, 0, 0]} />
      <Bar dataKey="sim" fill="#34d399" name="Sim %" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

const LineView = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={sessions} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2c" />
      <XAxis dataKey="name" {...axisProps} />
      <YAxis {...axisProps} />
      <Tooltip {...tooltipStyle} />
      <Legend wrapperStyle={{ color: "#64748b", fontSize: 12 }} />
      <Line type="monotone" dataKey="tokens" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Tokens" />
      <Line type="monotone" dataKey="tps" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} name="tok/s" />
      <Line type="monotone" dataKey="sim" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} name="Sim %" />
    </LineChart>
  </ResponsiveContainer>
);

const PieView = () => (
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        data={sessions.map(s => ({ name: s.name, value: s.tokens }))}
        cx="50%" cy="50%" outerRadius={110}
        dataKey="value"
        label={({ name, percent }: { name?: string; percent?: number }) =>
          `${name ?? ""} ${((percent ?? 0) * 100).toFixed(0)}%`
        }
        labelLine={false}
      >
        {sessions.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
      </Pie>
      <Tooltip {...tooltipStyle} />
    </PieChart>
  </ResponsiveContainer>
);

const TableView = () => (
  <div className="overflow-x-auto rounded-xl border border-[#1e1e2c]">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-[#1e1e2c] bg-[#0e0e16]">
          {["Session", "Tokens", "tok/s", "Latency (s)", "Sim %"].map(h => (
            <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sessions.map((row, i) => (
          <tr key={row.name} className={`border-b border-[#1e1e2c] hover:bg-[#16161e] transition-colors ${i % 2 === 0 ? "bg-[#0e0e16]" : "bg-[#12121a]"}`}>
            <td className="px-4 py-3 font-medium text-slate-300">{row.name}</td>
            <td className="px-4 py-3 font-mono text-amber-400">{row.tokens}</td>
            <td className="px-4 py-3 font-mono text-cyan-400">{row.tps}</td>
            <td className="px-4 py-3 font-mono text-slate-300">{row.latency}</td>
            <td className="px-4 py-3 font-mono text-emerald-400">{row.sim}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AnalyticsDashboard: React.FC = () => {
  const [chart, setChart] = useState<ChartType>(local.getChart());

  const pick = (c: ChartType) => { setChart(c); local.setChart(c); };

  const totals = [
    { label: "Total Tokens", value: sessions.reduce((a, s) => a + s.tokens, 0), color: "text-amber-400" },
    { label: "Avg tok/s", value: Math.round(sessions.reduce((a, s) => a + s.tps, 0) / sessions.length), color: "text-cyan-400" },
    { label: "Avg Latency", value: `${(sessions.reduce((a, s) => a + s.latency, 0) / sessions.length).toFixed(1)}s`, color: "text-slate-300" },
    { label: "Avg Similarity", value: `${Math.round(sessions.reduce((a, s) => a + s.sim, 0) / sessions.length)}%`, color: "text-emerald-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {totals.map(t => (
          <div key={t.label} className="rounded-xl border border-[#1e1e2c] bg-[#12121a] px-4 py-4">
            <p className={`font-mono text-2xl font-bold tabular-nums ${t.color}`}>{t.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-slate-600 mt-1">{t.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5" role="group" aria-label="Chart type">
        {chartViews.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => pick(id)}
            aria-pressed={chart === id}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
              chart === id
                ? "bg-amber-500 text-black"
                : "text-slate-500 hover:text-slate-200 border border-[#2a2a38] hover:border-[#3a3a48] bg-[#12121a]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1e1e2c] bg-[#12121a] p-5">
        <p className="text-sm font-medium text-slate-400 mb-4">Session Metrics</p>
        {chart === "bar"   && <BarView />}
        {chart === "line"  && <LineView />}
        {chart === "pie"   && <PieView />}
        {chart === "table" && <TableView />}
      </div>

      <p className="text-xs text-slate-700 italic">Demo data — real sessions accumulate as you use the Playground.</p>
    </div>
  );
};

export default AnalyticsDashboard;
