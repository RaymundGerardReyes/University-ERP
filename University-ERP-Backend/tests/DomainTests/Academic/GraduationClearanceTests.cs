namespace UniversityErp.Tests.Domain;

using Xunit;
using FluentAssertions;
using Registrar.Application.Features.EvaluateGraduationClearance;
using System;
using System.Threading;
using System.Threading.Tasks;

public class GraduationClearanceTests
{
    [Fact]
    public async Task EvaluateGraduationClearance_ApprovesCandidate_WhenRequirementsAreMet()
    {
        // Arrange
        var handler = new EvaluateGraduationClearanceCommandHandler();
        var command = new EvaluateGraduationClearanceCommand(Guid.NewGuid(), true, true);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().Be("Cleared_For_Graduation");
    }

    [Fact]
    public async Task EvaluateGraduationClearance_RejectsCandidate_WhenBalanceIsNotZero()
    {
        // Arrange
        var handler = new EvaluateGraduationClearanceCommandHandler();
        var command = new EvaluateGraduationClearanceCommand(Guid.NewGuid(), true, false);

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
    }
}
