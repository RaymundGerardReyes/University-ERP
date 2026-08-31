namespace IdentityAccess.Tests.Unit.Domain.ValueObjects;

using IdentityAccess.Domain.ValueObjects;
using SharedKernel.Domain.Primitives;
using FluentAssertions;
using Xunit;

// Source under test: IdentityAccess.Domain/ValueObjects/PersonName.cs
public class PersonNameTests
{
    [Fact]
    public void Should_Create_Valid_PersonName_And_Format_FullName()
    {
        // Arrange
        var firstName = "  John  ";
        var lastName = " Doe ";

        // Act
        var result = PersonName.Create(firstName, lastName);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.FirstName.Should().Be("John");
        result.Value.LastName.Should().Be("Doe");
        result.Value.FullName.Should().Be("John Doe");
    }

    [Theory]
    [InlineData("", "Doe", "PersonName.FirstNameEmpty")]
    [InlineData("John", "", "PersonName.LastNameEmpty")]
    public void Should_Reject_Creation_When_Fields_Are_Empty(string firstName, string lastName, string expectedErrorCode)
    {
        // Arrange & Act
        var result = PersonName.Create(firstName, lastName);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be(expectedErrorCode);
    }
}
