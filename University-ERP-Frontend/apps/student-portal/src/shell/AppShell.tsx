import { useAuth } from '@university-erp/auth-sdk';
import { Button } from '@university-erp/ui-kit';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AppShell = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const closeMobileMenu = () => setIsMobileOpen(false);

  const navItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'My Enrollments', path: '/enrollments' },
    { label: 'Hostel', path: '/hostel' },
    { label: 'Health Center', path: '/health' },
    { label: 'Guidance', path: '/guidance' },
    { label: 'Career', path: '/career' },
    { label: 'Alumni Network', path: '/alumni' }
  ];

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header-bar">
        <button className="icon-btn" onClick={() => setIsMobileOpen(true)} aria-label="Open Navigation Menu">
          ☰
        </button>
        <span style={{ fontWeight: 700, color: 'var(--brand-primary)' }}>University ERP</span>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Primary Navigation Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', padding: '0 0.5rem' }}>
          <div>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--brand-primary)' }}>
              University ERP
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Student Portal</span>
          </div>
          <button className="icon-btn mobile-menu-btn" onClick={closeMobileMenu} aria-label="Close Navigation Sidebar">
            ✕
          </button>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  textDecoration: 'none',
                  color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--border-subtle)' : '1px solid transparent',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions (Theme Switcher & User Profile) */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            style={{ width: '100%', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)', fontSize: '0.85rem' }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {identity?.name || 'Student Account'}
              </div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{identity?.id}</div>
            </div>
            <Button variant="outline" onClick={logout} style={{ padding: 'var(--space-1) var(--space-2)', fontSize: '0.75rem' }}>
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 40
          }}
        />
      )}
    </div>
  );
};