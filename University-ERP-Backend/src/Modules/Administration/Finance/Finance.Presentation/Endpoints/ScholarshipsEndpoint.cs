namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Finance.Application.Features.ApplyScholarship;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/scholarships")]
public sealed class ScholarshipsEndpoint : ControllerBase
{
    private readonly IStudentBillingRepository _studentBillingRepository;
    private readonly IMediator _mediator;

    private static readonly List<ScholarshipSchemeDto> DefaultSchemes = new()
    {
        new("sch-scheme-1", "President's Academic Excellence Grant", "INSTITUTIONAL", "PERCENTAGE", 100m, 3.75m, "University Endowment Fund"),
        new("sch-scheme-2", "Dean's Partial Merit Scholarship", "INSTITUTIONAL", "PERCENTAGE", 50m, 3.5m, "Academic Affairs"),
        new("sch-scheme-3", "CHED Tertiary Education Subsidy (TES)", "GOVERNMENT", "FIXED_AMOUNT", 20000m, 2.5m, "Commission on Higher Education (CHED)")
    };

    public ScholarshipsEndpoint(IStudentBillingRepository studentBillingRepository, IMediator mediator)
    {
        _studentBillingRepository = studentBillingRepository;
        _mediator = mediator;
    }

    [HttpGet("schemes")]
    [ProducesResponseType(typeof(IEnumerable<ScholarshipSchemeDto>), StatusCodes.Status200OK)]
    public IActionResult GetSchemes() => Ok(DefaultSchemes);

    [HttpGet("applications")]
    [ProducesResponseType(typeof(IEnumerable<GrantApplicationDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApplications([FromQuery] string? semesterId, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new GrantApplicationDto(
            Id: $"app-{b.Id.ToString()[..8]}",
            StudentId: b.StudentId.ToString(),
            StudentNumber: $"2026-{b.StudentId.ToString()[..5].ToUpper()}",
            StudentName: $"Student {b.StudentId.ToString()[..8]}",
            Program: b.Description,
            YearLevel: 2,
            SchemeId: "sch-scheme-2",
            SchemeName: "Dean's Partial Merit Scholarship",
            Sponsor: "Academic Affairs",
            DiscountType: "PERCENTAGE",
            DiscountValue: 50m,
            AppliedDiscountAmount: Math.Round(b.TotalAmount * 0.5m, 2),
            Gpa: 3.65m,
            EnrolledUnits: 21,
            TuitionFeeTotal: b.TotalAmount,
            Status: "APPROVED",
            SubmittedDate: b.IssuedOnUtc.ToString("yyyy-MM-dd")
        )).ToList();

        return Ok(list);
    }

    [HttpPost("applications/{applicationId}/approve")]
    [ProducesResponseType(typeof(GrantApplicationDto), StatusCodes.Status200OK)]
    public IActionResult ApproveApplication([FromRoute] string applicationId, [FromBody] ApproveApplicationRequest request)
    {
        return Ok(new GrantApplicationDto(
            Id: applicationId,
            StudentId: Guid.NewGuid().ToString(),
            StudentNumber: "2026-APP",
            StudentName: "Student Applicant",
            Program: "Academic Program",
            YearLevel: 1,
            SchemeId: "sch-scheme-1",
            SchemeName: "Academic Excellence Grant",
            Sponsor: "University Fund",
            DiscountType: "PERCENTAGE",
            DiscountValue: 100m,
            AppliedDiscountAmount: request.ApprovedDiscountAmount,
            Gpa: 3.8m,
            EnrolledUnits: 18,
            TuitionFeeTotal: request.ApprovedDiscountAmount,
            Status: "APPROVED",
            SubmittedDate: DateTime.UtcNow.ToString("yyyy-MM-dd")
        ));
    }

    [HttpPost("applications/{applicationId}/reject")]
    [ProducesResponseType(typeof(GrantApplicationDto), StatusCodes.Status200OK)]
    public IActionResult RejectApplication([FromRoute] string applicationId, [FromBody] RejectApplicationRequest request)
    {
        return Ok(new GrantApplicationDto(
            Id: applicationId,
            StudentId: Guid.NewGuid().ToString(),
            StudentNumber: "2026-APP",
            StudentName: "Student Applicant",
            Program: "Academic Program",
            YearLevel: 1,
            SchemeId: "sch-scheme-1",
            SchemeName: "Academic Excellence Grant",
            Sponsor: "University Fund",
            DiscountType: "PERCENTAGE",
            DiscountValue: 0m,
            AppliedDiscountAmount: 0m,
            Gpa: 2.0m,
            EnrolledUnits: 18,
            TuitionFeeTotal: 0m,
            Status: "REJECTED",
            SubmittedDate: DateTime.UtcNow.ToString("yyyy-MM-dd")
        ));
    }

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<ScholarshipGrantItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetGrants(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new ScholarshipGrantItemDto(
            Id: $"SCH-{b.Id.ToString()[..8]}",
            StudentId: b.StudentId.ToString(),
            StudentName: $"Student {b.StudentId.ToString()[..8]}",
            Program: b.Description,
            GrantName: "Academic Merit Scholarship",
            GrantType: "ACADEMIC_EXCELLENCE",
            DiscountAmount: Math.Round(b.TotalAmount * 0.25m, 2),
            DiscountPercentage: 25m,
            VerificationStatus: "VERIFIED",
            ApplicationStatus: "APPLIED",
            VerifiedBy: "Office of the University Registrar"
        )).ToList();

        return Ok(list);
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(ScholarshipSummaryDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummary(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);
        decimal totalAid = billings.Sum(b => Math.Round(b.TotalAmount * 0.25m, 2));
        int count = billings.Count;

        return Ok(new ScholarshipSummaryDto(totalAid, count, 0));
    }

    [HttpPost("{grantId}/apply")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ApplyGrant([FromRoute] string grantId, [FromBody] ApplyGrantRequest request, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(request.StudentId, out var studentId))
        {
            await _mediator.Send(new ApplyScholarshipCommand(studentId, request.Amount, request.GrantType), cancellationToken);
        }

        return Ok(new { success = true, grantId });
    }
}

public sealed record ScholarshipSchemeDto(
    string Id,
    string Name,
    string Type,
    string DiscountType,
    decimal Value,
    decimal MinGpaRequired,
    string Sponsor
);

public sealed record GrantApplicationDto(
    string Id,
    string StudentId,
    string StudentNumber,
    string StudentName,
    string Program,
    int YearLevel,
    string SchemeId,
    string SchemeName,
    string Sponsor,
    string DiscountType,
    decimal DiscountValue,
    decimal AppliedDiscountAmount,
    decimal Gpa,
    int EnrolledUnits,
    decimal TuitionFeeTotal,
    string Status,
    string SubmittedDate
);

public sealed record ScholarshipGrantItemDto(
    string Id,
    string StudentId,
    string StudentName,
    string Program,
    string GrantName,
    string GrantType,
    decimal DiscountAmount,
    decimal DiscountPercentage,
    string VerificationStatus,
    string ApplicationStatus,
    string VerifiedBy
);

public sealed record ScholarshipSummaryDto(decimal TotalDisbursedAid, int ActiveRecipients, int PendingVerifications);
public sealed record ApproveApplicationRequest(decimal ApprovedDiscountAmount);
public sealed record RejectApplicationRequest(string Reason);
public sealed record ApplyGrantRequest(string GrantId, string StudentId, decimal Amount, string GrantType);

