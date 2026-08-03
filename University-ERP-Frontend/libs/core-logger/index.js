export class Logger {
    appName;
    moduleName;
    enableTimestamp;
    constructor(options) {
        this.appName = options.appName;
        this.moduleName = options.moduleName || 'General';
        this.enableTimestamp = options.enableTimestamp ?? true;
    }
    createSubLogger(moduleName) {
        return new Logger({
            appName: this.appName,
            moduleName: moduleName,
            enableTimestamp: this.enableTimestamp
        });
    }
    formatPrefix(level) {
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
    sendToTerminal(level, prefix, message, data) {
        if (typeof window === 'undefined' || typeof fetch === 'undefined')
            return;
        // @ts-ignore
        if (import.meta.env?.DEV) {
            // Local dev: send to Vite terminal plugin
            fetch('/__terminal-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, prefix, message, data }),
                keepalive: true
            }).catch(() => { });
        }
        else {
            // Production (Docker): send to C# Backend Telemetry to print in Docker console
            fetch('/api/v1/platform/telemetry/client-log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ level, prefix, message }),
                keepalive: true
            }).catch(() => { });
        }
    }
    info(message, ...data) {
        const { prefix, style } = this.formatPrefix('info');
        if (data.length > 0)
            console.log(`%c${prefix} ${message}`, style, ...data);
        else
            console.log(`%c${prefix} ${message}`, style);
        this.sendToTerminal('info', prefix, message, data);
    }
    warn(message, ...data) {
        const { prefix, style } = this.formatPrefix('warn');
        if (data.length > 0)
            console.warn(`%c${prefix} ${message}`, style, ...data);
        else
            console.warn(`%c${prefix} ${message}`, style);
        this.sendToTerminal('warn', prefix, message, data);
    }
    error(message, error, ...data) {
        const { prefix, style } = this.formatPrefix('error');
        if (error !== undefined)
            console.error(`%c${prefix} ${message}`, style, error, ...data);
        else
            console.error(`%c${prefix} ${message}`, style);
        this.sendToTerminal('error', prefix, message, data);
    }
    debug(message, ...data) {
        const { prefix, style } = this.formatPrefix('debug');
        if (data.length > 0)
            console.debug(`%c${prefix} ${message}`, style, ...data);
        else
            console.debug(`%c${prefix} ${message}`, style);
        this.sendToTerminal('debug', prefix, message, data);
    }
}
export const createLogger = (appName, moduleName) => {
    return new Logger({ appName, moduleName });
};
