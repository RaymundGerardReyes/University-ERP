namespace LmsOffline.Application.Interfaces;

using System;
using System.Collections.Generic;

public class IntegrityViolation
{
    public DateTime TimestampUtc { get; set; }
    public string ViolationType { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
}

public interface IExamIntegrityService
{
    void StartMonitoring();
    void StopMonitoring();
    IReadOnlyList<IntegrityViolation> GetViolations();
    void ClearClipboard();
}
