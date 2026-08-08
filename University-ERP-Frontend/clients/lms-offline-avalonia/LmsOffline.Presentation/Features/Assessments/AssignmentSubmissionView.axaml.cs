using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace LmsOffline.Presentation.Features.Assessments;

public partial class AssignmentSubmissionView : UserControl
{
    public AssignmentSubmissionView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}
