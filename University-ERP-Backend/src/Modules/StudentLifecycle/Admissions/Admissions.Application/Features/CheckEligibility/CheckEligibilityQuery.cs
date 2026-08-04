namespace Admissions.Application.Features.CheckEligibility;

using MediatR;

public sealed record EligibilityResultDto(
    bool IsEligible,
    string Message,
    List<string> RequiredDocuments
);

public sealed record CheckEligibilityQuery(
    string ApplicantType,
    decimal Gpa,
    string Country
) : IRequest<EligibilityResultDto>;

public sealed class CheckEligibilityQueryHandler : IRequestHandler<CheckEligibilityQuery, EligibilityResultDto>
{
    public Task<EligibilityResultDto> Handle(CheckEligibilityQuery request, CancellationToken cancellationToken)
    {
        bool isEligible = request.Gpa >= 3.0m;
        string message = isEligible 
            ? "You meet the minimum academic requirements for undergraduate programs." 
            : "Your GPA is below the standard minimum (3.0). You may still apply but will require additional review.";
        
        var docs = new List<string> { "Official Transcript", "Government ID" };
        
        if (request.ApplicantType == "Transfer")
        {
            docs.Add("Transfer Clearance");
        }
        
        if (request.Country != "Domestic")
        {
            docs.Add("English Proficiency Test");
            docs.Add("Passport Copy");
        }

        return Task.FromResult(new EligibilityResultDto(isEligible, message, docs));
    }
}
