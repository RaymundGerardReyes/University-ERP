namespace DomainTests.IdentityAccess;

using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using IdentityAccess.Application.Features.RegisterUser;
using IdentityAccess.Application.Abstractions;
using IdentityAccess.Domain.Aggregates;
using System.Threading;
using System.Threading.Tasks;

public class UserRegistrationTests
{
    [Fact]
    public async Task RegisterUser_HashesPasswordAndPersists_WhenEmailIsUnique()
    {
        // Arrange
        var mockRepo = new Mock<IUserRepository>();
        mockRepo.Setup(r => r.ExistsWithEmailAsync("test@university.edu", It.IsAny<CancellationToken>()))
                .ReturnsAsync(false);

        var mockLogger = new Mock<ILogger<RegisterUserCommandHandler>>();
        var handler = new RegisterUserCommandHandler(mockLogger.Object, mockRepo.Object);
        var command = new RegisterUserCommand("test@university.edu", "John", "Doe", "SecurePassword123!");

        // Act
        var result = await handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.True(result.IsSuccess);
        mockRepo.Verify(r => r.AddAsync(It.Is<User>(u => u.Email == "test@university.edu" && !string.IsNullOrEmpty(u.PasswordHash)), It.IsAny<CancellationToken>()), Times.Once);
        mockRepo.Verify(r => r.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
