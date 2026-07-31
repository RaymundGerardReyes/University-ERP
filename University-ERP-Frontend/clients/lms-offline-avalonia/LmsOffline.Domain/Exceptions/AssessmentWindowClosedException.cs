namespace LmsOffline.Domain.Exceptions;

using System;

#region Exceptions
/// <summary>
/// Domain exception thrown when assessment access rules are violated.
/// </summary>
public class AssessmentWindowClosedException : Exception
{
    public AssessmentWindowClosedException(string message) 
        : base(message)
    {
    }

    public AssessmentWindowClosedException(string message, Exception innerException) 
        : base(message, innerException)
    {
    }
}
#endregion
