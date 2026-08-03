namespace Contracts.PublicApiContracts.Administration;

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

/// <summary>
/// Open Host Service contract exposed by the Finance Bounded Context.
/// Used by Student Portal and internal admin services to synchronously query billing information.
/// </summary>
public interface IFinanceBillingApi
{
    /// <summary>
    /// Retrieves the outstanding balance for a specific student.
    /// </summary>
    Task<decimal> GetOutstandingBalanceAsync(Guid studentId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves the billing history for a specific student.
    /// </summary>
    Task<IReadOnlyCollection<InvoiceSummaryDto>> GetBillingHistoryAsync(Guid studentId, CancellationToken cancellationToken = default);
}

public sealed record InvoiceSummaryDto(
    Guid InvoiceId,
    DateTime IssueDate,
    decimal TotalAmount,
    decimal AmountPaid,
    string Status
);
