namespace Finance.Tests.Unit.Application;

using System;
using System.Threading;
using System.Threading.Tasks;
using Finance.Application.Abstractions;
using Finance.Application.Features.IssueInvoice;
using Finance.Domain.Aggregates;
using FluentAssertions;
using Moq;
using Xunit;

public class IssueInvoiceCommandHandlerTests
{
    private readonly Mock<IStudentBillingRepository> _repositoryMock;
    private readonly IssueInvoiceCommandHandler _handler;

    public IssueInvoiceCommandHandlerTests()
    {
        _repositoryMock = new Mock<IStudentBillingRepository>();
        _handler = new IssueInvoiceCommandHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task IssueInvoice_Should_Return_Success_And_Call_Repository_AddAsync_When_Valid()
    {
        var command = new IssueInvoiceCommand(Guid.NewGuid(), 1500m, "Fall Semester Tuition");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsSuccess.Should().BeTrue();
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<StudentBilling>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task IssueInvoice_Should_Return_Failure_When_Domain_Validation_Fails()
    {
        // Negative amount violates the domain invariant
        var command = new IssueInvoiceCommand(Guid.NewGuid(), -500m, "Invalid Invoice");

        var result = await _handler.Handle(command, CancellationToken.None);

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Finance.InvalidAmount");
        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<StudentBilling>(), It.IsAny<CancellationToken>()), Times.Never);
    }
}
