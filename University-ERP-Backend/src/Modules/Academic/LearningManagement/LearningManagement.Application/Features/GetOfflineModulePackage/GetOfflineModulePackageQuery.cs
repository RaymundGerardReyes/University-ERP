namespace LearningManagement.Application.Features.GetOfflineModulePackage;

using MediatR;
using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

// DTOs matching the Avalonia Client's expected format
public sealed record ModulePackageDto(
    Guid ModuleId, 
    string CourseCode, 
    string ModuleTitle, 
    string VersionManifest,
    long SizeInBytes,
    string EcdsaSignature, // The Cryptographic proof of origin
    IReadOnlyList<AssessmentDto> Assessments, 
    IReadOnlyList<AssignmentDto> Assignments);

public sealed record AssessmentDto(Guid AssessmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd, int MaxAttempts);
public sealed record AssignmentDto(Guid AssignmentId, string Title, DateTimeOffset WindowStart, DateTimeOffset WindowEnd);

public sealed record GetOfflineModulePackageQuery(Guid ModuleId, Guid StudentId) : IRequest<ModulePackageDto>;

public sealed class GetOfflineModulePackageQueryHandler : IRequestHandler<GetOfflineModulePackageQuery, ModulePackageDto>
{
    public Task<ModulePackageDto> Handle(GetOfflineModulePackageQuery request, CancellationToken cancellationToken)
    {
        // 1. Fetch Course Data & Student Schedule from DbContext (Simulated)
        var windowStart = DateTimeOffset.UtcNow.AddDays(-1);
        var windowEnd = DateTimeOffset.UtcNow.AddDays(7);

        var assessments = new List<AssessmentDto>
        {
            new(Guid.NewGuid(), "Advanced Physics Midterm", windowStart, windowEnd, 1)
        };

        var assignments = new List<AssignmentDto>
        {
            new(Guid.NewGuid(), "Lab Report: Quantum Mechanics", windowStart, windowEnd)
        };

        // 2. PACKAGE BUILDER LOGIC
        // Generate a specific version manifest based on content hashes
        string versionManifest = $"v2.1.0-{Guid.NewGuid().ToString()[..8]}";
        long simulatedSize = 1024 * 1024 * 850; // 850 MB

        // 3. Cryptographically Sign the Package Manifest (Enterprise Security Requirement)
        // In production, this signs the actual compressed .zip package stream.
        string payloadToSign = $"{request.ModuleId}:{versionManifest}:{simulatedSize}";
        string signature = GenerateEcdsaSignature(payloadToSign);

        var package = new ModulePackageDto(
            request.ModuleId,
            "PHYS-401",
            "Quantum Mechanics",
            versionManifest,
            simulatedSize,
            signature,
            assessments,
            assignments
        );

        return Task.FromResult(package);
    }

    private string GenerateEcdsaSignature(string payload)
    {
        // Simulated ECDSA Signing using SHA256 for demonstration. 
        // In production: using ECDsa.Create() with a Private Key from Azure Key Vault or AWS KMS.
        using var sha256 = SHA256.Create();
        byte[] hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(payload));
        return Convert.ToBase64String(hash); 
    }
}