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
[Route("api/v1/finance/statements")]
public sealed class StatementsEndpoint : ControllerBase
{
    private readonly IStudentBillingRepository _studentBillingRepository;

    public StatementsEndpoint(IStudentBillingRepository studentBillingRepository)
    {
        _studentBillingRepository = studentBillingRepository;
    }

    [HttpGet("summaries")]
    [ProducesResponseType(typeof(IEnumerable<StudentAccountSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSummaries([FromQuery] string? semesterId, CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);

        var list = billings.Select(b => new StudentAccountSummaryDto(
            StudentId: b.StudentId.ToString(),
            StudentNumber: $"2026-{b.StudentId.ToString()[..5].ToUpper()}",
            StudentName: $"Student {b.StudentId.ToString()[..8]}",
            Program: b.Description,
            YearLevel: 2,
            TotalAssessed: b.TotalAmount,
            TotalDiscount: 0m,
            TotalPaid: b.PaidAmount,
            CurrentBalance: Math.Max(0m, b.TotalAmount - b.PaidAmount),
            ClearanceStatus: (b.Status == "Cleared" || b.PaidAmount >= b.TotalAmount) ? "CLEARED" : "HOLD",
            LastPaymentDate: b.IssuedOnUtc.ToString("yyyy-MM-dd")
        )).ToList();

        return Ok(list);
    }

    [HttpGet("{studentId}")]
    [ProducesResponseType(typeof(StatementOfAccountDetailDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStatementDetail([FromRoute] string studentId, CancellationToken cancellationToken)
    {
        Guid parsedId = Guid.TryParse(studentId, out var parsed) ? parsed : Guid.Empty;
        var billing = await _studentBillingRepository.GetByStudentIdAsync(parsedId, cancellationToken);

        if (billing == null)
        {
            var all = await _studentBillingRepository.GetAllAsync(cancellationToken);
            billing = all.FirstOrDefault();
        }

        var studentSummary = billing != null
            ? new StudentAccountSummaryDto(
                StudentId: billing.StudentId.ToString(),
                StudentNumber: $"2026-{billing.StudentId.ToString()[..5].ToUpper()}",
                StudentName: $"Student {billing.StudentId.ToString()[..8]}",
                Program: billing.Description,
                YearLevel: 2,
                TotalAssessed: billing.TotalAmount,
                TotalDiscount: 0m,
                TotalPaid: billing.PaidAmount,
                CurrentBalance: Math.Max(0m, billing.TotalAmount - billing.PaidAmount),
                ClearanceStatus: (billing.Status == "Cleared" || billing.PaidAmount >= billing.TotalAmount) ? "CLEARED" : "HOLD",
                LastPaymentDate: billing.IssuedOnUtc.ToString("yyyy-MM-dd")
            )
            : new StudentAccountSummaryDto(
                StudentId: studentId,
                StudentNumber: "2026-STU",
                StudentName: "Enrolled Student",
                Program: "Degree Program",
                YearLevel: 1,
                TotalAssessed: 0m,
                TotalDiscount: 0m,
                TotalPaid: 0m,
                CurrentBalance: 0m,
                ClearanceStatus: "CLEARED",
                LastPaymentDate: DateTime.UtcNow.ToString("yyyy-MM-dd")
            );

        var totalAssessed = studentSummary.TotalAssessed;
        var totalPaid = studentSummary.TotalPaid;
        var balance = studentSummary.CurrentBalance;

        var detail = new StatementOfAccountDetailDto(
            studentSummary,
            new List<LedgerItemDto>
            {
                new("led-1", studentSummary.LastPaymentDate, "1st Sem 2026-2027", "Tuition & Misc Fee Assessment", "ASS-2026-001", "ASSESSMENT", totalAssessed, 0m, totalAssessed),
                new("led-2", studentSummary.LastPaymentDate, "1st Sem 2026-2027", "Recorded Payment", "PAY-2026-001", "PAYMENT", 0m, totalPaid, balance)
            },
            new List<PaymentScheduleItemDto>
            {
                new("Prelim Installment", DateTime.UtcNow.AddDays(15).ToString("yyyy-MM-dd"), Math.Round(balance / 2, 2), balance <= 0m ? "PAID" : "DUE"),
                new("Midterm Installment", DateTime.UtcNow.AddDays(45).ToString("yyyy-MM-dd"), Math.Round(balance / 2, 2), balance <= 0m ? "PAID" : "DUE")
            }
        );

        return Ok(detail);
    }

    [HttpPost("{studentId}/adjustments")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> PostAdjustment([FromRoute] string studentId, [FromBody] PostAdjustmentRequest request, CancellationToken cancellationToken)
    {
        if (Guid.TryParse(studentId, out var parsedId))
        {
            var billing = await _studentBillingRepository.GetByStudentIdAsync(parsedId, cancellationToken);
            if (billing != null)
            {
                var adj = request.Type == "DEBIT" ? request.Amount : -request.Amount;
                billing.AdjustTuition(adj, request.Reason);
                await _studentBillingRepository.UpdateAsync(billing, cancellationToken);
            }
        }

        return Ok(new { success = true });
    }
}

public sealed record StudentAccountSummaryDto(
    string StudentId,
    string StudentNumber,
    string StudentName,
    string Program,
    int YearLevel,
    decimal TotalAssessed,
    decimal TotalDiscount,
    decimal TotalPaid,
    decimal CurrentBalance,
    string ClearanceStatus,
    string LastPaymentDate
);

public sealed record LedgerItemDto(
    string Id,
    string Date,
    string Term,
    string Description,
    string ReferenceNo,
    string Type,
    decimal Debit,
    decimal Credit,
    decimal RunningBalance
);

public sealed record PaymentScheduleItemDto(
    string Term,
    string DueDate,
    decimal Amount,
    string Status
);

public sealed record StatementOfAccountDetailDto(
    StudentAccountSummaryDto Student,
    IReadOnlyList<LedgerItemDto> Ledger,
    IReadOnlyList<PaymentScheduleItemDto> PaymentSchedules
);

public sealed record PostAdjustmentRequest(decimal Amount, string Reason, string Type);

