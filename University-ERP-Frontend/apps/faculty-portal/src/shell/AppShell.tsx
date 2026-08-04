import { useAuth } from '@university-erp/auth-sdk';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', section: 'Workspace' },
  { label: 'Documents', path: '/documents', section: 'Workspace' }, // <-- ADDED
  { label: 'Teaching & Classes', path: '/teaching', section: 'Academics' },
  { label: 'My Students', path: '/students', section: 'Academics' },
  { label: 'Assessments & Grades', path: '/assessments', section: 'Academics' },
  { label: 'Admissions & Approvals', path: '/admissions', section: 'Administration' },
  { label: 'Advising', path: '/advising', section: 'Administration' },
  { label: 'Research', path: '/research', section: 'Professional' },
  { label: 'Schedule', path: '/schedule', section: 'Professional' },
  { label: 'Communication', path: '/communication', section: 'Connect' },
  { label: 'Analytics', path: '/analytics', section: 'Connect' },
  { label: 'Settings', path: '/settings', section: 'System' }, // <-- ADDED
];

const sections = ['Workspace', 'Academics', 'Administration', 'Professional', 'Connect', 'System'];

export const AppShell = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Top Bar */}
      <header className="mobile-header-bar">
        <button className="icon-btn" onClick={() => setIsMobileOpen(true)}> </button>
        <span style={{ fontWeight: 700, color: 'var(--text-bright)' }}>Faculty Portal</span>
        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'light' ? ' ' : ' '}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon" style={{ background: 'linear-gradient(135deg, hsl(200, 80%, 55%), hsl(240, 80%, 60%))' }}>F</div>
          <div className="sidebar-brand-text">
            <h1>University ERP</h1>
            <span>Faculty Portal</span>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {navItems
                .filter(item => item.section === section)
                .map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '  Dark Mode' : '  Light Mode'}
          </button>
          <div className="user-card">
            <div className="user-avatar" style={{ background: 'var(--brand-secondary)' }}>
              {identity?.name?.[0] || 'F'}
            </div>
            <div className="user-info">
              <div className="user-name">{identity?.name || 'Faculty Member'}</div>
              <div className="user-id">{identity?.id || 'ID-PENDING'}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={logout}> Sign Out</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {isMobileOpen && <div onClick={closeMobileMenu} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(6, 11, 24, 0.65)', backdropFilter: 'blur(4px)', zIndex: 40 }} />}
    </div>
  );
};