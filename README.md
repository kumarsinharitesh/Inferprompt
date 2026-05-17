# Developer Inference Portal
> A production-ready browser-based inference playground built with **React 19 + TypeScript + Vite + Tailwind CSS + Recharts**.

## Features
| Feature | Description |
| **Inference Playground** | Stream model responses token-by-token with live metrics |
| **Audio Input** | Record audio via MediaRecorder API with Web Speech API transcription |
| **Model Diff View** | Side-by-side comparison using the custom **ABTD** algorithm |
| **Analytics Dashboard** | Recharts visualisations: Bar, Line, Pie, Table — persisted to localStorage |
| **5 Providers** | Mock (built-in), Sarvam AI , OpenRouter, Gemini, Groq |


## Demo Video
link-->
## Deployment Link
link-->
## github repository
link-->


## How To Start

```bash
# Clone / open in your workspace
cd Developer-Inference-Portal

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your API keys:

```bash
cp .env.example .env.local
```
Note:- In github repository i didn't push any file related to the name 'env' so if you use any api key then create a file on your own and fill your api keys details.

| Variable | Provider | Required |
| `VITE_SARVAM_API_KEY` | Sarvam AI | For Sarvam provider |
| `VITE_OPENROUTER_API_KEY` | OpenRouter | For OpenRouter |
| `VITE_GEMINI_API_KEY` | Google Gemini | For Gemini |
| `VITE_GROQ_API_KEY` | Groq | For Groq |

> **The Mock provider works without any keys** — great for local development.

## Tech Stack

- **React 19** — createRoot, Strict Mode
- **TypeScript** — strict mode, zero `any` usage
- **Vite 8** — lightning-fast HMR + production bundler
- **Tailwind CSS v4** — utility-first styling with custom keyframes
- **Recharts** — composable chart library
- **React Router DOM** — client-side routing (HashRouter for Vercel compatibility)
- **MediaRecorder API** — audio capture
- **Web Speech API** — client-side transcription
- **Fetch API + ReadableStream** — streaming responses

## Project Structure

```
src/
├── types/
│   └── index.ts              # All shared TypeScript interfaces
├── utils/
│   ├── diff.ts               # ABTD algorithm (custom token diff)
│   ├── metrics.ts            # Token count / tok/sec / latency helpers
│   └── storage.ts            # localStorage + sessionStorage wrappers
├── services/
│   ├── providerFactory.ts    # Provider instantiation factory
│   └── providers/
│       ├── MockInferenceProvider.ts
│       ├── SarvamProvider.ts
│       ├── OpenRouterProvider.ts
│       ├── GeminiProvider.ts
│       └── GroqProvider.ts
├── hooks/
│   ├── useStreaming.ts        # Streaming lifecycle + metrics + abort
│   └── useAudioRecorder.ts   # MediaRecorder + SpeechRecognition
├── components/
│   ├── Navbar.tsx
│   ├── ProviderSelector.tsx
│   ├── MetricsBar.tsx
│   ├── StreamingOutput.tsx
│   ├── AudioRecorder.tsx
│   ├── InferencePlayground.tsx
│   ├── DiffView.tsx
│   └── AnalyticsDashboard.tsx
├── pages/
│   ├── PlaygroundPage.tsx
│   ├── DiffPage.tsx
│   └── AnalyticsPage.tsx
├── App.tsx                   # Router + layout shell
├── main.tsx                  # Entry point
└── index.css                 # Tailwind + custom animations
```

## Deployment to Vercel

1. Push this repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy — `vercel.json` handles SPA routing automatically

```bash
# Or deploy via CLI
npm install -g vercel
vercel --prod
```

## Documentation

| Doc | Description |
| [Architecture](docs/architecture.md) | Component tree, data flow, provider pattern |
| [ABTD Algorithm](docs/abtd-algorithm.md) | Full algorithm walkthrough |
| [Accessibility](docs/accessibility.md) | WCAG AA checklist |
| [Error Handling](docs/error-handling.md) | All error scenarios |
| [Interview Q&A](docs/interview-questions.md) | 8 prepared answers |
| [Future Scope](docs/future-scope.md) | Roadmap items |

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                     App.tsx                       │
│           (HashRouter + global layout)            │
└─────────────┬────────────────────────────────────┘
              │
    ┌─────────┴──────────────┐
    │         Pages          │
    │  Playground / Diff /   │
    │      Analytics         │
    └─────────┬──────────────┘
              │
    ┌─────────┴──────────────────────────────────┐
    │              Components                     │
    │  InferencePlayground → useStreaming         │
    │  AudioRecorder       → useAudioRecorder     │
    │  DiffView            → runABTD()            │
    │  AnalyticsDashboard  → Recharts             │
    └─────────┬──────────────────────────────────┘
              │
    ┌─────────┴──────────────┐
    │       Services          │
    │  providerFactory()     │
    │  Mock / Sarvam / ...   │
    └────────────────────────┘
```

## 📄 License

MIT — built as a frontend internship assignment for Sarvam AI.
