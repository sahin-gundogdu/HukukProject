using AutoMapper;
using HukukGorev.Application.DTOs;
using HukukGorev.Application.Exceptions;
using HukukGorev.Application.UnitOfWork;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace HukukGorev.Application.Features.Gorev.Queries.GetGorevById;

public class GetGorevByIdRequest : IRequest<GorevDetayDto>
{
    public int Id { get; set; }
}

public class GetGorevByIdHandler : IRequestHandler<GetGorevByIdRequest, GorevDetayDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetGorevByIdHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<GorevDetayDto> Handle(GetGorevByIdRequest request, CancellationToken cancellationToken)
    {
        var gorev = await _unitOfWork.GorevReadRepository.GetAllQueryable()
            .Include(g => g.GorevTipi)
            .Include(g => g.AtananKullanici)
            .Include(g => g.AtananGrup)
            .Include(g => g.OlusturanKullanici)
            .Include(g => g.UzerineAlanKullanici)
            .Include(g => g.AltGorevler).ThenInclude(a => a.AtananKullanici)
            .Include(g => g.Yorumlar).ThenInclude(y => y.Kullanici)
            .Include(g => g.Dosyalar)
            .Include(g => g.GorevEtiketler).ThenInclude(ge => ge.Etiket)
            .Include(g => g.AtamaLoglari).ThenInclude(al => al.AtananKullanici)
            .Include(g => g.AtamaLoglari).ThenInclude(al => al.AtananGrup)
            .Include(g => g.AtamaLoglari).ThenInclude(al => al.AtayanKullanici)
            .Where(g => g.Aktif)
            .FirstOrDefaultAsync(g => g.Id == request.Id, cancellationToken);

        if (gorev == null)
            throw new NotFoundException("Görev", request.Id);

        return _mapper.Map<GorevDetayDto>(gorev);
    }
}
