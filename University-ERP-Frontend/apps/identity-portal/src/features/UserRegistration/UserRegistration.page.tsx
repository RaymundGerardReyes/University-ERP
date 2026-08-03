import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useUserRegistration } from './UserRegistration.hooks';
import { UserRegistrationData } from './UserRegistration.types';

export default function UserRegistration() {
  const [formData, setFormData] = useState<UserRegistrationData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: 'Student'
  });
  const navigate = useNavigate();
  const registerMutation = useUserRegistration();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(formData);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto' }}>
      <PageHeader title="Create an Account" />
      
      <Card gradient style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>First Name</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>

          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
          </div>
          
          <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }} disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Registering...' : 'Create Account'}
          </Button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
          <a href="/login" style={{ color: 'hsl(220, 90%, 75%)', textDecoration: 'none' }}>Already have an account? Sign in</a>
        </div>
      </Card>
    </div>
  );
}
