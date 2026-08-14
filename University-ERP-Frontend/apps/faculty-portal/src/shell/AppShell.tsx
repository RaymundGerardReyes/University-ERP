import { useAuth } from '@university-erp/auth-sdk';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

// --- 1. IA Navigation Configuration ---
interface NavItem {
  label: string;
  path: string;
  section: string;
  requiredRole?: string;
  isStub?: boolean;
}

const navItems: NavItem[] = [
  // Standard Faculty Experience
  { label: 'Dashboard', path: '/dashboard', section: 'Home' },
  { label: 'My Classes', path: '/teaching', section: 'My Teaching' },
  { label: 'Cross-Course Students', path: '/students', section: 'My Teaching' },
  { label: 'Gradebook', path: '/assessments', section: 'My Teaching' },
  { label: 'Class Analytics', path: '/analytics', section: 'My Teaching' },
  { label: 'My Advisees', path: '/advising', section: 'Advising' },
  { label: 'Schedule', path: '/schedule', section: 'Professional & Work' },
  { label: 'Research & Grants', path: '/research', section: 'Professional & Work' },
  { label: 'Documents', path: '/documents', section: 'Professional & Work' },
  { label: 'Messages', path: '/communication', section: 'Professional & Work' },
  { label: 'Settings', path: '/settings', section: 'Account' },

  // Secretary Workspace
  { label: 'Admission Queue', path: '/secretary/queue', section: 'Secretary Workspace', requiredRole: 'ROLE_FACULTY_SECRETARY' },
  { label: 'Document Verification', path: '/secretary/verification', section: 'Secretary Workspace', requiredRole: 'ROLE_FACULTY_SECRETARY' },
  { label: 'Interview Scheduling', path: '/secretary/interviews', section: 'Secretary Workspace', requiredRole: 'ROLE_FACULTY_SECRETARY' },
  { label: 'Missing Requirements', path: '/secretary/requirements', section: 'Secretary Workspace', requiredRole: 'ROLE_FACULTY_SECRETARY', isStub: true },

  // Chairperson Workspace
  { label: 'Evaluation Queue', path: '/chairperson/queue', section: 'Chairperson Workspace', requiredRole: 'ROLE_DEPARTMENT_CHAIRPERSON' },
  { label: 'Academic Evaluation', path: '/chairperson/evaluation', section: 'Chairperson Workspace', requiredRole: 'ROLE_DEPARTMENT_CHAIRPERSON' },
  { label: 'Recommendation', path: '/chairperson/recommendation', section: 'Chairperson Workspace', requiredRole: 'ROLE_DEPARTMENT_CHAIRPERSON' },
  { label: 'Curriculum Matching', path: '/chairperson/curriculum', section: 'Chairperson Workspace', requiredRole: 'ROLE_DEPARTMENT_CHAIRPERSON', isStub: true },

  // Dean Workspace
  { label: 'Recommendation Queue', path: '/dean/queue', section: 'Dean Workspace', requiredRole: 'ROLE_COLLEGE_DEAN' },
  { label: 'Program Capacity', path: '/dean/capacity', section: 'Dean Workspace', requiredRole: 'ROLE_COLLEGE_DEAN' },
  { label: 'College Endorsement', path: '/dean/endorsement', section: 'Dean Workspace', requiredRole: 'ROLE_COLLEGE_DEAN' },

  // Security Console
  { label: 'Applicant Access', path: '/security/access', section: 'Security Console', requiredRole: 'ROLE_FACULTY_SECURITY' },
  { label: 'Evaluation Audit Logs', path: '/security/audit', section: 'Security Console', requiredRole: 'ROLE_FACULTY_SECURITY' },
  { label: 'Confidential Documents', path: '/security/documents', section: 'Security Console', requiredRole: 'ROLE_FACULTY_SECURITY', isStub: true },
  { label: 'Digital Signatures', path: '/security/signatures', section: 'Security Console', requiredRole: 'ROLE_FACULTY_SECURITY', isStub: true },
];

export const AppShell = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [activeTerm, setActiveTerm] = useState('Fall 2026'); // Term state

  // --- 2. Theme Management ---
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const closeMobileMenu = () => setIsMobileOpen(false);

  // --- 3. Role-Based Navigation Logic ---
  const name = identity?.name || 'Faculty Member';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const userRoles = identity?.roles || [];
  const isAdmin = userRoles.includes('Admin') || userRoles.includes('ROLE_FACULTY_ADMIN');

  const authorizedNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true; 
    if (isAdmin) return true; 
    return userRoles.includes(item.requiredRole);
  });

  const visibleSections = Array.from(new Set(authorizedNavItems.map(item => item.section)));

  return (
    <div className="app-layout">
      {/* --- 4. Mobile Top Bar --- */}
      <header className="mobile-header-bar">
        <button className="icon-btn" onClick={() => setIsMobileOpen(true)} aria-label="Open Navigation">
          ☰
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-bright, var(--text-primary))' }}>
          University ERP
        </span>
        <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* --- 5. Global Sidebar --- */}
      <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-text">
            <h1>University ERP</h1>
            <span>Faculty Portal</span>
          </div>
          <button
            className="icon-btn mobile-menu-btn"
            onClick={closeMobileMenu}
            aria-label="Close Menu"
            style={{ marginLeft: 'auto', display: 'none' }}
          >
            ✕
          </button>
        </div>

        <nav style={{ flex: 1 }}>
          {visibleSections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {authorizedNavItems
                .filter(item => item.section === section)
                .map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={closeMobileMenu}
                      style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{item.label}</span>
                      {item.isStub && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--bg-hover, var(--bg-base))', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-muted)' }}>
                          STUB
                        </span>
                      )}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        {/* User Footer Area */}
        <div className="sidebar-footer">
          <div className="user-card">
            <div className="user-avatar">{initials}</div>
            <div className="user-info">
              <div className="user-name">{name}</div>
              <div className="user-id">{identity?.id ?? 'FAC-0000'}</div>
            </div>
          </div>
          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button className="logout-btn" onClick={logout}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* --- 6. Main Content Area & Top Header --- */}
      <main className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Global Desktop Header: Term Selector & Notifications */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
            
            {/* Term Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Current Term:</span>
                <select 
                    value={activeTerm}
                    onChange={(e) => setActiveTerm(e.target.value)}
                    style={{ background: 'var(--bg-elevated, var(--bg-surface))', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: 'var(--space-1) var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', cursor: 'pointer' }}
                >
                    <option value="Fall 2026">1st Semester, AY 2026-2027</option>
                    <option value="Spring 2026">2nd Semester, AY 2025-2026</option>
                </select>
            </div>

            {/* Notifications / Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button 
                  className="icon-btn" 
                  onClick={() => navigate('/communication')} 
                  title="Messages"
                  style={{ position: 'relative' }}
                >
                    ✉️
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: 'var(--danger-text, #ef4444)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                </button>
            </div>
        </div>

        {/* Page Content Rendered Here */}
        <div className="content-container" style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileMenu}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'var(--bg-overlay, rgba(0,0,0,0.5))', backdropFilter: 'blur(var(--glass-blur, 4px))', zIndex: 40 }}
        />
      )}
    </div>
  );
};