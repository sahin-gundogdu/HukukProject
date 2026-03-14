import { OncelikSeviyesi, GorevDurumu, AtamaTipi, BildirimTipi, KullaniciRolu } from '@/types';

export const ONCELIK_LABELS: Record<OncelikSeviyesi, string> = {
    [OncelikSeviyesi.Dusuk]: 'Düşük',
    [OncelikSeviyesi.Orta]: 'Orta',
    [OncelikSeviyesi.Yuksek]: 'Yüksek',
    [OncelikSeviyesi.Kritik]: 'Kritik',
};

export const ONCELIK_SEVERITY: Record<OncelikSeviyesi, string> = {
    [OncelikSeviyesi.Dusuk]: 'info',
    [OncelikSeviyesi.Orta]: 'warning',
    [OncelikSeviyesi.Yuksek]: 'danger',
    [OncelikSeviyesi.Kritik]: 'danger',
};

export const DURUM_LABELS: Record<GorevDurumu, string> = {
    [GorevDurumu.YeniAtandi]: 'Yeni Atandı',
    [GorevDurumu.DevamEdiyor]: 'Devam Ediyor',
    [GorevDurumu.Beklemede]: 'Beklemede',
    [GorevDurumu.Tamamlandi]: 'Tamamlandı',
    [GorevDurumu.Iptal]: 'İptal',
};

export const DURUM_SEVERITY: Record<GorevDurumu, string> = {
    [GorevDurumu.YeniAtandi]: 'info',
    [GorevDurumu.DevamEdiyor]: 'warning',
    [GorevDurumu.Beklemede]: 'secondary',
    [GorevDurumu.Tamamlandi]: 'success',
    [GorevDurumu.Iptal]: 'danger',
};

export const ROL_LABELS: Record<KullaniciRolu, string> = {
    [KullaniciRolu.Kullanici]: 'Kullanıcı',
    [KullaniciRolu.Admin]: 'Admin',
};

export const ROL_SEVERITY: Record<KullaniciRolu, string> = {
    [KullaniciRolu.Kullanici]: 'info',
    [KullaniciRolu.Admin]: 'success',
};

export const BILDIRIM_ICONS: Record<BildirimTipi, string> = {
    [BildirimTipi.Atama]: 'pi pi-user-plus',
    [BildirimTipi.Guncelleme]: 'pi pi-pencil',
    [BildirimTipi.Hatirlatma]: 'pi pi-bell',
    [BildirimTipi.Kapanis]: 'pi pi-check-circle',
};

export function formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
}

export function formatDateTime(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

export function fileSizeLabel(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function gecenGunSayisi(dateStr: string): number {
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(bitisTarihi?: string, durum?: GorevDurumu): boolean {
    if (!bitisTarihi) return false;
    if (durum === GorevDurumu.Tamamlandi || durum === GorevDurumu.Iptal) return false;
    return new Date(bitisTarihi) < new Date();
}
