import { createPortalConfig } from '../../libs/vite-config/index.ts';

export default createPortalConfig({
    port: 5173,
    title: 'Student Portal',
    base: '/', // Configured for the dedicated student.university.edu subdomain
    test: {
        globals: true,
        environment: 'jsdom',
        passWithNoTests: true,
    }
});