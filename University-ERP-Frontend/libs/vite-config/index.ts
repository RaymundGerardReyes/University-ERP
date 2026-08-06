import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, UserConfig } from 'vite';

const terminalLoggerPlugin = () => ({
  name: 'vite-plugin-terminal-logger',
  configureServer(server: any) {
    server.middlewares.use('/__terminal-log', (req: any, res: any) => {
      if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => { body += chunk.toString(); });
        req.on('end', () => {
          try {
            const log = JSON.parse(body);
            const color = log.level === 'error' ? '\x1b[31m' // Red
              : log.level === 'warn' ? '\x1b[33m' // Yellow
              : log.level === 'debug' ? '\x1b[32m' // Green
              : '\x1b[36m';                        // Cyan (Info)
            const reset = '\x1b[0m';
            const dataStr = log.data && log.data.length ? JSON.stringify(log.data) : '';
            console.log(`${color}${log.prefix}${reset} ${log.message} ${dataStr}`);
          } catch (e) { }
          res.statusCode = 200;
          res.end();
        });
      }
    });
  }
});
export interface PortalConfig {
  port: number;
  apiTarget?: string;
  title?: string;
}

export function createPortalConfig(options: PortalConfig): UserConfig {
  return defineConfig({
    plugins: [
      react(),
      terminalLoggerPlugin(),
      ...(options.title ? [{
        name: 'html-title-injector',
        transformIndexHtml(html: string) {
          return html.replace(/<title>.*?<\/title>/, `<title>${options.title} | University ERP</title>`);
        }
      }] : [])
    ],
    resolve: {
      alias: {
        '@shell': path.resolve(process.cwd(), './src/shell'),
        '@features': path.resolve(process.cwd(), './src/features'),
        '@state': path.resolve(process.cwd(), './src/state'),
        '@config': path.resolve(process.cwd(), './src/config'),
      },
    },
    server: {
      port: options.port,
      strictPort: true,
      proxy: {
        '/api': {
          target: options.apiTarget ?? 'http://localhost:5191',
          changeOrigin: true,
        },
      },
    },
  });
}
