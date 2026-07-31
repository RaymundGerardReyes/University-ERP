import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from './AppShell';
import { AuthGuard } from './AuthGuard';
import { useAuth } from '@university-erp/auth-sdk';

// Lazy loaded features
const StudentProfile = lazy(() => import('@features/StudentProfile/StudentProfile.page'));
const MyEnrollments = lazy(() => import('@features/MyEnrollments/MyEnrollments.page'));
const AdmissionStatus = lazy(() => import('@features/AdmissionStatus/AdmissionStatus.page'));
const HostelAllocation = lazy(() => import('@features/HostelAllocation/HostelAllocation.page'));
const HealthRecords = lazy(() => import('@features/HealthRecords/HealthRecords.page'));
const GuidanceSessions = lazy(() => import('@features/GuidanceSessions/GuidanceSessions.page'));
const CareerDashboard = lazy(() => import('@features/CareerDashboard/CareerDashboard.page'));
const AlumniNetwork = lazy(() => import('@features/AlumniNetwork/AlumniNetwork.page'));

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
            background: 'hsl(220, 90%, 55%)', color: 'white', border: 'none', padding: '0.75rem 2rem', fontSize: '1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600
          }}
        >
          Login via SSO
        </button>
      </div>
    </div>
  );
};

const LoadingScreen = () => <div style={{ color: '#aaa' }}>Loading module...</div>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AuthGuard><AppShell /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/profile" replace /> },
      { path: 'profile', element: <Suspense fallback={<LoadingScreen />}><StudentProfile /></Suspense> },
      { path: 'enrollments', element: <Suspense fallback={<LoadingScreen />}><MyEnrollments /></Suspense> },
      { path: 'admission', element: <Suspense fallback={<LoadingScreen />}><AdmissionStatus /></Suspense> },
      { path: 'hostel', element: <Suspense fallback={<LoadingScreen />}><HostelAllocation /></Suspense> },
      { path: 'health', element: <Suspense fallback={<LoadingScreen />}><HealthRecords /></Suspense> },
      { path: 'guidance', element: <Suspense fallback={<LoadingScreen />}><GuidanceSessions /></Suspense> },
      { path: 'career', element: <Suspense fallback={<LoadingScreen />}><CareerDashboard /></Suspense> },
      { path: 'alumni', element: <Suspense fallback={<LoadingScreen />}><AlumniNetwork /></Suspense> }
    ]
  }
]);
