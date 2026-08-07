namespace LmsOffline.Application.Features.AuthenticateStudent;

using MediatR;
using SharedKernel.Domain.Primitives;

public sealed record AuthenticateStudentCommand(
    string Identifier,
    string PlainPassword
) : IRequest<Result<AuthenticateStudentResult>>;