---
name: backend-cqrs-scaffolder
description: >-
  Scaffolds a complete CQRS vertical feature slice (Command/Query, Handler, Validator, Minimal API endpoint, and companion Unit/Integration tests) within any of the 22 backend bounded contexts in University-ERP-Backend.
---

# Backend CQRS Feature Scaffolder Skill

This skill provides step-by-step instructions and code templates for scaffolding a complete CQRS vertical feature slice in any of the 22 bounded contexts in `University-ERP-Backend`.

---

## 1. Directory Structure per Feature

When creating a new Command or Query in `src/Modules/<Domain>/<Module>/`:

```
src/Modules/<Domain>/<Module>/
├── <Module>.Application/
│   └── Features/
│       └── <FeatureName>/
│           ├── <FeatureName>Command.cs          # Command record or Query record
│           ├── <FeatureName>CommandHandler.cs   # MediatR IRequestHandler implementation
│           ├── <FeatureName>CommandValidator.cs # FluentValidation AbstractValidator
│           └── <FeatureName>ResponseDto.cs      # Optional output DTO
├── <Module>.Presentation/
│   └── Endpoints/
│       └── <FeatureName>Endpoint.cs             # Minimal API route definition
└── <Module>.Tests/
    ├── Unit/Application/
    │   └── <FeatureName>CommandHandlerTests.cs  # Isolated unit test
    └── Integration/Endpoints/
        └── <FeatureName>EndpointTests.cs        # End-to-end endpoint integration test
```

---

## 2. Command Code Templates

### A. `<FeatureName>Command.cs`
```csharp
using MediatR;
using UniversityErp.SharedKernel.Domain;

namespace UniversityErp.Modules.<Module>.Application.Features.<FeatureName>;

public sealed record <FeatureName>Command(
    Guid AggregateId,
    string ParameterName,
    decimal Amount
) : IRequest<Result<<FeatureName>ResponseDto>>;
```

### B. `<FeatureName>CommandValidator.cs`
```csharp
using FluentValidation;

namespace UniversityErp.Modules.<Module>.Application.Features.<FeatureName>;

public sealed class <FeatureName>CommandValidator : AbstractValidator<<FeatureName>Command>
{
    public <FeatureName>CommandValidator()
    {
        RuleFor(x => x.AggregateId)
            .NotEmpty().WithMessage("Aggregate ID is required.");

        RuleFor(x => x.ParameterName)
            .NotEmpty().MaximumLength(100).WithMessage("Parameter name must not exceed 100 characters.");

        RuleFor(x => x.Amount)
            .GreaterThan(0).WithMessage("Amount must be greater than zero.");
    }
}
```

### C. `<FeatureName>CommandHandler.cs`
```csharp
using MediatR;
using UniversityErp.Modules.<Module>.Application.Abstractions;
using UniversityErp.SharedKernel.Domain;

namespace UniversityErp.Modules.<Module>.Application.Features.<FeatureName>;

public sealed class <FeatureName>CommandHandler 
    : IRequestHandler<<FeatureName>Command, Result<<FeatureName>ResponseDto>>
{
    private readonly I<Module>Repository _repository;

    public <FeatureName>CommandHandler(I<Module>Repository repository)
    {
        _repository = repository;
    }

    public async Task<Result<<FeatureName>ResponseDto>> Handle(
        <FeatureName>Command request, 
        CancellationToken cancellationToken)
    {
        var aggregate = await _repository.GetByIdAsync(request.AggregateId, cancellationToken);
        if (aggregate is null)
        {
            return Result.Failure<<FeatureName>ResponseDto>(
                Error.NotFound("<Module>.NotFound", $"Record '{request.AggregateId}' was not found."));
        }

        var result = aggregate.ExecuteBusinessLogic(request.ParameterName, request.Amount);
        if (result.IsFailure)
        {
            return Result.Failure<<FeatureName>ResponseDto>(result.Error);
        }

        await _repository.SaveChangesAsync(cancellationToken);

        return Result.Success(new <FeatureName>ResponseDto(aggregate.Id, "Operation completed successfully."));
    }
}
```

---

## 3. Presentation Endpoint Mapping

Create `<FeatureName>Endpoint.cs` in `<Module>.Presentation/Endpoints/`:

```csharp
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using UniversityErp.Modules.<Module>.Application.Features.<FeatureName>;

namespace UniversityErp.Modules.<Module>.Presentation.Endpoints;

public static class <FeatureName>Endpoint
{
    public static IEndpointRouteBuilder Map<FeatureName>Endpoint(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("/api/v1/<module-slug>/<feature-slug>", async (
            <FeatureName>Command command, 
            ISender sender, 
            CancellationToken ct) =>
        {
            var result = await sender.Send(command, ct);
            return result.IsSuccess 
                ? Results.Ok(result.Value) 
                : Results.BadRequest(result.Error);
        })
        .WithName("<FeatureName>")
        .WithTags("<Module>")
        .RequireAuthorization("<Module>Policy");

        return endpoints;
    }
}
```

---

## 4. Companion Unit Test

Create in `<Module>.Tests/Unit/Application/<FeatureName>CommandHandlerTests.cs`:

```csharp
using FluentAssertions;
using NSubstitute;
using UniversityErp.Modules.<Module>.Application.Abstractions;
using UniversityErp.Modules.<Module>.Application.Features.<FeatureName>;
using Xunit;

namespace UniversityErp.Modules.<Module>.Tests.Unit.Application;

public class <FeatureName>CommandHandlerTests
{
    private readonly I<Module>Repository _repository = Substitute.For<I<Module>Repository>();
    private readonly <FeatureName>CommandHandler _handler;

    public <FeatureName>CommandHandlerTests()
    {
        _handler = new <FeatureName>CommandHandler(_repository);
    }

    [Fact]
    public async Task Handle_ShouldReturnFailure_WhenAggregateNotFound()
    {
        // Arrange
        var command = new <FeatureName>Command(Guid.NewGuid(), "Test", 100);
        _repository.GetByIdAsync(command.AggregateId, Arg.Any<CancellationToken>())
            .Returns((AggregateRoot)null!);

        // Act
        var result = await _handler.Handle(command, CancellationToken.None);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Code.Should().Be("<Module>.NotFound");
    }
}
```

