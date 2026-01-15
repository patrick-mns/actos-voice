export type ASRState = 'idle' | 'listening' | 'processing' | 'error';
export type Language = 'en' | 'pt';

export interface ASRInstance {
  readonly id: string;
  readonly state: ASRState;
  start(): Promise<void>;
  stop(): Promise<void>;
  setLanguage?(lang: Language): void;
  onTranscript(callback: (text: string, isFinal: boolean) => void): void;
  onStateChange?(callback: (state: ASRState) => void): void;
  onError(callback: (error: Error) => void): void;
}

export type LLMState = 'unloaded' | 'loading' | 'ready' | 'processing' | 'error';

export interface ToolCallResult {
  tool: string | null;
  args: Record<string, any> | null;
  response: string;
}

export interface LLMInstance {
  readonly id: string;
  readonly state: LLMState;
  init(): Promise<void>;
  processText(text: string): Promise<ToolCallResult | null>;
  setLanguage?(lang: Language): void;
  onProgress?(callback: (progress: number, status: string) => void): void;
  onStateChange?(callback: (state: LLMState) => void): void;
}

export interface Tool {
  name: string;
  description: string;
  parameters: any; // JSON Schema style
  execute: (args: any) => any | Promise<any>;
}

export interface ActosVoiceConfig {
  asr: ASRInstance;
  llm: LLMInstance;
  tools?: Record<string, Tool>;
  language?: Language;
}
