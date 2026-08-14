namespace StudentInformation.Application.Features.Graduation;

using MediatR;
using SharedKernel.Domain.Primitives;
using StudentInformation.Application.Abstractions;
using System.Threading;
using System.Threading.Tasks;

public sealed record ReviewClearanceCommand(string StudentId) : IRequest<Result<bool>>;

public sealed class ReviewClearanceCommandHandler : IRequestHandler<ReviewClearanceCommand, Result<bool>>
{
    private readonly IStudentAcademicRecordRepository _repository;

    public ReviewClearanceCommandHandler(IStudentAcademicRecordRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<bool>> Handle(ReviewClearanceCommand request, CancellationToken cancellationToken)
    {
        var academicRecord = await _repository.GetByStudentIdAsync(request.StudentId, cancellationToken);
        if (academicRecord == null)
        {
            return Result<bool>.Failure(new Error("AcademicRecord.NotFound", "Academic record not found for this student."));
        }

        var result = academicRecord.RequestGraduationClearance();
        if (result.IsSuccess)
        {
            await _repository.UpdateAsync(academicRecord, cancellationToken);
        }

        return result;
    }
}
