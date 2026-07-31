namespace SharedKernel.Domain.Primitives;

/// <summary>
/// Abstract base class for all Domain Entities.
/// Two entities are equal if and only if their Id values match.
/// </summary>
public abstract class Entity<TId> : IEquatable<Entity<TId>>
    where TId : notnull
{
    public TId Id { get; protected set; }

    protected Entity(TId id)
    {
        ArgumentNullException.ThrowIfNull(id);
        Id = id;
    }

    // Required for Entity Framework Core parameterless initialization
    protected Entity()
    {
        Id = default!;
    }

    public bool Equals(Entity<TId>? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        if (GetType() != other.GetType()) return false;

        return EqualityComparer<TId>.Default.Equals(Id, other.Id);
    }

    public override bool Equals(object? obj) => Equals(obj as Entity<TId>);

    public override int GetHashCode() => EqualityComparer<TId>.Default.GetHashCode(Id);

    public static bool operator ==(Entity<TId>? a, Entity<TId>? b) =>
        a is null ? b is null : a.Equals(b);

    public static bool operator !=(Entity<TId>? a, Entity<TId>? b) => !(a == b);
}
