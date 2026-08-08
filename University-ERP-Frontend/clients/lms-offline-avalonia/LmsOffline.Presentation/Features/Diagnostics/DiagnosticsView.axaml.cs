using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace LmsOffline.Presentation.Features.Diagnostics;

public partial class DiagnosticsView : UserControl
{
    public DiagnosticsView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}
