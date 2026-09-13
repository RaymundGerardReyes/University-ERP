namespace Finance.Presentation.Endpoints;

using Finance.Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

[ApiController]
[Route("api/v1/finance/cashier")]
public sealed class CashierQueueEndpoint : ControllerBase
{
    private readonly ICashTransactionRepository _cashTransactionRepository;
    private readonly IPaymentSessionRepository _paymentSessionRepository;
    private readonly IPaymentGatewayService _paymentGatewayService;

    public CashierQueueEndpoint(
        ICashTransactionRepository cashTransactionRepository,
        IPaymentSessionRepository paymentSessionRepository,
        IPaymentGatewayService paymentGatewayService)
    {
        _cashTransactionRepository = cashTransactionRepository;
        _paymentSessionRepository = paymentSessionRepository;
        _paymentGatewayService = paymentGatewayService;
    }

    [HttpGet("queue")]
    [ProducesResponseType(typeof(IEnumerable<CashierTransactionItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetQueue(CancellationToken cancellationToken)
    {
        var cashTxns = await _cashTransactionRepository.GetAllAsync(cancellationToken);
        var sessions = await _paymentSessionRepository.GetAllAsync(cancellationToken);

        var list = new List<CashierTransactionItemDto>();

        foreach (var txn in cashTxns)
        {
            list.Add(new CashierTransactionItemDto(
                TransactionToken: txn.TransactionToken,
                ReferenceId: txn.ReferenceId,
                PayerName: txn.ReferenceId,
                Purpose: "Over-the-counter Cash Payment",
                Amount: txn.Amount,
                Status: txn.Status.ToUpperInvariant(),
                IssuedAt: txn.CreatedOnUtc.ToString("o"),
                CompletedAt: txn.CompletedOnUtc?.ToString("o"),
                CashierId: "CASHIER-MAIN",
                TransactionId: txn.TransactionToken,
                StudentName: txn.ReferenceId,
                Description: "Over-the-counter Cash Payment",
                QueuedAtUtc: txn.CreatedOnUtc.ToString("o")
            ));
        }

        foreach (var s in sessions)
        {
            var status = (s.Status == "Paid" || s.Status == "Completed") ? "COMPLETED" : "PENDING";
            list.Add(new CashierTransactionItemDto(
                TransactionToken: s.SessionId,
                ReferenceId: s.ApplicantId,
                PayerName: s.ApplicantId,
                Purpose: s.Purpose,
                Amount: s.Amount,
                Status: status,
                IssuedAt: s.CreatedAtUtc.ToString("o"),
                CompletedAt: s.ConsumedAtUtc?.ToString("o"),
                CashierId: "GATEWAY-ONLINE",
                TransactionId: s.SessionId,
                StudentName: s.ApplicantId,
                Description: s.Purpose,
                QueuedAtUtc: s.CreatedAtUtc.ToString("o")
            ));
        }

        return Ok(list);
    }

    [HttpPost("process")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ProcessPayment([FromBody] ProcessCashierPaymentRequest request, CancellationToken cancellationToken)
    {
        var targetToken = !string.IsNullOrWhiteSpace(request.TransactionToken) 
            ? request.TransactionToken 
            : request.ReferenceId;

        if (!string.IsNullOrWhiteSpace(targetToken))
        {
            var cashTxn = await _cashTransactionRepository.GetByTokenAsync(targetToken, cancellationToken);
            if (cashTxn != null)
            {
                var depositResult = await _paymentGatewayService.ProcessCashDepositAsync(cashTxn.Amount, targetToken, cancellationToken);
                if (depositResult.IsFailure)
                {
                    return BadRequest(new { success = false, message = depositResult.Error.Description });
                }

                cashTxn.Complete();
                await _cashTransactionRepository.SaveChangesAsync(cancellationToken);
                return Ok(new { success = true, transactionId = depositResult.Value, status = "COMPLETED" });
            }

            var session = await _paymentSessionRepository.GetBySessionIdAsync(targetToken, cancellationToken);
            if (session != null)
            {
                var depositResult = await _paymentGatewayService.ProcessCashDepositAsync(session.Amount, targetToken, cancellationToken);
                if (depositResult.IsFailure)
                {
                    return BadRequest(new { success = false, message = depositResult.Error.Description });
                }

                session.Reconcile("CASHIER-MAIN", request.Remarks ?? "Paid at cashier terminal");
                await _paymentSessionRepository.SaveChangesAsync(cancellationToken);
                return Ok(new { success = true, transactionId = depositResult.Value, status = "COMPLETED" });
            }
        }

        var fallbackDepositResult = await _paymentGatewayService.ProcessCashDepositAsync(request.Amount, targetToken ?? "UNKNOWN", cancellationToken);
        if (fallbackDepositResult.IsFailure)
        {
            return BadRequest(new { success = false, message = fallbackDepositResult.Error.Description });
        }

        return Ok(new { success = true, transactionId = fallbackDepositResult.Value, status = "COMPLETED" });
    }
}

public sealed record CashierTransactionItemDto(
    string TransactionToken,
    string ReferenceId,
    string PayerName,
    string Purpose,
    decimal Amount,
    string Status,
    string IssuedAt,
    string? CompletedAt = null,
    string? CashierId = null,
    string? TransactionId = null,
    string? StudentName = null,
    string? Description = null,
    string? QueuedAtUtc = null
);

public sealed record ProcessCashierPaymentRequest(
    string ReferenceId, 
    decimal Amount, 
    string? Remarks = null,
    string? TransactionToken = null
);

