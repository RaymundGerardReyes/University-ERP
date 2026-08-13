import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { communicationApi } from '@university-erp/api-clients';
import { Badge, Button, Card, PageHeader } from '@university-erp/ui-kit';
import React, { useState } from 'react';

export const ApplicantCommunicationPage: React.FC = () => {
    const queryClient = useQueryClient();
    const { data: messages, isLoading } = useQuery({
        queryKey: ['inbox'],
        queryFn: () => communicationApi.getInbox('admissions-dept')
    });

    const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMessages = messages?.filter(m => 
        m.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
        m.sender.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const selectedMsg = messages?.find(m => m.id === selectedMsgId) || filteredMessages[0];

    const sendMutation = useMutation({
        mutationFn: () => communicationApi.sendMessage({ recipientId: selectedMsg?.sender || '', subject: 'Re: ' + selectedMsg?.subject, body: replyText }),
        onSuccess: () => {
            setReplyText('');
            queryClient.invalidateQueries({ queryKey: ['inbox'] });
        }
    });

    return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
            <PageHeader
                title="Applicant Communication"
                subtitle="Manage messages, announcements, and document requests."
            />

            <div className="grid-2" style={{ flex: 1, minHeight: 0 }}>
                {/* Left Pane: Inbox List */}
                <Card style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)', display: 'flex', gap: '0.5rem' }}>
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
                        />
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {isLoading && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>Loading messages...</div>}
                        {!isLoading && filteredMessages.length === 0 && <div style={{ padding: '1rem', color: 'var(--text-muted)' }}>No messages found.</div>}
                        {filteredMessages.map((msg: any, idx: number) => (
                            <div key={idx}
                                onClick={() => setSelectedMsgId(msg.id)}
                                style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', background: selectedMsg?.id === msg.id ? 'var(--bg-hover)' : (msg.isRead ? 'transparent' : 'var(--bg-elevated)'), cursor: 'pointer', borderLeft: !msg.isRead ? '3px solid var(--brand-primary)' : '3px solid transparent' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <span style={{ fontWeight: !msg.isRead ? 700 : 600, color: !msg.isRead ? 'var(--text-bright)' : 'var(--text-primary)' }}>{msg.sender}</span>
                                    <span style={{ fontSize: '0.75rem', color: !msg.isRead ? 'var(--brand-primary)' : 'var(--text-muted)' }}>{new Date(msg.date).toLocaleDateString()}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: !msg.isRead ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                    {msg.subject}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Right Pane: Message View */}
                <Card style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{selectedMsg?.subject || 'Select a message'}</h2>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>From: {selectedMsg?.sender}</span>
                            </div>
                            <Badge colorScheme="info">Applicant Inquiry</Badge>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="secondary" size="small" onClick={() => console.log('Forward to Academic Dept (Mock)')}>Forward to Academic Dept</Button>
                        </div>
                    </div>

                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {!selectedMsg ? (
                             <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Select a message to view its content.</p>
                        ) : (
                             <p style={{ marginBottom: '1rem' }}>
                                 {/* Since message body is not in InboxMessage DTO yet, we mock its rendering. */}
                                 Message content for {selectedMsg.id} would be dynamically loaded from the backend here.
                             </p>
                        )}
                    </div>

                    <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', background: 'var(--bg-elevated)' }}>
                        <textarea
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: 'inherit', resize: 'none', marginBottom: '0.5rem' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button onClick={() => sendMutation.mutate()} disabled={sendMutation.isPending || !replyText}>
                                {sendMutation.isPending ? 'Sending...' : 'Send Message'}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
