namespace Payroll.Application.Features.GeneratePayslip;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record GeneratePayslipCommand(
    Guid EmployeeId, 
    decimal BasicSalary, 
    decimal Allowances, 
    decimal Deductions, 
    string PayPeriod) : IRequest<Result<Guid>>;

public sealed class GeneratePayslipCommandHandler : IRequestHandler<GeneratePayslipCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(GeneratePayslipCommand request, CancellationToken cancellationToken)
    {
        // 1. Create the Payslip domain aggregate
        // 2. In a real scenario, this would be persisted to IPayrollRepository
        
        var payslipId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(payslipId));
    }
}
