import { Badge, PageHeader } from '@university-erp/ui-kit';
import React from 'react';
import { useStudentProfile } from './StudentProfile.hooks';

// --- Minimalist Loading Skeleton ---
const ProfileSkeleton: React.FC = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <div className="skeleton" style={{ height: '2.25rem', width: '260px', marginBottom: '0.5rem' }} />
      <div className="skeleton" style={{ height: '1rem', width: '180px' }} />
    </div>
    <div className="card fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: '1.5rem', width: '200px', marginBottom: '0.5rem' }} />
          <div className="skeleton" style={{ height: '0.875rem', width: '260px' }} />
        </div>
      </div>
    </div>
  </div>
);

// --- Main Profile Component ---
export const StudentProfilePage: React.FC = () => {
  const { data: profile, isLoading, isError } = useStudentProfile();

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !profile) return (
    <div className="stub-page fade-in">
      <div className="stub-icon">⚠️</div>
      <div className="stub-title">Failed to Load Profile</div>
      <div className="stub-subtitle">Unable to fetch your student records.</div>
    </div>
  );

  // Generate minimalist avatar initials
  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase();
  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="fade-in">
      <PageHeader
        title="My Profile"
        subtitle="Manage your academic identity and personal records."
      />

      {/* Hero Section (Glassmorphic) */}
      <div className="card fade-in-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card-accent-top" />
        <div className="profile-hero">
          <div className="profile-avatar">{initials}</div>
          <div>
            <div className="profile-name">{fullName}</div>
            <div className="profile-email">{profile.email}</div>
            <div className="profile-id">
              <span>ID:</span> {profile.studentNumber}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Badge colorScheme="success">{profile.enrollmentStatus}</Badge>
          </div>
        </div>
      </div>

      {/* Minimalist Details Grid */}
      <div className="grid-2 fade-in-delay-2">

        {/* Academic Standing Card */}
        <div className="card">
          <div className="card-accent-top" />
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
            Academic Standing
          </h2>

          <div className="data-row">
            <span className="data-label">Degree Program</span>
            <span className="data-value">{profile.program}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Cumulative GPA</span>
            <span className="data-value" style={{ color: 'var(--success-text)', fontSize: '1rem' }}>
              {profile.academicStanding}
            </span>
          </div>
          <div className="data-row">
            <span className="data-label">Clearance</span>
            <span className="data-value">
              <Badge colorScheme="info">Good Standing</Badge>
            </span>
          </div>
        </div>

        {/* Personal Details Card */}
        <div className="card">
          <div className="card-accent-top" />
          <h2 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
            Personal Details
          </h2>

          <div className="data-row">
            <span className="data-label">First Name</span>
            <span className="data-value">{profile.firstName}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Last Name</span>
            <span className="data-value">{profile.lastName}</span>
          </div>
          <div className="data-row">
            <span className="data-label">Primary Email</span>
            <span className="data-value" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-accent)', fontSize: '0.8rem' }}>
              {profile.email}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};