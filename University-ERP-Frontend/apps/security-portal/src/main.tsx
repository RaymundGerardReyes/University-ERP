import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '@university-erp/ui-kit/styles.css';

const logger = createLogger('security-portal', 'Bootstrap');

try {
  logger.info('Initializing Security Portal...');
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
  
  logger.info('Security Portal successfully mounted.');
} catch (error) {
  logger.error('Failed to initialize Security Portal', error);
  document.body.innerHTML = '<div style="padding: 2rem; color: red;"><h1>Application Error</h1><p>Failed to load the Security Portal. Check console for details.</p></div>';
}
