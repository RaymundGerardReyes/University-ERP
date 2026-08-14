import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, PageHeader, Table } from '@university-erp/ui-kit';
import { createLogger } from '@university-erp/core-logger';

const logger = createLogger('faculty-portal', 'ConfidentialDocuments');

// Simulated DTO for Secure Vault Documents
interface SecureDocumentDto {
  id: string;
  title: string;
  classification: 'Confidential' | 'Restricted' | 'Top Secret';
  uploadedBy: string;
  dateAdded: string;
  status: 'Encrypted' | 'Decrypted';
}

export const ConfidentialDocumentsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch the secure vault inventory
  const { data: documents = [], isLoading } = useQuery<SecureDocumentDto[]>({
    queryKey: ['security', 'confidentialDocuments'],
    queryFn: async () => {
      // Future API hookup: return await securityApi.getSecureVaultDocuments();
      return [];
    },
    initialData: [
      { id: 'DOC-SEC-001', title: 'Unredacted Disciplinary Hearing - Case #8492', classification: 'Restricted', uploadedBy: 'Dean of Students', dateAdded: '2026-08-10', status: 'Encrypted' },
      { id: 'DOC-SEC-002', title: 'Sealed Court Order - Subpoena #992-A', classification: 'Top Secret', uploadedBy: 'Legal Counsel', dateAdded: '2026-08-12', status: 'Encrypted' },
      { id: 'DOC-SEC-003', title: 'Faculty Background Check Audit', classification: 'Confidential', uploadedBy: 'HR Director', dateAdded: '2026-08-13', status: 'Decrypted' }
    ]
  });

  // Mutation to request document decryption
  const decryptMutation = useMutation({
    mutationFn: async (documentId: string) => {
      // Future API hookup: await securityApi.requestDocumentDecryption(documentId);
      return new Promise(resolve => setTimeout(resolve, 1200));
    },
    onSuccess: (_, documentId) => {
      logger.warn(`Security Officer successfully requested decryption key for document: ${documentId}`);
      alert('Decryption successful. The document view is now temporarily unlocked for this session.');
      queryClient.invalidateQueries({ queryKey: ['security', 'confidentialDocuments'] });
    },
    onError: (err) => {
      logger.error('Failed to decrypt document', err);
      alert('Security Error: Failed to acquire decryption key. This incident has been logged.');
    }
  });

  const handleDecryptRequest = (documentId: string, title: string) => {
    if (window.confirm(`SECURITY WARNING: You are requesting to decrypt "${title}". This action will be permanently recorded in the access audit ledger. Proceed?`)) {
      decryptMutation.mutate(documentId);
    }
  };

  // Apply frontend search filters
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="skeleton" style={{ height: '60vh' }} />;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <PageHeader 
        title="Confidential Documents Vault" 
        subtitle="Secure repository for highly sensitive institutional records and encrypted files." 
      />

      <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Filter & Search Bar */}
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-elevated)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder="Search by Document Title or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-base)', color: 'var(--text-primary)', width: '350px' }}
          />
          <Badge colorScheme="danger" style={{ fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            Zero Trust Architecture Enabled
          </Badge>
        </div>

        {/* High-Density Vault Table */}
        <Table>
          <thead>
            <tr>
              <th>Document Details</th>
              <th>Classification</th>
              <th>Uploaded By</th>
              <th>Encryption Status</th>
              <th style={{ textAlign: 'right' }}>Vault Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={doc.title}>
                    {doc.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{doc.id}</div>
                </td>
                <td>
                  <Badge 
                    colorScheme={
                      doc.classification === 'Top Secret' ? 'danger' : 
                      doc.classification === 'Restricted' ? 'warning' : 'info'
                    }
                  >
                    {doc.classification}
                  </Badge>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {doc.uploadedBy}<br/>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.dateAdded}</span>
                </td>
                <td>
                  {doc.status === 'Encrypted' ? (
                    <span style={{ color: 'var(--danger-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🔒 Encrypted
                    </span>
                  ) : (
                    <span style={{ color: 'var(--success-text)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      🔓 Decrypted
                    </span>
                  )}
                </td>
                <td style={{ textAlign: 'right' }}>
                  {doc.status === 'Encrypted' ? (
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => handleDecryptRequest(doc.id, doc.title)}
                      disabled={decryptMutation.isPending}
                    >
                      {decryptMutation.isPending ? 'Requesting Key...' : 'Request Decryption'}
                    </Button>
                  ) : (
                    <Button variant="primary" size="small">
                      View Securely
                    </Button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-muted)' }}>
                  No documents found in the secure vault matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};
