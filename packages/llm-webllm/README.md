# @actos-voice/llm-webllm

WebLLM provider for ActosVoice - Run large language models entirely in the browser using WebGPU.

## Installation

```bash
npm install @actos-voice/llm-webllm
```

## Features

- 🌐 **100% Client-Side** - No server required, runs entirely in browser
- ⚡ **WebGPU Accelerated** - Fast inference using GPU acceleration
- 🔒 **Privacy First** - All data stays on the user's device
- 🎯 **Tool Calling Support** - Full function calling capabilities
- 📦 **Model Flexibility** - Support for various Llama, Phi, and Gemma models

## Usage

### With React

```tsx
import { ActosVoiceProvider } from '@actos-voice/react';
import { WebLLM } from '@actos-voice/llm-webllm';

<ActosVoiceProvider 
  llmProvider={WebLLM}
  llmConfig={{
    model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC'
  }}
>
  {children}
</ActosVoiceProvider>
```

### Standalone

```typescript
import { WebLLM } from '@actos-voice/llm-webllm';

const llm = new WebLLM();

llm.onProgress((progress) => {
  console.log(`Loading: ${progress}%`);
});

await llm.load({
  model: 'Llama-3.2-3B-Instruct-q4f16_1-MLC'
});

const response = await llm.chat([
  { role: 'user', content: 'Hello, how are you?' }
]);

console.log(response);
```

## Configuration

```typescript
interface WebLLMConfig {
  model?: string;              // Model name from MLC catalog
  temperature?: number;        // Sampling temperature (0-2)
  max_tokens?: number;         // Maximum tokens to generate
  top_p?: number;              // Nucleus sampling parameter
}
```

## Available Models

Popular models that work well with ActosVoice:

### Llama Models (Recommended)
- `Llama-3.2-3B-Instruct-q4f16_1-MLC` - Fast, good quality (Recommended)
- `Llama-3.2-1B-Instruct-q4f16_1-MLC` - Faster, lower quality
- `Llama-3.1-8B-Instruct-q4f16_1-MLC` - Higher quality, slower

### Phi Models (Fast)
- `Phi-3.5-mini-instruct-q4f16_1-MLC` - Very fast, decent quality
- `Phi-2-q4f32_1-MLC` - Lightweight option

### Gemma Models
- `gemma-2-2b-it-q4f16_1-MLC` - Google's model, balanced

[Full model list](https://huggingface.co/mlc-ai)

## Browser Requirements

- **WebGPU Support** required
- Chrome/Edge 113+ ✅
- Safari 18+ ✅ (macOS only)
- Firefox: ⚠️ Experimental

Check support: https://caniuse.com/webgpu

## Model Size & Performance

| Model | Size | Speed | Quality |
|-------|------|-------|---------|
| Llama-3.2-1B | ~600MB | Fast | Good |
| Llama-3.2-3B | ~2GB | Medium | Better |
| Llama-3.1-8B | ~5GB | Slower | Best |

**Note:** First load requires downloading the model. Subsequent loads use browser cache.

## Example with Tools

```typescript
const response = await llm.chat(
  [
    { role: 'user', content: 'Change theme to dark' }
  ],
  [
    {
      name: 'change_theme',
      description: 'Changes app theme',
      parameters: {
        type: 'object',
        properties: {
          theme: { type: 'string', enum: ['light', 'dark'] }
        }
      },
      execute: async ({ theme }) => {
        document.body.className = theme;
        return { success: true };
      }
    }
  ]
);
```

## Documentation

📚 **[Full Documentation](https://github.com/patrick-mns/actos-voice/blob/main/docs/llm-providers.md)**

## Related Packages

- [`@actos-voice/react`](https://www.npmjs.com/package/@actos-voice/react) - React integration
- [`@actos-voice/core`](https://www.npmjs.com/package/@actos-voice/core) - Core types and controller
- [`@actos-voice/asr-webspeech`](https://www.npmjs.com/package/@actos-voice/asr-webspeech) - WebSpeech ASR provider

## Credits

Built on top of [MLC-LLM](https://github.com/mlc-ai/web-llm) and [@mlc-ai/web-llm](https://www.npmjs.com/package/@mlc-ai/web-llm).

## License

MIT © [patrick-mns](https://github.com/patrick-mns)

## Links

- [GitHub Repository](https://github.com/patrick-mns/actos-voice)
- [Report Issues](https://github.com/patrick-mns/actos-voice/issues)
