namespace DocumentManagement.Application.Features.UploadDocument;

using MediatR;
using SharedKernel.Domain.Primitives;
using System;
using System.Threading;
using System.Threading.Tasks;
using DocumentManagement.Domain.Aggregates;
using DocumentManagement.Application.Abstractions;

public sealed record UploadDocumentCommand(string Title, string Category, string FilePath, string UploadedBy) : IRequest<Result<Guid>>;

public sealed class UploadDocumentCommandHandler : IRequestHandler<UploadDocumentCommand, Result<Guid>>
{
    private readonly IDocumentRepository _repository;

    public UploadDocumentCommandHandler(IDocumentRepository repository)
    {
        _repository = repository;
    }

    public async Task<Result<Guid>> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
    {
        var documentResult = CorporateDocument.Upload(
            request.Title, 
            request.Category, 
            request.FilePath,
            request.UploadedBy);

        if (documentResult.IsFailure)
        {
            return Result<Guid>.Failure(documentResult.Error);
        }

        await _repository.AddAsync(documentResult.Value, cancellationToken);
        return Result<Guid>.Success(documentResult.Value.Id);
    }
}
