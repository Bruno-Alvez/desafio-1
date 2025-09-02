using FluentValidation;
using Hypesoft.Application.Commands.Products;

namespace Hypesoft.Application.Validators;

public class UpdateProductCommandValidator : AbstractValidator<UpdateProductCommand>
{
    public UpdateProductCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Product ID is required");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .MaximumLength(1000).WithMessage("Description cannot exceed 1000 characters");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0")
            .LessThan(1000000).WithMessage("Price cannot exceed 1,000,000");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("Category is required");

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0).WithMessage("Stock quantity cannot be negative");

        RuleFor(x => x.MinimumStock)
            .GreaterThanOrEqualTo(0).WithMessage("Minimum stock cannot be negative");

        RuleFor(x => x.Sku)
            .NotEmpty().WithMessage("SKU is required")
            .MaximumLength(50).WithMessage("SKU cannot exceed 50 characters")
            .Matches("^[A-Z0-9\\-_]+$").WithMessage("SKU must contain only uppercase letters, numbers, hyphens, and underscores");

        RuleFor(x => x.Barcode)
            .MaximumLength(50).WithMessage("Barcode cannot exceed 50 characters")
            .Matches("^[0-9]+$").WithMessage("Barcode must contain only numbers")
            .When(x => !string.IsNullOrEmpty(x.Barcode));

        RuleFor(x => x.Weight)
            .GreaterThan(0).WithMessage("Weight must be greater than 0")
            .When(x => x.Weight.HasValue);

        RuleFor(x => x.Dimensions)
            .SetValidator(new ProductDimensionsValidator()!)
            .When(x => x.Dimensions != null);
    }
}

