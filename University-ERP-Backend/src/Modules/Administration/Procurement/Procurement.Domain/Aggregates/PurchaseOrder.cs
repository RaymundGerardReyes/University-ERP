namespace Procurement.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;
using System.Collections.Generic;

public sealed class PurchaseOrder : AggregateRoot<Guid>
{
    public string VendorId { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public decimal TotalAmount { get; private set; }
    public DateTime RequestedOnUtc { get; private set; }

    private PurchaseOrder() { }

    private PurchaseOrder(Guid id, string vendorId, decimal totalAmount) : base(id)
    {
        VendorId = vendorId;
        TotalAmount = totalAmount;
        Status = "PendingApproval";
        RequestedOnUtc = DateTime.UtcNow;
    }

    public static Result<PurchaseOrder> Create(string vendorId, decimal totalAmount)
    {
        if (string.IsNullOrWhiteSpace(vendorId))
        {
            return Result<PurchaseOrder>.Failure(new Error("Procurement.InvalidVendor", "Vendor ID is required."));
        }

        if (totalAmount <= 0)
        {
            return Result<PurchaseOrder>.Failure(new Error("Procurement.InvalidAmount", "Order amount must be greater than zero."));
        }

        return Result<PurchaseOrder>.Success(new PurchaseOrder(Guid.NewGuid(), vendorId, totalAmount));
    }
}
