# @actos-voice/core

Core types, interfaces, and controller logic for ActosVoice - A modern voice AI library.

## Installation

```bash
npm install @actos-voice/core
```

## Overview

This package provides the foundational building blocks for ActosVoice:

- **Core Types** - TypeScript interfaces for ASR, LLM, and Tool providers
- **Controller** - Central orchestration logic for voice interactions
- **Tool System** - JSON Schema-based tool calling interface

## Usage

Most users should use [`@actos-voice/react`](https://www.npmjs.com/package/@actos-voice/react) instead of this package directly. This package is primarily for:

- Building custom framework integrations (Vue, Svelte, Angular, etc.)
- Creating custom ASR or LLM providers
- Advanced use cases requiring direct controller access

## Core Types

### ASRProvider

```typescript
interface ASRProvider {
  start(): Promise<void>;
  stop(): void;
  onTranscript(callback: (text: string) => void): void;
  onError(callback: (error: Error) => void): void;
}
```

### LLMProvider

```typescript
interface LLMProvider {
  load(config?: LLMConfig): Promise<void>;
  chat(messages: ChatMessage[], tools?: Tool[]): Promise<string>;
  onProgress(callback: (progress: number) => void): void;
}
```

### Tool

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: JSONSchema;
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
}
```

## Example: Custom Integration

```typescript
import { VoiceController } from '@actos-voice/core';
import { WebSpeechASR } from '@actos-voice/asr-webspeech';
import { WebLLM } from '@actos-voice/llm-webllm';

const controller = new VoiceController({
  asrProvider: new WebSpeechASR(),
  llmProvider: new WebLLM(),
  tools: [
    {
      name: 'greet',
      description: 'Greet the user',
      parameters: { type: 'object', properties: {} },
      execute: async () => {
        console.log('Hello!');
        return { success: true };
      }
    }
  ]
});

await controller.initialize();
await controller.startListening();
```

## Documentation

📚 **[Full Documentation](https://github.com/patrick-mns/actos-voice/tree/main/docs)**

## Related Packages

- [`@actos-voice/react`](https://www.npmjs.com/package/@actos-voice/react) - React hooks and components
- [`@actos-voice/asr-webspeech`](https://www.npmjs.com/package/@actos-voice/asr-webspeech) - WebSpeech ASR provider
- [`@actos-voice/llm-webllm`](https://www.npmjs.com/package/@actos-voice/llm-webllm) - WebLLM provider

## License

MIT © [patrick-mns](https://github.com/patrick-mns)

## Links

- [GitHub Repository](https://github.com/patrick-mns/actos-voice)
- [Report Issues](https://github.com/patrick-mns/actos-voice/issues)
