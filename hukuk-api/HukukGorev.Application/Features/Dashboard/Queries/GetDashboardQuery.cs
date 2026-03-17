using AutoMapper;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Application.Features.Dashboard.Queries;

public class GetDashboardRequest : IRequest<DashboardDto>
{
    public int? KullaniciId { get; set; }
    public int? GrupId { get; set; }
}

public class GetDashboardHandler : IRequestHandler<GetDashboardRequest, DashboardDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetDashboardHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<DashboardDto> Handle(GetDashboardRequest request, CancellationToken cancellationToken)
    {
        var query = _unitOfWork.GorevReadRepository.GetAllQueryable().Where(g => g.Aktif);

        if (request.KullaniciId.HasValue)
            query = query.Where(g => g.AtananKullaniciId == request.KullaniciId || g.UzerineAlanKullaniciId == request.KullaniciId);

        if (request.GrupId.HasValue)
            query = query.Where(g => g.AtananGrupId == request.GrupId);

        var gorevler = await query.ToListAsync(cancellationToken);

        var tamamlananGorevler = gorevler.Where(g => g.Durum == GorevDurumu.Tamamlandi && g.TamamlanmaTarihi.HasValue).ToList();
        var ortalamaKapanma = tamamlananGorevler.Any()
            ? tamamlananGorevler.Average(g => (g.TamamlanmaTarihi!.Value - g.CreatedAt).TotalDays)
            : 0;

        // Grup istatistikleri
        var grupIstatistikleri = await _unitOfWork.GrupReadRepository.GetAllQueryable()
            .Where(g => g.Aktif)
            .Select(g => new GrupGorevIstatistikDto
            {
                GrupAdi = g.Ad,
                ToplamGorev = g.Gorevler.Count(go => go.Aktif),
                TamamlananGorev = g.Gorevler.Count(go => go.Aktif && go.Durum == GorevDurumu.Tamamlandi),
                DevamEdenGorev = g.Gorevler.Count(go => go.Aktif && go.Durum == GorevDurumu.DevamEdiyor)
            })
            .ToListAsync(cancellationToken);

        // Kişi istatistikleri
        var kisiIstatistikleri = await _unitOfWork.KullaniciReadRepository.GetAllQueryable()
            .Where(k => k.Aktif)
            .Select(k => new KisiGorevIstatistikDto
            {
                KullaniciAdi = k.Ad + " " + k.Soyad,
                ToplamGorev = k.AtananGorevler.Count(g => g.Aktif),
                TamamlananGorev = k.AtananGorevler.Count(g => g.Aktif && g.Durum == GorevDurumu.Tamamlandi),
                DevamEdenGorev = k.AtananGorevler.Count(g => g.Aktif && g.Durum == GorevDurumu.DevamEdiyor)
            })
            .Where(k => k.ToplamGorev > 0)
            .ToListAsync(cancellationToken);

        // Öncelik istatistikleri
        var oncelikIstatistikleri = gorevler
            .GroupBy(g => g.Oncelik)
            .Select(g => new OncelikGorevIstatistikDto
            {
                OncelikAdi = g.Key.ToString(),
                Adet = g.Count()
            }).ToList();

        // Tip istatistikleri
        var tipIstatistikleri = gorevler
            .GroupBy(g => g.GorevTipiId)
            .Select(g => new GorevTipiIstatistikDto
            {
                TipAdi = g.FirstOrDefault()?.GorevTipi?.Ad ?? "Tanımsız",
                Adet = g.Count()
            }).ToList();

        // Son 7 günlük trend
        var sonYediGun = Enumerable.Range(0, 7)
            .Select(i => DateTime.UtcNow.Date.AddDays(-i))
            .Reverse()
            .ToList();

        var trendIstatistikleri = sonYediGun.Select(tarih => new GunlukGorevIstatistikDto
        {
            Tarih = tarih.ToString("dd/MM"),
            Olusturulan = gorevler.Count(g => g.CreatedAt.Date == tarih),
            Tamamlanan = gorevler.Count(g => g.TamamlanmaTarihi.HasValue && g.TamamlanmaTarihi.Value.Date == tarih)
        }).ToList();

        return new DashboardDto
        {
            ToplamGorev = gorevler.Count,
            AcikGorev = gorevler.Count(g => g.Durum == GorevDurumu.YeniAtandi),
            DevamEdenGorev = gorevler.Count(g => g.Durum == GorevDurumu.DevamEdiyor),
            TamamlananGorev = gorevler.Count(g => g.Durum == GorevDurumu.Tamamlandi),
            GecikenGorev = gorevler.Count(g => g.BitisTarihi.HasValue && g.BitisTarihi < DateTime.UtcNow && g.Durum != GorevDurumu.Tamamlandi && g.Durum != GorevDurumu.Iptal),
            OrtalamaKapanmaSuresiGun = Math.Round(ortalamaKapanma, 1),
            GrupIstatistikleri = grupIstatistikleri,
            KisiIstatistikleri = kisiIstatistikleri,
            OncelikIstatistikleri = oncelikIstatistikleri,
            GorevTipiIstatistikleri = tipIstatistikleri,
            GunlukGorevIstatistikleri = trendIstatistikleri
        };
    }
}
