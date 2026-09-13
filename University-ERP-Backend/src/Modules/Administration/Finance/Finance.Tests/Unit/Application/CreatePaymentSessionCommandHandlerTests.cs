namespace Finance.Tests.Unit.Application;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.PaymentSessions;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Microsoft.Extensions.Options;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class CreatePaymentSessionCommandHandlerTests
{
    private readonly Mock<IPaymentSessionRepository> _repositoryMock = new();
    private readonly Mock<IPaymentGatewayService> _gatewayMock = new();
    private readonly IOptions<PaymentGatewayOptions> _options = Options.Create(new PaymentGatewayOptions
    {
        SuccessUrl = "https://erp.university.edu/success",
        CancelUrl = "https://erp.university.edu/cancel"
    });

    [Fact]
    public async Task Handle_WhenAmountIsZeroOrNegative_ReturnsDomainFailure()
    {
        // Arrange (HC-01)
        var handler = new CreatePaymentSessionCommandHandler(_repositoryMock.Object, _gatewayMock.Object, _options);
        var command = new CreatePaymentSessionCommand("INV-001", "APP-001", 0m, "Tuition");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("PaymentSession.InvalidAmount");
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<PaymentSession>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenGatewayServiceFails_ReturnsFailureWithoutPersisting()
    {
        // Arrange (HC-02)
        _gatewayMock
            .Setup(g => g.CreateCheckoutSessionAsync(It.IsAny<string>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Gateway.Rejected", "Card declined by processor")));

        var handler = new CreatePaymentSessionCommandHandler(_repositoryMock.Object, _gatewayMock.Object, _options);
        var command = new CreatePaymentSessionCommand("INV-001", "APP-001", 1500m, "Tuition");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Gateway.Rejected");
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<PaymentSession>(), It.IsAny<CancellationToken>()), Times.Never);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task Handle_WhenGatewayServiceSucceeds_PersistsSessionAndReturnsResponse()
    {
        // Arrange (HC-03)
        var expectedCheckoutUrl = "https://novabank.internal/checkout/sess-123";
        _gatewayMock
            .Setup(g => g.CreateCheckoutSessionAsync(It.IsAny<string>(), It.IsAny<decimal>(), It.IsAny<string>(), It.IsAny<string?>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success(expectedCheckoutUrl));

        var handler = new CreatePaymentSessionCommandHandler(_repositoryMock.Object, _gatewayMock.Object, _options);
        var command = new CreatePaymentSessionCommand("INV-001", "APP-001", 1500m, "Tuition", "idem-key-1");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.CheckoutUrl.Should().Be(expectedCheckoutUrl);
        result.Value.SessionId.Should().NotBeNullOrWhiteSpace();

        _repositoryMock.Verify(r => r.AddAsync(It.Is<PaymentSession>(s => s.Amount == 1500m && s.InvoiceId == "INV-001"), It.IsAny<CancellationToken>()), Times.Once);
        _repositoryMock.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
