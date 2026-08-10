import { createPortalConfig } from '../../libs/vite-config/index.ts';

export default createPortalConfig({
    port: 5173,
    title: 'Student Portal',
    // ADD THE TEST CONFIGURATION BELOW
    test: {
        globals: true,
        environment: 'jsdom',
        passWithNoTests: true,
    }
});