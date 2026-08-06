import { useAuth } from '@university-erp/auth-sdk';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Security Dashboard', path: '/dashboard', section: 'Overview' },
  
  { label: 'Campus Access', path: '/campus-access', section: 'Access Control' },
  { label: 'Visitor Pass', path: '/visitor-pass', section: 'Access Control' },
  { label: 'Vehicle Access', path: '/vehicle-access', section: 'Access Control' },
  { label: 'Gate Logs', path: '/gate-logs', section: 'Access Control' },

  { label: 'ID Verification', path: '/id-verification', section: 'Operations' },
  { label: 'Incident Reports', path: '/incidents', section: 'Operations' },
  { label: 'Lost and Found', path: '/lost-found', section: 'Operations' },
  { label: 'CCTV Requests', path: '/cctv', section: 'Operations' },

  { label: 'Emergency Response', path: '/emergency', section: 'Critical' },
  { label: 'Security Reports', path: '/reports', section: 'Critical' },
];

const sections = ['Overview', 'Access Control', 'Operations', 'Critical'];

export const AppShell: React.FC = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{ width: '280px', backgroundColor: 'var(--bg-sidebar)', borderRight: '1px solid var(--border-color)', padding: '1.5rem', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, hsl(10, 80%, 55%), hsl(40, 90%, 55%))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white' }}>S</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-bright)' }}>Security</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Campus Security Portal</span>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          {sections.map(section => (
            <div key={section} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600, padding: '0 0.5rem' }}>
                {section}
              </div>
              {navItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{
                      display: 'block', padding: '0.6rem 1rem', borderRadius: '8px', textDecoration: 'none',
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                      backgroundColor: isActive ? 'var(--bg-active)' : 'transparent',
                      fontWeight: isActive ? 600 : 500, marginBottom: '0.25rem', transition: 'all 0.2s ease',
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 0.5rem' }}>{identity?.email}</div>
          <button onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))} style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>Toggle Theme</button>
          <button onClick={logout} style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </nav>
      <main style={{ flex: 1, padding: '2rem 3rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};
