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
using HukukGorev.Application.UnitOfWork;
using HukukGorev.Persistance.Contexts;
using HukukGorev.Persistance.Repositories;

namespace HukukGorev.Persistance.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly HukukGorevDbContext _context;

    public UnitOfWork(HukukGorevDbContext context) => _context = context;

    private IGorevReadRepository? _gorevRead;
    private IGorevWriteRepository? _gorevWrite;
    private IAltGorevReadRepository? _altGorevRead;
    private IAltGorevWriteRepository? _altGorevWrite;
    private IGorevYorumReadRepository? _gorevYorumRead;
    private IGorevYorumWriteRepository? _gorevYorumWrite;
    private IGorevDosyaReadRepository? _gorevDosyaRead;
    private IGorevDosyaWriteRepository? _gorevDosyaWrite;
    private IGorevAtamaLogReadRepository? _gorevAtamaLogRead;
    private IGorevAtamaLogWriteRepository? _gorevAtamaLogWrite;
    private IGrupReadRepository? _grupRead;
    private IGrupWriteRepository? _grupWrite;
    private IKullaniciGrupReadRepository? _kullaniciGrupRead;
    private IKullaniciGrupWriteRepository? _kullaniciGrupWrite;
    private IGorevTipiReadRepository? _gorevTipiRead;
    private IGorevTipiWriteRepository? _gorevTipiWrite;
    private IEtiketReadRepository? _etiketRead;
    private IEtiketWriteRepository? _etiketWrite;
    private IGorevEtiketReadRepository? _gorevEtiketRead;
    private IGorevEtiketWriteRepository? _gorevEtiketWrite;
    private IBildirimReadRepository? _bildirimRead;
    private IBildirimWriteRepository? _bildirimWrite;
    private IAyarReadRepository? _ayarRead;
    private IAyarWriteRepository? _ayarWrite;
    private IKullaniciReadRepository? _kullaniciRead;
    private IKullaniciWriteRepository? _kullaniciWrite;

    public IGorevReadRepository GorevReadRepository => _gorevRead ??= new GorevReadRepository(_context);
    public IGorevWriteRepository GorevWriteRepository => _gorevWrite ??= new GorevWriteRepository(_context);
    public IAltGorevReadRepository AltGorevReadRepository => _altGorevRead ??= new AltGorevReadRepository(_context);
    public IAltGorevWriteRepository AltGorevWriteRepository => _altGorevWrite ??= new AltGorevWriteRepository(_context);
    public IGorevYorumReadRepository GorevYorumReadRepository => _gorevYorumRead ??= new GorevYorumReadRepository(_context);
    public IGorevYorumWriteRepository GorevYorumWriteRepository => _gorevYorumWrite ??= new GorevYorumWriteRepository(_context);
    public IGorevDosyaReadRepository GorevDosyaReadRepository => _gorevDosyaRead ??= new GorevDosyaReadRepository(_context);
    public IGorevDosyaWriteRepository GorevDosyaWriteRepository => _gorevDosyaWrite ??= new GorevDosyaWriteRepository(_context);
    public IGorevAtamaLogReadRepository GorevAtamaLogReadRepository => _gorevAtamaLogRead ??= new GorevAtamaLogReadRepository(_context);
    public IGorevAtamaLogWriteRepository GorevAtamaLogWriteRepository => _gorevAtamaLogWrite ??= new GorevAtamaLogWriteRepository(_context);
    public IGrupReadRepository GrupReadRepository => _grupRead ??= new GrupReadRepository(_context);
    public IGrupWriteRepository GrupWriteRepository => _grupWrite ??= new GrupWriteRepository(_context);
    public IKullaniciGrupReadRepository KullaniciGrupReadRepository => _kullaniciGrupRead ??= new KullaniciGrupReadRepository(_context);
    public IKullaniciGrupWriteRepository KullaniciGrupWriteRepository => _kullaniciGrupWrite ??= new KullaniciGrupWriteRepository(_context);
    public IGorevTipiReadRepository GorevTipiReadRepository => _gorevTipiRead ??= new GorevTipiReadRepository(_context);
    public IGorevTipiWriteRepository GorevTipiWriteRepository => _gorevTipiWrite ??= new GorevTipiWriteRepository(_context);
    public IEtiketReadRepository EtiketReadRepository => _etiketRead ??= new EtiketReadRepository(_context);
    public IEtiketWriteRepository EtiketWriteRepository => _etiketWrite ??= new EtiketWriteRepository(_context);
    public IGorevEtiketReadRepository GorevEtiketReadRepository => _gorevEtiketRead ??= new GorevEtiketReadRepository(_context);
    public IGorevEtiketWriteRepository GorevEtiketWriteRepository => _gorevEtiketWrite ??= new GorevEtiketWriteRepository(_context);
    public IBildirimReadRepository BildirimReadRepository => _bildirimRead ??= new BildirimReadRepository(_context);
    public IBildirimWriteRepository BildirimWriteRepository => _bildirimWrite ??= new BildirimWriteRepository(_context);
    public IAyarReadRepository AyarReadRepository => _ayarRead ??= new AyarReadRepository(_context);
    public IAyarWriteRepository AyarWriteRepository => _ayarWrite ??= new AyarWriteRepository(_context);
    public IKullaniciReadRepository KullaniciReadRepository => _kullaniciRead ??= new KullaniciReadRepository(_context);
    public IKullaniciWriteRepository KullaniciWriteRepository => _kullaniciWrite ??= new KullaniciWriteRepository(_context);

    public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

    public void Dispose() => _context.Dispose();
}
