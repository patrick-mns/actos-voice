import * as webllm from '@mlc-ai/web-llm';
import type { LLMInstance, LLMState, ToolCallResult, Language } from '@actos-voice/core';

export interface WebLLMConfig {
  modelId?: string;
  systemPrompt?: string;
}

const DEFAULT_MODEL = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
const DEFAULT_SYSTEM_PROMPTS: Record<Language, string> = {
  en: `You are an assistant that detects user commands and returns tool calls in JSON.
Always respond ONLY with valid JSON.
If there is no clear command, respond with tool: null.`,
  pt: `Você é um assistente que detecta comandos do usuário e retorna chamadas de ferramentas em JSON.
Sempre responda APENAS com JSON válido.
Se não houver comando claro, responda com tool: null.`
};

export class WebLLMProvider implements LLMInstance {
  readonly id = 'web-llm';
  private _state: LLMState = 'unloaded';
  private engine: webllm.MLCEngine | null = null;
  private config: Required<WebLLMConfig>;
  private progressCallback?: (progress: number, status: string) => void;
  private stateCallback?: (state: LLMState) => void;
  private language: Language = 'en';

  constructor(config: WebLLMConfig = {}) {
    this.config = {
      modelId: config.modelId || DEFAULT_MODEL,
      systemPrompt: config.systemPrompt || ''
    };
  }

  updateConfig(config: Partial<WebLLMConfig>) {
    this.config = { ...this.config, ...config };
  }

  setLanguage(lang: Language) {
    this.language = lang;
  }

  get state() {
    return this._state;
  }

  private setState(state: LLMState) {
    this._state = state;
    this.stateCallback?.(state);
  }

  onProgress(callback: (progress: number, status: string) => void) {
    this.progressCallback = callback;
  }

  onStateChange(callback: (state: LLMState) => void) {
    this.stateCallback = callback;
  }

  async init(): Promise<void> {
    if (this.engine) return;

    this.setState('loading');
    try {
      if (!navigator.gpu) {
        throw new Error('WebGPU not supported');
      }

      this.engine = new webllm.MLCEngine();
      this.engine.setInitProgressCallback((progress) => {
        this.progressCallback?.(progress.progress * 100, progress.text);
      });

      await this.engine.reload(this.config.modelId);
      this.setState('ready');
    } catch (error) {
      this.setState('error');
      throw error;
    }
  }

  async processText(text: string): Promise<ToolCallResult | null> {
    if (!this.engine || this._state !== 'ready') {
      throw new Error('LLM not ready');
    }

    this.setState('processing');
    try {
      const systemPrompt = this.config.systemPrompt || DEFAULT_SYSTEM_PROMPTS[this.language];
      const messages: webllm.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ];

      const reply = await this.engine.chat.completions.create({
        messages,
        response_format: { type: 'json_object' }
      });

      const content = reply.choices[0].message.content || '{}';
      
      // Limpa possíveis blocos de código markdown
      const jsonStr = content.replace(/```json\n?|```/g, '').trim();
      const result = JSON.parse(jsonStr) as ToolCallResult;
      
      this.setState('ready');
      return result;
    } catch (error) {
      this.setState('error');
      throw error;
    }
  }
}

export const webLLM = (config?: WebLLMConfig) => new WebLLMProvider(config);
