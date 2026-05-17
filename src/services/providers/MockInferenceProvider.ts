import type { InferenceProvider, InferenceRequest } from "../../types";

const env = import.meta.env as Record<string, string | undefined>;
const [minDelay, maxDelay] = (env.VITE_MOCK_DELAY ?? "20,80").split(",").map(Number);
const failAt = env.VITE_MOCK_FAIL_AFTER ? parseInt(env.VITE_MOCK_FAIL_AFTER) : null;

const BASE_RESPONSE = `Large language models are neural networks trained on vast corpora of text.
They learn statistical patterns and can generate coherent, contextually appropriate text.
Modern transformer architectures use self-attention mechanisms to capture long-range dependencies.
Key capabilities include text generation, summarisation, translation, and code synthesis.
Fine-tuning on curated datasets improves alignment with human intent.`;

function buildResponse(req: InferenceRequest): string {
  if (req.mode === "audio") {
    const t = req.text?.trim();
    if (t) return `Received: "${t.slice(0, 80)}${t.length > 80 ? "…" : ""}"\n\n` + BASE_RESPONSE;
    return `Audio received. Processing with Sarvam AI Indic models.\n\n` + BASE_RESPONSE;
  }
  return BASE_RESPONSE;
}

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
const jitter = () => Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

export class MockInferenceProvider implements InferenceProvider {
  async streamResponse(req: InferenceRequest): Promise<ReadableStream<Uint8Array>> {
    const words = buildResponse(req).split(/(\s+)/).filter(Boolean);
    const enc = new TextEncoder();
    let i = 0;

    return new ReadableStream({
      async pull(ctrl) {
        if (failAt !== null && i >= failAt) {
          ctrl.error(new Error(`Mock: simulated failure at token ${failAt}`));
          return;
        }
        if (i >= words.length) { ctrl.close(); return; }
        await wait(jitter());
        ctrl.enqueue(enc.encode(words[i++]));
      },
    });
  }
}
