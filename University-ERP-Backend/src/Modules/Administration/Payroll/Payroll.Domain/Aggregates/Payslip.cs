namespace Payroll.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Payslip : AggregateRoot<Guid>
{
    public Guid EmployeeId { get; private set; }
    public decimal BasicSalary { get; private set; }
    public decimal Allowances { get; private set; }
    public decimal Deductions { get; private set; }
    public decimal NetPay { get; private set; }
    public string PayPeriod { get; private set; } = string.Empty;
    public DateTime IssuedOnUtc { get; private set; }

    private Payslip() { }

    private Payslip(Guid id, Guid employeeId, decimal basicSalary, decimal allowances, decimal deductions, string payPeriod) : base(id)
    {
        EmployeeId = employeeId;
        BasicSalary = basicSalary;
        Allowances = allowances;
        Deductions = deductions;
        NetPay = (basicSalary + allowances) - deductions;
        PayPeriod = payPeriod;
        IssuedOnUtc = DateTime.UtcNow;
    }

    public static Result<Payslip> Generate(Guid employeeId, decimal basicSalary, decimal allowances, decimal deductions, string payPeriod)
    {
        if (basicSalary <= 0)
        {
            return Result<Payslip>.Failure(new Error("Payroll.InvalidSalary", "Basic salary must be greater than zero."));
        }

        if (string.IsNullOrWhiteSpace(payPeriod))
        {
            return Result<Payslip>.Failure(new Error("Payroll.InvalidPeriod", "Pay period is required."));
        }

        return Result<Payslip>.Success(new Payslip(Guid.NewGuid(), employeeId, basicSalary, allowances, deductions, payPeriod));
    }
}
