namespace Finance.Tests.Unit.Application;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.PaymentSessions;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class GenerateDynamicQRCommandHandlerTests
{
    private readonly Mock<IPaymentSessionRepository> _sessionRepositoryMock = new();
    private readonly Mock<IPaymentGatewayService> _gatewayMock = new();

    [Fact]
    public async Task Handle_WhenSessionDoesNotExist_ReturnsNotFound()
    {
        // Arrange (HQ-01)
        _sessionRepositoryMock
            .Setup(r => r.GetBySessionIdAsync("NON-EXISTENT", It.IsAny<CancellationToken>()))
            .ReturnsAsync((PaymentSession?)null);

        var handler = new GenerateDynamicQRCommandHandler(_sessionRepositoryMock.Object, _gatewayMock.Object);
        var command = new GenerateDynamicQRCommand("NON-EXISTENT");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.NotFound");
    }

    [Fact]
    public async Task Handle_WhenSessionIsInInvalidState_ReturnsInvalidState()
    {
        // Arrange (HQ-02)
        var session = PaymentSession.Create("INV-01", "APP-01", 500m, "Fee").Value;
        session.InitiatePayment("txn-ref", "paynamics");
        session.ConfirmPayment("txn-ref"); // Now "Paid"

        _sessionRepositoryMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        var handler = new GenerateDynamicQRCommandHandler(_sessionRepositoryMock.Object, _gatewayMock.Object);
        var command = new GenerateDynamicQRCommand(session.SessionId);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.InvalidState");
    }

    [Fact]
    public async Task Handle_WhenGatewayServiceFails_ReturnsFailure()
    {
        // Arrange (HQ-04)
        var session = PaymentSession.Create("INV-01", "APP-01", 500m, "Fee").Value;

        _sessionRepositoryMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        _gatewayMock
            .Setup(g => g.GeneratePaymentInstrumentAsync(session.SessionId, session.Amount, session.Currency, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.PaymentGatewayError", "Failed to generate QR")));

        var handler = new GenerateDynamicQRCommandHandler(_sessionRepositoryMock.Object, _gatewayMock.Object);
        var command = new GenerateDynamicQRCommand(session.SessionId);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.PaymentGatewayError");
    }

    [Fact]
    public async Task Handle_WhenSessionIsAwaitingPaymentAndGatewaySucceeds_ReturnsSuccessWithQR()
    {
        // Arrange (HQ-03)
        var session = PaymentSession.Create("INV-01", "APP-01", 500m, "Fee").Value;
        var qrPhPayload = "00020101021226540014PH.NOVAPAY.DYN...";

        _sessionRepositoryMock
            .Setup(r => r.GetBySessionIdAsync(session.SessionId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(session);

        _gatewayMock
            .Setup(g => g.GeneratePaymentInstrumentAsync(session.SessionId, session.Amount, session.Currency, It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success(qrPhPayload));

        var handler = new GenerateDynamicQRCommandHandler(_sessionRepositoryMock.Object, _gatewayMock.Object);
        var command = new GenerateDynamicQRCommand(session.SessionId);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be(qrPhPayload);
        _sessionRepositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
