namespace LmsOffline.Application.Features.AuthenticateStudent;

using System;

public sealed record AuthenticateStudentResult(
    Guid StudentId,
    string StudentIdNumber,
    string FullName,
    string AcademicProgram,
    string TokenValue,
    DateTime ExpiresAtUtc,
    string Role
);