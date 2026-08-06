import { useAuth } from '@university-erp/auth-sdk';
import { Link, Outlet, useLocation } from 'react-router-dom';

// Structure directly matching image_277446.png
const navItems = [
  { label: 'Dashboard', path: '/dashboard', section: 'Workspace' },
  { label: 'Documents', path: '/documents', section: 'Workspace' },

  { label: 'Teaching & Classes', path: '/teaching', section: 'Academics' },
  { label: 'Admission Queue', path: '/secretary/queue', section: 'Secretary Workspace' },
  { label: 'Document Verification', path: '/secretary/verification', section: 'Secretary Workspace' },
  { label: 'Interview Scheduling', path: '/secretary/interviews', section: 'Secretary Workspace' },
  { label: 'Missing Requirements', path: '/secretary/requirements', section: 'Secretary Workspace' },

  { label: 'Evaluation Queue', path: '/chairperson/queue', section: 'Chairperson Workspace' },
  { label: 'Academic Evaluation', path: '/chairperson/evaluation', section: 'Chairperson Workspace' },
  { label: 'Curriculum Matching', path: '/chairperson/curriculum', section: 'Chairperson Workspace' },
  { label: 'Recommendation', path: '/chairperson/recommendation', section: 'Chairperson Workspace' },

  { label: 'Recommendation Queue', path: '/dean/queue', section: 'Dean Workspace' },
  { label: 'College Endorsement', path: '/dean/endorsement', section: 'Dean Workspace' },
  { label: 'Program Capacity', path: '/dean/capacity', section: 'Dean Workspace' },

  { label: 'Applicant Access', path: '/security/access', section: 'Faculty Security' },
  { label: 'Confidential Documents', path: '/security/documents', section: 'Faculty Security' },
  { label: 'Evaluation Audit Logs', path: '/security/audit', section: 'Faculty Security' },
  { label: 'Digital Signatures', path: '/security/signatures', section: 'Faculty Security' },

  { label: 'Advising', path: '/advising', section: 'Administration' },

  { label: 'Research', path: '/research', section: 'Professional' },
  { label: 'Schedule', path: '/schedule', section: 'Professional' },

  { label: 'Communication', path: '/communication', section: 'Connect' },
  { label: 'Analytics', path: '/analytics', section: 'Connect' },

  { label: 'Settings', path: '/settings', section: 'System' },
];

const sections = ['Workspace', 'Academics', 'Secretary Workspace', 'Chairperson Workspace', 'Dean Workspace', 'Faculty Security', 'Administration', 'Professional', 'Connect', 'System'];

export const AppShell = () => {
  const { identity, logout } = useAuth();
  const location = useLocation();

  const name = identity?.name || 'Dr. Sarah Jenkins';
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>University ERP<br /><span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faculty Portal</span></h1>
        </div>

        <nav style={{ flex: 1 }}>
          {sections.map(section => (
            <div key={section}>
              <div className="nav-section-label">{section}</div>
              {navItems
                .filter(item => item.section === section)
                .map(item => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                      {item.label}
                    </Link>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="user-card">
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--brand-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            {initials}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
            <button onClick={logout} style={{ fontSize: '0.7rem', color: '#f87171', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Sign Out</button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};