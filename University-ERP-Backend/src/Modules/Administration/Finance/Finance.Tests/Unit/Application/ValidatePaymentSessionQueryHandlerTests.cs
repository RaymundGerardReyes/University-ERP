// Test Type: Unit Testing
//
// Source References:
// University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/Features/PaymentSessions/ValidatePaymentSessionQuery.cs
// University-ERP-Backend/src/Modules/Administration/Finance/Finance.Application/ModuleRegistration.cs

namespace Finance.Tests.Unit.Application;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.PaymentSessions;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class ValidatePaymentSessionQueryHandlerTests
{
    private readonly Mock<IPaymentSessionRepository> _repositoryMock = new();

    [Fact]
    public async Task Handle_WhenSessionDoesNotExist_ReturnsNotFoundFailure()
    {
        _repositoryMock
            .Setup(r => r.GetBySessionIdAsync("NONEXISTENT", It.IsAny<CancellationToken>()))
            .ReturnsAsync((PaymentSession?)null);

        var handler = new ValidatePaymentSessionQueryHandler(_repositoryMock.Object);
        var query = new ValidatePaymentSessionQuery("NONEXISTENT");

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.NotFound");
    }

    [Fact]
    public async Task Handle_WhenSessionIsAwaitingPayment_ReturnsDtoWithAwaitingPaymentStatus()
    {
        var session = PaymentSession.Create("INV-001", "APP-100", 500m, "Application Fee").Value;
        _repositoryMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        var handler = new ValidatePaymentSessionQueryHandler(_repositoryMock.Object);
        var query = new ValidatePaymentSessionQuery(session.SessionId);

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.SessionId.Should().Be(session.SessionId);
        result.Value.Status.Should().Be("AwaitingPayment");
        result.Value.Amount.Should().Be(500m);
    }

    [Fact]
    public async Task Handle_WhenSessionIsAlreadyPaid_ReturnsSuccessWithPaidStatus()
    {
        var session = PaymentSession.Create("INV-002", "APP-200", 1500m, "Enrollment Downpayment").Value;
        session.InitiatePayment("IDEM-001", "GW-TXN-001");
        session.ConfirmPayment("BANK-REF-999");

        _repositoryMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        var handler = new ValidatePaymentSessionQueryHandler(_repositoryMock.Object);
        var query = new ValidatePaymentSessionQuery(session.SessionId);

        var result = await handler.Handle(query, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        result.Value.SessionId.Should().Be(session.SessionId);
        result.Value.Status.Should().Be("Paid");
        result.Value.Amount.Should().Be(1500m);
    }
}
