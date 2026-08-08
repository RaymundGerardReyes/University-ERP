using Avalonia;
using Avalonia.Controls;
using Avalonia.Media;
using System.Windows.Input;

namespace LmsOffline.Presentation.Shared.Controls;

public partial class NavigationItem : UserControl
{
    public static readonly StyledProperty<string> IconProperty =
        AvaloniaProperty.Register<NavigationItem, string>(nameof(Icon));

    public static readonly StyledProperty<string> LabelProperty =
        AvaloniaProperty.Register<NavigationItem, string>(nameof(Label));

    public static readonly StyledProperty<bool> IsExpandedProperty =
        AvaloniaProperty.Register<NavigationItem, bool>(nameof(IsExpanded), true);

    public static readonly StyledProperty<ICommand> CommandProperty =
        AvaloniaProperty.Register<NavigationItem, ICommand>(nameof(Command));

    public static readonly StyledProperty<object> CommandParameterProperty =
        AvaloniaProperty.Register<NavigationItem, object>(nameof(CommandParameter));

    public static readonly StyledProperty<IBrush> BgColorProperty =
        AvaloniaProperty.Register<NavigationItem, IBrush>(nameof(BgColor), new SolidColorBrush(Colors.Transparent));

    public static readonly StyledProperty<IBrush> FgColorProperty =
        AvaloniaProperty.Register<NavigationItem, IBrush>(nameof(FgColor), new SolidColorBrush(Color.Parse("#94A3B8")));

    public string Icon { get => GetValue(IconProperty); set => SetValue(IconProperty, value); }
    public string Label { get => GetValue(LabelProperty); set => SetValue(LabelProperty, value); }
    public bool IsExpanded { get => GetValue(IsExpandedProperty); set => SetValue(IsExpandedProperty, value); }
    public ICommand Command { get => GetValue(CommandProperty); set => SetValue(CommandProperty, value); }
    public object CommandParameter { get => GetValue(CommandParameterProperty); set => SetValue(CommandParameterProperty, value); }
    public IBrush BgColor { get => GetValue(BgColorProperty); set => SetValue(BgColorProperty, value); }
    public IBrush FgColor { get => GetValue(FgColorProperty); set => SetValue(FgColorProperty, value); }

    public NavigationItem()
    {
        InitializeComponent();
    }
}
