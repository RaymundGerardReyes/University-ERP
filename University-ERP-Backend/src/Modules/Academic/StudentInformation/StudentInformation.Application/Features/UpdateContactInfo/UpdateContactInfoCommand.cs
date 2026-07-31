namespace StudentInformation.Application.Features.UpdateContactInfo;

using MediatR;
using SharedKernel.Domain.Primitives;
using StudentInformation.Domain.ValueObjects;
using StudentInformation.Application.Abstractions;

public sealed record UpdateContactInfoCommand(
    Guid StudentId, 
    string PhoneNumber, 
    string EmergencyContactName, 
    string EmergencyContactNumber
) : IRequest<Result<bool>>;

public sealed class UpdateContactInfoCommandHandler : IRequestHandler<UpdateContactInfoCommand, Result<bool>>
{
    private readonly IStudentRepository _repository;

    public UpdateContactInfoCommandHandler(IStudentRepository repository) => _repository = repository;

    public async Task<Result<bool>> Handle(UpdateContactInfoCommand request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetByIdAsync(StudentId.From(request.StudentId), cancellationToken);
        
        if (student is null)
        {
            return Result<bool>.Failure(new Error("Student.NotFound", "The specified student does not exist."));
        }

        var updateResult = student.UpdateContactInformation(
            request.PhoneNumber, 
            request.EmergencyContactName, 
            request.EmergencyContactNumber);

        if (updateResult.IsSuccess)
        {
            await _repository.AddAsync(student, cancellationToken); // Assuming AddAsync handles updates in your EF wrapper
        }

        return updateResult;
    }
}