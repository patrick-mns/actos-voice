# ASR Providers

Available voice recognition (Speech-to-Text) providers.

## Web Speech API (Built-in)

Default provider using the native browser API.

```tsx
import { WebSpeechASR } from '@actos-voice/react';

<ActosVoiceProvider asr={WebSpeechASR} />
```

### Compatibility

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Safari | ✅ Partial (no interim) |
| Firefox | ❌ Not supported |

### Configuration

```tsx
config={{
  asr: {
    continuous: true,       // Continuous listening
    interimResults: true,   // Partial results
  }
}}
```

### Pros
- ✅ Zero dependencies
- ✅ Works offline (in some browsers)
- ✅ Low latency

### Cons
- ❌ Does not work in all browsers
- ❌ Accuracy varies by browser/language
- ❌ No control over the model

---

## Creating a Custom Provider

Implement the `ASRProvider` interface:

```typescript
import { ASRProvider, ASRConfig } from '@actos-voice/react';

class MyCustomASR implements ASRProvider {
  readonly id = 'my-custom-asr';
  
  private _state: ASRProvider['state'] = 'idle';
  private transcriptCallback?: (text: string, isFinal: boolean) => void;
  private errorCallback?: (error: Error) => void;
  
  get state() {
    return this._state;
  }
  
  async init(config: ASRConfig): Promise<void> {
    // Initialize your ASR service
    console.log('Initializing with config:', config);
  }
  
  async start(): Promise<void> {
    this._state = 'listening';
    // Start audio capture
  }
  
  async stop(): Promise<void> {
    this._state = 'idle';
    // Stop capture
  }
  
  onTranscript(callback: (text: string, isFinal: boolean) => void): void {
    this.transcriptCallback = callback;
  }
  
  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }
  
  // Internal method to emit transcriptions
  protected emit(text: string, isFinal: boolean): void {
    this.transcriptCallback?.(text, isFinal);
  }
}
```

---

## Whisper.cpp (Future)

> 🚧 Under development

Provider using Whisper compiled to WebAssembly.

```tsx
import { WhisperASR } from '@actos-voice/asr-whisper';

<ActosVoiceProvider asr={WhisperASR} />
```

### Pros
- ✅ Works in all browsers
- ✅ High accuracy
- ✅ 100% client-side

### Cons
- ❌ Large model (~50-150MB)
- ❌ Higher CPU usage
- ❌ Initial latency (loading)

---

## Deepgram (Cloud)

> 🚧 Under development

Provider using the Deepgram API (streaming).

```tsx
import { DeepgramASR } from '@actos-voice/asr-deepgram';

<ActosVoiceProvider 
  asr={DeepgramASR} 
  config={{
    asr: {
      apiKey: 'YOUR_DEEPGRAM_API_KEY'
    }
  }}
/>
```

### Pros
- ✅ High accuracy
- ✅ Real-time streaming
- ✅ Multiple languages

### Cons
- ❌ Requires account connection
- ❌ Costs per use
- ❌ Network latency

---

## Comparison

| Provider | Offline | Accuracy | Latency | Browser Support |
|----------|---------|----------|----------|-----------------|
| Web Speech | Partial | ⭐⭐⭐ | ⚡⚡⚡ | Chrome, Edge, Safari |
| Whisper.cpp | ✅ | ⭐⭐⭐⭐ | ⚡⚡ | All |
| Deepgram | ❌ | ⭐⭐⭐⭐⭐ | ⚡⚡ | All |
