using FluentValidation;
using HukukGorev.Application.Features.Auth.Commands;
using HukukGorev.Application.Features.Gorev.Commands.CreateGorev;
using HukukGorev.Application.Features.Gorev.Commands.UpdateGorev;

namespace HukukGorev.Application.Validators;

public class CreateGorevValidator : AbstractValidator<CreateGorevRequest>
{
    public CreateGorevValidator()
    {
        RuleFor(x => x.Baslik).NotEmpty().WithMessage("Başlık zorunludur.").MaximumLength(500);
        RuleFor(x => x.Aciklama).MaximumLength(5000);
        RuleFor(x => x.Oncelik).IsInEnum().WithMessage("Geçersiz öncelik seviyesi.");
        RuleFor(x => x.AtamaTipi).IsInEnum().WithMessage("Geçersiz atama tipi.");
    }
}

public class UpdateGorevValidator : AbstractValidator<UpdateGorevRequest>
{
    public UpdateGorevValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);
        RuleFor(x => x.Baslik).NotEmpty().WithMessage("Başlık zorunludur.").MaximumLength(500);
        RuleFor(x => x.Durum).IsInEnum().WithMessage("Geçersiz durum.");
        RuleFor(x => x.Oncelik).IsInEnum().WithMessage("Geçersiz öncelik seviyesi.");
    }
}

public class LoginValidator : AbstractValidator<LoginRequest>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        RuleFor(x => x.Sifre).NotEmpty().WithMessage("Şifre zorunludur.");
    }
}

public class RegisterValidator : AbstractValidator<RegisterRequest>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Ad).NotEmpty().WithMessage("Ad zorunludur.");
        RuleFor(x => x.Soyad).NotEmpty().WithMessage("Soyad zorunludur.");
        RuleFor(x => x.Email).NotEmpty().EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");
        RuleFor(x => x.Sifre).NotEmpty().MinimumLength(6).WithMessage("Şifre en az 6 karakter olmalıdır.");
    }
}
