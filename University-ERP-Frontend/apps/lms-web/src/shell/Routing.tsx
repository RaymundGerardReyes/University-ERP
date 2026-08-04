import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import { AuthGuard } from '@university-erp/shell-kit';

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route element={<AuthGuard />}>
            <Route
              path="/"
              element={
                <div style={{ padding: '2rem' }}>
                  <h1>Learning Management System</h1>
                  <p style={{ color: 'hsl(220, 10%, 60%)' }}>
                    Select a module from the sidebar to get started.
                  </p>
                </div>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
