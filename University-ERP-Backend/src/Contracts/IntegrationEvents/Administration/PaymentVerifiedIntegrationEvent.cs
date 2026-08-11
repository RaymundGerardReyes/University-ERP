namespace Contracts.IntegrationEvents.Administration;

using System;
using SharedKernel.Domain.Primitives;

/// <summary>
/// Published when the Finance module successfully verifies and processes a payment (e.g. from the Payment Gateway or Cashier).
/// Other modules (like Admissions or Registrar) listen to this to continue their workflows.
/// </summary>
public record PaymentVerifiedIntegrationEvent(
    Guid EventId,
    DateTime OccurredOnUtc,
    Guid ApplicantId,
    string InvoiceId,
    decimal AmountPaid,
    string Currency,
    string PaymentReference,
    DateTime VerifiedAtUtc
) : IDomainEvent;
