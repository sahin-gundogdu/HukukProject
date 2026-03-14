using HukukGorev.Application.Repositories.AltGorev;
using HukukGorev.Application.Repositories.Ayar;
using HukukGorev.Application.Repositories.Bildirim;
using HukukGorev.Application.Repositories.Etiket;
using HukukGorev.Application.Repositories.Gorev;
using HukukGorev.Application.Repositories.GorevAtamaLog;
using HukukGorev.Application.Repositories.GorevDosya;
using HukukGorev.Application.Repositories.GorevEtiket;
using HukukGorev.Application.Repositories.GorevTipi;
using HukukGorev.Application.Repositories.GorevYorum;
using HukukGorev.Application.Repositories.Grup;
using HukukGorev.Application.Repositories.Kullanici;
using HukukGorev.Application.Repositories.KullaniciGrup;

namespace HukukGorev.Application.UnitOfWork;

public interface IUnitOfWork : IDisposable
{
    IGorevReadRepository GorevReadRepository { get; }
    IGorevWriteRepository GorevWriteRepository { get; }
    IAltGorevReadRepository AltGorevReadRepository { get; }
    IAltGorevWriteRepository AltGorevWriteRepository { get; }
    IGorevYorumReadRepository GorevYorumReadRepository { get; }
    IGorevYorumWriteRepository GorevYorumWriteRepository { get; }
    IGorevDosyaReadRepository GorevDosyaReadRepository { get; }
    IGorevDosyaWriteRepository GorevDosyaWriteRepository { get; }
    IGorevAtamaLogReadRepository GorevAtamaLogReadRepository { get; }
    IGorevAtamaLogWriteRepository GorevAtamaLogWriteRepository { get; }
    IGrupReadRepository GrupReadRepository { get; }
    IGrupWriteRepository GrupWriteRepository { get; }
    IKullaniciGrupReadRepository KullaniciGrupReadRepository { get; }
    IKullaniciGrupWriteRepository KullaniciGrupWriteRepository { get; }
    IGorevTipiReadRepository GorevTipiReadRepository { get; }
    IGorevTipiWriteRepository GorevTipiWriteRepository { get; }
    IEtiketReadRepository EtiketReadRepository { get; }
    IEtiketWriteRepository EtiketWriteRepository { get; }
    IGorevEtiketReadRepository GorevEtiketReadRepository { get; }
    IGorevEtiketWriteRepository GorevEtiketWriteRepository { get; }
    IBildirimReadRepository BildirimReadRepository { get; }
    IBildirimWriteRepository BildirimWriteRepository { get; }
    IAyarReadRepository AyarReadRepository { get; }
    IAyarWriteRepository AyarWriteRepository { get; }
    IKullaniciReadRepository KullaniciReadRepository { get; }
    IKullaniciWriteRepository KullaniciWriteRepository { get; }

    Task<int> SaveChangesAsync();
}
