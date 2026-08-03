import { createLogger } from '@university-erp/core-logger';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const logger = createLogger('student-portal', 'Navigation');
export const NavigationLogger = () => {
    const location = useLocation();
    useEffect(() => {
        // This uses our centralized logger. 
        // In dev, it logs to the browser console and Vite terminal.
        // In production, it sends a telemetry ping to the C# backend to print in the Docker console!
        logger.info(`[SPA Navigation] Changed page to: ${location.pathname}`);
    }, [location]);
    return null;
};
