namespace HumanResources.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class Employee : AggregateRoot<Guid>
{
    public string FirstName { get; private set; } = string.Empty;
    public string LastName { get; private set; } = string.Empty;
    public string Role { get; private set; } = string.Empty;
    public string DepartmentId { get; private set; } = string.Empty;
    public string Status { get; private set; } = string.Empty;
    public DateTime HiredOnUtc { get; private set; }

    private Employee() { }

    private Employee(Guid id, string firstName, string lastName, string role, string departmentId) : base(id)
    {
        FirstName = firstName;
        LastName = lastName;
        Role = role;
        DepartmentId = departmentId;
        Status = "Active";
        HiredOnUtc = DateTime.UtcNow;
    }

    public static Result<Employee> Onboard(string firstName, string lastName, string role, string departmentId)
    {
        if (string.IsNullOrWhiteSpace(firstName) || string.IsNullOrWhiteSpace(lastName))
        {
            return Result<Employee>.Failure(new Error("HR.InvalidName", "First and last name are required."));
        }

        return Result<Employee>.Success(new Employee(Guid.NewGuid(), firstName, lastName, role, departmentId));
    }
}
