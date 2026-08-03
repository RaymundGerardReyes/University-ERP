import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// --- NEW: Custom Terminal Bridge Plugin ---
const terminalLoggerPlugin = () => ({
    name: 'vite-plugin-terminal-logger',
    configureServer(server) {
        server.middlewares.use('/__terminal-log', (req, res) => {
            if (req.method === 'POST') {
                let body = '';
                req.on('data', (chunk) => { body += chunk.toString(); });
                req.on('end', () => {
                    try {
                        const log = JSON.parse(body);
                        const color = log.level === 'error' ? '\x1b[31m'
                            : log.level === 'warn' ? '\x1b[33m'
                                : log.level === 'debug' ? '\x1b[32m'
                                    : '\x1b[36m';
                        const reset = '\x1b[0m';
                        const dataStr = log.data && log.data.length ? JSON.stringify(log.data) : '';
                        console.log(`${color}${log.prefix}${reset} ${log.message} ${dataStr}`);
                    }
                    catch (e) { }
                    res.statusCode = 200;
                    res.end();
                });
            }
        });
    }
});
export default defineConfig({
    plugins: [
        react(),
        terminalLoggerPlugin()
    ],
    resolve: {
        alias: {
            '@shell': path.resolve(import.meta.dirname, './src/shell'),
            '@features': path.resolve(import.meta.dirname, './src/features'),
            '@state': path.resolve(import.meta.dirname, './src/state'),
            '@config': path.resolve(import.meta.dirname, './src/config'),
        },
    },
    server: {
        port: 3001,
        proxy: {
            '/api': {
                target: 'http://localhost:5191',
                changeOrigin: true,
            },
        },
    },
});
