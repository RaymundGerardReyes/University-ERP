import { jsx as _jsx } from "react/jsx-runtime";
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@university-erp/auth-sdk';
import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from './shell/ErrorBoundary'; // <-- Import the new boundary
import { Routing } from './shell/Routing';
import { queryClient } from './state/queryClient';
import './theme.css'; // <-- ADD THIS LINE
const logger = createLogger('student-portal', 'AppBootstrap');
logger.info('Student Portal application initialized successfully');
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(ErrorBoundary, { children: _jsx(AuthProvider, { children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(Routing, {}) }) }) }) }));
