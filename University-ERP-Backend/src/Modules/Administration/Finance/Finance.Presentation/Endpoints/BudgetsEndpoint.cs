namespace Finance.Presentation.Endpoints;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/v1/finance/budgets")]
public sealed class BudgetsEndpoint : ControllerBase
{
    private static readonly List<DepartmentBudgetDto> Budgets = new()
    {
        new DepartmentBudgetDto(
            "BDG-001",
            "CS-DEPT",
            "Computer Science & Information Technology",
            "FY2026-2027",
            5000000m,
            0m,
            5000000m,
            "ON_TRACK",
            new List<BudgetLineItemDto>
            {
                new("li-1", "Personnel Services (Faculty Honoraria)", 3000000m, 0m, 3000000m),
                new("li-2", "Computer Lab Software Licenses & Cloud", 1200000m, 0m, 1200000m),
                new("li-3", "Hardware Upgrades & Maintenance", 800000m, 0m, 800000m)
            }
        ),
        new DepartmentBudgetDto(
            "BDG-002",
            "ENG-DEPT",
            "College of Engineering & Architecture",
            "FY2026-2027",
            6000000m,
            0m,
            6000000m,
            "ON_TRACK",
            new List<BudgetLineItemDto>
            {
                new("li-4", "Heavy Machinery Lab Maintenance", 3000000m, 0m, 3000000m),
                new("li-5", "Faculty Research Grants & Travel", 1800000m, 0m, 1800000m),
                new("li-6", "Student Capstone Fabrication Consumables", 1200000m, 0m, 1200000m)
            }
        )
    };

    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<DepartmentBudgetDto>), StatusCodes.Status200OK)]
    public IActionResult GetAllBudgets([FromQuery] string? fiscalYear)
    {
        var year = string.IsNullOrWhiteSpace(fiscalYear) ? "FY2026-2027" : fiscalYear;
        return Ok(Budgets.FindAll(b => b.FiscalYear.Equals(year, StringComparison.OrdinalIgnoreCase)));
    }

    [HttpGet("summary")]
    [ProducesResponseType(typeof(BudgetSummaryDto), StatusCodes.Status200OK)]
    public IActionResult GetBudgetSummary([FromQuery] string? fiscalYear)
    {
        var year = string.IsNullOrWhiteSpace(fiscalYear) ? "FY2026-2027" : fiscalYear;
        var relevant = Budgets.FindAll(b => b.FiscalYear.Equals(year, StringComparison.OrdinalIgnoreCase));
        
        decimal totalAllocated = relevant.Sum(b => b.AllocatedAmount);
        decimal totalSpent = relevant.Sum(b => b.SpentAmount);

        return Ok(new BudgetSummaryDto(year, totalAllocated, totalSpent, totalAllocated - totalSpent));
    }

    [HttpPost]
    [ProducesResponseType(typeof(DepartmentBudgetDto), StatusCodes.Status201Created)]
    public IActionResult CreateBudget([FromBody] CreateBudgetRequest request)
    {
        var newBudget = new DepartmentBudgetDto(
            $"BDG-00{Budgets.Count + 1}",
            request.DepartmentCode,
            request.DepartmentName,
            request.FiscalYear,
            request.AllocatedAmount,
            0m,
            request.AllocatedAmount,
            "ON_TRACK",
            new List<BudgetLineItemDto>()
        );

        Budgets.Add(newBudget);
        return Created($"/api/v1/finance/budgets/{newBudget.BudgetId}", newBudget);
    }
}

public sealed record BudgetLineItemDto(string Id, string Category, decimal Allocated, decimal Spent, decimal Remaining);

public sealed record DepartmentBudgetDto(
    string BudgetId,
    string DepartmentCode,
    string DepartmentName,
    string FiscalYear,
    decimal AllocatedAmount,
    decimal SpentAmount,
    decimal RemainingAmount,
    string Status,
    IReadOnlyList<BudgetLineItemDto> LineItems
);

public sealed record BudgetSummaryDto(string FiscalYear, decimal TotalAllocated, decimal TotalSpent, decimal TotalRemaining);

public sealed record CreateBudgetRequest(string DepartmentCode, string DepartmentName, string FiscalYear, decimal AllocatedAmount);

