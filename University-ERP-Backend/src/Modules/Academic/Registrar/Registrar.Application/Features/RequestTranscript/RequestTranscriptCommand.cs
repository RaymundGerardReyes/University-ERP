namespace Registrar.Application.Features.RequestTranscript;

using MediatR;
using SharedKernel.Domain.Primitives;

public sealed record RequestTranscriptCommand(Guid StudentId, string Purpose) : IRequest<Result<Guid>>;

public sealed class RequestTranscriptCommandHandler : IRequestHandler<RequestTranscriptCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(RequestTranscriptCommand request, CancellationToken cancellationToken)
    {
        // 1. In a real scenario, check StudentInformation context for financial/academic clearance
        // 2. Persist to Registrar DB via IRegistrarRepository
        
        var transcriptId = Guid.NewGuid();
        return Task.FromResult(Result<Guid>.Success(transcriptId));
    }
}