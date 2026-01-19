# ActosVoice

> React library for voice applications with LLM and Tool Calling — 100% client-side.

## 🎯 Overview

ActosVoice is a modular library that combines:
- **ASR (Speech-to-Text)** — Injectable voice recognition
- **LLM (Large Language Model)** — Natural language processing on the client
- **Tool Calling** — Tool pattern inspired by OpenAI/Ollama/Gemini

```
┌─────────────────────────────────────────────────────────┐
│                    ActosVoice Library                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   🎤 ASR                   🧠 LLM                       │
│   ├── webSpeech()          ├── webLLM()                 │
│   ├── whisper()            ├── ollama()                 │
│   └── deepgram()           └── openai()                 │
│                                                         │
│   🛠️ Tools                                              │
│   ├── Built-in tools                                    │
│   └── Custom tools                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📦 Installation

```bash
npm install @actos-voice/react
```

## 🚀 Quick Start

```tsx
import { ActosVoice, useVoiceAgent } from '@actos-voice/react';
import { webSpeech } from '@actos-voice/asr-webspeech';
import { webLLM } from '@actos-voice/llm-webllm';

const tools = [
  {
    name: 'change_color',
    description: 'Changes the application background color',
    parameters: {
      type: 'object',
      properties: {
        color: { type: 'string', description: 'Color name' }
      },
      required: ['color']
    },
    execute: (args) => {
      document.body.style.backgroundColor = args.color;
      return { success: true };
    }
  }
];

function App() {
  return (
    <ActosVoice
      asr={webSpeech({ language: 'en-US' })}
      llm={webLLM({ model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC' })}
      tools={tools}
    >
      <VoiceInterface />
    </ActosVoice>
  );
}
```

## 📚 Documentation

- [Architecture](./architecture.md) — How the library works
- [ASR Providers](./asr-providers.md) — Voice recognition providers
- [LLM Providers](./llm-providers.md) — LLM providers
- [Tool Calling](./tool-calling.md) — Tool definition and usage
- [Configuration](./configuration.md) — Configuration options
- [Examples](./examples.md) — Use cases

## 🔧 Requirements

- React 18+
- Browser with WebGPU (Chrome 113+, Edge 113+) for client-side LLM
- Microphone for ASR

## 🤝 Contributing

### Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must follow this format:

```
<type>: <description>

[optional body]

[optional footer]
```

**Types:**
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks (dependencies, build, etc.)
- `perf:` — Performance improvements

**Examples:**
```bash
feat: add support for Whisper ASR provider
fix: resolve memory leak in LLM streaming
docs: update installation instructions
chore: bump dependencies to latest versions
```

## 📄 License

MIT
 