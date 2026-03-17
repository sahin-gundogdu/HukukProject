using HukukGorev.Domain.Enums;

namespace HukukGorev.Application.DTOs;

// ===== Gorev DTOs =====
public class GorevDto
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public OncelikSeviyesi Oncelik { get; set; }
    public GorevDurumu Durum { get; set; }
    public AtamaTipi AtamaTipi { get; set; }
    public DateTime? BaslangicTarihi { get; set; }
    public DateTime? BitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }
    public int? GorevTipiId { get; set; }
    public string? GorevTipiAdi { get; set; }
    public int? AtananKullaniciId { get; set; }
    public string? AtananKullaniciAdi { get; set; }
    public int? AtananGrupId { get; set; }
    public string? AtananGrupAdi { get; set; }
    public int OlusturanKullaniciId { get; set; }
    public string? OlusturanKullaniciAdi { get; set; }
    public int? UzerineAlanKullaniciId { get; set; }
    public string? UzerineAlanKullaniciAdi { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int AltGorevSayisi { get; set; }
    public int YorumSayisi { get; set; }
    public int DosyaSayisi { get; set; }
    public List<EtiketDto>? Etiketler { get; set; }
    public bool Aktif { get; set; }
}

public class GorevDetayDto : GorevDto
{
    public List<AltGorevDto>? AltGorevler { get; set; }
    public List<GorevYorumDto>? Yorumlar { get; set; }
    public List<GorevDosyaDto>? Dosyalar { get; set; }
    public List<GorevAtamaLogDto>? AtamaLoglari { get; set; }
}

// ===== AltGorev DTOs =====
public class AltGorevDto
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string? Aciklama { get; set; }
    public GorevDurumu Durum { get; set; }
    public AtamaTipi AtamaTipi { get; set; }
    public DateTime? BaslangicTarihi { get; set; }
    public DateTime? TahminibitisTarihi { get; set; }
    public DateTime? TamamlanmaTarihi { get; set; }
    public int GorevId { get; set; }
    public int? AtananKullaniciId { get; set; }
    public string? AtananKullaniciAdi { get; set; }
    public int? AtananGrupId { get; set; }
    public string? AtananGrupAdi { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool Aktif { get; set; }
}

// ===== GorevYorum DTOs =====
public class GorevYorumDto
{
    public int Id { get; set; }
    public string Icerik { get; set; } = null!;
    public int GorevId { get; set; }
    public int KullaniciId { get; set; }
    public string? KullaniciAdi { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ===== GorevDosya DTOs =====
public class GorevDosyaDto
{
    public int Id { get; set; }
    public string DosyaAdi { get; set; } = null!;
    public string DosyaTipi { get; set; } = null!;
    public long DosyaBoyutu { get; set; }
    public int? GorevId { get; set; }
    public int? AltGorevId { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ===== GorevAtamaLog DTOs =====
public class GorevAtamaLogDto
{
    public int Id { get; set; }
    public DateTime AtamaTarihi { get; set; }
    public string? Aciklama { get; set; }
    public AtamaTipi AtamaTipi { get; set; }
    public int? GorevId { get; set; }
    public int? AltGorevId { get; set; }
    public string? AtananKullaniciAdi { get; set; }
    public string? AtananGrupAdi { get; set; }
    public string? AtayanKullaniciAdi { get; set; }
}

// ===== Grup DTOs =====
public class GrupDto
{
    public int Id { get; set; }
    public string Ad { get; set; } = null!;
    public string? Aciklama { get; set; }
    public int UyeSayisi { get; set; }
    public bool Aktif { get; set; }
}

// ===== Kullanici DTOs =====
public class KullaniciDto
{
    public int Id { get; set; }
    public string Ad { get; set; } = null!;
    public string Soyad { get; set; } = null!;
    public string Email { get; set; } = null!;
    public KullaniciRolu Rol { get; set; }
    public bool Aktif { get; set; }
    public int? YoneticiId { get; set; }
    public string? YoneticiAdSoyad { get; set; }
    public List<string>? Gruplar { get; set; }
}

// ===== GorevTipi DTOs =====
public class GorevTipiDto
{
    public int Id { get; set; }
    public string Ad { get; set; } = null!;
    public string? Aciklama { get; set; }
    public bool Aktif { get; set; }
}

// ===== Etiket DTOs =====
public class EtiketDto
{
    public int Id { get; set; }
    public string Ad { get; set; } = null!;
    public string? Renk { get; set; }
    public bool Aktif { get; set; }
}

// ===== Bildirim DTOs =====
public class BildirimDto
{
    public int Id { get; set; }
    public string Baslik { get; set; } = null!;
    public string Mesaj { get; set; } = null!;
    public BildirimTipi Tip { get; set; }
    public bool Okundu { get; set; }
    public int? GorevId { get; set; }
    public DateTime CreatedAt { get; set; }
}

// ===== Ayar DTOs =====
public class AyarDto
{
    public int Id { get; set; }
    public string Anahtar { get; set; } = null!;
    public string Deger { get; set; } = null!;
    public string? Aciklama { get; set; }
}

// ===== Dashboard DTOs =====
public class DashboardDto
{
    public int ToplamGorev { get; set; }
    public int AcikGorev { get; set; }
    public int DevamEdenGorev { get; set; }
    public int TamamlananGorev { get; set; }
    public int GecikenGorev { get; set; }
    public double OrtalamaKapanmaSuresiGun { get; set; }
    public List<GrupGorevIstatistikDto>? GrupIstatistikleri { get; set; }
    public List<KisiGorevIstatistikDto>? KisiIstatistikleri { get; set; }
    public List<OncelikGorevIstatistikDto>? OncelikIstatistikleri { get; set; }
    public List<GunlukGorevIstatistikDto>? GunlukGorevIstatistikleri { get; set; }
    public List<GorevTipiIstatistikDto>? GorevTipiIstatistikleri { get; set; }
}

public class OncelikGorevIstatistikDto
{
    public string OncelikAdi { get; set; } = null!;
    public int Adet { get; set; }
}

public class GunlukGorevIstatistikDto
{
    public string Tarih { get; set; } = null!;
    public int Olusturulan { get; set; }
    public int Tamamlanan { get; set; }
}

public class GorevTipiIstatistikDto
{
    public string TipAdi { get; set; } = null!;
    public int Adet { get; set; }
}

public class GrupGorevIstatistikDto
{
    public string GrupAdi { get; set; } = null!;
    public int ToplamGorev { get; set; }
    public int TamamlananGorev { get; set; }
    public int DevamEdenGorev { get; set; }
}

public class KisiGorevIstatistikDto
{
    public string KullaniciAdi { get; set; } = null!;
    public int ToplamGorev { get; set; }
    public int TamamlananGorev { get; set; }
    public int DevamEdenGorev { get; set; }
}

// ===== Auth DTOs =====
public class LoginDto
{
    public string Email { get; set; } = null!;
    public string Sifre { get; set; } = null!;
}

public class LoginResponseDto
{
    public string Token { get; set; } = null!;
    public KullaniciDto Kullanici { get; set; } = null!;
}

public class TokenDto
{
    public string AccessToken { get; set; } = null!;
    public DateTime Expiration { get; set; }
}
