import { useAuth } from '@university-erp/auth-sdk';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  section: string;
}

const navItems: NavItem[] = [
  { label: 'My Profile',      path: '/profile',     icon: '👤', section: 'Account' },
  { label: 'Course Registration', path: '/enrollment', icon: '📝', section: 'Academics' },
  { label: 'My Timetable',    path: '/timetable',   icon: '📅', section: 'Academics' },
  { label: 'Academic Record', path: '/records',     icon: '📜', section: 'Academics' },
  { label: 'Graduation Clearance', path: '/clearance', icon: '🎓', section: 'Academics' },
  { label: 'My Enrollments',  path: '/enrollments', icon: '📚', section: 'Academics' },
  { label: 'Health Center',   path: '/health',      icon: '🏥', section: 'Academics' },
  { label: 'Guidance',        path: '/guidance',    icon: '🧭', section: 'Academics' },
  { label: 'Hostel',          path: '/hostel',      icon: '🏠', section: 'Campus Life' },
  { label: 'Career',          path: '/career',      icon: '💼', section: 'Campus Life' },
  { label: 'Alumni Network',  path: '/alumni',      icon: '🎓', section: 'Campus Life' },
];

const sections = ['Account', 'Academics', 'Campus Life'];

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

  // Derive initials from name or ID
  const name = identity?.name || 'Student';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-layout">
      {/* ── Mobile Top Bar ─────────────────────────────── */}
      <header className="mobile-header-bar">
        <button
          className="icon-btn"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open Navigation"
        >
          ☰
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-bright)' }}>
          University ERP
        </span>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* ── Sidebar ────────────────────────────────────── */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🎓</div>
          <div className="sidebar-brand-text">
            <h1>University ERP</h1>
            <span>Student Portal</span>
          </div>
          <button
            className="icon-btn mobile-menu-btn"
            onClick={closeMobileMenu}
            aria-label="Close Menu"
            style={{ marginLeft: 'auto', display: 'none' }}
          >✕</button>
        </div>

        {/* Navigation grouped by section */}
        <nav style={{ flex: 1 }}>
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {navItems
                .filter(item => item.section === section)
                .map(item => {
                  const isActive = location.pathname === item.path ||
                    (item.path !== '/' && location.pathname.startsWith(item.path));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          {/* User Card */}
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{name}</div>
              <div className="user-id">{identity?.id ?? '—'}</div>
            </div>
          </div>

          {/* Theme Toggle */}
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          {/* Logout */}
          <button className="logout-btn" onClick={logout}>
            ↪ Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="main-content">
        <div className="content-container">
          <Outlet />
        </div>
      </main>

      {/* ── Mobile Overlay ─────────────────────────────── */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(6, 11, 24, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 40
          }}
        />
      )}
    </div>
  );
};