# Examples

Practical use cases of the library.

## 1. Voice Interface Control

Change colors, navigate, and control the UI with voice commands.

```tsx
import { ActosVoiceProvider, useVoiceAgent } from '@actos-voice/react';

const tools = [
  {
    name: 'change_theme',
    description: 'Changes the application theme to light or dark',
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
  },
  {
    name: 'navigate',
    description: 'Navigates to an application page',
    parameters: {
      type: 'object',
      properties: {
        page: { 
          type: 'string', 
          enum: ['home', 'settings', 'profile', 'help'],
          description: 'Destination page'
        }
      },
      required: ['page']
    },
    execute: ({ page }) => {
      window.location.hash = `#/${page}`;
      return { success: true };
    }
  },
  {
    name: 'scroll',
    description: 'Scrolls the page up or down',
    parameters: {
      type: 'object',
      properties: {
        direction: { 
          type: 'string', 
          enum: ['up', 'down', 'top', 'bottom'],
          description: 'Scroll direction'
        }
      },
      required: ['direction']
    },
    execute: ({ direction }) => {
      const scrollMap = {
        up: () => window.scrollBy(0, -300),
        down: () => window.scrollBy(0, 300),
        top: () => window.scrollTo(0, 0),
        bottom: () => window.scrollTo(0, document.body.scrollHeight),
      };
      scrollMap[direction]?.();
      return { success: true };
    }
  }
];

function VoiceUI() {
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
      
      <p>Say: "change to dark theme", "go to settings", "scroll down"</p>
    </div>
  );
}
```

---

## 2. Form Assistant

Fill out forms with voice commands.

```tsx
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});

const tools = [
  {
    name: 'fill_field',
    description: 'Fills a form field',
    parameters: {
      type: 'object',
      properties: {
        field: { 
          type: 'string', 
          enum: ['name', 'email', 'phone'],
          description: 'Field to fill'
        },
        value: { 
          type: 'string',
          description: 'Value to insert'
        }
      },
      required: ['field', 'value']
    },
    execute: ({ field, value }) => {
      setFormData(prev => ({ ...prev, [field]: value }));
      return { success: true };
    }
  },
  {
    name: 'submit_form',
    description: 'Submits the form',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      console.log('Submitting:', formData);
      // Submission logic
      return { success: true };
    }
  },
  {
    name: 'clear_form',
    description: 'Clears all form fields',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      setFormData({ name: '', email: '', phone: '' });
      return { success: true };
    }
  }
];

// Usage: "fill name with John Doe"
// Usage: "email is john@email.com"
// Usage: "submit form"
```

---

## 3. Music Player

Control a music player with voice.

```tsx
const audioRef = useRef<HTMLAudioElement>(null);
const [playlist] = useState([
  { id: 1, name: 'Song 1', url: '/music/song1.mp3' },
  { id: 2, name: 'Song 2', url: '/music/song2.mp3' },
]);
const [currentTrack, setCurrentTrack] = useState(0);

const tools = [
  {
    name: 'play',
    description: 'Starts music playback',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      audioRef.current?.play();
      return { success: true };
    }
  },
  {
    name: 'pause',
    description: 'Pauses the music',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      audioRef.current?.pause();
      return { success: true };
    }
  },
  {
    name: 'next_track',
    description: 'Skips to the next song',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      setCurrentTrack(prev => (prev + 1) % playlist.length);
      return { success: true };
    }
  },
  {
    name: 'previous_track',
    description: 'Goes back to the previous song',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      setCurrentTrack(prev => prev === 0 ? playlist.length - 1 : prev - 1);
      return { success: true };
    }
  },
  {
    name: 'set_volume',
    description: 'Sets the music volume',
    parameters: {
      type: 'object',
      properties: {
        level: { 
          type: 'number',
          description: 'Volume level from 0 to 100'
        }
      },
      required: ['level']
    },
    execute: ({ level }) => {
      if (audioRef.current) {
        audioRef.current.volume = Math.max(0, Math.min(100, level)) / 100;
      }
      return { success: true };
    }
  }
];

// Usage: "play", "pause", "next", "volume 50"

---

## 4. Smart Home (IoT)

Control smart home devices.

```tsx
const tools = [
  {
    name: 'control_light',
    description: 'Controls home lights',
    parameters: {
      type: 'object',
      properties: {
        room: { 
          type: 'string',
          enum: ['living room', 'bedroom', 'kitchen', 'bathroom'],
          description: 'Home room'
        },
        action: { 
          type: 'string',
          enum: ['on', 'off', 'dim'],
          description: 'Action: turn on, turn off, or dim'
        },
        brightness: {
          type: 'number',
          description: 'Intensity (0-100) for dim action'
        }
      },
      required: ['room', 'action']
    },
    execute: async ({ room, action, brightness }) => {
      await fetch('/api/lights', {
        method: 'POST',
        body: JSON.stringify({ room, action, brightness })
      });
      return { success: true };
    }
  },
  {
    name: 'set_temperature',
    description: 'Adjusts air conditioning temperature',
    parameters: {
      type: 'object',
      properties: {
        temperature: { 
          type: 'number',
          description: 'Temperature in Celsius (16-30)'
        }
      },
      required: ['temperature']
    },
    execute: async ({ temperature }) => {
      const temp = Math.max(16, Math.min(30, temperature));
      await fetch('/api/ac', {
        method: 'POST',
        body: JSON.stringify({ temperature: temp })
      });
      return { success: true };
    }
  }
];

// Usage: "turn on living room light"
// Usage: "temperature 22 degrees"
// Usage: "dim bedroom light to 30%"
```

---

## 5. Accessibility

Assistance for users with visual impairments.

```tsx
const tools = [
  {
    name: 'read_content',
    description: 'Reads the main content of the page',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      const main = document.querySelector('main');
      const text = main?.textContent || 'Content not found';
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
      
      return { success: true };
    }
  },
  {
    name: 'increase_font',
    description: 'Increases the font size',
    parameters: { type: 'object', properties: {} },
    execute: () => {
      const current = parseFloat(getComputedStyle(document.body).fontSize);
      document.body.style.fontSize = `${current + 2}px`;
      return { success: true };
    }
  },
  {
    name: 'high_contrast',
    description: 'Activates high contrast mode',
    parameters: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' }
      },
      required: ['enabled']
    },
    execute: ({ enabled }) => {
      document.body.classList.toggle('high-contrast', enabled);
      return { success: true };
    }
  }
];

// Usage: "read page", "increase font", "turn on high contrast"
```
