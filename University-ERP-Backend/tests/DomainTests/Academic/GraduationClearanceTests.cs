namespace DomainTests.Academic;

using Xunit;
using Moq;
using Registrar.Domain.Aggregates;
using Registrar.Application.Abstractions;
using Registrar.Application.Features.EvaluateGraduationClearance;
using System.Threading;
using System.Threading.Tasks;

public class GraduationClearanceTests
{
    [Fact]
    public async Task EvaluateGraduationClearance_ApprovesCandidate_WhenRequirementsAreMet()
    {
        // Arrange
        var clearance = GraduationClearance.Create("STU-9921", "BSCS");
        var mockRepo = new Mock<IRegistrarRepository>();
        mockRepo.Setup(r => r.GetClearanceByStudentIdAsync("STU-9921", It.IsAny<CancellationToken>()))
                .ReturnsAsync(clearance);

        var handler = new EvaluateGraduationClearanceCommandHandler(mockRepo.Object);
        var command = new EvaluateGraduationClearanceCommand("STU-9921", true, true, "All checks passed.");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Equal("Cleared_For_Graduation", clearance.Status);
    }
}
