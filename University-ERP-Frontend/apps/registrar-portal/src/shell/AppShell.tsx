import { useAuth } from '@university-erp/auth-sdk';
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
    { label: 'Registrar Dashboard', path: '/dashboard', section: 'Overview' },
    
    { label: 'Admission Processing', path: '/admissions', section: 'Admissions Division' },
    { label: 'Faculty Endorsements', path: '/admissions/endorsements', section: 'Admissions Division' },
  
    { label: 'Enrollment Validation', path: '/enrollment', section: 'Enrollment Division' },
    { label: 'Subject Loading', path: '/enrollment/subjects', section: 'Enrollment Division' },
  
    { label: 'Master Student List', path: '/registry', section: 'Student Registry Division' },
    { label: 'Leave of Absence (LOA)', path: '/registry/loa', section: 'Student Registry Division' },
  
    { label: 'Official Grades', path: '/records/grades', section: 'Academic Records Division' },
    { label: 'Academic Standing', path: '/records/standing', section: 'Academic Records Division' },
  
    { label: 'Subject Catalog', path: '/curriculum/catalog', section: 'Curriculum Division' },
    { label: 'Course Offerings', path: '/curriculum/offerings', section: 'Curriculum Division' },
  
    { label: 'Graduation Candidates', path: '/graduation', section: 'Graduation Division' },
    { label: 'Latin Honors', path: '/graduation/honors', section: 'Graduation Division' },
  
    { label: 'Transcript Requests', path: '/certification/transcripts', section: 'Certification Division' },
    { label: 'Diploma Printing', path: '/certification/diploma', section: 'Certification Division' },
  
    { label: 'Student Inquiries', path: '/services', section: 'Student Services Division' },
    { label: 'Name Corrections', path: '/services/corrections', section: 'Student Services Division' },
  
    { label: 'CHED Compliance', path: '/compliance/ched', section: 'Academic Compliance Division' },
    { label: 'Residency Rules', path: '/compliance/residency', section: 'Academic Compliance Division' },
  
    { label: 'Record Access Audit', path: '/security/audit', section: 'Registrar Security' },
    { label: 'Sensitive Documents', path: '/security/documents', section: 'Registrar Security' },
  ];
  
  const sections = [
    'Overview', 
    'Admissions Division', 
    'Enrollment Division', 
    'Student Registry Division', 
    'Academic Records Division', 
    'Curriculum Division', 
    'Graduation Division', 
    'Certification Division', 
    'Student Services Division', 
    'Academic Compliance Division', 
    'Registrar Security'
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Registrar Portal</span>
          </div>
          <button className="icon-btn mobile-menu-btn" onClick={closeMobileMenu} aria-label="Close Navigation Sidebar">
            ✕
          </button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', overflowY: 'auto' }}>
          {sections.map(section => (
            <div key={section} style={{ marginBottom: '1rem' }}>
              <div className="nav-section-label">
                {section}
              </div>
              {navItems.filter(item => item.section === section).map(item => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer Actions (Theme Switcher & User Profile) */}
        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <button
            onClick={toggleTheme}
            className="icon-btn"
            style={{ width: '100%', justifyContent: 'center', gap: 'var(--space-2)', padding: 'var(--space-2)', fontSize: '0.85rem' }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

          <div className="user-card">
            <div className="user-avatar">
              {identity?.name?.charAt(0) || 'R'}
            </div>
            <div className="user-info">
              <div className="user-name">
                {identity?.name || 'Registrar Officer'}
              </div>
              <div className="user-id">{identity?.id || 'ID-UNKNOWN'}</div>
            </div>
          </div>
          
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
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
