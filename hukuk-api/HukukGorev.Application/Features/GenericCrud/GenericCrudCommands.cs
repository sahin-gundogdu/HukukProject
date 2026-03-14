using AutoMapper;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.Exceptions;
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Domain.Entities;
using HukukGorev.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Application.Features.GenericCrud;

// ===== GorevYorum Commands =====
public class CreateGorevYorumRequest : IRequest<GorevYorumDto> { public int GorevId { get; set; } public string Icerik { get; set; } = null!; public int KullaniciId { get; set; } }
public class CreateGorevYorumHandler : IRequestHandler<CreateGorevYorumRequest, GorevYorumDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public CreateGorevYorumHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<GorevYorumDto> Handle(CreateGorevYorumRequest r, CancellationToken ct)
    {
        var yorum = new GorevYorum { GorevId = r.GorevId, Icerik = r.Icerik, KullaniciId = r.KullaniciId };
        await _uow.GorevYorumWriteRepository.AddAsync(yorum);
        await _uow.SaveChangesAsync();
        var loaded = await _uow.GorevYorumReadRepository.GetAllQueryable().Include(y => y.Kullanici).FirstAsync(y => y.Id == yorum.Id, ct);
        return _mapper.Map<GorevYorumDto>(loaded);
    }
}

// ===== Grup Commands =====
public class CreateGrupRequest : IRequest<GrupDto> { public string Ad { get; set; } = null!; public string? Aciklama { get; set; } }
public class CreateGrupHandler : IRequestHandler<CreateGrupRequest, GrupDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public CreateGrupHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<GrupDto> Handle(CreateGrupRequest r, CancellationToken ct)
    {
        var grup = new Grup { Ad = r.Ad, Aciklama = r.Aciklama };
        await _uow.GrupWriteRepository.AddAsync(grup);
        await _uow.SaveChangesAsync();
        return _mapper.Map<GrupDto>(grup);
    }
}

public class UpdateGrupRequest : IRequest<GrupDto> { public int Id { get; set; } public string Ad { get; set; } = null!; public string? Aciklama { get; set; } }
public class UpdateGrupHandler : IRequestHandler<UpdateGrupRequest, GrupDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public UpdateGrupHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<GrupDto> Handle(UpdateGrupRequest r, CancellationToken ct)
    {
        var g = await _uow.GrupReadRepository.GetByIdAsync(r.Id) ?? throw new NotFoundException("Grup", r.Id);
        g.Ad = r.Ad; g.Aciklama = r.Aciklama;
        _uow.GrupWriteRepository.Update(g);
        await _uow.SaveChangesAsync();
        return _mapper.Map<GrupDto>(g);
    }
}

public class GetAllGrupRequest : IRequest<List<GrupDto>> { }
public class GetAllGrupHandler : IRequestHandler<GetAllGrupRequest, List<GrupDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetAllGrupHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<GrupDto>> Handle(GetAllGrupRequest r, CancellationToken ct)
    {
        var list = await _uow.GrupReadRepository.GetAllQueryable().Include(g => g.KullaniciGruplari).Where(g => g.Aktif).ToListAsync(ct);
        return _mapper.Map<List<GrupDto>>(list);
    }
}

public class DeleteGrupRequest : IRequest<bool> { public int Id { get; set; } }
public class DeleteGrupHandler : IRequestHandler<DeleteGrupRequest, bool>
{
    private readonly IUnitOfWork _uow;
    public DeleteGrupHandler(IUnitOfWork uow) { _uow = uow; }
    public async Task<bool> Handle(DeleteGrupRequest r, CancellationToken ct)
    {
        var g = await _uow.GrupReadRepository.GetByIdAsync(r.Id) ?? throw new NotFoundException("Grup", r.Id);
        g.Aktif = false;
        _uow.GrupWriteRepository.Update(g);
        await _uow.SaveChangesAsync();
        return true;
    }
}

// ===== GorevTipi Commands =====
public class CreateGorevTipiRequest : IRequest<GorevTipiDto> { public string Ad { get; set; } = null!; public string? Aciklama { get; set; } }
public class CreateGorevTipiHandler : IRequestHandler<CreateGorevTipiRequest, GorevTipiDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public CreateGorevTipiHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<GorevTipiDto> Handle(CreateGorevTipiRequest r, CancellationToken ct)
    {
        var t = new GorevTipi { Ad = r.Ad, Aciklama = r.Aciklama };
        await _uow.GorevTipiWriteRepository.AddAsync(t); await _uow.SaveChangesAsync();
        return _mapper.Map<GorevTipiDto>(t);
    }
}

public class GetAllGorevTipiRequest : IRequest<List<GorevTipiDto>> { }
public class GetAllGorevTipiHandler : IRequestHandler<GetAllGorevTipiRequest, List<GorevTipiDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetAllGorevTipiHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<GorevTipiDto>> Handle(GetAllGorevTipiRequest r, CancellationToken ct)
    {
        var list = await _uow.GorevTipiReadRepository.GetAll().Where(t => t.Aktif).ToListAsync(ct);
        return _mapper.Map<List<GorevTipiDto>>(list);
    }
}

// ===== Etiket Commands =====
public class CreateEtiketRequest : IRequest<EtiketDto> { public string Ad { get; set; } = null!; public string? Renk { get; set; } }
public class CreateEtiketHandler : IRequestHandler<CreateEtiketRequest, EtiketDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public CreateEtiketHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<EtiketDto> Handle(CreateEtiketRequest r, CancellationToken ct)
    {
        var e = new Etiket { Ad = r.Ad, Renk = r.Renk };
        await _uow.EtiketWriteRepository.AddAsync(e); await _uow.SaveChangesAsync();
        return _mapper.Map<EtiketDto>(e);
    }
}

