namespace IdentityAccess.Tests.Unit.Domain.Aggregates;

using IdentityAccess.Domain.Aggregates;
using SharedKernel.Domain.Primitives;
using FluentAssertions;
using Xunit;
using System;

// Source under test: IdentityAccess.Domain/Aggregates/User.cs
public class UserTests
{
    [Fact]
    public void Should_Create_Valid_User_When_All_Required_Fields_Provided()
    {
        // Arrange
        var email = "test@university.edu";
        var firstName = "John";
        var lastName = "Doe";
        var passwordHash = "hashed_password_123";

        // Act
        var result = User.Register(email, firstName, lastName, passwordHash);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.Email.Should().Be(email);
        result.Value.FirstName.Should().Be(firstName);
        result.Value.LastName.Should().Be(lastName);
        result.Value.PasswordHash.Should().Be(passwordHash);
        result.Value.IsActive.Should().BeTrue();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    [InlineData(null)]
    public void Should_Reject_User_Creation_When_Email_Is_Empty(string invalidEmail)
    {
        // Arrange
        var firstName = "John";
        var lastName = "Doe";
        var passwordHash = "hashed_password_123";

        // Act
        var result = User.Register(invalidEmail, firstName, lastName, passwordHash);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("User.InvalidEmail");
    }

    [Fact]
    public void Should_Reject_User_Creation_When_PasswordHash_Is_Empty()
    {
        // Arrange
        var email = "test@university.edu";
        var firstName = "John";
        var lastName = "Doe";
        var invalidPasswordHash = "";

        // Act
        var result = User.Register(email, firstName, lastName, invalidPasswordHash);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("User.InvalidPassword");
    }

    [Fact]
    public void Should_Deactivate_User_Successfully()
    {
        // Arrange
        var user = User.Register("test@university.edu", "John", "Doe", "hash").Value;

        // Act
        user.Deactivate();

        // Assert
        user.IsActive.Should().BeFalse();
    }
}
