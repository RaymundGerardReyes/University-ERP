import { Routing } from '@shell/Routing';
import { bootstrapPortal } from '@university-erp/shell-kit';
import './theme.css';

console.log("VITE BASE URL IS:", import.meta.env.BASE_URL);
console.log("LOCATION IS:", window.location.pathname, window.location.hash);
bootstrapPortal(Routing);