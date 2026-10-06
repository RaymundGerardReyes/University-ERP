namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using Examination.Application.Features.PublishExamResult;
using System;
using System.Threading;
using System.Threading.Tasks;

public class ExamResultEventTests
{
    [Fact]
    public async Task PublishExamResult_ExecutesCommandSuccessfully()
    {
        // Arrange
        var handler = new PublishExamResultCommandHandler();
        var command = new PublishExamResultCommand(
            Guid.NewGuid(), Guid.NewGuid(), "CS-101", 95.5m, "A");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
    }
}
