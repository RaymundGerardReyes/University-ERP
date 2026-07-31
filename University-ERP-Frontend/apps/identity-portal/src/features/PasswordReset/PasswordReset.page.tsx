import React, { useState } from 'react';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { usePasswordReset } from './PasswordReset.hooks';

export default function PasswordReset() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const resetMutation = usePasswordReset();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await resetMutation.mutateAsync(email);
      setSubmitted(true);
    } catch (error) {
      console.error('Password reset failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <PageHeader title="Reset Password" />
      
      <Card style={{ marginTop: '2rem' }}>
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📧</div>
            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Check your email</h3>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '2rem' }}>
              If an account exists for {email}, you will receive a secure link to reset your password.
            </p>
            <a href="/login" style={{ color: 'hsl(220, 90%, 75%)', textDecoration: 'none', display: 'block' }}>Return to Login</a>
          </div>
        ) : (
          <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem', marginTop: 0 }}>
              Enter the email address associated with your account, and we'll send you a link to reset your password.
            </p>

            <div>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%', padding: '0.75rem', borderRadius: '4px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                }}
              />
            </div>
            
            <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={resetMutation.isPending}>
              {resetMutation.isPending ? 'Sending...' : 'Send Reset Link'}
            </Button>
            
            <div style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: '1rem' }}>
              <a href="/login" style={{ color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }}>Back to Sign In</a>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
