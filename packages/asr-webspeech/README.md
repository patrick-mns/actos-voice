# @actos-voice/asr-webspeech

WebSpeech API provider for ActosVoice - Browser-native speech recognition.

## Installation

```bash
npm install @actos-voice/asr-webspeech
```

## Features

- 🌐 **Browser Native** - Uses the Web Speech API (no external dependencies)
- 🎤 **Real-time Recognition** - Continuous speech-to-text streaming
- 🌍 **Multi-language** - Supports multiple languages
- 📱 **Cross-platform** - Works on Chrome, Edge, Safari (with limitations)

## Usage

### With React

```tsx
import { ActosVoiceProvider } from '@actos-voice/react';
import { WebSpeechASR } from '@actos-voice/asr-webspeech';

<ActosVoiceProvider asrProvider={WebSpeechASR}>
  {children}
</ActosVoiceProvider>
```

### Standalone

```typescript
import { WebSpeechASR } from '@actos-voice/asr-webspeech';

const asr = new WebSpeechASR({ language: 'en-US' });

asr.onTranscript((text) => {
  console.log('Recognized:', text);
});

asr.onError((error) => {
  console.error('ASR Error:', error);
});

await asr.start();
// ... speak into microphone ...
asr.stop();
```

## Configuration

```typescript
interface WebSpeechConfig {
  language?: string;           // Default: 'en-US'
  continuous?: boolean;        // Default: true
  interimResults?: boolean;    // Default: true
  maxAlternatives?: number;    // Default: 1
}
```

### Example with Configuration

```typescript
const asr = new WebSpeechASR({
  language: 'pt-BR',
  continuous: true,
  interimResults: true
});
```

## Supported Languages

The Web Speech API supports many languages, including:

- `en-US` - English (United States)
- `en-GB` - English (United Kingdom)
- `pt-BR` - Portuguese (Brazil)
- `es-ES` - Spanish (Spain)
- `fr-FR` - French (France)
- `de-DE` - German (Germany)
- `ja-JP` - Japanese (Japan)
- `zh-CN` - Chinese (Simplified)

[Full language list](https://cloud.google.com/speech-to-text/docs/languages)

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full support |
| Edge | ✅ Full support |
| Safari | ⚠️ Limited (iOS 14.5+) |
| Firefox | ❌ Not supported |

## Documentation

📚 **[Full Documentation](https://github.com/patrick-mns/actos-voice/blob/main/docs/asr-providers.md)**

## Related Packages

- [`@actos-voice/react`](https://www.npmjs.com/package/@actos-voice/react) - React integration
- [`@actos-voice/core`](https://www.npmjs.com/package/@actos-voice/core) - Core types and controller
- [`@actos-voice/llm-webllm`](https://www.npmjs.com/package/@actos-voice/llm-webllm) - WebLLM provider

## License

MIT © [patrick-mns](https://github.com/patrick-mns)

## Links

- [GitHub Repository](https://github.com/patrick-mns/actos-voice)
- [Report Issues](https://github.com/patrick-mns/actos-voice/issues)
