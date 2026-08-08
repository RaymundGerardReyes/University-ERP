using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace LmsOffline.Presentation.Features.Courses;

public partial class CourseViewerView : UserControl
{
    public CourseViewerView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}
