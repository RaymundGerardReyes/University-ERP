namespace Finance.Tests.Unit.Application;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.ClearBalance;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class ClearBalanceCommandHandlerTests
{
    private readonly Mock<IStudentBillingRepository> _repositoryMock;
    private readonly ClearBalanceCommandHandler _handler;
    private readonly StudentBilling _validBilling;

    public ClearBalanceCommandHandlerTests()
    {
        _repositoryMock = new Mock<IStudentBillingRepository>();
        _handler = new ClearBalanceCommandHandler(_repositoryMock.Object);
        _validBilling = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;
    }

    [Fact]
    public async Task ClearBalance_Should_Return_Success_When_Fully_Paid()
    {
        _validBilling.ProcessPayment(1000m); // Advance state to Fully Paid
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ClearBalanceCommand(_validBilling.StudentId);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _validBilling.Status.Should().Be("Cleared");
        _repositoryMock.Verify(r => r.UpdateAsync(_validBilling, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ClearBalance_Should_Return_Failure_When_Invoice_Not_Found()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentBilling?)null);
        var command = new ClearBalanceCommand(Guid.NewGuid());

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.NotFound");
    }

    [Fact]
    public async Task ClearBalance_Should_Return_Failure_When_Outstanding_Debt_Exists()
    {
        _validBilling.ProcessPayment(500m); // Advance state to partially paid
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ClearBalanceCommand(_validBilling.StudentId);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.BalanceRemaining");
    }
}
