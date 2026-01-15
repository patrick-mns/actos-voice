# LLM Providers

Large Language Model providers for language processing and tool calling.

## WebLLM (Built-in)

Default provider using WebLLM to run models 100% in the browser via WebGPU.

```tsx
import { WebLLMProvider } from '@actos-voice/react';

<ActosVoiceProvider llm={WebLLMProvider} />
```

### Requirements

- **WebGPU**: Chrome 113+, Edge 113+
- **GPU**: Dedicated GPU recommended
- **RAM**: 4GB+ available

### Configuration

```tsx
config={{
  llm: {
    model: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    temperature: 0.1,
    maxTokens: 150,
    autoLoad: false,
  }
}}
```

### Available Models

| Model | Download | VRAM | Use Case |
|--------|----------|------|----------|
| `Llama-3.2-1B-Instruct-q4f16_1-MLC` | ~700MB | ~2GB | Simple tool calling |
| `Llama-3.2-3B-Instruct-q4f16_1-MLC` | ~1.8GB | ~4GB | Tool calling + conversation |
| `Qwen2.5-1.5B-Instruct-q4f16_1-MLC` | ~900MB | ~2.5GB | Good for multiple languages |
| `Phi-3.5-mini-instruct-q4f16_1-MLC` | ~2GB | ~4GB | Complex reasoning |
| `SmolLM2-360M-Instruct-q4f16_1-MLC` | ~250MB | ~1GB | Ultra light |

### Pros
- ✅ 100% client-side (total privacy)
- ✅ No API costs
- ✅ Works offline after download
- ✅ Low latency once loaded

### Cons
- ❌ Large initial download
- ❌ Requires WebGPU
- ❌ Quality lower than cloud models

---

## Creating a Custom Provider

Implement the `LLMProvider` interface:

```typescript
import { LLMProvider, LLMConfig, LLMResponse, Tool } from '@actos-voice/react';

class MyCustomLLM implements LLMProvider {
  readonly id = 'my-custom-llm';
  
  private _state: LLMProvider['state'] = 'unloaded';
  private _loadProgress = 0;
  
  get state() { return this._state; }
  get loadProgress() { return this._loadProgress; }
  
  async init(config: LLMConfig): Promise<void> {
    this._state = 'loading';
    
    // Load your model
    // Update this._loadProgress (0-100)
    
    this._state = 'ready';
  }
  
  async process(text: string, tools: Tool[]): Promise<LLMResponse> {
    this._state = 'processing';
    
    try {
      // Call your API/model
      const result = await this.callModel(text, tools);
      
      return {
        tool: result.toolName,
        args: result.args,
        response: result.message,
      };
    } finally {
      this._state = 'ready';
    }
  }
  
  async unload(): Promise<void> {
    // Release resources
    this._state = 'unloaded';
  }
}
```

---

## Ollama (Local Server)

> 🚧 Under development

Provider to connect with Ollama running locally.

```tsx
import { OllamaProvider } from '@actos-voice/llm-ollama';

<ActosVoiceProvider 
  llm={OllamaProvider} 
  config={{
    llm: {
      baseUrl: 'http://localhost:11434',
      model: 'llama3.2:1b',
    }
  }}
/>
```

### Pros
- ✅ Larger and more capable models
- ✅ Local GPU support
- ✅ Privacy (data does not leave the machine)

### Cons
- ❌ Requires Ollama installed
- ❌ Not 100% browser-based

---

## OpenAI (Cloud)

> 🚧 Under development

Provider for the OpenAI API.

```tsx
import { OpenAIProvider } from '@actos-voice/llm-openai';

<ActosVoiceProvider 
  llm={OpenAIProvider} 
  config={{
    llm: {
      apiKey: 'YOUR_OPENAI_API_KEY',
      model: 'gpt-4o-mini',
    }
  }}
/>
```

### Pros
- ✅ Best response quality
- ✅ Native function calling support
- ✅ No hardware requirements

### Cons
- ❌ Costs per use
- ❌ Requires internet
- ❌ Data sent to cloud

---

## Comparison

| Provider | Local | Quality | Latency | Cost |
|----------|-------|-----------|----------|-------|
| WebLLM | ✅ | ⭐⭐⭐ | ⚡⚡⚡ | Free |
| Ollama | ✅ | ⭐⭐⭐⭐ | ⚡⚡⚡ | Free |
| OpenAI | ❌ | ⭐⭐⭐⭐⭐ | ⚡⚡ | $$$ |
| Anthropic | ❌ | ⭐⭐⭐⭐⭐ | ⚡⚡ | $$$ |

---

## Customized System Prompt

You can customize the system prompt for tool calling:

```tsx
config={{
  llm: {
    systemPrompt: `
You are an assistant that detects user commands.
Respond ONLY with valid JSON:
{"tool": "name", "args": {...}, "response": "text"}

Available tools:
{{TOOLS}}
    `.trim()
  }
}}
```

> 💡 Use `{{TOOLS}}` as a placeholder - it will be automatically replaced by the list of tools.
