# @actos-voice/react

React hooks and components for ActosVoice - A modern voice AI library for building voice-controlled interfaces with client-side AI models.

## Installation

```bash
npm install @actos-voice/react
```

## Quick Start

```tsx
import { ActosVoiceProvider, useVoiceAgent } from '@actos-voice/react';

function App() {
  return (
    <ActosVoiceProvider>
      <VoiceInterface />
    </ActosVoiceProvider>
  );
}

function VoiceInterface() {
  const { 
    isListening, 
    isLLMReady, 
    startListening, 
    stopListening,
    loadLLM,
    llmLoadProgress 
  } = useVoiceAgent();

  return (
    <div>
      {!isLLMReady ? (
        <button onClick={loadLLM}>
          Load AI ({llmLoadProgress}%)
        </button>
      ) : (
        <button onClick={isListening ? stopListening : startListening}>
          {isListening ? '🔴 Stop' : '🎤 Speak'}
        </button>
      )}
    </div>
  );
}
```

## Features

- 🎤 **Voice Recognition** - Built-in ASR (Automatic Speech Recognition) support
- 🤖 **Client-Side AI** - Run LLMs entirely in the browser with WebGPU
- 🔧 **Tool Calling** - Define custom functions the AI can execute
- ⚡ **Real-time** - Stream audio and get instant responses
- 🎯 **Type-Safe** - Full TypeScript support
- 🪝 **React Hooks** - Easy integration with React apps

## Core Hooks

### `useVoiceAgent()`

Main hook for voice interaction:

```tsx
const {
  isListening,      // Is currently listening to audio?
  isLLMReady,       // Is the LLM loaded?
  loadLLM,          // Load the LLM model
  startListening,   // Start voice capture
  stopListening,    // Stop voice capture
  llmLoadProgress,  // LLM loading progress (0-100)
  transcript,       // Current speech transcript
  response          // AI response text
} = useVoiceAgent();
```

## Tool Calling

Define custom tools the AI can execute:

```tsx
import { ActosVoiceProvider, Tool } from '@actos-voice/react';

const changeThemeTool: Tool = {
  name: 'change_theme',
  description: 'Changes the application theme',
  parameters: {
    type: 'object',
    properties: {
      theme: { 
        type: 'string', 
        enum: ['light', 'dark'],
        description: 'Desired theme'
      }
    },
    required: ['theme']
  },
  execute: ({ theme }) => {
    document.documentElement.setAttribute('data-theme', theme);
    return { success: true };
  }
};

<ActosVoiceProvider tools={[changeThemeTool]}>
  {children}
</ActosVoiceProvider>
```

## Custom Providers

Use different ASR and LLM providers:

```tsx
import { ActosVoiceProvider } from '@actos-voice/react';
import { WebSpeechASR } from '@actos-voice/asr-webspeech';
import { WebLLM } from '@actos-voice/llm-webllm';

<ActosVoiceProvider
  asrProvider={WebSpeechASR}
  llmProvider={WebLLM}
  llmConfig={{
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC'
  }}
>
  {children}
</ActosVoiceProvider>
```

## Documentation

For full documentation, examples, and guides:

📚 **[Complete Documentation](https://github.com/patrick-mns/actos-voice/tree/main/docs)**

## Examples

Check out practical examples:
- [Voice UI Control](https://github.com/patrick-mns/actos-voice/blob/main/docs/examples.md#1-voice-interface-control)
- [Form Assistant](https://github.com/patrick-mns/actos-voice/blob/main/docs/examples.md#2-form-assistant)
- [Music Player](https://github.com/patrick-mns/actos-voice/blob/main/docs/examples.md#3-music-player)
- [Smart Home Control](https://github.com/patrick-mns/actos-voice/blob/main/docs/examples.md#4-smart-home-iot)
- [Accessibility Features](https://github.com/patrick-mns/actos-voice/blob/main/docs/examples.md#5-accessibility)

## Related Packages

- [`@actos-voice/core`](https://www.npmjs.com/package/@actos-voice/core) - Core types and controller
- [`@actos-voice/asr-webspeech`](https://www.npmjs.com/package/@actos-voice/asr-webspeech) - WebSpeech ASR provider
- [`@actos-voice/llm-webllm`](https://www.npmjs.com/package/@actos-voice/llm-webllm) - WebLLM provider

## License

MIT © [patrick-mns](https://github.com/patrick-mns)

## Links

- [GitHub Repository](https://github.com/patrick-mns/actos-voice)
- [Demo](https://github.com/patrick-mns/actos-voice/tree/main/demo)
- [Report Issues](https://github.com/patrick-mns/actos-voice/issues)
