using HukukGorev.Application.Abstraction;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Enums;
using MediatR;

namespace HukukGorev.Application.Features.Gorev.Commands.CreateGorev;

public class CreateGorevHandler : IRequestHandler<CreateGorevRequest, CreateGorevResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserPermissionService _userPermissionService;

    public CreateGorevHandler(IUnitOfWork unitOfWork, IUserPermissionService userPermissionService)
    {
        _unitOfWork = unitOfWork;
        _userPermissionService = userPermissionService;
    }

    public async Task<CreateGorevResponse> Handle(CreateGorevRequest request, CancellationToken cancellationToken)
    {
        var currentUserId = await _userPermissionService.GetCurrentUserId();

        var gorev = new Domain.Entities.Gorev
        {
            Baslik = request.Baslik,
            Aciklama = request.Aciklama,
            Oncelik = request.Oncelik,
            Durum = GorevDurumu.YeniAtandi,
            AtamaTipi = request.AtamaTipi,
            BitisTarihi = request.BitisTarihi,
            GorevTipiId = request.GorevTipiId,
            AtananKullaniciId = request.AtananKullaniciId,
            AtananGrupId = request.AtananGrupId,
            OlusturanKullaniciId = currentUserId
        };

        await _unitOfWork.GorevWriteRepository.AddAsync(gorev);
        await _unitOfWork.SaveChangesAsync();

        // Etiketleri ekle
        if (request.EtiketIds?.Any() == true)
        {
            foreach (var etiketId in request.EtiketIds)
            {
                await _unitOfWork.GorevEtiketWriteRepository.AddAsync(new GorevEtiket
                {
                    GorevId = gorev.Id,
                    EtiketId = etiketId
                });
            }
        }

        // Atama logunu oluştur
        await _unitOfWork.GorevAtamaLogWriteRepository.AddAsync(new GorevAtamaLog
        {
            GorevId = gorev.Id,
            AtamaTarihi = DateTime.UtcNow,
            AtamaTipi = request.AtamaTipi,
            AtananKullaniciId = request.AtananKullaniciId,
            AtananGrupId = request.AtananGrupId,
            AtayanKullaniciId = currentUserId,
            Aciklama = "Görev oluşturuldu"
        });

        // Bildirim oluştur
        if (request.AtananKullaniciId.HasValue)
        {
            await _unitOfWork.BildirimWriteRepository.AddAsync(new Bildirim
            {
                Baslik = "Yeni Görev Atandı",
                Mesaj = $"'{gorev.Baslik}' görevi size atandı.",
                Tip = BildirimTipi.Atama,
                KullaniciId = request.AtananKullaniciId.Value,
                GorevId = gorev.Id
            });
        }
        else if (request.AtananGrupId.HasValue)
        {
            // Gruptaki tüm kullanıcılara bildirim gönder
            var grupUyeleri = _unitOfWork.KullaniciGrupReadRepository
                .GetWhere(kg => kg.GrupId == request.AtananGrupId.Value);
            foreach (var uye in grupUyeleri)
            {
                await _unitOfWork.BildirimWriteRepository.AddAsync(new Bildirim
                {
                    Baslik = "Grubunuza Yeni Görev Atandı",
                    Mesaj = $"'{gorev.Baslik}' görevi grubunuza atandı.",
                    Tip = BildirimTipi.Atama,
                    KullaniciId = uye.KullaniciId,
                    GorevId = gorev.Id
                });
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return new CreateGorevResponse
        {
            Id = gorev.Id,
            Basarili = true,
            Mesaj = "Görev başarıyla oluşturuldu."
        };
    }
}
