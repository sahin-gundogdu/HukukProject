// ===== Enums =====
export enum OncelikSeviyesi { Dusuk = 0, Orta = 1, Yuksek = 2, Kritik = 3 }
export enum GorevDurumu { YeniAtandi = 0, DevamEdiyor = 1, Beklemede = 2, Tamamlandi = 3, Iptal = 4 }
export enum AtamaTipi { Kisi = 0, Grup = 1 }
export enum BildirimTipi { Atama = 0, Guncelleme = 1, Hatirlatma = 2, Kapanis = 3 }
export enum KullaniciRolu { Kullanici = 0, Admin = 1 }

// ===== Kullanıcı =====
export interface KullaniciDto {
    id: number;
    ad: string;
    soyad: string;
    email: string;
    rol: KullaniciRolu;
    aktif: boolean;
    yoneticiId?: number;
    yoneticiAdSoyad?: string;
    gruplar: string[];
}

// ===== Grup =====
export interface GrupDto {
    id: number;
    ad: string;
    aciklama?: string;
    uyeSayisi: number;
    aktif: boolean;
}

// ===== GorevTipi =====
export interface GorevTipiDto {
    id: number;
    ad: string;
    aciklama?: string;
}

// ===== Etiket =====
export interface EtiketDto {
    id: number;
    ad: string;
    renk?: string;
}

// ===== Gorev =====
export interface GorevDto {
    id: number;
    baslik: string;
    aciklama?: string;
    oncelik: OncelikSeviyesi;
    durum: GorevDurumu;
    atamaTipi: AtamaTipi;
    baslangicTarihi?: string;
    bitisTarihi?: string;
    tamamlanmaTarihi?: string;
    gorevTipiId?: number;
    gorevTipiAdi?: string;
    atananKullaniciId?: number;
    atananKullaniciAdi?: string;
    atananGrupId?: number;
    atananGrupAdi?: string;
    olusturanKullaniciAdi?: string;
    uzerineAlanKullaniciAdi?: string;
    altGorevSayisi: number;
    yorumSayisi: number;
    dosyaSayisi: number;
    etiketler: string[];
    createdAt: string;
}

// ===== GorevDetay =====
export interface GorevDetayDto extends GorevDto {
    altGorevler: AltGorevDto[];
    yorumlar: GorevYorumDto[];
    dosyalar: GorevDosyaDto[];
    atamaLoglari: GorevAtamaLogDto[];
}

// ===== AltGorev =====
export interface AltGorevDto {
    id: number;
    baslik: string;
    aciklama?: string;
    durum: GorevDurumu;
    atamaTipi: AtamaTipi;
    baslangicTarihi?: string;
    tahminibitisTarihi?: string;
    tamamlanmaTarihi?: string;
    atananKullaniciId?: number;
    atananKullaniciAdi?: string;
    atananGrupId?: number;
    atananGrupAdi?: string;
    gorevId: number;
    createdAt: string;
}

// ===== GorevYorum =====
export interface GorevYorumDto {
    id: number;
    icerik: string;
    kullaniciAdi: string;
    kullaniciId: number;
    gorevId: number;
    createdAt: string;
}

// ===== GorevDosya =====
export interface GorevDosyaDto {
    id: number;
    dosyaAdi: string;
    dosyaTipi: string;
    dosyaBoyutu: number;
    gorevId: number;
    altGorevId?: number;
    createdAt: string;
}

// ===== GorevAtamaLog =====
export interface GorevAtamaLogDto {
    id: number;
    atamaTarihi: string;
    atamaTipi: AtamaTipi;
    atananKullaniciAdi?: string;
    atananGrupAdi?: string;
    atayanKullaniciAdi: string;
    aciklama?: string;
}

// ===== Bildirim =====
export interface BildirimDto {
    id: number;
    baslik: string;
    mesaj: string;
    tip: BildirimTipi;
    okundu: boolean;
    gorevId?: number;
    createdAt: string;
}

// ===== Ayar =====
export interface AyarDto {
    id: number;
    anahtar: string;
    deger: string;
    aciklama?: string;
}

// ===== Dashboard =====
export interface DashboardDto {
    toplamGorev: number;
    acikGorev: number;
    devamEdenGorev: number;
    tamamlananGorev: number;
    gecikenGorev: number;
    ortalamaKapanmaSuresiGun: number;
    grupIstatistikleri: GrupGorevIstatistikDto[];
    kisiIstatistikleri: KisiGorevIstatistikDto[];
    oncelikIstatistikleri: OncelikGorevIstatistikDto[];
    gunlukGorevIstatistikleri: GunlukGorevIstatistikDto[];
    gorevTipiIstatistikleri: GorevTipiIstatistikDto[];
}

export interface OncelikGorevIstatistikDto {
    oncelikAdi: string;
    adet: number;
}

export interface GunlukGorevIstatistikDto {
    tarih: string;
    olusturulan: number;
    tamamlanan: number;
}

export interface GorevTipiIstatistikDto {
    tipAdi: string;
    adet: number;
}

export interface GrupGorevIstatistikDto {
    grupAdi: string;
    toplamGorev: number;
    tamamlananGorev: number;
    devamEdenGorev: number;
}

export interface KisiGorevIstatistikDto {
    kullaniciAdi: string;
    toplamGorev: number;
    tamamlananGorev: number;
    devamEdenGorev: number;
}

// ===== Auth =====
export interface LoginRequest {
    email: string;
    sifre: string;
}

export interface LoginResponseDto {
    token: string;
    kullanici: KullaniciDto;
}

// ===== API Response =====
export interface ApiError {
    basarili: boolean;
    hataKodu?: string;
    mesaj: string;
    statusCode: number;
}

// ===== Command Responses =====
export interface CommandResponse {
    id?: number;
    basarili: boolean;
    mesaj?: string;
}

// ===== Create/Update Gorev =====
export interface CreateGorevRequest {
    baslik: string;
    aciklama?: string;
    oncelik: OncelikSeviyesi;
    atamaTipi: AtamaTipi;
    baslangicTarihi?: string;
    bitisTarihi?: string;
    gorevTipiId?: number;
    atananKullaniciId?: number;
    atananGrupId?: number;
    etiketIds?: number[];
}

export interface UpdateGorevRequest extends CreateGorevRequest {
    id: number;
    durum: GorevDurumu;
    baslangicTarihi?: string;
    tamamlanmaTarihi?: string;
}

// ===== Create/Update AltGorev =====
export interface CreateAltGorevRequest {
    baslik: string;
    aciklama?: string;
    baslangicTarihi?: string;
    tahminibitisTarihi?: string;
    gorevId: number;
    atamaTipi: AtamaTipi;
    atananKullaniciId?: number;
    atananGrupId?: number;
}

export interface UpdateAltGorevRequest {
    id: number;
    gorevId: number;
    baslik: string;
    aciklama?: string;
    baslangicTarihi?: string;
    tahminibitisTarihi?: string;
    durum: GorevDurumu;
    tamamlanmaTarihi?: string;
    atamaTipi: AtamaTipi;
    atananKullaniciId?: number;
    atananGrupId?: number;
}
