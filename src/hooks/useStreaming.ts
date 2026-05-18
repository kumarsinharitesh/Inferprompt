import { useState, useRef, useCallback, useEffect } from "react";
import type { InferenceRequest, StreamingStatus } from "../types";
import { createProvider } from "../services/providerFactory";
import { computeMetrics } from "../utils/metrics";
import { session } from "../utils/storage";


export interface StreamingState {
  output: string;
  rawOutput: string;
  tokens: string[];
  status: StreamingStatus;
  error: string | null;
  metrics: {
    tokenCount: number;
    tokensPerSec: number;
    latencyMs: number;
  };
  isThinking: boolean;
  start: (request: InferenceRequest) => Promise<void>;
  abort: () => void;
  reset: () => void;
}

const STREAM_TIMEOUT_MS = 30_000;

export function useStreaming(): StreamingState {
  const [tokens, setTokens] = useState<string[]>([]);
  const [status, setStatus] = useState<StreamingStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    tokenCount: 0,
    tokensPerSec: 0,
    latencyMs: 0,
  });


  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearStreamTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);


  const abort = useCallback(() => {
    clearStreamTimeout();
    abortControllerRef.current?.abort();
    setStatus("aborted");
  }, [clearStreamTimeout]);

 
  const reset = useCallback(() => {
    clearStreamTimeout();
    abortControllerRef.current?.abort();
    setTokens([]);
    setStatus("idle");
    setError(null);
    setMetrics({ tokenCount: 0, tokensPerSec: 0, latencyMs: 0 });
  }, [clearStreamTimeout]);


  const start = useCallback(
    async (request: InferenceRequest) => {

      clearStreamTimeout();
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setTokens([]);
      setError(null);
      setStatus("streaming");
      const startTime = Date.now();
      startTimeRef.current = startTime;

    
      if (request.mode === "text" && request.text) {
        session.setPrompt(request.text);
      }

      try {
        
        const provider = createProvider(request.provider);

       
        timeoutRef.current = setTimeout(() => {
          controller.abort();
          setStatus("error");
          setError(
            `Stream timed out after ${STREAM_TIMEOUT_MS / 1000}s. ` +
              "Check your network or try a different provider."
          );
        }, STREAM_TIMEOUT_MS);

       
        const stream = await provider.streamResponse(request);
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        const collectedTokens: string[] = [];

        
        while (true) {
          if (controller.signal.aborted) break;

          const { done, value } = await reader.read();
          clearStreamTimeout(); 

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          collectedTokens.push(chunk);

         
          setTokens((prev) => [...prev, chunk]);

        
          const m = computeMetrics(collectedTokens, startTime);
          setMetrics(m);

          
          timeoutRef.current = setTimeout(() => {
            setStatus("error");
            setError("Stream stalled — no data received for 30s.");
          }, STREAM_TIMEOUT_MS);
        }

        clearStreamTimeout();

        if (!controller.signal.aborted) {
          setStatus("done");
        }
      } catch (err: unknown) {
        clearStreamTimeout();

        if (controller.signal.aborted) {
         
          return;
        }

        const message =
          err instanceof Error ? err.message : "An unknown error occurred.";
        setError(message);
        setStatus("error");
       
      }
    },
    [clearStreamTimeout]
  );

  const rawOutput = tokens.join("");
  let displayOutput = rawOutput;
  let isThinking = false;

  if (rawOutput.includes("</think>")) {
    displayOutput = rawOutput.split("</think>")[1].trimStart();
  } else if (rawOutput.trimStart().startsWith("<")) {
    if (rawOutput.includes("<think>")) {
      displayOutput = "";
      isThinking = true;
    }
  }
  displayOutput = displayOutput.replace(/<think>[\s\S]*?(?:<\/think>|$)/g, "").trimStart();

  // Once streaming is done, persist the clean output to sessionStorage
  // so the Diff page can auto-populate both boxes.
  useEffect(() => {
    if (status !== "done" || !displayOutput) return;
    const oldA = session.getOutputA();
    if (oldA && oldA !== displayOutput) {
      session.setOutputB(oldA);
    }
    session.setOutputA(displayOutput);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return { 
    output: displayOutput, 
    rawOutput, 
    tokens, 
    status, 
    error, 
    metrics, 
    start, 
    abort, 
    reset,
    isThinking 
  };
}
