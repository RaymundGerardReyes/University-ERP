using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;

namespace LmsOffline.Presentation.Shared.Controls;

public partial class StatusBadge : UserControl
{
    public static readonly StyledProperty<string> TextProperty =
        AvaloniaProperty.Register<StatusBadge, string>(nameof(Text));

    public static readonly StyledProperty<IBrush> BgColorProperty =
        AvaloniaProperty.Register<StatusBadge, IBrush>(nameof(BgColor), new SolidColorBrush(Color.Parse("#1A10B981")));

    public static readonly StyledProperty<IBrush> FgColorProperty =
        AvaloniaProperty.Register<StatusBadge, IBrush>(nameof(FgColor), new SolidColorBrush(Color.Parse("#10B981")));

    public static readonly StyledProperty<IBrush> BorderColorProperty =
        AvaloniaProperty.Register<StatusBadge, IBrush>(nameof(BorderColor), new SolidColorBrush(Colors.Transparent));

    public string Text { get => GetValue(TextProperty); set => SetValue(TextProperty, value); }
    public IBrush BgColor { get => GetValue(BgColorProperty); set => SetValue(BgColorProperty, value); }
    public IBrush FgColor { get => GetValue(FgColorProperty); set => SetValue(FgColorProperty, value); }
    public IBrush BorderColor { get => GetValue(BorderColorProperty); set => SetValue(BorderColorProperty, value); }

    public StatusBadge()
    {
        InitializeComponent();
    }
}
