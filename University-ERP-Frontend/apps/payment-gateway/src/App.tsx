import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiClient } from '@university-erp/api-clients';
import { Badge, Button, Card } from '@university-erp/ui-kit';

interface PaymentSessionData {
  sessionId: string;
  invoiceId: string;
  applicantId: string;
  amount: number;
  currency: string;
  purpose: string;
  status: string;
  expiresAtUtc: string;
}

export default function App() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('sessionId');

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PaymentSessionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'qr' | 'card' | 'ewallet'>('qr');
  const [qrPayload, setQrPayload] = useState<string | null>(null);

  // Core polling effect
  useEffect(() => {
    if (!sessionId) {
      setError('No active payment session token found. Please initiate checkout from your application portal.');
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const fetchSessionState = async () => {
      try {
        const sessionResponse = await apiClient.get<PaymentSessionData>(`/finance/payment-sessions/${sessionId}`);
        if (isSubscribed) {
          setSession(sessionResponse.data);
          
          if (sessionResponse.data.status === 'Paid') {
              setLoading(false);
              return; // Stop polling once paid
          }
        }
      } catch (err: any) {
        if (isSubscribed) {
           console.error('Session validation error:', err);
           setError(err.response?.data?.message || err.message || 'Payment session expired or invalid.');
           setLoading(false);
        }
      }
    };

    const fetchQR = async () => {
      try {
        const qrResponse = await apiClient.get<{qrPayload: string}>(`/finance/payment-sessions/${sessionId}/qr`);
        if (isSubscribed) {
           setQrPayload(qrResponse.data.qrPayload);
        }
      } catch (qrErr) {
        console.warn("Could not fetch QR Payload:", qrErr);
      }
    };

    // Initial fetch
    fetchSessionState().then(() => {
        if (isSubscribed) {
            setLoading(false);
            fetchQR();
        }
    });

    // Poll every 3 seconds for session status updates from the webhook
    const intervalId = setInterval(() => {
       if (session?.status !== 'Paid') {
           fetchSessionState();
       }
    }, 3000);

    return () => {
      isSubscribed = false;
      clearInterval(intervalId);
    };
  }, [sessionId, session?.status]);


  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-subtle)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto var(--space-4)' }} />
          <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.9rem' }}>Verifying payment session...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || session?.status === 'Failed' || session?.status === 'Expired' || session?.status === 'Reversed') {
    return (
      <div style={containerStyle}>
        <Card style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-8)', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '1.5rem' }}>
            ⚠️
          </div>
          <h2 style={{ color: 'var(--danger-text)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Session Issue</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-6)' }}>
             {error || `This payment session is currently marked as ${session?.status}. It can no longer accept payments.`}
          </p>
          <Button variant="outline" style={{ width: '100%' }} onClick={() => window.history.back()}>
            Return to Application Portal
          </Button>
        </Card>
      </div>
    );
  }

  if (session?.status === 'Paid') {
    return (
      <div style={containerStyle}>
        <Card style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-8)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)', border: '1px solid rgba(16, 185, 129, 0.2)', fontSize: '2rem' }}>
            ✅
          </div>
          <h2 style={{ color: 'var(--text-bright)', fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Payment Verified!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 'var(--space-6)' }}>
            Your payment of <strong style={{ color: 'var(--text-bright)' }}>{session?.currency} {session?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> has been confirmed by the bank.
          </p>

          <div style={{ background: 'var(--bg-elevated)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'left', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Session Token</span>
              <span style={{ color: 'var(--text-bright)', fontFamily: 'var(--font-mono)' }}>{session?.sessionId.substring(0, 16)}...</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Purpose</span>
              <span style={{ color: 'var(--text-bright)' }}>{session?.purpose}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span style={{ color: 'var(--success-text)', fontWeight: 600 }}>PAID & VERIFIED</span>
            </div>
          </div>

          <Button variant="primary" style={{ width: '100%' }} onClick={() => window.close()}>
            Done & Return to Portal
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🏛️
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-bright)' }}>University ERP</h1>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure Decoupled Payment Gateway</p>
            </div>
          </div>
          <Badge colorScheme="success" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            🔒 PCI DSS Framework
          </Badge>
        </div>

        {/* Main Payment Card */}
        <Card style={{ width: '100%', padding: 'var(--space-8)' }}>
          {/* Amount Display */}
          <div style={{
            background: 'var(--bg-elevated)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            border: '1px solid var(--border-subtle)',
            marginBottom: 'var(--space-6)'
          }}>
            <p style={{ margin: '0 0 var(--space-2) 0', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {session?.purpose}
            </p>
            <h2 style={{ margin: 0, fontSize: '2.5rem', color: 'var(--text-bright)', letterSpacing: '-0.02em' }}>
              {session?.currency} {session?.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <p style={{ margin: 'var(--space-4) 0 0 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Invoice: {session?.invoiceId}
            </p>
          </div>

          {/* Payment Method Tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
            <Button
              variant={activeTab === 'qr' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('qr')}
              style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
            >
              📷 QR Ph
            </Button>
            <Button
              variant={activeTab === 'card' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('card')}
              style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
            >
              💳 Card
            </Button>
            <Button
              variant={activeTab === 'ewallet' ? 'primary' : 'outline'}
              onClick={() => setActiveTab('ewallet')}
              style={{ padding: 'var(--space-3)', fontSize: '0.85rem' }}
            >
              📱 e-Wallet
            </Button>
          </div>

          {/* Payment Interfaces */}
          {activeTab === 'qr' && (
             <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
               <h3 style={{ fontSize: '1rem', color: 'var(--text-bright)', marginBottom: 'var(--space-4)' }}>Scan via QR Ph / InstaPay</h3>
               
               <div style={{ width: '200px', height: '200px', margin: '0 auto var(--space-4)', background: '#fff', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {qrPayload ? (
                   <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                     <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`} alt="Dynamic QR Ph Code" style={{ width: '100%', height: '100%' }} />
                     <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '4px', borderRadius: '50%' }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 900, color: '#1d4ed8' }}>PH</span>
                     </div>
                   </div>
                 ) : (
                   <span style={{ color: '#000', fontSize: '0.8rem' }}>Loading QR Payload...</span>
                 )}
               </div>
               
               <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Scan using any participating bank or e-wallet app.</p>
               
               <div style={{ marginTop: 'var(--space-4)' }}>
                 <Button variant="outline" disabled style={{ width: '100%', borderStyle: 'dashed' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Awaiting Bank Confirmation...
                    </div>
                 </Button>
               </div>
             </div>
          )}

          {activeTab === 'card' && (
            <div>
              <div style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-6)', background: 'var(--bg-elevated)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>
                   PCI-DSS Validated Hosted Payment Component (Simulated iframe)
                 </p>
                 <div style={{ height: '120px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    [ External Provider Iframe Loading... ]
                 </div>
              </div>

               <div style={{ marginTop: 'var(--space-4)' }}>
                 <Button variant="outline" disabled style={{ width: '100%', borderStyle: 'dashed' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <div style={{ width: '12px', height: '12px', border: '2px solid var(--text-muted)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                      Awaiting Completion inside iFrame...
                    </div>
                 </Button>
               </div>
            </div>
          )}

          {activeTab === 'ewallet' && (
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)', padding: 'var(--space-6)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>e-Wallet integration (GCash/Maya) will be securely redirected to their hosted pages.</p>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: 'var(--bg-base)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-6)',
  fontFamily: 'var(--font-sans)'
};


