namespace Admissions.Application.Features.SubmitApplication;

using MediatR;
using Admissions.Application.Abstractions;
using Admissions.Domain.Aggregates;

public sealed record SubmitApplicationCommand(
    string ApplicantId,
    string ProgramId,
    string FirstName,
    string LastName,
    string DateOfBirth,
    string Nationality
) : IRequest<string>;

public sealed class SubmitApplicationCommandHandler : IRequestHandler<SubmitApplicationCommand, string>
{
    private readonly IAdmissionApplicationRepository _repository;

    public SubmitApplicationCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<string> Handle(SubmitApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = new AdmissionApplication(
            Guid.NewGuid().ToString(),
            request.ApplicantId,
            request.ProgramId
        );

        _repository.Add(application);
        await _repository.SaveChangesAsync(cancellationToken);

        return application.Id;
    }
}
