import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '../../applicant-portal/src/theme.css';

const logger = createLogger('registrar-portal', 'Bootstrap');

try {
  logger.info('Initializing Registrar Portal...');
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    throw new Error('Root container missing in index.html');
  }

  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  logger.info('Registrar Portal successfully mounted.');
} catch (error) {
  logger.error('Failed to initialize Registrar Portal', error);
  document.body.innerHTML = '<div style="padding: 2rem; color: red;"><h1>Application Error</h1><p>Failed to load the Registrar Portal. Check console for details.</p></div>';
}
