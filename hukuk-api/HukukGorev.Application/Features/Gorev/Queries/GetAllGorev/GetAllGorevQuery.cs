using AutoMapper;
using AutoMapper.QueryableExtensions;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;
using HukukGorev.Application.Abstraction;

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
    private readonly IUserPermissionService _userPermissionService;

    public GetAllGorevHandler(IUnitOfWork unitOfWork, IMapper mapper, IUserPermissionService userPermissionService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userPermissionService = userPermissionService;
    }

    public async Task<List<GorevDto>> Handle(GetAllGorevRequest request, CancellationToken cancellationToken)
    {
        var currentUserId = await _userPermissionService.GetCurrentUserId();
        var isManagerOrAdmin = await _userPermissionService.HasPermission(currentUserId, "Admin");

        var query = _unitOfWork.GorevReadRepository.GetAllQueryable()
            .Where(g => g.Aktif);

        // Hierarchical filtering for non-admin users
        if (!isManagerOrAdmin)
        {
            var subordinateIds = await _userPermissionService.GetSubordinateIdsAsync(currentUserId);
            var visibleUserIds = new List<int>(subordinateIds) { currentUserId };
            
            query = query.Where(g => g.AtananKullaniciId.HasValue && visibleUserIds.Contains(g.AtananKullaniciId.Value));
        }

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

        return await query
            .OrderByDescending(g => g.CreatedAt)
            .ProjectTo<GorevDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);
    }
}
