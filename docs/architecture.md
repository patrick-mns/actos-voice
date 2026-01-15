# Architecture

The library follows a modular architecture based on **factory functions** (Vercel AI SDK pattern).

## Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│     User     │────▶│     ASR      │────▶│  Transcribed │
│    (speech)  │     │ (Speech→Text)│     │     Text     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                                                  ▼
                                         ┌──────────────┐
                                         │     LLM      │
                                         │ (Tool Detect)│
                                         └──────┬───────┘
                                                  │
                           ┌──────────────────────┼──────────────────────┐
                           ▼                      ▼                      ▼
                    ┌────────────┐         ┌────────────┐         ┌────────────┐
                    │   Tool A   │         │   Tool B   │         │   Tool C   │
                    │ (execute)  │         │ (execute)  │         │ (execute)  │
                    └────────────┘         └────────────┘         └────────────┘
```

## Main Components

### 1. ActosVoice (Root Component)

Component that configures and connects ASR, LLM, and Tools.

```tsx
import { webSpeech } from '@actos-voice/asr-webspeech';
import { webLLM } from '@actos-voice/llm-webllm';

<ActosVoice
  asr={webSpeech({ language: 'en-US', continuous: true })}
  llm={webLLM({ model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC' })}
  tools={tools}
>
  {children}
</ActosVoice>
```

### 2. ASR Factory Function

Each ASR is a factory function that returns an `ASRInstance`:

```typescript
// Factory function
function webSpeech(config: WebSpeechConfig): ASRInstance;

// Types
interface WebSpeechConfig {
  language?: string;        // 'en-US', 'pt-BR', etc.
  continuous?: boolean;     // Continuous listening (default: true)
  interimResults?: boolean; // Partial results (default: true)
}

interface ASRInstance {
  // Unique identifier
  readonly id: string;
  
  // Reactive state
  readonly state: 'idle' | 'listening' | 'processing' | 'error';
  
  // Methods
  start(): Promise<void>;
  stop(): Promise<void>;
  
  // Callbacks
  onTranscript(callback: (text: string, isFinal: boolean) => void): void;
  onError(callback: (error: Error) => void): void;
}
```

### 3. LLM Factory Function

Each LLM is a factory function that returns an `LLMInstance`:

```typescript
// Factory function
function webLLM(config: WebLLMConfig): LLMInstance;

// Types
interface WebLLMConfig {
  model?: string;          // Model ID (default: 'Llama-3.2-1B-Instruct-q4f16_1-MLC')
  temperature?: number;    // Creativity 0-1 (default: 0.1)
  maxTokens?: number;      // Max tokens (default: 150)
  systemPrompt?: string;   // Customized prompt
}

interface LLMInstance {
  // Unique identifier
  readonly id: string;
  
  // Reactive state
  readonly state: 'unloaded' | 'loading' | 'ready' | 'processing' | 'error';
  
  // Loading progress (0-100)
  readonly loadProgress: number;
  
  // Methods
  load(): Promise<void>;
  process(text: string, tools: Tool[]): Promise<LLMResponse>;
  unload(): Promise<void>;
}

interface LLMResponse {
  tool: string | null;                    // Detected tool name
  args: Record<string, unknown> | null;   // Tool arguments
  response: string;                       // Textual response
  confidence?: number;                    // Confidence (0-1)
}
```

### 4. Tool Interface

Tool definition pattern (inspired by OpenAI/Ollama):

```typescript
interface Tool {
  // Unique identifier
  name: string;
  
  // Description for the LLM to understand when to use
  description: string;
  
  // Parameter schema (JSON Schema)
  parameters: {
    type: 'object';
    properties: Record<string, ParameterSchema>;
    required?: string[];
  };
  
  // Execution function
  execute: (args: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
}

interface ParameterSchema {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];  // Allowed values
  default?: unknown;
}

interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

## Available Hooks

### useVoiceAgent

Main hook to interact with the system:

```typescript
const {
  // State
  isListening,      // boolean - is listening
  isProcessing,     // boolean - LLM processing
  isLLMReady,       // boolean - LLM loaded
  transcript,       // string[] - transcription history
  partialTranscript,// string - current partial transcription
  
  // Actions
  startListening,   // () => void
  stopListening,    // () => void
  loadLLM,          // () => Promise<void>
  clearHistory,     // () => void
  
  // LLM Status
  llmLoadProgress,  // number (0-100)
  llmLoadStatus,    // string - status message
  llmError,         // string | null
} = useVoiceAgent();
```

### useTools

Hook to register and manage tools:

```typescript
const {
  tools,            // Tool[] - registered tools
  register,         // (tool: Tool) => void
  unregister,       // (name: string) => void
  execute,          // (name: string, args: object) => Promise<ToolResult>
  lastExecution,    // { tool, args, result, timestamp } | null
} = useTools();
```

## Data Flow

1. **User speaks** → ASR Provider captures audio
2. **ASR transcribes** → Text (partial and final) is emitted
3. **Final text** → Sent to LLM Provider
4. **LLM analyzes** → Detects intent and tool call
5. **Tool executed** → Result returned
6. **State updated** → UI reacts via hooks
