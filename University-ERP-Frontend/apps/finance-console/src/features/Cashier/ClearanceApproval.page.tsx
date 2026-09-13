import React, { useState } from 'react';
import { PageHeader, Card, Table, Button, Badge, Modal, FormInput } from '@university-erp/ui-kit';
import { useClearanceApproval } from './ClearanceApproval.hooks';
import { ClearanceCandidate } from './ClearanceApproval.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const ClearanceApprovalPage: React.FC = () => {
  const { candidates, isLoading, approveClearance, rejectClearance, isProcessing } = useClearanceApproval();
  const [selectedCandidate, setSelectedCandidate] = useState<ClearanceCandidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'CLEARED' | 'REJECTED'>('ALL');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const candidateList = toSafeArray<ClearanceCandidate>(candidates);
  const filteredCandidates = candidateList.filter((c) => {
    const matchesSearch =
      (c.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.studentNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.program || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || c.financeStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCandidate = selectedCandidate || (filteredCandidates.length > 0 ? filteredCandidates[0] : null);

  const handleApprove = async (candidate: ClearanceCandidate) => {
    await approveClearance(candidate.id);
  };

  const handleOpenRejectModal = (candidate: ClearanceCandidate) => {
    setSelectedCandidate(candidate);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!activeCandidate) return;
    await rejectClearance({ candidateId: activeCandidate.id, reason: rejectReason });
    setIsRejectModalOpen(false);
  };

  const getStatusBadge = (status: ClearanceCandidate['financeStatus']) => {
    switch (status) {
      case 'CLEARED':
        return <Badge variant="success">Cleared for Graduation</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Clearance Denied</Badge>;
      default:
        return <Badge variant="warning">Pending Sign-off</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Graduation Financial Clearance"
        subtitle="Verify zero-balance ledger requirements and certify financial clearance for graduating candidates."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}>Print Clearance Manifest</Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-sm font-medium text-gray-500">Pending Finance Sign-off</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {candidateList.filter((c) => c.financeStatus === 'PENDING').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Candidates awaiting review</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-gray-500">Finance Cleared</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {candidateList.filter((c) => c.financeStatus === 'CLEARED').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Ready for registrar diploma release</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <div className="text-sm font-medium text-gray-500">With Outstanding Balance</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {candidateList.filter((c) => c.outstandingBalance > 0).length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Must settle cashier dues before clearance</div>
        </Card>
      </div>

      {/* Two-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Clearance Queue */}
        <div className="lg:col-span-7">
          <Card className="p-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
              <div className="flex gap-2">
                {(['ALL', 'PENDING', 'CLEARED', 'REJECTED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      filterStatus === st
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <div className="w-full md:w-56">
                <FormInput
                  placeholder="Search candidate..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading graduation candidates...</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="font-semibold text-gray-900">{row.studentName}</div>
                        <div className="text-xs text-gray-500">{row.studentNumber} • {row.program}</div>
                      </td>
                      <td className="text-right">
                        <span className={`font-mono font-bold ${row.outstandingBalance === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          ₱{row.outstandingBalance.toLocaleString()}
                        </span>
                      </td>
                      <td>{getStatusBadge(row.financeStatus)}</td>
                      <td>
                        <Button
                          size="small"
                          variant={activeCandidate?.id === row.id ? 'primary' : 'outline'}
                          onClick={() => setSelectedCandidate(row)}
                        >
                          Audit
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredCandidates.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400">
                        No candidates match the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        {/* Right Column: Candidate Clearance Inspector */}
        <div className="lg:col-span-5">
          {activeCandidate ? (
            <Card className="p-5 border-t-4 border-t-primary-600 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400">Clearance Dossier</span>
                  <h3 className="text-xl font-bold text-gray-900">{activeCandidate.studentName}</h3>
                  <p className="text-sm text-gray-500">{activeCandidate.studentNumber} • {activeCandidate.graduationTerm}</p>
                </div>
                {getStatusBadge(activeCandidate.financeStatus)}
              </div>

              {/* Invariant Audit Checks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400">Audit Verification Items</h4>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Student Ledger Balance:</span>
                    <span className={`font-mono font-bold ${activeCandidate.outstandingBalance === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₱{activeCandidate.outstandingBalance.toLocaleString()} {activeCandidate.outstandingBalance === 0 ? '✔' : '✖'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Library Overdue Fines:</span>
                    <span className={`font-mono font-bold ${activeCandidate.libraryFines === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      ₱{activeCandidate.libraryFines.toLocaleString()} {activeCandidate.libraryFines === 0 ? '✔' : '✖'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Unreturned Campus Assets:</span>
                    <span className={`font-bold ${activeCandidate.unreturnedAssetsCount === 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {activeCandidate.unreturnedAssetsCount} items {activeCandidate.unreturnedAssetsCount === 0 ? '✔' : '✖'}
                    </span>
                  </div>
                </div>
              </div>

              {activeCandidate.financeStatus === 'CLEARED' && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded text-sm">
                  <div className="font-bold">✔ Cleared by {activeCandidate.signOffOfficer}</div>
                  <div className="text-xs text-emerald-600">Timestamp: {activeCandidate.clearanceSignOffDate}</div>
                </div>
              )}

              {activeCandidate.financeStatus === 'REJECTED' && (
                <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded text-sm">
                  <div className="font-bold">✖ Clearance Denied</div>
                  <div className="text-xs text-red-600">{activeCandidate.rejectionReason}</div>
                </div>
              )}

              {/* Decision Action Buttons */}
              <div className="pt-3 flex gap-3">
                {activeCandidate.financeStatus !== 'CLEARED' && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleApprove(activeCandidate)}
                    disabled={isProcessing || activeCandidate.outstandingBalance > 0}
                  >
                    {activeCandidate.outstandingBalance > 0 ? 'Balance Must Be Zero' : 'Certify & Clear Student'}
                  </Button>
                )}
                {activeCandidate.financeStatus !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleOpenRejectModal(activeCandidate)}
                    disabled={isProcessing}
                  >
                    Flag / Reject
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-gray-400">
              Select a graduating candidate from the queue to verify clearance invariants.
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Deny Graduation Clearance</h3>
          <p className="text-sm text-gray-600">
            Specify the financial hold reason for candidate <strong className="text-gray-900">{activeCandidate?.studentName}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Hold Justification</label>
            <FormInput
              placeholder="e.g. Outstanding laboratory breakages assessment unpaid."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmReject} disabled={isProcessing}>
              {isProcessing ? 'Denying...' : 'Confirm Clearance Hold'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClearanceApprovalPage;
