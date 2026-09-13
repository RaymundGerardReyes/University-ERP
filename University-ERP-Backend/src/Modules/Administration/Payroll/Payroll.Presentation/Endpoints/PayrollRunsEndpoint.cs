namespace Payroll.Presentation.Endpoints;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/v1/payroll")]
public sealed class PayrollRunsEndpoint : ControllerBase
{
    private static readonly List<PayrollRecordDto> PayrollRecords = new()
    {
        new("PR-2026-001", "EMP-FAC-1001", "Dr. Alan Turing", "Computer Science", 7500m, 800m, 1200m, 7100m, "Aug 2026", "DISBURSED", "2026-08-31"),
        new("PR-2026-002", "EMP-FAC-1002", "Dr. Ada Lovelace", "Computer Studies", 8200m, 950m, 1350m, 7800m, "Aug 2026", "DISBURSED", "2026-08-31"),
        new("PR-2026-003", "EMP-STF-2005", "Sarah Jenkins", "Registrar Office", 4200m, 300m, 650m, 3850m, "Aug 2026", "COMPUTED", "2026-08-31"),
        new("PR-2026-004", "EMP-FAC-1008", "Prof. Richard Feynman", "Physics & Astronomy", 8500m, 1000m, 1500m, 8000m, "Aug 2026", "COMPUTED", "2026-08-31")
    };

    [HttpGet("records")]
    [ProducesResponseType(typeof(IEnumerable<PayrollRecordDto>), StatusCodes.Status200OK)]
    public IActionResult GetPayrollRecords([FromQuery] string? payPeriod)
    {
        return Ok(PayrollRecords);
    }

    [HttpGet("runs")]
    [ProducesResponseType(typeof(IEnumerable<PayrollRecordDto>), StatusCodes.Status200OK)]
    public IActionResult GetPayrollRuns()
    {
        return Ok(PayrollRecords);
    }
}

public sealed record PayrollRecordDto(
    string Id,
    string EmployeeId,
    string EmployeeName,
    string Department,
    decimal BasicSalary,
    decimal Allowances,
    decimal Deductions,
    decimal NetPay,
    string PayPeriod,
    string Status,
    string GeneratedDate
);

