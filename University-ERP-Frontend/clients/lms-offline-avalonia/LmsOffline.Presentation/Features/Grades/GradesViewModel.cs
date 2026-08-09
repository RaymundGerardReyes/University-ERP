namespace LmsOffline.Presentation.Features.Grades;

using System.Collections.ObjectModel;
using CommunityToolkit.Mvvm.ComponentModel;

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
    public string Title => "My Grades";

    [ObservableProperty]
    private string _statusMessage = "Gradebook synchronized. All records are stored securely offline.";

    public ObservableCollection<GradeItemModel> Grades { get; } = new();

    public GradesViewModel()
    {
        // Mock data to demonstrate the UI before the sync engine populates it dynamically
        Grades.Add(new GradeItemModel 
        { 
            CourseCode = "CS101", 
            AssessmentTitle = "Midterm Logic Evaluation", 
            Score = 92.5, 
            MaxScore = 100,
            Remarks = "Excellent work. No integrity violations detected.",
            EvaluatedOn = "2026-08-08"
        });
        
        Grades.Add(new GradeItemModel 
        { 
            CourseCode = "CS203", 
            AssessmentTitle = "Data Structures Tree Traversal", 
            Score = 0, 
            MaxScore = 100,
            Status = "Pending Sync",
            Remarks = "Awaiting faculty evaluation.",
            EvaluatedOn = "N/A"
        });
    }
}
