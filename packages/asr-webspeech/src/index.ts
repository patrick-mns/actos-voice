import type { ASRInstance, ASRState, Language } from '@actos-voice/core';

export interface WebSpeechConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

export class WebSpeechProvider implements ASRInstance {
  readonly id = 'web-speech';
  private recognition: any;
  private _state: ASRState = 'idle';
  private transcriptCallback?: (text: string, isFinal: boolean) => void;
  private stateCallback?: (state: ASRState) => void;
  private errorCallback?: (error: Error) => void;

  constructor(config: WebSpeechConfig = {}) {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Web Speech API not supported in this browser');
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = config.language || 'en-US';
    this.recognition.continuous = config.continuous ?? true;
    this.recognition.interimResults = config.interimResults ?? true;

    this.setupListeners();
  }

  setLanguage(lang: Language) {
    const speechLang = lang === 'pt' ? 'pt-BR' : 'en-US';
    if (this.recognition.lang !== speechLang) {
      this.recognition.lang = speechLang;
      // Restart if listening to apply new language
      if (this._state === 'listening') {
        this.recognition.stop();
        // The onend listener will restart it if _state is still listening
      }
    }
  }

  get state() {
    return this._state;
  }

  private setState(state: ASRState) {
    this._state = state;
    this.stateCallback?.(state);
  }

  private setupListeners() {
    this.recognition.onstart = () => {
      this.setState('listening');
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.transcriptCallback?.(transcript, true);
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript.length > 0) {
        this.transcriptCallback?.(interimTranscript, false);
      }
    };

    this.recognition.onerror = (event: any) => {
      this.setState('error');
      this.errorCallback?.(new Error(event.error));
    };

    this.recognition.onend = () => {
      if (this._state === 'listening') {
        this.recognition.start(); // Keep listening if continuous
      } else {
        this.setState('idle');
      }
    };
  }

  async start(): Promise<void> {
    this.recognition.start();
  }

  async stop(): Promise<void> {
    this._state = 'idle'; // Prevent restart in onend
    this.recognition.stop();
    this.stateCallback?.('idle');
  }

  onTranscript(callback: (text: string, isFinal: boolean) => void): void {
    this.transcriptCallback = callback;
  }

  onStateChange(callback: (state: ASRState) => void): void {
    this.stateCallback = callback;
  }

  onError(callback: (error: Error) => void): void {
    this.errorCallback = callback;
  }
}

export const webSpeech = (config?: WebSpeechConfig) => new WebSpeechProvider(config);
