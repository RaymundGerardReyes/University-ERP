import React from 'react';
import { Outlet } from 'react-router-dom';

export default function AppShell() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'hsl(220, 30%, 15%)' }}>
      {/* Dynamic Glassmorphic Navigation */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: 'linear-gradient(135deg, hsl(220, 80%, 60%), hsl(280, 80%, 60%))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', fontWeight: 'bold', color: 'white'
          }}>U</div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '1.2rem', fontWeight: 600 }}>University Identity</h1>
        </div>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/login" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Sign In</a>
          <a href="/register" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}>Register</a>
        </nav>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: '0.85rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        &copy; {new Date().getFullYear()} University ERP Identity & Access Management Platform.
      </footer>
    </div>
  );
}
