namespace Admissions.Application.Features.ActivateEnrollment;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Domain.Aggregates;
using Admissions.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed record ActivateEnrollmentCommand(string ApplicationId) : IRequest<Result<string>>;

public sealed class ActivateEnrollmentCommandHandler : IRequestHandler<ActivateEnrollmentCommand, Result<string>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public ActivateEnrollmentCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<string>> Handle(ActivateEnrollmentCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        if (application == null)
            return Result<string>.Failure(new Error("Admissions.NotFound", "Application not found."));

        // Generate the new official Student ID
        var newStudentId = $"STU-{DateTime.UtcNow.Year}-{new Random().Next(1000, 9999)}";
        
        var result = application.ActivateEnrollment(newStudentId);
        if (result.IsFailure)
            return Result<string>.Failure(result.Error);

        await _repository.SaveChangesAsync(cancellationToken);
        return Result<string>.Success(newStudentId);
    }
}
