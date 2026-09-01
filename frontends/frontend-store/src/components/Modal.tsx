import React, { useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { FiX as X } from 'react-icons/fi';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeStyles = {
  sm: 'max-width: 320px;',
  md: 'max-width: 480px;',
  lg: 'max-width: 640px;',
  xl: 'max-width: 800px;',
};

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const overlayStyle = `
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
    animation: fadeIn 0.2s ease;
  `;

  const modalStyle = `
    background: white;
    border-radius: 0.75rem;
    width: 100%;
    ${sizeStyles[size]}
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.2s ease;
  `;

  return createPortal(
    <Fragment>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(1rem); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div style={{ cssText: overlayStyle }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div style={{ cssText: modalStyle }} onClick={(e) => e.stopPropagation()}>
        <div style={`
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #e2e8f0;
        `}>
          <h2 id="modal-title" style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1f2937' }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '0.25rem',
              border: 'none',
              background: 'transparent',
              color: '#6b7280',
              cursor: 'pointer',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1.25rem' }}>{children}</div>
      </div>
      </div>
    </Fragment>,
    document.body
  );
}