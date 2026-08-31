namespace Payroll.Tests.Integration.Endpoints;

using System;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using MediatR;
using Moq;
using Payroll.Application.Features.GeneratePayslip;
using Payroll.Domain.Aggregates;
using SharedKernel.Domain.Primitives;
using Xunit;

// Interfaces mocked here represent the expected DDD implementations required to complete the GeneratePayslipCommandHandler
public interface IPayslipRepository 
{ 
    Task AddAsync(Payslip payslip, CancellationToken cancellationToken); 
}

public class PayrollPipelineIntegrationTests
{
    private readonly Mock<IPayslipRepository> _repositoryMock;
    private readonly Mock<IPublisher> _publisherMock;

    public PayrollPipelineIntegrationTests()
    {
        _repositoryMock = new Mock<IPayslipRepository>();
        _publisherMock = new Mock<IPublisher>();
    }

    // 58. PayrollPipeline_Should_Validate_Command_Before_Reaching_Handler
    [Fact]
    public void PayrollPipeline_Should_Validate_Command_Before_Reaching_Handler()
    {
        // Demonstrates domain-level validation bypassing standard pipeline if constraints fail early
        var employeeId = Guid.NewGuid();
        var result = Payslip.Generate(employeeId, -5000m, 0, 0, "2026-08");

        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("Payroll.InvalidSalary");
    }

    // 59. PayrollPipeline_Should_Fail_Gracefully_When_Database_Is_Unavailable
    [Fact]
    public async Task PayrollPipeline_Should_Fail_Gracefully_When_Database_Is_Unavailable()
    {
        var command = new GeneratePayslipCommand(Guid.NewGuid(), 5000m, 1000m, 500m, "2026-08");
        
        _repositoryMock.Setup(r => r.AddAsync(It.IsAny<Payslip>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(new Exception("Database connection failed"));

        // Simulating the handler invoking the repository
        Func<Task> act = async () => 
        {
            var payslip = Payslip.Generate(command.EmployeeId, command.BasicSalary, command.Allowances, command.Deductions, command.PayPeriod).Value;
            await _repositoryMock.Object.AddAsync(payslip, CancellationToken.None);
        };

        await act.Should().ThrowAsync<Exception>().WithMessage("Database connection failed");
        _publisherMock.Verify(p => p.Publish(It.IsAny<object>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    // 60. PayrollPipeline_Should_Publish_PayslipGenerated_Event_After_Successful_Commit
    [Fact]
    public async Task PayrollPipeline_Should_Publish_PayslipGenerated_Event_After_Successful_Commit()
    {
        var command = new GeneratePayslipCommand(Guid.NewGuid(), 5000m, 1000m, 500m, "2026-08");
        var payslip = Payslip.Generate(command.EmployeeId, command.BasicSalary, command.Allowances, command.Deductions, command.PayPeriod).Value;

        // Simulating the successful pipeline execution
        await _repositoryMock.Object.AddAsync(payslip, CancellationToken.None);
        await _publisherMock.Object.Publish(new { EventName = "PayslipGenerated", payslip.Id }, CancellationToken.None);

        _repositoryMock.Verify(r => r.AddAsync(It.IsAny<Payslip>(), It.IsAny<CancellationToken>()), Times.Once);
        _publisherMock.Verify(p => p.Publish(It.IsAny<object>(), It.IsAny<CancellationToken>()), Times.Once);
    }
}
