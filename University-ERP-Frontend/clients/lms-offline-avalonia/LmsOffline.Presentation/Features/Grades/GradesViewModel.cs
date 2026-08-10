namespace LmsOffline.Presentation.Features.Grades;

using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using MediatR;
using LmsOffline.Application.Features.Grades;

public class GradeItemModel : ObservableObject
{
    public string CourseCode { get; set; } = string.Empty;
    public string AssessmentTitle { get; set; } = string.Empty;
    public double Score { get; set; }
    public double MaxScore { get; set; }
    public string Remarks { get; set; } = string.Empty;
    public string Status { get; set; } = "Evaluated";
    public string EvaluatedOn { get; set; } = string.Empty;
    
    // Dynamically calculates the percentage for the UI
    public double Percentage => MaxScore > 0 ? (Score / MaxScore) * 100 : 0;
}



public partial class GradesViewModel : ObservableObject
{
    private readonly IMediator _mediator;
    public string Title => "My Grades";

    [ObservableProperty]
    private string _statusMessage = "Gradebook synchronized. All records are stored securely offline.";

    public ObservableCollection<GradeItemModel> Grades { get; } = new();

    public GradesViewModel(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task InitializeAsync(string studentIdNumber)
    {
        var result = await _mediator.Send(new GetLocalGradesQuery(studentIdNumber));
        if (result.IsSuccess && result.Value != null)
        {
            Grades.Clear();
            foreach (var grade in result.Value)
            {
                Grades.Add(new GradeItemModel
                {
                    CourseCode = grade.CourseCode,
                    AssessmentTitle = grade.AssessmentTitle,
                    Score = grade.Score,
                    MaxScore = grade.MaxScore,
                    Remarks = grade.Remarks,
                    EvaluatedOn = grade.EvaluatedOnUtc.ToString("yyyy-MM-dd")
                });
            }
        }
    }
}
