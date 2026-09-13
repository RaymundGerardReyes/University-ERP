import React, { useState } from 'react';
import { PageHeader, Card, Table, Button, Badge, Modal, FormInput } from '@university-erp/ui-kit';
import { useScholarshipGrants } from './Scholarships.hooks';
import { GrantApplication, ScholarshipScheme } from './Scholarships.types';
import { toSafeArray } from '../../utils/arrayUtils';

export const ScholarshipGrantsPage: React.FC = () => {
  const { applications: rawApplications, schemes: rawSchemes, isLoading, approveApplication, rejectApplication, isProcessing } = useScholarshipGrants();
  const applications = toSafeArray<GrantApplication>(rawApplications);
  const schemes = toSafeArray<ScholarshipScheme>(rawSchemes);

  const [selectedApp, setSelectedApp] = useState<GrantApplication | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [discountOverride, setDiscountOverride] = useState<number>(0);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const filteredApplications = applications.filter(
    (app) =>
      (app.studentName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.studentNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.schemeName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeApp = selectedApp || (filteredApplications.length > 0 ? filteredApplications[0] : null);

  const handleOpenApprove = (app: GrantApplication) => {
    setSelectedApp(app);
    setDiscountOverride(
      app.appliedDiscountAmount ||
        (app.discountType === 'PERCENTAGE' ? (app.tuitionFeeTotal * app.discountValue) / 100 : app.discountValue)
    );
    setIsApproveModalOpen(true);
  };

  const handleOpenReject = (app: GrantApplication) => {
    setSelectedApp(app);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleConfirmApprove = async () => {
    if (!activeApp) return;
    await approveApplication({ applicationId: activeApp.id, approvedDiscountAmount: discountOverride });
    setIsApproveModalOpen(false);
  };

  const handleConfirmReject = async () => {
    if (!activeApp) return;
    await rejectApplication({ applicationId: activeApp.id, reason: rejectReason });
    setIsRejectModalOpen(false);
  };

  const getStatusBadge = (status: GrantApplication['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="success">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="danger">Rejected</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="warning">Under Review</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scholarships & Financial Grants"
        subtitle="Review scholarship submissions, manage grant schemes, and apply financial aid subsidies to tuition ledgers."
        action={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}>Print Subsidy Roster</Button>
            <Button variant="primary" onClick={() => alert('Scheme configuration drawer')}>Configure Scheme</Button>
          </div>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <div className="text-sm font-medium text-gray-500">Total Schemes Active</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{schemes.length} Schemes</div>
          <div className="text-xs text-gray-500 mt-1">
            {schemes.filter((s) => s.type === 'INSTITUTIONAL').length} Institutional / {schemes.filter((s) => s.type === 'GOVERNMENT').length} Gov
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="text-sm font-medium text-gray-500">Applications Pending</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {applications.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Awaiting verification</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <div className="text-sm font-medium text-gray-500">Approved Grants</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {applications.filter((a) => a.status === 'APPROVED').length}
          </div>
          <div className="text-xs text-gray-500 mt-1">Ready for ledger discount application</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-purple-500">
          <div className="text-sm font-medium text-gray-500">Total Aid Disbursed</div>
          <div className="text-2xl font-bold text-purple-600 mt-1 font-mono">
            ₱
            {applications
              .filter((a) => a.status === 'APPROVED')
              .reduce((sum, a) => sum + (a.appliedDiscountAmount || 0), 0)
              .toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">Applied to student tuition</div>
        </Card>
      </div>

      {/* Two-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Application Queue */}
        <div className="lg:col-span-7">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">Application Queue</h3>
              <div className="w-56">
                <FormInput
                  placeholder="Search student or scheme..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-gray-500">Loading grant applications...</div>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Scheme</th>
                    <th>GPA</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app.id}>
                      <td>
                        <div className="font-semibold text-gray-900">{app.studentName}</div>
                        <div className="text-xs text-gray-500">{app.studentNumber} • Yr {app.yearLevel}</div>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-gray-800">{app.schemeName}</div>
                        <div className="text-xs text-gray-400">{app.sponsor}</div>
                      </td>
                      <td className="font-mono font-bold text-gray-700">{app.gpa.toFixed(2)}</td>
                      <td>{getStatusBadge(app.status)}</td>
                      <td>
                        <Button
                          size="small"
                          variant={activeApp?.id === app.id ? 'primary' : 'outline'}
                          onClick={() => setSelectedApp(app)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {filteredApplications.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-6 text-gray-400">
                        No scholarship applications match the filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Card>
        </div>

        {/* Right Column: Application Dossier Inspector */}
        <div className="lg:col-span-5">
          {activeApp ? (
            <Card className="p-5 border-t-4 border-t-primary-600 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs uppercase font-bold text-gray-400">Application Dossier</span>
                  <h3 className="text-xl font-bold text-gray-900">{activeApp.studentName}</h3>
                  <p className="text-sm text-gray-500">{activeApp.studentNumber} • {activeApp.program}</p>
                </div>
                {getStatusBadge(activeApp.status)}
              </div>

              {/* Assessment Breakdown */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-gray-400">Academic & Financial Criteria</h4>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Selected Grant Scheme:</span>
                    <span className="font-semibold text-gray-900">{activeApp.schemeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Enrolled Units / Tuition:</span>
                    <span className="font-mono text-gray-900">{activeApp.enrolledUnits} Units (₱{activeApp.tuitionFeeTotal.toLocaleString()})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Verified GPA:</span>
                    <span className="font-mono font-bold text-emerald-600">{activeApp.gpa.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Calculated Subsidy:</span>
                    <span className="font-mono font-bold text-purple-600">
                      ₱{(activeApp.appliedDiscountAmount || (activeApp.discountType === 'PERCENTAGE' ? (activeApp.tuitionFeeTotal * activeApp.discountValue) / 100 : activeApp.discountValue)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Decision Action Buttons */}
              <div className="pt-3 flex gap-3">
                {activeApp.status !== 'APPROVED' && (
                  <Button
                    variant="primary"
                    className="flex-1"
                    onClick={() => handleOpenApprove(activeApp)}
                    disabled={isProcessing}
                  >
                    Approve & Grant
                  </Button>
                )}
                {activeApp.status !== 'REJECTED' && (
                  <Button
                    variant="danger"
                    className="flex-1"
                    onClick={() => handleOpenReject(activeApp)}
                    disabled={isProcessing}
                  >
                    Reject
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-8 text-center text-gray-400">
              Select an application from the queue to inspect grant eligibility.
            </Card>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Approve Scholarship Grant</h3>
          <p className="text-sm text-gray-600">
            Confirm subsidy application for <strong className="text-gray-900">{activeApp?.studentName}</strong> under scheme <strong className="text-gray-900">{activeApp?.schemeName}</strong>.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Approved Discount Amount (₱)</label>
            <FormInput
              type="number"
              value={String(discountOverride)}
              onChange={(e) => setDiscountOverride(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setIsApproveModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleConfirmApprove} disabled={isProcessing}>
              {isProcessing ? 'Approving...' : 'Confirm Grant Approval'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Deny Scholarship Application</h3>
          <p className="text-sm text-gray-600">
            Specify the reason for rejecting <strong className="text-gray-900">{activeApp?.studentName}</strong>'s grant application.
          </p>
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Rejection Reason</label>
            <FormInput
              placeholder="e.g. GPA requirement of 3.75 not met."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmReject} disabled={isProcessing}>
              {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScholarshipGrantsPage;
