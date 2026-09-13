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
[Route("api/v1/finance")]
public sealed class DashboardEndpoint : ControllerBase
{
    private readonly IPaymentSessionRepository _paymentSessionRepository;
    private readonly ICashTransactionRepository _cashTransactionRepository;
    private readonly IStudentBillingRepository _studentBillingRepository;

    public DashboardEndpoint(
        IPaymentSessionRepository paymentSessionRepository,
        ICashTransactionRepository cashTransactionRepository,
        IStudentBillingRepository studentBillingRepository)
    {
        _paymentSessionRepository = paymentSessionRepository;
        _cashTransactionRepository = cashTransactionRepository;
        _studentBillingRepository = studentBillingRepository;
    }

    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(FinanceOverviewKpisDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDashboardKpis(CancellationToken cancellationToken)
    {
        var billings = await _studentBillingRepository.GetAllAsync(cancellationToken);
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);
        var cashTxns = await _cashTransactionRepository.GetAllAsync(cancellationToken);

        decimal billingCollected = billings.Sum(b => b.PaidAmount);
        decimal sessionsCollected = sessions.Where(s => s.Status == "Paid" || s.Status == "Completed").Sum(s => s.Amount);
        decimal cashCollected = cashTxns.Where(t => t.Status == "Completed").Sum(t => t.Amount);

        decimal totalRevenue = billingCollected + sessionsCollected + cashCollected;
        decimal receivables = billings.Sum(b => Math.Max(0m, b.TotalAmount - b.PaidAmount));
        int pendingClearance = billings.Count(b => b.Status != "Cleared");
        int activeGrants = billings.Count(b => b.Description.Contains("Grant", StringComparison.OrdinalIgnoreCase));
        int recentCount = sessions.Count + cashTxns.Count;

        var today = DateTime.UtcNow.Date;
        decimal todayCashier = cashTxns
            .Where(t => t.Status == "Completed" && t.CreatedOnUtc.Date == today)
            .Sum(t => t.Amount)
            + sessions
            .Where(s => (s.Status == "Paid" || s.Status == "Completed") && s.CreatedAtUtc.Date == today)
            .Sum(s => s.Amount);

        return Ok(new FinanceOverviewKpisDto(
            TotalRevenueCollected: totalRevenue,
            OutstandingReceivables: receivables,
            PendingClearanceApprovals: pendingClearance,
            ActiveScholarshipGrants: activeGrants,
            RecentTransactionsCount: recentCount,
            TodayCashierCollection: todayCashier
        ));
    }

    [HttpGet("cashier-ledger")]
    [ProducesResponseType(typeof(IEnumerable<CashierLedgerEntryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetCashierLedger([FromQuery] string? date, CancellationToken cancellationToken)
    {
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);
        var cashTxns = await _cashTransactionRepository.GetAllAsync(cancellationToken);

        var list = new List<CashierLedgerEntryDto>();

        foreach (var s in sessions)
        {
            var status = (s.Status == "Paid" || s.Status == "Completed") ? "RECONCILED" : "PENDING_DISBURSEMENT";
            var channel = !string.IsNullOrEmpty(s.BankReference) ? "BANK_TRANSFER" : "ONLINE_GATEWAY";
            list.Add(new CashierLedgerEntryDto(
                TransactionId: s.SessionId,
                Timestamp: s.CreatedAtUtc.ToString("yyyy-MM-dd HH:mm"),
                TerminalId: "TERM-ONLINE",
                Description: s.Purpose,
                Amount: s.Amount,
                PaymentChannel: channel,
                Status: status
            ));
        }

        foreach (var t in cashTxns)
        {
            var status = t.Status == "Completed" ? "RECONCILED" : "PENDING_DISBURSEMENT";
            list.Add(new CashierLedgerEntryDto(
                TransactionId: t.TransactionToken,
                Timestamp: t.CreatedOnUtc.ToString("yyyy-MM-dd HH:mm"),
                TerminalId: "TERM-CASHIER",
                Description: "Over-the-counter Payment",
                Amount: t.Amount,
                PaymentChannel: "CASH",
                Status: status
            ));
        }

        return Ok(list);
    }

    [HttpPost("cashier-ledger/disburse")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult DisburseCashierLedger([FromBody] DisburseLedgerRequest request)
    {
        return Ok(new { success = true, batchRef = $"DSB-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}" });
    }
}

public sealed record FinanceOverviewKpisDto(
    decimal TotalRevenueCollected,
    decimal OutstandingReceivables,
    int PendingClearanceApprovals,
    int ActiveScholarshipGrants,
    int RecentTransactionsCount,
    decimal TodayCashierCollection
);

public sealed record CashierLedgerEntryDto(
    string TransactionId,
    string Timestamp,
    string TerminalId,
    string Description,
    decimal Amount,
    string PaymentChannel,
    string Status
);

public sealed record DisburseLedgerRequest(string TerminalId);

