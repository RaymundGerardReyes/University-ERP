// Remove the local import
// import './theme.css'; 

// Import the new centralized CSS from your UI Kit
import '@university-erp/ui-kit/styles.css';

import { Routing } from '@shell/Routing';
import { bootstrapPortal } from '@university-erp/shell-kit';

// Bootstrap the application
bootstrapPortal(Routing);