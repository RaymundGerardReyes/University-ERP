namespace Payroll.Tests.Unit.Domain.Aggregates;

using Payroll.Domain.Aggregates;
using FluentAssertions;
using Xunit;
using System;

// Source under test: Payroll.Domain/Aggregates/Payslip.cs
public class PayslipTests
{
    [Fact]
    public void Should_Create_Valid_Payslip()
    {
        // Arrange
        var employeeId = Guid.NewGuid();
        var basic = 5000m;
        var allow = 1000m;
        var deduct = 500m;
        var period = "2026-08";

        // Act
        var result = Payslip.Generate(employeeId, basic, allow, deduct, period);

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.Should().NotBeNull();
        result.Value.EmployeeId.Should().Be(employeeId);
        result.Value.BasicSalary.Should().Be(basic);
        result.Value.Allowances.Should().Be(allow);
        result.Value.Deductions.Should().Be(deduct);
        result.Value.PayPeriod.Should().Be(period);
    }

    [Fact]
    public void Should_Calculate_NetPay_Correctly()
    {
        // Arrange
        var basic = 5000m;
        var allow = 1000m;
        var deduct = 500m; // Net = 5000 + 1000 - 500 = 5500

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), basic, allow, deduct, "2026-08");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.NetPay.Should().Be(5500m);
    }

    [Fact]
    public void Should_Calculate_NetPay_Correctly_With_Zero_Allowances_And_Deductions()
    {
        // Arrange
        var basic = 5000m;
        var allow = 0m;
        var deduct = 0m; 

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), basic, allow, deduct, "2026-08");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.NetPay.Should().Be(5000m);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1000)]
    public void Should_Reject_Creation_When_BasicSalary_Is_Zero_Or_Negative(decimal invalidSalary)
    {
        // Arrange & Act
        var result = Payslip.Generate(Guid.NewGuid(), invalidSalary, 0, 0, "2026-08");

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Payroll.InvalidSalary");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Should_Reject_Creation_When_PayPeriod_Is_Empty(string invalidPeriod)
    {
        // Arrange & Act
        var result = Payslip.Generate(Guid.NewGuid(), 5000m, 0, 0, invalidPeriod);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Payroll.InvalidPeriod");
    }

    [Fact]
    public void Should_Allow_Negative_NetPay_If_Deductions_Exceed_Earnings()
    {
        // Arrange
        var basic = 5000m;
        var allow = 0m;
        var deduct = 6000m; // Net = -1000

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), basic, allow, deduct, "2026-08");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.NetPay.Should().Be(-1000m);
    }

    [Fact]
    public void Should_Set_IssuedOnUtc_To_Current_Time()
    {
        // Arrange
        var before = DateTime.UtcNow;

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), 5000m, 0, 0, "2026-08");
        var after = DateTime.UtcNow;

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.IssuedOnUtc.Should().BeOnOrAfter(before).And.BeOnOrBefore(after);
    }

    [Fact]
    public void Should_Have_Unique_Id_For_Each_Payslip()
    {
        // Arrange
        var employeeId = Guid.NewGuid();

        // Act
        var p1 = Payslip.Generate(employeeId, 5000m, 0, 0, "2026-08").Value;
        var p2 = Payslip.Generate(employeeId, 5000m, 0, 0, "2026-08").Value;

        // Assert
        p1.Id.Should().NotBe(p2.Id);
    }

    [Fact]
    public void Should_Allow_Negative_Allowances()
    {
        // Arrange
        var basic = 5000m;
        var allow = -500m;
        var deduct = 0m; // Net = 4500

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), basic, allow, deduct, "2026-08");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.NetPay.Should().Be(4500m);
    }

    [Fact]
    public void Should_Allow_Negative_Deductions()
    {
        // Arrange
        var basic = 5000m;
        var allow = 0m;
        var deduct = -500m; // Net = 5500

        // Act
        var result = Payslip.Generate(Guid.NewGuid(), basic, allow, deduct, "2026-08");

        // Assert
        result.IsSuccess.Should().BeTrue();
        result.Value.NetPay.Should().Be(5500m);
    }
}
