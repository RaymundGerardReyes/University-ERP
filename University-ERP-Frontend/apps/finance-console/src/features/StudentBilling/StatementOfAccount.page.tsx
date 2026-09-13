import React, { useState } from 'react';
import { PageHeader, Card, Table, Button, Badge, Modal, FormInput } from '@university-erp/ui-kit';
import { useStatementOfAccount } from './StatementOfAccount.hooks';
import { StudentAccountSummary } from './StatementOfAccount.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const StatementOfAccountPage: React.FC = () => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('stud-001');
  const [searchQuery, setSearchQuery] = useState('');
  const { summaries: rawSummaries, activeStatement, isLoading, isDetailLoading, postAdjustment, isAdjusting } = useStatementOfAccount(selectedStudentId);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustType, setAdjustType] = useState<'DEBIT' | 'CREDIT'>('CREDIT');
  const [adjustAmount, setAdjustAmount] = useState<number>(0);
  const [adjustReason, setAdjustReason] = useState('');

  const summaries = toSafeArray<StudentAccountSummary>(rawSummaries);
  const filteredSummaries = summaries.filter(
    (s: StudentAccountSummary) =>
      (s.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.studentNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeStudent = activeStatement?.student || summaries.find((s: StudentAccountSummary) => s.studentId === selectedStudentId);

  const handleOpenAdjustModal = () => {
    setAdjustAmount(0);
    setAdjustReason('');
    setAdjustType('CREDIT');
    setIsAdjustModalOpen(true);
  };

  const handleConfirmAdjust = async () => {
    if (!selectedStudentId || adjustAmount <= 0) return;
    await postAdjustment({
      studentId: selectedStudentId,
      amount: adjustAmount,
      reason: adjustReason,
      type: adjustType,
    });
    setIsAdjustModalOpen(false);
  };

  const getClearanceBadge = (status?: string) => {
    switch (status) {
      case 'CLEARED':
        return <Badge variant="success">Fully Cleared</Badge>;
      case 'DELINQUENT':
        return <Badge variant="danger">Delinquent</Badge>;
      default:
        return <Badge variant="warning">Financial Hold</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Statement of Account (SOA)"
        subtitle="Real-time student ledger records, payment schedules, and manual balance adjustments."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}>Print Official SOA</Button>
            <Button variant="primary" onClick={handleOpenAdjustModal}>Post Manual Adjustment</Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Assessed Accounts</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{summaries.length}</div>
          <div className="text-xs text-gray-500 mt-1">Enrolled & Active Students</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-gray-500">Total Collections (SOA)</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 font-mono">
            ₱{summaries.reduce((sum, s) => sum + (s.totalPaid || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Receipted & Confirmed</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-sm font-medium text-gray-500">Outstanding Balances</div>
          <div className="text-2xl font-bold text-amber-600 mt-1 font-mono">
            ₱{summaries.reduce((sum, s) => sum + (s.currentBalance || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Pending Semester Installments</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm font-medium text-gray-500">Scholarship Waivers</div>
          <div className="text-2xl font-bold text-purple-600 mt-1 font-mono">
            ₱{summaries.reduce((sum, s) => sum + (s.totalDiscount || 0), 0).toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Institutional & Grant Subsidies</div>
        </Card>
      </div>

      {/* Two-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Student Accounts Directory */}
        <div className="lg:col-span-5">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">Student Directory</h3>
              <div className="w-48">
                <FormInput
                  placeholder="Search student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading student accounts...</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSummaries.map((row: StudentAccountSummary) => (
                    <tr key={row.studentId}>
                      <td>
                        <div className="font-semibold text-gray-900">{row.studentName}</div>
                        <div className="text-xs text-gray-500">{row.studentNumber} • Yr {row.yearLevel}</div>
                      </td>
                      <td className="text-right font-mono font-bold text-gray-900">
                        ₱{row.currentBalance.toLocaleString()}
                      </td>
                      <td>{getClearanceBadge(row.clearanceStatus)}</td>
                      <td>
                        <Button
                          size="small"
                          variant={selectedStudentId === row.studentId ? 'primary' : 'outline'}
                          onClick={() => setSelectedStudentId(row.studentId)}
                        >
                          SOA
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredSummaries.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-6 text-gray-400">
                        No students found matching search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        {/* Right Column: Statement Detail & Ledger */}
        <div className="lg:col-span-7">
          {activeStudent ? (
            <div className="space-y-4">
              {/* Student Header Card */}
              <Card className="p-5 border-t-4 border-t-primary-600">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{activeStudent.studentName}</h3>
                    <p className="text-sm text-gray-500">
                      {activeStudent.studentNumber} • {activeStudent.program} (Year {activeStudent.yearLevel})
                    </p>
                  </div>
                  {getClearanceBadge(activeStudent.clearanceStatus)}
                </div>

                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-100 text-center">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Assessed Total</div>
                    <div className="font-mono font-bold text-gray-900 mt-0.5">₱{activeStudent.totalAssessed.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Discounts</div>
                    <div className="font-mono font-bold text-purple-600 mt-0.5">₱{activeStudent.totalDiscount.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Paid To Date</div>
                    <div className="font-mono font-bold text-emerald-600 mt-0.5">₱{activeStudent.totalPaid.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase">Current Balance</div>
                    <div className="font-mono font-bold text-red-600 mt-0.5">₱{activeStudent.currentBalance.toLocaleString()}</div>
                  </div>
                </div>
              </Card>

              {/* Itemized Ledger Table */}
              <Card className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-base font-bold text-gray-900">Itemized Account Transactions</h4>
                  <Button size="small" variant="outline" onClick={handleOpenAdjustModal}>
                    Add Adjustment
                  </Button>
                </div>

                {isDetailLoading ? (
                  <div className="py-8 text-center text-gray-500">Loading ledger items...</div>
                ) : (
                  <Table>
                    <thead>
                      <tr>
                        <th>Date & Ref</th>
                        <th>Description</th>
                        <th>Debit (+)</th>
                        <th>Credit (-)</th>
                        <th>Running Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {toSafeArray(activeStatement?.ledger).map((row: any) => (
                        <tr key={row.id}>
                          <td>
                            <div className="text-xs font-semibold text-gray-900">{row.date}</div>
                            <div className="text-xs text-gray-400 font-mono">{row.referenceNo}</div>
                          </td>
                          <td>
                            <div className="text-sm text-gray-800">{row.description}</div>
                            <div className="text-xs text-gray-500">{row.term}</div>
                          </td>
                          <td>
                            <span className="font-mono text-sm">{row.debit > 0 ? `₱${Number(row.debit).toLocaleString()}` : '-'}</span>
                          </td>
                          <td>
                            <span className="font-mono text-sm text-emerald-600">{row.credit > 0 ? `₱${Number(row.credit).toLocaleString()}` : '-'}</span>
                          </td>
                          <td>
                            <span className="font-mono font-bold text-sm text-gray-900">₱{Number(row.runningBalance ?? 0).toLocaleString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card>

              {/* Installment Schedules */}
              {toSafeArray(activeStatement?.paymentSchedules).length > 0 && (
                <Card className="p-4">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Installment Due Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {toSafeArray(activeStatement?.paymentSchedules).map((sched: any, idx) => (
                      <div key={idx} className="border border-gray-200 rounded p-3 bg-white">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{sched.term}</span>
                          <Badge variant={sched.status === 'PAID' ? 'success' : 'warning'}>{sched.status}</Badge>
                        </div>
                        <div className="text-lg font-bold font-mono text-gray-900 mt-1">₱{sched.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-400 mt-1">Due: {sched.dueDate}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center text-gray-400">
              Select a student account from the directory to inspect the statement of account.
            </Card>
          )}
        </div>
      </div>

      {/* Manual Adjustment Modal */}
      <Modal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Post Manual Ledger Adjustment</h3>
          <p className="text-sm text-gray-600">
            Apply a manual debit or credit adjustment to <strong className="text-gray-900">{activeStudent?.studentName}</strong>'s ledger account.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Adjustment Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="radio"
                  name="adjustType"
                  value="CREDIT"
                  checked={adjustType === 'CREDIT'}
                  onChange={() => setAdjustType('CREDIT')}
                />
                Credit (-) Discount / Correction
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-800">
                <input
                  type="radio"
                  name="adjustType"
                  value="DEBIT"
                  checked={adjustType === 'DEBIT'}
                  onChange={() => setAdjustType('DEBIT')}
                />
                Debit (+) Surcharge / Additional Fee
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Adjustment Amount (₱)</label>
            <FormInput
              type="number"
              placeholder="e.g. 1500"
              value={adjustAmount ? String(adjustAmount) : ''}
              onChange={(e) => setAdjustAmount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Reason / Justification</label>
            <FormInput
              placeholder="e.g. Approved Dean Waiver or Lab Breakage Charge"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirmAdjust} disabled={isAdjusting || adjustAmount <= 0}>
              {isAdjusting ? 'Posting...' : 'Post Adjustment to Ledger'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StatementOfAccountPage;
