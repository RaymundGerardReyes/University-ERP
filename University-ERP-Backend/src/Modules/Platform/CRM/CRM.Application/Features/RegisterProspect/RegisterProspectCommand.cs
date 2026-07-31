namespace CRM.Application.Features.RegisterProspect;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using CRM.Domain.Aggregates;
using CRM.Application.Abstractions;

public sealed record RegisterProspectCommand(string FirstName, string LastName, string Email, string Source) : IRequest<Result<Guid>>;

public sealed class RegisterProspectCommandHandler : IRequestHandler<RegisterProspectCommand, Result<Guid>>
{
    private readonly ICRMRepository _repository;

    public RegisterProspectCommandHandler(ICRMRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(RegisterProspectCommand request, CancellationToken cancellationToken)
    {
        var prospectResult = Prospect.Register(
            request.FirstName, 
            request.LastName, 
            request.Email,
            request.Source);

        if (prospectResult.IsFailure)
        {
            return Result<Guid>.Failure(prospectResult.Error);
        }

        await _repository.AddAsync(prospectResult.Value, cancellationToken);
        return Result<Guid>.Success(prospectResult.Value.Id);
    }
}
