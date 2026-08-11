import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  unstyled?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, unstyled = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div style={{ 
        position: 'fixed', 
        inset: 0, 
        backgroundColor: 'var(--bg-overlay, rgba(0,0,0,0.5))', 
        backdropFilter: 'blur(var(--glass-blur, 4px))', 
        display: 'flex', 
        alignItems: 'flex-start', 
        justifyContent: 'center', 
        zIndex: 99999, // Ensure it sits above all sidebars
        overflowY: 'auto',
        padding: '2rem'
    }}>
      <div style={
          unstyled 
          ? { margin: 'auto' } 
          : { 
              margin: 'auto',
              backgroundColor: 'var(--bg-surface)', 
              padding: '2rem', 
              borderRadius: 'var(--radius-lg)', 
              minWidth: '400px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)'
          }
      }>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
