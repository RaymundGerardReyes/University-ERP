namespace Examination.Application.Features.CreateQuestion;

using MediatR;
using SharedKernel.Domain.Primitives;

public sealed record CreateQuestionCommand(string SubjectPool, string QuestionText, string BloomsTag) : IRequest<Result<Guid>>;

public sealed class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, Result<Guid>>
{
    public Task<Result<Guid>> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        // 1. Create QuestionItem domain aggregate
        // 2. Persist to IExaminationRepository
        return Task.FromResult(Result<Guid>.Success(Guid.NewGuid()));
    }
}