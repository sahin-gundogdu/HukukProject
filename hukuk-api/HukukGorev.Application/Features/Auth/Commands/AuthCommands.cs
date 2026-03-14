using HukukGorev.Application.Abstraction;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.Exceptions;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Application.Features.Auth.Commands;

// ===== Login =====
public class LoginRequest : IRequest<LoginResponseDto>
{
    public string Email { get; set; } = null!;
    public string Sifre { get; set; } = null!;
}

public class LoginHandler : IRequestHandler<LoginRequest, LoginResponseDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenHandler _tokenHandler;
    private readonly global::AutoMapper.IMapper _mapper;

    public LoginHandler(IUnitOfWork unitOfWork, ITokenHandler tokenHandler, global::AutoMapper.IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _tokenHandler = tokenHandler;
        _mapper = mapper;
    }

    public async Task<LoginResponseDto> Handle(LoginRequest request, CancellationToken cancellationToken)
    {
        var kullanici = await _unitOfWork.KullaniciReadRepository
           .GetAllQueryable()
           .Include(k => k.KullaniciGruplari).ThenInclude(kg => kg.Grup)
           .FirstOrDefaultAsync(k => k.Email == request.Email && k.Aktif, cancellationToken);

        if (kullanici == null)
            throw new UnauthorizedException("Geçersiz e-posta veya şifre.");

        // Basit hash karşılaştırma — production'da BCrypt/Argon2 kullanın
        if (!BCryptVerify(request.Sifre, kullanici.SifreHash))
            throw new UnauthorizedException("Geçersiz e-posta veya şifre.");

        var token = _tokenHandler.CreateAccessToken(kullanici.Id, kullanici.Email, kullanici.Rol.ToString());

        return new LoginResponseDto
        {
            Token = token.AccessToken,
            Kullanici = _mapper.Map<KullaniciDto>(kullanici)
        };

    }

    private static bool BCryptVerify(string password, string hash)
    {
        // Basit SHA256 karşılaştırma — production'da BCrypt kullanılmalı
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
        var hashString = Convert.ToBase64String(hashBytes);
        return hashString == hash;
    }
}

// ===== Register =====
public class RegisterRequest : IRequest<RegisterResponse>
{
    public string Ad { get; set; } = null!;
    public string Soyad { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Sifre { get; set; } = null!;
    public KullaniciRolu Rol { get; set; } = KullaniciRolu.Kullanici;
    public int? YoneticiId { get; set; }
    public List<int>? GrupIds { get; set; }
}

public class RegisterResponse { public int Id { get; set; } public bool Basarili { get; set; } public string? Mesaj { get; set; } }

public class RegisterHandler : IRequestHandler<RegisterRequest, RegisterResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public RegisterHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<RegisterResponse> Handle(RegisterRequest request, CancellationToken cancellationToken)
    {
        var existing = await _unitOfWork.KullaniciReadRepository.GetSingleAsync(k => k.Email == request.Email);
        if (existing != null)
            throw new ConflictException("Bu e-posta adresi zaten kayıtlı.");

        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(request.Sifre));
        var hashString = Convert.ToBase64String(hashBytes);

        var kullanici = new Kullanici
        {
            Ad = request.Ad,
            Soyad = request.Soyad,
            Email = request.Email,
            SifreHash = hashString,
            Rol = request.Rol,
            YoneticiId = request.YoneticiId
        };

        await _unitOfWork.KullaniciWriteRepository.AddAsync(kullanici);
        await _unitOfWork.SaveChangesAsync();

        if (request.GrupIds?.Any() == true)
        {
            foreach (var grupId in request.GrupIds)
            {
                await _unitOfWork.KullaniciGrupWriteRepository.AddAsync(new KullaniciGrup
                {
                    KullaniciId = kullanici.Id,
                    GrupId = grupId
                });
            }
            await _unitOfWork.SaveChangesAsync();
        }

        return new RegisterResponse { Id = kullanici.Id, Basarili = true, Mesaj = "Kullanıcı başarıyla oluşturuldu." };
    }
}
