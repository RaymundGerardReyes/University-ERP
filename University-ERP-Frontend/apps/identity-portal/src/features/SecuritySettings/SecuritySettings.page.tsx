import React, { useState } from 'react';
import { Card, Button, PageHeader } from '@university-erp/ui-kit';
import { useSecuritySettings } from './SecuritySettings.hooks';

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const settingsMutation = useSecuritySettings();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    
    try {
      await settingsMutation.mutateAsync({ currentPassword, newPassword });
      setMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setMessage('Failed to update password');
    }
  };

  return (
    <div>
      <PageHeader title="Security Settings" />
      
      <Card style={{ marginTop: '2rem', maxWidth: '600px' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Change Password</h3>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>
          <div>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
          </div>
          
          <Button variant="primary" style={{ width: '200px', marginTop: '1rem' }} disabled={settingsMutation.isPending}>
            Update Password
          </Button>
          
          {message && <div style={{ color: message.includes('success') ? 'hsl(120, 70%, 70%)' : 'hsl(0, 70%, 70%)', fontSize: '0.85rem' }}>{message}</div>}
        </form>
      </Card>
      
      <Card style={{ marginTop: '2rem', maxWidth: '600px', borderColor: 'hsl(0, 50%, 30%)' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: 'hsl(0, 70%, 70%)' }}>Danger Zone</h3>
        <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="danger">Delete Account</Button>
      </Card>
    </div>
  );
}
