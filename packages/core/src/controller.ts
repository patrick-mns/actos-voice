import type { ASRInstance, LLMInstance, ActosVoiceConfig, Language, Tool } from './types';
import { createLogger } from './logger';

const logger = createLogger('controller');

export class ActosVoiceController {
  private asr: ASRInstance;
  private llm: LLMInstance;
  private tools: Record<string, Tool>;
  private transcriptListeners: ((text: string, isFinal: boolean) => void)[] = [];
  private language: Language;
  private isProcessing = false;

  constructor(config: ActosVoiceConfig) {
    this.asr = config.asr;
    this.llm = config.llm;
    this.tools = config.tools || {};
    this.language = config.language || 'en';

    this.setupListeners();
    this.updateInstancesLanguage();
  }

  setLanguage(lang: Language) {
    this.language = lang;
    this.updateInstancesLanguage();
  }

  getLanguage(): Language {
    return this.language;
  }

  updateConfig(config: Partial<ActosVoiceConfig>) {
    if (config.tools) {
      this.tools = config.tools;
    }
    if (config.language) {
      this.language = config.language;
    }
    if (config.asr) {
      this.asr = config.asr;
      this.setupListeners();
    }
    if (config.llm) {
      this.llm = config.llm;
    }
    this.updateInstancesLanguage();
  }

  private updateInstancesLanguage() {
    if (this.asr.setLanguage) {
      this.asr.setLanguage(this.language);
    }
    if (this.llm.setLanguage) {
      this.llm.setLanguage(this.language);
    }
  }

  onTranscript(callback: (text: string, isFinal: boolean) => void) {
    this.transcriptListeners.push(callback);
    return () => {
      this.transcriptListeners = this.transcriptListeners.filter(cb => cb !== callback);
    };
  }

  private setupListeners() {
    this.asr.onTranscript((text, isFinal) => {
      // Notify custom listeners (like React hooks)
      this.transcriptListeners.forEach(cb => cb(text, isFinal));

      if (isFinal && text.trim().length > 0) {
        this.processLLM(text);
      }
    });

    this.asr.onError((error) => {
      logger.error('ASR Error:', error);
    });
  }

  private async processLLM(text: string) {
    if (this.isProcessing) {
      return;
    }

    try {
      this.isProcessing = true;
      const result = await this.llm.processText(text);
      
      if (!result) {
        return;
      }

      if (result.tool && this.tools[result.tool]) {
        try {
          const tool = this.tools[result.tool];
          await tool.execute(result.args);
        } catch (toolError) {
          logger.error(`Error executing tool ${result.tool}:`, toolError);
        }
      } else if (result.tool) {
        logger.warn(`Tool "${result.tool}" requested by LLM but not found in config.tools`);
      }
    } catch (error) {
      logger.error('LLM Processing Error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  async start() {
    await this.llm.init();
    await this.asr.start();
  }

  async stop() {
    await this.asr.stop();
  }
}

export const createActosVoice = (config: ActosVoiceConfig) => {
  return new ActosVoiceController(config);
};
