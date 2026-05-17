import type { Provider, ChartType } from "../types";

function get<T>(store: Storage, key: string, fallback: T): T {
  try {
    const v = store.getItem(key);
    return v === null ? fallback : (JSON.parse(v) as T);
  } catch {
    return fallback;
  }
}

function put<T>(store: Storage, key: string, val: T) {
  try { store.setItem(key, JSON.stringify(val)); } catch { /* quota */ }
}

function drop(store: Storage, key: string) {
  try { store.removeItem(key); } catch { /* ignore */ }
}

export const local = {
  getProvider: () => get<Provider>(localStorage, "dip:provider", "mock"),
  setProvider: (p: Provider) => put(localStorage, "dip:provider", p),

  getChart: () => get<ChartType>(localStorage, "dip:chart", "bar"),
  setChart: (c: ChartType) => put(localStorage, "dip:chart", c),

  getSystem: () => get<string>(localStorage, "dip:system", ""),
  setSystem: (s: string) => put(localStorage, "dip:system", s),

  getKey: (provider: string) => get<string>(localStorage, `dip:key:${provider}`, ""),
  saveKey: (provider: string, key: string) => put(localStorage, `dip:key:${provider}`, key),
  clearKey: (provider: string) => drop(localStorage, `dip:key:${provider}`),
};

export const session = {
  getPrompt: () => get<string>(sessionStorage, "dip:prompt", ""),
  setPrompt: (p: string) => put(sessionStorage, "dip:prompt", p),

  getOutputA: () => get<string>(sessionStorage, "dip:outA", ""),
  setOutputA: (v: string) => put(sessionStorage, "dip:outA", v),

  getOutputB: () => get<string>(sessionStorage, "dip:outB", ""),
  setOutputB: (v: string) => put(sessionStorage, "dip:outB", v),
};
