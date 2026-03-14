using AutoMapper;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Application.Features.Gorev.Queries.GetAllGorev;

public class GetAllGorevRequest : IRequest<List<GorevDto>>
{
    public GorevDurumu? Durum { get; set; }
    public OncelikSeviyesi? Oncelik { get; set; }
    public int? AtananKullaniciId { get; set; }
    public int? AtananGrupId { get; set; }
    public int? GorevTipiId { get; set; }
    public DateTime? BaslangicTarihi { get; set; }
    public DateTime? BitisTarihi { get; set; }
    public string? AramaMetni { get; set; }
    public bool? SadeceGecikenler { get; set; }
}

public class GetAllGorevHandler : IRequestHandler<GetAllGorevRequest, List<GorevDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllGorevHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<List<GorevDto>> Handle(GetAllGorevRequest request, CancellationToken cancellationToken)
    {
        var query = _unitOfWork.GorevReadRepository.GetAllQueryable()
            .Include(g => g.GorevTipi)
            .Include(g => g.AtananKullanici)
            .Include(g => g.AtananGrup)
            .Include(g => g.OlusturanKullanici)
            .Include(g => g.UzerineAlanKullanici)
            .Include(g => g.AltGorevler)
            .Include(g => g.Yorumlar)
            .Include(g => g.Dosyalar)
            .Include(g => g.GorevEtiketler).ThenInclude(ge => ge.Etiket)
            .Where(g => g.Aktif);

        if (request.Durum.HasValue)
            query = query.Where(g => g.Durum == request.Durum.Value);

        if (request.Oncelik.HasValue)
            query = query.Where(g => g.Oncelik == request.Oncelik.Value);

        if (request.AtananKullaniciId.HasValue)
            query = query.Where(g => g.AtananKullaniciId == request.AtananKullaniciId.Value);

        if (request.AtananGrupId.HasValue)
            query = query.Where(g => g.AtananGrupId == request.AtananGrupId.Value);

        if (request.GorevTipiId.HasValue)
            query = query.Where(g => g.GorevTipiId == request.GorevTipiId.Value);

        if (request.BaslangicTarihi.HasValue)
            query = query.Where(g => g.CreatedAt >= request.BaslangicTarihi.Value);

        if (request.BitisTarihi.HasValue)
            query = query.Where(g => g.BitisTarihi <= request.BitisTarihi.Value);

        if (!string.IsNullOrWhiteSpace(request.AramaMetni))
            query = query.Where(g => g.Baslik.Contains(request.AramaMetni) || (g.Aciklama != null && g.Aciklama.Contains(request.AramaMetni)));

        if (request.SadeceGecikenler == true)
            query = query.Where(g => g.BitisTarihi.HasValue && g.BitisTarihi < DateTime.UtcNow && g.Durum != GorevDurumu.Tamamlandi && g.Durum != GorevDurumu.Iptal);

        var gorevler = await query.OrderByDescending(g => g.CreatedAt).ToListAsync(cancellationToken);
        return _mapper.Map<List<GorevDto>>(gorevler);
    }
}
