namespace DomainTests.Academic;

using Xunit;
using Moq;
using MediatR;
using Examination.Application.Features.PublishExamResult;
using Examination.Application.Abstractions;
using Contracts.IntegrationEvents.Academic;
using System;
using System.Threading;
using System.Threading.Tasks;

public class ExamResultEventTests
{
    [Fact]
    public async Task PublishExamResult_DispatchesIntegrationEvent()
    {
        // Arrange
        var mockRepo = new Mock<IExaminationRepository>();
        var mockPublisher = new Mock<IPublisher>();
        var handler = new PublishExamResultCommandHandler(mockRepo.Object, mockPublisher.Object);
        
        var command = new PublishExamResultCommand("EXAM-501", "CS-101");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        mockPublisher.Verify(
            p => p.Publish(
                It.Is<ExamResultPublishedIntegrationEvent>(e => e.CourseCode == "CS-101"), 
                It.IsAny<CancellationToken>()
            ),
            Times.Once
        );
    }
}
