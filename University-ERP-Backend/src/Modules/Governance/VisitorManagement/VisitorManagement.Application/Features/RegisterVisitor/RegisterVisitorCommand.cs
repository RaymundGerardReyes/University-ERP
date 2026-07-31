namespace VisitorManagement.Application.Features.RegisterVisitor;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using VisitorManagement.Domain.Aggregates;
using VisitorManagement.Application.Abstractions;

public sealed record RegisterVisitorCommand(string VisitorName, string Purpose, string HostId) : IRequest<Result<Guid>>;

public sealed class RegisterVisitorCommandHandler : IRequestHandler<RegisterVisitorCommand, Result<Guid>>
{
    private readonly IVisitorRepository _repository;

    public RegisterVisitorCommandHandler(IVisitorRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(RegisterVisitorCommand request, CancellationToken cancellationToken)
    {
        var visitorResult = VisitorLog.Register(
            request.VisitorName, 
            request.Purpose, 
            request.HostId);

        if (visitorResult.IsFailure)
        {
            return Result<Guid>.Failure(visitorResult.Error);
        }

        await _repository.AddAsync(visitorResult.Value, cancellationToken);
        return Result<Guid>.Success(visitorResult.Value.Id);
    }
}
