using HukukGorev.Application.Abstraction;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Enums;
using MediatR;

namespace HukukGorev.Application.Features.AltGorev.Commands;

// ===== Create =====
public class CreateAltGorevRequest : IRequest<CreateAltGorevResponse>
{
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public DateTime? TahminibitisTarihi { get; set; }
    public int GorevId { get; set; }
    public int? AtananKullaniciId { get; set; }
}

public class CreateAltGorevResponse
{
    public int Id { get; set; }
    public bool Basarili { get; set; }
    public string? Mesaj { get; set; }
}

public class CreateAltGorevHandler : IRequestHandler<CreateAltGorevRequest, CreateAltGorevResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserPermissionService _userPermissionService;

    public CreateAltGorevHandler(IUnitOfWork unitOfWork, IUserPermissionService userPermissionService)
    {
        _unitOfWork = unitOfWork;
        _userPermissionService = userPermissionService;
    }

    public async Task<CreateAltGorevResponse> Handle(CreateAltGorevRequest request, CancellationToken cancellationToken)
    {
        var currentUserId = await _userPermissionService.GetCurrentUserId();
        var altGorev = new Domain.Entities.AltGorev
        {
            Baslik = request.Baslik,
            Aciklama = request.Aciklama,
            TahminibitisTarihi = request.TahminibitisTarihi,
            GorevId = request.GorevId,
            AtananKullaniciId = request.AtananKullaniciId,
            Durum = GorevDurumu.YeniAtandi
        };

        await _unitOfWork.AltGorevWriteRepository.AddAsync(altGorev);

        if (request.AtananKullaniciId.HasValue)
        {
            await _unitOfWork.GorevAtamaLogWriteRepository.AddAsync(new GorevAtamaLog
            {
                AltGorevId = altGorev.Id,
                GorevId = request.GorevId,
                AtamaTarihi = DateTime.UtcNow,
                AtamaTipi = AtamaTipi.Kisi,
                AtananKullaniciId = request.AtananKullaniciId,
                AtayanKullaniciId = currentUserId,
                Aciklama = "Alt görev oluşturuldu ve atandı"
            });

            await _unitOfWork.BildirimWriteRepository.AddAsync(new Bildirim
            {
                Baslik = "Yeni Alt Görev Atandı",
                Mesaj = $"'{altGorev.Baslik}' alt görevi size atandı.",
                Tip = BildirimTipi.Atama,
                KullaniciId = request.AtananKullaniciId.Value,
                GorevId = request.GorevId
            });
        }

        await _unitOfWork.SaveChangesAsync();
        return new CreateAltGorevResponse { Id = altGorev.Id, Basarili = true, Mesaj = "Alt görev oluşturuldu." };
    }
}

// ===== Update =====
public class UpdateAltGorevRequest : IRequest<UpdateAltGorevResponse>
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public GorevDurumu Durum { get; set; }
    public DateTime? TahminibitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }
    public int? AtananKullaniciId { get; set; }
}

public class UpdateAltGorevResponse { public bool Basarili { get; set; } public string? Mesaj { get; set; } }

public class UpdateAltGorevHandler : IRequestHandler<UpdateAltGorevRequest, UpdateAltGorevResponse>
{
    private readonly IUnitOfWork _unitOfWork;

    public UpdateAltGorevHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<UpdateAltGorevResponse> Handle(UpdateAltGorevRequest request, CancellationToken cancellationToken)
    {
        var altGorev = await _unitOfWork.AltGorevReadRepository.GetByIdAsync(request.Id);
        if (altGorev == null) throw new Exceptions.NotFoundException("Alt Görev", request.Id);

        altGorev.Baslik = request.Baslik;
        altGorev.Aciklama = request.Aciklama;
        altGorev.Durum = request.Durum;
        altGorev.TahminibitisTarihi = request.TahminibitisTarihi;
        altGorev.TamamlanmaTarihi = request.TamamlanmaTarihi;
        altGorev.AtananKullaniciId = request.AtananKullaniciId;

        _unitOfWork.AltGorevWriteRepository.Update(altGorev);
        await _unitOfWork.SaveChangesAsync();
        return new UpdateAltGorevResponse { Basarili = true, Mesaj = "Alt görev güncellendi." };
    }
}

// ===== Delete =====
public class DeleteAltGorevRequest : IRequest<DeleteAltGorevResponse> { public int Id { get; set; } }
public class DeleteAltGorevResponse { public bool Basarili { get; set; } public string? Mesaj { get; set; } }

public class DeleteAltGorevHandler : IRequestHandler<DeleteAltGorevRequest, DeleteAltGorevResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    public DeleteAltGorevHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<DeleteAltGorevResponse> Handle(DeleteAltGorevRequest request, CancellationToken cancellationToken)
    {
        var altGorev = await _unitOfWork.AltGorevReadRepository.GetByIdAsync(request.Id);
        if (altGorev == null) throw new Exceptions.NotFoundException("Alt Görev", request.Id);
        _unitOfWork.AltGorevWriteRepository.Remove(altGorev);
        await _unitOfWork.SaveChangesAsync();
        return new DeleteAltGorevResponse { Basarili = true, Mesaj = "Alt görev silindi." };
    }
}
