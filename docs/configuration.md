# Configuration

Library configuration options.

## ActosVoice Config

```tsx
import { webSpeech } from '@actos-voice/asr-webspeech';
import { webLLM } from '@actos-voice/llm-webllm';

<ActosVoice
  asr={webSpeech({ 
    language: 'en-US',
    continuous: true,
    interimResults: true,
  })}
  llm={webLLM({ 
    model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    temperature: 0.1,
    maxTokens: 150,
    autoLoad: false,
  })}
  tools={tools}
  debug={true}
  onTranscript={(text, isFinal) => console.log(text)}
  onToolCall={(tool, args, result) => console.log(tool, args)}
  onError={(error) => console.error(error)}
>
```

## Options by Factory

### webSpeech()

```tsx
webSpeech({
  language: 'en-US',       // Language (default: 'en-US')
  continuous: true,        // Continuous listening (default: true)
  interimResults: true,    // Partial results (default: true)
})
```

| Option | Type | Default | Description |
|-------|------|--------|-----------|
| `language` | `string` | `'en-US'` | Language for recognition |
| `continuous` | `boolean` | `true` | Do not stop after one sentence |
| `interimResults` | `boolean` | `true` | Emit partial results |

### webLLM()

```tsx
webLLM({
  model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  temperature: 0.1,
  maxTokens: 150,
  autoLoad: false,
  systemPrompt: '...',
})
```

| Option | Type | Default | Description |
|-------|------|--------|-----------|
| `model` | `string` | `'Llama-3.2-1B-Instruct-q4f16_1-MLC'` | Model ID |
| `temperature` | `number` | `0.1` | Creativity (0-1) |
| `maxTokens` | `number` | `150` | Maximum tokens |
| `autoLoad` | `boolean` | `false` | Load on mount |
| `systemPrompt` | `string` | (built-in) | Customized prompt |

### ollama() (future)

```tsx
ollama({
  baseUrl: 'http://localhost:11434',
  model: 'llama3.2:1b',
})
```

### openai() (future)

```tsx
openai({
  apiKey: 'sk-...',
  model: 'gpt-4o-mini',
})
```

## ActosVoice Callbacks

| Callback | Signature | Description |
|----------|------------|-----------|
| `onTranscript` | `(text: string, isFinal: boolean) => void` | Called on each transcription |
| `onToolCall` | `(tool: string, args: object, result: ToolResult) => void` | Called after tool execution |
| `onError` | `(error: Error) => void` | Called on error |
| `onLLMReady` | `() => void` | Called when LLM finished loading |

## Full Example

```tsx
import { ActosVoice, useVoiceAgent } from '@actos-voice/react';
import { webSpeech } from '@actos-voice/asr-webspeech';
import { webLLM } from '@actos-voice/llm-webllm';

const tools = [
  // ... your tools
];

function App() {
  return (
    <ActosVoice
      asr={webSpeech({ 
        language: 'en-US',
        continuous: true,
        interimResults: true,
      })}
      llm={webLLM({ 
        model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
        temperature: 0.1,
        maxTokens: 150,
        autoLoad: false,
      })}
      tools={tools}
      debug={process.env.NODE_ENV === 'development'}
      onTranscript={(text, isFinal) => {
        if (isFinal) console.log('📝 Final:', text);
      }}
      onToolCall={(tool, args, result) => {
        console.log(`🛠 ${tool}(${JSON.stringify(args)}) =>`, result);
      }}
      onError={(error) => {
        console.error('❌ Error:', error);
      }}
    >
      <MyApp />
    </ActosVoice>
  );
}
```

## Configuration via Environment

You can use environment variables:

```bash
# .env
VITE_ACTOSVOICE_LANGUAGE=en-US
VITE_ACTOSVOICE_DEBUG=true
VITE_ACTOSVOICE_LLM_MODEL=Llama-3.2-1B-Instruct-q4f16_1-MLC
```

```tsx
const config = {
  language: import.meta.env.VITE_ACTOSVOICE_LANGUAGE || 'en-US',
  debug: import.meta.env.VITE_ACTOSVOICE_DEBUG === 'true',
  llm: {
    model: import.meta.env.VITE_ACTOSVOICE_LLM_MODEL,
  },
};
```

## Available LLM Models (WebLLM)

| Model | Size | Speed | Quality |
|--------|---------|------------|-----------|
| `Llama-3.2-1B-Instruct-q4f16_1-MLC` | ~700MB | ⚡⚡⚡ | ⭐⭐ |
| `Llama-3.2-3B-Instruct-q4f16_1-MLC` | ~1.8GB | ⚡⚡ | ⭐⭐⭐ |
| `Phi-3.5-mini-instruct-q4f16_1-MLC` | ~2GB | ⚡⚡ | ⭐⭐⭐ |
| `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` | ~900MB | ⚡⚡⚡ | ⭐⭐⭐ |

> 💡 For simple tool calling, smaller models (1B-3B) are sufficient and faster.
