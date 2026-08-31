namespace Finance.Tests.Unit.Application;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.ApplyScholarship;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class ApplyScholarshipCommandHandlerTests
{
    private readonly Mock<IStudentBillingRepository> _repositoryMock;
    private readonly ApplyScholarshipCommandHandler _handler;
    private readonly StudentBilling _validBilling;

    public ApplyScholarshipCommandHandlerTests()
    {
        _repositoryMock = new Mock<IStudentBillingRepository>();
        _handler = new ApplyScholarshipCommandHandler(_repositoryMock.Object);
        _validBilling = StudentBilling.IssueInvoice(Guid.NewGuid(), 2000m, "Tuition").Value;
    }

    [Fact]
    public async Task ApplyScholarship_Should_Return_Success_And_Reduce_TotalAmount()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ApplyScholarshipCommand(_validBilling.StudentId, 500m, "Academic Grant");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _validBilling.TotalAmount.Should().Be(1500m);
        _repositoryMock.Verify(r => r.UpdateAsync(_validBilling, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ApplyScholarship_Should_Return_Failure_When_Invoice_Not_Found()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((StudentBilling?)null);
        var command = new ApplyScholarshipCommand(Guid.NewGuid(), 500m, "Grant");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.NotFound");
    }

    [Fact]
    public async Task ApplyScholarship_Should_Return_Failure_When_Deduction_Exceeds_Balance()
    {
        _repositoryMock.Setup(r => r.GetByStudentIdAsync(_validBilling.StudentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(_validBilling);
        var command = new ApplyScholarshipCommand(_validBilling.StudentId, 2500m, "Full Ride");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidDeduction");
    }
}
