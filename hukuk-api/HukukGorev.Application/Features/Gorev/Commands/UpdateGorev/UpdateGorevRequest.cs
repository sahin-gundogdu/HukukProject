using HukukGorev.Domain.Enums;
using MediatR;

namespace HukukGorev.Application.Features.Gorev.Commands.UpdateGorev;

public class UpdateGorevRequest : IRequest<UpdateGorevResponse>
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public OncelikSeviyesi Oncelik { get; set; }
    public GorevDurumu Durum { get; set; }
    public AtamaTipi AtamaTipi { get; set; }
    public DateTime? BitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }
    public int? GorevTipiId { get; set; }
    public int? AtananKullaniciId { get; set; }
    public int? AtananGrupId { get; set; }
    public List<int>? EtiketIds { get; set; }
}
