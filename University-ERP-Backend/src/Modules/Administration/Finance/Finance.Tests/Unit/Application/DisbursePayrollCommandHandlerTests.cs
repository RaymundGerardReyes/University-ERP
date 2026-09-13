namespace Finance.Tests.Unit.Application;

using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.PayrollProcessing;
using FluentAssertions;
using Moq;
using SharedKernel.Domain.Primitives;
using Xunit;

public class DisbursePayrollCommandHandlerTests
{
    private readonly Mock<IPaymentGatewayService> _gatewayMock = new();

    [Fact]
    public async Task Handle_WhenBankingServiceFails_ReturnsFailure()
    {
        // Arrange (HD-02)
        _gatewayMock
            .Setup(g => g.ExecuteTransferAsync("4859220099990001", 15000m, It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Failure(new Error("Finance.BankingError", "Insufficient funds")));

        var handler = new DisbursePayrollCommandHandler(_gatewayMock.Object);
        var command = new DisbursePayrollCommand("EMP-101", "4859220099990001", 15000m, "Aug 2026");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BankingError");
        result.Error.Description.Should().Contain("Insufficient funds");
    }

    [Fact]
    public async Task Handle_WhenBankingServiceSucceeds_ReturnsTransactionId()
    {
        // Arrange (HD-01)
        _gatewayMock
            .Setup(g => g.ExecuteTransferAsync("4859220099990001", 15000m, It.IsAny<string>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(Result<string>.Success("TX-TRF-SUCCESS-001"));

        var handler = new DisbursePayrollCommandHandler(_gatewayMock.Object);
        var command = new DisbursePayrollCommand("EMP-101", "4859220099990001", 15000m, "Aug 2026");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("TX-TRF-SUCCESS-001");
    }
}

