import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';

export const AppShell = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'My Enrollments', path: '/enrollments' },
    { label: 'Admission Status', path: '/admission' },
    { label: 'Hostel', path: '/hostel' },
    { label: 'Health Center', path: '/health' },
    { label: 'Guidance', path: '/guidance' },
    { label: 'Career', path: '/career' },
    { label: 'Alumni Network', path: '/alumni' }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '2rem 1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.2rem', margin: 0, color: 'hsl(220, 90%, 65%)' }}>University ERP</h1>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Student Portal</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  color: isActive ? 'white' : '#aaa',
                  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  borderRadius: '6px',
                  transition: 'background 0.2s, color 0.2s'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{
          marginTop: 'auto',
          padding: '1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{user?.name}</div>
            <div style={{ fontSize: '0.7rem', color: '#888' }}>{user?.id}</div>
          </div>
          <button 
            onClick={logout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '0.4rem 0.8rem',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
