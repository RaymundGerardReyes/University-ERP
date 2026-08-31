namespace Finance.Tests.Unit.Domain.Aggregates;

using System;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Xunit;

public class PaymentSessionTests
{
    // 23. PaymentSession_Should_Create_Valid_Session_With_Expiration_Time
    [Fact]
    public void Should_Create_Valid_Session_With_Expiration_Time()
    {
        var result = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition");

        result.IsSuccess.Should().BeTrue();
        result.Value.Status.Should().Be("AwaitingPayment");
        result.Value.Currency.Should().Be("PHP");
        result.Value.ExpiresAtUtc.Should().BeAfter(result.Value.CreatedAtUtc);
    }

    // 24. PaymentSession_Should_Reject_Creation_When_Amount_Is_Zero
    [Fact]
    public void Should_Reject_Creation_When_Amount_Is_Zero()
    {
        var result = PaymentSession.Create("INV-001", "APP-123", 0m, "Tuition");

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.InvalidAmount");
    }

    // 25. PaymentSession_Should_Successfully_Authorize_And_Capture
    [Fact]
    public void Should_Successfully_Authorize_And_Capture()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;
        
        session.InitiatePayment("IDEM-123", "GW-999");
        var result = session.ConfirmPayment("BANK-REF-777");

        result.IsSuccess.Should().BeTrue();
        session.Status.Should().Be("Paid");
        session.BankReference.Should().Be("BANK-REF-777");
    }

    // 26. PaymentSession_Should_Reject_Capture_When_Not_Authorized
    [Fact]
    public void Should_Reject_Capture_When_Not_Authorized()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;
        session.Expire(); // Simulate an invalid state prior to capture

        var result = session.ConfirmPayment("BANK-REF-777");

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.InvalidState");
    }

    // 27. PaymentSession_Should_Successfully_Expire_When_Time_Passes
    [Fact]
    public void Should_Successfully_Expire_When_Time_Passes()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;

        var result = session.Expire();

        result.IsSuccess.Should().BeTrue();
        session.Status.Should().Be("Expired");
    }

    // 28. PaymentSession_Should_Reject_Authorization_When_Already_Expired
    [Fact]
    public void Should_Reject_Authorization_When_Already_Expired()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;
        session.Expire();

        var result = session.InitiatePayment("IDEM-123", "GW-999");

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.Expired");
    }

    // 29. PaymentSession_Should_Record_Gateway_Reference_Id_On_Capture
    [Fact]
    public void Should_Record_Gateway_Reference_Id_On_Capture()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;

        session.InitiatePayment("IDEM-123", "GW-999");

        session.GatewayTransactionId.Should().Be("GW-999");
        session.IdempotencyKey.Should().Be("IDEM-123");
    }

    // 30. PaymentSession_Should_Reject_Duplicate_Capture_Attempts
    [Fact]
    public void Should_Reject_Duplicate_Capture_Attempts()
    {
        var session = PaymentSession.Create("INV-001", "APP-123", 1000m, "Tuition").Value;
        session.InitiatePayment("IDEM-123", "GW-999");
        session.ConfirmPayment("BANK-REF-777"); // First capture

        var duplicateResult = session.ConfirmPayment("BANK-REF-888"); // Second capture

        duplicateResult.IsFailure.Should().BeTrue();
        duplicateResult.Error.Code.Should().Be("PaymentSession.DuplicateConfirmation");
    }
}
