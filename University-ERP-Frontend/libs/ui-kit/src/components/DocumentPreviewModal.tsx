import React from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentName: string;
    documentUrl?: string;
    filePath?: string | null;
    mimeType?: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
    isOpen,
    onClose,
    documentName,
    documentUrl,
    filePath,
    mimeType
}) => {
    let resolvedUrl = documentUrl || filePath || null;
    
    // Format the URL for development testing
    if (resolvedUrl && !resolvedUrl.startsWith('http') && !resolvedUrl.startsWith('/api/')) {
        resolvedUrl = `/api/v1/admissions/documents/${encodeURIComponent(resolvedUrl)}`;
    }

    const isPdf =
        mimeType === 'application/pdf' ||
        /\.pdf$/i.test(documentName) ||
        (resolvedUrl && /\.pdf$/i.test(resolvedUrl));

    const isImage =
        mimeType?.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(documentName) ||
        (resolvedUrl && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(resolvedUrl));

    // [DEBUGGING LOGS]
    console.group('DocumentPreviewModal Debugging');
    console.log('Props Received:', { documentName, documentUrl, filePath, mimeType });
    console.log('Resolved URL:', resolvedUrl);
    console.log('Detected File Type:', { isPdf, isImage });
    if (resolvedUrl && isPdf) {
        console.log('Action: Attempting to render iframe for PDF.');
    } else if (resolvedUrl && isImage) {
        console.log('Action: Attempting to render img tag for Image.');
    } else if (!resolvedUrl) {
        console.warn('Action: Rendering "Preview unavailable" (No File Path)');
    } else {
        console.warn('Action: Rendering "Preview unavailable" (Unsupported Type)');
    }
    console.groupEnd();

    return (
        <Modal isOpen={isOpen} onClose={onClose} unstyled={true}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="document-preview-title"
                style={{
                    width: 'min(1400px, 95vw)',
                    height: 'min(90vh, 900px)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    background: 'var(--bg-surface)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-color)', // Added depth
                }}
            >
                {/* Header */}
                <header
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        borderBottom: '1px solid var(--border-color)',
                    }}
                >
                    <div style={{ minWidth: 0 }}>
                        <h2
                            id="document-preview-title"
                            style={{
                                margin: 0,
                                fontSize: '1rem',
                                fontWeight: 700,
                                color: 'var(--text-primary)',
                            }}
                        >
                            Document Preview
                        </h2>

                        <p
                            style={{
                                margin: '4px 0 0',
                                fontSize: '0.8rem',
                                color: 'var(--text-muted)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                            title={documentName}
                        >
                            {documentName}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close document preview"
                        style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.5rem',
                            lineHeight: 1,
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                        }}
                    >
                        ×
                    </button>
                </header>

                {/* Viewer */}
                <main
                    style={{
                        flex: 1,
                        minHeight: 0,
                        overflow: 'auto',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: '24px',
                        background: 'var(--bg-subtle, #f8fafc)',
                    }}
                >
                    {resolvedUrl && isPdf && (
                        <iframe
                            src={resolvedUrl}
                            title={`Preview of ${documentName}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                border: 0,
                                background: '#fff',
                                borderRadius: '8px',
                                minHeight: '600px',
                            }}
                        />
                    )}

                    {resolvedUrl && isImage && (
                        <img
                            src={resolvedUrl}
                            alt={documentName}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                                background: '#fff',
                                borderRadius: '8px',
                            }}
                        />
                    )}

                    {!resolvedUrl && (
                        <div
                            style={{
                                margin: 'auto',
                                maxWidth: '420px',
                                textAlign: 'center',
                            }}
                        >
                            <h3>Preview unavailable</h3>

                            <p style={{ color: 'var(--text-muted)' }}>
                                This document does not currently have an
                                attached file available for preview.
                            </p>
                        </div>
                    )}

                    {resolvedUrl && !isPdf && !isImage && (
                        <div
                            style={{
                                margin: 'auto',
                                textAlign: 'center',
                            }}
                        >
                            <h3>Preview unavailable</h3>

                            <p style={{ color: 'var(--text-muted)' }}>
                                This file type cannot be previewed in the browser.
                            </p>

                            <a
                                href={resolvedUrl}
                                download={documentName}
                                style={{
                                    display: 'inline-block',
                                    marginTop: '1rem',
                                    padding: '0.5rem 1rem',
                                    background: 'var(--brand-primary)',
                                    color: 'white',
                                    textDecoration: 'none',
                                    borderRadius: '4px'
                                }}
                            >
                                Download file
                            </a>
                        </div>
                    )}
                </main>

                {/* Footer */}
                <footer
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '8px',
                        padding: '12px 20px',
                        borderTop: '1px solid var(--border-color)',
                    }}
                >
                    {resolvedUrl && (
                        <a
                            href={resolvedUrl}
                            download={documentName}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                padding: '8px 16px',
                                textDecoration: 'none',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                            }}
                        >
                            Download
                        </a>
                    )}

                    <Button
                        variant="primary"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                </footer>
            </div>
        </Modal>
    );
};