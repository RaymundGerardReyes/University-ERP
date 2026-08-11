namespace Admissions.Application.Features.ScheduleInterview;

using MediatR;
using SharedKernel.Domain.Primitives;
using Admissions.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record ScheduleInterviewCommand(
    string ApplicationId, 
    string Date, 
    string Time
) : IRequest<Result<bool>>;

public sealed class ScheduleInterviewCommandHandler : IRequestHandler<ScheduleInterviewCommand, Result<bool>>
{
    private readonly IAdmissionApplicationRepository _repository;

    public ScheduleInterviewCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ScheduleInterviewCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        
        if (application == null)
            return Result<bool>.Failure(new Error("Admissions.NotFound", "Application not found."));

        var result = application.ScheduleInterview(request.Date, request.Time);

        if (result.IsFailure)
            return result;

        await _repository.SaveChangesAsync(cancellationToken);

        return Result<bool>.Success(true);
    }
}
