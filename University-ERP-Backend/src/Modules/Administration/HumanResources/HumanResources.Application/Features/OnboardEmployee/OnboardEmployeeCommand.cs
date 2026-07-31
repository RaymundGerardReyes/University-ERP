namespace HumanResources.Application.Features.OnboardEmployee;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record OnboardEmployeeCommand(string FirstName, string LastName, string Role, string DepartmentId) : IRequest<Result<Guid>>;

public sealed class OnboardEmployeeCommandHandler : IRequestHandler<OnboardEmployeeCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(OnboardEmployeeCommand request, CancellationToken cancellationToken)
    {
        var employeeId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(employeeId));
    }
}
