import type { InferenceProvider, InferenceRequest } from "../../types";
import { local } from "../../utils/storage";

function parseSse(raw: ReadableStream<Uint8Array>): ReadableStream<Uint8Array> {
  const dec = new TextDecoder();
  const enc = new TextEncoder();
  const reader = raw.getReader();
  let buf = "";
  return new ReadableStream({
    async pull(ctrl) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) { ctrl.close(); return; }
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          const s = line.trim();
          if (!s.startsWith("data:")) continue;
          const json = s.slice(5).trim();
          if (json === "[DONE]") { ctrl.close(); return; }
          try {
            const d = JSON.parse(json) as { choices: Array<{ delta: { content?: string } }> };
            const text = d.choices[0]?.delta?.content;
            if (text) { ctrl.enqueue(enc.encode(text)); return; }
          } catch { /* bad frame */ }
        }
      }
    },
    cancel() { void reader.cancel(); },
  });
}

export class GroqProvider implements InferenceProvider {
  private key: string;
  private model: string;

  constructor() {
    const env = import.meta.env as Record<string, string | undefined>;
    this.key = local.getKey("groq") || env.VITE_GROQ_API_KEY || "";
    this.model = env.VITE_GROQ_MODEL ?? "llama3-8b-8192";
    if (!this.key) throw new Error("Groq needs an API key — add it via the Keys panel");
  }

  async streamResponse(req: InferenceRequest): Promise<ReadableStream<Uint8Array>> {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.key}` },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
          { role: "user", content: req.text ?? "" },
        ],
        stream: true,
        max_tokens: 512,
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
    if (!res.body) throw new Error("Groq returned empty body");
    return parseSse(res.body);
  }
}
