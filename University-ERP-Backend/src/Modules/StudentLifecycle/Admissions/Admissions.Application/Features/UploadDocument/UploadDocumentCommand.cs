namespace Admissions.Application.Features.UploadDocument;

using MediatR;
using Admissions.Application.Abstractions;

public sealed record UploadDocumentCommand(
    string ApplicationId,
    string DocumentName,
    string FilePath
) : IRequest<bool>;

public sealed class UploadDocumentCommandHandler : IRequestHandler<UploadDocumentCommand, bool>
{
    private readonly IAdmissionApplicationRepository _repository;

    public UploadDocumentCommandHandler(IAdmissionApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
    {
        var application = await _repository.GetByIdAsync(request.ApplicationId, cancellationToken);
        
        if (application is null)
        {
            return false;
        }

        // Simulate upload and document addition
        var existingDoc = application.Documents.FirstOrDefault(d => d.Name == request.DocumentName);
        if (existingDoc != null)
        {
            existingDoc.MarkAsUploaded(request.FilePath);
        }
        else
        {
            application.AddDocument(request.DocumentName, "Uploaded", request.FilePath);
        }

        // Reactivate verification phase if needed
        var verificationEvent = application.TimelineEvents.FirstOrDefault(t => t.Title == "Document Verification");
        verificationEvent?.Activate();

        application.UpdateStatus("Under Review");

        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }
}
