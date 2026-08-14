import { createPortalConfig } from '../../libs/vite-config/index.ts';

export default createPortalConfig({
    port: 5174, 
    title: 'Applicant Portal',
    base: '/', // Enforces root pathing
});