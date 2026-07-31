import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@university-erp/auth-sdk';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useUserLogin } from './UserLogin.hooks';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const loginMutation = useUserLogin();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync({ email, passwordHash: password });
      setToken(response.token);
      setUser(response.user);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto' }}>
      <PageHeader title="Sign In to University ERP" />
      
      <Card gradient style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '4px',
                background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white'
              }}
            />
          </div>
          
          <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loginMutation.isPending}>
            {loginMutation.isPending ? 'Authenticating...' : 'Sign In'}
          </Button>
        </form>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <a href="/forgot-password" style={{ color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }}>Forgot Password?</a>
          <a href="/register" style={{ color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }}>Register Account</a>
        </div>
      </Card>
    </div>
  );
}
