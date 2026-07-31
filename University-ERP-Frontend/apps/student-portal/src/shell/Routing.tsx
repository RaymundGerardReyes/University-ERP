import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthGuard } from './AuthGuard';
import { useAuth } from '@university-erp/auth-sdk';

// Lazy loaded features
const StudentProfile = lazy(() => import('@features/StudentProfile/StudentProfile.page'));
const MyEnrollments = lazy(() => import('@features/MyEnrollments/MyEnrollments.page'));

// Placeholder components
const Placeholder = ({ name }: { name: string }) => (
  <div style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
    <h2>{name}</h2>
    <p style={{ color: '#aaa' }}>This feature is coming soon.</p>
  </div>
);

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }
  
  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '3rem', borderRadius: '12px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '0.5rem', color: 'hsl(220, 90%, 65%)' }}>Student Portal</h1>
        <p style={{ color: '#aaa', marginBottom: '2rem' }}>Sign in to access your university dashboard</p>
        <button 
          onClick={login}
          style={{
            background: 'hsl(220, 90%, 55%)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 2rem',
            fontSize: '1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Login via SSO
        </button>
      </div>
    </div>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      {
        index: true,
        element: <Navigate to="/profile" replace />
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<div>Loading profile...</div>}>
            <StudentProfile />
          </Suspense>
        )
      },
      {
        path: 'enrollments',
        element: (
          <Suspense fallback={<div>Loading enrollments...</div>}>
            <MyEnrollments />
          </Suspense>
        )
      },
      { path: 'admission', element: <Placeholder name="Admission Status" /> },
      { path: 'hostel', element: <Placeholder name="Hostel Allocation" /> },
      { path: 'health', element: <Placeholder name="Health Records" /> },
      { path: 'guidance', element: <Placeholder name="Guidance Sessions" /> },
      { path: 'career', element: <Placeholder name="Career Dashboard" /> }
    ]
  }
]);
