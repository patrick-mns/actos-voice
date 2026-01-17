import debug from 'debug';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

class DebugLogger implements Logger {
  private debugInstance: debug.Debugger;
  private infoInstance: debug.Debugger;
  private warnInstance: debug.Debugger;
  private errorInstance: debug.Debugger;

  constructor(namespace: string = 'actos-voice') {
    this.debugInstance = debug(`${namespace}:debug`);
    this.infoInstance = debug(`${namespace}:info`);
    this.warnInstance = debug(`${namespace}:warn`);
    this.errorInstance = debug(`${namespace}:error`);
  }

  debug(message: string, ...args: unknown[]): void {
    this.debugInstance(message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.infoInstance(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.warnInstance(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.errorInstance(message, ...args);
  }
}

/**
 * Create a namespaced logger using the debug library
 * 
 * Enable logs in browser console:
 * localStorage.debug = 'actos-voice:*'
 * 
 * Enable specific namespaces:
 * localStorage.debug = 'actos-voice:controller:*'
 * 
 * @param namespace - The namespace for the logger (e.g., 'controller', 'asr', 'llm')
 */
export const createLogger = (namespace?: string): Logger => {
  const fullNamespace = namespace ? `actos-voice:${namespace}` : 'actos-voice';
  return new DebugLogger(fullNamespace);
};

export const logger = createLogger();
