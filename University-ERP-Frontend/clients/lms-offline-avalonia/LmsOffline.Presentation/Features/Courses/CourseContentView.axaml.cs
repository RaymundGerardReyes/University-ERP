using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace LmsOffline.Presentation.Features.Courses;

public partial class CourseContentView : UserControl
{
    public CourseContentView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}
