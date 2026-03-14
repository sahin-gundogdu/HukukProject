using HukukGorev.Domain.Enums;
using MediatR;

namespace HukukGorev.Application.Features.Gorev.Commands.CreateGorev;

public class CreateGorevRequest : IRequest<CreateGorevResponse>
{
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public OncelikSeviyesi Oncelik { get; set; } = OncelikSeviyesi.Orta;
    public AtamaTipi AtamaTipi { get; set; } = AtamaTipi.Kisi;
    public DateTime? BitisTarihi { get; set; }
    public int? GorevTipiId { get; set; }
    public int? AtananKullaniciId { get; set; }
    public int? AtananGrupId { get; set; }
    public List<int>? EtiketIds { get; set; }
}
