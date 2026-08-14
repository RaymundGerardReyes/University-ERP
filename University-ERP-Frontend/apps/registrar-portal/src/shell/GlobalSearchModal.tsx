import React, { useEffect } from 'react';
import { Modal } from '@university-erp/ui-kit';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpen?: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onOpen }) => {
    const navigate = useNavigate();

    // Keyboard shortcut (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                if (isOpen) {
                    onClose();
                } else if (onOpen) {
                    onOpen();
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, onOpen]);

    if (!isOpen) return null;

    const mockSearch = () => {
        navigate('/registry/student/STU-2024-0012');
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} unstyled>
            <div style={{
                background: 'var(--bg-surface)',
                width: '600px',
                maxWidth: '90vw',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                marginTop: '10vh'
            }}>
                <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)' }}>
                    <input 
                        type="text" 
                        placeholder="Search by Student ID, Name, Course, or Request Ticket..." 
                        autoFocus
                        style={{
                            width: '100%',
                            padding: 'var(--space-3)',
                            fontSize: '1.1rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-bright, var(--text-primary))',
                            outline: 'none'
                        }}
                    />
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-base)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>Suggestions</p>
                    
                    {/* Mock Result based on Blueprint */}
                    <div 
                        onClick={mockSearch}
                        style={{
                            display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-3)', 
                            background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            border: '1px solid var(--border-subtle, var(--border-color))', transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-gradient, var(--brand-primary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>J</div>
                        <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Juan Dela Cruz</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>STU-2026-01482 • BS Computer Science</div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
