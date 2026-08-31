namespace Finance.Tests.Unit.Application;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.ProcessPayment;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class ProcessPaymentCommandHandlerTests
{
    private readonly Mock<IStudentBillingRepository> _repositoryMock;
    private readonly ProcessPaymentCommandHandler _handler;
    private readonly StudentBilling _validBilling;

    public ProcessPaymentCommandHandlerTests()
    {
        _repositoryMock = new Mock<IStudentBillingRepository>();
        _handler = new ProcessPaymentCommandHandler(_repositoryMock.Object);
        _validBilling = StudentBilling.IssueInvoice(Guid.NewGuid(), 1000m, "Tuition").Value;
    }

    [Fact]
    public async Task ProcessPayment_Should_Return_Success_And_Update_Status_To_PartiallyPaid()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ProcessPaymentCommand(_validBilling.StudentId, 500m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _validBilling.Status.Should().Be("PartiallyPaid");
        _repositoryMock.Verify(r => r.UpdateAsync(_validBilling, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayment_Should_Return_Success_And_Update_Status_To_FullyPaid()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ProcessPaymentCommand(_validBilling.StudentId, 1000m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _validBilling.Status.Should().Be("FullyPaid");
        _repositoryMock.Verify(r => r.UpdateAsync(_validBilling, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ProcessPayment_Should_Return_Failure_When_Invoice_Not_Found_In_Repository()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentBilling?)null);
        var command = new ProcessPaymentCommand(Guid.NewGuid(), 500m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.NotFound");
    }

    [Fact]
    public async Task ProcessPayment_Should_Return_Failure_When_Amount_Is_Zero()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ProcessPaymentCommand(_validBilling.StudentId, 0m);

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidPayment");
    }
}
