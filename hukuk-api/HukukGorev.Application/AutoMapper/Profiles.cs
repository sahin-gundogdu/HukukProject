using AutoMapper;
using HukukGorev.Application.DTOs;
using HukukGorev.Domain.Entities;

namespace HukukGorev.Application.AutoMapper;

public class Profiles : Profile
{
    public Profiles()
    {
        // Gorev
        CreateMap<Gorev, GorevDto>()
            .ForMember(d => d.GorevTipiAdi, opt => opt.MapFrom(s => s.GorevTipi != null ? s.GorevTipi.Ad : null))
            .ForMember(d => d.AtananKullaniciAdi, opt => opt.MapFrom(s => s.AtananKullanici != null ? s.AtananKullanici.Ad + " " + s.AtananKullanici.Soyad : null))
            .ForMember(d => d.AtananGrupAdi, opt => opt.MapFrom(s => s.AtananGrup != null ? s.AtananGrup.Ad : null))
            .ForMember(d => d.OlusturanKullaniciAdi, opt => opt.MapFrom(s => s.OlusturanKullanici.Ad + " " + s.OlusturanKullanici.Soyad))
            .ForMember(d => d.UzerineAlanKullaniciAdi, opt => opt.MapFrom(s => s.UzerineAlanKullanici != null ? s.UzerineAlanKullanici.Ad + " " + s.UzerineAlanKullanici.Soyad : null))
            .ForMember(d => d.AltGorevSayisi, opt => opt.MapFrom(s => s.AltGorevler.Count))
            .ForMember(d => d.YorumSayisi, opt => opt.MapFrom(s => s.Yorumlar.Count))
            .ForMember(d => d.DosyaSayisi, opt => opt.MapFrom(s => s.Dosyalar.Count))
            .ForMember(d => d.Etiketler, opt => opt.MapFrom(s => s.GorevEtiketler.Select(ge => ge.Etiket)));

        CreateMap<Gorev, GorevDetayDto>()
            .IncludeBase<Gorev, GorevDto>()
            .ForMember(d => d.AltGorevler, opt => opt.MapFrom(s => s.AltGorevler))
            .ForMember(d => d.Yorumlar, opt => opt.MapFrom(s => s.Yorumlar))
            .ForMember(d => d.Dosyalar, opt => opt.MapFrom(s => s.Dosyalar))
            .ForMember(d => d.AtamaLoglari, opt => opt.MapFrom(s => s.AtamaLoglari));

        // AltGorev
        CreateMap<AltGorev, AltGorevDto>()
            .ForMember(d => d.AtananKullaniciAdi, opt => opt.MapFrom(s => s.AtananKullanici != null ? s.AtananKullanici.Ad + " " + s.AtananKullanici.Soyad : null))
            .ForMember(d => d.AtananGrupAdi, opt => opt.MapFrom(s => s.AtananGrup != null ? s.AtananGrup.Ad : null));

        // GorevYorum
        CreateMap<GorevYorum, GorevYorumDto>()
            .ForMember(d => d.KullaniciAdi, opt => opt.MapFrom(s => s.Kullanici.Ad + " " + s.Kullanici.Soyad));

        // GorevDosya
        CreateMap<GorevDosya, GorevDosyaDto>();

        // GorevAtamaLog
        CreateMap<GorevAtamaLog, GorevAtamaLogDto>()
            .ForMember(d => d.AtananKullaniciAdi, opt => opt.MapFrom(s => s.AtananKullanici != null ? s.AtananKullanici.Ad + " " + s.AtananKullanici.Soyad : null))
            .ForMember(d => d.AtananGrupAdi, opt => opt.MapFrom(s => s.AtananGrup != null ? s.AtananGrup.Ad : null))
            .ForMember(d => d.AtayanKullaniciAdi, opt => opt.MapFrom(s => s.AtayanKullanici.Ad + " " + s.AtayanKullanici.Soyad));

        // Grup
        CreateMap<Grup, GrupDto>()
            .ForMember(d => d.UyeSayisi, opt => opt.MapFrom(s => s.KullaniciGruplari.Count));

        // Kullanici
        CreateMap<Kullanici, KullaniciDto>()
            .ForMember(d => d.YoneticiAdSoyad, opt => opt.MapFrom(s => s.Yonetici != null ? s.Yonetici.Ad + " " + s.Yonetici.Soyad : null))
            .ForMember(d => d.Gruplar, opt => opt.MapFrom(s => s.KullaniciGruplari.Select(kg => kg.Grup.Ad)));

        // GorevTipi
        CreateMap<GorevTipi, GorevTipiDto>();

        // Etiket
        CreateMap<Etiket, EtiketDto>();

        // Bildirim
        CreateMap<Bildirim, BildirimDto>();

        // Ayar
        CreateMap<Ayar, AyarDto>();
    }
}
