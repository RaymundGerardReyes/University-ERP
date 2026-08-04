namespace DocumentManagement.Application.Features.GetFacultyDocuments;

using MediatR;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

// 1. DTO perfectly matching the frontend 'FacultyDocument' interface
public sealed record FacultyDocumentDto(
    string Id,
    string Name,
    string Category,
    string UploadDate,
    string Size
);

// 2. The MediatR Query
public sealed record GetFacultyDocumentsQuery(string FacultyId) : IRequest<IReadOnlyList<FacultyDocumentDto>>;

// 3. The Handler
public sealed class GetFacultyDocumentsQueryHandler : IRequestHandler<GetFacultyDocumentsQuery, IReadOnlyList<FacultyDocumentDto>>
{
    public Task<IReadOnlyList<FacultyDocumentDto>> Handle(GetFacultyDocumentsQuery request, CancellationToken cancellationToken)
    {
        // In a production scenario, we query IDocumentRepository here.
        // Returning exact mock data to satisfy the new UI:
        var mockDocs = new List<FacultyDocumentDto>
        {
            new("DOC-001", "CS-101 Standard Syllabus Template.docx", "Syllabus", "2026-07-15", "245 KB"),
            new("DOC-002", "University Academic Integrity Policy.pdf", "Policy", "2026-08-01", "1.2 MB"),
            new("DOC-003", "Grade Override Request Form.pdf", "Form", "2026-01-10", "150 KB"),
            new("DOC-004", "NSF Grant Proposal Draft_v2.pdf", "Research", "2026-08-14", "3.4 MB")
        };

        return Task.FromResult<IReadOnlyList<FacultyDocumentDto>>(mockDocs);
    }
}