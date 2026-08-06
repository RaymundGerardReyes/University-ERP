namespace Registrar.Application.Features.ProcessTranscriptRequest;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ProcessTranscriptRequestCommand(Guid RequestId) : IRequest<Result<string>>;

public sealed class ProcessTranscriptRequestCommandHandler : IRequestHandler<ProcessTranscriptRequestCommand, Result<string>>
{
    // private readonly ITranscriptRequestRepository _repository;

    public ProcessTranscriptRequestCommandHandler()
    {
    }

    public async Task<Result<string>> Handle(ProcessTranscriptRequestCommand request, CancellationToken cancellationToken)
    {
        // var transcriptRequest = await _repository.GetByIdAsync(request.RequestId, cancellationToken);
        // if (transcriptRequest == null) return Result.Failure(new Error("NotFound", "Transcript request not found."));

        // var result = transcriptRequest.Approve();
        // if (result.IsFailure) return result;

        // await _repository.UpdateAsync(transcriptRequest, cancellationToken);
        
        await Task.CompletedTask;
        return Result<string>.Success($"Successfully processed transcript request {request.RequestId}");
    }
}
