namespace Examination.Application.Features.CreateQuestion;

using MediatR;
using SharedKernel.Domain.Primitives;
using Examination.Domain.Aggregates;
using Examination.Application.Abstractions;
using System;
using System.Threading;
using System.Threading.Tasks;

public sealed class CreateQuestionCommandHandler : IRequestHandler<CreateQuestionCommand, Result<Guid>>
{
    private readonly IQuestionRepository _repository;

    public CreateQuestionCommandHandler(IQuestionRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(CreateQuestionCommand request, CancellationToken cancellationToken)
    {
        // 1. Construct the QuestionItem Domain Aggregate (applies baseline Difficulty Index)
        var questionResult = QuestionItem.Create(
            request.SubjectPool, 
            request.QuestionText, 
            request.BloomsTag);

        if (questionResult.IsFailure)
        {
            return Result<Guid>.Failure(questionResult.Error);
        }

        // 2. Persist to Examination DB (which the LMS will later fetch from during offline sync generation)
        await _repository.AddAsync(questionResult.Value, cancellationToken);

        return Result<Guid>.Success(questionResult.Value.Id);
    }
}