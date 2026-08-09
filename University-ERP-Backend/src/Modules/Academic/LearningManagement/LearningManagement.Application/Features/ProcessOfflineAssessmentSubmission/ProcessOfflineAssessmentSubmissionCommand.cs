namespace LearningManagement.Application.Features.ProcessOfflineAssessmentSubmission;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;

// This record explicitly declares it returns a Result<Guid>, matching our handler.
public sealed record ProcessOfflineAssessmentSubmissionCommand(
    string AssessmentId, 
    string StudentId, 
    string EncryptedAnswersJson,
    string SubmittedAtUtc) : IRequest<Result<bool>>;

