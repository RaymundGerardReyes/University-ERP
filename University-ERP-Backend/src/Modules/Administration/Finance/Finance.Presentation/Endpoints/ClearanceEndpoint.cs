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
[Route("api/v1/finance/clearance/candidates")]
public sealed class ClearanceEndpoint : ControllerBase
{
    private readonly IStudentBillingRepository _studentBillingRepository;

    public ClearanceEndpoint(IStudentBillingRepository studentBillingRepository)
    {
        _studentBillingRepository = studentBillingRepository;
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ClearanceCandidateDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCandidates([FromQuery] string? term, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new ClearanceCandidateDto(
            Id: b.Id.ToString(),
            StudentNumber: $"2026-{b.StudentId.ToString()[..5].ToUpper()}",
            StudentName: $"Student {b.StudentId.ToString()[..8]}",
            Program: b.Description,
            GraduationTerm: string.IsNullOrWhiteSpace(term) ? "Midyear 2026" : term,
            OutstandingBalance: Math.Max(0m, b.TotalAmount - b.PaidAmount),
            UnreturnedAssetsCount: 0,
            LibraryFines: 0m,
            FinanceStatus: (b.Status == "Cleared" || b.PaidAmount >= b.TotalAmount) ? "CLEARED" : "PENDING",
            ClearanceSignOffDate: b.Status == "Cleared" ? b.IssuedOnUtc.ToString("yyyy-MM-dd") : null,
            SignOffOfficer: b.Status == "Cleared" ? "Finance Officer (Authorized)" : null,
            RejectionReason: null
        )).ToList();

        return Ok(list);
    }

    [HttpPost("{candidateId}/approve")]
    [ProducesResponseType(typeof(ClearanceCandidateDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ApproveClearance([FromRoute] string candidateId, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(candidateId, out var id))
        {
            var billing = await _studentBillingRepository.GetByIdAsync(id, cancellationToken)
                          ?? await _studentBillingRepository.GetByStudentIdAsync(id, cancellationToken);
            if (billing != null)
            {
                billing.ClearBalance();
                await _studentBillingRepository.UpdateAsync(billing, cancellationToken);

                return Ok(new ClearanceCandidateDto(
                    Id: billing.Id.ToString(),
                    StudentNumber: $"2026-{billing.StudentId.ToString()[..5].ToUpper()}",
                    StudentName: $"Student {billing.StudentId.ToString()[..8]}",
                    Program: billing.Description,
                    GraduationTerm: "Midyear 2026",
                    OutstandingBalance: 0m,
                    UnreturnedAssetsCount: 0,
                    LibraryFines: 0m,
                    FinanceStatus: "CLEARED",
                    ClearanceSignOffDate: DateTime.UtcNow.ToString("yyyy-MM-dd"),
                    SignOffOfficer: "Finance Officer (Authorized)",
                    RejectionReason: null
                ));
            }
        }

        return Ok(new ClearanceCandidateDto(
            Id: candidateId,
            StudentNumber: "2026-CLEAR",
            StudentName: "Candidate",
            Program: "Academic Program",
            GraduationTerm: "Midyear 2026",
            OutstandingBalance: 0m,
            UnreturnedAssetsCount: 0,
            LibraryFines: 0m,
            FinanceStatus: "CLEARED",
            ClearanceSignOffDate: DateTime.UtcNow.ToString("yyyy-MM-dd"),
            SignOffOfficer: "Finance Officer (Authorized)",
            RejectionReason: null
        ));
    }

    [HttpPost("{candidateId}/reject")]
    [ProducesResponseType(typeof(ClearanceCandidateDto), StatusCodes.Status200OK)]
    public IActionResult RejectClearance([FromRoute] string candidateId, [FromBody] RejectClearanceRequest request)
    {
        return Ok(new ClearanceCandidateDto(
            Id: candidateId,
            StudentNumber: "2026-CLEAR",
            StudentName: "Candidate",
            Program: "Academic Program",
            GraduationTerm: "Midyear 2026",
            OutstandingBalance: 0m,
            UnreturnedAssetsCount: 0,
            LibraryFines: 0m,
            FinanceStatus: "REJECTED",
            ClearanceSignOffDate: null,
            SignOffOfficer: null,
            RejectionReason: request.Reason
        ));
    }
}

public sealed record ClearanceCandidateDto(
    string Id,
    string StudentNumber,
    string StudentName,
    string Program,
    string GraduationTerm,
    decimal OutstandingBalance,
    int UnreturnedAssetsCount,
    decimal LibraryFines,
    string FinanceStatus,
    string? ClearanceSignOffDate,
    string? SignOffOfficer,
    string? RejectionReason
);

public sealed record RejectClearanceRequest(string Reason);

