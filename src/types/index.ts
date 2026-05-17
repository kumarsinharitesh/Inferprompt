export type Provider = "mock" | "sarvam" | "openrouter" | "gemini" | "groq";

export interface InferenceRequest {
  mode: "text" | "audio";
  text?: string;
  audioBlob?: Blob;
  provider: Provider;
  systemPrompt?: string;
}

export interface InferenceProvider {
  streamResponse(request: InferenceRequest): Promise<ReadableStream<Uint8Array>>;
}

export type StreamingStatus =
  | "idle"      
  | "streaming" 
  | "done"      
  | "error"     
  | "aborted"; 

export interface SessionMetrics {
  tokenCount: number;
  tokensPerSec: number;
  latencyMs: number;
  similarityPct: number;
  added: number;
  removed: number;
  unchanged: number;
}


export interface DiffToken {
  text: string;
  type: "equal" | "insert" | "delete";
}

export interface DiffResult {
  tokensA: DiffToken[];
  tokensB: DiffToken[];
  stats: {
    added: number;
    removed: number;
    unchanged: number;
    similarityPct: number;
  };
}

export type ChartType = "bar" | "pie" | "line" | "table";
export interface AnalyticsDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ProviderMeta {
  id: Provider;
  label: string;
  description: string;
  requiresKey: boolean;
  envKey?: string;
  docsUrl?: string;
}
