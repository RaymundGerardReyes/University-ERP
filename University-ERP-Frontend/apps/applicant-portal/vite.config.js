import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
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
                        // Apply terminal color formatting based on log level
                        const color = log.level === 'error' ? '\x1b[31m' // Red
                            : log.level === 'warn' ? '\x1b[33m' // Yellow
                                : log.level === 'debug' ? '\x1b[32m' // Green
                                    : '\x1b[36m'; // Cyan (Info)
                        const reset = '\x1b[0m';
                        // Print to the Git Bash terminal!
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
        terminalLoggerPlugin() // <-- Register the plugin here
    ],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5191',
                changeOrigin: true,
                secure: false,
            }
        }
    }
});