public class GetAllEtiketRequest : IRequest<List<EtiketDto>> { }
public class GetAllEtiketHandler : IRequestHandler<GetAllEtiketRequest, List<EtiketDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetAllEtiketHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<EtiketDto>> Handle(GetAllEtiketRequest r, CancellationToken ct)
    {
        var list = await _uow.EtiketReadRepository.GetAll().Where(e => e.Aktif).ToListAsync(ct);
        return _mapper.Map<List<EtiketDto>>(list);
    }
}

// ===== Bildirim Queries =====
public class GetBildirimlerRequest : IRequest<List<BildirimDto>> { public int KullaniciId { get; set; } public bool? SadeceOkunmamis { get; set; } }
public class GetBildirimlerHandler : IRequestHandler<GetBildirimlerRequest, List<BildirimDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetBildirimlerHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<BildirimDto>> Handle(GetBildirimlerRequest r, CancellationToken ct)
    {
        var query = _uow.BildirimReadRepository.GetAllQueryable().Where(b => b.KullaniciId == r.KullaniciId && b.Aktif);
        if (r.SadeceOkunmamis == true) query = query.Where(b => !b.Okundu);
        var list = await query.OrderByDescending(b => b.CreatedAt).ToListAsync(ct);
        return _mapper.Map<List<BildirimDto>>(list);
    }
}

public class MarkBildirimOkunduRequest : IRequest<bool> { public int Id { get; set; } }
public class MarkBildirimOkunduHandler : IRequestHandler<MarkBildirimOkunduRequest, bool>
{
    private readonly IUnitOfWork _uow;
    public MarkBildirimOkunduHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(MarkBildirimOkunduRequest r, CancellationToken ct)
    {
        var b = await _uow.BildirimReadRepository.GetByIdAsync(r.Id);
        if (b == null) return false;
        b.Okundu = true;
        _uow.BildirimWriteRepository.Update(b);
        await _uow.SaveChangesAsync();
        return true;
    }
}

// ===== Ayar Commands =====
public class GetAllAyarRequest : IRequest<List<AyarDto>> { }
public class GetAllAyarHandler : IRequestHandler<GetAllAyarRequest, List<AyarDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetAllAyarHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<AyarDto>> Handle(GetAllAyarRequest r, CancellationToken ct)
    {
        var list = await _uow.AyarReadRepository.GetAll().Where(a => a.Aktif).ToListAsync(ct);
        return _mapper.Map<List<AyarDto>>(list);
    }
}

public class UpdateAyarRequest : IRequest<AyarDto> { public int Id { get; set; } public string Deger { get; set; } = null!; }
public class UpdateAyarHandler : IRequestHandler<UpdateAyarRequest, AyarDto>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public UpdateAyarHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<AyarDto> Handle(UpdateAyarRequest r, CancellationToken ct)
    {
        var a = await _uow.AyarReadRepository.GetByIdAsync(r.Id) ?? throw new NotFoundException("Ayar", r.Id);
        a.Deger = r.Deger;
        _uow.AyarWriteRepository.Update(a);
        await _uow.SaveChangesAsync();
        return _mapper.Map<AyarDto>(a);
    }
}

// ===== Kullanici Queries =====
public class GetAllKullaniciRequest : IRequest<List<KullaniciDto>> { }
public class GetAllKullaniciHandler : IRequestHandler<GetAllKullaniciRequest, List<KullaniciDto>>
{
    private readonly IUnitOfWork _uow; private readonly IMapper _mapper;
    public GetAllKullaniciHandler(IUnitOfWork uow, IMapper mapper) { _uow = uow; _mapper = mapper; }
    public async Task<List<KullaniciDto>> Handle(GetAllKullaniciRequest r, CancellationToken ct)
    {
        var list = await _uow.KullaniciReadRepository.GetAllQueryable().Include(k => k.KullaniciGruplari).ThenInclude(kg => kg.Grup).Where(k => k.Aktif).ToListAsync(ct);
        return _mapper.Map<List<KullaniciDto>>(list);
    }
}

// ===== Gorev Üzerine Alma =====
public class GorevUzerineAlRequest : IRequest<bool> { public int GorevId { get; set; } public int KullaniciId { get; set; } }
public class GorevUzerineAlHandler : IRequestHandler<GorevUzerineAlRequest, bool>
{
    private readonly IUnitOfWork _uow;
    public GorevUzerineAlHandler(IUnitOfWork uow) => _uow = uow;
    public async Task<bool> Handle(GorevUzerineAlRequest r, CancellationToken ct)
    {
        var g = await _uow.GorevReadRepository.GetByIdAsync(r.GorevId) ?? throw new NotFoundException("Görev", r.GorevId);
        g.UzerineAlanKullaniciId = r.KullaniciId;
        g.Durum = GorevDurumu.DevamEdiyor;
        _uow.GorevWriteRepository.Update(g);
        await _uow.GorevAtamaLogWriteRepository.AddAsync(new GorevAtamaLog
        {
            GorevId = r.GorevId,
            AtamaTarihi = DateTime.UtcNow,
            AtamaTipi = AtamaTipi.Kisi,
            AtananKullaniciId = r.KullaniciId,
            AtayanKullaniciId = r.KullaniciId,
            Aciklama = "Görev üzerine alındı"
        });
        await _uow.SaveChangesAsync();
        return true;
    }
}
