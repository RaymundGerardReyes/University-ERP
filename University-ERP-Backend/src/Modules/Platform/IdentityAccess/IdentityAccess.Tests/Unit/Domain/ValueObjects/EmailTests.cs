namespace IdentityAccess.Tests.Unit.Domain.ValueObjects;

using IdentityAccess.Domain.ValueObjects;
using SharedKernel.Domain.Primitives;
using FluentAssertions;
using Xunit;

// Source under test: IdentityAccess.Domain/ValueObjects/Email.cs
public class EmailTests
{
    [Theory]
    [InlineData("test@university.edu", "test@university.edu")]
    [InlineData(" TEST@university.edu ", "test@university.edu")]
    [InlineData("Student.Name@domain.com", "student.name@domain.com")]
    public void Should_Create_Valid_Email_And_Normalize_Format(string input, string expected)
    {
        // Arrange & Act
        var result = Email.Create(input);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Value.Should().Be(expected);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Should_Reject_Creation_When_Email_Is_Empty(string invalidInput)
    {
        // Arrange & Act
        var result = Email.Create(invalidInput);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Email.Empty");
    }

    [Theory]
    [InlineData("invalidemail.com")]
    [InlineData("test@domain")]
    [InlineData("no-at-sign-domain.edu")]
    public void Should_Reject_Creation_When_Email_Format_Is_Invalid(string invalidInput)
    {
        // Arrange & Act
        var result = Email.Create(invalidInput);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Email.InvalidFormat");
    }

    [Fact]
    public void Should_Consider_Two_Emails_With_Same_Value_Equal()
    {
        // Arrange
        var email1 = Email.Create("test@university.edu").Value;
        var email2 = Email.Create("TEST@UNIVERSITY.EDU").Value;

        // Act
        bool areEqual = email1 == email2;
        bool equalsMethod = email1.Equals(email2);

        // Assert
        areEqual.Should().BeTrue();
        equalsMethod.Should().BeTrue();
    }
}
