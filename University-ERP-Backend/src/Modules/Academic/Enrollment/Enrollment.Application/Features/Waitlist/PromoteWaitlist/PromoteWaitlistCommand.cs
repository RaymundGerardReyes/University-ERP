namespace Enrollment.Application.Features.Waitlist.PromoteWaitlist;

using MediatR;
using SharedKernel.Domain.Primitives;
using Enrollment.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record PromoteWaitlistCommand(string SectionId, string TermId) : IRequest<Result<bool>>;

public sealed class PromoteWaitlistCommandHandler : IRequestHandler<PromoteWaitlistCommand, Result<bool>>
{
    private readonly IWaitlistRepository _waitlistRepository;
    private readonly ITermRegistrationRepository _registrationRepository;

    public PromoteWaitlistCommandHandler(
        IWaitlistRepository waitlistRepository, 
        ITermRegistrationRepository registrationRepository)
    {
        _waitlistRepository = waitlistRepository;
        _registrationRepository = registrationRepository;
    }

    public async Task<Result<bool>> Handle(PromoteWaitlistCommand request, CancellationToken cancellationToken)
    {
        // 1. Find the next pending student in line for this specific section
        var nextInLine = await _waitlistRepository.GetNextPendingEntryAsync(request.SectionId, request.TermId, cancellationToken);
        
        if (nextInLine == null)
        {
            // No one is on the waitlist, naturally succeed without further action
            return Result<bool>.Success(true);
        }

        // 2. Mark the waitlist entry as promoted
        nextInLine.Promote();
        await _waitlistRepository.UpdateAsync(nextInLine, cancellationToken);

        // 3. Retrieve the promoted student's active registration
        var registration = await _registrationRepository.GetActiveRegistrationAsync(nextInLine.StudentId, cancellationToken);
        
        if (registration != null)
        {
            registration.AddCourse(nextInLine.SectionId, nextInLine.CourseCode, nextInLine.Credits);
            await _registrationRepository.UpdateAsync(registration, cancellationToken);
        }

        return Result<bool>.Success(true);
    }
}
