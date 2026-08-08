using Avalonia.Controls;
using Avalonia.Markup.Xaml;

namespace LmsOffline.Presentation.Features.PackageManager;

public partial class PackageManagerView : UserControl
{
    public PackageManagerView()
    {
        InitializeComponent();
    }

    private void InitializeComponent()
    {
        AvaloniaXamlLoader.Load(this);
    }
}
