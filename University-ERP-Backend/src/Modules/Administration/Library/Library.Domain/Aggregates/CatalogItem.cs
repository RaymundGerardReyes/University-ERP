namespace Library.Domain.Aggregates;

using SharedKernel.Domain.Primitives;
using System;

public sealed class CatalogItem : AggregateRoot<Guid>
{
    public string Title { get; private set; } = string.Empty;
    public string Author { get; private set; } = string.Empty;
    public string Isbn { get; private set; } = string.Empty;
    public string ItemType { get; private set; } = string.Empty;
    public bool IsAvailable { get; private set; }
    public Guid? CurrentBorrowerId { get; private set; }

    private CatalogItem() { }

    private CatalogItem(Guid id, string title, string author, string isbn, string itemType) : base(id)
    {
        Title = title;
        Author = author;
        Isbn = isbn;
        ItemType = itemType;
        IsAvailable = true;
    }

    public static Result<CatalogItem> Create(string title, string author, string isbn, string itemType)
    {
        if (string.IsNullOrWhiteSpace(title))
        {
            return Result<CatalogItem>.Failure(new Error("Library.InvalidTitle", "Title is required."));
        }

        return Result<CatalogItem>.Success(new CatalogItem(Guid.NewGuid(), title, author, isbn, itemType));
    }

    public Result<bool> Checkout(Guid borrowerId)
    {
        if (!IsAvailable)
        {
            return Result<bool>.Failure(new Error("Library.ItemNotAvailable", "Item is already checked out."));
        }

        IsAvailable = false;
        CurrentBorrowerId = borrowerId;
        return Result<bool>.Success(true);
    }
}
