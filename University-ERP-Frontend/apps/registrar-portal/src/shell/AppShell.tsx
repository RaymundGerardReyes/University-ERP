import { useAuth } from '@university-erp/auth-sdk';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { GlobalSearchModal } from './GlobalSearchModal';

export const AppShell = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Restructured Information Architecture based on UX Blueprint
  const navItems = [
    { label: 'Registrar Dashboard', path: '/dashboard', section: 'Operational Workspace' },
    
    { label: 'Enrollment Activations', path: '/admissions/activation', section: 'Work Queues' },
    { label: 'Registration Exceptions', path: '/enrollment/exceptions', section: 'Work Queues' },
    { label: 'Document Requests', path: '/certification/transcripts', section: 'Work Queues' },
    { label: 'Data Corrections', path: '/services/corrections', section: 'Work Queues' },

    { label: 'Master Directory', path: '/registry', section: 'Students' },
    { label: 'Leave of Absence', path: '/registry/loa', section: 'Students' },

    { label: 'Enrollment Validation', path: '/enrollment', section: 'Enrollment & Records' },
    { label: 'Official Grades', path: '/records/grades', section: 'Enrollment & Records' },
    { label: 'Academic Standing', path: '/records/standing', section: 'Enrollment & Records' },

    { label: 'Subject Catalog', path: '/curriculum/catalog', section: 'Curriculum' },
    { label: 'Course Offerings', path: '/curriculum/offerings', section: 'Curriculum' },

    { label: 'Candidates & Audit', path: '/graduation', section: 'Graduation' },

    { label: 'CHED Compliance', path: '/compliance/ched', section: 'Compliance & Security' },
    { label: 'Access Ledger', path: '/security/audit', section: 'Compliance & Security' },
  ];

  const sections = ['Operational Workspace', 'Work Queues', 'Students', 'Enrollment & Records', 'Curriculum', 'Graduation', 'Compliance & Security'];

  return (
    <div className="app-layout">
      {/* Global Header */}
      <header className="mobile-header-bar" style={{ display: 'flex', background: 'var(--bg-elevated)', padding: 'var(--space-3) var(--space-6)', borderBottom: '1px solid var(--border-color)', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1 }}>
            <span style={{ fontWeight: 800, color: 'var(--text-bright, var(--text-primary))', letterSpacing: '-0.02em', fontSize: '1.2rem' }}>University ERP</span>
        </div>
        <div style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
            <button 
                onClick={() => setIsSearchOpen(true)}
                style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <span>Search students, courses, requests...</span>
                <kbd style={{ background: 'var(--bg-surface)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Cmd K</kbd>
            </button>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 'var(--space-4)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-tertiary, var(--brand-primary))' }}>AY 2026-2027, Sem 1</span>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Primary Navigation Sidebar */}
          <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', overflowY: 'auto', marginTop: 'var(--space-4)' }}>
              {sections.map(section => (
                <div key={section} style={{ marginBottom: '1.5rem' }}>
                  <div className="nav-section-label">{section}</div>
                  {navItems.filter(item => item.section === section).map(item => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)} className={`nav-item ${isActive ? 'active' : ''}`}>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="user-card">
                <div className="user-avatar">{identity?.name?.charAt(0) || 'R'}</div>
                <div className="user-info">
                  <div className="user-name">{identity?.name || 'Registrar Officer'}</div>
                  <div className="user-id">{identity?.roles?.[0] || 'Admin'}</div>
                </div>
              </div>
              <button onClick={logout} className="logout-btn">Logout</button>
            </div>
          </aside>

          {/* Main Page Area */}
          <main className="main-content">
            <div className="content-container">
              <Outlet />
            </div>
          </main>
      </div>

      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onOpen={() => setIsSearchOpen(true)} />
    </div>
  );
};
