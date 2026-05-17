import type { Provider, InferenceProvider, ProviderMeta } from "../types";
import { MockInferenceProvider } from "./providers/MockInferenceProvider";
import { SarvamProvider } from "./providers/SarvamProvider";
import { OpenRouterProvider } from "./providers/OpenRouterProvider";
import { GeminiProvider } from "./providers/GeminiProvider";
import { GroqProvider } from "./providers/GroqProvider";

export function createProvider(provider: Provider): InferenceProvider {
  switch (provider) {
    case "mock":       return new MockInferenceProvider();
    case "sarvam":     return new SarvamProvider();
    case "openrouter": return new OpenRouterProvider();
    case "gemini":     return new GeminiProvider();
    case "groq":       return new GroqProvider();
    default: {
      const _: never = provider;
      throw new Error(`Unknown provider: ${String(_)}`);
    }
  }
}

export const PROVIDER_META: ProviderMeta[] = [
  {
    id: "mock",
    label: "Mock API",
    description: "Built-in fake stream — no key needed.",
    requiresKey: false,
  },
  {
    id: "sarvam",
    label: "Sarvam AI",
    description: "Indic language models, low-latency inference.",
    requiresKey: true,
    envKey: "VITE_SARVAM_API_KEY",
    docsUrl: "https://docs.sarvam.ai/",
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    description: "Gateway to 200+ models — GPT-4o, Claude, Llama.",
    requiresKey: true,
    envKey: "VITE_OPENROUTER_API_KEY",
    docsUrl: "https://openrouter.ai/docs",
  },
  {
    id: "gemini",
    label: "Gemini",
    description: "Google's multimodal foundation model.",
    requiresKey: true,
    envKey: "VITE_GEMINI_API_KEY",
    docsUrl: "https://ai.google.dev/",
  },
  {
    id: "groq",
    label: "Groq",
    description: "Ultra-fast LPU inference, free tier available.",
    requiresKey: true,
    envKey: "VITE_GROQ_API_KEY",
    docsUrl: "https://console.groq.com/",
  },
];
