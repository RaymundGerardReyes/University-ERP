namespace LmsOffline.Domain.Exceptions;

using System;

#region Exceptions
/// <summary>
/// Domain exception thrown when an assessment is accessed outside its allowed availability window.
/// </summary>
public sealed class AssessmentWindowClosedException : Exception
{
    public AssessmentWindowClosedException(string message) : base(message)
    {
    }

    public AssessmentWindowClosedException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
#endregion
