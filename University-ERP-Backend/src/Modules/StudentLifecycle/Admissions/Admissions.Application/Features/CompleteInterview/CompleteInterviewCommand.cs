namespace Admissions.Application.Features.CompleteInterview;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record CompleteInterviewCommand(string ApplicationId, string Remarks) : IRequest<Result<bool>>;

public sealed class CompleteInterviewCommandHandler : IRequestHandler<CompleteInterviewCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public CompleteInterviewCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(CompleteInterviewCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.CompleteInterview(request.Remarks);
        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
