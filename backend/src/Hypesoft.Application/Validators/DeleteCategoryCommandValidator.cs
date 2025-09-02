using FluentValidation;
using Hypesoft.Application.Commands.Categories;

namespace Hypesoft.Application.Validators;

public class DeleteCategoryCommandValidator : AbstractValidator<DeleteCategoryCommand>
{
    public DeleteCategoryCommandValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Category ID is required");
    }
}

