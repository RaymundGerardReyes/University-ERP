namespace MultiCampus.Application.Features.ConfigureCampus;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using MultiCampus.Domain.Aggregates;
using MultiCampus.Application.Abstractions;

public sealed record ConfigureCampusCommand(string Name, string Location, string TenantId) : IRequest<Result<Guid>>;

public sealed class ConfigureCampusCommandHandler : IRequestHandler<ConfigureCampusCommand, Result<Guid>>
{
    private readonly ICampusRepository _repository;

    public ConfigureCampusCommandHandler(ICampusRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(ConfigureCampusCommand request, CancellationToken cancellationToken)
    {
        var campusResult = Campus.Configure(
            request.Name, 
            request.Location, 
            request.TenantId);

        if (campusResult.IsFailure)
        {
            return Result<Guid>.Failure(campusResult.Error);
        }

        await _repository.AddAsync(campusResult.Value, cancellationToken);
        return Result<Guid>.Success(campusResult.Value.Id);
    }
}
