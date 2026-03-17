using HukukGorev.Application.Abstraction;
using HukukGorev.Application.Exceptions;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Enums;
using MediatR;

namespace HukukGorev.Application.Features.Gorev.Commands.UpdateGorev;

public class UpdateGorevHandler : IRequestHandler<UpdateGorevRequest, UpdateGorevResponse>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserPermissionService _userPermissionService;

    public UpdateGorevHandler(IUnitOfWork unitOfWork, IUserPermissionService userPermissionService)
    {
        _unitOfWork = unitOfWork;
        _userPermissionService = userPermissionService;
    }

    public async Task<UpdateGorevResponse> Handle(UpdateGorevRequest request, CancellationToken cancellationToken)
    {
        var gorev = await _unitOfWork.GorevReadRepository.GetByIdAsync(request.Id);
        if (gorev == null)
            throw new NotFoundException("Görev", request.Id);

        var currentUserId = await _userPermissionService.GetCurrentUserId();
        bool atamaDeğişti = gorev.AtananKullaniciId != request.AtananKullaniciId || gorev.AtananGrupId != request.AtananGrupId;

        gorev.Baslik = request.Baslik;
        gorev.Aciklama = request.Aciklama;
        gorev.Oncelik = request.Oncelik;
        gorev.Durum = request.Durum;
        gorev.AtamaTipi = request.AtamaTipi;
        gorev.BaslangicTarihi = request.BaslangicTarihi;
        gorev.BitisTarihi = request.BitisTarihi;
        gorev.TamamlanmaTarihi = request.TamamlanmaTarihi;
        gorev.GorevTipiId = request.GorevTipiId;
        gorev.AtananKullaniciId = request.AtananKullaniciId;
        gorev.AtananGrupId = request.AtananGrupId;

        _unitOfWork.GorevWriteRepository.Update(gorev);

        // Etiketleri güncelle
        if (request.EtiketIds != null)
        {
            var mevcutEtiketler = _unitOfWork.GorevEtiketReadRepository.GetWhere(ge => ge.GorevId == gorev.Id).ToList();
            _unitOfWork.GorevEtiketWriteRepository.RemoveRange(mevcutEtiketler);
            foreach (var etiketId in request.EtiketIds)
            {
                await _unitOfWork.GorevEtiketWriteRepository.AddAsync(new GorevEtiket
                {
                    GorevId = gorev.Id,
                    EtiketId = etiketId
                });
            }
        }

        // Atama değiştiyse log ve bildirim
        if (atamaDeğişti)
        {
            await _unitOfWork.GorevAtamaLogWriteRepository.AddAsync(new GorevAtamaLog
            {
                GorevId = gorev.Id,
                AtamaTarihi = DateTime.UtcNow,
                AtamaTipi = request.AtamaTipi,
                AtananKullaniciId = request.AtananKullaniciId,
                AtananGrupId = request.AtananGrupId,
                AtayanKullaniciId = currentUserId,
                Aciklama = "Görev yeniden atandı"
            });

            if (request.AtananKullaniciId.HasValue)
            {
                await _unitOfWork.BildirimWriteRepository.AddAsync(new Bildirim
                {
                    Baslik = "Görev Size Atandı",
                    Mesaj = $"'{gorev.Baslik}' görevi size atandı.",
                    Tip = BildirimTipi.Atama,
                    KullaniciId = request.AtananKullaniciId.Value,
                    GorevId = gorev.Id
                });
            }
        }

        await _unitOfWork.SaveChangesAsync();

        return new UpdateGorevResponse { Basarili = true, Mesaj = "Görev başarıyla güncellendi." };
    }
}
