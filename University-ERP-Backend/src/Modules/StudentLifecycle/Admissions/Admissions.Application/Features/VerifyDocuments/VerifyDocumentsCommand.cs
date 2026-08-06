namespace Admissions.Application.Features.VerifyDocuments;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record VerifyDocumentsCommand(string ApplicationId) : IRequest<Result<bool>>;

public sealed class VerifyDocumentsCommandHandler : IRequestHandler<VerifyDocumentsCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public VerifyDocumentsCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(VerifyDocumentsCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.VerifyDocuments();
        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<bool>.Success(true);
    }
}
