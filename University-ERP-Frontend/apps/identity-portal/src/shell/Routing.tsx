import { createLogger } from '@university-erp/core-logger';
import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

// Import the Login Page from the exact requested path
import { LoginPage } from '../features/UserLogin/UserLogin.page';

const logger = createLogger('identity-portal', 'Routing');

export const Routing: React.FC = () => {
  logger.debug('Building application route tree');

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />

        {/* Default Route: Redirect to login if they hit the root URL */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};