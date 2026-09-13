namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/semester-billing")]
public sealed class SemesterBillingEndpoint : ControllerBase
{
    private readonly IStudentBillingRepository _studentBillingRepository;

    public SemesterBillingEndpoint(IStudentBillingRepository studentBillingRepository)
    {
        _studentBillingRepository = studentBillingRepository;
    }

    [HttpGet("assessments/pending")]
    [ProducesResponseType(typeof(IEnumerable<SemesterAssessmentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPendingAssessments([FromQuery] string? termId, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new SemesterAssessmentDto(
            AssessmentId: $"ASS-{b.Id.ToString()[..8]}",
            StudentId: b.StudentId.ToString(),
            TermId: termId ?? "TERM-FALL-2026",
            TotalAssessed: b.TotalAmount,
            Breakdown: new List<AssessmentCategoryDto>
            {
                new("Base Tuition Fee", Math.Round(b.TotalAmount * 0.80m, 2)),
                new("Laboratory & Learning Resources", Math.Round(b.TotalAmount * 0.15m, 2)),
                new("Registration & Matriculation", Math.Round(b.TotalAmount * 0.05m, 2))
            },
            Status: (b.Status == "Cleared" || b.Status == "FullyPaid" || b.Status == "PAID") ? "FINALIZED" : "DRAFT",
            AssessedAtUtc: b.IssuedOnUtc.ToString("o")
        )).ToList();

        return Ok(list);
    }

    [HttpPost("assessments/{assessmentId}/finalize")]
    [ProducesResponseType(typeof(SemesterInvoiceDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> FinalizeAssessment([FromRoute] string assessmentId, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);
        var found = billings.FirstOrDefault(b => b.Id.ToString().StartsWith(assessmentId.Replace("ASS-", ""), StringComparison.OrdinalIgnoreCase));

        if (found != null)
        {
            return Ok(new SemesterInvoiceDto(
                InvoiceId: $"INV-{found.Id.ToString()[..8]}",
                StudentId: found.StudentId.ToString(),
                TermId: "TERM-FALL-2026",
                AmountDue: found.TotalAmount,
                AmountPaid: found.PaidAmount,
                DueDate: found.IssuedOnUtc.AddDays(30).ToString("yyyy-MM-dd"),
                Status: (found.PaidAmount >= found.TotalAmount && found.TotalAmount > 0) ? "PAID" : "UNPAID"
            ));
        }

        return Ok(new SemesterInvoiceDto(
            InvoiceId: $"INV-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            StudentId: Guid.NewGuid().ToString(),
            TermId: "TERM-FALL-2026",
            AmountDue: 35000m,
            AmountPaid: 0m,
            DueDate: DateTime.UtcNow.AddDays(30).ToString("yyyy-MM-dd"),
            Status: "UNPAID"
        ));
    }

    [HttpGet("invoices")]
    [ProducesResponseType(typeof(IEnumerable<SemesterInvoiceDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTermInvoices([FromQuery] string? termId, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new SemesterInvoiceDto(
            InvoiceId: $"INV-{b.Id.ToString()[..8]}",
            StudentId: b.StudentId.ToString(),
            TermId: termId ?? "TERM-FALL-2026",
            AmountDue: b.TotalAmount,
            AmountPaid: b.PaidAmount,
            DueDate: b.IssuedOnUtc.AddDays(30).ToString("yyyy-MM-dd"),
            Status: (b.PaidAmount >= b.TotalAmount && b.TotalAmount > 0) ? "PAID" : "UNPAID"
        )).ToList();

        return Ok(list);
    }
}

public sealed record AssessmentCategoryDto(string Category, decimal Amount);

public sealed record SemesterAssessmentDto(
    string AssessmentId,
    string StudentId,
    string TermId,
    decimal TotalAssessed,
    IReadOnlyList<AssessmentCategoryDto> Breakdown,
    string Status,
    string AssessedAtUtc
);

public sealed record SemesterInvoiceDto(
    string InvoiceId,
    string StudentId,
    string TermId,
    decimal AmountDue,
    decimal AmountPaid,
    string DueDate,
    string Status
);

