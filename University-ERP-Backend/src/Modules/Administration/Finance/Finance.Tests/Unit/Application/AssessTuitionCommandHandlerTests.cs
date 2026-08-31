namespace Finance.Tests.Unit.Application;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.AssessTuition;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class AssessTuitionCommandHandlerTests
{
    private readonly Mock<IStudentBillingRepository> _repositoryMock;
    private readonly AssessTuitionCommandHandler _handler;
    private readonly StudentBilling _validBilling;

    public AssessTuitionCommandHandlerTests()
    {
        _repositoryMock = new Mock<IStudentBillingRepository>();
        _handler = new AssessTuitionCommandHandler(_repositoryMock.Object);
        _validBilling = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Initial Tuition").Value;
    }

    [Fact]
    public async Task AssessTuition_Should_Return_Success_And_Increase_TotalAmount()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new AssessTuitionCommand(_validBilling.StudentId, 300m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _validBilling.TotalAmount.Should().Be(1300m);
        _repositoryMock.Verify(r => r.UpdateAsync(_validBilling, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task AssessTuition_Should_Return_Failure_When_Invoice_Is_Already_Cleared()
    {
        _validBilling.ProcessPayment(1000m);
        _validBilling.ClearBalance();
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new AssessTuitionCommand(_validBilling.StudentId, 300m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.AlreadyCleared");
    }

    [Fact]
    public async Task AssessTuition_Should_Return_Failure_When_Invoice_Not_Found()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentBilling?)null);
        var command = new AssessTuitionCommand(Guid.NewGuid(), 300m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.NotFound");
    }
}
