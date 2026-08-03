export type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export interface LoggerOptions {
  appName: string;
  moduleName?: string;
  enableTimestamp?: boolean;
}

export class Logger {
  private appName: string;
  private moduleName: string;
  private enableTimestamp: boolean;

  constructor(options: LoggerOptions) {
    this.appName = options.appName;
    this.moduleName = options.moduleName || 'General';
    this.enableTimestamp = options.enableTimestamp ?? true;
  }

  public createSubLogger(moduleName: string): Logger {
    return new Logger({
      appName: this.appName,
      moduleName: moduleName,
      enableTimestamp: this.enableTimestamp
    });
  }

  private formatPrefix(level: LogLevel): { prefix: string; style: string } {
    const time = this.enableTimestamp ? `[${new Date().toLocaleTimeString()}] ` : '';
    const tag = `${time}[${this.appName}] [${this.moduleName}]`;
    switch (level) {
      case 'info':
        return { prefix: `ℹ ${tag}`, style: 'color: #3b82f6; font-weight: bold;' };
      case 'warn':
        return { prefix: `⚠ ${tag}`, style: 'color: #f59e0b; font-weight: bold;' };
      case 'error':
        return { prefix: `✖ ${tag}`, style: 'color: #ef4444; font-weight: bold;' };
      case 'debug':
        return { prefix: `⚙ ${tag}`, style: 'color: #10b981; font-weight: bold;' };
    }
  }

  // --- NEW: The Terminal Transport ---
  private sendToTerminal(level: LogLevel, prefix: string, message: string, data: any[]) {
    if (typeof window === 'undefined' || typeof fetch === 'undefined') return;

    // @ts-ignore
    if (import.meta.env?.DEV) {
      // Local dev: send to Vite terminal plugin
      fetch('/__terminal-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, prefix, message, data }),
        keepalive: true
      }).catch(() => { });
    } else {
      // Production (Docker): send to C# Backend Telemetry to print in Docker console
      fetch('/api/v1/platform/telemetry/client-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, prefix, message }),
        keepalive: true
      }).catch(() => { });
    }
  }

  public info(message: string, ...data: any[]): void {
    const { prefix, style } = this.formatPrefix('info');
    if (data.length > 0) console.log(`%c${prefix} ${message}`, style, ...data);
    else console.log(`%c${prefix} ${message}`, style);

    this.sendToTerminal('info', prefix, message, data);
  }

  public warn(message: string, ...data: any[]): void {
    const { prefix, style } = this.formatPrefix('warn');
    if (data.length > 0) console.warn(`%c${prefix} ${message}`, style, ...data);
    else console.warn(`%c${prefix} ${message}`, style);

    this.sendToTerminal('warn', prefix, message, data);
  }

  public error(message: string, error?: any, ...data: any[]): void {
    const { prefix, style } = this.formatPrefix('error');
    if (error !== undefined) console.error(`%c${prefix} ${message}`, style, error, ...data);
    else console.error(`%c${prefix} ${message}`, style);

    this.sendToTerminal('error', prefix, message, data);
  }

  public debug(message: string, ...data: any[]): void {
    const { prefix, style } = this.formatPrefix('debug');
    if (data.length > 0) console.debug(`%c${prefix} ${message}`, style, ...data);
    else console.debug(`%c${prefix} ${message}`, style);

    this.sendToTerminal('debug', prefix, message, data);
  }
}

export const createLogger = (appName: string, moduleName?: string): Logger => {
  return new Logger({ appName, moduleName });
};