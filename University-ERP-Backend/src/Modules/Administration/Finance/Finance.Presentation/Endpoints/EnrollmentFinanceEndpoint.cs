namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using MediatR;
using Contracts.IntegrationEvents.Administration;

[ApiController]
[Route("api/v1/finance/enrollment")]
public sealed class EnrollmentFinanceEndpoint : ControllerBase
{
    private readonly IPaymentSessionRepository _paymentSessionRepository;
    private readonly ICashTransactionRepository _cashTransactionRepository;
    private readonly IStudentBillingRepository _studentBillingRepository;
    private readonly IPublisher? _publisher;

    public EnrollmentFinanceEndpoint(
        IPaymentSessionRepository paymentSessionRepository,
        ICashTransactionRepository cashTransactionRepository,
        IStudentBillingRepository studentBillingRepository,
        IPublisher? publisher = null)
    {
        _paymentSessionRepository = paymentSessionRepository;
        _cashTransactionRepository = cashTransactionRepository;
        _studentBillingRepository = studentBillingRepository;
        _publisher = publisher;
    }

    [HttpGet("assessments/pending")]
    [ProducesResponseType(typeof(IEnumerable<AdmissionAssessmentRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingAssessments(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new AdmissionAssessmentRecordDto(
            $"ASS-{b.Id.ToString()[..8]}",
            b.StudentId.ToString(),
            $"Student {b.StudentId.ToString()[..8]}",
            b.Description,
            "AY 2026-2027",
            18,
            b.TotalAmount,
            Math.Round(b.TotalAmount * 0.25m, 2),
            b.Status == "Cleared" || b.Status == "FullyPaid" || b.Status == "PAID" ? "Assessed" : "AssessmentPending",
            b.IssuedOnUtc.ToString("yyyy-MM-dd")
        )).ToList();

        var existingStudentIds = new HashSet<string>(list.Select(l => l.StudentId), StringComparer.OrdinalIgnoreCase);

        foreach (var s in sessions)
        {
            if (!string.IsNullOrEmpty(s.ApplicantId) && !existingStudentIds.Contains(s.ApplicantId))
            {
                var isVerified = s.Status == "Paid" || s.Status == "Completed";
                var downpayment = s.Amount > 0 ? s.Amount : 875.00m;
                var totalTuition = downpayment * 4m;
                list.Add(new AdmissionAssessmentRecordDto(
                    $"ASS-{s.SessionId[..Math.Min(8, s.SessionId.Length)]}",
                    s.ApplicantId,
                    !string.IsNullOrWhiteSpace(s.ApplicantId) ? s.ApplicantId : "Applicant",
                    !string.IsNullOrWhiteSpace(s.Purpose) ? s.Purpose : "BSCS",
                    "AY 2026-2027",
                    18,
                    totalTuition,
                    downpayment,
                    isVerified ? "Assessed" : "AssessmentPending",
                    s.CreatedAtUtc.ToString("yyyy-MM-dd")
                ));
                existingStudentIds.Add(s.ApplicantId);
            }
        }

        return Ok(list);
    }

    [HttpPost("assessments")]
    [ProducesResponseType(typeof(AdmissionAssessmentRecordDto), StatusCodes.Status201Created)]
    public async Task<IActionResult> GenerateAssessment([FromBody] GenerateAssessmentPayload payload, CancellationToken cancellationToken)
    {
        Guid studentId = Guid.TryParse(payload.ApplicantId, out var parsedGuid) ? parsedGuid : Guid.NewGuid();
        var billingResult = StudentBilling.IssueInvoice(
            studentId, 
            payload.TuitionAmount > 0 ? payload.TuitionAmount : 3000m, 
            payload.ProgramCode ?? "Admission Tuition Assessment");
        
        if (billingResult.IsSuccess)
        {
            await _studentBillingRepository.AddAsync(billingResult.Value, cancellationToken);
        }

        var record = new AdmissionAssessmentRecordDto(
            $"ASS-APP-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            payload.ApplicantId,
            payload.ApplicantName ?? "Applicant",
            payload.ProgramCode ?? "BSCS",
            payload.AcademicYear ?? "AY 2026-2027",
            payload.Units,
            payload.TuitionAmount,
            payload.DownpaymentAmount,
            "Assessed",
            DateTime.UtcNow.ToString("yyyy-MM-dd")
        );
        return Created($"/api/v1/finance/enrollment/assessments/{record.AssessmentId}", record);
    }

    [HttpPost("assessments/{assessmentId}/publish")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult PublishAssessment([FromRoute] string assessmentId)
    {
        return Ok(new { success = true, assessmentId, status = "Assessed" });
    }

    [HttpGet("downpayments/pending")]
    [ProducesResponseType(typeof(IEnumerable<EnrollmentDownpaymentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingDownpayments(CancellationToken cancellationToken)
    {
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);
        var cashTxns = await _cashTransactionRepository.GetAllAsync(cancellationToken);

        var list = new List<EnrollmentDownpaymentDto>();

        foreach (var session in sessions)
        {
            var isVerified = session.Status == "Paid" || session.Status == "Completed";
            var status = isVerified ? "PAYMENT_VERIFIED" : "PAYMENT_PENDING";
            var method = !string.IsNullOrEmpty(session.BankReference) ? "BANK_TRANSFER" : "ONLINE_GATEWAY";
            var refNumber = session.GatewayTransactionId ?? session.BankReference ?? session.SessionId;
            var name = !string.IsNullOrWhiteSpace(session.ApplicantId) ? session.ApplicantId : "Applicant";
            var program = !string.IsNullOrWhiteSpace(session.Purpose) ? session.Purpose : "Admissions Downpayment";

            list.Add(new EnrollmentDownpaymentDto(
                ReferenceId: session.SessionId,
                ApplicantName: name,
                Program: program,
                AmountDue: session.Amount,
                AmountPaid: isVerified ? session.Amount : 0m,
                PaymentMethod: method,
                Status: status,
                TransactionRef: refNumber,
                Date: session.CreatedAtUtc.ToString("yyyy-MM-dd"),
                PaymentId: session.SessionId,
                ApplicantId: session.ApplicantId,
                AssessmentId: session.InvoiceId,
                ReferenceNumber: refNumber
            ));
        }

        foreach (var txn in cashTxns)
        {
            var isVerified = txn.Status == "Completed";
            list.Add(new EnrollmentDownpaymentDto(
                ReferenceId: txn.TransactionToken,
                ApplicantName: txn.ReferenceId,
                Program: "Cash Payment",
                AmountDue: txn.Amount,
                AmountPaid: isVerified ? txn.Amount : 0m,
                PaymentMethod: "OVER_THE_COUNTER",
                Status: isVerified ? "PAYMENT_VERIFIED" : "PAYMENT_PENDING",
                TransactionRef: txn.TransactionToken,
                Date: txn.CreatedOnUtc.ToString("yyyy-MM-dd"),
                PaymentId: txn.TransactionToken,
                ApplicantId: txn.ReferenceId,
                AssessmentId: txn.ReferenceId,
                ReferenceNumber: txn.TransactionToken
            ));
        }

        return Ok(list);
    }

    [HttpPost("downpayments/{paymentId}/verify")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> VerifyDownpayment([FromRoute] string paymentId, CancellationToken cancellationToken)
    {
        var session = await _paymentSessionRepository.GetBySessionIdAsync(paymentId, cancellationToken);
        if (session != null)
        {
            session.Reconcile("CASHIER", "Manual Verification via Downpayment Console");
            await _paymentSessionRepository.SaveChangesAsync(cancellationToken);

            // Update associated StudentBilling if one exists
            Guid applicantGuid = Guid.TryParse(session.ApplicantId, out var parsedGuid)
                ? parsedGuid
                : GenerateDeterministicGuid(session.ApplicantId ?? "");

            var billing = await _studentBillingRepository.GetByStudentIdAsync(applicantGuid, cancellationToken);
            if (billing == null && !string.IsNullOrWhiteSpace(session.InvoiceId))
            {
                var rawInvoiceId = session.InvoiceId.Replace("INV-", "");
                if (Guid.TryParse(rawInvoiceId, out var invoiceGuid))
                {
                    billing = await _studentBillingRepository.GetByIdAsync(invoiceGuid, cancellationToken);
                }
            }

            if (billing != null)
            {
                billing.RecordPayment(session.Amount);
                await _studentBillingRepository.UpdateAsync(billing, cancellationToken);
            }

            if (_publisher != null)
            {
                await _publisher.Publish(new PaymentVerifiedIntegrationEvent(
                    Guid.NewGuid(),
                    DateTime.UtcNow,
                    session.ApplicantId ?? session.SessionId,
                    session.InvoiceId ?? session.SessionId,
                    session.Amount,
                    "USD",
                    session.GatewayTransactionId ?? session.BankReference ?? session.SessionId,
                    DateTime.UtcNow
                ), cancellationToken);
            }

            return Ok(new { success = true, referenceId = paymentId, status = "PAYMENT_VERIFIED" });
        }

        var cashTxn = await _cashTransactionRepository.GetByTokenAsync(paymentId, cancellationToken);
        if (cashTxn != null)
        {
            cashTxn.Complete();
            await _cashTransactionRepository.SaveChangesAsync(cancellationToken);

            if (_publisher != null)
            {
                await _publisher.Publish(new PaymentVerifiedIntegrationEvent(
                    Guid.NewGuid(),
                    DateTime.UtcNow,
                    cashTxn.ReferenceId ?? cashTxn.TransactionToken,
                    cashTxn.TransactionToken,
                    cashTxn.Amount,
                    "USD",
                    cashTxn.TransactionToken,
                    DateTime.UtcNow
                ), cancellationToken);
            }

            return Ok(new { success = true, referenceId = paymentId, status = "PAYMENT_VERIFIED" });
        }

        return Ok(new { success = true, referenceId = paymentId, status = "PAYMENT_VERIFIED" });
    }

    [HttpGet("clearance/candidates")]
    [ProducesResponseType(typeof(IEnumerable<EnrollmentClearanceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetClearanceCandidates(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);

        var list = new List<EnrollmentClearanceDto>();
        var seenApplicantIds = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var b in billings)
        {
            var feeStatus = (b.Status == "Cleared" || b.Status == "FullyPaid" || b.Status == "PAID" || b.PaidAmount > 0) ? "Paid" : "Pending";
            var clrStatus = b.Status == "Cleared" ? "CLEARED" : "CLEARANCE_PENDING";
            list.Add(new EnrollmentClearanceDto(
                b.StudentId.ToString(),
                $"Student {b.StudentId.ToString()[..8]}",
                b.Description,
                b.TotalAmount,
                b.PaidAmount,
                feeStatus,
                clrStatus,
                b.IssuedOnUtc.ToString("yyyy-MM-dd")
            ));
            seenApplicantIds.Add(b.StudentId.ToString());
        }

        foreach (var s in sessions)
        {
            if (!string.IsNullOrEmpty(s.ApplicantId) && !seenApplicantIds.Contains(s.ApplicantId))
            {
                var isVerified = s.Status == "Paid" || s.Status == "Completed";
                var feeStatus = isVerified ? "Paid" : "Pending";
                var clrStatus = isVerified ? "CLEARED" : "CLEARANCE_PENDING";
                list.Add(new EnrollmentClearanceDto(
                    s.ApplicantId,
                    s.ApplicantId,
                    !string.IsNullOrWhiteSpace(s.Purpose) ? s.Purpose : "Admissions Downpayment",
                    s.Amount * 4m,
                    isVerified ? s.Amount : 0m,
                    feeStatus,
                    clrStatus,
                    s.CreatedAtUtc.ToString("yyyy-MM-dd")
                ));
                seenApplicantIds.Add(s.ApplicantId);
            }
        }

        return Ok(list);
    }

    [HttpPost("clearance/{applicantId}/grant")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GrantClearance([FromRoute] string applicantId, CancellationToken cancellationToken)
    {
        Guid studentId = Guid.TryParse(applicantId, out var parsed) 
            ? parsed 
            : GenerateDeterministicGuid(applicantId);

        var billing = await _studentBillingRepository.GetByStudentIdAsync(studentId, cancellationToken);
        if (billing != null)
        {
            billing.ClearForEnrollment();
            await _studentBillingRepository.UpdateAsync(billing, cancellationToken);
        }
        return Ok(new { success = true, applicantId, clearanceStatus = "CLEARED" });
    }

    private static Guid GenerateDeterministicGuid(string input)
    {
        if (string.IsNullOrWhiteSpace(input)) return Guid.NewGuid();
        using var md5 = MD5.Create();
        var hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
        return new Guid(hash);
    }
}

public sealed record AdmissionAssessmentRecordDto(
    string AssessmentId,
    string StudentId,
    string ApplicantName,
    string ProgramCode,
    string AcademicYear,
    int TotalUnits,
    decimal TuitionAmount,
    decimal DownpaymentAmount,
    string Status,
    string DateAccepted
);

public sealed record GenerateAssessmentPayload(
    string ApplicantId,
    string? ApplicantName,
    string? ProgramCode,
    string? AcademicYear,
    int Units,
    decimal TuitionAmount,
    decimal DownpaymentAmount
);

public sealed record EnrollmentDownpaymentDto(
    string ReferenceId,
    string ApplicantName,
    string Program,
    decimal AmountDue,
    decimal AmountPaid,
    string PaymentMethod,
    string Status,
    string TransactionRef,
    string Date,
    string? PaymentId = null,
    string? ApplicantId = null,
    string? AssessmentId = null,
    string? ReferenceNumber = null
);

public sealed record EnrollmentClearanceDto(
    string ApplicantId,
    string ApplicantName,
    string Program,
    decimal AssessedTuition,
    decimal DownpaymentPaid,
    string FeeStatus,
    string ClearanceStatus,
    string DatePaid
);

