namespace DomainTests.Payroll;

using Xunit;
using Payroll.Domain.Aggregates;
using System;
using System.Threading.Tasks;

public class PayrollCalculationTests
{
    [Fact]
    public async Task GeneratePayslip_CalculatesNetPayAccurately()
    {
        // Arrange
        var employeeId = Guid.NewGuid();
        decimal basicSalary = 5000.00m;
        decimal allowances = 500.00m;
        decimal deductions = 350.00m;
        string payPeriod = "2026-08";

        // Act
        var payslipResult = Payslip.Generate(employeeId, basicSalary, allowances, deductions, payPeriod);

        // Assert
        Assert.True(payslipResult.IsSuccess);
        var payslip = payslipResult.Value;
        Assert.Equal(5150.00m, payslip.NetPay); // (5000 + 500) - 350
    }
}
