import { useAuth } from '@university-erp/auth-sdk';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export const AppShell: React.FC = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Initialize theme from localStorage or system default
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const closeMobileMenu = () => setIsMobileOpen(false);

  const navItems = [
    // Overview & Treasury
    { label: 'Executive Dashboard', path: '/dashboard', icon: '📊', section: 'Overview & Treasury' },
    { label: 'Financial Reports', path: '/reports', icon: '📑', section: 'Overview & Treasury' },

    // Enrollment & Tuition Assessment
    { label: 'Applicant Assessment', path: '/enrollment-finance/assessment', icon: '📝', section: 'Enrollment & Assessment' },
    { label: 'Downpayment Verification', path: '/enrollment-finance/downpayment', icon: '💳', section: 'Enrollment & Assessment' },
    { label: 'Financial Clearance', path: '/enrollment-finance/clearance', icon: '🛡️', section: 'Enrollment & Assessment' },
    { label: 'Term Tuition Assessment', path: '/assessment/tuition', icon: '🎓', section: 'Enrollment & Assessment' },

    // Student Billing & Receivables
    { label: 'Invoicing & Receivables', path: '/invoicing', icon: '🧾', section: 'Billing & Receivables' },
    { label: 'Semester Billing', path: '/billing/semester', icon: '📅', section: 'Billing & Receivables' },
    { label: 'Statement of Account', path: '/billing/statement', icon: '📑', section: 'Billing & Receivables' },
    { label: 'Scholarships & Grants', path: '/billing/scholarships', icon: '🎖️', section: 'Billing & Receivables' },
    { label: 'Billing Administration', path: '/billing/administration', icon: '⚙️', section: 'Billing & Receivables' },

    // Cashier & Treasury
    { label: 'Cashier Terminal', path: '/cashier/payments', icon: '🪙', section: 'Cashier & Treasury' },
    { label: 'Payment Gateway Monitor', path: '/cashier/gateway', icon: '🌐', section: 'Cashier & Treasury' },
    { label: 'Clearance Approvals', path: '/cashier/clearance', icon: '✅', section: 'Cashier & Treasury' },

    // Corporate & Payroll
    { label: 'Budgeting & Allocation', path: '/budgeting', icon: '💼', section: 'Corporate & Payroll' },
    { label: 'Payroll Management', path: '/payroll', icon: '👥', section: 'Corporate & Payroll' },
    { label: 'Payroll Processing', path: '/payroll/processing', icon: '⚡', section: 'Corporate & Payroll' },
  ];

  const sections = [
    'Overview & Treasury',
    'Enrollment & Assessment',
    'Billing & Receivables',
    'Cashier & Treasury',
    'Corporate & Payroll',
  ];

  return (
    <div className="app-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Global Header */}
      <header className="mobile-header-bar" style={{ display: 'flex', width: '100%', alignItems: 'center', background: 'var(--bg-elevated)', padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flex: 1 }}>
          <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileOpen(prev => !prev)} aria-label="Toggle Navigation Menu">
            ☰
          </button>
          <div style={{
            width: '32px', height: '32px', borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, hsl(150, 70%, 45%), hsl(200, 80%, 50%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem', fontWeight: 'bold', color: 'white'
          }}>₱</div>
          <div>
            <span style={{ fontWeight: 800, color: 'var(--text-bright, var(--text-primary))', letterSpacing: '-0.02em', fontSize: '1.1rem' }}>Finance Console</span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Treasury & Student Accounts</span>
          </div>
        </div>

        <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '420px', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Search accounts, invoices, tokens...</span>
            <kbd style={{ background: 'var(--bg-surface, var(--bg-elevated))', border: '1px solid var(--border-subtle)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>⌘K</kbd>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme" style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-tertiary, var(--brand-primary))' }}>AY 2026-2027, Sem 1</span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Primary Navigation Sidebar */}
        <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`} style={{ width: '280px', flexShrink: 0 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', overflowY: 'auto', paddingRight: 'var(--space-2)' }}>
            {sections.map(section => (
              <div key={section} style={{ marginBottom: '1.25rem' }}>
                <div className="nav-section-label" style={{ padding: 'var(--space-2) var(--space-3)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {section}
                </div>
                {navItems.filter(item => item.section === section).map(item => {
                  const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'));
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: isActive ? 'var(--text-bright)' : 'var(--text-secondary)', background: isActive ? 'var(--brand-primary-light, rgba(99, 102, 241, 0.15))' : 'transparent', fontWeight: isActive ? 600 : 500, fontSize: '0.875rem', marginBottom: '2px', transition: 'all 0.15s ease' }}
                    >
                      <span style={{ fontSize: '1rem', lineHeight: 1 }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <div className="user-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2)' }}>
              <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {identity?.name?.charAt(0) || 'F'}
              </div>
              <div className="user-info" style={{ overflow: 'hidden' }}>
                <div className="user-name" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                  {identity?.name || 'Finance Officer'}
                </div>
                <div className="user-id" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {identity?.roles?.[0] || 'ROLE_FINANCE_ADMIN'}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="logout-btn"
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-elevated)', border: '1px solid var(--border-color)', color: 'var(--danger-text)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
            >
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Page Content Area */}
        <main className="main-content" style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-base)', padding: 'var(--space-6)' }}>
          <div className="content-container" style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 40
          }}
        />
      )}
    </div>
  );
};

export default AppShell;

