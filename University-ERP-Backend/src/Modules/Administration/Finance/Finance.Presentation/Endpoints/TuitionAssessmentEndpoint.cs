namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Finance.Domain.Aggregates;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/assessments")]
public sealed class TuitionAssessmentEndpoint : ControllerBase
{
    private readonly IStudentBillingRepository _studentBillingRepository;

    public TuitionAssessmentEndpoint(IStudentBillingRepository studentBillingRepository)
    {
        _studentBillingRepository = studentBillingRepository;
    }

    [HttpGet("candidates")]
    [ProducesResponseType(typeof(IEnumerable<AssessmentCandidateDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCandidates(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new AssessmentCandidateDto(
            StudentId: b.StudentId.ToString(),
            StudentName: $"Student {b.StudentId.ToString()[..8]}",
            Program: b.Description,
            EnrolledUnits: 18,
            RatePerUnit: 1800m,
            MiscellaneousFees: 4500m,
            ScholarshipDeduction: 0m,
            AssessedTotal: b.TotalAmount,
            Status: (b.Status == "Cleared" || b.Status == "FullyPaid" || b.Status == "PAID") ? "Assessed" : "Pending"
        )).ToList();

        return Ok(list);
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> PerformAssessment([FromBody] PerformAssessmentRequest request, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(request.StudentId, out var studentId))
        {
            var billing = await _studentBillingRepository.GetByStudentIdAsync(studentId, cancellationToken);
            if (billing != null)
            {
                billing.AssessTuition(request.Amount > 0 ? request.Amount : 33300m);
                await _studentBillingRepository.UpdateAsync(billing, cancellationToken);
            }
            else
            {
                var newBilling = StudentBilling.IssueInvoice(
                    studentId,
                    request.Amount > 0 ? request.Amount : 33300m,
                    $"Tuition Assessment {request.TermId ?? "FALL-2026"}"
                );
                if (newBilling.IsSuccess)
                {
                    await _studentBillingRepository.AddAsync(newBilling.Value, cancellationToken);
                }
            }
        }

        return Ok(new { assessmentId = $"ASS-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}" });
    }
}

public sealed record AssessmentCandidateDto(
    string StudentId,
    string StudentName,
    string Program,
    int EnrolledUnits,
    decimal RatePerUnit,
    decimal MiscellaneousFees,
    decimal ScholarshipDeduction,
    decimal AssessedTotal,
    string Status
);

public sealed record PerformAssessmentRequest(string StudentId, string? TermId = null, decimal Amount = 0);

