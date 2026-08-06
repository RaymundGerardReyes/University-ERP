import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell from './AppShell';
import { AuthGuard } from '@university-erp/shell-kit';
import { LMSGuard } from '@university-erp/auth-sdk';

// Workspaces
import { CoursePackagingPage } from '../features/CourseAdministration/CoursePackaging.page';
import { SubmissionReviewPage } from '../features/OfflineSubmissionReview/SubmissionReview.page';
import { GradebookSyncPage } from '../features/GradebookOrchestration/GradebookSync.page';

export function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthGuard><AppShell /></AuthGuard>}>
          
          {/* Admin Course Packaging */}
          <Route element={<LMSGuard allowedRoles={['ROLE_LMS_ADMIN']} />}>
            <Route path="/admin/packaging" element={<CoursePackagingPage />} />
          </Route>

          {/* Instructor Workspaces */}
          <Route element={<LMSGuard allowedRoles={['ROLE_INSTRUCTOR']} />}>
            <Route path="/instructor/submissions" element={<SubmissionReviewPage />} />
            <Route path="/instructor/gradebook" element={<GradebookSyncPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/admin/packaging" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
